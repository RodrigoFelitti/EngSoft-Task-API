# API de Gerenciamento de Tarefas

### Engenharia de Software: Arquitetura e Padrões - 2025/01
##### Professor Guilherme Lacerda


##### Alunos: Arthur Andrade, Gustavo Cortezia, João Vitor Dallarosa e Rodrigo Felitti

## 1. Visão geral

### Objetivo do Sistema 
Fizemos este sistema tem como objetivo facilitar a gestão de tarefas em equipes, permitindo o cadastro de usuários, criação, atribuição e acompanhamento de tarefas de forma colaborativa.
Buscamos garantir estabilidade e simplicidade na implementação evitando over-engineering e garantindo que aquilo que entregamos como MVP estivesse funcional e com uma boa qualidade. Entendemos que em sistemas produtivos seria necessário fazer diversos polimentos quanto a segurança, idempotência e performance. Nosso principal objetivo foi entregar os requisitos mínimos do trabalho com uma boa estabilidade dentro do prazo estipulado, garantindo que o projeto tivesse capacidade de extensão de funcionalidades e facilidade de ser mantido ou modificado para otimizar funcionalidades existentes

## 2. Funcionalidades

### Autenticação
- Login de usuários com JWT
- Logout com blacklist de tokens
- Middleware de autenticação

### Usuários
- CRUD completo de usuários
- Validação de campos obrigatórios
- Busca por ID

### Tarefas
- CRUD completo de tarefas
- Filtros avançados (status, prioridade, deadline)
- Busca por responsável
- Valores padrão para campos opcionais

### Recursos Adicionais
- Logs detalhados com Winston
- Notificações Discord para tarefas importantes
- Documentação Swagger/OpenAPI 3.0
- Testes automatizados com Jest
- Cobertura de testes de 69.41%

## 3. Tecnologias usadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Autenticação
- **LowDB** - Banco de dados JSON
- **Winston** - Sistema de logs
- **Jest** - Framework de testes
- **Swagger/OpenAPI** - Documentação da API

## 4. Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/RodrigoFelitti/EngSoft-Task-API.git
   cd EngSoft-Task-API
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor:**
   ```bash
   npm start
   ```

4. **Crie um arquivo .env:**
- Crie um servidor no discord para fins de teste, ou adicione uma integração com webhooks
- Pode consultar como fazer isso pela [documentação do discord](https://support.discord.com/hc/pt-br/articles/228383668-Usando-Webhooks)
- Crie um arquivo .env na root do projeto e adicione o seguinte trecho `DISCORD_WEBHOOK_URL= {link do webhook criado}`
- Isso garante que nenhum erro ocorrerá quando o webhook for chamado.

5. **Acesse a documentação:**
   - Swagger UI: `http://localhost:5000/api-docs`
   - API: `http://localhost:5000`

## 5. Documentação

### Swagger
A documentação interativa está disponível em `http://localhost:5000/api-docs` e inclui:
- Todos os endpoints documentados
- Exemplos de requisição e resposta
- Interface para testar a API
- Schemas de validação
- Autenticação JWT integrada

### Documentação Detalhada
- [Guia de Testes Manuais](docs/Tests.md) - Casos de testes funcionais
- [Documentação Swagger](docs/Swagger.md) - Informações sobre a documentação
- [Guia de arquitetura](docs/Architecture.md) - Como pensamos na solução

## 6. Scripts Disponíveis

```bash
npm start          # Inicia o servidor com nodemon
npm test           # Executa os testes com cobertura
npm run clean-db   # Limpa o banco de dados
```

## 7. Endpoints da API

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

## 8. Testes

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

## 9. Estrutura do Projeto

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

## 10. Autenticação

A API usa JWT (JSON Web Tokens) para autenticação:

1. **Login:** `POST /auth/login` com username
2. **Token:** Use o token retornado no header `Authorization: Bearer {token}`
3. **Logout:** `POST /auth/logout` invalida o token

## 11. Logs

- **Arquivo:** `logs/` - Logs detalhados de todas as operações
- **Console:** Logs de desenvolvimento e erros
- **Formato:** JSON com timestamp e contexto

## 12. Notificações Discord

Tarefas importantes geram notificações automáticas no Discord:
- Criação de tarefas
- Atualização de status
- Configurável via variáveis de ambiente

## 13. Como Usar

### 1. Via Swagger
1. Acesse `http://localhost:5000/api-docs`
2. Faça login com username "admin"
3. Autorize com o token JWT
4. Teste os endpoints interativamente

### 2. Via Cliente HTTP
 - Não entraremos em muitos detalhes já que não é a intenção da documentação, porém utilizamos Bruno durante o desenvolvimento para facilitar testes dos diferentes endpoints.

## 14 Sobre a história projeto

- Para iniciarmos o desenvolvimento do trabalho, o time teve algumas conversas sobre quais eram os requisitos da aplicação e como poderíamos cobrir estes requisitos da forma mais simples e estável no tempo requisitado. Visto que todos do grupo sabiam tecnologias diferentes, tivemos algumas curvas de aprendizado durante o desenvolvimento, e certa dificuldade em paralelizar tarefas visto que algumas funcionalidades dependiam fortemente de como implentaríamos outra funcionalidades. Tivemos que migrar de repositório algumas vezes em função de alguns conflitos com o github, de modo que conseguíssemos entregar o MVP da API em um repositório limpo, funcional e organizado.

- Para mais detalhes de implementação, consulte a página `docs/Architecture.md`. Obrigado pela atenção!
