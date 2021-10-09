#BUILD
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

#RUN
FROM node:12.13-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install --production
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
