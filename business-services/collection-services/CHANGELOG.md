

# Changelog
All notable changes to this module will be documented in this file.
## 1.1.7-beta - 2022-11-04
- Added jmeter scripts

## 1.1.6 - 2022-01-13
- Updated to log4j2 version 2.17.1

## 1.1.5 - 2021-07-26
- Support for statelevel search

## 1.1.4 - 2021-05-11
- RAIN-2515 Added regex pattern for paid by, payer name, email and mobilenumber
- VUL-WEB-L008: added @SafeHtml annotaion on string fields
- VUL-WEB-L008: updated POM to add safeHtml validator libraries
- Query optimized made in sync with prod
- RAIN-2420 Added url shortend link for payment message

- 
## 1.1.3 - 2021-02-26
- Updated domain name in application.properties

## 1.1.2 - 2021-01-12
- Query Optimized
- Payment search/workflow path param based URL config added 

## 1.1.1 - 2020-08-04
- Migration fix for status mapping issues

## 1.1.1

## 1.1.0 - 2020-06-25

- Added Paytment API
- Added typescript definition generation plugin
- Upgraded to `tracer:2.0.0-SNAPSHOT`
- Upgraded to spring boot `2.2.6-RELEASE`
- Removed `start.sh` and `Dockerfile`

## 1.1.0

## [1.0.0] - 2018-12-06
### Added
- Receipt update API to allow for update of editable fields.
- Receipt Workflow API
	- Cancellation of receipts in open state.
	- Remittance of instruments such as Cash, Cheque, DD .
	- Dishonoring of instruments such as Cheque, DD.

### Changed
- Receipt Search API
	- Search response to include fields such as receiptNumber, consumerCode
at Receipt root for easier access.
	- Search by multiple receipt status and instrument types.


### Deprecated
- Receipt status & voucher update via update API in favour of workflow API.


All notable changes to this module will be documented in this file.

- Base version


