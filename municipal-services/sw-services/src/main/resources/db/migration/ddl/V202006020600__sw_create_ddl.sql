
CREATE TABLE IF NOT EXISTS eg_sw_connection
(
	id character varying(64) NOT NULL,
	property_id character varying(64) NOT NULL,
	tenantid character varying(250) NOT NULL,
	applicationno character varying(64),
	applicationstatus character varying(256),
	status character varying(64) NOT NULL,
	connectionno character varying(256),
	oldconnectionno character varying(64),
	roadCuttingArea FLOAT,
	action character varying(64),
	roadType character varying(32),
	adhocrebate numeric(12,2),
	adhocpenalty numeric(12,2),
	adhocpenaltyreason character varying(1024),
	adhocpenaltycomment character varying(1024),
	adhocrebatereason character varying(1024),
	adhocrebatecomment character varying(1024),
	createdBy character varying(64),
	lastModifiedBy character varying(64),
	createdTime bigint,
	lastModifiedTime bigint,
	CONSTRAINT eg_sw_connection_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS index_eg_sw_connection_tenantid ON eg_sw_connection (tenantid);
CREATE INDEX IF NOT EXISTS index_eg_sw_connection_applicationNo ON eg_sw_connection (applicationno);
CREATE INDEX IF NOT EXISTS index_eg_sw_connection_connectionNo ON eg_sw_connection (connectionno);
CREATE INDEX IF NOT EXISTS index_eg_sw_connection_oldConnectionNo ON eg_sw_connection (oldconnectionno);
CREATE INDEX IF NOT EXISTS index_eg_sw_connection_property_id ON eg_sw_connection (property_id);
CREATE INDEX IF NOT EXISTS index_eg_sw_connection_applicationstatus ON eg_sw_connection (applicationstatus);

CREATE TABLE IF NOT EXISTS eg_sw_service
(
	connection_id character varying(64) NOT NULL,
	connectionExecutionDate bigint,
	noOfWaterClosets integer,
	noOfToilets integer,
	connectiontype character varying(32),
	proposedWaterClosets integer,
	proposedToilets integer,
	appCreatedDate bigint,
	detailsprovidedby character varying(256),
	estimationfileStoreId character varying(256),
	sanctionfileStoreId character varying(256),
	CONSTRAINT eg_sw_service_connection_id_fkey FOREIGN KEY (connection_id)
		REFERENCES eg_sw_connection (id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS index_eg_sw_service_appCreatedDate ON eg_ws_service (appCreatedDate);

CREATE TABLE IF NOT EXISTS eg_sw_plumberinfo
(
  id character varying(256) NOT NULL,
  name character varying(256),
  licenseno character varying(256),
  mobilenumber character varying(256),
  gender character varying(256),
  fatherorhusbandname character varying(256),
  correspondenceaddress character varying(1024),
  relationship character varying(256),
  swid character varying(64),
  CONSTRAINT uk_eg_sw_plumberinfo PRIMARY KEY (id),
  CONSTRAINT fk_eg_sw_plumberinfo_eg_sw_connection_id FOREIGN KEY (swid)
  REFERENCES public.eg_sw_connection (id) MATCH SIMPLE
  ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS eg_sw_applicationdocument
(
  id character varying(64) NOT NULL,
  tenantid character varying(64),
  documenttype character varying(64),
  filestoreid character varying(64),
  swid character varying(64),
  active character varying(64),
  documentUid character varying(64),
  createdby character varying(64),
  lastmodifiedby character varying(64),
  createdtime bigint,
  lastmodifiedtime bigint,
  CONSTRAINT uk_eg_sw_applicationdocument PRIMARY KEY (id),
  CONSTRAINT fk_eg_sw_applicationdocument_eg_sw_connection_id FOREIGN KEY (swid)
      REFERENCES public.eg_sw_connection (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);