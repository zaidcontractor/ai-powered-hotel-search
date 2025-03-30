FROM node:16-alpine

WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 5000

# Use nodemon for hot reloading
CMD ["nodemon", "src/server.js"]
