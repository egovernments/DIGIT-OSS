FROM nginx:1.11.10-alpine

ENV WEB_DIR=/var/web/app/v3
RUN mkdir -p ${WEB_DIR}
COPY ./build/asset-manifest.json ${WEB_DIR}/asset-manifest.json
COPY ./build/favicon.ico ${WEB_DIR}/favicon.ico
COPY ./build/index.html ${WEB_DIR}/index.html
COPY ./build/manifest.json ${WEB_DIR}/manifest.json
COPY ./build/service-worker.js ${WEB_DIR}/service-worker.js
COPY ./build/static ${WEB_DIR}/static


COPY ./nginx.conf /etc/nginx/conf.d/default.conf
