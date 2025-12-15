# Usa a imagem base do Node.js
FROM node:18-alpine

# Cria o diretório de trabalho
WORKDIR /app/client

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código-fonte restante
COPY . .

# Expõe a porta que o Vite usará
EXPOSE 3000

# Comando para iniciar o frontend em modo de desenvolvimento
CMD ["npm", "run", "dev"]