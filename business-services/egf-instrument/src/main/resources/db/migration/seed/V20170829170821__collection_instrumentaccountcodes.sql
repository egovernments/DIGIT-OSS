delete from egf_instrumentaccountcode where instrumenttypeid in ('Cash','Cheque') and tenantid='default';

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Cash', 4501001, 1, 'default');

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Cheque', 4501051, 1, 'default');

