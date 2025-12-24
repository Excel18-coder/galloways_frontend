# ------------------ BUILD ------------------
    FROM node:20-alpine AS builder

    WORKDIR /app

    COPY package.json package-lock.json ./
    RUN npm ci --legacy-peer-deps

    COPY . .
    RUN npm run build

    # ------------------ PRODUCTION ------------------
    FROM node:20-alpine AS production

    WORKDIR /app

    COPY package.json package-lock.json ./
    RUN npm ci --legacy-peer-deps --omit=dev

    COPY --from=builder /app/dist ./dist

    ENV NODE_ENV=production

    CMD ["node", "dist/main.js"]