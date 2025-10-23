# FrontendApplication (React)

Responsive, accessible UI for managing network devices.

## Run (local)
```
npm install
REACT_APP_API_BASE_URL=http://localhost:3001/api/v1 npm start
```

## Run with Docker Compose
This app is built and served via the Dockerfile here when using docker compose from the project root. The API base URL is injected via build arg/environment:
- REACT_APP_API_BASE_URL=http://localhost:3001/api/v1

## Build
```
npm run build
```

## Features
- Device list with filter/sort/search
- Detail view
- Add/Edit forms with validation
- Delete with confirmation
- Polling for updates (5s)
- Loading and error states, toasts
- Keyboard navigation and ARIA attributes
- DB-down detection: disables write actions and shows banner
