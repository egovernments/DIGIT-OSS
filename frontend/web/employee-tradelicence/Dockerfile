FROM nginx:1.11.10-alpine

ENV WEB_DIR=/var/web/employee-tradelicence
RUN mkdir -p ${WEB_DIR}
COPY ./build/ ${WEB_DIR}/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
CMD ["/usr/bin/start.sh"]