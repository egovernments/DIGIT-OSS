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
 * Created on Jan 7, 2005
 *
 */
package com.exilant.eGov.src.common;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Connection;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.egov.commons.CFiscalPeriod;
import org.egov.infra.persistence.utils.DatabaseSequenceCreator;
import org.egov.infra.persistence.utils.DatabaseSequenceProvider;
import org.egov.infra.validation.exception.ValidationError;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.infstr.services.PersistenceService;
import org.egov.utils.VoucherHelper;
import org.hibernate.Query;
import org.hibernate.exception.SQLGrammarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exilant.exility.common.AbstractTask;
import com.exilant.exility.common.DataCollection;
import com.exilant.exility.common.TaskFailedException;
import com.exilant.exility.updateservice.PrimaryKeyGenerator;

/**
 * @author pushpendra.singh
 *
 * This class contains the common methods used for E-Governments applciation
 */
@Transactional(readOnly = true)
@Service("eGovernCommon")
public class EGovernCommon extends AbstractTask {
	 
	private final SimpleDateFormat dtFormat = new SimpleDateFormat("dd-MMM-yyyy");
	
	private static final Logger LOGGER = Logger.getLogger(EGovernCommon.class);
	private static TaskFailedException taskExc;
	private static final String EXILRPERROR = "exilRPError";
	@Autowired
	@Qualifier("persistenceService")
	private PersistenceService persistenceService;
	
	@Autowired
	private DatabaseSequenceCreator databaseSequenceCreator;
	@Autowired
	private DatabaseSequenceProvider databaseSequenceProvider;
	

	@Override
	public void execute(final String taskName,
			final String gridName,
			final DataCollection datacol,
			final Connection con,
			final boolean errorData,
			final boolean gridHasCol, final String prefix) throws TaskFailedException
	{
		datacol.addValue("voucherHeader_cgn", getCGNumber());
		if (datacol.getValue("hasSecondCGN").equalsIgnoreCase("true"))
			datacol.addValue("jv_cgn", getCGNumber());
		datacol.addValue("databaseDate", getCurrentDate());
	}

	public long getCGNumber()
	{
		return PrimaryKeyGenerator.getNextKey("voucherheader");
	}

	/**
	 * This function returns the system date of the database server.
	 * @param connection
	 * @return
	 * @throws TaskFailedException
	 */
	public String getCurrentDate()
	{
		return new SimpleDateFormat("dd/MM/yyyy").format(new Date());
	}

	/**
	 *
	 * @param datacol
	 * @return
	 */
	public List getFormFields(final DataCollection datacol)
	{
		final Set formSet = datacol.values.keySet();
		final List formList = new ArrayList();
		final Iterator itr = formSet.iterator();
		while (itr.hasNext())
			formList.add(itr.next());
		return formList;
	}

	/**
	 *
	 * @param field
	 * @param data
	 * @param connection
	 * @return
	 */



	/**
	 * This function is to handle the single quotes.
	 * @param strToFormat
	 * @return
	 */
	public String formatString(final String strToFormat) {
		if (strToFormat != null)
		{
			if (strToFormat.equalsIgnoreCase(""))
				return " ";
			final String valn1 = strToFormat.replaceAll("\n", " ");
			final String formtStr = valn1.replaceAll("\r", " ");
			return formtStr.replaceAll("'", "''");
		} else
			return " ";
	}

	 

	 
	@Deprecated
	public String getCurrentDateTime() throws TaskFailedException
	{
		return new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(Calendar.getInstance().getTime());
	}

	/**
	 *
	 * @param vouType Eg - U/DBP/CGVN
	 * @param fiscialPeriod
	 * @param conn
	 * @return
	 * @throws TaskFailedException,Exception
	 */
	public String getEg_Voucher(final String vouType, final String fiscalPeriodIdStr) throws TaskFailedException
	{
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(" In EGovernCommon :getEg_Voucher method ");
		final CFiscalPeriod fiscalPeriod = (CFiscalPeriod) persistenceService.find("from CFiscalPeriod where id=?",
				Long.parseLong(fiscalPeriodIdStr));
		BigInteger cgvn = null;
		String sequenceName = "";
		// Sequence name will be SQ_U_DBP_CGVN_FP7 for vouType U/DBP/CGVN and fiscalPeriodIdStr 7
		try {
			sequenceName   = VoucherHelper.sequenceNameFor(vouType, fiscalPeriod.getName());
			cgvn = (BigInteger) databaseSequenceProvider.getNextSequence(sequenceName);
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("----- CGVN : " + cgvn);

		} catch (final SQLGrammarException e)
		{
			databaseSequenceCreator.createSequence(sequenceName);
			cgvn = (BigInteger) databaseSequenceProvider.getNextSequence(sequenceName);
			LOGGER.error("Error in generating CGVN" + e);
			throw new ValidationException(Arrays.asList(new ValidationError(e.getMessage(), e.getMessage())));
        } /*
           * catch (final Exception e) { LOGGER.error("Error in generating CGVN"
           * + e); throw new ValidationException(Arrays.asList(new
           * ValidationError(e.getMessage(), e.getMessage()))); }
           */
		return cgvn.toString();

	}



	public Map<String, Map<String, Object>> getEffectiveDateFilter(String val) throws TaskFailedException {
		final Map<String, Map<String, Object>> queryMap = new HashMap<>();
		final Map<String, Object> params = new HashMap<>();
		if (val == null)
			val = getCurrentDateTime();
		String query = new StringBuilder(
				" and TO_DATE(TO_CHAR(vh.effectivedate,'dd-Mon-yyyy HH24:MI:SS'),'dd-Mon-yyyy HH24:MI:SS')")
						.append("< TO_DATE(:date,'dd-Mon-yyyy HH24:MI:SS')").toString();
		params.put("date", val);
		queryMap.put(query, params);
		return queryMap;
	}

	public String getCurDateTime() throws TaskFailedException{
		return new SimpleDateFormat("dd-Mon-yyyy HH:mm:ss").format(new Date());
	}

	public String getBillNumber() throws TaskFailedException
	{
		throw new TaskFailedException("Method Not Supported Exception");
	}

	/**
	 * This API returns the fiscialperiodid for the date passed
	 * @param vDate
	 * @param con
	 * @return
	 */
	public String getFiscalPeriod(final String vDate) {
		BigInteger fiscalPeriod = null;
		final String sql = "select id from fiscalperiod  where '" + vDate + "' between startingdate and endingdate";
		final Query pst = persistenceService.getSession().createSQLQuery(sql);
        final List<BigInteger> rset = pst.list();
        fiscalPeriod = rset != null ? rset.get(0) : BigInteger.ZERO;
		return fiscalPeriod.toString();
	}
	
	 /**
     * Function to check if the voucher number is Unique
     * @param vcNum
     * @param vcDate
     * @param datacol
     * @param conn
     * @return
     */
    public boolean isUniqueVN(String vcNum, final String vcDate, final DataCollection datacol) throws TaskFailedException {
        boolean isUnique = false;
        vcNum = vcNum.toUpperCase();
        Query pst = null;
        List<Object[]> rs = null;
        String fyEndDate = "";
        final StringBuilder query1 = new StringBuilder("SELECT to_char(startingDate, 'DD-Mon-YYYY') AS \"startingDate\",")
        		.append(" to_char(endingDate, 'DD-Mon-YYYY') AS \"endingDate\" FROM financialYear")
        		.append(" WHERE startingDate <= :startingDate AND endingDate >= :endingDate");
        pst = persistenceService.getSession().createSQLQuery(query1.toString());
        pst.setParameter("startingDate", vcDate);
        pst.setParameter("endingDate", vcDate);
        rs = pst.list();
        for (final Object[] element : rs) {
            element[0].toString();
            fyEndDate = element[1].toString();
        }
        final StringBuilder query2 = new StringBuilder("SELECT id FROM voucherHeader")
        		.append(" WHERE voucherNumber = :voucherNumber AND voucherDate>=:voucherFromDate")
        		.append(" AND voucherDate<=:voucherToDate and status!=4");
        pst = persistenceService.getSession().createSQLQuery(query2.toString());
        pst.setParameter("voucherNumber", vcNum).setParameter("voucherFromDate", vcDate)
        		.setParameter("voucherToDate", fyEndDate);
        rs = pst.list();
        for (final Object[] element : rs)
            datacol.addMessage(EXILRPERROR, "duplicate voucher number");
        if (rs == null || rs.size() == 0)
            isUnique = true;
        return isUnique;
    }
	   
   /**
    * @param vcNum
    * @param vcDate
    * @param conn
    * @return
    * @throws TaskFailedException,Exception
    */
   public boolean isUniqueVN(String vcNum, final String vcDate) throws TaskFailedException {
       boolean isUnique = false;
       String fyStartDate = "", fyEndDate = "";
       vcNum = vcNum.toUpperCase();
       Query pst = null;                           
       List<Object[]> rs = null;
       try {
			final StringBuilder query1 = new StringBuilder(
					"SELECT to_char(startingDate, 'DD-Mon-YYYY') AS \"startingDate\",")
							.append(" to_char(endingDate, 'DD-Mon-YYYY') AS \"endingDate\" FROM financialYear")
							.append(" WHERE startingDate <= :startingDate AND endingDate >= :endingDate");
			pst = persistenceService.getSession().createSQLQuery(query1.toString());
			pst.setParameter("startingDate", vcDate).setParameter("endingDate", vcDate);
			rs = pst.list();
           if (rs != null && rs.size() > 0)
               for (final Object[] element : rs) {
                   fyStartDate = element[0].toString();
                   fyEndDate = element[1].toString();
               }
			final StringBuilder query2 = new StringBuilder("SELECT id FROM voucherHeader")
					.append(" WHERE voucherNumber = :voucherNumber AND voucherDate>=:voucherFromDate")
					.append(" AND voucherDate<=:voucherToDate and status!=4");
			pst = persistenceService.getSession().createSQLQuery(query2.toString());
			pst.setParameter("voucherNumber", vcNum).setParameter("voucherFromDate", fyStartDate)
					.setParameter("voucherToDate", fyEndDate);
			rs = pst.list();
           if (rs != null && rs.size() > 0) {
               if (LOGGER.isDebugEnabled())
                   LOGGER.debug("Duplicate Voucher Number");
           } else
               isUnique = true;
       } finally {
       }
       return isUnique;
   }

      
   
   public BigDecimal getAccountBalance(final Date VoucherDate, final String bankAccountId)
   {
       BigDecimal totalAvailable = BigDecimal.ZERO;
       BigDecimal opeAvailable = BigDecimal.ZERO;  
       Query pst = null;
       List<Object[]> resultset = null;
       List<Object[]> resultset1 = null;
       final SimpleDateFormat formatter = dtFormat;
       final String vcDate = formatter.format(VoucherDate);

    	final StringBuilder str = new StringBuilder("SELECT case when sum(openingDebitBalance) = null")
    			.append(" then 0 else sum(openingDebitBalance) end-  case when sum(openingCreditBalance) = null ")
    			.append(" then 0 else sum(openingCreditBalance) end AS \"openingBalance\" ")
    			.append("FROM transactionSummary WHERE financialYearId=( SELECT id FROM financialYear")
    			.append(" WHERE startingDate <= :startingDate AND endingDate >= :endingDate)")
    			.append(" AND glCodeId =(select glcodeid from bankaccount where id = :bankAccountId)");
    	if (LOGGER.isDebugEnabled())
    		LOGGER.debug("getAccountBalance(EGovernCommon.java): " + str);
    	pst = persistenceService.getSession().createSQLQuery(str.toString());
    	pst.setParameter("startingDate", vcDate).setParameter("endingDate", vcDate).setParameter("bankAccountId",
    			bankAccountId);
    	resultset = pst.list();
           for (final Object[] element : resultset)
           opeAvailable = new BigDecimal(element[0].toString());
       if (resultset == null || resultset.size() == 0)
           if (LOGGER.isDebugEnabled())
               LOGGER.debug("Else resultset in getbalance");

       if (LOGGER.isDebugEnabled())
           LOGGER.debug("opening balance  " + opeAvailable);
       // resultset.close();

    	final StringBuilder str1 = new StringBuilder("SELECT (case when sum(gl.debitAmount) = null then 0")
    			.append(" else sum(gl.debitAmount) end) - (case when sum(gl.creditAmount) = null then 0")
    			.append(" else sum(gl.creditAmount) end) + ").append(opeAvailable)
    			.append(" as \"totalAmount\" FROM   generalLedger gl, voucherHeader vh WHERE vh.id = gl.voucherHeaderId")
    			.append(" AND gl.glCodeid = (select glcodeid from bankaccount where id = :bankAccountId) AND  ")
    			.append(" vh.voucherDate >=( SELECT TO_CHAR(startingDate, 'dd-Mon-yyyy')")
    			.append(" FROM financialYear WHERE startingDate <= :startingDate AND endingDate >= :endingDate)")
    			.append(" AND vh.voucherDate <= :voucherDate and vh.status!=4");

    	if (LOGGER.isDebugEnabled())
    		LOGGER.debug("Curr Yr Bal: " + str1);
    	pst = persistenceService.getSession().createSQLQuery(str1.toString())
    			.setParameter("bankAccountId", bankAccountId).setParameter("startingDate", vcDate)
    			.setParameter("endingDate", vcDate).setParameter("voucherDate", vcDate);
    	resultset1 = pst.list();
    	for (final Object[] element : resultset1) {
    		totalAvailable = new BigDecimal(element[0].toString());
    		if (LOGGER.isDebugEnabled())
    			LOGGER.debug("total balance  " + totalAvailable);
    	}
       if (resultset1 == null || resultset1.size() == 0)
           if (LOGGER.isDebugEnabled())
               LOGGER.debug("Else resultset in getbalance...");

       totalAvailable = totalAvailable.setScale(2, BigDecimal.ROUND_HALF_UP);
       if (LOGGER.isDebugEnabled())
           LOGGER.debug("total balance before return " + totalAvailable);
       return totalAvailable;
   }
	public String assignValue(final String data, final String defaultValue)
	{
		if (StringUtils.isNotBlank(data))
			return "'" + trimChar(formatString(data), "'".charAt(0)) + "'";
		else if (StringUtils.isNotBlank(defaultValue))
			return "'" + trimChar(defaultValue, "'".charAt(0)) + "'";
		else
			return defaultValue;
	}
	
	
	public BigDecimal getAccountBalance(final String recDate, final String bankAccountId) throws ParseException
    {

        BigDecimal opeAvailable = BigDecimal.ZERO;
        BigDecimal totalAvailable = BigDecimal.ZERO;
        Query pst = null;
        List<Object[]> resultset = null;
        List<Object[]> resultset1 = null;
        final StringBuilder str = new StringBuilder("SELECT case when sum(openingDebitBalance) is null then 0")
        		.append(" else sum(openingDebitBalance) end - case when sum(openingCreditBalance) is null then 0")
        		.append(" else sum(openingCreditBalance) end AS \"openingBalance\" ")
        		.append(" FROM transactionSummary WHERE financialYearId=( SELECT id FROM financialYear")
        		.append(" WHERE startingDate <= :startingDate AND endingDate >= :endingDate )")
        		.append(" AND glCodeId =(select glcodeid from bankaccount where id = :bankAccountId )");
        if (LOGGER.isDebugEnabled())
        	LOGGER.debug("getAccountBalance(EGovernCommon.java): " + str);
        pst = persistenceService.getSession().createSQLQuery(str.toString());
        SimpleDateFormat dtSlashFormat = new SimpleDateFormat("dd/MMM/yyyy");
        Date reconDate = dtSlashFormat.parse(recDate);
        java.sql.Date sDate = new java.sql.Date(reconDate.getTime());
        pst.setParameter("startingDate", sDate).setParameter("endingDate", sDate).setParameter("bankAccountId",
        		Integer.valueOf(bankAccountId));
        List list = pst.list();
        if (list == null || list.size() == 0)
            if (LOGGER.isDebugEnabled()) LOGGER.debug("Else resultset in getAccountBalance...");

        if(list!=null || list.size() > 0)
        {
        	opeAvailable=new BigDecimal(list.get(0).toString());
        }
        
         /* for (final Object[] element : resultset)
        {
        	if(element[0]!=null)
            opeAvailable = new BigDecimal(element[0].toString());
        }*/
         
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("opening balance  " + opeAvailable);

        final StringBuilder str1 = new StringBuilder("SELECT (case when sum(gl.debitAmount) is null then 0 ")
        		.append("else sum(gl.debitAmount) end - case when sum(gl.creditAmount)  is null then 0")
        		.append(" else sum(gl.creditAmount) end ) + ").append(opeAvailable)
        		.append(" as \"totalAmount\" FROM   generalLedger gl, voucherHeader vh WHERE vh.id = gl.voucherHeaderId")
        		.append(" and gl.glCodeid = (select glcodeid from bankaccount where id = :bankAccountId) AND  ")
        		.append(" vh.voucherDate >=( SELECT startingDate FROM financialYear WHERE startingDate <= :startingDate")
        		.append(" AND endingDate >= :endingDate) AND vh.voucherDate <= :voucherDate and vh.status!=4");

        if (LOGGER.isDebugEnabled())
        	LOGGER.debug("Curr Yr Bal: " + str1);
        pst = persistenceService.getSession().createSQLQuery(str1.toString());
        pst.setParameter("bankAccountId", Integer.valueOf(bankAccountId)).setParameter("startingDate", reconDate)
        		.setParameter("endingDate", reconDate).setParameter("voucherDate", reconDate);
        List list2 = pst.list();
        if(list2!=null)
           totalAvailable = new BigDecimal(list2.get(0).toString());
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("total balance  " + totalAvailable);       
        
        if (resultset1 == null || resultset1.size() == 0)
            if (LOGGER.isDebugEnabled())
                LOGGER.debug("Else resultset in getAccountBalance...");

        totalAvailable = totalAvailable.setScale(2, BigDecimal.ROUND_HALF_UP);
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("total balance before return " + totalAvailable);
        return totalAvailable;    
    }

	/**
	 * this function trims ch in string
	 * @param str
	 * @param ch
	 * @return
	 */
	public String trimChar(String str, final char ch)
	{
		Boolean b = true, e = true;
		str = str.trim();
		while (str.length() > 0 && (b || e))
		{
			if (str.charAt(0) == ch)
				str = str.substring(1, str.length());
			else
				b = false;
			if (str.charAt(str.length() - 1) == ch)
				str = str.substring(0, str.length() - 1);
			else
				e = false;
		}
		return str;
	}










	/**
	 * To get the EGW_STATUS id
	 * @param con
	 * @param moduleType
	 * @param description
	 * @return statusId
	 * @throws TaskFailedException 
	 */
	public String getEGWStatusId(final String moduleType, final String description) throws TaskFailedException
	{
		String statusId = "0";
		Query pstmt = null;
		List<Object[]> rs = null;
		try
		{
			final String sql = " select distinct id from egw_status where upper(moduletype)= ? and upper(description)= ? ";
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("statement" + sql);
			pstmt = persistenceService.getSession().createSQLQuery(sql);
			pstmt.setString(0, moduleType.toUpperCase());
			pstmt.setString(1, description.toUpperCase());
			rs = pstmt.list();
			for (final Object[] element : rs)
				statusId = element[0].toString();

			if (LOGGER.isDebugEnabled())
				LOGGER.debug("$$$$$$$$$$$$$$$$$$$statusId===" + statusId);
			if (statusId == null || statusId.equals("0"))
				throw taskExc;

		} catch (final TaskFailedException e)
		{
			LOGGER.error("Exception in getEGWStatusId=====:" + e.getMessage());
			throw taskExc;
		}
		return statusId;
	}



	public PersistenceService getPersistenceService() {
		return persistenceService;
	}

	public void setPersistenceService(final PersistenceService persistenceService) {
		this.persistenceService = persistenceService;
	}

}
