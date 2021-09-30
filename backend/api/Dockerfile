# BUILD
FROM node:14-alpine as builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN chown -R node:node /app
USER node
RUN yarn install
COPY --chown=node:node . .
RUN yarn build

# RUN
FROM node:14-alpine
WORKDIR /app
COPY package*.json yarn.lock ./
RUN chown -R node:node /app
USER node
RUN yarn install --production
COPY --from=builder /app/build ./build

CMD [ "node", "build/src/main.js" ]
EXPOSE 3000