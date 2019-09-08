ALTER TABLE eg_tl_billingslab
ADD CONSTRAINT uk_eg_tl_billingslab
UNIQUE(tenantid,licensetype,structuretype,tradetype,accessorycategory,type,uom,fromUom,toUom);

CREATE INDEX consumercode_tradetype_idx ON eg_tl_calculator_tradetype (consumercode) ;
CREATE INDEX consumercode_accessory_idx ON eg_tl_calculator_accessory (consumercode);
