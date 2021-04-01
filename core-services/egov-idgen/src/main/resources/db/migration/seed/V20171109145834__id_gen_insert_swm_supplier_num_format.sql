delete from id_generator where idname = 'swm.contractor.number' and tenantId= 'default';

INSERT INTO id_generator(idname, tenantid, format, sequencenumber) VALUES ('swm.supplier.number', 'default', 'MH-SWM-SPLR-[SEQ_SWM_SPLR_NUM]', 1);