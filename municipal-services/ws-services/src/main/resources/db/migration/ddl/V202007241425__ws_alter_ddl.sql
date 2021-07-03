CREATE TABLE IF NOT EXISTS eg_ws_connectionholder(
  tenantId            	CHARACTER VARYING (256),
  connectionid       	CHARACTER VARYING (128) NOT NULL UNIQUE,
  status              	CHARACTER VARYING (128),
  userid              	CHARACTER VARYING (128),
  isprimaryholder      	BOOLEAN,
  connectionholdertype  CHARACTER VARYING (256),
  holdershippercentage 	CHARACTER VARYING (128),
  relationship        	CHARACTER VARYING (128),
  createdby           	CHARACTER VARYING (128),
  createdtime         	BIGINT,
  lastmodifiedby      	CHARACTER VARYING (128),
  lastmodifiedtime    	BIGINT,
  CONSTRAINT fk_eg_ws_connectionholder FOREIGN KEY (connectionid) REFERENCES eg_ws_connection (id)
 );