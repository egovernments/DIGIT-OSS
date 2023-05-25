DROP SEQUENCE SEQ_COLL_RCPT_NUM;

CREATE SEQUENCE SEQ_COLL_RCPT_NUM;

delete from id_generator where idname in ('collection.receiptno','collection.transactionno') and tenantid='default';

INSERT INTO id_generator(idname, tenantid, format, sequencenumber) VALUES ('collection.receiptno', 'default' , '[cy:MM]/[fy:yyyy-yy]/[SEQ_COLL_RCPT_NUM]', 3);

INSERT INTO id_generator(idname, tenantid, format, sequencenumber) VALUES ('collection.transactionno', 'default' , '[CITY.CODE][d{10}]', 4);

