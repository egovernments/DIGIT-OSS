FROM egovio/alpine-node-builder-10:yarn

ARG WORK_DIR
ENV npm_config_cache=/tmp
WORKDIR /app

COPY ${WORK_DIR}/src .

RUN yarn

CMD ["yarn", "start"]