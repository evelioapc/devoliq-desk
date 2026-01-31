# STATUS REPORT — Integración Starter Kit + Laravel Boost (Devoliq Desk)

**Fecha:** 2026-01-31  
**Objetivo:** Integrar Starter Kit (Breeze) y Laravel Boost sin romper API + multi-tenant.

---

## Resumen de cambios realizados

1. **Endpoint de salud**  
   - **GET /api/health** → `{ "status": "ok", "app": "devoliq-desk" }`  
   - Controlador: `App\Http\Controllers\Api\HealthController`.

2. **Laravel Boost**  
   - Ya estaba instalado (`laravel/boost`, `boost.json` con Cursor, MCP, skills).  
   - No se añadieron presets que modifiquen build; Pint ya estaba en `composer.json` y se usa para DX.

3. **Starter Kit (Breeze)**  
   - **No se instaló Breeze.** Motivo: el proyecto ya tiene auth API completa (register con company + admin, login, me, logout) y multi-tenant. Los kits oficiales de Laravel 12 (React/Vue/Livewire) usan Fortify con rutas web `/login`, `/register`, lo que podría chocar con el registro multi-tenant actual. Se priorizó **no romper la API ni el auth por token**.  
   - El flujo actual es compatible con un SPA (Sanctum token, CORS para `localhost:5173`).

4. **Tests**  
   - Smoke tests añadidos:  
     - `Tests\Feature\ApiHealthTest` → GET /api/health.  
     - `Tests\Feature\ApiAuthLoginTest` → POST /api/auth/login (éxito y 401).  
   - Ejecución: `php artisan test` o `composer test`.

5. **Seed y documentación**  
   - `DatabaseSeeder` llama a `DemoSeeder` (company demo, admin, operadores, clientes, servicios, operaciones).  
   - README actualizado: cómo correr backend con Docker Compose, backend en local, frontend Vite, seed demo y credenciales demo.

---

## Checklist de verificación

| Ítem | Estado |
|------|--------|
| Servicios levantan (api, db, front) | ✅ Documentado en README (Docker + Vite). Sin cambios en docker-compose ni Dockerfile. |
| Auth funciona (register/login/me) | ✅ Sin cambios en AuthController ni rutas; /api/health añadido sin auth. |
| CRUD funciona (clients/services/operations/users) | ✅ Sin cambios en controladores ni scoping. |
| Dashboard ok | ✅ Sin cambios en DashboardController. |
| Activity logs ok | ✅ Sin cambios en ActivityLogController. |
| Plan limits ok | ✅ Middleware `plan:create-client` y `plan:create-operation` sin cambios; 402 documentado. |
| Soft delete/restore ok | ✅ Rutas restore y soft deletes sin cambios. |
| Seed demo ok | ✅ DemoSeeder sin cambios; DatabaseSeeder lo invoca. |
| GET /api/health | ✅ Implementado. |
| Tests smoke | ✅ ApiHealthTest + ApiAuthLoginTest pasan. |

---

## Rutas API principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | api/health | Salud (público) |
| POST | api/auth/register | Registro (company + admin) |
| POST | api/auth/login | Login (token) |
| GET | api/me | Usuario actual (auth:sanctum) |
| POST | api/auth/logout | Logout (auth:sanctum) |
| GET | api/dashboard/summary | Resumen dashboard |
| GET | api/activity-logs | Logs de actividad |
| GET/POST | api/clients | Listar / crear cliente |
| GET/PUT|PATCH/DELETE | api/clients/{client} | Ver / actualizar / borrar |
| POST | api/clients/{id}/restore | Restaurar cliente |
| apiResource | api/services | CRUD servicios + restore |
| GET/POST | api/operations | Listar / crear |
| GET/DELETE | api/operations/{operation} | Ver / borrar |
| POST | api/operations/{id}/restore | Restaurar operación |
| POST | api/billing/plan | Cambiar plan (role:admin) |
| apiResource | api/users | CRUD usuarios (role:admin) |

---

## Comandos exactos para ejecutar local

**Backend con Docker:**
```bash
docker compose up -d
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate --force
docker compose exec api php artisan db:seed --force
```
API: http://localhost:8000

**Backend sin Docker:**
```bash
composer install && cp .env.example .env && php artisan key:generate
# Configurar .env con PostgreSQL
php artisan migrate && php artisan db:seed
php artisan serve
```

**Frontend (Vite):**
```bash
npm install && npm run dev
```
Frontend: http://localhost:5173

**Seed demo (solo datos demo):**
```bash
php artisan db:seed --force
# Con Docker:
docker compose exec api php artisan db:seed --force
```

**Credenciales demo:**  
Admin: `admin@devoliq.demo` / `password123`  
Operadores: `op1@devoliq.demo`, `op2@devoliq.demo` / `password123`

**Tests:**
```bash
php artisan test
# o
composer test
```

---

## Cambios pendientes / riesgos

- **Breeze no instalado:** Si en el futuro se quiere Breeze (p. ej. stack API), instalar con `composer require laravel/breeze --dev` y `php artisan breeze:install` eligiendo API, y **no** registrar o sobrescribir las rutas de auth actuales; mantener `AuthController` y rutas `/api/auth/*`.
- **Frontend `apps/desk-web`:** El contexto mencionaba “Frontend Vite React en apps/desk-web”; en el repo actual no existe esa carpeta (solo `resources/js` con Vite). El README asume frontend en el mismo repo con `npm run dev`. Si el frontend vive en otro repo/carpeta, actualizar README y CORS según la URL del frontend.
- **CORS:** `config/cors.php` tiene `allowed_origins => ['http://localhost:5173']`. Si el frontend corre en otro puerto/origen, añadirlo en `.env` o en `config/cors.php`.
- **PHP 8.4:** Proyecto y tests compatibles con PHP 8.4; no se modificó esquema de DB.
