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
package com.exilant.eGov.src.reports;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.egf.utils.FinancialUtils;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Manikanta
 *
 */
@Service
public class ReportEngine {
    private final static Logger LOGGER = Logger.getLogger(ReportEngine.class);
    /**
     *
     * @param reBean
     * @return query
     *
     */
    @Autowired
    private AppConfigValueService appConfigValuesService;
    
    @Autowired
    private FinancialUtils financialUtils;

    public Map<String, Map<String, Object>> getVouchersListQuery(final ReportEngineBean reBean) throws ApplicationRuntimeException {
        boolean includeVouchermis = false;
        boolean includeGeneralLedger = false;
        String firstParam = "";
        final String andParam = " and ";
        final StringBuilder reportEngineQry = new StringBuilder("");
        final Map<String, Map<String, Object>> queryMap = new HashMap<>();
        final Map<String, Object> params = new HashMap<>();
        try {
            if (reBean.getSchemeId() != null || reBean.getSubSchemeId() != null || reBean.getFundsourceId() != null
                    || reBean.getDivisionId() != null || reBean.getDepartmentId() != null || reBean.getFunctionaryId() != null)
                includeVouchermis = true;
            if (reBean.getFunctionId() != null)
                includeGeneralLedger = true;

            reportEngineQry.append("select ");
            /**
             * add fields which are to be fetched
             */
            reportEngineQry.append("voucher.id as \"vocherId\" ");

            reportEngineQry.append(" from ");
            /**
             * add the table names if no fields of a perticular table is passed ommit it eg if scheme,subscheme or divisionid is
             * not passed donot include vouchermis or if function is not passed donot include generalledger
             */
			if (includeVouchermis && includeGeneralLedger)
				reportEngineQry
						.append(" ( voucherheader voucher left join vouchermis mis on voucher.id=mis.voucherheaderid)")
						.append("left join generalledger ledger on voucher.id=ledger.voucherheaderid ");
            else if (includeVouchermis)
                reportEngineQry.append(" voucherheader voucher left join vouchermis mis on voucher.id=mis.voucherheaderid ");
            else if (includeGeneralLedger)
                reportEngineQry
                        .append(" voucherheader voucher left join generalledger ledger on voucher.id=ledger.voucherheaderid ");
            else
                reportEngineQry.append(" voucherheader voucher ");

            // if parmeters are passed then set "where" clause
            if (reBean.getFiltersCount() >= 1)
                reportEngineQry.append(" where ");

            /**
             * where conditions add the conditions for the variables in the ReportEngineBean
             *
             */
            if (checkNullandEmpty(reBean.getFundId())) {
                reportEngineQry.append(firstParam).append(" voucher.fundId = :voucherFundId");
                params.put("voucherFundId", Integer.parseInt(reBean.getFundId()));
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getFundsourceId())) {
                reportEngineQry.append(firstParam).append(" mis.fundsourceId = :misFundsourceId");
                params.put("misFundsourceId", reBean.getFundsourceId());
                firstParam = andParam;
            }

            if (checkNullandEmpty(reBean.getFromDate())) {
                reportEngineQry.append(firstParam + " voucher.voucherDate>=to_date(:voucherFromDate,'dd/MM/yyyy')");
                params.put("voucherFromDate", reBean.getFromDate());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getToDate())) {
                reportEngineQry.append(firstParam + " voucher.voucherDate<=to_date(:voucherToDate,'dd/MM/yyyy')");
                params.put("voucherToDate", reBean.getToDate());
                firstParam = andParam;
            }

            if (checkNullandEmpty(reBean.getFromVoucherNumber())) {
                reportEngineQry.append(firstParam).append(" voucher.fromVouchernumber>=:fromVouchernumber");
                params.put("fromVouchernumber", reBean.getFromVoucherNumber());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getToVoucherNumber())) {
                reportEngineQry.append(firstParam).append(" voucher.toVouchernumber<=:toVouchernumber");
                params.put("toVouchernumber", reBean.getToVoucherNumber());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getSchemeId())) {
                reportEngineQry.append(firstParam).append(" mis.schemeId=:misSchemeId");
                params.put("misSchemeId", reBean.getSchemeId());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getSubSchemeId())) {
                reportEngineQry.append(firstParam).append(" mis.subSchemeId=:misSubSchemeId");
                params.put("misSubSchemeId", reBean.getSubSchemeId());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getDivisionId())) {
                reportEngineQry.append(firstParam).append(" mis.divisionId=:misDivisionId");
                params.put("misDivisionId", reBean.getDivisionId());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getDepartmentId())) {
                reportEngineQry.append(firstParam).append(" mis.departmentcode=:misDepartmentcode");
                params.put("misDepartmentcode", reBean.getDepartmentId());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getFunctionaryId())) {
                reportEngineQry.append(firstParam).append(" mis.functionaryId=:misFunctionaryId");
                params.put("misFunctionaryId", reBean.getFunctionaryId());
                firstParam = andParam;
            }
            if (checkNullandEmpty(reBean.getFunctionId())) {
                reportEngineQry.append(firstParam).append(" ledger.functionid=:ledgerFunctionid");
                params.put("ledgerFunctionid", Integer.valueOf(reBean.getFunctionId()));
                firstParam = andParam;
            }

            /**
             * add statuses to be included
             *
             */

            final List<AppConfigValues> listAppConfVal = appConfigValuesService.getConfigValuesByModuleAndKey("EGF",
                    "statusexcludeReport");
            List<Integer> statusesToExclude = new ArrayList<>();
            if (null != listAppConfVal)
            	statusesToExclude.addAll(financialUtils.getStatuses(listAppConfVal.get(0).getValue()));
            else
                throw new ApplicationRuntimeException("Exlcude statusses not  are not defined for Reports");
            
            if (reBean.getExcludeStatuses() != null && !reBean.getExcludeStatuses().isEmpty()) {
            	for (String str : reBean.getExcludeStatuses()) {
            		statusesToExclude.add(Integer.valueOf(str));
            	}
            }
            reportEngineQry.append(firstParam).append(" voucher.status not in (:voucherStatusToExclude)");
            params.put("voucherStatusToExclude", statusesToExclude);

            if (reBean.getIncludeStatuses() != null && !reBean.getIncludeStatuses().isEmpty()) {
                reportEngineQry.append(firstParam).append(" voucher.status in (:voucherStatusToInclude)");
                List<Integer> statusesToInclude = new ArrayList<>();
                for (String str : reBean.getIncludeStatuses()) {
                	statusesToInclude.add(Integer.valueOf(str));
            	}
                params.put("voucherStatusToInclude", statusesToInclude);
            }

        } catch (final ApplicationRuntimeException e) {
            LOGGER.error(e.getMessage());
            throw new ApplicationRuntimeException(e.getMessage());
        }
       
        if (LOGGER.isDebugEnabled())
            LOGGER.debug(reportEngineQry.toString());
        queryMap.put(reportEngineQry.toString(), params);
        return queryMap;

    }

    private boolean checkNullandEmpty(final String column) {
        if (column != null && !column.isEmpty())
            return true;
        else
            return false;

    }

    public ReportEngineBean populateReportEngineBean(final GeneralLedgerReportBean reportBean) {
        final ReportEngineBean reBean = new ReportEngineBean();
        reBean.setDepartmentId(reportBean.getDepartmentCode());
        reBean.setDivisionId(reportBean.getFieldId());
        reBean.setFundId(reportBean.getFund_id());
        reBean.setFundsourceId(reportBean.getFundSource_id());
        reBean.setFunctionaryId(reportBean.getFunctionaryId());
        reBean.setFinacialYearId(null);
        reBean.setFiscalPeriodId(null);
        reBean.setFromDate(reportBean.getStartDate());
        reBean.setFromVoucherNumber(null);
        reBean.setFunctionId(reportBean.getFunctionCodeId());
        reBean.setSchemeId(null);
        reBean.setSubSchemeId(null);
        reBean.setToDate(reportBean.getEndDate());
        reBean.setToVoucherNumber(null);
        return reBean;
    }

    public AppConfigValueService getAppConfigValuesService() {
        return appConfigValuesService;
    }

    public void setAppConfigValuesService(
            AppConfigValueService appConfigValuesService) {
        this.appConfigValuesService = appConfigValuesService;
    }

}
