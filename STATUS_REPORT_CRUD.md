# STATUS REPORT - CRUD Services & Users (Frontend)

## Resumen

Se implementaron los flujos CRUD completos para **Services** y **Users** en el frontend (Inertia + React), usando la API existente (`/api/*`).

---

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `resources/js/components/ServiceDialog.jsx` | Modal CRUD servicios (crear, editar, eliminar con confirmación) |
| `resources/js/components/UserDialog.jsx` | Modal CRUD usuarios (invitar, editar, eliminar con confirmación) |

---

## Archivos modificados

| Archivo | Cambios |
|---------|---------|
| `resources/js/pages/Services/Index.jsx` | Import ServiceDialog; estado `dialogOpen`, `selectedService`; botón Add Service → abre modal create; botón Edit → abre modal edit con servicio; `onSaved` → `load()` |
| `resources/js/pages/Users/Index.jsx` | Import UserDialog, usePage; estado `dialogOpen`, `selectedUser`; botón Invite User → abre modal create; botón Manage → abre modal edit; pasa `currentUserId` para bloquear delete propio; `onSaved` → `load()` |

---

## Detalles de implementación

### ServiceDialog
- **Props:** `open`, `onOpenChange`, `initial` (service o null), `onSaved`
- **Campos:** name, price, duration_minutes, status (active/inactive)
- **API:** POST `/api/services` (create), PUT `/api/services/{id}` (update), DELETE `/api/services/{id}` (delete)
- **Confirmación delete:** Paso intermedio "¿Eliminar servicio?" antes de borrar
- **Errores 422:** Muestra mensajes bajo cada input

### UserDialog
- **Props:** `open`, `onOpenChange`, `initial`, `currentUserId`, `onSaved`
- **Campos:** name, email, role; create: password + botón "Generar" (password random mostrado); edit: password opcional
- **API:** POST `/api/users`, PUT `/api/users/{id}`, DELETE `/api/users/{id}`
- **Delete propio:** No se muestra botón Eliminar si `initial.id === currentUserId`; en confirmación muestra "No podés eliminar tu propio usuario"
- **Errores 422:** Mapeo de `errors` Laravel bajo cada input

### Nota sobre campos
- **Service:** Backend usa `status` (active/inactive), no `is_active`. El formulario mapea correctamente.

---

## Cómo probar manualmente

### Services (login como Admin)

1. **Crear servicio**
   - Ir a `/services`
   - Click "Add Service"
   - Completar: Nombre, Precio, Duración, Estado
   - Click "Crear" → debe aparecer en la tabla

2. **Editar servicio**
   - Click "Edit" en una fila
   - Modificar campos y "Guardar" → tabla se actualiza

3. **Eliminar servicio**
   - Click "Edit" → "Eliminar" → confirmar "Eliminar"
   - El servicio desaparece de la lista

4. **Validación (422)**
   - Crear con nombre vacío → mensaje bajo el campo

### Users (login como Admin)

1. **Invitar usuario**
   - Ir a `/users`
   - Click "Invite User"
   - Completar nombre, email, rol
   - Usar "Generar" para password (se muestra para copiar)
   - Click "Crear" → usuario aparece en tabla

2. **Editar usuario**
   - Click "Manage" en una fila
   - Cambiar nombre, rol o contraseña (opcional)
   - "Guardar"

3. **Eliminar usuario**
   - "Manage" → "Eliminar" → confirmar
   - No debe mostrarse Eliminar para tu propio usuario

4. **Validación (422)**
   - Crear con email duplicado → error
   - Password &lt; 8 caracteres → error

### Rutas
- Solo se usan llamadas a `/api/*` (axios). No se tocaron rutas web.

---

## Build

```bash
npm run build
```
✅ Build exitoso.
