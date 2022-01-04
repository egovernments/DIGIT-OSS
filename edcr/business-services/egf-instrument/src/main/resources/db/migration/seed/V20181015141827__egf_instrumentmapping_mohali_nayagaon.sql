delete from egf_instrumentaccountcode where instrumenttypeid in ('Cash','Cheque','DD','Card') and tenantid='pb.mohali';

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Cash', 4501001, 1, 'pb.mohali');

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Cheque', 4501051, 1, 'pb.mohali');

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'DD', 4501051, 1, 'pb.mohali');

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Card', 4501091, 1, 'pb.mohali');

delete from egf_instrumentaccountcode where instrumenttypeid in ('Cash','Cheque','DD','Card') and tenantid='pb.nayagaon';

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Cash', 4501001, 1, 'pb.nayagaon');

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Cheque', 4501051, 1, 'pb.nayagaon');

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'DD', 4501051, 1, 'pb.nayagaon');

insert into egf_instrumentaccountcode(id,instrumenttypeid, accountcodeid, createdby, tenantid) values(nextval('seq_egf_instrumentaccountcode'),'Card', 4501091, 1, 'pb.nayagaon');

