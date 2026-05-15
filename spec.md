# Especificación — Gestión de solicitudes con flujo de aprobación

Documento fuente de verdad del proyecto (Spec-Driven Development). El código en `backend-api` y `frontend-client` debe alinearse con esta especificación.

---

## 1. Objetivo

Construir una aplicación simple que permita **crear solicitudes**, **listarlas** y **aprobarlas o rechazarlas** mediante un flujo de aprobación con estados definidos.

---

## 2. Modelo de datos

### Entidad: `Request`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` (UUID) | Identificador único generado por el servidor |
| `title` | `string` | Título de la solicitud (obligatorio, no vacío tras `trim`) |
| `status` | `RequestStatus` | Estado actual de la solicitud |
| `createdAt` | `string` (ISO 8601) | Fecha de creación en UTC |

### Enum: `RequestStatus`

| Valor | Descripción |
|-------|-------------|
| `PENDING` | Estado inicial al crear la solicitud |
| `APPROVED` | Solicitud aprobada (estado final) |
| `REJECTED` | Solicitud rechazada (estado final) |

### Ejemplo

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Compra de laptop",
  "status": "PENDING",
  "createdAt": "2026-05-15T17:00:00.000Z"
}
```

---

## 3. Reglas de negocio

| ID | Regla | Capa principal |
|----|-------|----------------|
| RN-01 | Toda solicitud nueva se crea con `status = PENDING` | Backend |
| RN-02 | El campo `title` es obligatorio; cadenas vacías o solo espacios se rechazan | Backend |
| RN-03 | Solo se puede **aprobar** o **rechazar** una solicitud en estado `PENDING` | Backend (+ reflejo en UI) |
| RN-04 | No se pueden modificar solicitudes en estado `APPROVED` o `REJECTED` | Backend |
| RN-05 | Los únicos estados válidos en una actualización son `APPROVED` y `REJECTED` | Backend |
| RN-06 | La UI muestra botones de acción solo si la solicitud permite cambio de estado (`PENDING`) | Frontend (`canChangeStatus`) |
| RN-07 | El backend es la autoridad final; la UI no sustituye la validación del API | Arquitectura |

### Función compartida (concepto)

```
canChangeStatus(request) → true si request.status === 'PENDING'
```

Implementada en:

- `backend-api/src/modules/requests/utils/canChangeStatus.ts`
- `frontend-client/src/modules/requests/utils/canChangeStatus.ts`

Cubierta por tests unitarios en ambos proyectos.

---

## 4. API REST

**Base URL (desarrollo):** `http://localhost:3000`

### 4.1 Listar solicitudes

```
GET /requests
```

**Respuesta exitosa:** `200 OK`

```json
[
  {
    "id": "...",
    "title": "...",
    "status": "PENDING",
    "createdAt": "..."
  }
]
```

Orden: más recientes primero (`createdAt` descendente).

---

### 4.2 Crear solicitud

```
POST /requests
Content-Type: application/json
```

**Cuerpo:**

```json
{
  "title": "Título de la solicitud"
}
```

**Respuesta exitosa:** `201 Created` — objeto `Request` creado.

**Errores:**

| Código | Condición |
|--------|-----------|
| `400` | `title` ausente, vacío o solo espacios |

---

### 4.3 Aprobar o rechazar solicitud

```
PATCH /requests/:id
Content-Type: application/json
```

**Cuerpo:**

```json
{
  "status": "APPROVED"
}
```

o

```json
{
  "status": "REJECTED"
}
```

**Respuesta exitosa:** `200 OK` — objeto `Request` actualizado.

**Errores:**

| Código | Condición |
|--------|-----------|
| `400` | `status` inválido o ausente |
| `404` | Solicitud no encontrada |
| `409` | La solicitud no está en `PENDING` |

---

### 4.4 Health check (auxiliar)

```
GET /health
```

**Respuesta:** `200 OK` — `{ "status": "ok" }`

---

### 4.5 Documentación OpenAPI (Swagger)

| Ruta | Descripción |
|------|-------------|
| `GET /api-docs` | Interfaz Swagger UI para probar el API |
| `GET /api-docs.json` | Especificación OpenAPI 3.0 en JSON |

La definición vive en `backend-api/src/shared/swagger/openapi.ts` y debe mantenerse alineada con este spec.

---

### 4.6 Formato de error

```json
{
  "message": "Descripción del error"
}
```

---

## 5. Frontend — Comportamiento esperado

| Funcionalidad | Descripción |
|---------------|-------------|
| Listado | Al cargar, consume `GET /requests` y muestra todas las solicitudes |
| Crear | Formulario con campo título; envía `POST /requests` |
| Aprobar / Rechazar | Botones visibles solo en `PENDING`; envían `PATCH /requests/:id` |
| Actualización de UI | Tras crear o cambiar estado, la lista se actualiza sin recargar la página |
| Errores | Muestra mensajes del API; opción de reintentar si falla la carga inicial |

**Componentes principales:**

- `pages/RequestListPage` — formulario de creación y listado
- `components/RequestListCard` — tarjeta individual con acciones de aprobar/rechazar

**URL del API (configurable):** variable `VITE_API_BASE_URL` (default `http://localhost:3000`).

---

## 6. Decisiones técnicas

### 6.1 Arquitectura general

- **Monorepo** con dos proyectos independientes: `backend-api` y `frontend-client`.
- **Spec-Driven Development:** este documento precede y guía la implementación.
- **Organización modular** por dominio (`modules/requests`) en ambos lados.

### 6.2 Backend

| Decisión | Justificación |
|----------|---------------|
| Node.js + TypeScript | Tipado estático y alineación con el frontend |
| Express 5 | Framework maduro y adecuado para una API REST pequeña |
| Capas: routes → controllers → services → repository | Separación de responsabilidades y testabilidad |
| Persistencia en memoria (`Map`) | Suficiente para la prueba; sin complejidad de base de datos |
| `AppError` + middleware centralizado | Manejo HTTP consistente |
| CORS habilitado | Permite consumo desde el cliente Vite en otro puerto |
| Swagger UI (`/api-docs`) | Documentación interactiva OpenAPI 3.0 |
| Vitest | Tests unitarios de reglas de negocio |

### 6.3 Frontend

| Decisión | Justificación |
|----------|---------------|
| React 19 + Vite 8 | SPA rápida de configurar, HMR en desarrollo |
| TypeScript | Contrato de tipos alineado con el API |
| Estructura modular (`modules/requests`) | Misma mentalidad que el backend: `pages/`, `components/`, `hooks/`, `services/`, `utils/`, `styles/` |
| `RequestListPage` + `RequestListCard` | Página vs componente de fila; responsabilidades separadas |
| Hook `useRequests` | Encapsula estado y llamadas al API |
| Keys de lista `requests-{index}` | Evita usar el UUID como `key` de React en el listado |
| `apiClient` compartido | Manejo uniforme de errores HTTP |
| `canChangeStatus` en UI | Refleja RN-06; el backend sigue siendo autoridad (RN-07) |
| Vitest (entorno `node`) | Test unitario de regla pura sin DOM |
| Alias `@/` → `src/` | Imports más legibles en módulos |

### 6.4 Seguridad y alcance (fuera de scope)

No implementado en esta versión (explícitamente fuera del reto):

- Autenticación / autorización
- Base de datos persistente
- Paginación, filtros o búsqueda
- Validación de esquema con librería externa (p. ej. Zod)

---

## 7. Criterios de aceptación

- [ ] Crear solicitud con título válido → `201`, estado `PENDING`
- [ ] Crear sin título → `400`
- [ ] Listar solicitudes → `200`, array de `Request`
- [ ] Aprobar solicitud `PENDING` → `200`, estado `APPROVED`
- [ ] Rechazar solicitud `PENDING` → `200`, estado `REJECTED`
- [ ] Aprobar/rechazar solicitud ya finalizada → `409`
- [ ] PATCH con id inexistente → `404`
- [ ] UI oculta acciones en estados finales
- [ ] Tests unitarios backend y frontend pasan (`npm test` en cada proyecto)

---

## 8. Trazabilidad spec → código

| Spec | Backend | Frontend |
|------|---------|----------|
| RN-02 | `requestService.createRequest` | Validación básica en formulario (`trim`) |
| RN-03, RN-04 | `requestService.updateRequestStatus` + `canChangeStatus` | `canChangeStatus` + `RequestListCard` |
| Listado y creación | `requestController` + `requestService` | `pages/RequestListPage` + `useRequests` |
| Endpoints | `requestRoutes.ts` | `requestsApi.ts` |
| Modelo | `types/request.ts` | `types/request.ts` |
