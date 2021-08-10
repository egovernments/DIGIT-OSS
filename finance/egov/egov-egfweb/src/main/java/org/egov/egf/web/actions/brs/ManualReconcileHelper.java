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

package org.egov.egf.web.actions.brs;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.egov.commons.Bankaccount;
import org.egov.commons.CFinancialYear;
import org.egov.commons.EgwStatus;
import org.egov.commons.dao.EgwStatusHibernateDAO;
import org.egov.commons.dao.FinancialYearHibernateDAO;
import org.egov.egf.model.ReconcileBean;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.models.FinancialStatus;
import org.egov.infra.microservice.models.Instrument;
import org.egov.infra.microservice.models.InstrumentSearchContract;
import org.egov.infra.microservice.models.TransactionType;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infstr.services.PersistenceService;
import org.egov.model.instrument.InstrumentHeader;
import org.egov.services.instrument.InstrumentHeaderService;
import org.egov.services.instrument.InstrumentOtherDetailsService;
import org.egov.utils.FinancialConstants;
import org.hibernate.HibernateException;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BigDecimalType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class ManualReconcileHelper {

	private static  final Logger LOGGER = Logger.getLogger(ManualReconcileHelper.class);

    private static final String INSTRUMENTTYPE_NAME_CHEQUE = "Cheque";

    private static final String INSTRUMENT_NEW_STATUS = "Deposited";

	@Autowired
	private AppConfigValueService appConfigValueService;
	@Autowired
	@Qualifier("persistenceService")
	private PersistenceService persistenceService;

	@Autowired
	@Qualifier("instrumentOtherDetailsService")
	private InstrumentOtherDetailsService instrumentOtherDetailsService;
	@Autowired
	private EgwStatusHibernateDAO egwStatusHibernateDAO;
	
	@Autowired
	@Qualifier("instrumentHeaderService")
	private InstrumentHeaderService instrumentHeaderService;
	
	@Autowired
	private MicroserviceUtils microserviceUtils;
	SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy");
	@Autowired
        FinancialYearHibernateDAO financialYearDAO;

        private int DEFAULT_LIMIT = 100;
        
	public Map<String,String> getUnReconciledDrCr(Long bankAccId,Date fromDate,Date toDate)  
	{
		Map<String,String> unreconMap=new LinkedHashMap<String,String>();
		//String  ="decode(iv.voucherHeaderId,null,0,ih.instrumentAmount)";
		String instrumentsForBrsEntryTotal="case when br.voucherHeaderId is null then ih.instrumentAmount else 0 end";
		//String instrumentsForOtherTotal="decode(br.voucherHeaderId,null,ih.instrumentAmount,0)";
		String voucherExcludeStatuses=getExcludeStatuses();
		
		StringBuilder totalQuery = new StringBuilder("SELECT (sum(CASE WHEN ih.ispaycheque='1' then ih.instrumentAmount else 0 end ))  AS \"brs_creditTotal\", ")
                .append(" (sum(CASE WHEN ih.ispaycheque = '0' then  ih.instrumentAmount else 0 end)) AS \"brs_debitTotal\" ")
                .append(" FROM egf_instrumentheader ih 	WHERE   ih.bankAccountId =:bankAccountId ")
                .append(" AND IH.INSTRUMENTDATE >= :fromDate")
                .append(" AND IH.INSTRUMENTDATE <= :toDate")
                .append(" AND  ( (ih.ispaycheque='0' and  ih.id_status=(select id from egw_status where moduletype='Instrument' ")
                .append(" and description='Deposited'))or (ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where ")
                .append(" moduletype='Instrument'  and description='New'))) ")
                .append(" and ih.instrumentnumber is not null");
		//see u might need to exclude brs entries here 
		
		StringBuilder otherTotalQuery = new StringBuilder(" SELECT (sum(case when ih.ispaycheque='1' then ih.instrumentAmount else 0 end))  AS \"brs_creditTotalOthers\", ")
                .append(" (sum(case when ih.ispaycheque= '0' then ih.instrumentAmount else 0 end))  AS \"brs_debitTotalOthers\" ")
                .append(" FROM  egf_instrumentheader ih	WHERE   ih.bankAccountId =:bankAccountId")
                .append(" AND IH.transactiondate >= :fromDate")
                .append(" AND IH.transactiondate <= :toDate  ")
                .append(" AND ( (ih.ispaycheque='0' and ih.id_status=(select id from egw_status where moduletype='Instrument'")
                .append("  and description='Deposited'))or (ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where")
                .append(" moduletype='Instrument'  and description='New'))) ")
                .append(" AND ih.transactionnumber is not null");
		
		StringBuilder brsEntryQuery = new StringBuilder(" SELECT (sum(case when ih.ispaycheque= '1' then ")
                .append(instrumentsForBrsEntryTotal)
                .append(" else 0 end ))  AS \"brs_creditTotalBrsEntry\", ")
                .append(" (sum(case when ih.ispaycheque= '0' then ")
                .append(instrumentsForBrsEntryTotal)
                .append(" else 0 end))  AS \"brs_debitTotalBrsEntry\" ")
                .append(" FROM egf_instrumentheader ih, bankentries br	WHERE   ih.bankAccountId = :bankAccountId")
                .append(" AND IH.transactiondate >= :fromDate  ")
                .append(" AND IH.transactiondate <= :toDate ")
                .append(" AND ( (ih.ispaycheque='0' and ih.id_status=(select id from egw_status where moduletype='Instrument' ")
                .append(" and description='Deposited')) or (ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='New'))) ")
                .append(" AND br.instrumentHeaderid=ih.id and ih.transactionnumber is not null");
		
	
		if(LOGGER.isInfoEnabled())     LOGGER.info("  query  for  total : "+totalQuery);
		
		
		
		String unReconciledDrCr="";
		
		
		String creditTotal=null;
		String creditOthertotal=null;
		String debitTotal=null;
		String debitOtherTotal=null;
		String creditTotalBrsEntry=null;
		String debitTotalBrsEntry=null;
		
		try
		{
			SQLQuery totalSQLQuery = persistenceService.getSession().createSQLQuery(totalQuery.toString());
			totalSQLQuery.setLong("bankAccountId",bankAccId);
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

			if(LOGGER.isInfoEnabled())     LOGGER.info("  query  for other than cheque/DD: "+otherTotalQuery);
			totalSQLQuery = persistenceService.getSession().createSQLQuery(otherTotalQuery.toString());
			totalSQLQuery.setLong("bankAccountId",bankAccId);
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
			if(LOGGER.isInfoEnabled())     LOGGER.info("  query  for bankEntries: "+brsEntryQuery);

			totalSQLQuery = persistenceService.getSession().createSQLQuery(brsEntryQuery.toString());
			totalSQLQuery.setLong("bankAccountId",bankAccId);
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

			
      /* ReconcileBean reconBean=new ReconcileBean();
       reconBean.setCreditAmount(BigDecimal.valueOf(creditTotal));
       reconBean.setDebitAmount(debitTotal);
       */
			creditTotal=creditTotal==null?"0":creditTotal;
			debitTotal=debitTotal==null?"0":debitTotal;
			creditOthertotal=creditOthertotal==null?"0":creditOthertotal;
			debitOtherTotal=debitOtherTotal==null?"0":debitOtherTotal;
			debitTotalBrsEntry=debitTotalBrsEntry==null?"0":debitTotalBrsEntry;
			
			unreconMap.put("Cheque/DD/Cash Payments",creditTotal);
			unreconMap.put("Cheque/DD/Cash Receipts",debitTotal);
			unreconMap.put("RTGS Payments",creditOthertotal);
			unreconMap.put("Other Receipts",debitOtherTotal);
			unreconMap.put("BRS Entry",debitTotalBrsEntry);
			
		/*//unReconciledDrCr="Cheque/DD/Cash Payments:"+(creditTotal != null ? creditTotal : "0" )+",RTGS Payments:"+(creditOthertotal!= null ? creditOthertotal : "0")
		+",Cheque/DD/Cash Receipts:"+(debitTotal!= null ? debitTotal : "0") +",Other Receipts:"+( debitOtherTotal!= null ? debitOtherTotal : "0")+""+
		"/"+(creditTotalBrsEntry!= null ? creditTotalBrsEntry : "0") +",Net:"+( debitTotalBrsEntry!= null ? debitTotalBrsEntry : "0")+"";*/
		}
		catch(HibernateException e)
		{
			LOGGER.error("Exp in getUnReconciledDrCr"+e.getMessage());
			
		}
		return unreconMap;
	}
	
	private String getExcludeStatuses() {
		
		List<AppConfigValues> configValuesByModuleAndKey = appConfigValueService.getConfigValuesByModuleAndKey("EGF","statusexcludeReport");
		final String statusExclude = configValuesByModuleAndKey.get(0).getValue();
		return statusExclude;
		
	}
	
	public List<ReconcileBean> getUnReconciledCheques(ReconcileBean reconBean) 
	{
		List<ReconcileBean> list=new ArrayList<ReconcileBean>();
		String instrumentCondition="";
		if(reconBean.getInstrumentNo()!=null && !reconBean.getInstrumentNo().isEmpty())
		{
			instrumentCondition = " and (ih.instrumentNumber=:instrumentNo or ih.transactionnumber=:transactionNo ) ";
		}
		try{
		String voucherExcludeStatuses=getExcludeStatuses();
        StringBuffer query = new StringBuffer().append(" select string_agg(distinct v.vouchernumber, ',') as \"voucherNumber\" ,ih.id as \"ihId\",")
                .append(" case when ih.instrumentNumber is null then 'Direct' else ih.instrumentNumber  end as \"chequeNumber\", ")
                .append(" to_char(ih.instrumentdate,'dd/mm/yyyy') as \"chequeDate\" ,ih.instrumentAmount as \"chequeAmount\",rec.transactiontype as \"txnType\" , ")
                .append(" case when rec.transactionType='Cr' then  'Payment' else 'Receipt' end as \"type\", insType.type as instrumentType FROM BANKRECONCILIATION rec, BANKACCOUNT BANK,")
                .append(" VOUCHERHEADER v ,egf_instrumentheader ih, egf_instrumentotherdetails io, egf_instrumentVoucher iv, egf_instrumenttype insType	WHERE ")
                .append("  ih.bankAccountId = BANK.ID AND bank.id =:bankAccId   AND IH.INSTRUMENTDATE <= :toDate  ")
                .append(" AND v.ID= iv.voucherheaderid  and v.STATUS not in  (")
                .append(voucherExcludeStatuses)
                .append(")")
                .append(instrumentCondition)
                .append(" AND ((ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='Deposited') and ih.ispaycheque='0')")
                .append(" or (ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='New'))) ")
                .append(" AND rec.instrumentHeaderId=cast(ih.id as varchar(100))	 and iv.instrumentHeaderid=ih.id and io.instrumentheaderid=ih.id and insType.id=ih.instrumenttype and ih.instrumentNumber is not null")
                .append(" group by ih.id,rec.transactiontype,insType.type ")
                .append(" union  ")
                .append(" select string_agg(distinct v.vouchernumber, ',') as \"voucherNumber\" , ih.id as \"ihId\", case when ih.transactionnumber is null")
                .append(" then 'Direct' else ih.transactionnumber end as \"chequeNumber\", ")
                .append(" to_char(ih.transactiondate,'dd/mm/yyyy') as \"chequedate\" ,ih.instrumentAmount as \"chequeamount\",rec.transactiontype as \"txnType\",")
                .append(" case when rec.transactionType= 'Cr' then 'Payment' else 'Receipt' end    as \"type\" , insType.type as instrumentType ")
                .append(" FROM BANKRECONCILIATION rec, BANKACCOUNT BANK,")
                .append(" VOUCHERHEADER v ,egf_instrumentheader ih, egf_instrumentotherdetails io, egf_instrumentVoucher iv, egf_instrumenttype insType WHERE   ih.bankAccountId = BANK.ID")
                .append(" AND bank.id = :bankAccId  AND IH.transactiondate <= :toDate ")
                .append(instrumentCondition)
                .append(" AND v.ID= iv.voucherheaderid and v.STATUS not in  (")
                .append(voucherExcludeStatuses)
                .append(") AND ((ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='Deposited') and ih.ispaycheque='0')")
                .append(" or (ih.ispaycheque='1' and  ih.id_status=(select id from egw_status where moduletype='Instrument'  and description='New'))) ")
                .append(" AND rec.instrumentHeaderId=cast(ih.id as varchar(100))  and iv.instrumentHeaderid=ih.id and io.instrumentheaderid=ih.id and insType.id=ih.instrumenttype and ih.transactionnumber is not null")
                .append(" group by ih.id,rec.transactiontype,insType.type order by 4 ");
        
       
        if(reconBean.getLimit() != null && reconBean.getLimit() != 0){
            query.append(" limit :limit");
        }else{
            query.append(" limit "+DEFAULT_LIMIT );
            reconBean.setLimit(DEFAULT_LIMIT);
        }
		
       // if(LOGGER.isInfoEnabled())    
        LOGGER.info("  query  for getUnReconciledCheques: "+query);
		/*String query=" SELECT decode(rec.chequeNumber, null, 'Direct', rec.chequeNumber) as \"chequeNumber\",rec.chequedate as \"chequedate\" ,amount as \"chequeamount\",transactiontype as \"txnType\" ,rec.type as \"type\" from bankreconciliation rec, bankAccount bank, voucherheader vh "
			+" where  rec.bankAccountId = bank.id AND bank.id ="+bankAccId+" and  rec.isReversed = 0 AND (rec.reconciliationDate > to_date('"+recDate+"'  || ' 23:59:59','DD-MON-YYYY HH24:MI:SS') "
			+" OR (rec.isReconciled = 0)) AND vh.VOUCHERDATE <= to_date('"+recDate+"'  || ' 23:59:59','DD-MON-YYYY HH24:MI:SS') and vh.id=rec.VOUCHERHEADERID and vh.STATUS<>4"
			+" union "
			+" select refno as \"chequeNumber\", txndate as \"chequedate\", txnamount as \"chequeamount\", decode(type,'R','Dr','Cr') as \"txnType\", "
			+" type as \"type\" from bankentries be,bankAccount bank where  be.bankAccountId = bank.id and bank.id ="+bankAccId+"  "
			+" and txndate<= to_date('"+recDate+"'  || ' 23:59:59','DD-MON-YYYY HH24:MI:SS') and voucherheaderid is null ";
*/
        
        
		SQLQuery createSQLQuery = persistenceService.getSession().createSQLQuery(query.toString());
		if (reconBean.getInstrumentNo() != null && !reconBean.getInstrumentNo().isEmpty()) {
			createSQLQuery.setParameter("instrumentNo", reconBean.getInstrumentNo(), StringType.INSTANCE)
                    .setParameter("transactionNo", reconBean.getInstrumentNo(), StringType.INSTANCE);
        }
		if (reconBean.getLimit() != null & reconBean.getLimit() != 0)
			createSQLQuery.setParameter("limit", reconBean.getLimit(), IntegerType.INSTANCE);
		
		createSQLQuery.setLong("bankAccId", reconBean.getAccountId());
		createSQLQuery.setDate("toDate", reconBean.getReconciliationDate());
		createSQLQuery.addScalar("voucherNumber",StringType.INSTANCE);
		createSQLQuery.addScalar("ihId",StringType.INSTANCE);
		createSQLQuery.addScalar("chequeDate",StringType.INSTANCE);
		createSQLQuery.addScalar("chequeNumber",StringType.INSTANCE);
		createSQLQuery.addScalar("chequeAmount",BigDecimalType.INSTANCE);
		createSQLQuery.addScalar("txnType",StringType.INSTANCE);
		createSQLQuery.addScalar("type",StringType.INSTANCE);
		createSQLQuery.addScalar("instrumentType",StringType.INSTANCE);
		createSQLQuery.setResultTransformer(Transformers.aliasToBean(ReconcileBean.class));
	    list = (List<ReconcileBean>)createSQLQuery.list();
	        
	        try {
	            this.getUnreconsiledReceiptInstruments(reconBean,list);
                } catch (ObjectNotFoundException e) {
                    LOGGER.error("ERROR occurred while fetching the unrconciled receipt instruments : "+e.getMessage());
                }
		}
		catch(ApplicationRuntimeException e)
		{
			LOGGER.error("Exp in getUnReconciledCheques:"+e.getMessage());
			throw new ApplicationRuntimeException(e.getMessage());
		}
		return list;
	}

	private void getUnreconsiledReceiptInstruments(ReconcileBean reconBean,List<ReconcileBean> list) {
	    if(list.size() < reconBean.getLimit()){
	        InstrumentSearchContract contract = new InstrumentSearchContract();
	        if(reconBean.getAccountId() != null){
	            StringBuilder query = new StringBuilder("from Bankaccount ba where ba.id=:bankAccountId and isactive=true");
	            Query createSQLQuery = persistenceService.getSession().createQuery(query.toString());
	            List<Bankaccount> bankAccount = createSQLQuery.setLong("bankAccountId", reconBean.getAccountId()).list();
	            contract.setBankAccountNumber(bankAccount.get(0).getAccountnumber());
	        }
	        if(StringUtils.isNotBlank(reconBean.getInstrumentNo())){
	            contract.setTransactionNumber(reconBean.getInstrumentNo());
	        }
	        if(StringUtils.isNotBlank(reconBean.getLimit().toString())){
	            contract.setPageSize(reconBean.getLimit() - list.size());
	        }
	        contract.setInstrumentTypes(INSTRUMENTTYPE_NAME_CHEQUE);
	        contract.setTransactionType(TransactionType.Debit);
	        contract.setFinancialStatuses(INSTRUMENT_NEW_STATUS);
	        CFinancialYear finYearByDate = financialYearDAO.getFinYearByDate(reconBean.getReconciliationDate());
	        contract.setTransactionFromDate(finYearByDate.getStartingDate());
	        contract.setTransactionToDate(reconBean.getReconciliationDate());
	        List<Instrument> instruments = microserviceUtils.getInstrumentsBySearchCriteria(contract);
	        for(Instrument ins : instruments){
	            if(ins.getInstrumentVouchers() != null && !ins.getInstrumentVouchers().isEmpty()){
	                ReconcileBean reconcileBean = new ReconcileBean();
	                String txnType = ins.getTransactionType().name();;
	                String type = TransactionType.Credit.equals(txnType) ? "Payment" : "Receipt";
	                String pattern = "dd/MM/yyyy";
	                SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
	                String date = simpleDateFormat.format(ins.getTransactionDate());
	                reconcileBean.setVoucherNumber(ins.getInstrumentVouchers().get(0).getVoucherHeaderId());
	                reconcileBean.setIhId("rm_rec~"+ins.getId());
	                reconcileBean.setChequeDate(date);
	                reconcileBean.setChequeNumber(ins.getTransactionNumber());
	                reconcileBean.setChequeAmount(ins.getAmount());
	                reconcileBean.setTxnType(txnType);
	                reconcileBean.setType(type);
	                reconBean.setInstrumentType(ins.getInstrumentType().getName());
	                list.add(reconcileBean);
	            }
	        }
	        
	    }
    }

    @Transactional
	public void update(List<Date> reconDates, List<String> instrumentHeaders) {
		int i=0;
		EgwStatus reconciledStatus = egwStatusHibernateDAO.getStatusByModuleAndCode(FinancialConstants.STATUS_MODULE_INSTRUMENT, FinancialConstants.INSTRUMENT_RECONCILED_STATUS);
		Map<String,Date> instrumentIdAndDateMap = new HashMap<>();
		for(Date reconcileOn:reconDates)
		{
			if(reconcileOn!=null)
			{
				String ihId = instrumentHeaders.get(i);
				if(!ihId.contains("rm_rec~")){
				    InstrumentHeader ih = instrumentHeaderService.reconcile(reconcileOn, Long.parseLong(ihId),reconciledStatus ); 
				    instrumentOtherDetailsService.reconcile(reconcileOn,  Long.parseLong(ihId),ih.getInstrumentAmount());
				}else{
				    instrumentIdAndDateMap.put(ihId.split("rm_rec~")[1],reconcileOn);
				}
			}
			i++;
		}
		if(!instrumentIdAndDateMap.isEmpty()){
		    List<Instrument> instruments = microserviceUtils.getInstruments(StringUtils.join(instrumentIdAndDateMap.keySet(),","));
		    FinancialStatus finStatus = new FinancialStatus();
		    finStatus.setCode("Reconciled");
		    finStatus.setName("Reconciled");
		    instruments.stream().forEach(ins-> {
		        ins.setReconciledOn(instrumentIdAndDateMap.get(ins.getId()));
		    });
		    microserviceUtils.updateInstruments(instruments, null, finStatus);
		}
	}
	
}
