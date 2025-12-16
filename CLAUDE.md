# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AntFlow** is a full-stack Content Management Platform with Role-Based Access Control (RBAC) and content creation capabilities. It demonstrates a modern separation of concerns between a React frontend (Vite + Redux) and a Spring Boot backend with JWT authentication.

## Quick Start Commands

### Frontend Development
```bash
cd AntFlow_frontend
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build → dist/
npm run lint             # Run ESLint
npm run preview          # Preview production build
```

### Backend Development
```bash
cd AntFlow_backend
mvn clean install        # Install dependencies
mvn spring-boot:run      # Run server (http://localhost:8080, dev profile)
mvn test                 # Run unit tests
mvn package              # Create JAR
```

### Integrated Local Development
```bash
./deploy/local/start_local_stack.sh
# Starts both backend (port 8080) and frontend (port 5173)
# Logs in: deploy/local/logs/
# Default credentials: admin / Admin@123
```

### Database Setup
```bash
mysql -uroot -p antflow < AntFlow_backend/src/main/resources/db/schema.sql
```

## Architecture Overview

### Frontend Architecture (React 19 + TypeScript + Vite)
- **Location**: `AntFlow_frontend/`
- **Entry Point**: `src/main.tsx` → Redux Provider → `src/App.tsx` → Router
- **State Management**: Redux Toolkit (`store/slices/userSlice.ts` for auth state)
- **Routing**: Hash-based (`#/`) via React Router 7 (supports iframe embedding)
- **API Layer**: Axios with interceptors for JWT token injection (`src/api/` modules)
- **HTTP Client Config**: `src/utils/request.ts` - interceptors for token + error handling
- **Build Output**: IIFE bundle format (configured in `vite.config.ts`)
- **UI**: Radix UI components + Tailwind CSS + SCSS modules

### Backend Architecture (Spring Boot 3 + Java 17)
- **Location**: `AntFlow_backend/`
- **Entry Point**: `src/main/java/com/template/TemplateApplication.java`
- **Layered Architecture**: Controller → Service → Mapper (MyBatis Plus) → Entity
- **Authentication**: JWT-based, stateless (7-day expiry, configurable in `application.yml`)
- **Security Filter**: `JwtAuthenticationFilter` intercepts all requests
- **Authorization**: RBAC with three levels - User → Role → Permission
- **Database ORM**: MyBatis Plus 3.5 with automatic pagination
- **API Documentation**: Swagger UI at `/swagger-ui.html`
- **Error Handling**: Global `GlobalExceptionHandler` with unified `Result<T>` response format

### Database Schema (MySQL 8.x)
**RBAC Tables**:
- `sys_user` (id, username, password, email, status, created_at, updated_at)
- `sys_role` (id, role_name, role_code, description)
- `sys_permission` (id, permission_name, permission_code, type, parent_id for tree hierarchy)
- `sys_user_role` (user_id, role_id) - many-to-many
- `sys_role_permission` (role_id, permission_id) - many-to-many

**Business Tables**:
- `pm_product` (id, product_name, product_code, product_type, tags, status)
- `pm_content_template` (id, template_name, platform, module_type, prompt, media specs)
- `pm_content_module` (id, product_id, platform, module_type, settings)

## Key Files and Their Roles

### Frontend
| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component, auth check on mount |
| `src/router/index.tsx` | Hash routing config, main navigation structure |
| `src/layout/NavigationLayout.tsx` | Main layout wrapper (sidebar, header, breadcrumb) |
| `src/store/slices/userSlice.ts` | Redux auth state (token, user info, isAuthenticated) |
| `src/api/auth.ts` | Login, token refresh, user info endpoints |
| `src/utils/request.ts` | Axios instance, JWT interceptors, error handling |
| `src/components/auth/RequireAuth.tsx` | Protected route wrapper, redirects to login if not authenticated |
| `src/views/` | Page-level components (UserManagement, ProductManagement, ContentCreation, etc.) |

### Backend
| File | Purpose |
|------|---------|
| `src/main/java/com/template/config/SecurityConfig.java` | Spring Security config, JWT filter integration, white-listed paths |
| `src/main/java/com/template/security/JwtAuthenticationFilter.java` | Intercepts requests, validates JWT, sets authentication context |
| `src/main/java/com/template/security/JwtTokenProvider.java` | JWT generation/validation logic |
| `src/main/java/com/template/common/response/Result.java` | Generic API response wrapper |
| `src/main/java/com/template/common/exception/GlobalExceptionHandler.java` | Centralized error handling |
| `src/main/java/com/template/module/auth/controller/AuthController.java` | Login, refresh, info endpoints |
| `src/main/java/com/template/module/user/` | User CRUD module (controller/service/mapper/entity) |
| `src/main/resources/application.yml` | Main config (JWT secret, CORS, DB connection, profiles) |
| `src/main/resources/db/schema.sql` | Database initialization with initial admin user |

## Common Development Tasks

### Adding a New API Endpoint

**Backend**:
1. Create/extend entity in `module/{feature}/entity/`
2. Create DTO in `module/{feature}/dto/` for request/response
3. Add controller method in `module/{feature}/controller/`
4. Implement service logic in `module/{feature}/service/`
5. Add MyBatis mapper in `module/{feature}/mapper/` (XML templates in `resources/mapper/`)
6. Endpoint is automatically documented in Swagger UI

**Frontend**:
1. Create API function in `src/api/{feature}.ts` using Axios
2. Call API in component using `useEffect`
3. Handle response with proper error checking
4. Update Redux state if needed

### Adding a New Permission
1. Add row to `sys_permission` table (with parent_id for tree hierarchy)
2. Assign to roles via `sys_role_permission`
3. Frontend fetches permission tree from `GET /api/permissions/tree`
4. Use permission codes to control menu visibility and button access

### Modifying Authentication/JWT
- JWT Secret: `application.yml` → `jwt.secret` (must be >256 bits)
- Expiration: `application.yml` → `jwt.expiration` (in milliseconds)
- Token validation: `JwtAuthenticationFilter` intercepts before controller
- Frontend token storage: `src/utils/request.ts` handles storage/injection

### Running Frontend Tests
```bash
# ESLint only (no Jest/Vitest configured)
cd AntFlow_frontend && npm run lint
```

### Running Backend Tests
```bash
cd AntFlow_backend && mvn test
```

## Important Architectural Patterns

### Frontend Patterns
- **Redux Toolkit**: Centralized state for user/auth info
- **Axios Interceptors**: Automatic JWT injection, silent error suppression for non-critical calls
- **Protected Routes**: `RequireAuth` wrapper redirects unauthenticated users
- **Hash Routing**: Enables iframe embedding without server-side routing
- **Silent Mode**: Conditional error suppression via `config.silent = true`

### Backend Patterns
- **Spring Security Filter Chain**: `JwtAuthenticationFilter` runs before `DispatcherServlet`
- **Global Exception Handler**: Catches all exceptions, returns unified `Result<T>` format
- **MyBatis Plus**: Automatic pagination, CRUD generation
- **DTO Pattern**: Separates API contracts from internal entities
- **Swagger Annotations**: Auto-generated API documentation

### API Communication Contract
```json
// Success Response
{
  "code": 200,
  "message": "Success",
  "data": { /* any object */ }
}

// Paginated Response
{
  "code": 200,
  "message": "Success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}

// Error Response
{
  "code": 400,
  "message": "Business error message",
  "data": null
}
```

## Configuration Files

### Frontend
- `vite.config.ts` - Build config (IIFE format, path aliases)
- `tsconfig.app.json` - TypeScript compiler options
- `package.json` - Dependencies and scripts
- `.env` files - Environment variables (VITE_APP_BASE_API for API endpoint)

### Backend
- `application.yml` - Main config (active profile, JWT, CORS, MyBatis)
- `application-dev.yml` - Dev profile (MySQL localhost:3306, db: antflow)
- `application-prod.yml` - Production profile (override as needed)
- `pom.xml` - Maven dependencies and plugins

## CORS & Security

- **CORS Whitelist**: Configured in `SecurityConfig.java` (default: localhost:5173, localhost:3000)
- **Protected Endpoints**: All paths except `/api/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`
- **JWT Header**: `Authorization: Bearer <token>`
- **Token in Storage**: Frontend uses `localStorage` (injected by interceptor)

## Testing & Building

### Frontend
```bash
npm run lint      # ESLint check
npm run build     # Production build (dist/)
npm run preview   # Test production build locally
```

### Backend
```bash
mvn clean test          # Unit tests
mvn package             # Build JAR
mvn spring-boot:run     # Run with dev profile
```

## Performance & Optimization Notes

- **Frontend Build**: IIFE bundle reduces module resolution overhead
- **MyBatis Plus Pagination**: Automatic offset/limit injection
- **JWT Stateless Auth**: No server-side session storage
- **Axios Interceptors**: Single point for cross-cutting concerns
- **Redux Selectors**: Prevents unnecessary component re-renders

## Deployment

Run the integrated stack script:
```bash
./deploy/local/start_local_stack.sh
```

This script:
1. Validates MySQL connectivity
2. Kills existing processes on ports 8080 (backend) and 5173 (frontend)
3. Starts backend with dev profile
4. Starts frontend dev server
5. Logs to `deploy/local/logs/`

Access via `http://localhost:5173/#/login` with credentials `admin / Admin@123`

## Debugging Tips

- **Backend**: Swagger UI at `http://localhost:8080/swagger-ui.html` for testing endpoints
- **Frontend**: Redux DevTools browser extension for state inspection
- **JWT Issues**: Check `JwtAuthenticationFilter` logs, verify token expiration
- **CORS Issues**: Check `SecurityConfig` whitelist against actual frontend origin
- **Database Issues**: Verify schema initialized, check `application-dev.yml` connection settings

## File Structure Quick Reference

```
AntFlow/
├── AntFlow_frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx           # Root
│   │   ├── main.tsx          # Entry with Redux
│   │   ├── router/           # Routing config
│   │   ├── layout/           # Layout components
│   │   ├── views/            # Page components
│   │   ├── api/              # API service layer
│   │   ├── store/            # Redux state
│   │   ├── components/       # UI components
│   │   ├── utils/            # Utilities (request, storage, etc.)
│   │   ├── types/            # TypeScript definitions
│   │   └── styles/           # Global styles
│   └── vite.config.ts
│
├── AntFlow_backend/           # Spring Boot backend
│   ├── src/main/java/com/template/
│   │   ├── TemplateApplication.java
│   │   ├── config/           # Security, CORS, MyBatis, Swagger
│   │   ├── common/           # Constants, exceptions, responses
│   │   ├── security/         # JWT, filters, authentication
│   │   ├── module/           # Business modules (auth, user, role, etc.)
│   │   └── util/             # Utilities
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── db/schema.sql
│   │   └── mapper/           # MyBatis SQL templates
│   └── pom.xml
│
└── deploy/
    └── local/
        ├── start_local_stack.sh   # Integrated startup script
        └── logs/                  # Log directory
```
