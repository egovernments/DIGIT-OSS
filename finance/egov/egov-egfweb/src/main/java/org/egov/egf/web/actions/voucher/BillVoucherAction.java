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
/**
 *
 */
package org.egov.egf.web.actions.voucher;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.egov.commons.EgwStatus;
import org.egov.commons.dao.EgwStatusHibernateDAO;
import org.egov.eis.service.EisCommonService;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.script.entity.Script;
import org.egov.infra.script.service.ScriptService;
import org.egov.infra.validation.exception.ValidationError;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.infra.web.struts.annotation.ValidationErrorPage;
import org.egov.infra.workflow.entity.WorkflowAction;
import org.egov.model.bills.EgBillregister;
import org.egov.model.voucher.VoucherTypeBean;
import org.egov.pims.service.EisUtilService;
import org.egov.services.voucher.VoucherService;
import org.egov.utils.Constants;
import org.egov.utils.FinancialConstants;
import org.egov.utils.VoucherHelper;
import org.springframework.beans.factory.annotation.Autowired;

@ParentPackage("egov")
@Results({ @Result(name = JournalVoucherAction.NEW, location = "billVoucher-new.jsp") })
public class BillVoucherAction extends BaseVoucherAction {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(BillVoucherAction.class);
    @Autowired
    private EgwStatusHibernateDAO egwStatusDAO;
    private EisCommonService eisCommonService;
    private VoucherService voucherService;
    private String expType;
    private String billNumber;
    private List<EgBillregister> preApprovedVoucherList;
    private VoucherTypeBean voucherTypeBean;
    private EisUtilService eisUtilService;
    @Autowired
    private ScriptService scriptService;
    @Autowired
    private AppConfigValueService appConfigValueService;

    public VoucherTypeBean getVoucherTypeBean() {
        return voucherTypeBean;
    }

    public void setVoucherTypeBean(final VoucherTypeBean voucherTypeBean) {
        this.voucherTypeBean = voucherTypeBean;
    }

    @Override
    public void prepare() {
        super.prepare();
    }

    @Action(value = "/voucher/billVoucher-newForm")
    public String newForm() {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("BillVoucherAction | newform | START");
        populateFormData();
        return NEW;
    }

	private void populateFormData() {
		final List<String> listBillReg = VoucherHelper.EXPENDITURE_TYPES;
        final Map<String, String> expTypeList = new LinkedHashMap<String, String>();
        for (final String expType : listBillReg)
            expTypeList.put(expType, expType);

        addDropdownData("expTypeList", listBillReg);
	}

    @ValidationErrorPage(NEW)
    @SuppressWarnings("unchecked")
    @Action(value = "/voucher/billVoucher-lists")
    public String lists() throws ValidationException {
    	validateForm();
    	if (hasErrors()) {
    		populateFormData();
    		return NEW;
    	}
        final StringBuilder query = new StringBuilder();
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("Expenditure Type selected :=" + expType);
        final List<Object> params = new ArrayList<>();
        try {

            final String statusid = getApprovalStatusForBills();
            query.append("from EgBillregister br where br.status.id in (?)")
                    .append(" and ( br.egBillregistermis.voucherHeader is null or br.egBillregistermis.voucherHeader in ")
                    .append("(from CVoucherHeader vh where vh.status =? ))");
            params.add(Integer.valueOf(statusid));
            params.add(4);
            if (null != billNumber && StringUtils.isNotEmpty(billNumber)) {
                query.append(" and br.billnumber=?");
                params.add(billNumber);
            }
            if (null != voucherHeader.getVouchermis().getDepartmentcode()
                    && !voucherHeader.getVouchermis().getDepartmentcode().equals("-1")) {
                query.append(" and br.egBillregistermis.departmentcode=?");
                params.add(voucherHeader.getVouchermis().getDepartmentcode());
            }
            if (null != voucherTypeBean.getVoucherDateFrom() && StringUtils.isNotEmpty(voucherTypeBean.getVoucherDateFrom())) {
                query.append(" and br.billdate>=?");
                params.add(Constants.DDMMYYYYFORMAT2.parse(voucherTypeBean.getVoucherDateFrom()));
            }
            if (null != voucherTypeBean.getVoucherDateTo() && StringUtils.isNotEmpty(voucherTypeBean.getVoucherDateTo())) {
                query.append(" and br.billdate<=?");
                params.add(Constants.DDMMYYYYFORMAT2.parse(voucherTypeBean.getVoucherDateTo()));
            }
            preApprovedVoucherList = persistenceService.findAllBy(query.toString(), params.toArray());
            populateDepartmentNames();
			if (preApprovedVoucherList.isEmpty()) {
				addActionError("No records found.");
			}
		} catch (final ValidationException e) {

			final List<ValidationError> errors = new ArrayList<>();
			errors.add(new ValidationError("exp", e.getErrors().get(0).getMessage()));
			throw new ValidationException(errors);
		} catch (final ParseException e) {
			throw new ValidationException(Arrays.asList(new ValidationError("not a valid date", "not a valid date")));
		}
        return newForm();
    }

	private void validateForm() {
		if (StringUtils.isEmpty(expType)) {
    		addActionError(getText("msg.please.select.bill.type"));
    	}
	}

    private void populateDepartmentNames() {
        List<Department> departments = microserviceUtils.getDepartments();
        Map<String, String> departmentsMap = new HashMap<>();
        for (Department department : departments) {
            departmentsMap.put(department.getCode(), department.getName());
        }
        if (preApprovedVoucherList != null && !preApprovedVoucherList.isEmpty()) {
            for (EgBillregister br : preApprovedVoucherList) {

                if (br.getEgBillregistermis() != null && br.getEgBillregistermis().getDepartmentcode() != null) {
                    br.getEgBillregistermis()
                            .setDepartmentName(departmentsMap.get(br.getEgBillregistermis().getDepartmentcode()));
                }
            }
        }
    }

    public List<WorkflowAction> getValidActions(final String purpose) {
        final List<WorkflowAction> validButtons = new ArrayList<WorkflowAction>();
        final Script validScript = (Script) getPersistenceService()
                .findAllByNamedQuery(Script.BY_NAME, "pjv.validbuttons").get(0);
        final List<String> list = (List<String>) scriptService.executeScript(validScript,
                ScriptService.createContext("eisCommonServiceBean", eisCommonService, "userId",
                        ApplicationThreadLocals.getUserId().intValue(), "date", new Date(), "purpose", purpose));
        for (final Object s : list) {
            if ("invalid".equals(s))
                break;
            final WorkflowAction action = (WorkflowAction) getPersistenceService()
                    .find(" from WorkflowAction where type='CVoucherHeader' and name=?", s.toString());
            validButtons.add(action);
        }
        return validButtons;
    }

    private String getApprovalStatusForBills() {
        String statusid = "";
        final List<AppConfigValues> appConfigList = appConfigValueService.getConfigValuesByModuleAndKey(
                FinancialConstants.MODULE_NAME_APPCONFIG, expType + "BillApprovalStatus");

        if (appConfigList.isEmpty())
            throw new ValidationException(Arrays.asList(new ValidationError("Status for bill approval",
                    "App Config value is missing for exp type :" + expType)));
        for (final AppConfigValues appConfigVal : appConfigList) {

            final String configvalue = appConfigVal.getValue();
            final EgwStatus egwstatus = egwStatusDAO.getStatusByModuleAndCode(
                    configvalue.substring(0, configvalue.indexOf("|")),
                    configvalue.substring(configvalue.indexOf("|") + 1));
            if (null == egwstatus || null == egwstatus.getId())
                throw new ValidationException(
                        Arrays.asList(new ValidationError("Status for bill approval", " status for " + expType
                                + " approval is not present in Egwstatus for app config value : " + configvalue)));
            else
                statusid = statusid.isEmpty() ? egwstatus.getId().toString() : statusid + "," + egwstatus.getId();
        }

        return statusid;

    }

    public EisCommonService getEisCommonService() {
        return eisCommonService;
    }

    public void setEisCommonService(final EisCommonService eisCommonService) {
        this.eisCommonService = eisCommonService;
    }

    public VoucherService getVoucherService() {
        return voucherService;
    }

    public void setVoucherService(final VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    public String getExpType() {
        return expType;
    }

    public void setExpType(final String expType) {
        this.expType = expType;
    }

    public List<EgBillregister> getPreApprovedVoucherList() {
        return preApprovedVoucherList;
    }

    public void setPreApprovedVoucherList(final List<EgBillregister> preApprovedVoucherList) {
        this.preApprovedVoucherList = preApprovedVoucherList;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(final String billNumber) {
        this.billNumber = billNumber;
    }

    public EisUtilService getEisUtilService() {
        return eisUtilService;
    }

    public void setEisUtilService(final EisUtilService eisUtilService) {
        this.eisUtilService = eisUtilService;
    }

    public void setVoucherHelper(final VoucherHelper voucherHelper) {
    }
}