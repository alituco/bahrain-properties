FROM node:20-alpine AS builder
WORKDIR /app

# -- install production deps --
COPY package*.json ./
RUN npm ci

# -- copy source & build --
COPY . .
RUN npm run build           # generates .next/** incl. .next/static/media/*.woff2


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]                 
