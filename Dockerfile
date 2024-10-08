FROM node:22-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY WebApp/ ./
RUN npm install
USER node
COPY --chown=node:node . .
EXPOSE 443
ENTRYPOINT [ "npm", "start" ]