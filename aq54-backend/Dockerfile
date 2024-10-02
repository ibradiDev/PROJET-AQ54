FROM node:20.12.1-alpine3.18

RUN apk add --no-cache openssl1.1-compat

WORKDIR /app

COPY package*.json .

RUN npm install --frozen-lockfile

COPY . .

CMD npx prisma db push && npm run dev