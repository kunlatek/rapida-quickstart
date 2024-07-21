# Use a imagem base do Node.js
FROM node:14

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Execute o comando de build do Nest.js
RUN npm run build

# Exponha a porta em que o servidor do Nest.js está ouvindo
EXPOSE 3000

# Defina o comando de inicialização do contêiner
CMD [ "npm", "run", "start:prod" ]