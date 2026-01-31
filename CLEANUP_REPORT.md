# CLEANUP REPORT — Devoliq Desk

**Fecha:** 2026-01-31  
**Objetivo:** Limpiar código, dependencias y configuraciones no usadas sin romper el SaaS (Inertia + React + API multi-tenant).

---

## Resumen ejecutivo

- **SaaS intacto:** Auth web (sesión), Auth API (Sanctum), multi-tenant, planes (402), activity logs y UI Inertia siguen funcionando.
- **Build:** `npm run build` — OK.
- **Tests:** `php artisan test` — 5 tests pasan (ApiHealth, ApiAuthLogin, WebRootRedirect).
- **Dev:** `composer run dev` levanta server + queue + pail + Vite (en entorno local; en CI Vite requiere `LARAVEL_BYPASS_ENV_CHECK=1` o usar solo `npm run build`).

---

## 1. Frontend / JS

| Acción | Detalle |
|--------|---------|
| **apps/desk-web** | Marcado como **legacy/backup**. Añadido `apps/desk-web/README.md` indicando que NO se usa; flujo principal es `resources/js` + Inertia. No borrado (respaldo). |
| **Scripts root** | Eliminados `dev:sas` y `build:sas` del `package.json` del root (ya no referenciados por `composer run dev`). |
| **react-router-dom** | No está en el root; solo en `apps/desk-web`. Root usa Inertia para rutas — sin cambios. |
| **vite.config.js (root)** | Solo entrada Inertia (`resources/js/app.jsx`). Sin referencias a `apps/desk-web`. |

---

## 2. Backend Laravel

| Acción | Detalle |
|--------|---------|
| **CORS** | `config/cors.php`: `allowed_origins` actualizado a `['http://127.0.0.1:8000', 'http://localhost:8000']` (UI y API en 8000). |
| **Vistas** | Eliminado `resources/views/welcome.blade.php` (no usado; entrada es Inertia `/` → login/dashboard). |

---

## 3. Tests y seeders

| Acción | Detalle |
|--------|---------|
| **Eliminados** | `tests/Feature/ExampleTest.php`, `tests/Unit/ExampleTest.php` (obsoletos). |
| **Mantenidos** | `ApiHealthTest`, `ApiAuthLoginTest`, `WebRootRedirectTest`; `DemoSeeder` y llamada desde `DatabaseSeeder`. |

---

## 4. Dependencias PHP (Composer)

| Acción | Detalle |
|--------|---------|
| **Removido** | `laravel/sail` (no usado; dev con `composer run dev` + opcional Docker Compose para API/DB). |
| **Mantenidos** | inertiajs/inertia-laravel, laravel/sanctum, laravel/boost, laravel/pint, faker, pail, collision, phpunit, mockery. |
| **Ejecutado** | `composer update` tras `composer.json` (lock actualizado, Sail eliminado del lock). |

---

## 5. Documentación y DX

| Acción | Detalle |
|--------|---------|
| **README.md** | Actualizado: UI + API en 8000, `composer run dev` como forma recomendada, auth web vs API, sin referencias al puerto 5173. |
| **STATUS_REPORT_DEV.md** | Conservado como histórico; no modificado en esta limpieza. |

---

## Archivos/carpetas eliminadas o archivadas

- **Eliminados:**  
  `resources/views/welcome.blade.php`,  
  `tests/Feature/ExampleTest.php`,  
  `tests/Unit/ExampleTest.php`
- **Archivados / marcados legacy:**  
  `apps/desk-web` (README añadido; carpeta conservada como backup).

---

## Dependencias removidas

- **PHP:** `laravel/sail`
- **JS (root):** ninguna; no se eliminaron paquetes del root (react-router-dom solo en apps/desk-web).

---

## Validaciones realizadas

| Comando / Verificación | Resultado |
|------------------------|-----------|
| `npm run build` | OK (Vite build correcto). |
| `php artisan test` | OK (5 tests, 11 assertions). |
| `composer run dev` | Arranca en local; en CI Vite puede requerir `LARAVEL_BYPASS_ENV_CHECK=1`. |
| Esquema DB | Sin cambios. |
| Multi-tenant, auth, planes, UI | Sin cambios funcionales. |

---

## Verificación manual recomendada

Antes de dar por cerrada la limpieza en tu entorno:

1. **`composer run dev`** — Comprobar que en tu máquina levanta server + Vite sin error.
2. **Navegación:** `/login`, `/`, dashboard.
3. **CRUD clients** — Listar, crear, editar.
4. **Plan Free → 402** — Crear cliente en plan Free y confirmar que se abre el UpgradeModal (evento `plan-limit`).

---

## Conclusión

- Repo más claro: sin Sail, sin scripts SAS, sin vistas/tests de ejemplo no usados, CORS alineado con el uso real.
- `apps/desk-web` queda explícitamente como legacy/backup; el flujo único recomendado es Laravel + Inertia + React en el root con `composer run dev`.
