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
package org.egov.egf.web.controller.expensebill;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.struts2.dispatcher.multipart.MultiPartRequestWrapper;
import org.apache.struts2.dispatcher.multipart.UploadedFile;
import org.egov.egf.budget.model.BudgetControlType;
import org.egov.egf.budget.service.BudgetControlTypeService;
import org.egov.egf.commons.CommonsUtil;
import org.egov.egf.expensebill.service.ExpenseBillService;
import org.egov.egf.utils.FinancialUtils;
import org.egov.eis.web.contract.WorkflowContainer;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.filestore.service.FileStoreService;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.model.bills.DocumentUpload;
import org.egov.model.bills.EgBillregister;
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
@RequestMapping(value = "/expensebill")
@Validated
public class CreateExpenseBillController extends BaseBillController {

	private static final Logger LOGGER = Logger.getLogger(CreateExpenseBillController.class);

	private static final String INVALID_APPROVER = "invalid.approver";

	private static final String DESIGNATION = "designation";

	private static final String NET_PAYABLE_ID = "netPayableId";

	private static final String EXPENSEBILL_FORM = "expensebill-form";

	private static final String STATE_TYPE = "stateType";

	private static final String APPROVAL_POSITION = "approvalPosition";

	private static final String APPROVAL_DESIGNATION = "approvalDesignation";

	private static final int BUFFER_SIZE = 4096;

	@Autowired
	private ExpenseBillService expenseBillService;
	@Autowired
	private BudgetControlTypeService budgetControlTypeService;
	@Autowired
	private FileStoreService fileStoreService;
	@Autowired
	private FinancialUtils financialUtils;

	@Autowired
	private CommonsUtil commonsUtil;

	public CreateExpenseBillController(final AppConfigValueService appConfigValuesService) {
		super(appConfigValuesService);
	}

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		binder.setDisallowedFields("id");
	}

	@Override
	protected void setDropDownValues(final Model model) {
		super.setDropDownValues(model);
	}

	@PostMapping(value = "/newform")
	public String showNewForm(@ModelAttribute("egBillregister") final EgBillregister egBillregister, final Model model,
			HttpServletRequest request) {
		LOGGER.info("New expensebill creation request created");
		Cookie[] cookies = request.getCookies();
		if (null != cookies && cookies.length > 0) {
			for (Cookie ck : cookies) {
				LOGGER.info("Name:" + ck.getName() + " value:" + ck.getValue());
			}
		}
		setDropDownValues(model);
		model.addAttribute(STATE_TYPE, egBillregister.getClass().getSimpleName());
		prepareWorkflow(model, egBillregister, new WorkflowContainer());
		prepareValidActionListByCutOffDate(model);
		if (isBillDateDefaultValue) {
			egBillregister.setBilldate(new Date());
		}
		return EXPENSEBILL_FORM;
	}

	@PostMapping(value = "/create")
	public String create(@Valid @ModelAttribute("egBillregister") final EgBillregister egBillregister,
			final Model model, final BindingResult resultBinder, final HttpServletRequest request,
			@RequestParam @SafeHtml final String workFlowAction) throws IOException, ParseException {
		LOGGER.info("ExpenseBill is creating with user ::" + ApplicationThreadLocals.getUserId());
		if (FinancialConstants.BUTTONFORWARD.equalsIgnoreCase(workFlowAction) && !commonsUtil
				.isValidApprover(egBillregister, Long.valueOf(request.getParameter(APPROVAL_POSITION)))) {
			populateDataOnErrors(egBillregister, model, request);
			model.addAttribute("message", getLocalizedMessage(INVALID_APPROVER, null, null));
			return EXPENSEBILL_FORM;
		}
		egBillregister.setCreatedBy(ApplicationThreadLocals.getUserId());
		if (StringUtils.isBlank(egBillregister.getExpendituretype()))
			egBillregister.setExpendituretype(FinancialConstants.STANDARD_EXPENDITURETYPE_CONTINGENT);

		String[] contentType = ((MultiPartRequestWrapper) request).getContentTypes("file");
		List<DocumentUpload> list = new ArrayList<>();
		UploadedFile[] uploadedFiles = ((MultiPartRequestWrapper) request).getFiles("file");
		String[] fileName = ((MultiPartRequestWrapper) request).getFileNames("file");
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
		validateBillNumber(egBillregister, resultBinder);
		validateLedgerAndSubledger(egBillregister, resultBinder);
		validateCuttofDate(egBillregister, resultBinder);
		if (resultBinder.hasErrors()) {
			populateDataOnErrors(egBillregister, model, request);
			return EXPENSEBILL_FORM;
		} else {
			Long approvalPosition = 0l;
			String approvalComment = "";
			String approvalDesignation = "";
			if (request.getParameter("approvalComent") != null)
				approvalComment = request.getParameter("approvalComent");
			if (request.getParameter(APPROVAL_POSITION) != null && !request.getParameter(APPROVAL_POSITION).isEmpty())
				approvalPosition = Long.valueOf(request.getParameter(APPROVAL_POSITION));
			if (request.getParameter(APPROVAL_DESIGNATION) != null
					&& !request.getParameter(APPROVAL_DESIGNATION).isEmpty())
				approvalDesignation = String.valueOf(request.getParameter(APPROVAL_DESIGNATION));

			EgBillregister savedEgBillregister;
			egBillregister.setDocumentDetail(list);
			try {

				savedEgBillregister = expenseBillService.create(egBillregister, approvalPosition, approvalComment, null,
						workFlowAction, approvalDesignation);
			} catch (ValidationException e) {
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
				resultBinder.reject("", e.getErrors().get(0).getMessage());
				return EXPENSEBILL_FORM;
			}
			final String approverName = String.valueOf(request.getParameter("approverName"));

			final String approverDetails = financialUtils.getApproverDetails(workFlowAction,
					savedEgBillregister.getState(), savedEgBillregister.getId(), approvalPosition, approverName);
			return "redirect:/expensebill/success?approverDetails=" + approverDetails + "&billNumber="
					+ savedEgBillregister.getBillnumber();
		}
	}

	private void populateDataOnErrors(final EgBillregister egBillregister, final Model model,
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
	}

	@GetMapping(value = "/success")
	public String showSuccessPage(@RequestParam("billNumber") @SafeHtml final String billNumber, final Model model,
			final HttpServletRequest request) {
		final String[] keyNameArray = request.getParameter("approverDetails").split(",");
		Long id = 0L;
		String approverName = "";
		String nextDesign = "";
		if (keyNameArray.length != 0 && keyNameArray.length > 0) {
			if (keyNameArray.length == 1) {
				id = Long.parseLong(keyNameArray[0].trim());
			} else {
				id = Long.parseLong(keyNameArray[0].trim());
				approverName = keyNameArray[1];
			}
		}
		if (id != null)
			model.addAttribute("approverName", approverName);

		final EgBillregister expenseBill = expenseBillService.getByBillnumber(billNumber);

		final String message = getMessageByStatus(expenseBill, approverName, nextDesign);

		model.addAttribute("message", message);

		return "expensebill-success";
	}

	private String getMessageByStatus(final EgBillregister expenseBill, final String approverName,
			final String nextDesign) {
		String message = "";

		if (FinancialConstants.CONTINGENCYBILL_CREATED_STATUS.equals(expenseBill.getStatus().getCode())) {
			if (org.apache.commons.lang.StringUtils
					.isNotBlank(expenseBill.getEgBillregistermis().getBudgetaryAppnumber())
					&& !BudgetControlType.BudgetCheckOption.NONE.toString()
							.equalsIgnoreCase(budgetControlTypeService.getConfigValue()))
				message = getLocalizedMessage("msg.expense.bill.create.success.with.budgetappropriation",
						new String[] { expenseBill.getBillnumber(), approverName, nextDesign,
								expenseBill.getEgBillregistermis().getBudgetaryAppnumber() },
						null);
			else
				message = getLocalizedMessage("msg.expense.bill.create.success",
						new String[] { expenseBill.getBillnumber(), approverName, nextDesign }, null);

		} else if (FinancialConstants.CONTINGENCYBILL_APPROVED_STATUS.equals(expenseBill.getStatus().getCode()))
			message = getLocalizedMessage("msg.expense.bill.approved.success",
					new String[] { expenseBill.getBillnumber() }, null);
		else if (FinancialConstants.WORKFLOW_STATE_REJECTED.equals(expenseBill.getState().getValue()))
			message = getLocalizedMessage("msg.expense.bill.reject",
					new String[] { expenseBill.getBillnumber(), approverName, nextDesign }, null);
		else if (FinancialConstants.WORKFLOW_STATE_CANCELLED.equals(expenseBill.getState().getValue()))
			message = getLocalizedMessage("msg.expense.bill.cancel", new String[] { expenseBill.getBillnumber() },
					null);

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
			EgBillregister egBillregister = expenseBillService
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
		List<DocumentUpload> documentDetailsList = expenseBillService
				.findByObjectIdAndObjectType(egBillregister.getId(), FinancialConstants.FILESTORE_MODULEOBJECT);
		egBillregister.setDocumentDetail(documentDetailsList);
		return egBillregister;
	}

}
