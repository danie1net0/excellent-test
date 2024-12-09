FROM node:lts-alpine

RUN apk add --no-cache bash openssl

RUN npm i -g @nestjs/cli

USER node

WORKDIR /home/node/app

EXPOSE 3000
