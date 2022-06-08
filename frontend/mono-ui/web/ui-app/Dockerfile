FROM nginx:1.11.10-alpine

ENV WEB_DIR=/var/web/app/v2
RUN mkdir -p ${WEB_DIR}
COPY ./build/asset-manifest.json ${WEB_DIR}/asset-manifest.json
COPY ./build/static ${WEB_DIR}/static
COPY ./build/index.html ${WEB_DIR}/index.html
COPY ./build/favicon.ico ${WEB_DIR}/favicon.ico
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build/temp ${WEB_DIR}/temp
