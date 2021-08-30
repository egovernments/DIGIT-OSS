FROM node:8.4-alpine
# File Author / Maintainer
LABEL authors="Sivaprakash Ramasamy <sivaprakash.ramasamy@tarento.com>"

RUN apk add --update  bash
COPY package.json /opt/package.json
COPY src /opt/src

RUN cd /opt && npm install
WORKDIR /opt

# set your port
ENV PORT 8080
# expose the port to outside world
#EXPOSE  8080

# start command as per package.json
CMD ["npm", "start"]
