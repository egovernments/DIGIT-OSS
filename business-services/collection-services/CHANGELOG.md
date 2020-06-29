

# Changelog
All notable changes to this module will be documented in this file.


## [Unreleased]
### Changed
- None

## [1.1.0] - 2018-12-06
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

## 2.0.0 - 2020-06-25

- Added Paytment API
- Added typescript definition generation plugin
- Upgraded to `tracer:2.0.0-SNAPSHOT`
- Upgraded to spring boot `2.2.6-RELEASE`
- Removed `start.sh` and `Dockerfile`

## 2.0.0

- Base version


