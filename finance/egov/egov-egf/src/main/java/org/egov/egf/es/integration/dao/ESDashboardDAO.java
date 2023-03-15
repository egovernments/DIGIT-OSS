package org.egov.egf.es.integration.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@Repository
public class ESDashboardDAO {
    private final Logger LOGGER = Logger.getLogger(getClass());
    private Session session;
    @PersistenceContext
    private EntityManager entityManager;
    
    public Session getCurrentSession() {
        return entityManager.unwrap(Session.class);
    }

    public Object[] getRolloutAdoptionData() throws HibernateException {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("ESDashboardDAO | getRolloutAdoptionData");
        session = getCurrentSession();
        String query = this.getRolloutAdoptionQuery();
        final Query qry = session.createSQLQuery(query);
        Object[] rollOutDatas = (Object[]) qry.uniqueResult();
        return rollOutDatas;
    }
    
	private String getRolloutAdoptionQuery() {
		StringBuilder query = new StringBuilder("select (select ct.code from eg_city ct) as id,")
				.append("(select ct.name from eg_city ct) as ulbname,")
				.append("(select ct.code from eg_city ct) as ulbcode,")
				.append("(select ct.districtName from eg_city ct) as districtname,")
				.append("(select ct.regionName from eg_city ct) as regionname,")
				.append("(select ct.grade from eg_city ct) as grade,")
				.append("(select count(*) from eg_billregister br, egw_status status")
				.append(" where br.statusid = status.id and lower(status.code) != 'cancelled') as numberOfbills,")
				.append("(select count(*) from voucherheader vh,eg_billregistermis bmis")
				.append(" where vh.id = bmis.voucherheaderid and vh.status != 4) as numberofvouchersforbill,")
				.append("(select count(*) from paymentheader ph,voucherheader pvh")
				.append(" where pvh.id = ph.voucherheaderid and pvh.status != 4 ) as numberofpayments,")
				.append("(select sum(br.billamount) from eg_billregister br, egw_status status")
				.append(" where br.statusid = status.id and lower(status.code) != 'cancelled') as totalbillamounts,")
				.append("(select sum(misc.paidamount) from voucherheader bvh,eg_billregistermis bmis,")
				.append("miscbilldetail misc,voucherheader pvh where bvh.id= bmis.voucherheaderid")
				.append(" and bvh.id = misc.billvhid and bvh.status != 4 and pvh.id=misc.payvhid and pvh.status !=4) as billamountpaid,")
				.append("(select sum(ph.paymentamount) from voucherheader vh,paymentheader ph where vh.status!=4")
				.append(" and ph.voucherheaderid=vh.id) as totalpaymentamounts,")
				.append("(select count(*) from voucherheader vh where vh.type='Receipt'")
				.append(" and vh.status!=4) as numberofreceiptvoucher,")
				.append("(select sum(gl.debitamount) from voucherheader vh,generalledger gl")
				.append(" where vh.id=gl.voucherheaderid and vh.type='Receipt' and vh.status!=4) as totalreceiptvoucheramounts,")
				.append("(select 0) as numberofmiscreceipts,(select 0) as totalamountofmiscreceipt,")
				.append("((select count(*) from egf_contractor cr,egw_status status where cr.status = status.id")
				.append(" and status.code = 'Active') + (select count(*) from egf_supplier sr,egw_status status")
				.append(" where sr.status = status.id and status.code = 'Active')) as numberofcontractorsuppliers,")
				.append("(select count(*) from bankaccount where isactive  = true) as numberofbankaccounts,")
				.append("(select count(*) from voucherheader bvh,eg_billregistermis bmis,miscbilldetail misc,")
				.append("voucherheader pvh where bvh.id= bmis.voucherheaderid and bvh.id = misc.billvhid and bvh.status != 4")
				.append(" and pvh.id=misc.payvhid and pvh.status !=4) as numberofbillspaid");
		return query.toString();
	}
}
