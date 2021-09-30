# BUILD
FROM node:14-alpine as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json yarn.lock ./
USER node
RUN yarn install
COPY --chown=node:node . .
RUN yarn build

# RUN
FROM node:14-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json yarn.lock ./
USER node
RUN yarn install --production
COPY --from=builder /home/node/app/build ./build

CMD [ "node", "build/src/main.js" ]