#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/1_backend_springboot"
FRONTEND_DIR="${PROJECT_ROOT}/0_frontend_react"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"
MYSQL_CONTAINER_NAME="java-template-mysql"

BACKEND_PORT="${BACKEND_PORT:-8080}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
FRONTEND_HOST="${FRONTEND_HOST:-0.0.0.0}"
SPRING_PROFILE="${SPRING_PROFILE:-dev}"

BACKEND_PID=""
FRONTEND_PID=""
CLEANED_UP=0
LOG_DIR="${SCRIPT_DIR}/logs"

log_info() { echo "[INFO] $*"; }
log_warn() { echo "[WARN] $*" >&2; }
log_error() { echo "[ERROR] $*" >&2; }

ensure_directory() {
  if [[ ! -d "$1" ]]; then
    log_error "Directory not found: $1"
    exit 1
  fi
}

ensure_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_error "Required command '$1' not found in PATH."
    exit 1
  fi
}

check_and_start_docker() {
  log_info "Checking Docker availability..."
  ensure_command docker

  if docker info >/dev/null 2>&1; then
    log_info "Docker daemon already running."
    return
  fi

  log_warn "Docker daemon is not running. Attempting to start it..."
  case "$(uname -s)" in
    Darwin*)
      if [[ -d "/Applications/Docker.app" ]]; then
        open -a Docker
      else
        log_error "Docker Desktop not found at /Applications/Docker.app"
        exit 1
      fi
      ;;
    Linux*)
      if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl start docker || true
      elif command -v service >/dev/null 2>&1; then
        sudo service docker start || true
      else
        log_error "Unable to determine how to start Docker on this Linux host."
        exit 1
      fi
      ;;
    *)
      log_error "Unsupported OS: $(uname -s)"
      exit 1
      ;;
  esac

  local wait_secs=0
  while ! docker info >/dev/null 2>&1; do
    if (( wait_secs >= 60 )); then
      log_error "Docker daemon did not start within 60 seconds."
      exit 1
    fi
    sleep 2
    wait_secs=$((wait_secs + 2))
  done
  log_info "Docker daemon is up."
}

select_docker_compose_cmd() {
  if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE=(docker compose)
  elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE=(docker-compose)
  else
    log_error "docker compose plugin or docker-compose binary is required."
    exit 1
  fi
}

ensure_mysql_dirs() {
  mkdir -p "${SCRIPT_DIR}/data/mysql/data" \
           "${SCRIPT_DIR}/data/mysql/conf.d" \
           "${SCRIPT_DIR}/data/mysql/init"
}

wait_for_mysql() {
  local retries=0
  local max_retries=60
  while true; do
    local status
    status=$(docker inspect -f '{{.State.Health.Status}}' "${MYSQL_CONTAINER_NAME}" 2>/dev/null || echo "starting")
    if [[ "${status}" == "healthy" ]]; then
      log_info "MySQL container is healthy."
      break
    fi
    if (( retries >= max_retries )); then
      log_error "MySQL container failed to become healthy."
      docker logs "${MYSQL_CONTAINER_NAME}" || true
      exit 1
    fi
    sleep 2
    retries=$((retries + 1))
  done
}

start_mysql_container() {
  ensure_mysql_dirs
  select_docker_compose_cmd
  if [[ ! -f "${COMPOSE_FILE}" ]]; then
    log_error "docker-compose.yml not found at ${COMPOSE_FILE}"
    exit 1
  fi

  log_info "Starting MySQL container via docker compose..."
  "${DOCKER_COMPOSE[@]}" -f "${COMPOSE_FILE}" up -d mysql
  wait_for_mysql
}

kill_by_port() {
  local port=$1
  local pattern=${2:-}
  local pids
  pids=$(lsof -ti:"${port}" 2>/dev/null || true)
  if [[ -z "${pids}" ]]; then
    log_info "No process currently listens on port ${port}."
    return
  fi

  local targets=()
  for pid in ${pids}; do
    if ! kill -0 "${pid}" 2>/dev/null; then
      continue
    fi
    if [[ -n "${pattern}" ]]; then
      local cmd
      cmd=$(ps -p "${pid}" -o command= 2>/dev/null || true)
      if [[ -z "${cmd}" || ! ${cmd} =~ ${pattern} ]]; then
        log_warn "Skip PID ${pid} on port ${port} (cmd: ${cmd:-unknown}) — does not match pattern '${pattern}'."
        continue
      fi
    fi
    targets+=("${pid}")
  done

  if [[ ${#targets[@]} -eq 0 ]]; then
    log_info "No matching processes need cleanup on port ${port}."
    return
  fi

  log_info "Terminating processes on port ${port}: ${targets[*]}"
  printf '%s\n' "${targets[@]}" | xargs kill -TERM >/dev/null 2>&1 || true
  sleep 2
  local remaining=()
  for pid in "${targets[@]}"; do
    if kill -0 "${pid}" 2>/dev/null; then
      remaining+=("${pid}")
    fi
  done
  if [[ ${#remaining[@]} -gt 0 ]]; then
    log_warn "Force killing remaining processes on port ${port}: ${remaining[*]}"
    printf '%s\n' "${remaining[@]}" | xargs kill -KILL >/dev/null 2>&1 || true
  fi
}

kill_existing_processes() {
  log_info "Checking for existing dev servers..."

  local backend_pattern="java|mvn|TemplateApplication|spring-boot:run"
  local frontend_pattern="node|npm|vite"

  log_info "Cleaning up backend port ${BACKEND_PORT} (pattern: ${backend_pattern})..."
  kill_by_port "${BACKEND_PORT}" "${backend_pattern}"

  log_info "Cleaning up frontend port ${FRONTEND_PORT} (pattern: ${frontend_pattern})..."
  kill_by_port "${FRONTEND_PORT}" "${frontend_pattern}"

  sleep 1
  log_info "Process cleanup complete."
}

install_frontend_dependencies() {
  if [[ ! -d "${FRONTEND_DIR}/node_modules" ]]; then
    log_info "node_modules missing in frontend. Installing dependencies..."
    (cd "${FRONTEND_DIR}" && npm install)
  fi
}

start_backend() {
  ensure_command mvn
  mkdir -p "${LOG_DIR}"
  local backend_log="${LOG_DIR}/backend.log"
  log_info "Launching Spring Boot backend on port ${BACKEND_PORT} (profile: ${SPRING_PROFILE})..."
  log_info "Backend will be available at: http://localhost:${BACKEND_PORT}"
  log_info "Swagger docs: http://localhost:${BACKEND_PORT}/swagger-ui.html"
  log_info "Backend logs -> ${backend_log}"
  (
    cd "${BACKEND_DIR}"
    exec mvn spring-boot:run -Dspring-boot.run.profiles="${SPRING_PROFILE}" \
      >>"${backend_log}" 2>&1
  ) &
  BACKEND_PID=$!
  sleep 2
}

start_frontend() {
  ensure_command npm
  install_frontend_dependencies
  mkdir -p "${LOG_DIR}"
  local frontend_log="${LOG_DIR}/frontend.log"
  log_info "Launching React/Vite frontend on port ${FRONTEND_PORT}..."
  log_info "Frontend will be available at:"
  log_info "  - Local:   http://localhost:${FRONTEND_PORT}"
  log_info "Frontend logs -> ${frontend_log}"
  (
    cd "${FRONTEND_DIR}"
    exec npm run dev -- --host "${FRONTEND_HOST}" --port "${FRONTEND_PORT}" --strictPort \
      >>"${frontend_log}" 2>&1
  ) &
  FRONTEND_PID=$!
  sleep 2
}

cleanup_processes() {
  if [[ ${CLEANED_UP} -eq 1 ]]; then
    return
  fi
  CLEANED_UP=1
  log_info "Stopping local dev processes..."

  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" 2>/dev/null || true
  fi

  if [[ -n "${FRONTEND_PID}" ]] && kill -0 "${FRONTEND_PID}" 2>/dev/null; then
    kill "${FRONTEND_PID}" 2>/dev/null || true
  fi

  log_info "Backend and frontend processes stopped. MySQL container remains running (docker compose)."
}

handle_signal() {
  local sig=$1
  log_warn "Received ${sig}. Cleaning up..."
  cleanup_processes
  exit 130
}

main() {
  ensure_directory "${BACKEND_DIR}"
  ensure_directory "${FRONTEND_DIR}"
  ensure_command lsof

  check_and_start_docker
  start_mysql_container
  kill_existing_processes
  start_backend
  start_frontend

  log_info "Backend PID: ${BACKEND_PID}"
  log_info "Frontend PID: ${FRONTEND_PID}"
  log_info "=========================================="
  log_info "✨ System is ready!"
  log_info "=========================================="
  log_info "Frontend:  http://localhost:${FRONTEND_PORT}/#/login"
  log_info "Backend:   http://localhost:${BACKEND_PORT}"
  log_info "Swagger:   http://localhost:${BACKEND_PORT}/swagger-ui.html"
  log_info "Login:     admin / Admin@123"
  log_info "=========================================="
  log_info "Press Ctrl+C to stop both servers."

  # Wait for both processes
  wait
}

trap cleanup_processes EXIT
trap 'handle_signal INT' INT
trap 'handle_signal TERM' TERM

main "$@"
