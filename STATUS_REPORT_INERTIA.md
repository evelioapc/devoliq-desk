# STATUS REPORT — Acoplamiento Inertia + React (Devoliq Desk)

**Fecha:** 2026-01-31  
**Objetivo:** Acoplar el frontend SaaS al proyecto Laravel con Inertia + React, un solo servidor en :8000, auth por sesión web, API intacta.

---

## Resumen de cambios

### 1. Inertia + React instalado y configurado
- **Composer:** `inertiajs/inertia-laravel`
- **NPM:** `@inertiajs/react`, `react`, `react-dom`, `@vitejs/plugin-react`
- **Vite (root):** entrada `resources/js/app.jsx`, plugin React, alias `@` → `resources/js`
- **Vista raíz:** `resources/views/app.blade.php` con `@inertia`, `@inertiaHead`, `@vite`, meta CSRF
- **Middleware:** `HandleInertiaRequests` en grupo `web`; comparte `auth.user`, `csrf_token`, `flash`

### 2. Auth web (sesión) sin Breeze
- **Controlador:** `App\Http\Controllers\Web\AuthController`
  - `showLogin` / `login` (GET/POST `/login`)
  - `showRegister` / `register` (GET/POST `/register`) — misma lógica que API (company + admin)
  - `logout` (POST `/logout`)
- **Rutas:** guest para login/register; auth para resto. **API `/api/auth/*` sin cambios** (token-based).

### 3. Rutas web (Inertia)
| Método | Ruta | Controlador | Middleware |
|--------|------|-------------|------------|
| GET | / | DashboardController | auth |
| GET | /login | AuthController@showLogin | guest |
| POST | /login | AuthController@login | guest |
| GET | /register | AuthController@showRegister | guest |
| POST | /register | AuthController@register | guest |
| POST | /logout | AuthController@logout | auth |
| GET | /clients | ClientPageController | auth |
| GET | /services | ServicePageController | auth |
| GET | /operations | OperationPageController | auth |
| GET | /activity-logs | ActivityLogPageController | auth |
| GET | /users | UserPageController | auth, role:admin |
| GET | /billing | BillingPageController | auth, role:admin |

### 4. Páginas Inertia (React)
- **Layout:** `resources/js/layouts/AppLayout.jsx` (nav, enlaces, logout)
- **Auth:** `pages/Auth/Login.jsx`, `pages/Auth/Register.jsx`
- **App:** `pages/Dashboard.jsx`, `pages/Clients/Index.jsx`, `pages/Services/Index.jsx`, `pages/Operations/Index.jsx`, `pages/Users/Index.jsx`, `pages/ActivityLogs/Index.jsx`, `pages/Billing/Index.jsx`
- Las páginas consumen la **API** (`/api/*`) con axios (`resources/js/lib/api.js`): baseURL `/api`, `withCredentials: true`, CSRF desde meta, interceptor 401 → `router.visit('/logout')`, interceptor 402 → evento `plan-limit` (para UpgradeModal).

### 5. API y multi-tenant
- **Sin cambios:** `/api/health`, `/api/auth/register`, `/api/auth/login`, `/api/me`, CRUD clients/services/operations/users, dashboard/summary, activity-logs, billing/plan, soft delete/restore, middleware `plan:create-client`, `plan:create-operation` (402), `role:admin`.
- **Sanctum stateful:** `127.0.0.1:8000` en stateful domains; las peticiones desde la misma origen (Inertia en :8000) envían cookie de sesión y Sanctum autentica por sesión en `/api/*`.

### 6. RequireRole
- Actualizado para web: si no autenticado → `redirect()->route('login')`; si sin rol → `abort(403)`. API sigue devolviendo JSON 401/403.

### 7. Composer `dev` y frontend
- **`composer run dev`** ejecuta: `php artisan serve`, queue:listen, pail, **`npm run dev`** (Vite del root, Inertia).
- **Una sola URL:** http://127.0.0.1:8000 — Laravel sirve la app; Vite inyecta assets en desarrollo. Sin CORS en dev (mismo dominio).

### 8. Welcome page
- **`/`** ya no muestra la welcome de Laravel; con auth redirige al Dashboard Inertia; sin auth redirige a `/login`.

### 9. Tests smoke
- **`tests/Feature/ApiHealthTest.php`** — GET `/api/health` → 200, `{ status: "ok", app: "devoliq-desk" }`
- **`tests/Feature/WebRootRedirectTest.php`** — GET `/` sin auth → redirect `/login`; GET `/login` → 200

### 10. apps/desk-web
- **No eliminado.** Queda como respaldo/referencia. El flujo principal es Inertia en el root; `npm run dev:sas` sigue disponible si se quiere levantar el SPA antiguo por separado.

---

## Cómo correr el proyecto

### Un solo comando
```bash
composer run dev
```
Levanta: Laravel (serve), queue:listen, pail, Vite (root). **Todo en http://127.0.0.1:8000**.

### URLs
| Uso | URL |
|-----|-----|
| **App SaaS (Inertia)** | http://127.0.0.1:8000 |
| **API** | http://127.0.0.1:8000/api/* |

### Sin composer run dev (por partes)
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```
Misma URL: 127.0.0.1:8000 (Vite hace HMR contra el mismo dominio).

---

## Rutas principales

### Web (Inertia)
- `/` → Dashboard (auth)
- `/login`, `/register` → Auth (guest)
- `/logout` → Cerrar sesión (auth)
- `/clients`, `/services`, `/operations`, `/activity-logs` → CRUD pages (auth)
- `/users`, `/billing` → Solo admin (auth + role:admin)

### API (sin cambios)
- GET `/api/health`
- POST `/api/auth/register`, POST `/api/auth/login`, GET `/api/me`, POST `/api/auth/logout`
- GET/POST `/api/dashboard/summary`, `/api/clients`, `/api/services`, `/api/operations`, `/api/activity-logs`
- GET/POST/PUT/DELETE `/api/users` (admin), POST `/api/billing/plan` (admin)
- Restore y soft deletes según rutas existentes.

---

## Credenciales demo y seed

```bash
php artisan db:seed --force
# o con Docker:
docker compose exec api php artisan db:seed --force
```

| Rol      | Email              | Password    |
|----------|--------------------|-------------|
| Admin    | admin@devoliq.demo | password123 |
| Operador | op1@devoliq.demo   | password123 |
| Operador | op2@devoliq.demo   | password123 |

---

## Checklist de verificación

| Ítem | Estado |
|------|--------|
| Backend + frontend único en :8000 | ✅ |
| `composer run dev` levanta todo | ✅ |
| Auth web (login/register/logout) por sesión | ✅ |
| API auth por token intacta (/api/auth/*) | ✅ |
| Multi-tenant (BelongsToCompany) con Auth::user() en web | ✅ |
| Dashboard Inertia consume /api/dashboard/summary | ✅ |
| CRUD pages (Clients, Services, Operations, Users, ActivityLogs, Billing) | ✅ |
| Users y Billing solo admin (role:admin) | ✅ |
| Plan limits 402; interceptor dispara evento plan-limit | ✅ |
| Activity logs OK | ✅ |
| Soft delete/restore (API) sin cambios | ✅ |
| GET / redirige a login si no autenticado | ✅ |
| /api/health OK | ✅ |
| Welcome page ya no en / | ✅ |

---

## Archivos creados/modificados (resumen)

**Creados:**  
- `app/Http/Controllers/Web/AuthController.php`  
- `app/Http/Controllers/Web/DashboardController.php`, `ClientPageController.php`, `ServicePageController.php`, `OperationPageController.php`, `UserPageController.php`, `ActivityLogPageController.php`, `BillingPageController.php`  
- `app/Http/Middleware/HandleInertiaRequests.php` (artisan inertia:middleware)  
- `resources/views/app.blade.php`  
- `resources/js/app.jsx`, `resources/js/lib/api.js`, `resources/js/layouts/AppLayout.jsx`  
- `resources/js/pages/Auth/Login.jsx`, `Auth/Register.jsx`, `Dashboard.jsx`  
- `resources/js/pages/Clients/Index.jsx`, `Services/Index.jsx`, `Operations/Index.jsx`, `Users/Index.jsx`, `ActivityLogs/Index.jsx`, `Billing/Index.jsx`  
- `tests/Feature/WebRootRedirectTest.php`  

**Modificados:**  
- `bootstrap/app.php` — middleware web append HandleInertiaRequests  
- `routes/web.php` — rutas Inertia y auth web  
- `app/Http/Middleware/RequireRole.php` — redirect/login y 403 para web  
- `vite.config.js` — React, entrada app.jsx, alias @  
- `composer.json` — script dev usa `npm run dev` (root)  
- `package.json` — dependencias React e Inertia (ya añadidas por npm install)

---

## Cambios pendientes / riesgos

- **UpgradeModal (402):** El interceptor 402 dispara `window.dispatchEvent('plan-limit', detail)`. Falta un componente global que escuche el evento y muestre el modal; se puede añadir en `AppLayout` o en un provider.
- **apps/desk-web:** Sigue en el repo; no se usa en `composer run dev`. Se puede archivar o eliminar más adelante si se confirma que todo el flujo es Inertia.
- **Paginación en páginas:** Clients/Services/Operations/ActivityLogs usan datos paginados de la API; las UIs actuales muestran la primera página; se puede añadir controles de paginación usando `meta` de la respuesta.
