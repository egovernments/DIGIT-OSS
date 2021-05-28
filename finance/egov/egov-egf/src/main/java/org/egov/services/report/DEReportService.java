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
package org.egov.services.report;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.egov.commons.CFinancialYear;
import org.egov.commons.dao.FinancialYearHibernateDAO;
import org.egov.egf.model.DepartmentwiseExpenditureReport;
import org.egov.egf.model.DepartmentwiseExpenditureResult;
import org.egov.infra.admin.master.entity.Department;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.utils.DateUtils;
import org.egov.infstr.services.PersistenceService;
import org.egov.utils.Constants;
import org.egov.utils.FinancialConstants;
import org.hibernate.Query;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;

public class DEReportService {

    final static Logger LOGGER = Logger.getLogger(DEReportService.class);
    private @Autowired AppConfigValueService appConfigValuesService;
    @Autowired
    private FinancialYearHibernateDAO financialYearDAO;
    private PersistenceService persistenceService;

    public Date getPreviousYearFor(final Date date) {
        final GregorianCalendar previousYearToDate = new GregorianCalendar();
        previousYearToDate.setTime(date);
        final int prevYear = previousYearToDate.get(Calendar.YEAR) - 1;
        previousYearToDate.set(Calendar.YEAR, prevYear);
        return previousYearToDate.getTime();
    }

    /**
     * Returns the number of days between fromDate and toDate
     *
     * @param fromDate the date
     * @param toDate the date
     * @return Long the number of days
     */
    public Integer getNumberOfDays(final Date fromDate, final Date toDate) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("Entered into getNumberOfDays");
        final Calendar fromDateCalendar = Calendar.getInstance();
        final Calendar toDateCalendar = Calendar.getInstance();
        fromDateCalendar.setTime(fromDate);
        toDateCalendar.setTime(toDate);
        Integer days = 0;
        while (fromDateCalendar.before(toDateCalendar)) {
            fromDateCalendar.add(Calendar.DAY_OF_MONTH, 1);
            days++;
        }
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("getNumberOfDays - days: " + days + " between " + fromDate + " and " + toDate);
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("Exiting from getNumberOfDays");
        return days;
    }

    public Date getFinancialYearStartDate(final Date date) {
        CFinancialYear cFinancialYear = null;
		final Query query = persistenceService.getSession().createQuery(
				new StringBuilder(" from CFinancialYear cfinancialyear where cfinancialyear.startingDate <=:sDate")
						.append(" and cfinancialyear.endingDate >=:eDate").toString());
        query.setDate("sDate", date);
        query.setDate("eDate", date);
        final ArrayList list = (ArrayList) query.list();
        if (list.size() > 0)
            cFinancialYear = (CFinancialYear) list.get(0);
        if (null == cFinancialYear)
            throw new ApplicationRuntimeException("Financial Year Id does not exist.");
        return cFinancialYear.getStartingDate();
    }

    public boolean validateDateRange(final DepartmentwiseExpenditureReport deObject) {
        return financialYearDAO.isSameFinancialYear(deObject.getFromDate(), deObject.getToDate());
    }

    public Date getPreviousDateFor(final Date date) {

        final GregorianCalendar previousDate = new GregorianCalendar();
        previousDate.setTime(date);
        final int prevDt = previousDate.get(Calendar.DATE) - 1;
        previousDate.set(Calendar.DATE, prevDt);
        return previousDate.getTime();
    }

	public Query getConcurrenceDateForPeriod(final DepartmentwiseExpenditureReport deObject) {

		final StringBuilder stringQry = new StringBuilder();
		final Map<String, Object> params = new HashMap<>();
		String fundcondition = " ";
		String fmDate = "";
		String toDate = "";
		if (!deObject.getFundId().equals("") || deObject.getFundId().equals("0")) {
			fundcondition = " and vh.fundId=:fundId";
			params.put("fundId", deObject.getFundId());
		}
		if (deObject.getPeriod().equalsIgnoreCase("current")) {
			fmDate = getFormattedDate(deObject.getFromDate());
			toDate = getFormattedDate(deObject.getToDate());
		} else if (deObject.getPeriod().equalsIgnoreCase("previous")) {
			fmDate = getFormattedDate(getPreviousYearFor(deObject.getFromDate()));
			toDate = getFormattedDate(getPreviousYearFor(deObject.getToDate()));
		}
		if (!(deObject.getAssetCode() != null && deObject.getAssetCode().equals("0"))) {
			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append("  ROUND(SUM(gl.debitamount)/100000,2) AS concurrenceAmount, ")
					.append("   TO_date(ph.concurrenceDate)  as concurrenceDate ")
					.append("  FROM voucherheader vh,  generalledger gl, vouchermis mis,  eg_department dept,  paymentheader ph  ")
					.append("   WHERE vh.id   = gl.voucherheaderid AND vh.id   =mis.voucherheaderid")
					.append("  AND vh.id   = ph.voucherheaderid AND dept.id_dept = mis.departmentid  ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append("<=TO_date(:toDate,'dd-Mon-yyyy') and gl.glcode like :glCode").append(fundcondition)
					.append(" AND vh.status  =0 AND vh.name!=:vhName")
					.append(" AND vh.type =:vhType group by  TO_date(ph.concurrenceDate)")
					.append(" order by  TO_date(ph.concurrenceDate) ");

			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("glCode", deObject.getAssetCode() + "%");
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhType", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);
		} else {
			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append("  ROUND(SUM(gl.debitamount)/100000,2) AS concurrenceAmount, ")
					.append(" TO_date(ph.concurrenceDate) as concurrenceDate ")
					.append("  FROM voucherheader vh,  generalledger gl,  vouchermis mis,  eg_department dept,  paymentheader ph  ")
					.append("  WHERE vh.id   = gl.voucherheaderid AND vh.id   =mis.voucherheaderid")
					.append("  AND vh.id   = ph.voucherheaderid AND dept.id_dept = mis.departmentid  ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append("<=TO_date(:toDate,'dd-Mon-yyyy') ").append(fundcondition)
					.append(" AND vh.status  =0 AND vh.name!= :vhName")
					.append(" AND vh.type =:vhType group by  TO_date(ph.concurrenceDate)")
					.append(" order by  TO_date(ph.concurrenceDate) ");

			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhType", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);
		}
		final Query query = persistenceService.getSession().createSQLQuery(stringQry.toString())
				.addScalar("departmentName").addScalar("concurrenceAmount").addScalar("concurrenceDate");
		params.entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
		return query;
	}

	public List<DepartmentwiseExpenditureReport> getConcurrenceGivenFortheFinancialYearTillGivenDate(
			final DepartmentwiseExpenditureReport deObject) {
		final List<DepartmentwiseExpenditureReport> departmentwiseExpList = new ArrayList<DepartmentwiseExpenditureReport>();
		final StringBuilder stringQry = new StringBuilder();
		final Map<String, Object> params = new HashMap<>();
		String fundcondition = "";
		String fmDate = "";
		String toDate = "";
		if (!deObject.getFundId().equals("") || deObject.getFundId().equals("0")) {
			fundcondition = " and vh.fundId=:fundId";
			params.put("fundId", deObject.getFundId());
		}
		if (deObject.getPeriod().equalsIgnoreCase("current")) {
			fmDate = getFormattedDate(getFinancialYearStartDate(deObject.getFromDate()));
			toDate = getFormattedDate(deObject.getFromDate());
		} else if (deObject.getPeriod().equalsIgnoreCase("previous")) {
			fmDate = getFormattedDate(getFinancialYearStartDate(getPreviousYearFor(deObject.getFromDate())));
			toDate = getFormattedDate(getPreviousYearFor(deObject.getFromDate()));
		}
		if (!(deObject.getAssetCode() != null && deObject.getAssetCode().equals("0"))) {
			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append("  ROUND(SUM(gl.debitamount)/100000,2) AS concurrenceAmount ")
					.append("  FROM voucherheader vh,  generalledger gl, vouchermis mis,eg_department dept,")
					.append(" paymentheader ph   WHERE vh.id= gl.voucherheaderid ")
					.append("  AND vh.id  =mis.voucherheaderid AND vh.id  = ph.voucherheaderid AND dept.id_dept =mis.departmentid ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append("<TO_date(:toDate,'dd-Mon-yyyy') and gl.debitamount!=0  and gl.glcode like :glcode")
					.append(fundcondition).append(" AND vh.status  =0 AND vh.name!=:vhName")
					.append(" AND vh.type =:vhType group by dept.dept_name").append("  order by dept.dept_name ");
			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("glcode", deObject.getAssetCode() + "%");
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhType", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);

		} else {
			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append("  ROUND(SUM(gl.debitamount)/100000,2) AS concurrenceAmount ")
					.append("  FROM voucherheader vh,  generalledger gl,  vouchermis mis,eg_department dept,paymentheader ph ")
					.append("  WHERE vh.id= gl.voucherheaderid ")
					.append("  AND vh.id  =mis.voucherheaderid AND vh.id  = ph.voucherheaderid AND dept.id_dept =mis.departmentid ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append(" <=TO_date(:toDate,'dd-Mon-yyyy')").append(fundcondition)
					.append(" AND vh.status  =0 AND vh.name!=:vhName")
					.append(" AND vh.type =:vhType group by dept.dept_name").append("  order by dept.dept_name ");

			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhType", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);
		}
		final Query query = persistenceService.getSession().createSQLQuery(stringQry.toString())
				.addScalar("departmentName").addScalar("concurrenceAmount")
				.setResultTransformer(Transformers.aliasToBean(DepartmentwiseExpenditureReport.class));
		params.entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
		departmentwiseExpList.addAll(query.list());
		return departmentwiseExpList;
	}

	public List<DepartmentwiseExpenditureReport> getConcurrenceGivenForthePeriodQuery(
			final DepartmentwiseExpenditureReport deObject) {
		final List<DepartmentwiseExpenditureReport> deList = new ArrayList<DepartmentwiseExpenditureReport>();
		final StringBuilder stringQry = new StringBuilder();
		final Map<String, Object> params = new HashMap<>();
		String fundcondition = " ";
		String fmDate = "";
		String toDate = "";
		if (!deObject.getFundId().equals("") || deObject.getFundId().equals("0")) {
			fundcondition = " and vh.fundId=:fundId";
			params.put("fundId", deObject.getFundId());
		}
		if (deObject.getPeriod().equalsIgnoreCase("current")) {
			fmDate = getFormattedDate(deObject.getFromDate());
			toDate = getFormattedDate(deObject.getToDate());
		} else if (deObject.getPeriod().equalsIgnoreCase("previous")) {
			fmDate = getFormattedDate(getPreviousYearFor(deObject.getFromDate()));
			toDate = getFormattedDate(getPreviousYearFor(deObject.getToDate()));
		}
		if (!(deObject.getAssetCode() != null && deObject.getAssetCode().equals("0"))) {

			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append(" ROUND(SUM(gl.debitamount)/100000,2) AS concurrenceAmount ,")
					.append("  TO_date(ph.concurrenceDate)  as concurrenceDate ")
					.append("  FROM voucherheader vh,  generalledger gl, vouchermis mis,  eg_department dept,  paymentheader ph")
					.append("  WHERE vh.id   = gl.voucherheaderid AND vh.id   =mis.voucherheaderid")
					.append(" AND vh.id   = ph.voucherheaderid AND dept.id_dept = mis.departmentid ")
					.append(" and gl.glcode like :glcode and gl.debitamount!=0 ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append(" <=TO_date(:toDate,'dd-Mon-yyyy')").append(fundcondition)
					.append(" AND vh.status  =0 AND vh.name!=:vhName")
					.append(" AND vh.type = :vhType group by dept.dept_name,  TO_date(ph.concurrenceDate)")
					.append(" order by  TO_date(ph.concurrenceDate) ");
			params.put("glcode", deObject.getAssetCode() + "%");
			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhType", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);

		} else {
			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append(" ROUND(SUM(gl.debitamount)/100000,2) AS concurrenceAmount ,")
					.append("  TO_date(ph.concurrenceDate) as concurrenceDate ")
					.append("  FROM voucherheader vh,  generalledger gl,  vouchermis mis,  eg_department dept,  paymentheader ph")
					.append(" WHERE vh.id   = gl.voucherheaderid AND vh.id   =mis.voucherheaderid")
					.append("  AND vh.id   = ph.voucherheaderid AND dept.id_dept = mis.departmentid  ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append(" <=TO_date(:toDate,'dd-Mon-yyyy')").append(fundcondition)
					.append(" AND vh.status  =0 AND vh.name!=:vhName")
					.append(" AND vh.type = :vhType group by dept.dept_name, TO_date(ph.concurrenceDate)")
					.append(" order by  TO_date(ph.concurrenceDate) ");

			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhType", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);
		}

		final Query query = persistenceService.getSession().createSQLQuery(stringQry.toString())
				.addScalar("departmentName").addScalar("concurrenceAmount").addScalar("concurrenceDate")
				.setResultTransformer(Transformers.aliasToBean(DepartmentwiseExpenditureReport.class));

		params.entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
		deList.addAll(query.list());

		return deList;
	}

    @SuppressWarnings("unchecked")
    public void populateDepartment(final DepartmentwiseExpenditureReport deptReport) {
        List<Department> departmentList = new ArrayList<Department>();
        if (deptReport.getPeriod().equalsIgnoreCase("current")) {
            if (DateUtils.compareDates(deptReport.getFinyearObj().getStartingDate(), deptReport.getRestrictedDepartmentDate()))
                departmentList = persistenceService.findAllBy("from Department where deptCode not like 'F%' order by deptName  ");
            else
                departmentList = persistenceService.findAllBy("from Department order by deptName  ");
        } else if (DateUtils.compareDates(getPreviousYearFor(deptReport.getFinyearObj().getStartingDate()),
                deptReport.getRestrictedDepartmentDate()))
            departmentList = persistenceService.findAllBy("from Department where deptCode not like 'F%' order by deptName  ");
        else
            departmentList = persistenceService.findAllBy("from Department order by deptName  ");
        int index = 0;
        for (final Department dept : departmentList)
            deptReport.addDepartmentToResultSet(new DepartmentwiseExpenditureResult(dept.getName(), BigDecimal.ZERO, ++index,
                    Boolean.TRUE));
        // deptReport.getCurrentyearDepartmentList()
    }

	public Query getConcurrenceDaywiseTotalQuery(final DepartmentwiseExpenditureReport deObject) {
		final StringBuilder stringQry = new StringBuilder();
		final Map<String, Object> params = new HashMap<>();
		String fundcondition = " ";
		String fmDate = "";
		String toDate = "";
		if (deObject.getPeriod().equalsIgnoreCase("current")) {
			fmDate = getFormattedDate(deObject.getFromDate());
			toDate = getFormattedDate(deObject.getToDate());
		} else if (deObject.getPeriod().equalsIgnoreCase("previous")) {
			fmDate = getFormattedDate(getPreviousYearFor(deObject.getFromDate()));
			toDate = getFormattedDate(getPreviousYearFor(deObject.getToDate()));
		}
		if (!deObject.getFundId().equals("") || deObject.getFundId().equals("0")) {
			fundcondition = " and vh.fundId=:fundId";
			params.put("fundId", deObject.getFundId());
		}
		if (!(deObject.getAssetCode() != null && deObject.getAssetCode().equals("0"))) {
			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append(" SUM(gl.debitamount) AS concurrenceAmount ")
					.append("  FROM voucherheader vh,  generalledger gl,  vouchermis mis,eg_department dept,paymentheader ph ")
					.append("  WHERE vh.id= gl.voucherheaderid ")
					.append(" AND vh.id  =mis.voucherheaderid AND vh.id  = ph.voucherheaderid AND dept.id_dept =mis.departmentid ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append(" <=TO_date(:toDate,'dd-Mon-yyyy')")
					.append(" and gl.glcode like :glcode and gl.debitamount!=0").append(fundcondition)
					.append(" AND vh.status  =0 AND vh.name!=:vhName")
					.append(" AND vh.type =:vhType group by dept.dept_name order by dept.dept_name");
			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("glcode", deObject.getAssetCode() + "%");
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhYype", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);
		} else {
			stringQry.append(" SELECT dept.dept_name as departmentName, ")
					.append(" SUM(gl.debitamount)  AS concurrenceAmount ")
					.append("  FROM voucherheader vh,  generalledger gl,  vouchermis mis,eg_department dept,paymentheader ph ")
					.append("  WHERE vh.id= gl.voucherheaderid ")
					.append(" AND vh.id  =mis.voucherheaderid AND vh.id  = ph.voucherheaderid AND dept.id_dept =mis.departmentid ")
					.append(" and TO_date(ph.concurrenceDate) >= TO_date(:fmDate,'dd-Mon-yyyy') and  TO_date(ph.concurrenceDate)")
					.append(" <=TO_date(:toDate,'dd-Mon-yyyy')").append(fundcondition)
					.append(" AND vh.status  =0 AND vh.name!=:vhName").append(" AND vh.type = :vhType")
					.append(" group by dept.dept_name order by dept.dept_name");

			params.put("fmDate", fmDate);
			params.put("toDate", toDate);
			params.put("vhName", FinancialConstants.PAYMENTVOUCHER_NAME_DIRECTBANK);
			params.put("vhYype", FinancialConstants.STANDARD_VOUCHER_TYPE_PAYMENT);
		}
		final Query query = persistenceService.getSession().createSQLQuery(stringQry.toString())
				.addScalar("departmentName").addScalar("concurrenceAmount");
		params.entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
		return query;
	}

    public List<DepartmentwiseExpenditureReport> getConcurrenceReportDateWise() {
        final List<DepartmentwiseExpenditureReport> deptReport = new ArrayList<DepartmentwiseExpenditureReport>();
        return deptReport;
    }

    public Date getStartDayOfMonth(final DepartmentwiseExpenditureReport deObject)
    {
        String yearStr = "";
        final Calendar calendar = Calendar.getInstance();
        if (deObject.getMonth().equals("01") || deObject.getMonth().equals("02") || deObject.getMonth().equals("03"))
            yearStr = deObject.getFinyearObj().getEndingDate().toString().substring(0, 4);
        else
            yearStr = deObject.getFinyearObj().getStartingDate().toString().substring(0, 4);

        calendar.set(Calendar.YEAR, Integer.parseInt(yearStr));
        calendar.set(Calendar.MONTH, Integer.parseInt(deObject.getMonth()) - 1);
        calendar.set(Calendar.DATE, 1);
        return calendar.getTime();
    }

    public Date getLastDayOfMonth(final DepartmentwiseExpenditureReport deObject)
    {
        String yearStr = "";
        final Calendar calendar = Calendar.getInstance();
        if (deObject.getMonth().equals("01") || deObject.getMonth().equals("02") || deObject.getMonth().equals("03"))
            yearStr = deObject.getFinyearObj().getEndingDate().toString().substring(0, 4);
        else
            yearStr = deObject.getFinyearObj().getStartingDate()
            .toString().substring(0, 4);
        // calendar.set(Calendar.YEAR,Integer.parseInt(yearStr));
        // calendar.set(Calendar.MONTH,Integer.parseInt(month));
        int mapLastDay = 0;
        final int month = Integer.parseInt(deObject.getMonth());

        switch (month)
        {
        case 1: // fall through
        case 3: // fall through
        case 5: // fall through
        case 7: // fall through
        case 8: // fall through
        case 10: // fall through
        case 12:
            mapLastDay = 31;
            break;
        case 4: // fall through
        case 6: // fall through
        case 9: // fall through
        case 11:
            mapLastDay = 30;
            break;
        case 2:
            if (0 == Integer.parseInt(yearStr) % 4 && 0 != Integer.parseInt(yearStr) % 100
            || 0 == Integer.parseInt(yearStr) % 400)
                mapLastDay = 29;
            else
                mapLastDay = 28;
            break;
        }
        calendar.set(Calendar.YEAR, Integer.parseInt(yearStr));
        calendar.set(Calendar.MONTH, Integer.parseInt(deObject.getMonth()) - 1);
        calendar.set(Calendar.DATE, mapLastDay);
        return calendar.getTime();
    }

    public String getFormattedDate(final Date date) {
        return Constants.DDMMYYYYFORMAT1.format(date);
    }

    public FinancialYearHibernateDAO getFinancialYearDAO() {
        return financialYearDAO;
    }

    public PersistenceService getPersistenceService() {
        return persistenceService;
    }

    public void setFinancialYearDAO(final FinancialYearHibernateDAO financialYearDAO) {
        this.financialYearDAO = financialYearDAO;
    }

    public void setPersistenceService(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

}