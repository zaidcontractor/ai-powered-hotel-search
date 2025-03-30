FROM node:16.20.2 as builder

WORKDIR /app

# Copy package files first
COPY package.json .
COPY package-lock.json* .

# Clean install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Use nginx for serving
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
