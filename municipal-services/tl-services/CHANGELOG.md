
# Changelog
All notable changes to this module will be documented in this file.

#1.1.6 - 2021-12-10

- Configured reminder periods from mdms
- Implemented count feature to count the search results
- Modified the search api to show only those applications which are to be renewed.
- Added different state for manually expired licenses
- Added different state for cancelled licenses

## 1.1.5 - 2021-07-23

- Fixed validation for TL Renewal

## 1.1.4 - 2021-05-11

- Fixed security issue of untrusted data pass as user input.
- Fixed issue of workflow approval without payment

## 1.1.3 - 2021-02-26
- Updated domain name in application.properties
- Fixed security issue for throwable statement

## 1.1.2 - 2021-01-12
- After SENDBACK action the license the assigne field is populated with only registered users


## 1.1.1 - 2020-10-1

- Added Index to achieve performance benefits.
- Added plain license search.
- Fix notification issues. 

## 1.1.0 - 2020-06-17

- Added typescript definition generation plugin
- Upgraded to tracer:`2.0.0-SNAPSHOT`
- Upgraded to spring boot `2.2.6-RELEASE`
- Upgraded to flyway-core `6.4.3 version`
- Removed `start.sh` and `Dockerfile`

## 1.0.0

- Base version
