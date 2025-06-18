# Testes do grupo

O grupo focou inicialmente em garantir a qualidade dos testes manuais e unitários para cada um dos endpoints da API sempre buscando um mínimo de 60%. Ao longo do desenvolvimento, perecebemos que valia muito a pena tentar fazer/modificar testes antes de criar uma funcionalidade nova para garantir que os testes feitos anteriormente estavam passando e garantir que a nova funcionalidade tivesse uma boa cobertura de testes, garantindo, deste modo, estabilidade no produto. 

A nossa abordagem para a criação de testes foi TDD (quando conseguíamos), no entanto, houveram momentos que não sabíamos/conseguiamos criar testes por falta de entendimento conciso de como iríamos implementar algo. Para contornar esses problemas tivemos que voltar algumas vezes a testes que já tinhamos feito e mudar alguns mocks e alguns expectativas dos testes para atingirmos nossa meta a tempo.

Porém, mesmo com algumas dificuldades no caminho conseguimos atingir uma média de 69.41% de coverage no nosso código *(pode ser verificado rodando `npm test` caso o projeto esteja configurado corretamente)*, e um aproveitamento de 100% dos casos de teste manuais que pensamos em implementar para garantir o funcionamento das funcionalidades. Foram um total de 3 test suites feitos (para cada um dos controllers) 10 testes em cada um cobrindo o fluxo de ação imaginado pelo grupo para o uso da API

## Funcionalidades

### Autenticação
- Login de usuários
- Logout com blacklist de tokens
- Middleware de autenticação JWT

### Usuários
- Criação de usuários (username, age, email obrigatórios)
- Busca de usuário por ID
- Atualização de usuários
- Exclusão de usuários

### Tarefas
- Criação de tarefas (title, status, assignee obrigatórios)
- Busca de tarefa por ID
- Atualização de tarefas
- Exclusão de tarefas
- Filtros avançados (status, prioridade, deadline)
- Busca de tarefas por responsável

## Plano de Testes Manuais

### Pré-requisitos
1. Instalar dependências: `npm install`
2. Iniciar o servidor: `npm start`
3. Ter um cliente HTTP (Postman, Insomnia, curl, **bruno [usado pelo grupo]**, etc.)
4. O serviço sobe no http://localhost:5000

### 1. Testes de Autenticação

#### 1.1 Login de Usuário
**Endpoint:** `POST /auth/login`
**Body:**
```json
{
  "username": "admin"
}
```
**Resultado Esperado:**
- Status: 200
- Response: `{"token": "jwt_token_aqui"}`

#### 1.2 Logout
**Endpoint:** `POST /auth/logout`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: `{"message": "Logged out successfully"}`

=====================================================

### 2. Testes de Usuários

#### 2.1 Criar Usuário (Sucesso)
**Endpoint:** `POST /users`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "username": "joao",
  "age": 25,
  "email": "joao@email.com"
}
```
**Resultado Esperado:**
- Status: 201
- Response: `"done"`

#### 2.2 Criar Usuário sem Campos Obrigatórios
**Endpoint:** `POST /users`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "username": "maria"
}
```
**Resultado Esperado:**
- Status: 400
- Response: `{"error": "Username e email são obrigatórios"}`

#### 2.3 Buscar Usuário por ID
**Endpoint:** `GET /users/{id}`
**Headers:** `Authorization: Bearer {token}`

*Obs: O id pode ser encontrado no console, ou nos logs gerados para a execução*

**Resultado Esperado:**
- Status: 200
- Response:
```json
{
  "username": "joao",
  "age": 25,
  "email": "joao@email.com"
}
```

#### 2.4 Atualizar Usuário
**Endpoint:** `PUT /users/{id}`
**Headers:** `Authorization: Bearer {token}`

*Obs: O resultado pode ser consultado fazendo o request 2.3 pelo mesmo ID*

**Body:**
```json
{
  "username": "joao_silva",
  "age": 26,
  "email": "joao.silva@email.com"
}
```
**Resultado Esperado:**
- Status: 200
- Response: `"done"`

#### 2.5 Deletar Usuário
**Endpoint:** `DELETE /users/{id}`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: `"done"`

===============================================================

### 3. Testes de Tarefas

#### 3.1 Criar Tarefa (Sucesso)
**Endpoint:** `POST /tasks`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "title": "Implementar API",
  "status": "pending",
  "assignee": "{user_id}",
  "descricao": "Criar endpoints para gerenciamento de tarefas",
  "prioridade": "alta",
  "deadline": "2025-01-15"
}
```
**Resultado Esperado:**
- Status: 201
- Response com task completa incluindo ID gerado

#### 3.2 Criar Tarefa com Valores Padrão
**Endpoint:** `POST /tasks`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "title": "Tarefa Simples",
  "status": "pending",
  "assignee": "{user_id}"
}
```
**Resultado Esperado:**
- Status: 201
- Response com `prioridade: "normal"` e `deadline: null`

#### 3.3 Buscar Tarefa por ID
**Endpoint:** `GET /tasks/{id}`
**Headers:** `Authorization: Bearer {token}`

*Obs: O id pode ser encontrado no console, ou nos logs gerados para a execução*

**Resultado Esperado:**
- Status: 200
- Response com task completa incluindo dados do assignee

#### 3.4 Atualizar Tarefa
**Endpoint:** `PUT /tasks/{id}`
**Headers:** `Authorization: Bearer {token}`
**Body:**
```json
{
  "title": "API Atualizada",
  "status": "done",
  "assignee": "{user_id}",
  "descricao": "Implementação concluída",
  "prioridade": "baixa",
  "deadline": "2025-01-20"
}
```
**Resultado Esperado:**
- Status: 200
- Response: `"done"`

#### 3.5 Deletar Tarefa
**Endpoint:** `DELETE /tasks/{id}`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: `"done"`

================================================================

### 4. Testes de Filtros de Tarefas

#### 4.1 Filtrar por Status
**Endpoint:** `GET /tasks/filter?status=pending`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: Array com apenas tarefas com status "pending"

#### 4.2 Filtrar por Prioridade
**Endpoint:** `GET /tasks/filter?prioridade=alta`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: Array com apenas tarefas com prioridade "alta"

#### 4.3 Filtrar por Deadline
**Endpoint:** `GET /tasks/filter?deadlineAfter=2025-01-01`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: Array com apenas tarefas com deadline após 2025-01-01

#### 4.4 Filtro Combinado
**Endpoint:** `GET /tasks/filter?status=pending&prioridade=alta`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: Array com tarefas que atendem ambos os critérios

#### 4.5 Filtrar sem Parâmetros
**Endpoint:** `GET /tasks/filter`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: Array com todas as tarefas

=============================================

### 5. Testes de Busca por Responsável

#### 5.1 Buscar Tarefas por Responsável
**Endpoint:** `GET /tasks/by-assignee?assignedTo={user_id}`
**Headers:** `Authorization: Bearer {token}`
**Resultado Esperado:**
- Status: 200
- Response: Array com tarefas do usuário especificado

=========================================

### 6. Verificação de Logs

Após cada teste, verificar o arquivo de log em `logs/` para confirmar:
- Logs de criação, atualização e exclusão
- Logs de erros quando aplicável
- Informações completas dos objetos (incluindo email, prioridade, deadline)
- Timestamps corretos

### 7. Verificação de Notificações Discord

Para tarefas que geram notificações:
1. Verificar se as mensagens são enviadas para o Discord
2. Confirmar formato das mensagens
3. Verificar se contém informações corretas

## Como Executar os Testes

1. **Iniciar o servidor:**
   ```bash
   npm start
   ```

2. **Usar um cliente HTTP:**
   - Postman
   - Insomnia
   - curl
   - Thunder Client (VS Code)
   - bruno

3. **Sequência recomendada:**
   1. Testes de autenticação
   2. Testes de usuários
   3. Testes de tarefas
   4. Testes de filtros
   5. Testes de logs


## Observações Importantes

- Sempre usar um token válido para endpoints
- Confirmar que logs estão sendo gerados com informações completas
- Testar cenários de erro para garantir tratamento adequado
- Verificar se notificações Discord estão funcionando (se configurado)

## Estrutura de Dados

### Usuário
```json
{
  "id": "uuid",
  "username": "string",
  "age": "number",
  "email": "string"
}
```

### Tarefa
```json
{
  "id": "uuid",
  "title": "string",
  "status": "string",
  "assignee": "user_id",
  "descricao": "string",
  "prioridade": "baixa|normal|alta",
  "deadline": "date|null"
}
``` 