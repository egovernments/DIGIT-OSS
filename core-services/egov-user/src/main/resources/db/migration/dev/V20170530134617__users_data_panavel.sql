update eg_user set type = 'CITIZEN' where username = 'sanjeev' and tenantid = 'panavel';


INSERT INTO eg_user (
id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate,
lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,
signature, bloodgroup, photo, identificationmark,tenantid)
VALUES (
nextval('seq_eg_user'), 'title', 'Mrs', '1990-07-23 00:00:00', 'en_IN', 'anonymous', '$2a$10$uheIOutTnD33x7CDqac1zOL8DMiuz7mWplToPgcf7oxAI9OzRKxmK',
'2020-12-31 00:00:00', '1234567890', '9876543210', 'anonymous@gmail.com', '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, true,
'Anonymous', 2, 'ABCDE1234F', '12346789011', 'SYSTEM', 0, 'Guardian name', 'Mother',
'0fef5a6f-fb86-493d-9ecf-8f4b37fa498c', 'AB_POSITIVE', '54fc046d-12be-4733-b88c-cf7c06402980', 'identificationmark','panavel');

INSERT INTO eg_user (
id, title, salutation, dob, locale, username, password, pwdexpirydate, mobilenumber, altcontactnumber, emailid, createddate,
lastmodifieddate, createdby, lastmodifiedby, active, name, gender, pan, aadhaarnumber, type, version, guardian, guardianrelation,
signature, bloodgroup, photo, identificationmark,tenantid)
VALUES (
nextval('seq_eg_user'), 'title', 'Mrs', '1990-07-23 00:00:00', 'en_IN', 'system', '$2a$10$uheIOutTnD33x7CDqac1zOL8DMiuz7mWplToPgcf7oxAI9OzRKxmK',
'2020-12-31 00:00:00', '0000000000', '0000000000', 'system@gmail.com', '2010-01-01 00:00:00', '2015-01-01 00:00:00', 1, 1, true,
'System', 2, 'ABCDE1234F', '12346789011', 'SYSTEM', 0, 'Guardian name', 'Mother',
'0fef5a6f-fb86-493d-9ecf-8f4b37fa498c', 'AB_POSITIVE', '54fc046d-12be-4733-b88c-cf7c06402980', 'identificationmark','panavel');
