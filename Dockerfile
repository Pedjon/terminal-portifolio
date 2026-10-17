FROM node:24-alpine

WORKDIR /app

ENV ASTRO_TELEMETRY_DISABLED=1

COPY package.json yarn.lock ./
COPY apps/terminal/package.json ./apps/terminal/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/content/package.json ./packages/content/package.json

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile --non-interactive

COPY apps/terminal/ ./apps/terminal/
COPY apps/web/ ./apps/web/
COPY packages/content/ ./packages/content/

EXPOSE 8080 8081

CMD ["yarn", "dev"]
