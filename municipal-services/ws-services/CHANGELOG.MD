# Change log
All notable changes to this module will be documented in this file.

## 1.7.5 - 2023-08-10

- Central Instance Library Integration

## 1.7.4 - 2023-01-31

- Improved encryptOldData api with resume functionality
- Disabled privacy

## 1.7.4-beta - 2022-11-03

- Added the logic for update workflow if payement is 0

## 1.7.3 - 2022-11-03

- Optimised multiple workflow calls happening in _search api

## 1.7.2 - 2022-11-03

- Updated logic for _plainsearch api

## 1.7.1 - 2022-11-03

- Incorporated privacy decryption for notification flow for disconnection water applications

## 1.7.0 - 2022-11-03

- Notifications added for disconnection flow for water applications

## 1.6.0 - 2022-08-27

- Added privacy changes for water applications

## 1.5.0 - 2022-07-07

- Added disconnection flow for water applications

## 1.4.3 - 2022-03-02

- Added channel details on application creation.
- Added channel based notification

## 1.4.2 - 2022-01-13

- Updated to log4j2 version 2.17.1

## 1.4.2 - 2021-12-15

- Added validation for system payment.

## 1.4.1 - 2021-07-26

- RAIN-3046: updated businessService query param name.

## 1.4.0 - 2021-05-11

- Fixed security issue of untrusted data pass as user input.
- Fixed issue of estimation letter which does not regenerate in case of any changes in calculation parameter.
- Fixed issue of workflow approval without payment

## 1.3.0 - 2021-02-26
- Updated domain name in application.properties
- Added road cutting info details for calculating fees
- Fixed security issue for throwable statement

## 1.2.1 - 2021-02-03
- Added additionalDetails column

## 1.2.0 - 2021-01-12
- Added support for public domain search

## 1.1.0 - 2020-10-1
- Added modify water connection feature.
- Added connection holder feature for a connection who is a non-property owner.
- Added index to achieve performance benefits.

## 1.0.0
- Added typescript definition generation plug-in
- Upgraded to `tracer:2.0.0-SNAPSHOT`
- Upgraded to spring boot `2.2.6-RELEASE`