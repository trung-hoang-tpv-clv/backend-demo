FROM node:18-alpine as fromBuilder

WORKDIR /app

COPY . /app
RUN yarn install
RUN yarn run build

FROM node:18-alpine

WORKDIR /home/app

COPY --from=fromBuilder /app/dist /home/app/dist
COPY --from=fromBuilder /app/package.json /home/app/package.json
COPY --from=fromBuilder /app/node_modules /home/app/node_modules

CMD [ "node", "dist/src/main.js" ]