ALTER TABLE eg_pt_billingslab_v2

ADD COLUMN unBuiltUnitRate numeric(10,2),
    
ADD COLUMN arvPercent numeric(10,2);

ALTER TABLE eg_pt_billingslab_v2 ALTER COLUMN unitrate TYPE  numeric(10,2);