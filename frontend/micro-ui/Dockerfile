FROM egovio/alpine-node-builder-10:yarn AS build
ARG WORK_DIR
WORKDIR /app
ENV NODE_OPTIONS "--max-old-space-size=1792"

COPY ${WORK_DIR} .
RUN yarn build:prod

FROM nginx:mainline-alpine
ENV WORK_DIR=/var/web/digit-ui

RUN mkdir -p ${WORK_DIR}

COPY --from=build /app/build ${WORK_DIR}/
COPY --from=build /app/builds/nginx.conf /etc/nginx/conf.d/default.conf
