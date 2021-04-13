FROM node:14 as development

WORKDIR /home/node/lab-3/api

COPY package.json .

RUN npm i

COPY . .

FROM development as production

RUN npm run build
