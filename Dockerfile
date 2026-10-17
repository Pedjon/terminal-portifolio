FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/terminal/package.json ./apps/terminal/package.json

RUN yarn install --frozen-lockfile --non-interactive

COPY apps/terminal/ ./apps/terminal/

EXPOSE 8080

CMD ["yarn", "dev:terminal"]
