

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

