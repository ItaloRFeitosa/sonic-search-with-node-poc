ARG VERSION

## base, for dealing with coping files etc...
FROM node:lts AS base
WORKDIR /usr/src/app

EXPOSE 3000

COPY . ./

## dev version, with nodemon and volumes for easy development
FROM base as dev
RUN yarn
CMD ["yarn", "dev"]
