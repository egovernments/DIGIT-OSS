FROM egovio/alpine-node-builder-10:yarn AS build  
ARG WORK_DIR
ENV npm_config_cache=/tmp
WORKDIR /app

# copy the project files
COPY ${WORK_DIR} .

# not useful for stateless builds
RUN npm install
RUN npm run build

# Create runtime image
FROM node:8.4-alpine


WORKDIR /opt/egov

COPY --from=build /app /opt/egov/

# set your port
ENV PORT 8080
# expose the port to outside world
#EXPOSE  8080

# start command as per package.json
CMD ["npm","run", "prod:start"]
