FROM node:16-alpine

WORKDIR /app

# Copy only package files first
COPY package.json .
COPY package-lock.json* .
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
