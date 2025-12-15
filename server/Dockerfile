# STAGE 1: Build (Instalação de Dependências)
FROM node:18-bullseye-slim AS build 

RUN apt-get update && \
    apt-get install -y openssl build-essential python3

WORKDIR /app/server

# Copia e instala as dependências em um ambiente limpo
COPY package*.json ./
COPY prisma ./prisma 
RUN npm install --force

# STAGE 2: Produção (Execução)
FROM node:18-bullseye-slim 

WORKDIR /app/server

# Copia as dependências instaladas do estágio 'build'
COPY --from=build /app/server/node_modules ./node_modules
COPY . .

# Altera para o usuário 'node' padrão
# USER node  <-- Pode comentar/remover o USER node por enquanto, para evitar problemas de permissão em "slim" se eles surgirem.
# Vamos rodar como root no Stage 2 por segurança de permissões.

EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]