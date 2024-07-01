---

# Microsserviço Encurtador de URL

Este repositório contém um encurtador de URLs com sistema de autenticação escalonável e seguro, usando NestJS, Prisma, Postgres, RabbitMQ e Docker. Baseado em microsserviços com mecanismos de autenticação robustos. O projeto é desenvolvido como um monorepo, facilitando a gestão e o compartilhamento de código entre os diferentes microsserviços.

## Executar o Projeto

### Pré-Requisitos

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/rodrigo1dev/microservice-url-shortener.git
   cd microservice-url-shortener
   ```

2. **Instalar dependências:**

   ```bash
   npm install
   ```

3. **Configuração de Variáveis de Ambiente**

   Todas as variáveis de ambiente necessárias para o desenvolvimento estão disponíveis publicamente.

### Executando a Aplicação

1. **Iniciar Serviços:**

   ```bash
   docker-compose up --build
   ```

   Este comando irá construir e iniciar os contêineres Docker. Certifique-se de que não há nenhum contêiner em execução para evitar concorrência de portas.

2. **Aplicar Migrações do Prisma:**

   Assim que os serviços estiverem ativos, aplique as migrações do Prisma:

### Endpoints

    O serviço de gateway estará acessível em `http://localhost:3000`.

- [Postman Doc](https://documenter.getpostman.com/view/36625948/2sA3dviCBh)

- **Auth:**

  - `POST /auth/login`: Autenticar um usuário e retornar tokens JWT.
  - `POST /auth/register`: Registre um novo usuário e retorne tokens JWT.
  - `POST /auth/refresh`: Atualize o token de acesso usando o token de atualização.

- **Users:**

  - `GET /users`: Busca todos os usuários cadastrado (rota protegida).

- **Shortener:**

  - `POST /shortener`: Cria uma URL encurtada para a URL original enviada. Se autenticado, associa a URL ao usuário; caso contrário, registra sem associação.
  - `GET /shortener/get-all-shorteners`: Retorna todas as URLs encurtadas (rota protegida).
  - `PUT /shortener/update-shortener/{{shortenerId}}`: Atualiza uma URL encurtada existente (rota protegida).
  - `GET /delete/{{shortenerId}}`: Deleta uma URL encurtada específica (rota protegida).
  - `GET /shortener/count-click/`: Executa a URL encurtada, redirecionando para o link original e registrando o clique.

## Configurações do Projeto

```bash
npx prisma generate
```

### RabbitMQ

RabbitMQ é usado para comunicação entre serviços. A configuração do RMQ é definida em `libs/common/src/rmq/rmq.module.ts.`.

### JWT

JWT é usado para autenticação. A configuração do JWT é definida em libs/common/src/auth/auth.module.ts e `apps/auth/src/auth.service.ts.`.

## Pontos de Melhoria

- Implementação do armazenamento do token JWT em cookies, removendo a responsabilidade do cliente no gerenciamento.

- Refatoração da estrutura do projeto para separar a lógica de negócios das operações no banco em repositórios.

## Estrutura do projeto

```
├── apps
│   ├── auth
│   ├── gateway
│   ├── users
│   └── shortener
├── libs
├── prisma
│
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Estrutura do Banco de dados

```
├── User
│   ├── id          # Identificador único do usuário (UUID)
│   ├── email       # Email do usuário (único)
│   ├── password    # Senha do usuário
│   └── name        # Nome opcional do usuário
│
├── Shortener
│   ├── id          # Identificador único do encurtador (UUID)
│   ├── userId      # Referência ao ID do usuário associado
│   ├── originalUrl # URL original a ser encurtada
│   ├── shortUrl    # URL encurtada (única)
│   ├── clicks      # Contador de cliques na URL encurtada
│   ├── createdAt   # Data de criação do registro
│   ├── updatedAt   # Data de última atualização do registro
│   └── deletedAt   # Data de exclusão do registro (opcional)

```
