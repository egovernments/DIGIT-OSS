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
package org.egov.egf.web.controller.contractor;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.egov.commons.CChartOfAccountDetail;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.commons.service.CheckListService;
import org.egov.egf.commons.CommonsUtil;
import org.egov.egf.contractorbill.service.ContractorBillService;
import org.egov.egf.expensebill.repository.DocumentUploadRepository;
import org.egov.egf.masters.services.ContractorService;
import org.egov.egf.masters.services.WorkOrderService;
import org.egov.egf.utils.FinancialUtils;
import org.egov.egf.web.controller.expensebill.BaseBillController;
import org.egov.eis.web.contract.WorkflowContainer;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.exception.ApplicationException;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.infstr.models.EgChecklists;
import org.egov.model.bills.BillType;
import org.egov.model.bills.DocumentUpload;
import org.egov.model.bills.EgBillPayeedetails;
import org.egov.model.bills.EgBilldetails;
import org.egov.model.bills.EgBillregister;
import org.egov.utils.FinancialConstants;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping(value = "/contractorbill")
@Validated
public class UpdateContractorBillController extends BaseBillController {

	private static final String CONTRACTORBILL_UPDATE = "contractorbill-update";

	private static final String BILL_TYPES = "billTypes";
	
	protected static final String UNAUTHORIZED = "unuthorized";
	
	private static final String INVALID_APPROVER = "invalid.approver";
	
    private static final String APPROVER_NAME = "approverName";

    private static final String DESIGNATION = "designation";

    private static final String APPROVAL_COMENT = "approvalComent";

    private static final String CONTRACTOR = "Contractor";

    private static final String WORK_ORDER = "WorkOrder";

    private static final String NET_PAYABLE_CODES = "netPayableCodes";

    private static final String CONTRACTORS = "contractors";

    private static final String CONTRACTOR_ID = "contractorId";

    private static final String WORKFLOW_HISTORY = "workflowHistory";

    private static final String CURRENT_STATE = "currentState";

    private static final String STATE_TYPE = "stateType";

    private static final String NET_PAYABLE_AMOUNT = "netPayableAmount";

    private static final String APPROVAL_DESIGNATION = "approvalDesignation";

    private static final String EG_BILLREGISTER = "egBillregister";

    private static final String APPROVAL_POSITION = "approvalPosition";

    private static final String CONTRACTORBILL_VIEW = "contractorbill-view";

    private static final String NET_PAYABLE_ID = "netPayableId";
    @Autowired
    private DocumentUploadRepository documentUploadRepository;
    @Autowired
    private ContractorBillService contractorBillService;
    @Autowired
    @Qualifier("chartOfAccountsService")
    private ChartOfAccountsService chartOfAccountsService;
    @Autowired
    private FinancialUtils financialUtils;
    @Autowired
    private CheckListService checkListService;
    @Autowired
    private MicroserviceUtils microServiceUtil;
    @Autowired
    private ContractorService contractorService;
    @Autowired
    private WorkOrderService workOrderService;
    @Autowired
    private AccountdetailtypeService accountdetailtypeService;
    @Autowired
    private SecurityUtils securityUtils;
    @Autowired
    private CommonsUtil commonsUtil;

    public UpdateContractorBillController(final AppConfigValueService appConfigValuesService) {
        super(appConfigValuesService);
    }
    
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.setDisallowedFields("id");
    }

    @Override
    protected void setDropDownValues(final Model model) {
        super.setDropDownValues(model);
        model.addAttribute(BILL_TYPES, BillType.values());
        model.addAttribute(CONTRACTORS, contractorService.getAllActiveContractors());
        model.addAttribute(NET_PAYABLE_CODES, chartOfAccountsService.getContractorNetPayableAccountCodes());
    }

    @ModelAttribute(EG_BILLREGISTER)
    public EgBillregister getEgBillregister(@PathVariable @SafeHtml String billId) {
        if (billId.contains("showMode")) {
            String[] billIds = billId.split("\\&");
            billId = billIds[0];
        }
        return contractorBillService.getById(Long.parseLong(billId));
    }

    @GetMapping(value = "/update/{billId}")
    public String updateForm(final Model model, @PathVariable @SafeHtml final String billId,
            final HttpServletRequest request) throws ApplicationException {
    	final EgBillregister egBillregister = contractorBillService.getById(Long.parseLong(billId));
    	if (!commonsUtil.isApplicationOwner(securityUtils.getCurrentUser(), egBillregister))
            return UNAUTHORIZED;
        final List<DocumentUpload> documents = documentUploadRepository.findByObjectId(Long.valueOf(billId));
        egBillregister.setDocumentDetail(documents);
        List<Map<String, Object>> budgetDetails = null;
        setDropDownValues(model);
        model.addAttribute(STATE_TYPE, egBillregister.getClass().getSimpleName());
        if (egBillregister.getState() != null)
            model.addAttribute(CURRENT_STATE, egBillregister.getState().getValue());
        model.addAttribute(WORKFLOW_HISTORY,
                financialUtils.getHistory(egBillregister.getState(), egBillregister.getStateHistory()));
        model.addAttribute(CONTRACTOR_ID,
                workOrderService.getByOrderNumber(egBillregister.getWorkordernumber()).getContractor().getId());
        prepareWorkflow(model, egBillregister, new WorkflowContainer());
        egBillregister.getBillDetails().addAll(egBillregister.getEgBilldetailes());
        prepareBillDetailsForView(egBillregister);
        prepareContractorBillDetailsForView(egBillregister);
        contractorBillService.validateSubledgeDetails(egBillregister);
        final List<CChartOfAccounts> contractorPayableAccountList = chartOfAccountsService
                .getNetPayableCodes();
        for (final EgBilldetails details : egBillregister.getBillDetails())
            if (contractorPayableAccountList != null && !contractorPayableAccountList.isEmpty()
                    && contractorPayableAccountList.contains(details.getChartOfAccounts())) {
                model.addAttribute(NET_PAYABLE_ID, details.getChartOfAccounts().getId());
                model.addAttribute(NET_PAYABLE_AMOUNT, details.getCreditamount());
            }

        String department = this.getDepartmentName(egBillregister.getEgBillregistermis().getDepartmentcode());

        if (department != null)
            egBillregister.getEgBillregistermis().setDepartmentName(department);

        if (egBillregister.getEgBillregistermis().getScheme() != null
                && egBillregister.getEgBillregistermis().getScheme().getId() != null) {
            egBillregister.getEgBillregistermis()
                    .setSchemeId(egBillregister.getEgBillregistermis().getScheme().getId().longValue());
        }

        if (egBillregister.getEgBillregistermis().getSubScheme() != null
                && egBillregister.getEgBillregistermis().getSubScheme().getId() != null) {
            egBillregister.getEgBillregistermis()
                    .setSubSchemeId(egBillregister.getEgBillregistermis().getSubScheme().getId().longValue());
        }

        model.addAttribute(EG_BILLREGISTER, egBillregister);

        if (egBillregister.getState() != null &&
                (FinancialConstants.WORKFLOW_STATE_REJECTED.equals(egBillregister.getState().getValue()) ||
                        financialUtils.isBillEditable(egBillregister.getState()))) {
            model.addAttribute("mode", "edit");
            return CONTRACTORBILL_UPDATE;
        } else {
            model.addAttribute("mode", "view");
            if (egBillregister.getEgBillregistermis().getBudgetaryAppnumber() != null &&
                    !egBillregister.getEgBillregistermis().getBudgetaryAppnumber().isEmpty()) {
                budgetDetails = contractorBillService.getBudgetDetailsForBill(egBillregister);
            }
            model.addAttribute("budgetDetails", budgetDetails);
            return CONTRACTORBILL_VIEW;
        }

    }

    private void populateSubLedgerDetails(final EgBillregister egBillregister, final BindingResult resultBinder) {
        EgBillPayeedetails payeeDetail = null;
        Boolean check = false;
        Boolean woExist = false;
        Boolean contractorExist = false;
        for (final EgBilldetails details : egBillregister.getEgBilldetailes()) {
            details.setEgBillPaydetailes(new HashSet<>());
            check = false;
            woExist = false;
            contractorExist = false;
			if (details.getChartOfAccounts() != null && details.getChartOfAccounts().getChartOfAccountDetails() != null
					&& !details.getChartOfAccounts().getChartOfAccountDetails().isEmpty()) {
                for (CChartOfAccountDetail cad : details.getChartOfAccounts().getChartOfAccountDetails()) {
                    if (cad.getDetailTypeId() != null) {
                        if (cad.getDetailTypeId().getName().equalsIgnoreCase(WORK_ORDER)) {
                            woExist = true;
                        }
                        if (cad.getDetailTypeId().getName().equalsIgnoreCase(CONTRACTOR)) {
                            contractorExist = true;
                        }
                        if (!cad.getDetailTypeId().getName().equalsIgnoreCase(WORK_ORDER)
                                && !cad.getDetailTypeId().getName().equalsIgnoreCase(CONTRACTOR)) {
                            check = true;
                        }
                        if (check.booleanValue()) {
                            resultBinder.reject("msg.contractor.bill.wrong.sub.ledger.mapped",
                                    new String[] { details.getChartOfAccounts().getGlcode() }, null);
                        }
                    }
                }

                if (woExist.booleanValue() || (woExist && contractorExist)) {
                    payeeDetail = new EgBillPayeedetails();
                    payeeDetail.setEgBilldetailsId(details);
                    if (details.getDebitamount() != null && details.getDebitamount().compareTo(BigDecimal.ZERO) == 1)
                        payeeDetail.setDebitAmount(details.getDebitamount());
                    if (details.getCreditamount() != null && details.getCreditamount().compareTo(BigDecimal.ZERO) == 1)
                        payeeDetail.setCreditAmount(details.getCreditamount());
                    payeeDetail.setAccountDetailTypeId(accountdetailtypeService.findByName(WORK_ORDER).getId());
                    payeeDetail.setAccountDetailKeyId(
                            workOrderService.getByOrderNumber(egBillregister.getWorkordernumber()).getId().intValue());
                } else if (contractorExist.booleanValue()) {
                    payeeDetail = new EgBillPayeedetails();
                    payeeDetail.setEgBilldetailsId(details);
                    if (details.getDebitamount() != null && details.getDebitamount().compareTo(BigDecimal.ZERO) == 1)
                        payeeDetail.setDebitAmount(details.getDebitamount());
                    if (details.getCreditamount() != null && details.getCreditamount().compareTo(BigDecimal.ZERO) == 1)
                        payeeDetail.setCreditAmount(details.getCreditamount());
                    payeeDetail.setAccountDetailTypeId(accountdetailtypeService.findByName(CONTRACTOR).getId());
                    payeeDetail.setAccountDetailKeyId(
                            workOrderService.getByOrderNumber(egBillregister.getWorkordernumber()).getContractor().getId()
                                    .intValue());
                }
                payeeDetail.setLastUpdatedTime(new Date());
                details.getEgBillPaydetailes().add(payeeDetail);
            }
        }
    }

    private void prepareContractorBillDetailsForView(final EgBillregister egBillregister) {

        List<CChartOfAccounts> netPayableList = chartOfAccountsService.getContractorNetPayableAccountCodes();
        Map<String, CChartOfAccounts> coaMap = new HashMap<>();
        for (CChartOfAccounts coa : netPayableList) {
            coaMap.put(coa.getGlcode(), coa);
        }
        egBillregister.setCreditDetails(new ArrayList<>());
        egBillregister.setDebitDetails(new ArrayList<>());
        egBillregister.setNetPayableDetails(new ArrayList<>());
        for (EgBilldetails bd : egBillregister.getEgBilldetailes()) {
            if (bd.getDebitamount() != null && bd.getDebitamount().compareTo(BigDecimal.ZERO) > 0) {
                egBillregister.getDebitDetails().add(bd);
            }

            if (bd.getCreditamount() != null && bd.getCreditamount().compareTo(BigDecimal.ZERO) > 0
                    && coaMap.get(bd.getChartOfAccounts().getGlcode()) == null) {
                egBillregister.getCreditDetails().add(bd);
            }

            if (bd.getCreditamount() != null && bd.getCreditamount().compareTo(BigDecimal.ZERO) > 0
                    && coaMap.get(bd.getChartOfAccounts().getGlcode()) != null) {
                egBillregister.getNetPayableDetails().add(bd);
            }

        }
    }

    @PostMapping(value = "/update/{billId}")
    public String update(@Valid @ModelAttribute(EG_BILLREGISTER) final EgBillregister egBillregister,
            final BindingResult resultBinder, final RedirectAttributes redirectAttributes, final Model model,
            final HttpServletRequest request, @RequestParam @SafeHtml final String workFlowAction)
            throws ApplicationException, IOException {

        String mode = "";
        EgBillregister updatedEgBillregister = null;

        if (request.getParameter("mode") != null)
            mode = request.getParameter("mode");

        Long approvalPosition = 0l;
        String approvalComment = "";
        String apporverDesignation = "";
        
        if (request.getParameter(APPROVAL_COMENT) != null)
            approvalComment = request.getParameter(APPROVAL_COMENT);

        if (request.getParameter(APPROVAL_POSITION) != null && !request.getParameter(APPROVAL_POSITION).isEmpty())
            approvalPosition = Long.valueOf(request.getParameter(APPROVAL_POSITION));

        if ((approvalPosition == null || approvalPosition.equals(Long.valueOf(0)))
                && request.getParameter(APPROVAL_POSITION) != null
                && !request.getParameter(APPROVAL_POSITION).isEmpty())
            approvalPosition = Long.valueOf(request.getParameter(APPROVAL_POSITION));
        if (request.getParameter(APPROVAL_DESIGNATION) != null && !request.getParameter(APPROVAL_DESIGNATION).isEmpty())
            apporverDesignation = String.valueOf(request.getParameter(APPROVAL_DESIGNATION));
        
        if (workFlowAction != null && FinancialConstants.BUTTONFORWARD.equalsIgnoreCase(workFlowAction)) {
            if (!commonsUtil.isValidApprover(egBillregister, approvalPosition)) {
                model.addAttribute("errorMessage", getLocalizedMessage(INVALID_APPROVER, null, null));
                prepareBillDetailsForView(egBillregister);
                contractorBillService.validateSubledgeDetails(egBillregister);
                return populateOnException(egBillregister, model, request);
            }
        }

        if (egBillregister.getState() != null
                && (FinancialConstants.WORKFLOW_STATE_REJECTED.equals(egBillregister.getState().getValue())
                        || financialUtils.isBillEditable(egBillregister.getState()))) {
            populateBillDetails(egBillregister);
            populateSubLedgerDetails(egBillregister, resultBinder);
            validateBillNumber(egBillregister, resultBinder);
            validateLedgerAndSubledger(egBillregister, resultBinder);
        }
        model.addAttribute(CONTRACTOR_ID,
                workOrderService.getByOrderNumber(egBillregister.getWorkordernumber()).getContractor().getId());

        if (resultBinder.hasErrors()) {
            return populateOnException(egBillregister, model, request);
        } else {
            try {
                if (null != workFlowAction)
                    updatedEgBillregister = contractorBillService.update(egBillregister, approvalPosition, approvalComment, null,
                            workFlowAction, mode, apporverDesignation);
            } catch (final ValidationException e) {
                setDropDownValues(model);
                model.addAttribute(STATE_TYPE, egBillregister.getClass().getSimpleName());
                prepareWorkflow(model, egBillregister, new WorkflowContainer());
                model.addAttribute(APPROVAL_DESIGNATION, request.getParameter(APPROVAL_DESIGNATION));
                model.addAttribute(APPROVAL_POSITION, request.getParameter(APPROVAL_POSITION));
                model.addAttribute(NET_PAYABLE_ID, request.getParameter(NET_PAYABLE_ID));
                model.addAttribute(NET_PAYABLE_AMOUNT, request.getParameter(NET_PAYABLE_AMOUNT));
                model.addAttribute(DESIGNATION, request.getParameter(DESIGNATION));
                if (egBillregister.getState() != null
                        && (FinancialConstants.WORKFLOW_STATE_REJECTED.equals(egBillregister.getState().getValue())
                                || financialUtils.isBillEditable(egBillregister.getState()))) {
                    prepareValidActionListByCutOffDate(model);
                    model.addAttribute("mode", "edit");
                    return CONTRACTORBILL_UPDATE;
                } else {
                    model.addAttribute("mode", "view");
                    return CONTRACTORBILL_VIEW;
                }
            }

            redirectAttributes.addFlashAttribute(EG_BILLREGISTER, updatedEgBillregister);

            // For Get Configured ApprovalPosition from workflow history
            if (approvalPosition == null || approvalPosition.equals(Long.valueOf(0)))
                approvalPosition = contractorBillService.getApprovalPositionByMatrixDesignation(
                        egBillregister, null, mode, workFlowAction);

            final String approverName = String.valueOf(request.getParameter(APPROVER_NAME));
            final String approverDetails = financialUtils.getApproverDetails(workFlowAction,
                    updatedEgBillregister.getState(), updatedEgBillregister.getId(), approvalPosition, approverName);

            return "redirect:/contractorbill/success?approverDetails=" + approverDetails + "&billNumber="
                    + updatedEgBillregister.getBillnumber();
        }
    }

	private String populateOnException(final EgBillregister egBillregister, final Model model,
			final HttpServletRequest request) {
		setDropDownValues(model);
		model.addAttribute(CONTRACTOR_ID,
		        workOrderService.getByOrderNumber(egBillregister.getWorkordernumber()).getContractor().getId());
		model.addAttribute(STATE_TYPE, egBillregister.getClass().getSimpleName());
		prepareWorkflow(model, egBillregister, new WorkflowContainer());
		model.addAttribute(APPROVAL_DESIGNATION, request.getParameter(APPROVAL_DESIGNATION));
		model.addAttribute(APPROVAL_POSITION, request.getParameter(APPROVAL_POSITION));
		model.addAttribute(NET_PAYABLE_ID, request.getParameter(NET_PAYABLE_ID));
		model.addAttribute(NET_PAYABLE_AMOUNT, request.getParameter(NET_PAYABLE_AMOUNT));
		model.addAttribute(DESIGNATION, request.getParameter(DESIGNATION));
		if (egBillregister.getState() != null
		        && (FinancialConstants.WORKFLOW_STATE_REJECTED.equals(egBillregister.getState().getValue())
		                || financialUtils.isBillEditable(egBillregister.getState()))) {
		    prepareValidActionListByCutOffDate(model);
		    model.addAttribute("mode", "edit");
		    return CONTRACTORBILL_UPDATE;
		} else {
		    model.addAttribute("mode", "view");
		    return CONTRACTORBILL_VIEW;
		}
	}

    @GetMapping(value = "/view/{billId}")
    public String view(final Model model, @PathVariable @SafeHtml String billId,
            final HttpServletRequest request) throws ApplicationException {
        if (billId.contains("showMode")) {
            String[] billIds = billId.split("\\&");
            billId = billIds[0];
        }
        final EgBillregister egBillregister = contractorBillService.getById(Long.parseLong(billId));
        final List<DocumentUpload> documents = documentUploadRepository.findByObjectId(Long.valueOf(billId));
        egBillregister.setDocumentDetail(documents);
        Department dept = microServiceUtil.getDepartmentByCode(egBillregister.getEgBillregistermis().getDepartmentcode());
        egBillregister.getEgBillregistermis().setDepartmentName(dept.getName());
        setDropDownValues(model);
        egBillregister.getBillDetails().addAll(egBillregister.getEgBilldetailes());
        model.addAttribute("mode", "readOnly");
        prepareBillDetailsForView(egBillregister);
        prepareCheckList(egBillregister);
        final List<CChartOfAccounts> contractorPayableAccountList = chartOfAccountsService.getContractorNetPayableAccountCodes();
        for (final EgBilldetails details : egBillregister.getBillDetails())
            if (contractorPayableAccountList != null && !contractorPayableAccountList.isEmpty()
                    && contractorPayableAccountList.contains(details.getChartOfAccounts()))
                model.addAttribute(NET_PAYABLE_AMOUNT, details.getCreditamount());
        model.addAttribute(EG_BILLREGISTER, egBillregister);
        return CONTRACTORBILL_VIEW;
    }

    private void prepareCheckList(final EgBillregister egBillregister) {
        final List<EgChecklists> checkLists = checkListService.getByObjectId(egBillregister.getId());
        egBillregister.getCheckLists().addAll(checkLists);
    }

    @SuppressWarnings("deprecation")
	private String getDepartmentName(String departmentCode) {

        List<Department> deptlist = this.masterDataCache.get("egi-department");
        String departmentName = null;

        if (null != deptlist && !deptlist.isEmpty()) {

            List<Department> dept = deptlist.stream()
                    .filter(department -> departmentCode.equalsIgnoreCase(department.getCode()))
                    .collect(Collectors.toList());
            if (null != dept && !dept.isEmpty())
                departmentName = dept.get(0).getName();
        }

        if (null == departmentName) {
            Department dept = this.microServiceUtil.getDepartmentByCode(departmentCode);
            if (null != dept)
                departmentName = dept.getName();
        }

        return departmentName;
    }

}
