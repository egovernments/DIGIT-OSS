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
package org.egov.egf.web.controller.supplier;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.dispatcher.multipart.MultiPartRequestWrapper;
import org.apache.struts2.dispatcher.multipart.UploadedFile;
import org.egov.commons.Accountdetailtype;
import org.egov.commons.CChartOfAccountDetail;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.egf.budget.model.BudgetControlType;
import org.egov.egf.budget.service.BudgetControlTypeService;
import org.egov.egf.commons.CommonsUtil;
import org.egov.egf.masters.services.PurchaseOrderService;
import org.egov.egf.masters.services.SupplierService;
import org.egov.egf.supplierbill.service.SupplierBillService;
import org.egov.egf.utils.FinancialUtils;
import org.egov.egf.web.controller.expensebill.BaseBillController;
import org.egov.eis.web.contract.WorkflowContainer;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.filestore.service.FileStoreService;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.model.bills.BillType;
import org.egov.model.bills.DocumentUpload;
import org.egov.model.bills.EgBillPayeedetails;
import org.egov.model.bills.EgBilldetails;
import org.egov.model.bills.EgBillregister;
import org.egov.model.masters.PurchaseOrder;
import org.egov.utils.FinancialConstants;
import org.hibernate.validator.constraints.SafeHtml;
import org.owasp.esapi.ESAPI;
import org.owasp.esapi.HTTPUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author venki
 */

@Controller
@RequestMapping(value = "/supplierbill")
@Validated
public class CreateSupplierBillController extends BaseBillController {

	private static final String INVALID_APPROVER = "invalid.approver";

	private static final String NET_PAYABLE_CODES = "netPayableCodes";

	private static final String SUPPLIERS = "suppliers";

	private static final String BILL_TYPES = "billTypes";

	private static final String SUPPLIER_ID = "supplierId";

	private static final String APPROVER_DETAILS = "approverDetails";

	private static final String APPROVER_NAME = "approverName";

	private static final String APPROVAL_COMENT = "approvalComent";

	private static final String SUPPLIER = "Supplier";

	private static final String FILE = "file";

	private static final String PURCHASE_ORDER = "PurchaseOrder";

	private static final String DESIGNATION = "designation";

	private static final String NET_PAYABLE_ID = "netPayableId";

	private static final String SUPPLIERBILL_FORM = "supplierbill-form";

	private static final String STATE_TYPE = "stateType";

	private static final String APPROVAL_POSITION = "approvalPosition";

	private static final String APPROVAL_DESIGNATION = "approvalDesignation";

	private static final int BUFFER_SIZE = 4096;

	@Autowired
	private SupplierBillService supplierBillService;

	@Autowired
	private BudgetControlTypeService budgetControlTypeService;

	@Autowired
	private FileStoreService fileStoreService;

	@Autowired
	private FinancialUtils financialUtils;

	@Autowired
	private SupplierService supplierService;

	@Autowired
	private ChartOfAccountsService chartOfAccountsService;

	@Autowired
	private AccountdetailtypeService accountdetailtypeService;

	@Autowired
	private PurchaseOrderService purchaseOrderService;

	@Autowired
	private CommonsUtil commonsUtil;

	public CreateSupplierBillController(final AppConfigValueService appConfigValuesService) {
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
		model.addAttribute(SUPPLIERS, supplierService.getAllActiveSuppliers());
		model.addAttribute(NET_PAYABLE_CODES, chartOfAccountsService.getSupplierNetPayableAccountCodes());
	}

	@PostMapping(value = "/newform")
	public String showNewForm(@ModelAttribute("egBillregister") final EgBillregister egBillregister, final Model model,
			HttpServletRequest request) {
		setDropDownValues(model);
		model.addAttribute("billNumberGenerationAuto", supplierBillService.isBillNumberGenerationAuto());
		model.addAttribute(STATE_TYPE, egBillregister.getClass().getSimpleName());
		prepareWorkflow(model, egBillregister, new WorkflowContainer());
		prepareValidActionListByCutOffDate(model);
		if (isBillDateDefaultValue) {
			egBillregister.setBilldate(new Date());
		}
		return SUPPLIERBILL_FORM;
	}

	@PostMapping(value = "/create")
	public String create(@Valid @ModelAttribute("egBillregister") final EgBillregister egBillregister,
			final Model model, final BindingResult resultBinder, final HttpServletRequest request,
			@RequestParam @SafeHtml final String workFlowAction) throws IOException, ParseException {
		if (FinancialConstants.BUTTONFORWARD.equalsIgnoreCase(workFlowAction) && !commonsUtil
				.isValidApprover(egBillregister, Long.valueOf(request.getParameter(APPROVAL_POSITION)))) {
			populateDataOnErrors(egBillregister, model, request);
			model.addAttribute("errorMessage", getLocalizedMessage(INVALID_APPROVER, null, null));
			return SUPPLIERBILL_FORM;
		}
		egBillregister.setCreatedBy(ApplicationThreadLocals.getUserId());
		if (StringUtils.isBlank(egBillregister.getExpendituretype()))
			egBillregister.setExpendituretype(FinancialConstants.STANDARD_EXPENDITURETYPE_PURCHASE);
		String[] contentType = ((MultiPartRequestWrapper) request).getContentTypes(FILE);
		List<DocumentUpload> list = new ArrayList<>();
		UploadedFile[] uploadedFiles = ((MultiPartRequestWrapper) request).getFiles(FILE);
		String[] fileName = ((MultiPartRequestWrapper) request).getFileNames(FILE);
		if (uploadedFiles != null)
			for (int i = 0; i < uploadedFiles.length; i++) {

				Path path = Paths.get(uploadedFiles[i].getAbsolutePath());
				byte[] fileBytes = Files.readAllBytes(path);
				ByteArrayInputStream bios = new ByteArrayInputStream(fileBytes);
				DocumentUpload upload = new DocumentUpload();
				upload.setInputStream(bios);
				upload.setFileName(fileName[i]);
				upload.setContentType(contentType[i]);
				list.add(upload);
			}

		populateBillDetails(egBillregister);
		populateSubLedgerDetails(egBillregister, resultBinder);
		validateBillNumber(egBillregister, resultBinder);
		removeEmptyRows(egBillregister);
		validateLedgerAndSubledger(egBillregister, resultBinder);
		validateCuttofDate(egBillregister, resultBinder);
		if (resultBinder.hasErrors()) {
			return populateDataOnErrors(egBillregister, model, request);
		} else {
			Long approvalPosition = 0l;
			String approvalComment = "";
			String approvalDesignation = "";
			if (request.getParameter(APPROVAL_COMENT) != null)
				approvalComment = request.getParameter(APPROVAL_COMENT);
			if (request.getParameter(APPROVAL_POSITION) != null && !request.getParameter(APPROVAL_POSITION).isEmpty())
				approvalPosition = Long.valueOf(request.getParameter(APPROVAL_POSITION));
			if (request.getParameter(APPROVAL_DESIGNATION) != null
					&& !request.getParameter(APPROVAL_DESIGNATION).isEmpty())
				approvalDesignation = String.valueOf(request.getParameter(APPROVAL_DESIGNATION));

			EgBillregister savedEgBillregister;
			egBillregister.setDocumentDetail(list);
			try {

				savedEgBillregister = supplierBillService.create(egBillregister, approvalPosition, approvalComment,
						null, workFlowAction, approvalDesignation);
			} catch (final ValidationException e) {
				setDropDownValues(model);
				model.addAttribute(STATE_TYPE, egBillregister.getClass().getSimpleName());
				prepareWorkflow(model, egBillregister, new WorkflowContainer());
				model.addAttribute(NET_PAYABLE_ID, request.getParameter(NET_PAYABLE_ID));
				model.addAttribute(APPROVAL_DESIGNATION, request.getParameter(APPROVAL_DESIGNATION));
				model.addAttribute(APPROVAL_POSITION, request.getParameter(APPROVAL_POSITION));
				model.addAttribute(DESIGNATION, request.getParameter(DESIGNATION));
				egBillregister.getBillPayeedetails().clear();
				prepareBillDetailsForView(egBillregister);
				prepareValidActionListByCutOffDate(model);
				model.addAttribute(SUPPLIER_ID, purchaseOrderService
						.getByOrderNumber(egBillregister.getWorkordernumber()).getSupplier().getId());
				resultBinder.reject("", e.getErrors().get(0).getMessage());
				return SUPPLIERBILL_FORM;
			}
			final String approverName = String.valueOf(request.getParameter(APPROVER_NAME));

			final String approverDetails = financialUtils.getApproverDetails(workFlowAction,
					savedEgBillregister.getState(), savedEgBillregister.getId(), approvalPosition, approverName);

			return "redirect:/supplierbill/success?approverDetails=" + approverDetails + "&billNumber="
					+ savedEgBillregister.getBillnumber();

		}
	}

	private String populateDataOnErrors(final EgBillregister egBillregister, final Model model,
			final HttpServletRequest request) {
		setDropDownValues(model);
		model.addAttribute(STATE_TYPE, egBillregister.getClass().getSimpleName());
		prepareWorkflow(model, egBillregister, new WorkflowContainer());
		model.addAttribute(NET_PAYABLE_ID, request.getParameter(NET_PAYABLE_ID));
		model.addAttribute(APPROVAL_DESIGNATION, request.getParameter(APPROVAL_DESIGNATION));
		model.addAttribute(APPROVAL_POSITION, request.getParameter(APPROVAL_POSITION));
		model.addAttribute(DESIGNATION, request.getParameter(DESIGNATION));
		egBillregister.getBillPayeedetails().clear();
		prepareBillDetailsForView(egBillregister);
		prepareValidActionListByCutOffDate(model);
		model.addAttribute(SUPPLIER_ID,
				purchaseOrderService.getByOrderNumber(egBillregister.getWorkordernumber()).getSupplier().getId());
		return SUPPLIERBILL_FORM;
	}

	void removeEmptyRows(EgBillregister egBillregister) {
		Set<EgBilldetails> billDetails = new HashSet<>();
		for (EgBilldetails details : egBillregister.getEgBilldetailes()) {
			if (!(details.getDebitamount() == null && details.getCreditamount() == null
					&& details.getChartOfAccounts() == null)) {
				billDetails.add(details);
			}
		}
		egBillregister.setEgBilldetailes(new HashSet<>(billDetails));
	}

	private void populateSubLedgerDetails(final EgBillregister egBillregister, final BindingResult resultBinder) {
		EgBillPayeedetails payeeDetail = null;
		Boolean check = false;
		Boolean poExist = false;
		Boolean supplierExist = false;
		Integer poAccountDetailTypeId;
		Integer supplierAccountDetailTypeId = null;
		String poAccountDetailTypeName;
		String supplierAccountDetailTypeName = null;
		PurchaseOrder po = null;
		Accountdetailtype poAccountdetailtype = accountdetailtypeService.findByName(PURCHASE_ORDER);
		poAccountDetailTypeId = poAccountdetailtype.getId();
		poAccountDetailTypeName = poAccountdetailtype.getName();
		Accountdetailtype suppAccountdetailtype = accountdetailtypeService.findByName(SUPPLIER);
		supplierAccountDetailTypeId = suppAccountdetailtype.getId();
		supplierAccountDetailTypeName = suppAccountdetailtype.getName();
		po = purchaseOrderService.getByOrderNumber(egBillregister.getWorkordernumber());
		for (final EgBilldetails details : egBillregister.getEgBilldetailes()) {
			details.setEgBillPaydetailes(new HashSet<>());
			check = false;
			poExist = false;
			supplierExist = false;
			if (details.getChartOfAccounts() != null && details.getChartOfAccounts().getChartOfAccountDetails() != null
					&& !details.getChartOfAccounts().getChartOfAccountDetails().isEmpty()) {
				for (CChartOfAccountDetail cad : details.getChartOfAccounts().getChartOfAccountDetails()) {
					if (cad.getDetailTypeId() != null) {
						if (cad.getDetailTypeId().getName().equalsIgnoreCase(PURCHASE_ORDER)) {
							poExist = true;
						}
						if (cad.getDetailTypeId().getName().equalsIgnoreCase(SUPPLIER)) {
							supplierExist = true;
						}
						if (!cad.getDetailTypeId().getName().equalsIgnoreCase(PURCHASE_ORDER)
								&& !cad.getDetailTypeId().getName().equalsIgnoreCase(SUPPLIER)) {
							check = true;
						}
					}

				}

				if (check.booleanValue() && !supplierExist.booleanValue() && !poExist.booleanValue()) {
					resultBinder.reject("msg.supplier.bill.wrong.sub.ledger.mapped",
							new String[] { details.getChartOfAccounts().getGlcode() }, null);
				}

				if (details.getDebitamount() != null && details.getDebitamount().compareTo(BigDecimal.ZERO) > 0) {
					if (poExist.booleanValue() || (poExist && supplierExist)) {
						payeeDetail = prepareBillPayeeDetails(details, details.getDebitamount(), BigDecimal.ZERO,
								poAccountDetailTypeId, po.getId().intValue(), poAccountDetailTypeName, po.getName());
						egBillregister.getEgBillregistermis().setPayto(po.getName());
						details.getEgBillPaydetailes().add(payeeDetail);
					} else if (supplierExist.booleanValue()) {
						payeeDetail = prepareBillPayeeDetails(details, details.getDebitamount(), BigDecimal.ZERO,
								supplierAccountDetailTypeId, po.getSupplier().getId().intValue(),
								supplierAccountDetailTypeName, po.getSupplier().getName());
						egBillregister.getEgBillregistermis().setPayto(po.getSupplier().getName());
						details.getEgBillPaydetailes().add(payeeDetail);
					}

				}

				if (details.getCreditamount() != null && details.getCreditamount().compareTo(BigDecimal.ZERO) > 0) {
					if (supplierExist.booleanValue() || (poExist && supplierExist)) {
						payeeDetail = prepareBillPayeeDetails(details, BigDecimal.ZERO, details.getCreditamount(),
								supplierAccountDetailTypeId, po.getSupplier().getId().intValue(),
								supplierAccountDetailTypeName, po.getSupplier().getName());
						egBillregister.getEgBillregistermis().setPayto(po.getSupplier().getName());
						details.getEgBillPaydetailes().add(payeeDetail);
					} else if (poExist.booleanValue()) {
						payeeDetail = prepareBillPayeeDetails(details, BigDecimal.ZERO, details.getCreditamount(),
								poAccountDetailTypeId, po.getId().intValue(), poAccountDetailTypeName, po.getName());
						egBillregister.getEgBillregistermis().setPayto(po.getName());
						details.getEgBillPaydetailes().add(payeeDetail);
					}
				}

			} else {
				egBillregister.getEgBillregistermis().setPayto(po.getSupplier().getName());
			}
		}
	}

	private EgBillPayeedetails prepareBillPayeeDetails(EgBilldetails details, BigDecimal debitamount,
			BigDecimal creditamount, Integer detailTypeId, int detailKeyId, String detailTypeName,
			String detailKeyName) {
		EgBillPayeedetails payeeDetail = new EgBillPayeedetails();
		payeeDetail.setEgBilldetailsId(details);
		payeeDetail.setDebitAmount(debitamount);
		payeeDetail.setCreditAmount(creditamount);
		payeeDetail.setAccountDetailTypeId(detailTypeId);
		payeeDetail.setAccountDetailKeyId(detailKeyId);
		payeeDetail.setDetailTypeName(detailTypeName);
		payeeDetail.setDetailKeyName(detailKeyName);
		payeeDetail.setLastUpdatedTime(new Date());
		return payeeDetail;

	}

	@GetMapping(value = "/success")
	public String showSuccessPage(@RequestParam("billNumber") @SafeHtml final String billNumber, final Model model,
			final HttpServletRequest request) {
		final String[] keyNameArray = request.getParameter(APPROVER_DETAILS).split(",");
		Long id = 0L;
		String approverName = "";
		String nextDesign = "";
		if (keyNameArray.length != 0 && keyNameArray.length > 0) {
			if (keyNameArray.length == 1)
				id = Long.parseLong(keyNameArray[0].trim());
			else {
				id = Long.parseLong(keyNameArray[0].trim());
				approverName = keyNameArray[1];
			}
		}
		if (id != null)
			model.addAttribute(APPROVER_NAME, approverName);

		final EgBillregister supplierBill = supplierBillService.getByBillnumber(billNumber);

		final String message = getMessageByStatus(supplierBill, approverName, nextDesign);

		model.addAttribute("message", message);

		return "supplierbill-success";
	}

	private String getMessageByStatus(final EgBillregister supplierBill, final String approverName,
			final String nextDesign) {
		String message = "";

		if (FinancialConstants.SUPPLIERBILL_CREATED_STATUS.equals(supplierBill.getStatus().getCode())) {
			if (org.apache.commons.lang.StringUtils
					.isNotBlank(supplierBill.getEgBillregistermis().getBudgetaryAppnumber())
					&& !BudgetControlType.BudgetCheckOption.NONE.toString()
							.equalsIgnoreCase(budgetControlTypeService.getConfigValue()))
				message = messageSource.getMessage("msg.supplier.bill.create.success.with.budgetappropriation",
						new String[] { supplierBill.getBillnumber(), approverName, nextDesign,
								supplierBill.getEgBillregistermis().getBudgetaryAppnumber() },
						null);
			else
				message = messageSource.getMessage("msg.supplier.bill.create.success",
						new String[] { supplierBill.getBillnumber(), approverName, nextDesign }, null);

		} else if (FinancialConstants.SUPPLIERBILL_APPROVED_STATUS.equals(supplierBill.getStatus().getCode()))
			message = messageSource.getMessage("msg.supplier.bill.approved.success",
					new String[] { supplierBill.getBillnumber() }, null);
		else if (FinancialConstants.WORKFLOW_STATE_REJECTED.equals(supplierBill.getState().getValue()))
			message = messageSource.getMessage("msg.supplier.bill.reject",
					new String[] { supplierBill.getBillnumber(), approverName, nextDesign }, null);
		else if (FinancialConstants.WORKFLOW_STATE_CANCELLED.equals(supplierBill.getState().getValue()))
			message = messageSource.getMessage("msg.supplier.bill.cancel",
					new String[] { supplierBill.getBillnumber() }, null);

		return message;
	}

	@GetMapping(value = "/downloadBillDoc")
	public void getBillDoc(final HttpServletRequest request, final HttpServletResponse response)
			throws IOException, FileNotFoundException {
		final ServletContext context = request.getServletContext();
		final String fileStoreId = request.getParameter("fileStoreId");
		String fileName = "";
		final File downloadFile = fileStoreService.fetch(fileStoreId, FinancialConstants.FILESTORE_MODULECODE);

		try (final FileInputStream inputStream = new FileInputStream(downloadFile);
				final OutputStream outStream = response.getOutputStream();) {
			EgBillregister egBillregister = supplierBillService
					.getById(Long.parseLong(request.getParameter("egBillRegisterId")));
			getBillDocuments(egBillregister);

			for (final DocumentUpload doc : egBillregister.getDocumentDetail())
				if (doc.getFileStore().getFileStoreId().equalsIgnoreCase(fileStoreId))
					fileName = doc.getFileStore().getFileName();

			// get MIME type of the file
			String mimeType = context.getMimeType(downloadFile.getAbsolutePath());
			if (mimeType == null)
				// set to binary type if MIME mapping not found
				mimeType = "application/octet-stream";

			// set content attributes for the response
			HTTPUtilities httpUtilities = ESAPI.httpUtilities();
			httpUtilities.setCurrentHTTP(request, response);
			httpUtilities.setHeader("Content-Type", mimeType);
			response.setContentLength((int) downloadFile.length());

			// set headers for the response
			final String headerKey = "Content-Disposition";
			final String headerValue = String.format("attachment; filename=\"%s\"", fileName);
			httpUtilities.setHeader(headerKey, headerValue);

			final byte[] buffer = new byte[BUFFER_SIZE];
			int bytesRead = -1;

			// write bytes read from the input stream into the output stream
			while ((bytesRead = inputStream.read(buffer)) != -1)
				outStream.write(buffer, 0, bytesRead);
		}
	}

	private EgBillregister getBillDocuments(final EgBillregister egBillregister) {
		List<DocumentUpload> documentDetailsList = supplierBillService
				.findByObjectIdAndObjectType(egBillregister.getId(), FinancialConstants.FILESTORE_MODULEOBJECT);
		egBillregister.setDocumentDetail(documentDetailsList);
		return egBillregister;
	}
}
