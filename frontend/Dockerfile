FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application (will be overridden by volume mount)
COPY . .

# Expose both the Vite dev server port
EXPOSE 3000 
EXPOSE 24678

# Start Vite dev server with host configuration
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
