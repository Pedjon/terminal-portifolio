FROM node:24-alpine

WORKDIR /app

RUN yarn global add serve --prefix /usr/local

COPY package.json yarn.lock ./
COPY src/ ./src/
COPY tests/ ./tests/

EXPOSE 8080

CMD ["serve", "-s", "src", "-l", "8080"]
