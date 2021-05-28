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

package org.egov.services.pea;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.egov.commons.CFinancialYear;
import org.egov.commons.dao.FinancialYearHibernateDAO;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infstr.services.PersistenceService;
import org.egov.utils.Constants;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public class TransferClosingBalanceService extends PersistenceService {

    private static final SimpleDateFormat FORMATDDMMYYYY = new SimpleDateFormat("dd/MM/yyyy", Constants.LOCALE);

    @Autowired
    @Qualifier("financialYearDAO")
    private FinancialYearHibernateDAO financialYearDAO;

    public TransferClosingBalanceService() {
        super(null);
    }

    public TransferClosingBalanceService(Class type) {
        super(type);
    }


	@Transactional
	public void transfer(Long financialYear, CFinancialYear fy, CFinancialYear nextFinancialYear) {

		deleteNextFYTransactionSummary(nextFinancialYear);

		String fyStartingDate = FORMATDDMMYYYY.format(fy.getStartingDate());
		String fyEndingDate = FORMATDDMMYYYY.format(fy.getEndingDate());

		/*
		 * Processing all the COA which are non- subledger codes. Also we will process
		 * for all COAs that are control codes which are having data with accountdetail
		 * type which is not same as that of what is mentioned in the database. The
		 * result data is been inserted into the opening balance Note- COA code for
		 * Excess IE is been excluded for processing as this will be taken care
		 * separately.
		 */
		Map<String, Map<String, Object>> queryMap = getQueryForNonControlCodesAndMisMatchsInControlCodes(financialYear,
				fyStartingDate, fyEndingDate, nextFinancialYear);
		Entry<String, Map<String, Object>> queryEntry = queryMap.entrySet().iterator().next();
		final Query nonControCodesQuery = getSession().createSQLQuery(queryEntry.getKey());
		queryEntry.getValue().entrySet()
				.forEach(entry -> nonControCodesQuery.setParameter(entry.getKey(), entry.getValue()));
		nonControCodesQuery.executeUpdate();

		/*
		 * Processing all control codes both transaction and opening balance and the net
		 * balance is been inserted as the opening balance.
		 */
		queryMap = getQueryForControlCodes(financialYear, fyStartingDate, fyEndingDate, nextFinancialYear);
		queryEntry = queryMap.entrySet().iterator().next();
		final Query controlCodesQuery = getSession().createSQLQuery(queryEntry.getKey());
		queryEntry.getValue().entrySet()
				.forEach(entry -> controlCodesQuery.setParameter(entry.getKey(), entry.getValue()));
		controlCodesQuery.executeUpdate();

		/*
		 * COA for Excess IE transaction balance + Opening balance will be calculated
		 * along with the Income - expenses for that year.
		 */
		queryMap = getQueryForIncomeOverExpense(financialYear, fyStartingDate, fyEndingDate, nextFinancialYear);
		queryEntry = queryMap.entrySet().iterator().next();

		final Query query = getSession().createSQLQuery(queryEntry.getKey());
		queryEntry.getValue().entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
		query.executeUpdate();

		updateCurrentYearTransferClosingBalance(fy);
	}

	@Transactional
	public void deleteNextFYTransactionSummary(CFinancialYear nextFinancialYear) {
		Query query = null;
		query = getSession().createSQLQuery("delete from TransactionSummary where financialyearid = :financialyearid")
				.setParameter("financialyearid", nextFinancialYear.getId());
		query.executeUpdate();
	}

    @Transactional
    public void updateCurrentYearTransferClosingBalance(CFinancialYear fy) {
        fy.setTransferClosingBalance(true);
        financialYearDAO.update(fy);
    }

    /**
     * This function is called to calculate the closing balance for GlCodes of type A,L (Excluding ExcessIE code)
     * 
     * Transaction entries for Non-Control codes(1st Query)
     * 
     * UNION
     * 
     * Opening Balance entries for Non-Control codes(2nd Query)
     * 
     * UNION
     * 
     * Mismatch Transaction entries for Control codes(3rd Query)
     * 
     * UNION
     * 
     * Mismatch Opening Balance entries for Control codes(4th Query)
     * 
     */

	private Map<String, Map<String, Object>> getQueryForNonControlCodesAndMisMatchsInControlCodes(Long financialYear, String fyStartingDate,
			String fyEndingDate, CFinancialYear nextFinancialYear) {
		final StringBuilder query = new StringBuilder();
		final Map<String, Map<String, Object>> queryMap = new HashMap<>();
		final Map<String, Object> queryParms = new HashMap<>();
		query.append(
				" INSERT INTO TransactionSummary (id, financialYearId, lastmodifiedby, glcodeid,fundId,departmentCode,")
				.append("functionid ,openingdebitbalance, openingcreditbalance, accountdetailtypeid, accountdetailkey,lastmodifieddate)")
				.append(String.format(" SELECT nextval('seq_transactionsummary'), %d, %d", nextFinancialYear.getId(),
						ApplicationThreadLocals.getUserId()))
				.append(" ,glcodeId AS glCodeId, fundid AS fundId,deptId AS deptId ,functionid AS functionId,CASE")
				.append(" WHEN balance > 0 THEN abs(balance) ELSE 0 END AS openingbalancedebitamount,CASE WHEN balance < 0")
				.append(" THEN abs(balance) ELSE 0 END AS openingbalancecreditamount,null,null,current_date ")
				.append(" FROM ( ")
				.append(" SELECT glcodeId AS glCodeId,fundId AS fundId,deptId AS deptId,functionid AS functionId,SUM(dr) AS dr,")
				.append("SUM(cr) AS cr,SUM(balance) AS balance FROM ( ");

		// Transaction entries for Non-Control codes(1st Query)

		query.append(" SELECT gl.glcodeId AS glCodeId,vh.fundId AS fundId,mis.departmentCode  AS deptId, ").append(
				"gl.functionid AS functionId,SUM(CASE WHEN debitamount = 0 THEN 0 ELSE debitamount END) AS dr, ")
				.append(" SUM(CASE WHEN creditAmount = 0 THEN 0 ELSE creditAmount END) AS cr,(SUM(CASE WHEN debitamount = 0")
				.append(" THEN 0 ELSE debitamount END) - SUM(CASE WHEN creditAmount = 0 THEN 0 ELSE creditAmount END)) AS balance ")
				.append(" FROM voucherHeader vh,vouchermis mis,chartOfAccounts coa,generalledger gl LEFT JOIN")
				.append(" generalledgerdetail gld ON gl.id = gld.generalledgerid ")
				.append(" WHERE gld.id IS NULL AND vh.id = gl.voucherHeaderId AND gl.glCode=coa.glcode ")
				.append(" AND (coa.purposeid IS NULL OR coa.purposeid NOT IN (SELECT id FROM egf_accountcode_purpose")
				.append(" WHERE name = 'ExcessIE' ) ) AND vh.id = mis.voucherheaderid AND vh.voucherDate >=")
				.append("to_date(:fyStartingDate,'dd/mm/yyyy') AND vh.voucherDate <=to_date(:fyEndingDate,'dd/mm/yyyy')")
				.append(" AND vh.status NOT  IN(4,5) AND coa.type IN('A','L') ")
				.append(" GROUP BY gl.glcodeId,vh.fundId,mis.departmentCode,gl.functionid UNION ALL ");

		// Opening Balance entries for Non-Control codes(2nd Query)

		query.append(" SELECT ts.glcodeid AS glCodeId,ts.fundid AS fundId,ts.departmentCode  AS deptId,")
				.append("ts.functionid AS functionId,SUM(CASE WHEN ts.openingdebitbalance = 0 THEN 0 ELSE")
				.append(" ts.openingdebitbalance END) AS dr, ")
				.append(" SUM(CASE WHEN ts.openingcreditbalance = 0 THEN 0 ELSE ts.openingcreditbalance END) AS cr,")
				.append("(SUM( CASE WHEN ts.openingdebitbalance = 0 THEN 0 ELSE ts.openingdebitbalance END) - SUM(CASE")
				.append(" WHEN ts.openingcreditbalance = 0 THEN 0 ELSE ts.openingcreditbalance END)) AS balance ")
				.append(" FROM transactionsummary ts,chartofaccounts coa ")
				.append(" WHERE  ts.ACCOUNTDETAILKEY  IS NULL AND ts.ACCOUNTDETAILTYPEID IS NULL AND coa.id = ts.glcodeid")
				.append(" AND (coa.purposeid IS NULL OR coa.purposeid NOT IN (SELECT id FROM egf_accountcode_purpose")
				.append(" WHERE name = 'ExcessIE') ) ")
				.append(" AND coa.type IN('A','L') AND ts.financialyearid = :financialyearid")
				.append(" GROUP BY ts.glcodeid,ts.fundid ,ts.departmentCode ,ts.functionid UNION ALL ");

		// Mismatch Transaction entries for Control codes(3rd Query)

		query.append(" SELECT gl.glcodeId AS glCodeId,vh.fundId AS fundId,mis.departmentCode AS deptId,").append(
				"gl.functionid AS functionId,SUM(CASE WHEN gl.debitamount = 0 THEN 0 ELSE gld.amount END) AS dr,")
				.append(" SUM(CASE WHEN gl.creditamount = 0 THEN 0 ELSE gld.amount END) AS cr, ")
				.append(" SUM(CASE WHEN gl.debitamount = 0 THEN 0 ELSE gld.amount END)-SUM(CASE WHEN gl.creditamount = 0")
				.append(" THEN 0 ELSE gld.amount END) AS balance ")
				.append(" FROM voucherHeader vh, vouchermis mis, chartOfAccounts coa,generalledger gl,generalLedgerDetail gld")
				.append(" WHERE  vh.id= gl.voucherHeaderId  AND vh.id =mis.voucherheaderid AND gl.glCode =coa.glcode ")
				.append("AND (coa.purposeid IS NULL OR coa.purposeid NOT IN (SELECT id FROM egf_accountcode_purpose")
				.append(" WHERE name = 'ExcessIE' ) ) ")
				.append(" AND gl.id  = gld.generalLedgerId AND gld.detailtypeid NOT IN (SELECT coadtl.detailtypeid")
				.append(" FROM chartofaccountdetail coadtl WHERE coadtl.glcodeid = coa.id )")
				.append(" AND vh.voucherDate >=to_date(:fyStartingDate,'dd/mm/yyyy') AND vh.voucherDate <=")
				.append("to_date(:fyEndingDate,'dd/mm/yyyy') AND coa.type IN('A','L') AND vh.status NOT  IN(4,5) ")
				.append(" GROUP BY gl.glcodeId,vh.fundId,mis.departmentCode,gl.functionid UNION ALL ");

		// Mismatch Opening Balance entries for Control codes(4th Query)
		query.append(" SELECT ts.glcodeid AS glCodeId,ts.fundid AS fundId,ts.departmentCode  AS deptId,")
				.append("ts.functionid AS functionId,SUM(CASE WHEN ts.openingdebitbalance = 0 THEN 0")
				.append(" ELSE ts.openingdebitbalance END) AS dr, ")
				.append(" SUM(CASE WHEN ts.openingcreditbalance = 0 THEN 0 ELSE ts.openingcreditbalance  END) AS cr,")
				.append("(SUM(CASE WHEN ts.openingdebitbalance = 0 THEN 0 ELSE ts.openingdebitbalance END)")
				.append(" - SUM(CASE WHEN ts.openingcreditbalance = 0 THEN 0 ELSE ts.openingcreditbalance END)) AS balance ")
				.append(" FROM transactionsummary ts,chartofaccounts coa ")
				.append(" WHERE (ts.accountdetailtypeid is not null and ts.accountdetailtypeid NOT IN (")
				.append("SELECT coadtl.detailtypeid FROM chartofaccountdetail coadtl WHERE coadtl.glcodeid = coa.id ))")
				.append(" AND (coa.purposeid   IS NULL OR coa.purposeid NOT IN (SELECT id FROM egf_accountcode_purpose ")
				.append("WHERE name = 'ExcessIE' ) ) ")
				.append(" AND coa.id = ts.glcodeid AND coa.type IN('A','L') AND ts.financialyearid = :financialyearid")
				.append(" GROUP BY ts.glcodeid,ts.fundid ,ts.departmentCode ,ts.functionid) closingbalance")
				.append(" GROUP BY glcodeId ,fundId ,deptId ,functionid ")
				.append(" ORDER BY glcodeId ,fundId ,deptId ,functionid ) final");

		queryParms.put("fyStartingDate", fyStartingDate);
		queryParms.put("fyEndingDate", fyEndingDate);
		queryParms.put("financialyearid", financialYear);

		queryMap.put(query.toString(), queryParms);
		
		return queryMap;

	}

    /**
     * This function is called to calculate the closing balance for GlCodes of type A,L (Excluding ExcessIE code)
     * 
     * Transaction entries for Control codes(1st Query)
     * 
     * UNION
     * 
     * Opening Balance entries for Control codes(2nd Query)
     * 
     * 
     */
	private Map<String, Map<String, Object>> getQueryForControlCodes(Long financialYear, String fyStartingDate,
			String fyEndingDate, CFinancialYear nextFinancialYear) {
		final StringBuilder query = new StringBuilder();
		final Map<String, Map<String, Object>> queryMap = new HashMap<>();
		final Map<String, Object> queryParams = new HashMap<>();
		query.append(
				" INSERT INTO TransactionSummary (id, financialYearId, lastmodifiedby, glcodeid,fundId,departmentCode,")
				.append("functionid , accountdetailtypeid, accountdetailkey,openingdebitbalance, openingcreditbalance,lastmodifieddate)")
				.append(String.format(" SELECT nextval('seq_transactionsummary'), %d, %d", nextFinancialYear.getId(),
						ApplicationThreadLocals.getUserId()))
				.append(" ,glcodeId AS glCodeId, fundid AS fundId,deptId AS deptId ,functionid AS functionId,")
				.append(" detailTypeId  AS detailTypeId,detailKeyId AS detailKeyId, CASE WHEN balance > 0 THEN abs(balance)")
				.append(" ELSE 0 END AS openingbalancedebitamount, CASE WHEN balance < 0 THEN abs(balance) ELSE 0 END")
				.append(" AS openingbalancecreditamount,current_date FROM ( ")
				.append(" SELECT glcodeId AS glCodeId,fundId AS fundId, deptId AS deptId,functionid AS functionId,detailTypeId ")
				.append(" AS detailTypeId,detailKeyId AS detailKeyId,SUM(dr) AS dr,SUM(cr) AS cr,SUM(balance)   AS balance ")
				.append(" FROM (");

		// Transaction entries for Control codes(1st Query)

		query.append(" SELECT gl.glcodeId AS glCodeId,vh.fundId AS fundId,mis.departmentCode  AS deptId,")
				.append("gl.functionid AS functionId,gld.detailTypeId  AS detailTypeId,gld.detailKeyId AS detailKeyId,")
				.append("SUM(CASE WHEN gl.debitamount = 0 THEN 0 ELSE gld.amount END) AS dr, ")
				.append(" SUM(CASE WHEN gl.creditamount = 0 THEN 0 ELSE gld.amount END) AS cr,SUM(CASE WHEN gl.debitamount = 0")
				.append(" THEN 0 ELSE gld.amount END)-SUM(CASE WHEN gl.creditamount = 0   THEN 0 ELSE gld.amount END) AS balance ")
				.append(" FROM voucherHeader vh,vouchermis mis,chartOfAccounts coa,chartofaccountdetail coadtl,generalledger gl,")
				.append("generalLedgerDetail gld ")
				.append(" WHERE vh.id = gl.voucherHeaderId AND vh.id  =mis.voucherheaderid AND gl.glCode=coa.glcode")
				.append(" AND coa.id = coadtl.glcodeid AND (coa.purposeid   IS NULL OR coa.purposeid NOT IN")
				.append(" (SELECT id FROM egf_accountcode_purpose WHERE name = 'ExcessIE' ) ) ")
				.append(" AND gl.id = gld.generalLedgerId AND gld.detailtypeid = coadtl.detailtypeid")
				.append(" AND vh.voucherDate  >=to_date(:fyStartingDate,'dd/mm/yyyy') AND vh.voucherDate")
				.append(" <=to_date(:fyEndingDate,'dd/mm/yyyy') AND coa.type IN('A','L') AND vh.status NOT IN(4,5) ")
				.append(" GROUP BY gl.glcodeId,gld.detailTypeId,gld.detailKeyId,vh.fundId,mis.departmentCode,gl.functionid ")
				.append(" UNION ALL ");

		// Opening Balance entries for Control codes(2nd Query)

		query.append(" SELECT ts.glcodeid AS glCodeId,ts.fundid AS fundId,ts.departmentCode AS deptId,").append(
				"ts.functionid AS functionId,ts.accountdetailtypeid AS detailTypeId ,ts.accountdetailkey AS detailKeyId ,")
				.append("SUM(CASE WHEN ts.openingdebitbalance = 0 THEN 0 ELSE ts.openingdebitbalance END) AS dr, ")
				.append(" SUM(CASE WHEN ts.openingcreditbalance = 0 THEN 0 ELSE ts.openingcreditbalance END) AS cr,")
				.append("(SUM(CASE WHEN ts.openingdebitbalance = 0 THEN 0 ELSE ts.openingdebitbalance END)")
				.append(" - SUM(CASE WHEN ts.openingcreditbalance = 0 THEN 0 ELSE ts.openingcreditbalance END)) AS balance ")
				.append(" FROM transactionsummary ts,chartofaccounts coa,chartofaccountdetail coadtl WHERE coa.id = coadtl.glcodeid")
				.append(" AND ts.accountdetailtypeid =coadtl.detailtypeid AND coa.id = ts.glcodeid AND (coa.purposeid IS NULL")
				.append(" OR coa.purposeid NOT IN (SELECT id FROM egf_accountcode_purpose WHERE name = 'ExcessIE' ) ) ")
				.append(" AND coa.type IN('A','L') AND ts.financialyearid = :financialyearid")
				.append(" GROUP BY ts.glcodeid,ts.accountdetailtypeid ,ts.accountdetailkey,ts.fundid ,ts.departmentCode ,ts.functionid ")
				.append(" ) closingbalance ")
				.append(" GROUP BY glcodeId ,detailTypeId,detailKeyId,fundId ,deptId ,functionid ")
				.append("ORDER BY glcodeId ,detailTypeId,detailKeyId,fundId ,deptId ,functionid ) final");

		queryParams.put("fyStartingDate", fyStartingDate);
		queryParams.put("fyEndingDate", fyEndingDate);
		queryParams.put("financialyearid", financialYear);

		queryMap.put(query.toString(), queryParams);
		return queryMap;
	}

    /**
     * This function is called to calculate the closing balance for GlCodes of type I,E and ExcessIE Code
     * 
     * Transaction entries for Income codes(1st Query) (X)
     * 
     * UNION
     * 
     * Transaction entries for Expense codes(2nd Query) (Y)
     * 
     */

    /**
     * (X-Y)
     * 
     * UNION
     * 
     * Transaction entries for ExcessIE Code(3rd Query)
     * 
     * UNION
     * 
     * Opening Balance entries for ExcessIE Code(4th Query)
     * 
     */
	private Map<String, Map<String, Object>> getQueryForIncomeOverExpense(Long financialYear, String fyStartingDate,
			String fyEndingDate, CFinancialYear nextFinancialYear) {
		final StringBuilder query = new StringBuilder();
		final Map<String, Map<String, Object>> queryMap = new HashMap<>();
		final Map<String, Object> queryParams = new HashMap<>();
		query.append(" INSERT INTO TransactionSummary (id, financialYearId, lastmodifiedby, glcodeid,fundId,")
				.append("departmentCode,functionid ,openingdebitbalance, openingcreditbalance, accountdetailtypeid,")
				.append(" accountdetailkey,lastmodifieddate)")
				.append(String.format(" SELECT nextval('seq_transactionsummary'), %d, %d ", nextFinancialYear.getId(),
						ApplicationThreadLocals.getUserId()))
				.append(" ,(select id from chartofaccounts where purposeid in (SELECT id FROM egf_accountcode_purpose")
				.append(" WHERE name = 'ExcessIE' )), fundid AS fundId,deptId  AS deptId ,functionid  AS functionId,")
				.append("CASE WHEN balance < 0 THEN abs(balance) ELSE 0 END AS openingbalancedebitamount,CASE WHEN balance > 0")
				.append(" THEN abs(balance) ELSE 0 END AS openingbalancecreditamount,null,null,current_date ")
				.append(" FROM ( ")
				.append(" SELECT fundid AS fundId,deptId  AS deptId , functionid   AS functionId, SUM(balance) AS balance ")
				.append(" FROM ( ");

		// (X-Y)
		query.append(
				" SELECT fundid AS fundId, deptId AS deptId ,functionid AS functionId,SUM(Income)-SUM(Expense) AS balance ")
				.append(" FROM ( ");

		// Transaction entries for Income codes(1st Query) (X)
		query.append(" SELECT vh.fundid AS fundId,vmis.departmentCode AS deptId ,gl.functionid AS functionId,")
				.append("CASE WHEN SUM(gl.creditAmount)-SUM(gl.debitamount) IS NULL THEN 0 ELSE SUM(gl.creditAmount)")
				.append("-SUM(gl.debitamount) END AS Income, 0   AS Expense ")
				.append(" FROM chartofaccounts coa, generalledger gl,voucherHeader vh,vouchermis vmis WHERE vh.ID = gl.VOUCHERHEADERID ")
				.append(" AND gl.glcode =coa.glcode AND vmis.voucherheaderid=vh.id AND vh.VOUCHERDATE >= ")
				.append("to_date(:fyStartingDate,'dd/mm/yyyy') AND vh.VOUCHERDATE <= to_date(:fyEndingDate,'dd/mm/yyyy')")
				.append(" AND vh.status NOT IN(4,5) AND coa.TYPE = 'I' ")
				.append(" GROUP BY vh.fundId,vmis.departmentCode,gl.functionid UNION ALL ");

		// Transaction entries for Expense codes(2nd Query) (Y)

		query.append(" SELECT vh.fundid    AS fundId,vmis.departmentCode AS deptId ,gl.functionid AS functionId,")
				.append(" 0 AS Income,CASE WHEN SUM(gl.debitamount)-SUM(gl.creditAmount) IS NULL THEN 0 ELSE")
				.append(" SUM(gl.debitamount)-SUM(gl.creditAmount) END AS Expense ")
				.append(" FROM chartofaccounts coa,generalledger gl,voucherHeader vh,vouchermis vmis")
				.append(" WHERE vh.ID = gl.VOUCHERHEADERID AND gl.glcode =coa.glcode AND vmis.voucherheaderid=vh.id")
				.append(" AND vh.VOUCHERDATE  >= to_date(:fyStartingDate,'dd/mm/yyyy') AND vh.VOUCHERDATE <= ")
				.append("to_date(:fyEndingDate,'dd/mm/yyyy') AND vh.status NOT IN(4,5) AND coa.TYPE = 'E' ")
				.append(" GROUP BY vh.fundId,vmis.departmentCode,gl.functionid ) IncomeAndExpense GROUP BY fundId,deptId,functionId ")
				.append(" UNION ALL ");

		// Transaction entries for ExcessIE Code(3rd Query)

		query.append(" SELECT fundid  AS fundId,deptId AS deptId ,functionid  AS functionId, SUM(balance) AS balance ")
				.append(" FROM ( ")
				.append(" SELECT vh.fundid   AS fundId,vmis.departmentCode AS deptId ,gl.functionid AS functionId,CASE")
				.append(" WHEN SUM(gl.creditAmount)-SUM(gl.debitamount) IS NULL THEN 0 ELSE SUM(gl.creditAmount)-SUM(gl.debitamount)")
				.append(" END AS balance ")
				.append(" FROM chartofaccounts coa,generalledger gl,voucherHeader vh,vouchermis vmis ")
				.append(" WHERE vh.ID = gl.VOUCHERHEADERID AND gl.glcode = coa.glcode AND coa.purposeid IN ")
				.append("(SELECT id FROM egf_accountcode_purpose WHERE name = 'ExcessIE' ) AND vmis.voucherheaderid=vh.id")
				.append(" AND vh.VOUCHERDATE >= to_date(:fyStartingDate,'dd/mm/yyyy') AND vh.VOUCHERDATE <=")
				.append(" to_date(:fyEndingDate,'dd/mm/yyyy') AND vh.status NOT IN(4,5) ")
				.append(" GROUP BY vh.fundId,vmis.departmentCode,gl.functionid UNION ALL ");

		// Opening Balance entries for ExcessIE Code(4th Query)

		query.append(" SELECT ts.fundid AS fundId,ts.departmentCode  AS deptId,ts.functionid AS functionId,")
				.append("SUM( ts.openingcreditbalance ) - SUM( ts.openingdebitbalance ) AS balance ")
				.append(" FROM transactionsummary ts,chartofaccounts coa ")
				.append(" WHERE coa.id  = ts.glcodeid AND coa.purposeid IN (SELECT id FROM egf_accountcode_purpose")
				.append(" WHERE name = 'ExcessIE' ) AND ts.financialyearid = :financialyearid")
				.append(" GROUP BY ts.fundid ,ts.departmentCode ,ts.functionid ) ExcessIECode ")
				.append(" GROUP BY fundid , deptId ,functionid ) IncomeOverExpense ")
				.append(" GROUP BY fundid ,deptId ,functionid ) final");

		queryParams.put("fyStartingDate", fyStartingDate);
		queryParams.put("fyEndingDate", fyEndingDate);
		queryParams.put("financialyearid", financialYear);

		queryMap.put(query.toString(), queryParams);

		return queryMap;

	}

}
