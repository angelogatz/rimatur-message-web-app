# Web Chat App

## Aplicação Fullstack de Mensagens em Tempo Real

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Concluído-green.svg)]()
[![Tecnologias](https://img.shields.io/badge/Stack-PERN%20%2B%20SocketIO%20%2B%20Docker-brightgreen.svg)]()

---

### Sobre o Projeto

O Web Chat App é uma solução de mensageria fullstack desenvolvida para demonstrar proficiência na criação de aplicações em tempo real, utilizando uma arquitetura robusta e distribuída com Docker.

**Características Principais:**
* **Mensageria em Tempo Real:** Comunicação instantânea de ponta a ponta utilizando **Socket.io**.
* **Autenticação JWT:** Sistema seguro de Login e Registro com tokens de acesso, implementando boas práticas de segurança (chaves secretas via variáveis de ambiente).
* **Status de Leitura:** Indicador de mensagens não lidas (**Badges/Tooltips**) que atualiza em *real-time* e marca automaticamente a conversa como lida ao ser aberta.
* **Arquitetura Dockerizada:** Ambiente de desenvolvimento isolado e replicável (Frontend, Backend e Banco de Dados).

---

### Tecnologias Utilizadas

| Categoria | Stack | Tecnologias Chave |
| :--- | :--- | :--- |
| **Backend** | Node.js (Express) | **Socket.io**, JWT, **Prisma ORM**, Bcrypt, `dotenv`. |
| **Frontend** | React (Vite) | `react-router-dom`, `axios`, `socket.io-client`, CSS Módulos. |
| **Banco de Dados** | PostgreSQL | Usado para persistência de mensagens e usuários. |
| **Infraestrutura** | Docker Compose | Orquestração do Frontend, Backend e Banco de Dados. |

---

### Como Rodar o Projeto (Setup)

Este projeto utiliza **Docker Compose** para inicializar o ambiente completo com um único comando.

#### Pré-requisitos
Certifique-se de ter o [Docker](https://www.docker.com/products/docker-desktop) e o [Docker Compose](https://docs.docker.com/compose/install/) instalados e rodando em sua máquina.

#### Inicialização
-  **Clone o repositório:**
    ```bash
    git clone https://github.com/angelogatz/rimatur-message-web-app.git
    cd rimatur-chat-app
    ```

-  **Configuração de Ambiente (Backend):**
    Crie o arquivo `.env` na pasta `server/` copiando o exemplo e insira sua chave secreta JWT e cole dentro dele as variaveis a seguir.
    ```bash
    DATABASE_URL="postgresql://postgres:root@host.docker.internal:5432/chat_app_db?schema=public"
    JWT_SECRET=chave_JWT
    ```

-  **Construir e Subir o Ambiente:**
    Este comando constrói as imagens e inicializa todos os serviços (Frontend, Backend, DB).
    ```bash
    docker compose up -d --build
    ```

 - **Aplicar Migrações do Banco de Dados:**
    As tabelas (User, Message) precisam ser criadas no Postgres.
    ```bash
    docker compose exec server npx prisma migrate dev --name init_tables
    ```

#### Acesso
Aguarde alguns segundos após o último comando para que o serviço `web` inicialize.
* **Frontend (App):** `http://localhost:5173`
* **Backend (API):** `http://localhost:3001`

---

### Fluxo de Uso e Testes

-  Acesse `http://localhost:5173`.
-  **Registro:** Crie novos usuários usando a tela de Cadastro.
-  **Login:** Entre com as credenciais.
-  **Teste Real-Time:** Abra duas abas/janelas anônimas, logue com dois usuários diferentes (ex: Maria e Pedro), e inicie a conversa.
-  **Teste do Badge:** Mande mensagens para um usuário que esteja vendo outra conversa. O indicador de mensagens não lidas deve aparecer e atualizar instantaneamente.

---

### Autor

Angelo El Sawy
* **LinkedIn:** [Conecte-se](https://www.linkedin.com/in/angelo-gatz-29151a200/)
