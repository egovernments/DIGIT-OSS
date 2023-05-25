FROM node:6-alpine
RUN apk update && apk add curl git ca-certificates openssl
RUN adduser -u 1001 -h /home/sunbird/ -D sunbird
USER sunbird
RUN cd /home/sunbird && git clone https://github.com/project-sunbird/sunbird-telemetry-service.git && cd sunbird-telemetry-service/src && npm install 
RUN chown -R sunbird:sunbird /home/sunbird/sunbird-telemetry-service
WORKDIR  /home/sunbird/sunbird-telemetry-service/src/
CMD ["node", "app.js", "&"]
