# finance-collections-voucher-consumer service

finance-collections-voucher-consumer service creates vouchers and instruments for the receipts collected through the collection service.

### DB UML Diagram

NA

### Service Dependencies

- egov-mdms-service
- collection-service
- egf-instrument
- egov-user
- egf-master
- Finance co existence service

### Swagger API Contract

NA

## Service Details

finance-collections-voucher-consumer service creates vouchers and instruments for the receipts collected through the collection service.

### API Details

NA

### Kafka Consumers

egov.collection.receipt.voucher.save.topic : egov.collection.receipt-create
	Creates Collection V1 receipt voucher, updates the voucher number with the corresponding receipt and creates instrument.
egov.collection.receipt.voucher.cancel.topic : egov.collection.receipt-cancel
	Cancels Collection V1 receipt voucher and corresponding instrument.
kafka.topics.payment.create.name : egov.collection.payment-create
	Creates Collection V2 receipt voucher, updates the voucher number with the corresponding receipt and creates instrument.
kafka.topics.payment.cancel.name : egov.collection.payment-cancel
	Cancels Collection V2 receipt voucher and corresponding instrument.
	
### Kafka Producers

NA
