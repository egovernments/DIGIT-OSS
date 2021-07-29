CREATE INDEX IF NOT EXISTS index_eg_fn_firenocdetail_firenocuuid ON eg_fn_firenocdetail (firenocuuid);

CREATE INDEX IF NOT EXISTS index_eg_fn_address_firenocdetailsuuid ON eg_fn_address (firenocdetailsuuid);

CREATE INDEX IF NOT EXISTS index_eg_fn_buidlings_firenocdetailsuuid ON eg_fn_buidlings (firenocdetailsuuid);

CREATE INDEX IF NOT EXISTS index_eg_fn_buildinguoms_buildinguuid ON eg_fn_buildinguoms (buildinguuid);

CREATE INDEX IF NOT EXISTS index_eg_fn_buildingdocuments_buildinguuid ON eg_fn_buildinguoms (buildinguuid);

CREATE INDEX IF NOT EXISTS index_eg_fn_firenoc_tenantid ON eg_fn_firenoc (tenantid);

CREATE INDEX IF NOT EXISTS index_eg_fn_firenoc_createdtime ON eg_fn_firenoc (createdtime);