# book-source/Dockerfile

# Stage 1: Build the Docusaurus application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock/pnpm-lock.yaml)
# to leverage Docker cache
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Docusaurus site
RUN pnpm build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built Docusaurus site from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx configuration (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
