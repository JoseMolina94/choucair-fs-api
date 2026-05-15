# Uso de herramientas de IA — choucair-fs-api

Documento obligatorio del entregable. Describe cómo se utilizó IA de forma responsable durante el desarrollo de la prueba técnica.

---

## 1. Herramientas utilizadas

| Herramienta | Uso principal |
|-------------|---------------|
| **Cursor** (agente / chat integrado (ambos configurados con AI Opus 4.6 y Sonnet 4.6 ambos componen el agente Claude)) | Generación de estructura, código base, configuración, documentación y corrección de errores |
| **Cursor Tab** (autocompletado) | Sugerencias puntuales al escribir TypeScript |

No se utilizaron otros servicios (ChatGPT web, Copilot en otro IDE, etc.).

---

## 2. Para qué se utilizó la IA

### Planificación y arquitectura

- Definición de la estructura modular en `frontend-client/src` (`app/`, `modules/requests/` con `pages/`, `components/`, `styles/`, `shared/`).
- Propuesta de estructura equivalente en `backend-api` (capas routes → services → repository).
- Comparativa **Vite vs Next.js** para elegir el stack React del frontend.

### Implementación asistida

- Scaffold inicial del módulo `requests` en frontend (componentes, hooks, servicios, tipos).
- Scaffold inicial del proyecto `backend-api` (Express, endpoints, reglas, tests).
- Configuración de alias `@/`, `.env.example`, CORS y cliente HTTP.
- Mejorar la redacción de `README.md`, `spec.md` y este `ai-usage.md`.

---

## 3. Qué validé e hice manualmente

El código de **`backend-api`** y **`frontend-client`** lo desarrolle como candidato, usando Cursor como asistente. La IA ayudó con borradores iniciales (estructura, boilerplate y documentación); Definí, revisé cada cambio, implementé refactors, ejecuté pruebas y dejé el proyecto listo para entregar.

La IA acelera la escritura, pero **no sustituye la verificación humana**. En concreto:

- **Implementación del código:** desarrollo del API (Express, capas, reglas de negocio, tests) y del cliente React (módulo `requests`, consumo del API, UI y tests). Todo lo generado por IA se revisó, ajustó e integró antes de considerarse parte del entregable.
- **Flujo end-to-end:** backend en `:3000` y frontend en `:5173`; crear, listar, aprobar y rechazar solicitudes desde la UI.
- **Reglas de negocio:** intentar aprobar o rechazar una solicitud ya `APPROVED` y confirmar respuesta `409` del API.
- **Título obligatorio:** crear solicitud sin título con botón deshabilitado en UI; el API devuelve `400` si se fuerza el `POST`.
- **Tests:** ejecutar `npm test` en `backend-api` y `frontend-client` y confirmar que todos pasan.
- **Build:** `npm run build` en ambos proyectos sin errores de TypeScript.
- **CORS y conectividad:** sin backend activo, la UI muestra error y el botón **Reintentar**.
- **Coherencia spec/código:** revisión de que endpoints, estados y códigos HTTP coinciden con `spec.md`.
- **Refactor UI:** comprobar que crear, aprobar y rechazar siguen funcionando tras mover `RequestListPage` a `pages/` y extraer `RequestListCard`.
- **Componentización:** revisé y apliqué la separación en capas y módulos (frontend: `pages/`, `components/`, `hooks/`; backend: routes, services, repository) para mantener el código legible y mantenible.
- **Documentación:** lectura del README y prueba de comandos de instalación en Windows (PowerShell / Git Bash).

### Comandos usados en validación

```bash
# Backend
cd backend-api && npm run dev
cd backend-api && npm test

# Frontend
cd frontend-client && npm run dev
cd frontend-client && npm test
```

---

## 4. Problemas encontrados

- **Build fallaba con `baseUrl`**
  - *Causa:* deprecación en TypeScript 6.
  - *Solución:* rutas explícitas en `paths`: `"@/*": ["./src/*"]`.

- **`npm run build` fallaba tras añadir Vitest**
  - *Causa:* conflicto de tipos entre Vite 8 y Vitest en un solo `vite.config.ts`.
  - *Solución:* archivo `vitest.config.ts` separado.

- **UI con etiquetas inválidas**
  - *Causa:* error de generación (etiquetas HTML incorrectas).
  - *Solución:* reemplazo por `<section>` y `<div>` válidos.

- **Datos se pierden al reiniciar el API**
  - *Causa:* persistencia en memoria por diseño.
  - *Solución:* documentado en `spec.md` y README; aceptable para el alcance del reto.

- **Express 5 — tipo de `params.id`**
  - *Causa:* tipado más estricto (`string | string[]`).
  - *Solución:* helper `getRouteId()` con validación.

---

## 5. Uso responsable — Principios aplicados

1. **La IA propone; el desarrollador decide.** Se eligió Vite + React frente a Next.js tras evaluar el enunciado (API Node separado, SPA simple).
2. **El backend es la fuente de verdad** para reglas de negocio (RN-07). La UI replica `canChangeStatus` solo para experiencia de usuario, no como única barrera.
3. **Todo código generado se revisó** antes de considerarlo válido: imports, tipos, mensajes de error y alineación con el spec.
4. **Tests automatizados** cubren reglas críticas; la validación manual cubre el flujo integrado.
5. **Transparencia:** este documento declara explícitamente qué partes fueron asistidas por IA.

---

## 6. Qué no delegué a la IA

- **Autoría del código:** la implementación final en backend y frontend, con revisión y criterio propio.
- Decisión final de stack (Vite vs Next.js).
- Arquitectura modular y refactors (p. ej. `RequestListCard`, carpeta `pages/`, Swagger).
- Pruebas manuales en navegador con ambos servidores en ejecución.
- Commits, push y estrategia de entrega en Git.


