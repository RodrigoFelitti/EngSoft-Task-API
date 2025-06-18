# Documentação Swagger da API

## Visão Geral

Fizemos para o projeto uma documentação usando Swagger, este arquivo dá algumas instruções de como usar, dicas e como interpretar os resultados.

## Como Acessar

1. Inicialmente é preciso que tenha feito o setup do projeto na sua máquina, visto que existem algumas verificações(Logs, por exemplo, que são salvas nos arquivos do projeto. Esta documentção assume que o readme já tenha sido executado corretamente).

2. Começe usando o comando `npm start` (recomendamos que isso seja feito em uma IDE de preferência para facilitar visualização). O comando sobe um servidor no localhost:5000 (exibido no console), garanta que não existam outras aplicações rodando nesta porta da sua máquina para evitar problemas.

3. Para acessar a documentação do swagger, basta adicionar `/api-docs` ao link do servidor fornecido pelo console. Pronto! A princípio deve estar visualizando a interface do swagger.

## Observações importantes:

- É interessante que começe testando algum usuário, pois a criação de tasks exige o assignment a algum usuário específico.
- Caso esteja testando algum get ou criação de tarefas que precisem de ID, pode acessar os logs ta atual execução ou acessar o console da IDE que estiver usando e identificar o ID necessário. Os logs estão separados por horário para facilitar esta identificação.
- Para criar Tasks, um ID de placeholder é fornecido para o assignee, se sua intenção é realizar o teste corretamente, você deve modificar o body da requisição e adicionar o ID do usuário desejado.
- O roteiro de testes funcionais pode ser executado pelo swagger a princípio.
- Pode modificar manualmente no arquivo .env do projeto o webhook para o discord, direcionando para o servidor onde queira visualizar o output desta parte do código

**Bons testes!**