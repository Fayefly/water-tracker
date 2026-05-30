FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY server ./server
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "server/index.js"]
