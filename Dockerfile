FROM node:lts-alpine

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json 
COPY ./src/index.js ./index.js
# COPY ./src/parse-dashboard-config.json ./parse-dashboard-config.json # Uncomment to use your own config file

RUN npm install

ENTRYPOINT []
CMD ["node", "index.js"]