############################################################
# Build stage
############################################################
FROM node:21-alpine AS build

RUN mkdir parse-hipaa-dashboard
WORKDIR /parse-hipaa-dashboard
COPY . .

# Install without scripts
RUN npm ci --omit=dev --ignore-scripts

############################################################
# Release stage
############################################################
FROM node:lts-alpine AS release

RUN mkdir parse-hipaa-dashboard
WORKDIR /parse-hipaa-dashboard

# Copy build stage folders
COPY --from=build /parse-hipaa-dashboard/node_modules /parse-hipaa-dashboard/node_modules
COPY /src/index.js ./index.js
RUN mkdir lib
COPY /src/parse-dashboard-config.json ./lib/parse-dashboard-config.json

USER node

ENTRYPOINT ["node", "/parse-hipaa-dashboard/index.js"]
