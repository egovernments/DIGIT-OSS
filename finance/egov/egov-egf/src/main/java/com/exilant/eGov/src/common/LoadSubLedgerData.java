/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */
/*
 * Created on Jul 6, 2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.exilant.eGov.src.common;

import com.exilant.exility.common.AbstractTask;
import com.exilant.exility.common.DataCollection;
import com.exilant.exility.common.TaskFailedException;
import org.apache.log4j.Logger;
import org.egov.infstr.services.PersistenceService;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Connection;
import java.util.List;

/**
 * @author Administrator
 *
 * TODO To change the template for this generated type comment go to Window - Preferences - Java - Code Style - Code Templates
 */
@Transactional(readOnly = true)
public class LoadSubLedgerData extends AbstractTask {
 @Autowired
 @Qualifier("persistenceService")
 private PersistenceService persistenceService;

    private final static Logger LOGGER = Logger.getLogger(LoadSubLedgerData.class);
    private static TaskFailedException taskExc;

    @Override
    public void execute(final String taskName,
            final String gridName, final DataCollection dc,
            final Connection con, final boolean errorOnNoData,
            final boolean gridHasColumnHeading, final String prefix) throws TaskFailedException
    {
        //
        int noOfRec = 0;
        List<Object[]> rset = null;
        Query pst = null;

        final String cgn = dc.getValue("drillDownCgn");
        try {
            String relationType = "";
            String relationTypeID = "";
            String relationBillTable = "";
            String relationBillID = "";
            String chequeId = "";
			StringBuilder sql = new StringBuilder(
					"select sph.type,sph.chequeid from subledgerpaymentheader sph,voucherheader  vh")
							.append("  where sph.voucherheaderid=vh.id and vh.cgn = :cgn");
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("cgn", cgn);
            if (LOGGER.isDebugEnabled())
                LOGGER.debug(sql);
            rset = pst.list();
            for (final Object[] element : rset) {
                relationType = element[0].toString();
                chequeId = element[1].toString();
            }
            dc.addValue("pay_hide", relationType);
            if (chequeId == null || chequeId.equals("0"))
                dc.addValue("subLedgerPaymentHeader_typeOfPayment", "Cash");
            else
                dc.addValue("subLedgerPaymentHeader_typeOfPayment", "Cheque");
            relationTypeID = relationType + "id";
            relationBillTable = relationType + "billdetail";
            relationBillID = relationType + "billid";
			sql = new StringBuilder("select sph.type as \"pay_type\",").append(relationTypeID)
					.append(" as \"payToid\",")
					.append(" paidby as \"paidByid\",bankaccountid as \"accId\",worksdetailid as \"worksDetailid\", ")
					.append("f.name as \"fund_name\",f.id as \"fund_id\",fsrc.name as \"fundSource_id\",fsrc.name as \"fundSource_name\" ")
					.append(" from subledgerpaymentheader sph,voucherheader  vh ,fund f ,fundsource fsrc where ")
					.append(" sph.voucherheaderid=vh.id  and f.id=vh.fundid and fsrc.id=vh.fundsourceid")
					.append(" and vh.cgn = :cgn");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("cgn", cgn);
			rset = pst.list();
            for (final Object[] element : rset) {
                dc.addValue("pay_type", element[0].toString());
                dc.addValue("payToid", element[1].toString());
                dc.addValue("paidByid", element[2].toString());
                dc.addValue("accId", element[3].toString());
                dc.addValue("worksDetailid", element[4].toString());
                dc.addValue("fund_name", element[5].toString());
                dc.addValue("fund_id", element[6].toString());
                dc.addValue("fundSource_id", element[7].toString());
                dc.addValue("fundSource_name", element[8].toString());
            }

            // billcollector
			sql = new StringBuilder("select a.name as \"paidBy\",b.glcode as \"billCollector_cashInHandDesc\"")
					.append(" from billcollector a,chartofaccounts b where ")
					.append(" a.cashinhand=b.id and a.id = :billCollectorId");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("billCollectorId", dc.getValue("paidByid"));
			rset = pst.list();
            for (final Object[] element : rset) {
                dc.addValue("paidBy", element[0].toString());
                dc.addValue("billCollector_cashInHandDesc", element[1].toString());
            }

            // supplier/contractor name
			sql = new StringBuilder("select name  as \"payTo\" from relation where id = :id");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("id", dc.getValue("payToid"));
			rset = pst.list();
            for (final Object[] element : rset)
                dc.addValue("payTo", element[0].toString());

            // workorder
			sql = new StringBuilder(
					"select name  as \"worksDetail_id\" ,advanceamount as \"worksDetail_advanceAmount\"")
							.append(" from worksDetail where id = :id");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("id", dc.getValue("worksDetailid"));
			rset = pst.list();
            for (final Object[] element : rset) {
                dc.addValue("worksDetail_id", element[0].toString());
                dc.addValue("worksDetail_advanceAmount", element[1].toString());
            }

            // bank name
			sql = new StringBuilder("select a.name||' '||b.branchname as \"subLedgerPaymentHeader_bankId\"")
					.append(" from bank a ,bankbranch b, bankaccount c  where")
					.append(" a.id=b.bankid and b.id=c.branchid and c.id= :id");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("id", dc.getValue("accId"));
			rset = pst.list();
            for (final Object[] element : rset)
                dc.addValue("subLedgerPaymentHeader_bankId", element[0].toString());

            // acount number
			sql = new StringBuilder("select accountnumber as \"branchAccountId\" from bankaccount where id= :id");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("id", dc.getValue("accId"));
			rset = pst.list();
            for (final Object[] element : rset)
                dc.addValue("branchAccountId", element[0].toString());

            sql = new StringBuilder("select count(*)").append(" from ").append(relationBillTable).append(" a ,")
					.append(" voucherheader b ,subledgerpaymentheader sph  ")
					.append(" where b.id=a.voucherheaderid  and sph.").append(relationBillID).append("=a.id and ")
					.append(" sph.voucherheaderid =(select id from voucherheader where cgn = :cgn)")
					.append(" and passedamount>(a.paidamount+tdsamount+advadjamt)-sph.paidamount ").append(" and a.")
					.append(relationTypeID).append("= :payToId and b.fundid=:fundId")
					.append(" and a.worksdetailid = :worksDetailid order by a.billDate");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("cgn", cgn);
			pst.setParameter("payToId", dc.getValue("payToid"));
			pst.setParameter("fundId", dc.getValue("fund_id"));
			pst.setParameter("worksDetailid", dc.getValue("worksDetailid"));
			rset = pst.list();
            for (final Object[] element : rset)
                noOfRec = Integer.parseInt(element[0].toString());

            if (noOfRec > 0) {
                final String[][] grid = new String[noOfRec + 1][13];
				sql = new StringBuilder(
						"select a.id as \"billNoId\",billNumber as\"billNo\",vouchernumber as \"d_voucherNo\" ,")
								.append("to_char(billdate,'dd-Mon-yyyy') as \"billDate\",a.PassedAmount as \"passedAmount\",")
								.append(" advadjamt as \"advance\",TDSamount as \"tds\",OtherRecoveries as \"otherRecoveries\",")
								.append(" a.passedAmount-(advadjamt+tdsamount+otherrecoveries) as \"net\",")
								.append(" a.PaidAmount-sph.paidamount as \"earlierPayment\" ,")
								.append(" sph.paidamount as \"slph_paidAmount\",")
								// ((a.passedAmount-(advadjamt+tdsamount+otherrecoveries))-a.paidamount)
								.append(" rownum as \"slNo\" ,'1' as \"billSelect\" from ").append(relationBillTable)
								.append(" a ,").append(" voucherheader b ,subledgerpaymentheader sph  ")
								.append(" where b.id=a.voucherheaderid  and ").append(" sph.").append(relationBillID)
								.append("=a.id and ")
								.append(" sph.voucherheaderid =(select id from voucherheader where cgn= :cgn)")
								.append(" and passedamount>(a.paidamount+tdsamount+advadjamt)-sph.paidamount ")
								.append(" and a.").append(relationTypeID).append("= :payToId and b.fundid= :fundId")
								.append(" and a.worksdetailid= :worksDetailId order by a.billDate");
				if (LOGGER.isDebugEnabled())
					LOGGER.debug(sql);
				pst = persistenceService.getSession().createSQLQuery(sql.toString());
				pst.setParameter("cgn", cgn);
				pst.setParameter("payToId", dc.getValue("payToid"));
				pst.setParameter("fundId", dc.getValue("fund_id"));
				pst.setParameter("worksDetailId", dc.getValue("worksDetailid"));
				rset = pst.list();
                // grid[0][x] we filled control name
                for (final Object[] element : rset) {
                    dc.addValue("billNoId", element[0].toString());
                    dc.addValue("billNo", element[1].toString());
                    dc.addValue("d_voucherNo", element[2].toString());
                    dc.addValue("billDate", element[3].toString());
                    dc.addValue("passedAmount", element[4].toString());
                    dc.addValue("advance", element[5].toString());
                    dc.addValue("tds", element[6].toString());
                    dc.addValue("otherRecoveries", element[7].toString());
                    dc.addValue("net", element[8].toString());
                    dc.addValue("earlierPayment", element[9].toString());
                    dc.addValue("slph_paidAmount", element[10].toString());
                    dc.addValue("slNo", element[11].toString());
                    dc.addValue("billSelect", element[12].toString());
                }
                int idx = 1;// grid[from 1][x] we start filling data
                for (final Object[] element : rset) {
                    grid[idx][0] = element[0].toString();
                    grid[idx][1] = element[1].toString();
                    grid[idx][2] = element[2].toString();
                    grid[idx][3] = element[3].toString();
                    grid[idx][4] = element[4].toString();
                    grid[idx][5] = element[5].toString();
                    grid[idx][6] = element[6].toString();
                    grid[idx][7] = element[7].toString();
                    grid[idx][8] = element[8].toString();
                    grid[idx][9] = element[9].toString();
                    grid[idx][10] = element[10].toString();
                    grid[idx][11] = element[11].toString();
                    grid[idx][12] = element[12].toString();
                    idx++;
                }
                dc.addGrid(gridName, grid);
            }
			sql = new StringBuilder(
					"select cgn as \"voucherHeader_cgn\",vouchernumber as \"voucherHeader_voucherNumber\",")
							.append("to_char(voucherdate,'dd-Mon-yyyy') as \"voucherHeader_voucherDate\",")
							.append(" chequenumber as \"chequeDetail_chequeNumber\" ,to_char(chequedate,'dd-Mon-yyyy')")
							.append(" as \"chequeDetail_chequeDate\",vh.description as \"narration\",vh.fundsourceid as \"fundsource_id\"")
							.append(" from voucherheader vh,subledgerpaymentheader sph,chequedetail cq where")
							.append(" sph.voucherheaderid=vh.id  and cq.id=sph.chequeid")
							.append(" and chequeid >0 and chequeid is not null  and vh.cgn= :cgn").append(" union ")
							.append(" select cgn as \"voucherHeader_cgn\",vouchernumber as \"voucherHeader_voucherNumber\",")
							.append("to_char(voucherdate,'dd-Mon-yyyy') as \"voucherHeader_voucherDate\",'','',")
							.append("vh.description as \"narration\",")
							.append("vh.fundsourceid as \"fundsource_id\" from voucherheader vh,subledgerpaymentheader sph  where")
							.append(" sph.voucherheaderid=vh.id ")
							.append(" and (chequeid is  null or chequeid=0) and vh.cgn= :cgn");
			if (LOGGER.isDebugEnabled())
				LOGGER.debug(sql);
			pst = persistenceService.getSession().createSQLQuery(sql.toString());
			pst.setParameter("cgn", cgn);
			rset = pst.list();
            for (final Object[] element : rset) {
                dc.addValue("voucherHeader_cgn", element[0].toString());
                dc.addValue("voucherHeader_voucherNumber", element[1].toString());
                dc.addValue("voucherHeader_voucherDate", element[2].toString());
                dc.addValue("chequeDetail_chequeNumber", element[3].toString());
                dc.addValue("chequeDetail_chequeDate", element[4].toString());
                dc.addValue("subLedgerPaymentHeader_narration", element[5].toString());
                dc.addValue("fundsource_id", element[6].toString());
            }
        } catch (final Exception e) {
            LOGGER.error("Error in executing query");
            throw taskExc;
        }

    }
}