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