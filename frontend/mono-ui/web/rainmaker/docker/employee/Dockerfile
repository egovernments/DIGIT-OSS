
FROM ghcr.io/egovernments/alpine-node-builder-12:yarn AS build  
ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=1792"

# copy the project files
COPY ${WORK_DIR} .
RUN yarn run prod:employee

# Create runtime image
FROM nginx:mainline-alpine 
ENV WEB_DIR=/var/web/employee

RUN mkdir -p ${WEB_DIR}

COPY --from=build /app/packages/employee/build ${WEB_DIR}/
COPY --from=build /app/docker/employee/nginx.conf /etc/nginx/conf.d/default.conf
