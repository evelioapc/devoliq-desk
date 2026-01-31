# Devoliq Desk

SaaS multi-tenant para gestión de servicios: clientes, operaciones, facturación por plan. Backend Laravel (API + Sanctum), PostgreSQL, frontend Inertia + React + Vite.

---

## Checklist rápido (copiar-pegar)

```bash
# 1. Clonar e instalar
git clone <repo> devoliq-desk && cd devoliq-desk

# 2. Configurar
cp .env.example .env
php artisan key:generate

# 3. Base de datos (elegir una opción)
# Opción A: SQLite (local rápido)
touch database/database.sqlite

# Opción B: PostgreSQL (Docker)
# En .env: DB_CONNECTION=pgsql, DB_HOST=postgres, etc.
docker compose up -d
# Luego:
docker compose exec api php artisan migrate --force

# 4. Seed demo
php artisan db:seed --force
# O con Docker: docker compose exec api php artisan db:seed --force

# 5. Levantar
composer install && npm install
composer run dev
```

**Login:** `admin@devoliq.demo` / `password123`

---

## Requisitos

- PHP 8.4
- Composer 2
- Node 18+ y npm
- PostgreSQL 16 o SQLite (para desarrollo)

---

## Cómo correr

### Local (recomendado)

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed    # datos demo
composer run dev
```

- **App:** http://127.0.0.1:8000

### Con Docker

```bash
cp .env.example .env
# En .env: DB_CONNECTION=pgsql, DB_HOST=postgres, DB_DATABASE=devoliq_desk, etc.
docker compose up -d
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate --force
docker compose exec api php artisan db:seed --force
```

### Solo build de producción (assets)

```bash
npm run build
```

---

## Credenciales demo

| Rol      | Email              | Password   |
|----------|--------------------|------------|
| Admin    | admin@devoliq.demo | password123 |
| Operador | op1@devoliq.demo   | password123 |
| Operador | op2@devoliq.demo   | password123 |

La compañía demo tiene plan **Pro**, clientes, servicios y operaciones. En local/dev también podés usar el botón **"Cargar demo"** en la pantalla de Clientes para poblar tu compañía actual.

---

## Features

- **Auth:** Login, registro (crea company + admin), sesión web + token API
- **Multi-tenant:** Datos aislados por `company_id`
- **Roles:** Admin (users, billing) y Operator
- **Planes:** Free (50 clientes, 200 ops/mes) y Pro (ilimitado)
- **Clientes, Servicios, Operaciones:** CRUD con soft delete
- **Dashboard:** Métricas, top servicios, últimas operaciones, filtros 7/30/90 días
- **Activity Logs:** Auditoría con descripción humana, tiempo relativo, filtros
- **Billing:** Consumo actual, tabla comparativa, upgrade simulado
- **Modal 402:** Límite de plan alcanzado (Free)
- **Rate limit:** Login (5/min por IP)
- **Headers de seguridad:** X-Frame-Options, X-Content-Type-Options, etc.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Devoliq Desk (monolito)               │
├─────────────────────────────────────────────────────────┤
│  Web (Inertia + React)  │  API (Sanctum token/session)  │
│  /login, /, /clients…   │  /api/health, /api/clients…   │
├─────────────────────────────────────────────────────────┤
│  Laravel + PostgreSQL (multi-tenant por company_id)     │
│  • Companies, Users (admin/operator)                    │
│  • Clients, Services, Operations (BelongsToCompany)     │
│  • ActivityLogs, soft deletes                          │
└─────────────────────────────────────────────────────────┘
```

- **Scope global:** Todos los modelos `BelongsToCompany` filtran por `company_id` del usuario autenticado
- **Planes:** `EnforcePlanLimits` middleware (402 si se supera)
- **Activity:** `log_activity()` en create/update/delete

---

## Deploy a producción

### Opción A: Docker (recomendado)

```bash
cp .env.production.example .env
# Editar .env: APP_KEY, APP_URL, DB_PASSWORD, etc.
php artisan key:generate   # o definir APP_KEY manualmente

docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Migrar (una vez)
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force

# Cache (recomendado)
docker compose -f docker-compose.prod.yml exec app php artisan config:cache
docker compose -f docker-compose.prod.yml exec app php artisan route:cache
docker compose -f docker-compose.prod.yml exec app php artisan view:cache
```

App en **http://localhost** (puerto 80).

### Opción B: VPS manual (Nginx + PHP-FPM + Postgres)

1. **Configurar `.env`** desde `.env.production.example`:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://tu-dominio.com
   SESSION_SECURE_COOKIE=true
   ```

2. **Migrar:**
   ```bash
   php artisan migrate --force
   ```

3. **Build assets:**
   ```bash
   npm ci && npm run build
   ```

4. **Cache:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

5. **Nginx + PHP-FPM:** Usar `deploy/nginx.conf` como referencia.

6. **Health check:** `GET /api/health` o `GET /up`

7. **HTTPS:** SSL (Let's Encrypt, etc.) delante de Nginx.

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/health | `{ "status": "ok", "app": "devoliq-desk" }` |
| POST | /api/auth/register | Registro (crea company + admin) |
| POST | /api/auth/login | Login (token) |
| GET | /api/me | Usuario actual (token) |
| GET | /api/dashboard/summary | Resumen dashboard |
| GET/POST | /api/clients | CRUD clientes |
| GET/POST | /api/services | CRUD servicios |
| GET/POST | /api/operations | CRUD operaciones |
| GET | /api/activity-logs | Logs de actividad |
| POST | /api/seed-demo | Cargar demo (solo APP_ENV=local → 404 en prod) |
| GET | /api/billing/usage | Uso actual + límites del plan |
| GET/POST | /api/users | CRUD usuarios (solo admin) |
| POST | /api/billing/plan | Cambiar plan (solo admin) |

---

## Tests

```bash
composer test
# o
php artisan test
```

Smoke tests: `GET /api/health`, `POST /api/auth/login`, redirección `/` → login.

---

## DX

- **Laravel Boost:** `boost.json` (herramientas DX)
- **Pint:** `./vendor/bin/pint`

---

## Screenshots (portafolio)

Para el README o portafolio, podés agregar capturas de:

- Login
- Dashboard (con métricas y filtros)
- Clientes (lista + empty state)
- Modal 402 (límite Free)
- Billing (consumo + planes)

---

## Licencia

MIT.
