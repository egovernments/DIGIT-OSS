DROP INDEX IF EXISTS index_eg_fn_buildingdocuments_buildinguuid;

CREATE INDEX IF NOT EXISTS index_eg_fn_buildingdocuments_doc_buildinguuid ON eg_fn_buildingdocuments (buildinguuid);

