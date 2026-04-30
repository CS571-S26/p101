// Central API base URL.
// In development: set VITE_API_BASE_URL=http://localhost:8080 in .env.local
// In production (Docker): leave empty so Nginx proxies /api/* to the backend container
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
