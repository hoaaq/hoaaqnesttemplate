FROM node:12.16.1-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

ENV BUILD_ENV="prod"

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 7500
CMD [ "yarn", "start:prod" ]