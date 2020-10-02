CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicensedetail_tradelicenseid ON eg_tl_tradelicensedetail (tradelicenseid);

CREATE INDEX IF NOT EXISTS index_eg_tl_address_tradelicensedetailid ON eg_tl_address (tradelicensedetailid);

CREATE INDEX IF NOT EXISTS index_eg_tl_owner_tradelicensedetailid ON eg_tl_owner (tradelicensedetailid);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradeunit_tradelicensedetailid ON eg_tl_tradeunit (tradelicensedetailid);

CREATE INDEX IF NOT EXISTS index_eg_tl_accessory_tradelicensedetailid ON eg_tl_accessory (tradelicensedetailid);

CREATE INDEX IF NOT EXISTS index_eg_tl_document_owner_userid ON eg_tl_document_owner (userid);

CREATE INDEX IF NOT EXISTS index_eg_tl_applicationdocument_tradelicensedetailid ON eg_tl_applicationdocument (tradelicensedetailid);

CREATE INDEX IF NOT EXISTS index_eg_tl_verificationdocument_tradelicensedetailid ON eg_tl_verificationdocument (tradelicensedetailid);

CREATE INDEX IF NOT EXISTS index_eg_tl_institution_tradelicensedetailid ON eg_tl_institution (tradelicensedetailid);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicense_accountid ON eg_tl_tradelicense (accountid);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicense_tenantid ON eg_tl_tradelicense (tenantid);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicense_applicationnumber ON eg_tl_tradelicense (applicationnumber);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicense_licensenumber ON eg_tl_tradelicense (licensenumber);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicense_oldlicensenumber ON eg_tl_tradelicense (oldlicensenumber);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicense_applicationdate ON eg_tl_tradelicense (applicationdate);

CREATE INDEX IF NOT EXISTS index_eg_tl_tradelicense_validto ON eg_tl_tradelicense (validto);