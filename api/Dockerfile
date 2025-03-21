FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build the API
RUN npx nx build api

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy built files
COPY --from=build /app/dist/api ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"] 