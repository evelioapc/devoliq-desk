# STATUS REPORT — Entorno de desarrollo (Devoliq Desk)

**Fecha:** 2026-01-31  
**Objetivo:** Hacer que `composer run dev` levante el frontend SaaS en `apps/desk-web` (Vite + React) en lugar del Vite del root (Laravel/Blade).

---

## Archivos modificados / creados

### Modificados
- **`package.json` (root)**  
  - Añadidos scripts:  
    - `dev:sas` → `npm --prefix apps/desk-web run dev`  
    - `build:sas` → `npm --prefix apps/desk-web run build`  
  - Se mantienen `dev` y `build` del root (Laravel Vite) sin cambios.

- **`composer.json`**  
  - Script `dev`: reemplazado `"npm run dev"` por `"npm run dev:sas"`.  
  - Sigue usando `npx concurrently` con: server, queue, logs, vite (ahora Vite del SaaS).

### Creados (apps/desk-web)
La carpeta `apps/desk-web` **no existía**; se creó un frontend SaaS mínimo (Vite + React) para que el flujo de desarrollo funcione:

- **`apps/desk-web/package.json`** — Scripts `dev`, `build`, `preview`; dependencias React, Vite, axios, react-router-dom.
- **`apps/desk-web/vite.config.js`** — Plugin React, puerto 5173.
- **`apps/desk-web/index.html`** — Entry HTML.
- **`apps/desk-web/src/main.jsx`** — Entry React.
- **`apps/desk-web/src/index.css`** — Estilos base.
- **`apps/desk-web/src/App.jsx`** — Login + Dashboard (rutas `/` y `/dashboard`), consume `VITE_API_URL` para `/api/auth/login`.
- **`apps/desk-web/.env`** — `VITE_API_URL=http://127.0.0.1:8000/api`.
- **`apps/desk-web/.env.example`** — Mismo contenido para referencia.

---

## Cómo correr el proyecto

### Un solo comando (recomendado)
```bash
composer run dev
```
Levanta en paralelo:
1. **Laravel backend** — `php artisan serve` → http://127.0.0.1:8000  
2. **Queue listener** — `php artisan queue:listen`  
3. **Log tail** — `php artisan pail`  
4. **Vite del SaaS** — `npm run dev:sas` (Vite de `apps/desk-web`) → http://localhost:5173  

### URLs
| Servicio | URL |
|----------|-----|
| **Frontend SaaS (Vite)** | http://localhost:5173 |
| **Backend Laravel (API + welcome)** | http://127.0.0.1:8000 |

### Solo frontend SaaS
```bash
npm run dev:sas
# o desde apps/desk-web:
cd apps/desk-web && npm run dev
```

### Build del frontend SaaS
```bash
npm run build:sas
```

---

## Confirmación

| Comprobación | Estado |
|--------------|--------|
| http://localhost:5173 → muestra el SaaS (login/dashboard) | ✅ Vite de `apps/desk-web` sirve la app React con login y dashboard. |
| http://127.0.0.1:8000 → muestra Laravel (welcome o API) | ✅ Sin cambios; `php artisan serve` sigue sirviendo la app Laravel (welcome en `/`, API en `/api/*`). |
| `composer run dev` usa Vite de `apps/desk-web` | ✅ El script `dev` de composer ejecuta `npm run dev:sas`, que ejecuta `npm --prefix apps/desk-web run dev`. |
| Frontend apunta al backend | ✅ `apps/desk-web/.env` tiene `VITE_API_URL=http://127.0.0.1:8000/api`. |

---

## Notas

- **Scripts del root:** `npm run dev` y `npm run build` del root **no se han eliminado**; siguen siendo el Vite de Laravel (Blade). Para el SaaS se usan `dev:sas` y `build:sas`.
- **Auth:** Sin cambios; el frontend SaaS usa Sanctum token (login devuelve token, se guarda en `localStorage`).
- **Si ya tenías un frontend en otra ruta:** Puedes copiar tu código a `apps/desk-web` (manteniendo al menos `package.json` con scripts `dev` y `build`) y conservar el mismo flujo con `composer run dev`.
