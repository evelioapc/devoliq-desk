# Checklist de portafolio - Devoliq Desk

Para presentar el proyecto en portafolio o demos (~1 hora).

---

## 1. Screenshots (4 imágenes)

Tomar capturas de pantalla en buena resolución (ej. 1280x800):

| # | Pantalla | Qué mostrar |
|---|----------|-------------|
| 1 | **Login** | Formulario de login, URL visible si es posible |
| 2 | **Dashboard** | Métricas (cards), top servicios con nombre+revenue, últimas operaciones, filtros 7/30/90 |
| 3 | **Clients** | Empty state bonito O lista con datos + modal "Crear cliente" |
| 4 | **UpgradeModal (402)** | Modal de límite Free alcanzado (cambiar a Free, intentar crear cliente 51 u operación 201) |

Sugerencia: guardar en `/docs/screenshots/` o `/screenshots/`:
- `01-login.png`
- `02-dashboard.png`
- `03-clients.png`
- `04-upgrade-modal.png`

---

## 2. Video corto (30–60 segundos)

Mostrar flujo completo:

1. **Login** (admin@devoliq.demo / password123)
2. **Crear cliente** (modal → guardar → ver en tabla)
3. **Crear operación** (modal → cliente + servicio → monto auto → guardar)
4. **Dashboard** (ver métricas actualizadas, top servicios)

Herramientas: OBS, Loom, SimpleScreenRecorder, o el grabador del SO.

---

## 3. Verificación funcional rápida

Antes de grabar/capturar, confirmar:

- [ ] Login Admin y Operator
- [ ] Sidebar: Operator no ve Users/Billing
- [ ] /users y /billing como Operator → "Solo administradores"
- [ ] Crear cliente → aparece en tabla
- [ ] Crear operación → se refleja en dashboard
- [ ] Plan Free + superar límite → UpgradeModal (sin crash)

---

## 4. README

Incluir en el README (si aplica):

- Link a demo en vivo (si hay)
- 2–3 screenshots embebidos
- Link al video (YouTube, Loom, etc.)
