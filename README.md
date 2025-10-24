# Travell Order - Sistema de Gestão de Pedidos de Viagem

## 📋 Sobre o Projeto

O **Travell Order** é uma aplicação web full-stack desenvolvida para gerenciar pedidos de viagem corporativa. O sistema permite que usuários solicitem viagens, administradores aprovem/cancelem pedidos, e oferece uma interface intuitiva para acompanhar o status das solicitações.

### 🏗️ Arquitetura

- **Backend**: Laravel 12 (PHP 8.2+) com JWT Authentication
- **Frontend**: Vue.js 2 com TypeScript
- **Banco de Dados**: MySQL 8
- **Containerização**: Docker & Docker Compose
- **Servidor Web**: Nginx

### 🚀 Funcionalidades

- **Autenticação**: Sistema de login/registro com JWT
- **Gestão de Pedidos**: Criação, edição e listagem de pedidos de viagem
- **Controle de Status**: Aprovação/cancelamento de pedidos (apenas administradores)
- **Filtros Avançados**: Busca por destino, data e status
- **Interface Responsiva**: Design moderno e intuitivo
- **Notificações**: Sistema de alertas para feedback do usuário

## 🛠️ Tecnologias Utilizadas

### Backend (Laravel)
- Laravel Framework 12
- Laravel Sanctum para autenticação
- JWT Auth para tokens
- MySQL para persistência
- Laravel Mail para notificações

### Frontend (Vue.js)
- Vue.js 2.6
- Vue Router para navegação
- Vuex para gerenciamento de estado
- Axios para requisições HTTP
- TypeScript para tipagem
- Vue Notifications para alertas

### Infraestrutura
- Docker & Docker Compose
- Nginx como proxy reverso
- MySQL 8 como banco de dados

## 📁 Estrutura do Projeto

```
travell-order/
├── travell-order-api/          # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/   # Controllers da API
│   │   ├── Models/            # Modelos Eloquent
│   │   └── Mail/              # Templates de email
│   ├── database/
│   │   ├── migrations/        # Migrações do banco
│   │   └── seeders/           # Seeders para dados iniciais
│   ├── routes/
│   │   └── api.php            # Rotas da API
│   └── resources/views/       # Templates Blade
├── travell-order-front/        # Frontend Vue.js
│   ├── src/
│   │   ├── components/        # Componentes Vue
│   │   ├── views/             # Páginas da aplicação
│   │   ├── services/          # Serviços (API)
│   │   └── store/             # Vuex store
│   └── public/                # Arquivos estáticos
├── docker-compose.yml         # Configuração Docker
└── init.sh                    # Script de inicialização
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker e Docker Compose instalados
- Git para clonagem do repositório

### Método 1: Script Automatizado (Recomendado)

1. **Clone o repositório:**
```bash
git clone git@github.com:LuanCarlo/travell-order.git
cd travell-order
```

2. **Execute o script de inicialização:**
```bash
chmod +x init.sh
./init.sh
```

O script irá:
- Construir as imagens Docker
- Subir todos os containers
- Configurar o banco de dados
- Executar as migrações
- Gerar as chaves de aplicação

### Método 2: Comandos Manuais

1. **Clone e acesse o diretório:**
```bash
git clone git@github.com:LuanCarlo/travell-order.git
cd travell-order
```

2. **Construa e suba os containers:**
```bash
docker compose build --no-cache
docker compose up -d
```

3. **Aguarde o banco inicializar (15 segundos):**
```bash
sleep 15
```

4. **Configure o Laravel:**
```bash
# Copie o arquivo .env (se existir)
docker cp travell-order-api/.env travell-order-php:/var/www/.env

# Gere a chave da aplicação
docker exec -it travell-order-php bash -lc "php artisan key:generate"

# Gere a chave JWT
docker exec -it travell-order-php bash -lc "php artisan jwt:secret"

# Execute as migrações
docker exec -it travell-order-php bash -lc "php artisan migrate --force"
```

## 🌐 Acessando a Aplicação

Após a execução, a aplicação estará disponível em:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **Banco de Dados**: localhost:3307

### 👤 Credenciais de Teste

Após executar as migrações, um usuário administrador é criado automaticamente:

- **Email**: admin@example.com
- **Senha**: password123

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **users**: Usuários do sistema
- **order**: Pedidos de viagem
- **order_status**: Status possíveis dos pedidos
- **personal_access_tokens**: Tokens de autenticação

### Status de Pedidos

- **Solicitado** (padrão)
- **Aprovado**
- **Cancelado**

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```bash
# Ver status dos containers
docker compose ps

# Parar todos os containers
docker compose down

# Reiniciar containers
docker compose restart

# Ver logs
docker compose logs -f [nome-do-container]
```

### Comandos Laravel

```bash
# Acessar container PHP
docker exec -it travell-order-php bash

# Executar migrações
docker exec -it travell-order-php php artisan migrate

# Limpar cache
docker exec -it travell-order-php php artisan cache:clear

# Executar testes
docker exec -it travell-order-php php artisan test
```

### Comandos Frontend

```bash
# Acessar container frontend
docker exec -it travell-frontend sh

# Instalar dependências
docker exec -it travell-frontend npm install

# Build de produção
docker exec -it travell-frontend npm run build
```

## 🔐 API Endpoints

### Autenticação
- `POST /api/register` - Registrar usuário
- `POST /api/login` - Fazer login
- `POST /api/logout` - Fazer logout

### Pedidos (Requer autenticação)
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/getOrder/{id}` - Buscar pedido específico
- `PUT /api/orders/update/{id}` - Atualizar pedido
- `PATCH /api/orders/updateStatusOrder/{id}` - Atualizar status
- `GET /api/orders/orderStatus` - Listar status disponíveis

## 🎯 Funcionalidades por Perfil

### Usuário Comum
- Criar pedidos de viagem
- Visualizar seus pedidos
- Editar pedidos (apenas os próprios)
- Filtrar pedidos por destino, data e status

### Administrador
- Todas as funcionalidades do usuário comum
- Alterar status de qualquer pedido
- Visualizar todos os pedidos do sistema

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com banco:**
   - Aguarde mais tempo para o MySQL inicializar
   - Verifique se a porta 3307 não está em uso

2. **Erro de permissão no script:**
   ```bash
   chmod +x init.sh
   ```

3. **Containers não sobem:**
   ```bash
   docker compose down
   docker compose build --no-cache
   docker compose up -d
   ```
## 🧪 Executando Testes

O projeto possui uma suíte de testes automatizados usando PHPUnit. Os testes cobrem funcionalidades de usuários e pedidos de viagem.

### Executar Todos os Testes

```bash
# Executar todos os testes
docker exec -it travell-order-php php artisan test

# Executar com output detalhado
docker exec -it travell-order-php php artisan test --verbose

# Executar testes com coverage (se configurado)
docker exec -it travell-order-php php artisan test --coverage
```

### Executar Testes Específicos

```bash
# Executar apenas testes de Feature
docker exec -it travell-order-php php artisan test --testsuite=Feature

# Executar apenas testes Unit
docker exec -it travell-order-php php artisan test --testsuite=Unit

# Executar teste específico
docker exec -it travell-order-php php artisan test tests/Feature/OrderTest.php

# Executar método específico
docker exec -it travell-order-php php artisan test --filter=it_creates_an_order
```

### Configuração dos Testes

Os testes estão configurados para usar:
- **Banco de dados**: SQLite em memória (para performance)
- **Ambiente**: Testing (isolado do ambiente de desenvolvimento)
- **Cache**: Array (sem persistência)
- **Mail**: Array (emails não são enviados)

### Estrutura dos Testes

```
tests/
├── Feature/           # Testes de integração
│   ├── OrderTest.php  # Testes de pedidos de viagem
│   └── UserTest.php   # Testes de usuários
└── Unit/              # Testes unitários
```

### Testes Disponíveis

#### OrderTest (Testes de Pedidos)
- ✅ Criação de pedidos válidos
- ✅ Validação de campos obrigatórios
- ✅ Validação de datas (retorno após partida)
- ✅ Validação de tamanho de campos
- ✅ Relacionamentos com usuários

#### UserTest (Testes de Usuários)
- ✅ Criação de usuários
- ✅ Atualização de usuários
- ✅ Validação de campos obrigatórios
- ✅ Validação de email único
- ✅ Validação de tamanho de campos

### Executar Testes em Desenvolvimento

```bash
# Acessar container e executar testes
docker exec -it travell-order-php bash
php artisan test

# Executar testes em modo watch (desenvolvimento)
php artisan test --watch
```


