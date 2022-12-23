############################################################
# Build stage
############################################################
FROM node:lts-alpine AS build

RUN mkdir parse-hipaa-dashboard
WORKDIR ./parse-hipaa-dashboard
COPY . .

# Install without scripts
RUN npm ci --omit=dev --ignore-scripts

############################################################
# Release stage
############################################################
FROM node:lts-alpine AS release

RUN mkdir parse-hipaa-dashboard
WORKDIR ./parse-hipaa-dashboard
COPY . .

# Copy build stage folders
COPY --from=build /parse-hipaa-dashboard/node_modules /parse-hipaa-dashboard/node_modules

ENTRYPOINT []
CMD ["node", "./src/index.js"]
