# Containerized Network Management

Three-container application:
- Frontend: React UI (port 3000)
- Backend: Flask REST API with MongoDB integration (port 3001)
- Database: MongoDB (port 27017)

Features
- Device list with search/filter/sort
- Create/Edit/Delete devices with validation
- Device detail and status check endpoint
- Polling for updates
- Graceful handling if DB is unavailable
- OpenAPI docs available from backend

Quick Start (Docker Compose)
1) From this directory:
   docker compose up --build

2) Access:
   - Frontend: http://localhost:3000
   - Backend health: http://localhost:3001/health
   - Backend OpenAPI JSON: http://localhost:3001/api/v1/openapi.json
   - Backend Swagger UI: http://localhost:3001/api/v1/docs

Environment Variables
Backend (see BackendApplication/.env.example):
- SERVER_HOST: Bind host (default 0.0.0.0)
- SERVER_PORT: Port (default 3001)
- API_PREFIX: API base path (default /api/v1)
- MONGODB_URI: Mongo connection (default mongodb://mongo:27017)
- MONGODB_DB: Database name (default devicesdb)
- LOG_LEVEL: Logging level (default INFO)

Frontend (see FrontendApplication/.env.example):
- REACT_APP_API_BASE_URL: e.g., http://localhost:3001/api/v1

Troubleshooting
- Backend cannot reach DB: Backend still serves /health and docs; device endpoints will return 503 with clear message. Ensure mongo is healthy (docker compose ps; logs).
- Port conflicts: Change exposed ports in docker-compose.yml.
- CORS: Not required since frontend calls localhost:3001; adjust proxy or headers if deploying separately.
- Unique IP errors: Backend enforces unique index on ip_address; duplicate inserts return HTTP 400.

Local Development (optional)
- Backend: see BackendApplication/README.md
- Frontend: see FrontendApplication/README.md

Extensibility
- Add auth middleware on backend and protected routes on frontend.
- Extend status check to use real network probes behind a feature flag.
