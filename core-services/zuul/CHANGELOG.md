
All notable changes to this module will be documented in this file.

## 1.3.2-beta - 2022-09-20
- Upgraded spring-boot-starter-parent to 2.2.13 and spring beans to 5.2.20.RELEASE
- Updated to log4j2 version 2.17.1

## 1.3.1 - 2021-09-28
- Added cache burst during initialisation

## 1.3.0 - 2021-05-17
- Changes to error handling
- Removed stack trace printing
- Added rate limiting functionality
- Add support for PATCH and PUT statements
- Changed auth filter to not read body if Json content type is not specified
- Removed `x-user-info` header from sensitive headers in `application.properties`

## 1.2.1 - 2021-02-26

- Updated domain name in routes.properties

## 1.2.0 - 2021-01-12

- ZUUL METRIC CAPTURING ADDED

## 1.2.0 

## 1.1.0 - 2020-06-22
- Added typescript definition generation plugin
- Upgraded to `tracer:2.0.0-SNAPSHOT`
- Upgraded to spring boot `2.2.6-RELEASE`
- Upgraded to spring-cloud-starter-netflix-zuul `2.2.2.RELEASE`
- Deleted `Dockerfile` and `start.sh` as it is no longer in use

## 1.0.0

- Base version
