ALTER TABLE eg_sw_applicationdocument DROP CONSTRAINT fk_eg_sw_applicationdocument_eg_sw_connection_id;
ALTER TABLE eg_sw_plumberinfo DROP CONSTRAINT fk_eg_sw_plumberinfo_eg_sw_connection_id;

ALTER TABLE eg_sw_applicationdocument ADD CONSTRAINT fk_eg_sw_applicationdocument_swid_eg_sw_connection_id FOREIGN KEY (swid) REFERENCES eg_sw_connection (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE eg_sw_plumberinfo ADD CONSTRAINT fk_eg_sw_plumberinfo_swid_eg_sw_connection_id FOREIGN KEY (swid) REFERENCES eg_sw_connection (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;