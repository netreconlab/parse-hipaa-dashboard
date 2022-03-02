FROM node:lts-alpine

RUN mkdir parse-hipaa-dashboard
WORKDIR ./parse-hipaa-dashboard 
COPY . .


# Install remaining dev dependencies
RUN npm install

ENTRYPOINT []
CMD ["node", "./src/index.js"]