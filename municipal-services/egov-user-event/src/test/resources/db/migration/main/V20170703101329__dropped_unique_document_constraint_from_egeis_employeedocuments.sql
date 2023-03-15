-- Dropping since now the document attachments are already going to be UUID
ALTER TABLE egeis_employeeDocuments DROP CONSTRAINT uk_egeis_employeeDocuments_document;
