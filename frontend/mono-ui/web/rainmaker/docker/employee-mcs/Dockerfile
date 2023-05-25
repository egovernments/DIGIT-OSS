
FROM egovio/alpine-node-builder-10:yarn AS build
ARG WORK_DIR
WORKDIR /app

# copy the project files
COPY ${WORK_DIR} .
RUN yarn run prod:employee-mcs

# Create runtime image
FROM nginx:mainline-alpine
ENV WEB_DIR=/var/web/employee-mcs

RUN mkdir -p ${WEB_DIR}

COPY --from=build /app/dev-packages/employee-mcs/build ${WEB_DIR}/

COPY --from=build /app/docker/employee-mcs/nginx.conf /etc/nginx/conf.d/default.conf
