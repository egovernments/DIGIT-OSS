
FROM egovio/alpine-node-builder-10:yarn AS build  
ARG WORK_DIR
WORKDIR /app

# copy the project files
COPY ${WORK_DIR} .
RUN yarn run prod:ui-uploader

# Create runtime image
FROM nginx:mainline-alpine 
ENV WEB_DIR=/var/web/app/v2/uploader

RUN mkdir -p ${WEB_DIR}

COPY --from=build /app/build ${WEB_DIR}/
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf