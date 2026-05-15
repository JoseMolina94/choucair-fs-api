export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Requests API',
    version: '1.0.0',
    description:
      'API REST para gestionar solicitudes con flujo de aprobación. Ver también `spec.md` en la raíz del repositorio.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Desarrollo local',
    },
  ],
  tags: [
    { name: 'Health', description: 'Estado del servicio' },
    { name: 'Requests', description: 'Gestión de solicitudes' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Servicio disponible',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                  required: ['status'],
                },
              },
            },
          },
        },
      },
    },
    '/requests': {
      get: {
        tags: ['Requests'],
        summary: 'Listar solicitudes',
        operationId: 'listRequests',
        responses: {
          '200': {
            description: 'Listado de solicitudes (más recientes primero)',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Request' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Requests'],
        summary: 'Crear solicitud',
        operationId: 'createRequest',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRequestInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Solicitud creada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Request' },
              },
            },
          },
          '400': {
            description: 'Título inválido u obligatorio',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/requests/{id}': {
      patch: {
        tags: ['Requests'],
        summary: 'Aprobar o rechazar solicitud',
        operationId: 'updateRequestStatus',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID de la solicitud',
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateRequestStatusInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Solicitud actualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Request' },
              },
            },
          },
          '400': {
            description: 'Estado inválido o ID mal formado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Solicitud no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '409': {
            description: 'La solicitud no está en estado PENDING',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: {
                  message:
                    'Solo se puede aprobar o rechazar una solicitud en estado PENDING',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RequestStatus: {
        type: 'string',
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
      },
      Request: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Compra de equipo' },
          status: { $ref: '#/components/schemas/RequestStatus' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-15T17:00:00.000Z',
          },
        },
        required: ['id', 'title', 'status', 'createdAt'],
      },
      CreateRequestInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Compra de laptop' },
        },
        required: ['title'],
      },
      UpdateRequestStatusInput: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['APPROVED', 'REJECTED'],
          },
        },
        required: ['status'],
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        required: ['message'],
      },
    },
  },
} as const
