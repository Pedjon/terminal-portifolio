FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/terminal/package.json ./apps/terminal/package.json
COPY packages/content/package.json ./packages/content/package.json

RUN yarn install --frozen-lockfile --non-interactive

COPY apps/terminal/ ./apps/terminal/
COPY packages/content/ ./packages/content/

EXPOSE 8080

CMD ["yarn", "dev:terminal"]
