FROM node:14-alpine as builder
ENV NODE_ENV build
WORKDIR /app
COPY . /app
RUN yarn install && yarn build
# ---

FROM node:14-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/
CMD ["node", "dist/main.js"]