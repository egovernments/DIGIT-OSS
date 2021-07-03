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
package org.egov.egf.web.actions.voucher;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apache.struts2.interceptor.validation.SkipValidation;
import org.egov.commons.EgwStatus;
import org.egov.commons.Fund;
import org.egov.egf.dashboard.event.FinanceEventType;
import org.egov.egf.dashboard.event.listener.FinanceDashboardService;
import org.egov.infra.admin.master.entity.Department;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.web.struts.actions.BaseFormAction;
import org.egov.infra.web.struts.annotation.ValidationErrorPage;
import org.egov.infstr.services.PersistenceService;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.egov.model.bills.EgBillregister;
import org.egov.services.bills.BillsService;
import org.egov.utils.Constants;
import org.egov.utils.FinancialConstants;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.type.LongType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.exilant.eGov.src.domain.BillRegisterBean;

@Results({ @Result(name = "search", location = "cancelBill-search.jsp") })
public class CancelBillAction extends BaseFormAction {
	private static final long serialVersionUID = 1L;
	private static final String CANCEL_QUERY_STR = " billstatus=:billStatus, statusid=:statusId ";
    private static final String STATUS_QUERY_STR = "moduletype=:moduleType and description=:description";
    private static final String BILL_STATUS = "billStatus";
    private static final String DESCRIPTION = "description";
    private static final String MODULE_TYPE = "moduleType";
	private static final Logger LOGGER = Logger.getLogger(CancelBillAction.class);
	@Autowired
	private BillsService billsService;
	private String billNumber;
	private String fromDate;
	private String toDate;
	private Fund fund = new Fund();
	private Department deptImpl = new Department();
	private String expType;
	private List<BillRegisterBean> billListDisplay = new ArrayList<BillRegisterBean>();
	private boolean afterSearch = false;
	Integer loggedInUser = ApplicationThreadLocals.getUserId().intValue();
	public final SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy", Constants.LOCALE);

	@Autowired
	@Qualifier("persistenceService")
	private PersistenceService persistenceService;
	@Autowired
	private EgovMasterDataCaching masterDataCache;
	@Autowired
	private CancelBillAndVoucher cancelBillAndVoucher;
	
	@Autowired
	FinanceDashboardService finDashboardService;

	@Override
	public Object getModel() {

		return null;
	}

	public void setBillNumber(final String billNumber) {
		this.billNumber = billNumber;
	}

	public String getBillNumber() {
		return billNumber;
	}

	public void setFromDate(final String fromBillDate) {
		fromDate = fromBillDate;
	}

	public String getFromDate() {
		return fromDate;
	}

	public void setToDate(final String toBillDate) {
		toDate = toBillDate;
	}

	public String getToDate() {
		return toDate;
	}

	public void setFund(final Fund fund) {
		this.fund = fund;
	}

	public Fund getFund() {
		return fund;
	}

	public void setExpType(final String expType) {
		this.expType = expType;
	}

	public String getExpType() {
		return expType;
	}

	@SuppressWarnings("deprecation")
	@Override
	public void prepare() {
		super.prepare();
		if (LOGGER.isDebugEnabled())
			LOGGER.debug("Inside Prepare method");
		List<org.egov.infra.microservice.models.Department> departments = masterDataCache.get("egi-department");
		dropdownData.put("DepartmentList", departments);
		addDropdownData("fundList",
				persistenceService.findAllBy("from Fund where isactive=true and isnotleaf=false order by name"));
		// Important - Remove the like part of the query below to generalize the
		// bill cancellation screen
		addDropdownData("expenditureList", persistenceService.findAllBy(
				"select distinct bill.expendituretype from EgBillregister bill where bill.expendituretype=? or bill.expendituretype=? or bill.expendituretype=? order by bill.expendituretype", 
				FinancialConstants.STANDARD_EXPENDITURETYPE_CONTINGENT, FinancialConstants.STANDARD_EXPENDITURETYPE_WORKS, FinancialConstants.STANDARD_EXPENDITURETYPE_PURCHASE));
	}

	public void prepareBeforeSearch() {
		fund.setId(null);
		billNumber = "";
		fromDate = "";
		toDate = "";
		expType = "";
		billListDisplay.clear();
	}

	@SkipValidation
	@Action(value = "/voucher/cancelBill-beforeSearch")
	public String beforeSearch() {
		return "search";
	}

	public Map<String, Map<String, Object>> filterQuery() {
		
		final Map<String, Map<String, Object>> queryMap = new HashMap<>();
        final Map<String, Object> params = new HashMap<>();
        final String userCond = " where ";
		final StringBuilder query = new StringBuilder(
				" select billmis.egBillregister.id, billmis.egBillregister.billnumber, billmis.egBillregister.billdate,")
						.append(" billmis.egBillregister.billamount, billmis.departmentcode ")
						.append("  from EgBillregistermis billmis ");
        // if the logged in user is same as creator or is superruser
        query.append(userCond);
        
        if (fund != null && fund.getId() != null && fund.getId() != -1
                && fund.getId() != 0) {
            query.append(" billmis.fund.id=:fundId");
            params.put("fundId", fund.getId());
        }

        if (billNumber != null && billNumber.length() != 0) {
            query.append(" and billmis.egBillregister.billnumber =:billNumber");
            params.put("billNumber", billNumber);
        }
        if (deptImpl != null && deptImpl.getCode() != null && !deptImpl.getCode().equals("-1")) {
            query.append(" and billmis.departmentcode =:deptCode");
            params.put("deptCode", deptImpl.getCode());
        }
        if (fromDate != null && fromDate.length() != 0) {
            Date fDate;
            try {
                fDate = formatter.parse(fromDate);
                query.append(" and billmis.egBillregister.billdate >= :fromDate");
                params.put("fromDate", fDate);
            } catch (final ParseException e) {
                LOGGER.error(" From Date parse error");
                //
            }
        }
        if (toDate != null && toDate.length() != 0) {
            Date tDate;
            try {
                tDate = formatter.parse(toDate);
                query.append(" and billmis.egBillregister.billdate <= :toDate");
                params.put("toDate", tDate);
            } catch (final ParseException e) {
                LOGGER.error(" To Date parse error");
                //
            }
        }
        
		if (expType == null || expType.equalsIgnoreCase("")) {
            query.append(" and billmis.egBillregister.status.description=:description");
            params.put("description", FinancialConstants.CONTINGENCYBILL_APPROVED_STATUS);
		} else {
            query.append(" and billmis.egBillregister.expendituretype =:expenditureType");
            params.put("expenditureType", expType);
            if (FinancialConstants.STANDARD_EXPENDITURETYPE_SALARY
                    .equalsIgnoreCase(expType)) {
                query.append(" and billmis.egBillregister.status.moduletype=:moduleType");
                params.put("moduleType", FinancialConstants.SALARYBILL);
                query.append(" and billmis.egBillregister.status.description=:description");
                params.put("description", FinancialConstants.SALARYBILL_APPROVED_STATUS);
            } else if (FinancialConstants.STANDARD_EXPENDITURETYPE_CONTINGENT
                    .equalsIgnoreCase(expType)) {
                query.append(" and billmis.egBillregister.status.moduletype=:moduleType");
                params.put("moduleType", FinancialConstants.CONTINGENCYBILL_FIN);
                query.append(" and billmis.egBillregister.status.description=:description");
                params.put("description", FinancialConstants.CONTINGENCYBILL_APPROVED_STATUS);
            } else if (FinancialConstants.STANDARD_EXPENDITURETYPE_PURCHASE
                    .equalsIgnoreCase(expType)) {
                query.append(" and billmis.egBillregister.status.moduletype=:moduleType");
                params.put("moduleType", FinancialConstants.SBILL);
                query.append(" and billmis.egBillregister.status.description=:description");
                params.put("description", FinancialConstants.SUPPLIERBILL_APPROVED_STATUS);
            } else if (FinancialConstants.STANDARD_EXPENDITURETYPE_WORKS
                    .equalsIgnoreCase(expType)) {
                query.append(" and billmis.egBillregister.status.moduletype=:moduleType");
                params.put("moduleType", FinancialConstants.CONTRACTORBILL);
                query.append(" and billmis.egBillregister.status.code=:code");
                params.put("code", FinancialConstants.CONTRACTORBILL_APPROVED_STATUS);
            }
		}
		queryMap.put(query.toString(), params);
        return queryMap;
	}

	public Map<String, Map<String, Object>> query() {
        final Map<String, Map<String, Object>> queries = new HashMap<>();
        final Map.Entry<String, Map<String, Object>> mapQueryEntry = filterQuery().entrySet().iterator().next();
        String query = mapQueryEntry.getKey() + " and billmis.voucherHeader is null ";
        queries.put(query, mapQueryEntry.getValue());
        final Map<String, Object> params = new HashMap<>();
        params.putAll(mapQueryEntry.getValue());
        query = mapQueryEntry.getKey() + " and billmis.voucherHeader.status in (:vhStatus)";
        params.put("vhStatus", Arrays.asList(FinancialConstants.REVERSEDVOUCHERSTATUS, FinancialConstants.CANCELLEDVOUCHERSTATUS));
        queries.put(query, params);
        return queries;
    }
	
	public void prepareSearch() {
		billListDisplay.clear();
	}

    public void validateFund() throws ParseException {
        if (fund == null || fund.getId() == -1 || fund.getId() == 0 || fund.getId() == null)
            addFieldError("fund.id", getText("voucher.fund.mandatory"));
        if (StringUtils.isNotEmpty(fromDate) || StringUtils.isNotEmpty(toDate)) {
            boolean isDateFrom = false;
            boolean isDateTo = false;
            String fromDates = fromDate;
            String toDates = toDate;
            String datePattern = "\\d{1,2}/\\d{1,2}/\\d{4}";
            isDateFrom = fromDates.matches(datePattern);
            isDateTo = toDates.matches(datePattern);
            if (!isDateFrom || !isDateTo) {
                addActionError(getText("msg.please.select.valid.date"));
            }
        }
        Date datefrom = null;
        Date dateto = null;
        if (StringUtils.isNotEmpty(fromDate) && StringUtils.isNotEmpty(toDate)) {
            datefrom = formatter.parse(fromDate);
            dateto = formatter.parse(toDate);
            if (datefrom.after(dateto)) {
                addFieldError("toDate", getText("msg.fromDate.cant.be.greater.than.toDate"));
            }
        }
    }

	@ValidationErrorPage(value = "search")
	@Action(value = "/voucher/cancelBill-search")
	public String search() throws ParseException {   
        validateFund();
        if (!hasErrors()) {
            billListDisplay.clear();
            final Map<String, Map<String, Object>> queries = query();
            final List<String> list = queries.keySet().stream().collect(Collectors.toList());
            final List<Object[]> tempBillList = new ArrayList<Object[]>();
            List<Object[]> billListWithNoVouchers, billListWithCancelledReversedVouchers;
            final Query queryOne = persistenceService.getSession().createQuery(list.get(0));
            persistenceService.populateQueryWithParams(queryOne, queries.get(list.get(0)));
            billListWithNoVouchers = queryOne.list();
            final Query queryTwo = persistenceService.getSession().createQuery(list.get(1));
            persistenceService.populateQueryWithParams(queryTwo, queries.get(list.get(1)));
            billListWithCancelledReversedVouchers = queryTwo.list();

            tempBillList.addAll(billListWithNoVouchers);
			tempBillList.addAll(billListWithCancelledReversedVouchers);

			BillRegisterBean billRegstrBean;
			if (LOGGER.isDebugEnabled())
				LOGGER.debug("Size of tempBillList - " + tempBillList.size());
			final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
			List<org.egov.infra.microservice.models.Department> departments = masterDataCache.get("egi-department");
			Map<String, String> depMap = new HashMap<>();
			for (org.egov.infra.microservice.models.Department department : departments) {
				depMap.put(department.getCode(), department.getName());
			}
			for (final Object[] bill : tempBillList) {
				billRegstrBean = new BillRegisterBean();
				billRegstrBean.setId(bill[0].toString());
				billRegstrBean.setBillNumber(bill[1].toString());
				if (!bill[2].toString().equalsIgnoreCase(""))
					billRegstrBean.setBillDate(sdf.format(bill[2]));
				billRegstrBean.setBillAmount(Double.parseDouble(bill[3].toString()));
				billRegstrBean.setBillDeptName(depMap.get(bill[4]));
				billListDisplay.add(billRegstrBean);
			}
			afterSearch = true;
		}
		return "search";
	}

	@Action(value = "/voucher/cancelBill-cancelBill")
	public String cancelBill() {
        final Map<String, Object> map = cancelBills(billListDisplay, expType);
        ((List<String>) map.get("billNumbers")).forEach(rec -> addActionError(getText("msg.bill.cancel.creator", new String[] {rec})));
        if (!((List<Long>) map.get("ids")).isEmpty())
            addActionMessage(getText("Cancelled Successfully"));

        prepareBeforeSearch();
        return "search";
    }
	
	public Map<String, Object> cancelBills(final List<BillRegisterBean> billListDisplay, final String expType) {
        final Map<String, Object> map = new HashMap<>();
        EgBillregister billRegister;
        final Long[] idList = new Long[billListDisplay.size()];
        int i = 0;
        int idListLength = 0;
        final List<Long> ids = new ArrayList<>();
        final List<String> billNumbers = new ArrayList<>();
        final Map<String, Object> statusQueryMap = new HashMap<>();
        final Map<String, Object> cancelQueryMap = new HashMap<>();
        final StringBuilder statusQuery = new StringBuilder(
                "from EgwStatus where ");
        final StringBuilder cancelQuery = new StringBuilder(
                "Update eg_billregister set ");
        for (final BillRegisterBean billRgistrBean : billListDisplay)
            if (billRgistrBean.getIsSelected()) {
                idList[i++] = Long.parseLong(billRgistrBean.getId());
                idListLength++;
            }
        if (expType == null || expType.equalsIgnoreCase("") || FinancialConstants.STANDARD_EXPENDITURETYPE_CONTINGENT.equalsIgnoreCase(expType)) {
            statusQuery.append(STATUS_QUERY_STR);
            statusQueryMap.put(MODULE_TYPE, FinancialConstants.CONTINGENCYBILL_FIN);
            statusQueryMap.put(DESCRIPTION, FinancialConstants.CONTINGENCYBILL_CANCELLED_STATUS);
            cancelQuery.append(CANCEL_QUERY_STR);
            cancelQueryMap.put(BILL_STATUS, FinancialConstants.CONTINGENCYBILL_CANCELLED_STATUS);
        } else if (FinancialConstants.STANDARD_EXPENDITURETYPE_SALARY
                .equalsIgnoreCase(expType)) {
            statusQuery.append(STATUS_QUERY_STR);
            statusQueryMap.put(MODULE_TYPE, FinancialConstants.SALARYBILL);
            statusQueryMap.put(DESCRIPTION, FinancialConstants.SALARYBILL_CANCELLED_STATUS);
            cancelQuery.append(CANCEL_QUERY_STR);
            cancelQueryMap.put(BILL_STATUS, FinancialConstants.SALARYBILL_CANCELLED_STATUS);
        } else if (FinancialConstants.STANDARD_EXPENDITURETYPE_PURCHASE.equalsIgnoreCase(expType)) {
            statusQuery.append(STATUS_QUERY_STR);
            statusQueryMap.put(MODULE_TYPE, FinancialConstants.SUPPLIERBILL);
            statusQueryMap.put(DESCRIPTION, FinancialConstants.SUPPLIERBILL_CANCELLED_STATUS);
            cancelQuery.append(CANCEL_QUERY_STR);
            cancelQueryMap.put(BILL_STATUS, FinancialConstants.SUPPLIERBILL_CANCELLED_STATUS);
        } else if (FinancialConstants.STANDARD_EXPENDITURETYPE_WORKS.equalsIgnoreCase(expType)) {
            statusQuery.append(STATUS_QUERY_STR);
            statusQueryMap.put(MODULE_TYPE, FinancialConstants.CONTRACTORBILL);
            statusQueryMap.put(DESCRIPTION, FinancialConstants.CONTRACTORBILL_CANCELLED_STATUS);
            cancelQuery.append(CANCEL_QUERY_STR);
            cancelQueryMap.put(BILL_STATUS, FinancialConstants.CONTRACTORBILL_CANCELLED_STATUS);
        }
        if (LOGGER.isDebugEnabled())
            LOGGER.debug(" Status Query - " + statusQuery.toString());
        final Query query = persistenceService.getSession().createQuery(statusQuery.toString());
        statusQueryMap.entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
        final EgwStatus status = (EgwStatus) query.uniqueResult();
        if (idListLength != 0) {
            for (i = 0; i < idListLength; i++) {
                billRegister = billsService.getBillRegisterById(idList[i].intValue());
                final boolean value = cancelBillAndVoucher.canCancelBill(billRegister);
                if (!value) {
                    billNumbers.add(billRegister.getBillnumber());
                    continue;
                }
                ids.add(idList[i]);
            }
            cancelQuery.append(" where id in (:ids)");
            if (LOGGER.isDebugEnabled())
                LOGGER.debug(" Cancel Query - " + cancelQuery.toString());
            final Query totalNativeQuery = persistenceService.getSession()
                    .createSQLQuery(cancelQuery.toString());
            totalNativeQuery.setParameter("statusId", Long.valueOf(status.getId()), LongType.INSTANCE);
            cancelQueryMap.entrySet().forEach(entry -> totalNativeQuery.setParameter(entry.getKey(), entry.getValue()));
            totalNativeQuery.setParameterList("ids", ids);
            if (!ids.isEmpty())
                totalNativeQuery.executeUpdate();
        }
        map.put("ids", ids);
        map.put("billNumbers", billNumbers);
        return map;
    }

	public void setBillListDisplay(final List<BillRegisterBean> billListDisplay) {
		this.billListDisplay = billListDisplay;
	}

	public List<BillRegisterBean> getBillListDisplay() {
		return billListDisplay;
	}

	public void setAfterSearch(final boolean afterSearch) {
		this.afterSearch = afterSearch;
	}

	public boolean getAfterSearch() {
		return afterSearch;
	}

	public Department getDeptImpl() {
		return deptImpl;
	}

	public void setDeptImpl(final Department deptImpl) {
		this.deptImpl = deptImpl;
	}

	public Integer getLoggedInUser() {
		return loggedInUser;
	}

	public void setLoggedInUser(final Integer loggedInUser) {
		this.loggedInUser = loggedInUser;
	}
}