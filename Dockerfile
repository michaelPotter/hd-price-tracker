FROM node:hydrogen-alpine

COPY node_modules/ /home/node/app/node_modules/
COPY dist package.json package-lock.json /home/node/app/

WORKDIR /home/node/app

ENTRYPOINT node ./app.js
