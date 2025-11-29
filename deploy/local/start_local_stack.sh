#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/AntFlow_backend"
FRONTEND_DIR="${PROJECT_ROOT}/AntFlow_frontend"

BACKEND_PORT="${BACKEND_PORT:-8080}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
FRONTEND_HOST="${FRONTEND_HOST:-0.0.0.0}"
SPRING_PROFILE="${SPRING_PROFILE:-dev}"
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"

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
  log_info "Backend logs -> ${backend_log} (mirrored to console)"
  (
    cd "${BACKEND_DIR}"
    mvn spring-boot:run -Dspring-boot.run.profiles="${SPRING_PROFILE}" \
      2>&1 | tee -a "${backend_log}"
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

check_local_mysql() {
  log_info "Ensuring local MySQL is running at ${MYSQL_HOST}:${MYSQL_PORT}..."

  if command -v mysqladmin >/dev/null 2>&1; then
    if mysqladmin ping -h "${MYSQL_HOST}" -P "${MYSQL_PORT}" --silent; then
      log_info "MySQL responded to mysqladmin ping."
      return
    fi
    log_error "mysqladmin ping failed for ${MYSQL_HOST}:${MYSQL_PORT}. Start MySQL before running the stack."
    exit 1
  fi

  if command -v nc >/dev/null 2>&1; then
    if nc -z "${MYSQL_HOST}" "${MYSQL_PORT}" >/dev/null 2>&1; then
      log_info "MySQL port is open."
      return
    fi
    log_error "Could not reach MySQL on ${MYSQL_HOST}:${MYSQL_PORT}. Start MySQL before running the stack."
    exit 1
  fi

  log_warn "mysqladmin/nc not available; skipping automatic MySQL check. Make sure MySQL is running and accessible."
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

  log_info "Backend and frontend processes stopped. Local MySQL was untouched."
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

  check_local_mysql

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
