
FROM golang:1.13-alpine as build

ENV GO111MODULE=on
ENV GOCACHE=/tmp

ARG WORK_DIR
WORKDIR /app

COPY ${WORK_DIR}/go.mod .
COPY ${WORK_DIR}/go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build


# Create runtime image
FROM alpine:3

WORKDIR /opt/egov

RUN addgroup -S egov && adduser -S -G egov egov 
COPY --chown=egov:egov --from=build /app/zuul-kubernetes-discovery /opt/egov/

RUN chmod +x /opt/egov/zuul-kubernetes-discovery 

CMD ["/opt/egov/zuul-kubernetes-discovery"]
# USER egov
