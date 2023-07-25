
All notable changes to this module will be documented in this file.
## 1.3.5-beta - 2022-11-13
- Amendment Query bug fix

## 1.3.4 - 2022-01-04
- Updated to log4j2 version 2.17.1

## 1.3.3 - 2021-07-26

 - Earliest bill search
 - Bill cancellation
 - State level bill gen fix added
 - Provision to add unbilled demands to bill generate

## 1.3.2 - 2021-05-11
- apportion fix
- Added size validations
- VUL-WEB-L008: added @SafeHtml annotaion on string fields
- VUL-WEB-L008: updated POM to add safeHtml validator libraries
- Fixed demand search queries with preparestatements

## 1.3.1 - 2021-02-26
- Updated domain name in application.properties

## 1.3.0 - 2021-01-31

- Amenment APIs created and enabled


## 1.2.2

- fixed expiry date added in demand object

## 1.2.2

## 1.2.1 - 2021-01-08

- state level search/fetch enable for bills for citizen only
- zero demands bill genereation restricted to only once

## 1.2.1

## 1.2.0 - 2020-12-xx

- back update error log created to record failures of payment to demand update.
- table eg_bs_payment_backupdate_audit created to log the above mentioned information and to validate for duplicate receipt enteries for payment update.

## 1.2.0

## 1.1.1 - 2020-08-18

- user create enabled

## 1.1.1

## 1.1.0 - 2020-06-25

- Added typescript definition generation plugin
- Upgraded to `tracer:2.0.0-SNAPSHOT`
- Upgraded to spring boot `2.2.6-RELEASE`
- Removed `start.sh` and `Dockerfile`
- Removed unused master request models, rowmappers
- Deprecated Bill V1 controller
- removed demand detail search

## 1.0.0

- Base version
