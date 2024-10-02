FROM node:20.12.1-alpine3.19

WORKDIR /app

COPY package*.json .

RUN npm install --frozen-lockfile

COPY . .

CMD npm run dev