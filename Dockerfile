# Pull base image.
FROM node:10

#create directory for app

RUN mkdir -p /usr/src/sproof-api-client

#set working directory
WORKDIR /usr/src/sproof-api-client

RUN mkdir /usr/src/sproof-api-client/data/
RUN mkdir /usr/src/sproof-api-client/logs/
RUN mkdir /usr/src/sproof-api-client/dist/


COPY package.json ./package.json

COPY src ./src

# install npm packages
RUN npm install

EXPOSE 6001
