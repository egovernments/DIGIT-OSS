# Changelog
All notable changes to this module will be documented in this file.

## 1.1.6-beta - 2022-01-13
- Updated to log4j2 version 2.17.1

## 1.1.5 - 2021-07-27
- minor bug fixes

## 1.1.4 - 2021-06-03
- Passing business service value while consuming view receipt api
- Fixed voucher creation issue in case of advance amount is collected
- Reading authorisation header key from the configuration files

## 1.1.3 - 2021-05-11
- Updated config in application.properties

## 1.1.2 - 2021-02-26
- Updated domain name in application.properties

## 1.1.1 - 2020-10-09
- Ignore and start server even Kafka topic is missing

## 1.1.0 - 2020-06-22

- Handling the Payment Request to persist the vouchers.
- Handled dishonor of instruments to create the reversal voucher.
- Handled back updation of instrument with reversal voucher id.
- Upgraded to `tracer:2.0.0-SNAPSHOT`
- Upgraded to `Spring boot 2.2.6`

## 1.0.0

- Base version
