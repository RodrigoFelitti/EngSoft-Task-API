import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Tarefas',
      version: '1.0.0',
      description: 'API de gerenciamento de tarefas, se for necessário acesse a pasta docs/Swagger.md para mais informações',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'servidor'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário'
            },
            username: {
              type: 'string',
              description: 'Nome do usuário',
              example: 'joao'
            },
            age: {
              type: 'integer',
              description: 'Idade do usuário',
              example: 25
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@email.com'
            }
          },
          required: ['username', 'age', 'email']
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da tarefa'
            },
            title: {
              type: 'string',
              description: 'Título da tarefa',
              example: 'Implementar API'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'done'],
              description: 'Status da tarefa',
              example: 'pending'
            },
            assignee: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário responsável pela tarefa'
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada da tarefa',
              example: 'Criar endpoints para gerenciamento de tarefas'
            },
            prioridade: {
              type: 'string',
              enum: ['baixa', 'normal', 'alta'],
              description: 'Prioridade da tarefa',
              example: 'alta'
            },
            deadline: {
              type: 'string',
              format: 'date',
              description: 'Data limite para conclusão',
              example: '2025-01-15'
            }
          },
          required: ['title', 'status', 'assignee']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Nome do usuário para login',
              example: 'admin'
            }
          },
          required: ['username']
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticação'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

export const specs = swaggerJsdoc(options); 