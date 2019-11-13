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

package com.exilant.eGov.src.domain;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.egov.commons.Bankaccount;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.microservice.models.Instrument;
import org.egov.infra.microservice.models.InstrumentSearchContract;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infstr.services.PersistenceService;
import org.egov.model.brs.BrsEntries;
import org.egov.model.instrument.InstrumentHeader;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
@Component
public class BankReconciliationSummary {

	private static final Logger LOGGER = Logger.getLogger(BankReconciliationSummary.class);
        private static final String INSTRUMENTTYPE_NAME_CHEQUE = "Cheque";
        private static final String INSTRUMENT_DEPOSITED_STATUS = "Deposited";
	@Autowired
	@Qualifier("persistenceService")
	protected PersistenceService persistenceService;
	@Autowired
        private MicroserviceUtils microserviceUtils;
	

	String defaultStatusExclude=null;
	
	
	SimpleDateFormat sdf1 =new SimpleDateFormat("yyyy-MM-dd");
	SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy");
	
	
	
	public String getUnReconciledDrCr(Integer bankAccId,Date fromDate,Date toDate) throws Exception
	{
		String totalQuery="SELECT (sum(case when ih.ispaycheque='1' then ih.instrumentAmount else 0 end))  AS \"brs_creditTotal\", "
			+" (sum( case when ih.ispaycheque= '0' then ih.instrumentAmount else 0 end) ) AS \"brs_debitTotal\" "
			+" FROM egf_instrumentheader ih 	WHERE   ih.bankAccountId =:bankAccountId "
			+" AND IH.INSTRUMENTDATE >= :fromDate" 
			+" AND IH.INSTRUMENTDATE <= :toDate"
			+" AND  ( (ih.ispaycheque='0' and  ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='Deposited'))or (ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='New'))) "
			+" and ih.instrumentnumber is not null";
	//see u might need to exclude brs entries here 
		
		String otherTotalQuery=" SELECT (sum(case when ih.ispaycheque='1' then ih.instrumentAmount else 0 end ))  AS \"brs_creditTotalOthers\", "
			+" (sum(case when ih.ispaycheque='0' then ih.instrumentAmount else 0 end ) ) AS \"brs_debitTotalOthers\" "
			+" FROM  egf_instrumentheader ih	WHERE   ih.bankAccountId =:bankAccountId"
			+" AND IH.transactiondate >= :fromDate"
			+" AND IH.transactiondate <= :toDate  "
			+" AND ( (ih.ispaycheque='0' and ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='Deposited'))or (ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='New'))) "
			+" AND ih.transactionnumber is not null";

		String brsEntryQuery="select (sum(case when be.type='Receipt' then (case when be.voucherheaderid is null then be.txnamount else 0 end) else 0 end))AS \"brs_creditTotalBrsEntry\","
				+"(sum(case when be.type='Payment' then (case when be.voucherheaderid is null then be.txnamount else 0 end) else 0 end))AS \"brs_debitTotalBrsEntry\""
				+"FROM  bankentries be WHERE   be.bankAccountId = :bankAccountId and be.voucherheaderid is null AND be.txndate >=:fromDate   AND be.txndate <= :toDate";

		if(LOGGER.isInfoEnabled())     LOGGER.info("  query  for  total : "+totalQuery);
		if(LOGGER.isInfoEnabled())     LOGGER.info("  query  for other than cheque/DD: "+otherTotalQuery);
		if(LOGGER.isInfoEnabled())     LOGGER.info("  query  for bankEntries: "+brsEntryQuery);
		
		String unReconciledDrCr="";
		String creditTotal=null;
		String creditOthertotal=null;
		String debitTotal=null;
		String debitOtherTotal=null;
		String creditTotalBrsEntry=null;
		String debitTotalBrsEntry=null;
		
		try
		{
			SQLQuery totalSQLQuery =  persistenceService.getSession().createSQLQuery(totalQuery);
			totalSQLQuery.setInteger("bankAccountId",bankAccId);
			totalSQLQuery.setDate("fromDate",fromDate);
			totalSQLQuery.setDate("toDate",toDate);
			
			List list = totalSQLQuery.list();
			if (list.size()>0)
			{
				if(LOGGER.isDebugEnabled())     LOGGER.debug(list.get(0));
				Object [] my = (Object[])list.get(0);
				creditTotal=my[0]!=null?my[0].toString():null;
				debitTotal=my[1]!=null?my[1].toString():null;
			}

			totalSQLQuery = persistenceService.getSession().createSQLQuery(otherTotalQuery);
			totalSQLQuery.setInteger("bankAccountId",bankAccId);
			totalSQLQuery.setDate("fromDate",fromDate);
			totalSQLQuery.setDate("toDate",toDate);
			list = totalSQLQuery.list();
			if (list.size()>0)
			{
				if(LOGGER.isDebugEnabled())     LOGGER.debug(list.get(0));
				Object [] my = (Object[])list.get(0);
				creditOthertotal=my[0]!=null?my[0].toString():null;
				debitOtherTotal=my[1]!=null?my[1].toString():null;
			}

			totalSQLQuery = persistenceService.getSession().createSQLQuery(brsEntryQuery);
			totalSQLQuery.setInteger("bankAccountId",bankAccId);
			totalSQLQuery.setDate("fromDate",fromDate);
			totalSQLQuery.setDate("toDate",toDate);
			list = totalSQLQuery.list();
			if (list.size()>0)
			{
				if(LOGGER.isDebugEnabled())     LOGGER.debug(list.get(0));
				Object [] my = (Object[])list.get(0);
				creditTotalBrsEntry=my[0]!=null?my[0].toString():null;
				debitTotalBrsEntry=my[1]!=null?my[1].toString():null;
			}
			
			BigDecimal recInsAmount = this.getTotalAmountDepositedInstrumentsOfReceipt(bankAccId, fromDate,toDate);
			debitTotal = recInsAmount.add(StringUtils.isNumeric(debitTotal) ? new BigDecimal(debitTotal) : new BigDecimal(0)).toString();

		unReconciledDrCr=(creditTotal != null ? creditTotal : "0" )+"/"+(creditOthertotal!= null ? creditOthertotal : "0")
		+"/"+(debitTotal!= null ? debitTotal : "0") +"/"+( debitOtherTotal!= null ? debitOtherTotal : "0")+""+
		"/"+(creditTotalBrsEntry!= null ? creditTotalBrsEntry : "0") +"/"+( debitTotalBrsEntry!= null ? debitTotalBrsEntry : "0")+"";
		}
		catch(Exception e)
		{
			LOGGER.error("Exp in getUnReconciledDrCr"+e.getMessage());
			throw e;
		}
		return unReconciledDrCr;
	}
	
	public BigDecimal getTotalAmountDepositedInstrumentsOfReceipt(Integer bankAccId,Date fromDate,Date toDate){
	    BigDecimal recDepositedAmount = new BigDecimal(0);
	    try {
	        List<Instrument> list = this.getDepositedInstrumentsOfReceipt(bankAccId, fromDate, toDate);
	        for(Instrument ins : list){
	            recDepositedAmount = recDepositedAmount.add(ins.getAmount());
	        }
            } catch (Exception e) {
                LOGGER.error("Error occurred while fetching Deposited Instruments : ",e);
            }
	    return recDepositedAmount;
	}
	
	public List<Instrument> getDepositedInstrumentsOfReceipt(Integer bankAccId,Date fromDate,Date toDate){
            InstrumentSearchContract insSearchContra = new InstrumentSearchContract();
            insSearchContra.setFinancialStatuses(INSTRUMENT_DEPOSITED_STATUS);
            insSearchContra.setBankAccountNumber(this.getBankAccountNumberById(bankAccId));
            insSearchContra.setInstrumentTypes(INSTRUMENTTYPE_NAME_CHEQUE);
            insSearchContra.setTransactionFromDate(fromDate);
            insSearchContra.setTransactionToDate(toDate);
            List<Instrument> list = new ArrayList<Instrument>();
            try {
                list = microserviceUtils.getInstrumentsBySearchCriteria(insSearchContra);
            } catch (Exception e) {
                LOGGER.error("Error occurred while fetching Deposited Instruments : ",e);
            }
            return list;
        }
	
	private String getBankAccountNumberById(Integer bankAccId) {
	    StringBuilder query = new StringBuilder("from Bankaccount ba where ba.id=:bankAccountId and isactive=true");
	    Query createSQLQuery = persistenceService.getSession().createQuery(query.toString());
	    List<Bankaccount> bankAccount = createSQLQuery.setLong("bankAccountId", bankAccId).list();
	    return !bankAccount.isEmpty() && bankAccount.get(0) != null ? bankAccount.get(0).getAccountnumber() : null;
	}
	
	public List<InstrumentHeader> getIssuedInstrumentsNotPresentInBank(String type, Date fromDate, Date toDate, Long bankAccountId){
	    String query = "SELECT *"
	            +" FROM egf_instrumentheader ih         WHERE   ih.bankAccountId =:bankAccountId"
	            +" AND  ((ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='New')))";
	    if(type.equalsIgnoreCase("Cheque/DD")){
	        query += " and ih.INSTRUMENTDATE >= :fromDate  and ih.INSTRUMENTDATE <= :toDate and ih.instrumentnumber is not null";
	    }else if(type.equalsIgnoreCase("Other")){
	        query += " and ih.transactiondate >= :fromDate  and ih.transactiondate <= :toDate   and ih.transactionnumber is not null";
	    }
	    try {
	        SQLQuery sqlQuery = persistenceService.getSession().createSQLQuery(query);
	        sqlQuery.setLong("bankAccountId",bankAccountId);
	        sqlQuery.setDate("fromDate",fromDate);
	        sqlQuery.setDate("toDate",toDate);
	        sqlQuery.addEntity(InstrumentHeader.class);
	        return sqlQuery.list();
            } catch (Exception e) {
                LOGGER.error("ERROR occurred while fetching the details of getIssuedInstrumentsNotPresentInBank : ", e);
            }
	    return Collections.EMPTY_LIST;
	}
	
	public List<BrsEntries> getBrsEntriesList(String type, Date fromDate, Date toDate, Long bankAccountId){
	    String query = "select * FROM  bankentries be WHERE   be.bankAccountId = :bankAccountId and be.voucherheaderid is null AND be.txndate >=:fromDate   AND be.txndate <= :toDate and be.type=:type";
	    try {
	        SQLQuery sqlQuery = persistenceService.getSession().createSQLQuery(query);
	        sqlQuery.setLong("bankAccountId",bankAccountId);
	        sqlQuery.setDate("fromDate",fromDate);
	        sqlQuery.setDate("toDate",toDate);
	        sqlQuery.setString("type", type);
	        sqlQuery.addEntity(BrsEntries.class);
	        return sqlQuery.list();
            } catch (Exception e) {
                LOGGER.error("ERROR occurred while fetching the details of getBrsEntriesList : ",e);
            }
	    return Collections.EMPTY_LIST;
	}
}
