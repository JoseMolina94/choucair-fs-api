# choucair-fs-api

Aplicación full-stack para gestionar solicitudes con flujo de aprobación (crear, listar, aprobar o rechazar). Desarrollada como prueba técnica con enfoque **Spec-Driven Development** y arquitectura modular.

## Estructura del repositorio

```
choucair-fs-api/
├── backend-api/          # API REST (Node.js + TypeScript + Express)
├── frontend-client/      # Cliente web (React + TypeScript + Vite)
├── spec.md               # Especificación (reglas, endpoints, decisiones)
├── ai-usage.md           # Uso responsable de herramientas de IA
└── README.md
```

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| Backend | Node.js, TypeScript, Express 5, Vitest |
| Frontend | React 19, TypeScript, Vite 8, Vitest |
| Persistencia | En memoria (reinicio del servidor borra los datos) |

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (recomendado 20 LTS)
- npm (incluido con Node.js)

Verificar instalación:

```bash
node -v
npm -v
```

## Puesta en marcha

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd choucair-fs-api

cd backend-api
npm install

cd ../frontend-client
npm install
```

### 2. Variables de entorno

**Backend** (`backend-api/.env`):

```bash
cd backend-api
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del API | `3000` |

**Frontend** (`frontend-client/.env`):

```bash
cd frontend-client
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_BASE_URL` | URL base del API | `http://localhost:3000` |

### 3. Ejecutar en desarrollo

Abrir **dos terminales**:

**Terminal 1 — API:**

```bash
cd backend-api
npm run dev
```

El API queda disponible en `http://localhost:3000`.

Documentación Swagger: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

**Terminal 2 — Frontend:**

```bash
cd frontend-client
npm run dev
```

Abrir en el navegador la URL que muestra Vite (por defecto `http://localhost:5173`).

### 4. Probar la aplicación

1. En la interfaz, escribir un título en el formulario y pulsar **Crear**.
2. La solicitud aparece con estado `PENDING`.
3. Usar **Aprobar** o **Rechazar** para cambiar el estado.
4. Los botones solo se muestran mientras la solicitud está en `PENDING`.

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/health` | Estado del servicio |
| `GET` | `/api-docs` | Documentación interactiva Swagger UI |
| `GET` | `/api-docs.json` | Especificación OpenAPI 3 en JSON |
| `GET` | `/requests` | Listar solicitudes |
| `POST` | `/requests` | Crear solicitud (`{ "title": "..." }`) |
| `PATCH` | `/requests/:id` | Aprobar o rechazar (`{ "status": "APPROVED" \| "REJECTED" }`) |

### Ejemplo con curl

```bash
# Crear
curl -X POST http://localhost:3000/requests \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Compra de equipo\"}"

# Listar
curl http://localhost:3000/requests

# Aprobar (reemplazar {id} por el UUID devuelto)
curl -X PATCH http://localhost:3000/requests/{id} \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"APPROVED\"}"
```

## Tests

**Backend:**

```bash
cd backend-api
npm test
```

**Frontend:**

```bash
cd frontend-client
npm test
```

Modo watch en ambos proyectos: `npm run test:watch`.

Los tests cubren reglas de negocio clave (por ejemplo: no aprobar o rechazar una solicitud que ya no está en `PENDING`).

## Build para producción

**Backend:**

```bash
cd backend-api
npm run build
npm start
```

**Frontend:**

```bash
cd frontend-client
npm run build
npm run preview
```

Los artefactos del frontend se generan en `frontend-client/dist/`.

## Arquitectura

Ambos proyectos organizan el código por **módulos de dominio** bajo `src/modules/requests/`:

- **Backend:** rutas → controladores → servicios → repositorio (en memoria)
- **Frontend:**
  - `pages/` — vistas (`RequestListPage`)
  - `components/` — piezas de UI (`RequestListCard`)
  - `hooks/` — estado y llamadas al API (`useRequests`)
  - `services/` — cliente HTTP del módulo
  - `utils/` — reglas en UI (`canChangeStatus`)
  - `styles/` — estilos del módulo
  - `__tests__/` — tests unitarios

La lógica compartida transversal vive en `src/shared/` (`api/`, `constants/`).

## Documentación de la prueba

- [`spec.md`](./spec.md) — Reglas de negocio, contrato de endpoints y decisiones técnicas.
- [`ai-usage.md`](./ai-usage.md) — Herramientas de IA utilizadas, validación manual y aprendizajes.

## Licencia

Ver [LICENSE](./LICENSE).
