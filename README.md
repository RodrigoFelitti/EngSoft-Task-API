# API de Gerenciamento de Tarefas

Uma API REST completa para gerenciamento de usuários e tarefas, desenvolvida em Node.js com Express, incluindo autenticação JWT, logs detalhados e notificações Discord.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login de usuários com JWT
- Logout com blacklist de tokens
- Middleware de autenticação

### 👥 Usuários
- CRUD completo de usuários
- Validação de campos obrigatórios
- Busca por ID

### 📋 Tarefas
- CRUD completo de tarefas
- Filtros avançados (status, prioridade, deadline)
- Busca por responsável
- Valores padrão para campos opcionais

### 📊 Recursos Adicionais
- Logs detalhados com Winston
- Notificações Discord para tarefas importantes
- Documentação Swagger/OpenAPI 3.0
- Testes automatizados com Jest
- Cobertura de testes de 69.41%

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Autenticação
- **LowDB** - Banco de dados JSON
- **Winston** - Sistema de logs
- **Jest** - Framework de testes
- **Swagger/OpenAPI** - Documentação da API

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd Learn-node
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor:**
   ```bash
   npm start
   ```

4. **Acesse a documentação:**
   - Swagger UI: `http://localhost:5000/api-docs`
   - API: `http://localhost:5000`

## 📚 Documentação

### Swagger UI
A documentação interativa está disponível em `http://localhost:5000/api-docs` e inclui:
- Todos os endpoints documentados
- Exemplos de requisição e resposta
- Interface para testar a API
- Schemas de validação
- Autenticação JWT integrada

### Documentação Detalhada
- [Guia de Testes Manuais](docs/Tests.md) - Casos de teste completos
- [Documentação Swagger](docs/Swagger.md) - Informações sobre a documentação
- [Guia Prático](docs/Exemplo-Uso-Swagger.md) - Como usar a API via Swagger

## 🔧 Scripts Disponíveis

```bash
npm start          # Inicia o servidor com nodemon
npm test           # Executa os testes com cobertura
npm run clean-db   # Limpa o banco de dados
```

## 📋 Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/logout` - Logout de usuário

### Usuários
- `POST /users` - Criar usuário
- `GET /users/{id}` - Buscar usuário por ID
- `PUT /users/{id}` - Atualizar usuário
- `DELETE /users/{id}` - Deletar usuário

### Tarefas
- `POST /tasks` - Criar tarefa
- `GET /tasks/{id}` - Buscar tarefa por ID
- `PUT /tasks/{id}` - Atualizar tarefa
- `DELETE /tasks/{id}` - Deletar tarefa
- `GET /tasks/filter` - Filtrar tarefas
- `GET /tasks/by-assignee` - Buscar tarefas por responsável

## 🧪 Testes

### Executar Testes
```bash
npm test
```

### Cobertura de Testes
- **69.41%** de cobertura geral
- **3 test suites** (auth, users, tasks)
- **30 testes** cobrindo todos os fluxos principais

### Testes Manuais
Consulte [docs/Tests.md](docs/Tests.md) para casos de teste manuais detalhados.

## 📊 Estrutura do Projeto

```
Learn-node/
├── controllers/          # Controladores da API
├── middlewares/          # Middlewares (auth, logs, discord)
├── routes/              # Definição das rotas
├── services/            # Lógica de negócio
├── test/                # Testes automatizados
├── docs/                # Documentação
├── logs/                # Arquivos de log
├── scripts/             # Scripts utilitários
├── swagger.js           # Configuração do Swagger
├── server.js            # Servidor principal
└── index.js             # Configuração da aplicação
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação:

1. **Login:** `POST /auth/login` com username
2. **Token:** Use o token retornado no header `Authorization: Bearer {token}`
3. **Logout:** `POST /auth/logout` invalida o token

## 📝 Logs

- **Arquivo:** `logs/` - Logs detalhados de todas as operações
- **Console:** Logs de desenvolvimento e erros
- **Formato:** JSON com timestamp e contexto

## 🔔 Notificações Discord

Tarefas importantes geram notificações automáticas no Discord:
- Criação de tarefas de alta prioridade
- Atualização de status para "done"
- Configurável via variáveis de ambiente

## 🚀 Como Usar

### 1. Via Swagger UI (Recomendado)
1. Acesse `http://localhost:5000/api-docs`
2. Faça login com username "admin"
3. Autorize com o token JWT
4. Teste os endpoints interativamente

### 2. Via Cliente HTTP
```bash
# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin"}'

# Usar token
curl -X GET http://localhost:5000/users/1 \
  -H "Authorization: Bearer {seu_token}"
```

### 3. Exemplos Completos
Consulte [docs/Exemplo-Uso-Swagger.md](docs/Exemplo-Uso-Swagger.md) para exemplos práticos.

## 🐛 Solução de Problemas

### Servidor não inicia
- Verifique se a porta 5000 está livre
- Confirme se todas as dependências estão instaladas

### Erro de autenticação
- Verifique se o token está válido
- Faça login novamente se necessário

### Erro 404
- Confirme se o ID do recurso existe
- Verifique se a URL está correta

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Adicione testes
5. Atualize a documentação
6. Faça o pull request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👥 Equipe

Desenvolvido como projeto de aprendizado em Node.js com foco em:
- Arquitetura limpa
- Testes automatizados
- Documentação completa
- Boas práticas de desenvolvimento

---

**Acesse a documentação interativa:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)