FROM node:16-alpine

WORKDIR /app

# Copy package files first
COPY package.json .
COPY package-lock.json* .
RUN npm install

# Copy the rest of the application
COPY public/ ./public/
COPY src/ ./src/
COPY .env* ./

EXPOSE 3000
ENV CI=true

CMD ["npm", "start"]
