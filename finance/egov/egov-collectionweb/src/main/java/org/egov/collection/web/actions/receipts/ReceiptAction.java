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
package org.egov.collection.web.actions.receipts;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.codehaus.jackson.map.ObjectMapper;
import org.egov.collection.constants.CollectionConstants;
import org.egov.collection.entity.AccountPayeeDetail;
import org.egov.collection.entity.ReceiptDetail;
import org.egov.collection.entity.ReceiptDetailInfo;
import org.egov.collection.entity.ReceiptHeader;
import org.egov.collection.entity.ReceiptMisc;
import org.egov.collection.entity.ReceiptVoucher;
import org.egov.collection.handler.BillInfoMarshaller;
import org.egov.collection.integration.models.BillAccountDetails.PURPOSE;
import org.egov.collection.integration.models.BillInfoImpl;
import org.egov.collection.integration.pgi.PaymentRequest;
import org.egov.collection.service.CollectionService;
import org.egov.collection.service.ReceiptHeaderService;
import org.egov.collection.utils.CollectionCommon;
import org.egov.collection.utils.CollectionsUtil;
import org.egov.collection.utils.FinancialsUtil;
import org.egov.commons.Accountdetailkey;
import org.egov.commons.Accountdetailtype;
import org.egov.commons.Bank;
import org.egov.commons.Bankaccount;
import org.egov.commons.Bankbranch;
import org.egov.commons.CChartOfAccountDetail;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.CFinancialYear;
import org.egov.commons.CFunction;
import org.egov.commons.Fund;
import org.egov.commons.Scheme;
import org.egov.commons.SubScheme;
import org.egov.commons.dao.BankBranchHibernateDAO;
import org.egov.commons.dao.BankaccountHibernateDAO;
import org.egov.commons.dao.ChartOfAccountsHibernateDAO;
import org.egov.commons.dao.EgwStatusHibernateDAO;
import org.egov.commons.dao.FunctionHibernateDAO;
import org.egov.commons.dao.FundHibernateDAO;
import org.egov.commons.dao.SchemeHibernateDAO;
import org.egov.commons.dao.SubSchemeHibernateDAO;
import org.egov.commons.entity.Source;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.entity.Department;
import org.egov.infra.admin.master.entity.Role;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.exception.ApplicationException;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.models.BillDetail;
import org.egov.infra.microservice.models.BillDetailAdditional;
import org.egov.infra.microservice.models.BusinessService;
import org.egov.infra.microservice.models.CollectionType;
import org.egov.infra.microservice.models.EmployeeInfo;
import org.egov.infra.microservice.models.Instrument;
import org.egov.infra.microservice.models.Receipt;
import org.egov.infra.microservice.models.ReceiptResponse;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.utils.NumberUtil;
import org.egov.infra.utils.StringUtils;
import org.egov.infra.web.struts.actions.BaseFormAction;
import org.egov.infra.web.struts.annotation.ValidationErrorPage;
import org.egov.infstr.models.ServiceDetails;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.egov.model.instrument.InstrumentHeader;
import org.egov.model.instrument.InstrumentType;
import org.hibernate.HibernateException;
import org.owasp.esapi.ESAPI;
import org.owasp.esapi.errors.EncodingException;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.JsonNode;

@SuppressWarnings("deprecation")
@ParentPackage("egov")
@Results({ @Result(name = BaseFormAction.NEW, location = "receipt-new.jsp"),
		@Result(name = com.opensymphony.xwork2.Action.SUCCESS, location = "receipt-success.jsp"),
		@Result(name = BaseFormAction.INDEX, location = "receipt-index.jsp"),
		@Result(name = ReceiptAction.REDIRECT, location = "receipt-redirect.jsp"),
		@Result(name = CollectionConstants.REPORT, location = "receipt-report.jsp") })
public class ReceiptAction extends BaseFormAction {
	private static final String AMOUNT = "amount";
	private static final String GLCODE = "glcode";
	private static final String BILLRECEIPT_ERROR_IMPROPERBILLDATA = "billreceipt.error.improperbilldata";
	protected static final String REDIRECT = "redirect";
	private static final String ACCOUNT_NUMBER_LIST = "accountNumberList";
	private static final String BANK_BRANCH_LIST = "bankBranchList";
	private static final Logger LOGGER = Logger.getLogger(ReceiptAction.class);
	private static final long serialVersionUID = 1L;
	private static final String CANCEL = "cancel";
	protected transient List<String> headerFields;
	protected transient List<String> mandatoryFields;
	private String reportId;
	private String message = "";
	/**
	 * A <code>String</code> representing the input xml coming from the billing
	 * system
	 */
	private String collectXML;
	private transient FinancialsUtil financialsUtil;
	/**
	 * A <code>Long</code> array of receipt header ids , which have to be displayed
	 * for view/print/cancel purposes
	 */
	private String[] selectedReceipts;
	/**
	 * An array of <code>ReceiptHeader</code> instances which have to be displayed
	 * for view/print/cancel purposes
	 */
	private ReceiptHeader[] receipts;
	private transient ReceiptHeaderService receiptHeaderService;
	private transient CollectionService collectionService;
	private transient CollectionsUtil collectionsUtil;
	private List<ReceiptHeader> receiptHeaderValues = new ArrayList<>(0);
	// Instrument information derived from UI
	private List<InstrumentHeader> instrumentProxyList;
	private int instrumentCount;
	private BigDecimal cashOrCardInstrumenttotal = BigDecimal.ZERO;
	private BigDecimal chequeInstrumenttotal = BigDecimal.ZERO;
	private BigDecimal instrumenttotal = BigDecimal.ZERO;
	private String reasonForCancellation;
	private String target = "view";
	private String paidBy;
	private ReceiptHeader receiptHeader = new ReceiptHeader();
	/**
	 * A <code>Long</code> value representing the receipt header id captured from
	 * the front end, which has to be cancelled.
	 */
	private Long oldReceiptId;
	private String fundName;
	private Boolean overrideAccountHeads = Boolean.FALSE;
	private Boolean partPaymentAllowed;
	private Boolean callbackForApportioning = Boolean.FALSE;
	private BigDecimal totalAmntToBeCollected;
	private Boolean cashAllowed = Boolean.TRUE;
	private Boolean cardAllowed = Boolean.TRUE;
	private Boolean chequeAllowed = Boolean.TRUE;
	private Boolean ddAllowed = Boolean.TRUE;
	private Boolean bankAllowed = Boolean.TRUE;
	private Boolean onlineAllowed = Boolean.TRUE;
	private Boolean isReceiptCancelEnable = Boolean.TRUE;
	/**
	 * An instance of <code>InstrumentHeader</code> representing the cash instrument
	 * details entered by the user during receipt creation
	 */
	private InstrumentHeader instrHeaderCash;
	/**
	 * An instance of <code>InstrumentHeader</code> representing the card instrument
	 * details entered by the user during receipt creation
	 */
	private InstrumentHeader instrHeaderCard;
	/**
	 * An instance of <code>InstrumentHeader</code> representing the 'bank'
	 * instrument details entered by the user during receipt creation
	 */
	private InstrumentHeader instrHeaderBank;
	/**
	 * An instance of <code>InstrumentHeader</code> representing the online
	 * instrument details entered by the user during receipt creation
	 */
	private InstrumentHeader instrHeaderOnline;
	private Date voucherDate;
	private String voucherNum;
	private transient List<ReceiptDetailInfo> subLedgerlist;
	private transient List<ReceiptDetailInfo> billCreditDetailslist;
	private transient List<ReceiptDetailInfo> billRebateDetailslist;
	private String billSource = "bill";
	private ReceiptMisc receiptMisc = new ReceiptMisc();
	private String deptId;
	private BigDecimal totalDebitAmount;
	/**
	 * A code>String</code> representing the service name
	 */
	private String serviceName;

	/**
	 * A <code>List</code> of <code>String</code> informations sent by the billing
	 * system indicating which are the modes of payment that are not allowed during
	 * receipt creation
	 */
	private List<String> collectionModesNotAllowed = new ArrayList<>(0);

	/**
	 * A <code>List</code> of <code>ReceiptPayeeDetails</code> representing the
	 * model for the action.
	 */

	private List<ReceiptDetail> receiptDetailList = new ArrayList<>(0);

	private String instrumentTypeCashOrCard;

	private transient CollectionCommon collectionCommon;

	private Long bankAccountId;

	private Integer bankBranchId;

	private String payeename = "";

	private Date manualReceiptDate;

	private String manualReceiptNumber;

	private Boolean manualReceiptNumberAndDateReq = Boolean.FALSE;

	private Boolean receiptBulkUpload = Boolean.FALSE;

	private String serviceId;
	private String serviceCategory;
	private String serviceIdText;
	private String serviceTypeId;

	@Autowired
	private transient FundHibernateDAO fundDAO;

	@Autowired
	private transient FunctionHibernateDAO functionDAO;

	@Autowired
	private transient SchemeHibernateDAO schemeDAO;

	@Autowired
	private transient BankBranchHibernateDAO bankBranchDAO;

	@Autowired
	private transient BankaccountHibernateDAO bankAccountDAO;

	@Autowired
	private transient SubSchemeHibernateDAO subSchemeDAO;

	@Autowired
	private transient ChartOfAccountsHibernateDAO chartOfAccountsDAO;

	@Autowired
	private transient EgwStatusHibernateDAO statusDAO;

	@Autowired
	private transient MicroserviceUtils microserviceUtils;

	private String functionId;

	private String instrumentType;

	private transient PaymentRequest paymentRequest;

	private String receipt;

	@Autowired
	protected transient EgovMasterDataCaching masterDataCache;

	private transient Map<String, String> serviceCategoryNames = new HashMap<>();
	private transient Map<String, Map<String, String>> serviceTypeMap = new HashMap<>();
	private String[] selectedPayments;

	@Override
	public void prepare() {
		super.prepare();
		BillInfoImpl collDetails;
		// populates model when request is from the billing system
		this.getServiceCategoryList();
		if (getCollectXML() != null && !getCollectXML().isEmpty()) {
			final String decodedCollectXML = decodeBillXML();
			try {
				collDetails = BillInfoMarshaller.toObject(decodedCollectXML);

				final Fund fund = fundDAO.fundByCode(collDetails.getFundCode());
				if (fund == null)
					addActionError(getText("billreceipt.improperbilldata.missingfund"));

				if (fund != null)
					setFundName(fund.getName());

				final Department dept = (Department) getPersistenceService().findByNamedQuery(
						CollectionConstants.QUERY_DEPARTMENT_BY_CODE, collDetails.getDepartmentCode());
				if (dept == null)
					addActionError(getText("billreceipt.improperbilldata.missingdepartment"));

				final ServiceDetails service = (ServiceDetails) getPersistenceService()
						.findByNamedQuery(CollectionConstants.QUERY_SERVICE_BY_CODE, collDetails.getServiceCode());
				setServiceName(service.getName());
				setCollectionModesNotAllowed(collDetails.getCollectionModesNotAllowed());
				setOverrideAccountHeads(collDetails.getOverrideAccountHeadsAllowed());
				setCallbackForApportioning(collDetails.getCallbackForApportioning());
				setPartPaymentAllowed(collDetails.getPartPaymentAllowed());
				totalAmntToBeCollected = BigDecimal.ZERO;

				// populate bank account list
				populateBankBranchList(true);
				receiptHeader = collectionCommon.initialiseReceiptModelWithBillInfo(collDetails, fund, dept);
				totalAmntToBeCollected = totalAmntToBeCollected.add(receiptHeader.getTotalAmountToBeCollected());
				for (final ReceiptDetail rDetails : receiptHeader.getReceiptDetails())
					rDetails.getCramountToBePaid().setScale(CollectionConstants.AMOUNT_PRECISION_DEFAULT,
							BigDecimal.ROUND_UP);
				setReceiptDetailList(new ArrayList<>(receiptHeader.getReceiptDetails()));

				if (totalAmntToBeCollected.compareTo(BigDecimal.ZERO) == -1) {
					addActionError(getText("billreceipt.totalamountlessthanzero.error"));
					LOGGER.info(getText("billreceipt.totalamountlessthanzero.error"));
				} else
					setTotalAmntToBeCollected(totalAmntToBeCollected
							.setScale(CollectionConstants.AMOUNT_PRECISION_DEFAULT, BigDecimal.ROUND_UP));
			} catch (final HibernateException e) {
				LOGGER.error(getText(BILLRECEIPT_ERROR_IMPROPERBILLDATA), e);
				addActionError(getText(BILLRECEIPT_ERROR_IMPROPERBILLDATA));
			}
		}
		addDropdownData("serviceList", Collections.emptyList());
		if (instrumentProxyList == null)
			instrumentCount = 0;
		else
			instrumentCount = instrumentProxyList.size();
	}

	private void getServiceCategoryList() {
		List<BusinessService> businessService = microserviceUtils.getBusinessService("Finance");
		for (BusinessService bs : businessService) {
			String[] splitServName = bs.getBusinessService().split(Pattern.quote("."));
			String[] splitSerCode = bs.getCode().split(Pattern.quote("."));
			if (splitServName.length == 2 && splitSerCode.length == 2) {
				if (!serviceCategoryNames.containsKey(splitSerCode[0])) {
					serviceCategoryNames.put(splitSerCode[0], splitServName[0]);
				}
				if (serviceTypeMap.containsKey(splitSerCode[0])) {
					Map<String, String> map = serviceTypeMap.get(splitSerCode[0]);
					map.put(splitSerCode[1], splitServName[1]);
					serviceTypeMap.put(splitSerCode[0], map);
				} else {
					Map<String, String> map = new HashMap<>();
					map.put(splitSerCode[1], splitServName[1]);
					serviceTypeMap.put(splitSerCode[0], map);
				}
			} else {
				serviceCategoryNames.put(splitSerCode[0], splitServName[0]);
			}
		}
	}

	private String decodeBillXML() {
		String decodedBillXml = "";
		try {
			decodedBillXml = ESAPI.encoder().decodeFromURL(getCollectXML());
		} catch (final EncodingException e) {
			LOGGER.error(getText(BILLRECEIPT_ERROR_IMPROPERBILLDATA) + e);
			throw new ApplicationRuntimeException(e.getMessage());
		}
		return decodedBillXml;
	}

	/**
	 * @param populate
	 */
	private void populateBankBranchList(final boolean populate) {
		final AjaxBankRemittanceAction ajaxBankRemittanceAction = new AjaxBankRemittanceAction();
		ajaxBankRemittanceAction.setServiceName(getServiceName());
		ajaxBankRemittanceAction.setPersistenceService(getPersistenceService());

		if (populate) {
			ajaxBankRemittanceAction.setFundName(getFundName());
			ajaxBankRemittanceAction.bankBranchList();
			addDropdownData(BANK_BRANCH_LIST, ajaxBankRemittanceAction.getBankBranchArrayList());
			addDropdownData(ACCOUNT_NUMBER_LIST, Collections.emptyList());
		} else // to load branch list and account list while returning after an
				// error
		if (getServiceName() != null && receiptMisc.getFund() != null) {
			final Fund fund = fundDAO.fundByCode(receiptMisc.getFund().getCode());
			ajaxBankRemittanceAction.setFundName(fund.getName());
			ajaxBankRemittanceAction.bankBranchList();
			addDropdownData(BANK_BRANCH_LIST, ajaxBankRemittanceAction.getBankBranchArrayList());

			// account list should be populated only if bank branch had been
			// chosen
			if (bankBranchId != null && bankBranchId != 0) {
				final Bankbranch branch = bankBranchDAO.findById(bankBranchId, false);

				ajaxBankRemittanceAction.setBranchId(branch.getId());
				ajaxBankRemittanceAction.accountList();
				addDropdownData(ACCOUNT_NUMBER_LIST, ajaxBankRemittanceAction.getBankAccountArrayList());
			} else
				addDropdownData(ACCOUNT_NUMBER_LIST, Collections.emptyList());
		} else {
			addDropdownData(BANK_BRANCH_LIST, Collections.emptyList());
			addDropdownData(ACCOUNT_NUMBER_LIST, Collections.emptyList());
		}
	}

	/**
	 * This method checks for the modes of payment allowed
	 */
	private void setCollModesNotAllowedForRemitReceipt(final String collModesNotAllowed) {
		final List<Object> modesNotAllowed = Arrays
				.asList(collModesNotAllowed == null ? Collections.emptyList() : collModesNotAllowed.split(","));

		if (modesNotAllowed != null && modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CASH))
			setCashAllowed(Boolean.FALSE);

		if (modesNotAllowed != null && modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CARD))
			setCardAllowed(Boolean.FALSE);
		if (modesNotAllowed != null && modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CHEQUE))
			setChequeAllowed(Boolean.FALSE);

		if (modesNotAllowed != null && modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_DD))
			setDdAllowed(Boolean.FALSE);

		if (modesNotAllowed != null && modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_BANK))
			setBankAllowed(Boolean.FALSE);
	}

	/**
	 * This method checks for the modes of payment allowed
	 */
	private void setCollectionModesNotAllowed() {

		final List<String> modesNotAllowed = Collections.singletonList(CollectionConstants.INSTRUMENTTYPE_BANK);

		final List<String> collModesNotAllowed = getCollectionModesNotAllowed();

		if (modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CASH)
				|| collModesNotAllowed != null && collModesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CASH))
			setCashAllowed(Boolean.FALSE);

		if (modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CARD)
				|| collModesNotAllowed != null && collModesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CARD))
			setCardAllowed(Boolean.FALSE);
		if (modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CHEQUE) || collModesNotAllowed != null
				&& collModesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_CHEQUE))
			setChequeAllowed(Boolean.FALSE);

		if (modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_DD)
				|| collModesNotAllowed != null && collModesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_DD))
			setDdAllowed(Boolean.FALSE);

		if (modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_BANK)
				|| collModesNotAllowed != null && collModesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_BANK))
			setBankAllowed(Boolean.FALSE);

		if (modesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_ONLINE) || isBillSourcemisc()
				|| collModesNotAllowed != null
						&& collModesNotAllowed.contains(CollectionConstants.INSTRUMENTTYPE_ONLINE))
			setOnlineAllowed(Boolean.FALSE);
	}

	/**
	 * To set the receiptpayee details for misc receipts
	 */
	private boolean setMiscReceiptDetails() {
		if (CollectionConstants.BLANK.equals(payeename))
			payeename = collectionsUtil.getAppConfigValue(CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
					CollectionConstants.APPCONFIG_VALUE_PAYEEFORMISCRECEIPTS);
		receiptHeader.setPartPaymentAllowed(false);
		serviceId = (serviceId != null && !serviceId.isEmpty()) ? serviceCategory + "." + serviceId : serviceCategory;
		receiptHeader.setService(serviceId);
		receiptHeader.setServiceIdText(serviceIdText);
		totalAmntToBeCollected = BigDecimal.ZERO;
		int m = 0;
		BigDecimal debitamount = BigDecimal.ZERO;
		removeEmptyRows(billCreditDetailslist);
		for (final ReceiptDetailInfo voucherDetails : billCreditDetailslist) {
			final CChartOfAccounts account = chartOfAccountsDAO
					.getCChartOfAccountsByGlCode(voucherDetails.getGlcodeDetail());
			CFunction function = null;
			if (functionId != null)
				function = functionDAO.getFunctionByCode(functionId);
			ReceiptDetail receiptDetail = new ReceiptDetail(account, function, voucherDetails.getCreditAmountDetail(),
					voucherDetails.getDebitAmountDetail(), BigDecimal.ZERO, Long.valueOf(m), null, true, receiptHeader,
					PURPOSE.OTHERS.toString());

			if (voucherDetails.getCreditAmountDetail() == null)
				receiptDetail.setCramount(BigDecimal.ZERO);
			else
				receiptDetail.setCramount(voucherDetails.getCreditAmountDetail());

			if (voucherDetails.getDebitAmountDetail() == null)
				receiptDetail.setDramount(BigDecimal.ZERO);
			else
				receiptDetail.setDramount(voucherDetails.getDebitAmountDetail());

			receiptDetail.setTaxheadCode(voucherDetails.getGlcodeIdDetail());
			receiptHeader.addReceiptDetail(receiptDetail);
			debitamount = debitamount.add(voucherDetails.getCreditAmountDetail());
			debitamount = debitamount.subtract(voucherDetails.getDebitAmountDetail());
			m++;
		}
		setTotalDebitAmount(debitamount);
		return true;
	}

	public ReceiptDetail setAccountPayeeDetails(final List<ReceiptDetailInfo> subLedgerlist,
			final ReceiptDetail receiptDetail) {
		for (final ReceiptDetailInfo subvoucherDetails : subLedgerlist)
			if (subvoucherDetails.getGlcode() != null && subvoucherDetails.getGlcode().getId() != 0
					&& subvoucherDetails.getGlcode().getId().equals(receiptDetail.getAccounthead().getId())) {

				final Accountdetailtype accdetailtype = (Accountdetailtype) getPersistenceService().findByNamedQuery(
						CollectionConstants.QUERY_ACCOUNTDETAILTYPE_BY_ID, subvoucherDetails.getDetailType().getId());
				final Accountdetailkey accdetailkey = (Accountdetailkey) getPersistenceService().findByNamedQuery(
						CollectionConstants.QUERY_ACCOUNTDETAILKEY_BY_DETAILKEY, subvoucherDetails.getDetailKeyId(),
						subvoucherDetails.getDetailType().getId());

				final AccountPayeeDetail accPayeeDetail = new AccountPayeeDetail(accdetailtype, accdetailkey,
						subvoucherDetails.getAmount(), receiptDetail);

				receiptDetail.addAccountPayeeDetail(accPayeeDetail);
			}
		return receiptDetail;
	}

	@ValidationErrorPage(value = "new")
	@Action(value = "/receipts/receipt-newform")
	public String newform() {
		populateForm();
		return NEW;
	}

	private void populateForm() {
		final String manualReceiptInfoRequired = collectionsUtil.getAppConfigValue(
				CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG, CollectionConstants.MANUALRECEIPTINFOREQUIRED);
		if (CollectionConstants.YES.equalsIgnoreCase(manualReceiptInfoRequired))
			setManualReceiptNumberAndDateReq(Boolean.TRUE);

		createMisc();

		// set collection modes allowed rule through script
		setCollectionModesNotAllowed();
	}

	/**
	 * This method is invoked when user creates a receipt.
	 *
	 * @return
	 */
	@ValidationErrorPage(value = "new")
	@Action(value = "/receipts/receipt-save")
	public String save() {
		validateMiscDetails();
		if (hasErrors()) {
			populateForm();
			return NEW;
		}
		String returnValue;
		List<InstrumentHeader> receiptInstrList = new ArrayList<>(0);
		LOGGER.info("Receipt creation process is started !!!!!!");
		final long startTimeMillis = System.currentTimeMillis();
		if ("misc".equalsIgnoreCase(billSource)) {
			createMisc();
			if (!setMiscReceiptDetails())
				returnValue = NEW;
		} else {
			if (callbackForApportioning.booleanValue() && !overrideAccountHeads.booleanValue())
				apportionBillAmount();
			if (receiptDetailList == null || receiptDetailList.isEmpty())
				throw new ApplicationRuntimeException(
						"Receipt could not be created as the apportioned receipt detail list is empty");
			else {
				BigDecimal totalCreditAmount = BigDecimal.ZERO;
				for (final ReceiptDetail receiptDetail : receiptDetailList)
					totalCreditAmount = totalCreditAmount.add(receiptDetail.getCramount());
				if (totalCreditAmount.intValue() == 0)
					throw new ApplicationRuntimeException("Apportioning Failed at the Billing System: "
							+ receiptHeader.getService() + ", for bill number: " + receiptHeader.getReferencenumber());
				else
					receiptHeader.setReceiptDetails(new HashSet<>(receiptDetailList));
			}
		}
		int noOfNewlyCreatedReceipts = 0;
		boolean setInstrument = true;

		// only newly created receipts need to be initialised with the
		// data.
		// The cancelled receipt can be excluded from this processing.
		if (receiptHeader.getStatus() == null) {
			noOfNewlyCreatedReceipts++;
			// Set created by Date as this required to generate receipt
			// number before persist
			if (manualReceiptDate == null)
				receiptHeader.setReceiptdate(new Date());
			else {
				// If the receipt has been manually created, the receipt
				// date is same as the date of manual creation.
				// set Createdby, in MySavelistner if createdBy is null
				// it set both createdBy and createdDate with
				// currentDate.
				// Thus overridding the manualReceiptDate set above
				receiptHeader.setCreatedBy(collectionsUtil.getLoggedInUser().getId());
				receiptHeader.setManualreceiptdate(manualReceiptDate);
				receiptHeader.setReceiptdate(manualReceiptDate);
				receiptHeader.setVoucherDate(manualReceiptDate);
			}
			if (StringUtils.isNotBlank(manualReceiptNumber))
				receiptHeader.setManualreceiptnumber(manualReceiptNumber);
			if (isBillSourcemisc()) {
				receiptHeader.setReceipttype(CollectionConstants.RECEIPT_TYPE_ADHOC);
				receiptHeader.setVoucherDate(voucherDate);
				receiptHeader.setReceiptdate(voucherDate);
				receiptHeader.setVoucherNum(voucherNum);
				receiptHeader.setIsReconciled(Boolean.TRUE);
				receiptHeader.setManualreceiptdate(manualReceiptDate);
				receiptHeader.setPayeeName(StringEscapeUtils.unescapeHtml(paidBy));

			} else {
				receiptHeader.setReceipttype(CollectionConstants.RECEIPT_TYPE_BILL);
				receiptHeader.setIsModifiable(Boolean.TRUE);
				receiptHeader.setIsReconciled(Boolean.FALSE);
			}
			receiptHeader.setCollectiontype(CollectionConstants.COLLECTION_TYPE_COUNTER);
			receiptHeader
					.setStatus(collectionsUtil.getStatusForModuleAndCode(CollectionConstants.MODULE_NAME_RECEIPTHEADER,
							CollectionConstants.RECEIPT_STATUS_CODE_TO_BE_SUBMITTED));
			receiptHeader.setPaidBy(StringEscapeUtils.unescapeHtml(paidBy));
			receiptHeader.setSource(Source.SYSTEM.toString());
			receiptHeader.setModOfPayment(instrumentType);

			if (setInstrument) {
				receiptInstrList = populateInstrumentDetails();
				setInstrument = false;
			}

			receiptHeader.setReceiptInstrument(new HashSet<>(receiptInstrList));

			BigDecimal debitAmount = BigDecimal.ZERO;

			for (final ReceiptDetail creditChangeReceiptDetail : receiptDetailList)
				for (final ReceiptDetail receiptDetail : receiptHeader.getReceiptDetails())
					if (creditChangeReceiptDetail.getReceiptHeader().getReferencenumber()
							.equals(receiptDetail.getReceiptHeader().getReferencenumber())
							&& receiptDetail.getOrdernumber().equals(creditChangeReceiptDetail.getOrdernumber())) {

						receiptDetail.setCramount(creditChangeReceiptDetail.getCramount());
						receiptDetail.setDramount(creditChangeReceiptDetail.getDramount());
						// calculate sum of creditamounts as a debit
						// value to create a
						// debit account head and add to receipt details
						debitAmount = debitAmount.add(creditChangeReceiptDetail.getCramount());
						debitAmount = debitAmount.subtract(creditChangeReceiptDetail.getDramount());
					}

			if (chequeInstrumenttotal != null && chequeInstrumenttotal.compareTo(BigDecimal.ZERO) != 0)
				receiptHeader.setTotalAmount(chequeInstrumenttotal);

			if (cashOrCardInstrumenttotal != null && cashOrCardInstrumenttotal.compareTo(BigDecimal.ZERO) != 0)
				receiptHeader.setTotalAmount(cashOrCardInstrumenttotal);
		}

		LOGGER.info("Call back for apportioning is completed");
		// billing system
		ReceiptResponse receiptResponse = receiptHeaderService.populateAndPersistReceipts(receiptHeader,
				receiptInstrList);

		message = "Receipt created with receipt number: "
				+ receiptResponse.getReceipts().get(0).getBill().get(0).getBillDetails().get(0).getReceiptNumber();
		// populate all receipt header ids except the cancelled receipt
		// (in effect the newly created receipts)
		selectedReceipts = new String[noOfNewlyCreatedReceipts];
		int i = 0;
		if (receiptHeader.getId() != null && !receiptHeader.getId().equals(oldReceiptId)) {
			selectedReceipts[i] = receiptHeader.getReceiptnumber();
			i++;
		}

		final long elapsedTimeMillis = System.currentTimeMillis() - startTimeMillis;
		LOGGER.info("$$$$$$ Receipt Persisted with Receipt Number: " + receiptHeader.getReceiptnumber()
				+ (receiptHeader.getConsumerCode() != null ? " and consumer code: " + receiptHeader.getConsumerCode()
						: "")
				+ "; Time taken(ms) = " + elapsedTimeMillis);
		returnValue = SUCCESS;
		return returnValue;
	}

	private void validateMiscDetails() {
		if (StringUtils.isEmpty(serviceCategory))
			addActionError(getText("error.select.service.category"));
		if ((instrHeaderCash.getInstrumentAmount() != null
				&& instrHeaderCash.getInstrumentAmount().compareTo(BigDecimal.ZERO) < 0)
				|| (instrHeaderCard.getInstrumentAmount() != null
						&& instrHeaderCard.getInstrumentAmount().compareTo(BigDecimal.ZERO) < 0)
				|| (instrHeaderBank.getInstrumentAmount() != null
						&& instrHeaderBank.getInstrumentAmount().compareTo(BigDecimal.ZERO) < 0)
				|| (instrHeaderOnline.getInstrumentAmount() != null
						&& instrHeaderOnline.getInstrumentAmount().compareTo(BigDecimal.ZERO) < 0)) {
			addActionError(getText("billreceipt.invalidcreditamount.errormessage"));
		}
		if (StringUtils.isEmpty(paidBy)) {
			addActionError(getText("billreceipt.missingpayeename.errormessage"));
		}
	}

	public void createMisc() {
		headerFields = new ArrayList<>(0);
		mandatoryFields = new ArrayList<>(0);
		getHeaderMandateFields();
		setupDropdownDataExcluding();

		if (headerFields.contains(CollectionConstants.DEPARTMENT))
			addDropdownData("departmentList", masterDataCache.get("egi-department"));
		if (headerFields.contains(CollectionConstants.FUNCTIONARY))
			addDropdownData("functionaryList",
					persistenceService.findAllByNamedQuery(CollectionConstants.QUERY_ALL_FUNCTIONARY));
		if (headerFields.contains(CollectionConstants.FUND))
			addDropdownData("fundList", collectionsUtil.getAllFunds());
		if (headerFields.contains(CollectionConstants.FUNCTION))
			addDropdownData("functionList", functionDAO.getAllActiveFunctions());
		if (headerFields.contains(CollectionConstants.FIELD))
			addDropdownData("fieldList", persistenceService.findAllByNamedQuery(CollectionConstants.QUERY_ALL_FIELD));
		if (headerFields.contains(CollectionConstants.FUNDSOURCE))
			addDropdownData("fundsourceList",
					persistenceService.findAllByNamedQuery(CollectionConstants.QUERY_ALL_FUNDSOURCE));
		if (headerFields.contains(CollectionConstants.SCHEME))
			if (receiptMisc.getFund() == null || receiptMisc.getFund().getId() == null)
				addDropdownData("schemeList", Collections.emptyList());
			else
				addDropdownData("schemeList", persistenceService.findAllByNamedQuery(
						CollectionConstants.QUERY_SCHEME_BY_FUNDID, receiptMisc.getFund().getId()));
		if (headerFields.contains(CollectionConstants.SUBSCHEME)) {
			if (receiptMisc.getScheme() == null || receiptMisc.getScheme().getId() == null)
				addDropdownData("subschemeList", Collections.emptyList());
			else
				addDropdownData("subschemeList", persistenceService.findAllByNamedQuery(
						CollectionConstants.QUERY_SUBSCHEME_BY_SCHEMEID, receiptMisc.getScheme().getId()));
		}

		if (billCreditDetailslist == null) {
			billCreditDetailslist = new ArrayList<>(0);
			billRebateDetailslist = new ArrayList<>(0);
			subLedgerlist = new ArrayList<>(0);
			billRebateDetailslist.add(new ReceiptDetailInfo());
			billCreditDetailslist.add(new ReceiptDetailInfo());
			subLedgerlist.add(new ReceiptDetailInfo());
		}
		billSource = "misc";
		receiptHeader.setPartPaymentAllowed(false);
		setHeaderFields(headerFields);
		setMandatoryFields(mandatoryFields);
		populateBankBranchList(false);
	}

	public boolean isBillSourcemisc() {
		boolean flag = false;
		if ("misc".equalsIgnoreCase(getBillSource()))
			flag = true;
		return flag;
	}

	public boolean isFieldMandatory(final String field) {
		return mandatoryFields.contains(field);
	}

	public boolean shouldShowHeaderField(final String field) {
		return headerFields.contains(field);
	}

	protected void getHeaderMandateFields() {
		final List<AppConfigValues> appConfigValuesList = collectionsUtil.getAppConfigValues(
				CollectionConstants.MISMandatoryAttributesModule, CollectionConstants.MISMandatoryAttributesKey);

		for (final AppConfigValues appConfigVal : appConfigValuesList) {
			final String value = appConfigVal.getValue();
			final String header = value.substring(0, value.indexOf('|'));
			headerFields.add(header);
			final String mandate = value.substring(value.indexOf('|') + 1);
			if ("M".equalsIgnoreCase(mandate))
				mandatoryFields.add(header);
		}
		mandatoryFields.add("voucherdate");
	}

	private List<InstrumentHeader> populateInstrumentDetails() {
		List<InstrumentHeader> instrumentHeaderList = new ArrayList<>(0);

		if (CollectionConstants.INSTRUMENTTYPE_CASH.equals(instrumentTypeCashOrCard)) {
			instrHeaderCash
					.setInstrumentType(financialsUtil.getInstrumentTypeByType(CollectionConstants.INSTRUMENTTYPE_CASH));

			instrHeaderCash.setIsPayCheque(CollectionConstants.ZERO_INT);
			// the cash amount is set into the object through binding
			// this total is needed for creating debit account head

			cashOrCardInstrumenttotal = cashOrCardInstrumenttotal.add(instrHeaderCash.getInstrumentAmount());

			instrumentHeaderList.add(instrHeaderCash);
		}
		if (CollectionConstants.INSTRUMENTTYPE_CARD.equals(instrumentTypeCashOrCard)) {
			instrHeaderCard
					.setInstrumentType(financialsUtil.getInstrumentTypeByType(CollectionConstants.INSTRUMENTTYPE_CARD));
			if (instrHeaderCard.getTransactionDate() == null)
				instrHeaderCard.setTransactionDate(new Date());
			instrHeaderCard.setIsPayCheque(CollectionConstants.ZERO_INT);

			// the instrumentNumber, transactionNumber, instrumentAmount are
			// set into the object directly through binding
			cashOrCardInstrumenttotal = cashOrCardInstrumenttotal.add(instrHeaderCard.getInstrumentAmount());

			instrumentHeaderList.add(instrHeaderCard);
		}

		if (CollectionConstants.INSTRUMENTTYPE_BANK.equals(instrumentTypeCashOrCard)) {
			instrHeaderBank
					.setInstrumentType(financialsUtil.getInstrumentTypeByType(CollectionConstants.INSTRUMENTTYPE_BANK));
			if (instrHeaderBank.getTransactionDate() == null)
				instrHeaderBank.setTransactionDate(new Date());
			instrHeaderBank.setIsPayCheque(CollectionConstants.ZERO_INT);

			final Bankaccount account = bankAccountDAO.findById(bankAccountId, false);

			instrHeaderBank.setBankAccountId(account);
			instrHeaderBank.setBankBranchName(account.getBankbranch().getBranchname());

			// the instrumentNumber, transactionNumber, instrumentAmount are
			// set into the object directly through binding
			cashOrCardInstrumenttotal = cashOrCardInstrumenttotal.add(instrHeaderBank.getInstrumentAmount());

			instrumentHeaderList.add(instrHeaderBank);
		}
		if (CollectionConstants.INSTRUMENTTYPE_ONLINE.equals(instrumentTypeCashOrCard)) {
			instrHeaderOnline.setInstrumentType(
					financialsUtil.getInstrumentTypeByType(CollectionConstants.INSTRUMENTTYPE_ONLINE));

			instrHeaderOnline.setIsPayCheque(CollectionConstants.ZERO_INT);
			// the cash amount is set into the object through binding
			// this total is needed for creating debit account head

			cashOrCardInstrumenttotal = cashOrCardInstrumenttotal.add(instrHeaderOnline.getInstrumentAmount());

			instrumentHeaderList.add(instrHeaderOnline);
		}

		// cheque/DD types
		if (instrumentProxyList != null && !CollectionConstants.INSTRUMENTTYPE_CASH.equals(instrumentTypeCashOrCard)
				&& !CollectionConstants.INSTRUMENTTYPE_CARD.equals(instrumentTypeCashOrCard)
				&& !CollectionConstants.INSTRUMENTTYPE_BANK.equals(instrumentTypeCashOrCard))
			if (getInstrumentType().equals(CollectionConstants.INSTRUMENTTYPE_CHEQUE)
					|| getInstrumentType().equals(CollectionConstants.INSTRUMENTTYPE_DD))
				populateInstrumentHeaderForChequeDD(instrumentHeaderList, instrumentProxyList);
		return instrumentHeaderList;
	}

	/**
	 * This instrument creates instrument header instances for the receipt, when the
	 * instrument type is Cheque or DD. The created <code>InstrumentHeader</code>
	 * instance is persisted
	 *
	 * @param k an int value representing the index of the instrument type as chosen
	 *          from the front end
	 * @return an <code>InstrumentHeader</code> instance populated with the
	 *         instrument details
	 */
	private List<InstrumentHeader> populateInstrumentHeaderForChequeDD(
			final List<InstrumentHeader> instrumentHeaderList, final List<InstrumentHeader> instrumentProxyList) {

		for (final InstrumentHeader instrumentHeader : instrumentProxyList) {
			InstrumentType instType = new InstrumentType();
			if (getInstrumentType().equals(CollectionConstants.INSTRUMENTTYPE_CHEQUE)) {
				instType.setType(CollectionConstants.INSTRUMENTTYPE_CHEQUE);
				instrumentHeader.setInstrumentType(instType);
			} else if (getInstrumentType().equals(CollectionConstants.INSTRUMENTTYPE_DD)) {
				instType.setType(CollectionConstants.INSTRUMENTTYPE_DD);
				instrumentHeader.setInstrumentType(instType);
			}
			if (instrumentHeader.getBankId() != null && instrumentHeader.getBankId().getCode() == null) {
				addActionError("Bank is not exist");
				throw new ApplicationRuntimeException("Bank is not exist");
			}
			chequeInstrumenttotal = chequeInstrumenttotal.add(instrumentHeader.getInstrumentAmount());
			instrumentHeader.setIsPayCheque(CollectionConstants.ZERO_INT);
			instrumentHeaderList.add(instrumentHeader);
		}
		return instrumentHeaderList;
	}

	/**
	 * This method create a new receipt header object with details contained in
	 * given receipt header object.
	 * 
	 * @param oldReceiptHeader the instance of <code>ReceiptHeader</code> whose data
	 *                         is to be copied
	 * @throws ApplicationException
	 */
	private void populateReceiptModelWithExistingReceiptInfo(final ReceiptHeader oldReceiptHeader)
			throws ApplicationException {
		totalAmntToBeCollected = BigDecimal.ZERO;

		receiptHeader = new ReceiptHeader(oldReceiptHeader.getReferencenumber(), oldReceiptHeader.getReferencedate(),
				oldReceiptHeader.getConsumerCode(), oldReceiptHeader.getReferenceDesc(),
				oldReceiptHeader.getTotalAmount(), oldReceiptHeader.getMinimumAmount(),
				oldReceiptHeader.getPartPaymentAllowed(), oldReceiptHeader.getOverrideAccountHeads(),
				oldReceiptHeader.getCallbackForApportioning(), oldReceiptHeader.getDisplayMsg(),
				oldReceiptHeader.getService(), oldReceiptHeader.getCollModesNotAllwd(), oldReceiptHeader.getPayeeName(),
				oldReceiptHeader.getPayeeAddress(), oldReceiptHeader.getPayeeEmail(),
				oldReceiptHeader.getConsumerType());
		if (oldReceiptHeader.getCollModesNotAllwd() != null)
			setCollectionModesNotAllowed(Arrays.asList(oldReceiptHeader.getCollModesNotAllwd().split(",")));
		setOverrideAccountHeads(oldReceiptHeader.getOverrideAccountHeads());
		setPartPaymentAllowed(oldReceiptHeader.getPartPaymentAllowed());

		receiptHeader.setReceiptMisc(new ReceiptMisc(oldReceiptHeader.getReceiptMisc().getBoundary(),
				oldReceiptHeader.getReceiptMisc().getFund(), oldReceiptHeader.getReceiptMisc().getIdFunctionary(),
				oldReceiptHeader.getReceiptMisc().getFundsource(), oldReceiptHeader.getReceiptMisc().getDepartment(),
				receiptHeader, oldReceiptHeader.getReceiptMisc().getScheme(),
				oldReceiptHeader.getReceiptMisc().getSubscheme(), null));
		receiptHeader.setLocation(oldReceiptHeader.getLocation());
		List<CChartOfAccounts> bankCOAList = chartOfAccountsDAO.getBankChartofAccountCodeList();
		for (final ReceiptDetail oldDetail : oldReceiptHeader.getReceiptDetails())
			// debit account heads for revenue accounts should not be considered
			if (oldDetail.getOrdernumber() != null && !FinancialsUtil.isRevenueAccountHead(oldDetail.getAccounthead(),
					bankCOAList, persistenceService)) {
				final ReceiptDetail receiptDetail = new ReceiptDetail(oldDetail.getAccounthead(),
						oldDetail.getFunction(), oldDetail.getCramount(), oldDetail.getDramount(),
						oldDetail.getCramount(), oldDetail.getOrdernumber(), oldDetail.getDescription(),
						oldDetail.getIsActualDemand(), receiptHeader, oldDetail.getPurpose(), oldDetail.getGroupId());
				receiptDetail.setCramountToBePaid(oldDetail.getCramountToBePaid());
				receiptDetail.setCramount(oldDetail.getCramount());
				if (oldDetail.getAccountPayeeDetails() != null)
					for (final AccountPayeeDetail oldAccountPayeeDetail : oldDetail.getAccountPayeeDetails()) {
						final AccountPayeeDetail accountPayeeDetail = new AccountPayeeDetail(
								oldAccountPayeeDetail.getAccountDetailType(),
								oldAccountPayeeDetail.getAccountDetailKey(), oldAccountPayeeDetail.getAmount(),
								receiptDetail);
						receiptDetail.addAccountPayeeDetail(accountPayeeDetail);
					}

				if (oldDetail.getIsActualDemand().booleanValue())
					totalAmntToBeCollected = totalAmntToBeCollected.add(oldDetail.getCramountToBePaid())
							.subtract(oldDetail.getDramount())
							.setScale(CollectionConstants.AMOUNT_PRECISION_DEFAULT, BigDecimal.ROUND_UP);
				setTotalAmntToBeCollected(totalAmntToBeCollected);
				receiptHeader.addReceiptDetail(receiptDetail);
			}

		if (oldReceiptHeader.getReceipttype() == CollectionConstants.RECEIPT_TYPE_ADHOC) {
			loadReceiptDetails(receiptHeader);
			createMisc();
			if (oldReceiptHeader.getVoucherNum() != null)
				setVoucherNum(voucherNum);
		}
		setReceiptDetailList(new ArrayList<>(receiptHeader.getReceiptDetails()));
		setCollModesNotAllowedForRemitReceipt(oldReceiptHeader.getCollModesNotAllwd());
	}

	private void loadReceiptDetails(final ReceiptHeader receiptHeader) throws ApplicationException {
		setReceiptMisc(receiptHeader.getReceiptMisc());
		setBillCreditDetailslist(
				collectionCommon.setReceiptDetailsList(receiptHeader, CollectionConstants.COLLECTIONSAMOUNTTPE_CREDIT));
		setBillRebateDetailslist(
				collectionCommon.setReceiptDetailsList(receiptHeader, CollectionConstants.COLLECTIONSAMOUNTTPE_DEBIT));
		setSubLedgerlist(collectionCommon.setAccountPayeeList(receiptHeader));
	}

	/**
	 * Same method handles both view and print modes. If print receipts flag is
	 * passed as true, the PDF receipt will be generated in such a way that it will
	 * show the print dialog box whenever it is opened.
	 *
	 * @param printReceipts Flag indicating whether the receipts are to be printed
	 * @return Result page ("view")
	 */
	private String viewReceipts(final boolean printReceipts) {
		if (selectedReceipts == null || selectedReceipts.length == 0)
			throw new ApplicationRuntimeException("No receipts selected to view!");
		if (StringUtils.isEmpty(serviceTypeId) || serviceTypeId.equals("-1"))
			throw new ApplicationRuntimeException("Service Type is missing");

		receipts = new ReceiptHeader[selectedReceipts.length];

		List<Receipt> receiptlist = this.microserviceUtils.searchReciepts(null, null, null, getServiceTypeId(),
				Arrays.asList(selectedReceipts));

		receiptlist.stream().forEach(receipt -> {

			receipt.getBill().forEach(bill -> {
				BigDecimal totalAmountPaid = BigDecimal.ZERO;
                		for (BillDetail billDetail : bill.getBillDetails()) {
					ReceiptHeader header = new ReceiptHeader();
					receiptHeader.setReceiptnumber(billDetail.getReceiptNumber());
					receiptHeader.setReceiptdate(new Date(billDetail.getReceiptDate()));
					String businessServiceCode = billDetail.getBusinessService();
					receiptHeader.setService(microserviceUtils.getBusinessServiceNameByCode(businessServiceCode));
					receiptHeader.setReferencenumber(billDetail.getBillNumber());
					receiptHeader.setReferenceDesc(billDetail.getBillDescription());
					receiptHeader.setPaidBy(bill.getPaidBy());
					receiptHeader.setPayeeName(bill.getPayerName());
					receiptHeader.setPayeeAddress(bill.getPayerAddress());
					totalAmountPaid = totalAmountPaid.add(billDetail.getAmountPaid());
                    			receiptHeader.setTotalAmount(totalAmountPaid);
					receiptHeader.setCurretnStatus(billDetail.getStatus());
					receiptHeader.setCurrentreceipttype(billDetail.getReceiptType());
					receiptHeader.setManualreceiptnumber(billDetail.getManualReceiptNumber());
					receiptHeader.setModOfPayment(receipt.getInstrument().getInstrumentType().getName());
					receiptHeader.setConsumerCode(billDetail.getConsumerCode());
					receiptHeader.setManualreceiptnumber(billDetail.getManualReceiptNumber());
					if (billDetail.getManualReceiptDate() != 0)
						receiptHeader.setManualreceiptdate(new Date(billDetail.getManualReceiptDate()));
					JsonNode jsonNode = billDetail.getAdditionalDetails();
					BillDetailAdditional additional = null;
					try {
						if (null != jsonNode)
							additional = new ObjectMapper().readValue(jsonNode.toString(), BillDetailAdditional.class);
					} catch (IOException e) {
						LOG.error("Error occurred while processing Json Node", e);
					}

					if (null != additional) {
						ReceiptMisc rcptMisc = new ReceiptMisc();
						if (null != additional.getScheme()) {
							Scheme scheme = this.schemeDAO.getSchemeByCode(additional.getScheme());
							rcptMisc.setScheme(scheme);
						}

						if (null != additional.getSubScheme()) {
							SubScheme subScheme = this.subSchemeDAO.getSubSchemeByCode(additional.getSubScheme());
							rcptMisc.setSubscheme(subScheme);
						}

						receiptHeader.setReceiptMisc(rcptMisc);
						if (null != additional.getNarration())
							receiptHeader.setReferenceDesc(additional.getNarration());
						if (null != additional.getPayeeaddress())
							receiptHeader.setPayeeAddress(additional.getPayeeaddress());
					}

					if (ApplicationThreadLocals.getCollectionVersion().toUpperCase().equalsIgnoreCase("V1")) {
						if (billDetail.getCollectionType().equals(CollectionType.COUNTER))
							receiptHeader.setCollectiontype(CollectionConstants.COLLECTION_TYPE_COUNTER);
						else if (billDetail.getCollectionType().equals(CollectionType.FIELD))
							receiptHeader.setCollectiontype(CollectionConstants.COLLECTION_TYPE_FIELDCOLLECTION);
						else if (billDetail.getCollectionType().equals(CollectionType.ONLINE))
							receiptHeader.setCollectiontype(CollectionConstants.COLLECTION_TYPE_ONLINECOLLECTION);
					}

					if (billDetail.getReceiptType().equalsIgnoreCase(CollectionConstants.RECEIPT_M_TYPE_MISCELLANEOUS)
							|| billDetail.getReceiptType().equalsIgnoreCase(CollectionConstants.RECEIPT_M_TYPE_ADHOC))
						receiptHeader.setReceipttype(CollectionConstants.RECEIPT_TYPE_ADHOC);
					else if (billDetail.getReceiptType().equalsIgnoreCase(CollectionConstants.RECEIPT_M_TYPE_BILLBASED))
						receiptHeader.setReceipttype(CollectionConstants.RECEIPT_TYPE_BILL);

					Set<ReceiptDetail> receiptdetailslist = new HashSet<>();
					billDetail.getBillAccountDetails().forEach(billAccountDetail -> {
						ReceiptDetail receiptDetail = new ReceiptDetail();
						receiptDetail.setAccounthead(new CChartOfAccounts());

						switch (ApplicationThreadLocals.getCollectionVersion().toUpperCase()) {
						case "V2":
						case "VERSION2":
							receiptDetail.setDramount(
									billAccountDetail.getAmount().compareTo(BigDecimal.ZERO) > 0 ? BigDecimal.ZERO
											: billAccountDetail.getAmount());
							receiptDetail.setCramount(
									billAccountDetail.getAmount().compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO
											: billAccountDetail.getAmount());
							break;

						default:
							receiptDetail.setDramount(billAccountDetail.getDebitAmount());
							receiptDetail.setCramount(billAccountDetail.getCreditAmount());
							break;
						}
						receiptDetail.setOrdernumber(billAccountDetail.getOrder().longValue());
						receiptDetail.setPurpose(
								billAccountDetail.getPurpose() != null ? billAccountDetail.getPurpose().toString()
										: "");
						receiptdetailslist.add(receiptDetail);
					});
					receiptHeader.setReceiptDetails(receiptdetailslist);
					receiptHeader.setReceiptHeader(header);
					InstrumentHeader instrumentHeader = new InstrumentHeader();

					Instrument instrument = receipt.getInstrument();
					instrumentHeader.setInstrumentNumber(
							instrument.getInstrumentNumber() != null ? instrument.getInstrumentNumber()
									: instrument.getTransactionNumber());
					instrumentHeader.setInstrumentDate(
							new Date(instrument.getTransactionDateInput() != null ? instrument.getTransactionDateInput()
									: instrument.getInstrumentDate()));

					InstrumentType instrType = new InstrumentType();
					instrType.setType(instrument.getInstrumentType().getName().toLowerCase());
					instrumentHeader.setInstrumentType(instrType);

					instrumentHeader.setInstrumentAmount(instrument.getAmount());

					if (instrType.getType().equalsIgnoreCase(CollectionConstants.INSTRUMENTTYPE_CHEQUE)
							|| instrType.getType().equalsIgnoreCase(CollectionConstants.INSTRUMENTTYPE_DD)) {
						Bankaccount account = new Bankaccount();
						if (null != instrument.getBankAccount())
							account.setAccountnumber(instrument.getBankAccount().getAccountNumber());
						// account.setAccountt
						instrumentHeader.setBankAccountId(account);

						if (instrument.getBank() != null) {
							// Todo : Have to handle the Bank Details
							Bank bank = new Bank();
							bank.setName(instrument.getBank().getName());
							instrumentHeader.setBankId(bank);
						}
						instrumentHeader.setIfscCode(instrument.getIfscCode());
						instrumentHeader.setBankBranchName(instrument.getBranchName());
					}

					receiptHeader.addInstrument(instrumentHeader);
					EmployeeInfo empInfo = this.microserviceUtils
							.getEmployeeById(Long.parseLong(receipt.getAuditDetails().getCreatedBy()));
					if (null != empInfo && empInfo.getUser().getUserName() != null)
						receiptHeader.setCreatedUser(empInfo.getUser().getName());
					receipts[0] = receiptHeader;

				};
			});

		});

		try {
			reportId = collectionCommon.generateReport(receipts, printReceipts);
		} catch (final ApplicationRuntimeException e) {
			final String errMsg = "Error during report generation!";
			LOGGER.error(errMsg, e);
			throw new ApplicationRuntimeException(errMsg, e);
		}

		return CollectionConstants.REPORT;
	}

	@Action(value = "/receipts/receipt-viewReceipts")
	public String viewReceipts() {
		return viewReceipts(false);
	}

	@Action(value = "/receipts/receipt-printReceipts")
	public String printReceipts() {
		return viewReceipts(true);
	}

	@ValidationErrorPage(value = "error")
	@Action(value = "/receipts/receipt-cancel")
	public String cancel() {
		final List<AppConfigValues> appConfigValuesList = collectionsUtil.getAppConfigValues(
				CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
				CollectionConstants.APPCONFIG_VALUE_COLLECTIONCREATORRECEIPTCANCELROLE);
		String value;
		Boolean isRoleToCheckCreator = Boolean.FALSE;
		User user = collectionsUtil.getLoggedInUser();
		for (final AppConfigValues appConfigVal : appConfigValuesList) {
			value = appConfigVal.getValue();
			for (final Role role : user.getRoles())
				if (role != null && role.getName().equals(value))
					isRoleToCheckCreator = true;
		}

		if (getSelectedReceipts() != null && getSelectedReceipts().length > 0) {
			receipts = new ReceiptHeader[selectedReceipts.length];
			for (int i = 0; i < selectedReceipts.length; i++) {
				receipts[i] = (ReceiptHeader) getPersistenceService().findByNamedQuery("getReceiptHeaderById",
						Long.valueOf(selectedReceipts[i]));
				if (isRoleToCheckCreator.booleanValue())
					isReceiptCancelEnable = (receipts[i].getCreatedBy().compareTo(user.getId()) == 0);
			}
		}
		return CANCEL;
	}

	/**
	 * This method is invoked when receipt is cancelled
	 *
	 * @return
	 * @throws ApplicationException
	 */
	@ValidationErrorPage(value = "error")
	@Action(value = "/receipts/receipt-saveOnCancel")
	public String saveOnCancel() throws ApplicationException {
		boolean isInstrumentDeposited = false;

		final ReceiptHeader receiptHeaderToBeCancelled = receiptHeaderService.findById(oldReceiptId, false);
		if (receiptHeaderToBeCancelled.getReceipttype() == CollectionConstants.RECEIPT_TYPE_BILL)
			receiptHeaderService.validateReceiptCancellation(receiptHeaderToBeCancelled.getReceiptnumber(),
					receiptHeaderToBeCancelled.getService(), receiptHeaderToBeCancelled.getConsumerCode());
		LOGGER.info("Receipt Header to be Cancelled : " + receiptHeaderToBeCancelled.getReceiptnumber());

		for (final InstrumentHeader instrumentHeader : receiptHeaderToBeCancelled.getReceiptInstrument())
			if (instrumentHeader.getInstrumentType().getType().equals(CollectionConstants.INSTRUMENTTYPE_CASH)) {
				if (instrumentHeader.getStatusId().getDescription()
						.equals(CollectionConstants.INSTRUMENT_RECONCILED_STATUS)) {
					isInstrumentDeposited = true;
					break;
				}
			} else if (instrumentHeader.getStatusId().getDescription()
					.equals(CollectionConstants.INSTRUMENT_DEPOSITED_STATUS)) {
				isInstrumentDeposited = true;
				break;
			}

		if (isInstrumentDeposited) {
			// if instrument has been deposited create a new receipt in place of
			// the cancelled

			populateReceiptModelWithExistingReceiptInfo(receiptHeaderToBeCancelled);
			setFundName(receiptHeaderToBeCancelled.getReceiptMisc().getFund().getName());
			populateBankBranchList(true);
			return NEW;
		} else {
			// if instrument has not been deposited, cancel the old instrument,
			// reverse the
			// voucher and persist
			receiptHeaderToBeCancelled.setStatus(statusDAO.getStatusByModuleAndCode(
					CollectionConstants.MODULE_NAME_RECEIPTHEADER, CollectionConstants.RECEIPT_STATUS_CODE_CANCELLED));
			receiptHeaderToBeCancelled.setIsReconciled(false);
			receiptHeaderToBeCancelled.setReasonForCancellation(reasonForCancellation);

			for (final InstrumentHeader instrumentHeader : receiptHeaderToBeCancelled.getReceiptInstrument())
				instrumentHeader.setStatusId(
						statusDAO.getStatusByModuleAndCode(CollectionConstants.MODULE_NAME_INSTRUMENTHEADER,
								CollectionConstants.INSTRUMENTHEADER_STATUS_CANCELLED));
			for (final ReceiptVoucher receiptVoucher : receiptHeaderToBeCancelled.getReceiptVoucher())
				receiptHeaderService.createReversalVoucher(receiptVoucher);

			receiptHeaderService.persist(receiptHeaderToBeCancelled);

			receiptHeaderValues.clear();
			receiptHeaderValues.add(receiptHeaderToBeCancelled);
			LOGGER.info("Receipt Cancelled with Receipt Number(saveOnCancel): "
					+ receiptHeaderToBeCancelled.getReceiptnumber() + "; Consumer Code: "
					+ receiptHeaderToBeCancelled.getConsumerCode());
		}
		target = CANCEL;
		return INDEX;
	}

	public String amountInWords(final BigDecimal amount) {
		return NumberUtil.amountInWords(amount);
	}

	/**
	 * @return the receiptHeaderValues
	 */
	public List<ReceiptHeader> getReceiptHeaderValues() {
		return receiptHeaderValues;
	}

	/**
	 * @param receiptHeaderValues the receiptHeaderValues to set
	 */
	public void setReceiptHeaderValues(final List<ReceiptHeader> receiptHeaderValues) {
		this.receiptHeaderValues = receiptHeaderValues;
	}

	public String getReasonForCancellation() {
		return reasonForCancellation;
	}

	public void setReasonForCancellation(final String reasonForCancellation) {
		this.reasonForCancellation = reasonForCancellation;
	}

	/**
	 * @return the target
	 */
	public String getTarget() {
		return target;
	}

	/**
	 * @return the paidBy
	 */
	public String getPaidBy() {
		return StringUtils.escapeJavaScript(paidBy);
	}

	/**
	 * @param paidBy the paidBy to set
	 */
	public void setPaidBy(final String paidBy) {
		this.paidBy = paidBy;
	}

	/**
	 * @return the oldReceiptId
	 */
	public Long getOldReceiptId() {
		return oldReceiptId;
	}

	/**
	 * @param oldReceiptId the oldReceiptId to set
	 */
	public void setOldReceiptId(final Long oldReceiptId) {
		this.oldReceiptId = oldReceiptId;
	}

	public Long getBankAccountId() {
		return bankAccountId;
	}

	public void setBankAccountId(final Long bankAccountId) {
		this.bankAccountId = bankAccountId;
	}

	public BigDecimal getTotalAmntToBeCollected() {
		return totalAmntToBeCollected;
	}

	public void setTotalAmntToBeCollected(final BigDecimal totalAmntToBeCollected) {
		this.totalAmntToBeCollected = totalAmntToBeCollected;
	}

	public InstrumentHeader getInstrHeaderCash() {
		return instrHeaderCash;
	}

	public void setInstrHeaderCash(final InstrumentHeader instrHeaderCash) {
		this.instrHeaderCash = instrHeaderCash;
	}

	public InstrumentHeader getInstrHeaderCard() {
		return instrHeaderCard;
	}

	public void setInstrHeaderCard(final InstrumentHeader instrHeaderCard) {
		this.instrHeaderCard = instrHeaderCard;
	}

	public InstrumentHeader getInstrHeaderBank() {
		return instrHeaderBank;
	}

	public void setInstrHeaderBank(final InstrumentHeader instrHeaderBank) {
		this.instrHeaderBank = instrHeaderBank;
	}

	public InstrumentHeader getInstrHeaderOnline() {
		return instrHeaderOnline;
	}

	public void setInstrHeaderOnline(final InstrumentHeader instrHeaderOnline) {
		this.instrHeaderOnline = instrHeaderOnline;
	}

	public List<String> getCollectionModesNotAllowed() {
		return collectionModesNotAllowed;
	}

	public void setCollectionModesNotAllowed(final List<String> collectionModesNotAllowed) {
		this.collectionModesNotAllowed = collectionModesNotAllowed;
	}

	public List<ReceiptDetail> getReceiptDetailList() {
		return receiptDetailList;
	}

	public void setReceiptDetailList(final List<ReceiptDetail> receiptDetailList) {
		this.receiptDetailList = receiptDetailList;
	}

	public String getInstrumentTypeCashOrCard() {
		return instrumentTypeCashOrCard;
	}

	public void setInstrumentTypeCashOrCard(final String instrumentTypeCashOrCard) {
		this.instrumentTypeCashOrCard = instrumentTypeCashOrCard;
	}

	/**
	 * This getter will be invoked by framework from UI. It returns the total number
	 * of bill accounts that are present in the XML arriving from the billing system
	 *
	 * @return
	 */
	public Integer getTotalNoOfAccounts() {
		Integer totalNoOfAccounts = 0;
		totalNoOfAccounts += receiptHeader.getReceiptDetails().size();
		return totalNoOfAccounts;
	}

	/**
	 * This getter will be invoked by framework from UI. This value will be used
	 * during bill apportioning.
	 *
	 * @return
	 */
	public BigDecimal getMinimumAmount() {
		return null;
	}

	public Boolean getOverrideAccountHeads() {
		return overrideAccountHeads;
	}

	public void setOverrideAccountHeads(final Boolean overrideAccountHeads) {
		this.overrideAccountHeads = overrideAccountHeads;
	}

	public Boolean getCallbackForApportioning() {
		return callbackForApportioning;
	}

	public void setCallbackForApportioning(final Boolean callbackForApportioning) {
		this.callbackForApportioning = callbackForApportioning;
	}

	public Boolean getPartPaymentAllowed() {
		return partPaymentAllowed;
	}

	public void setPartPaymentAllowed(final Boolean partPaymentAllowed) {
		this.partPaymentAllowed = partPaymentAllowed;
	}

	public BigDecimal getCashOrCardInstrumenttotal() {
		return cashOrCardInstrumenttotal;
	}

	public void setCashOrCardInstrumenttotal(final BigDecimal cashOrCardInstrumenttotal) {
		this.cashOrCardInstrumenttotal = cashOrCardInstrumenttotal;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(final String serviceName) {
		this.serviceName = serviceName;
	}

	public void setCollectionsUtil(final CollectionsUtil collectionsUtil) {
		this.collectionsUtil = collectionsUtil;
	}

	public Boolean getCashAllowed() {
		return cashAllowed;
	}

	public void setCashAllowed(final Boolean cashAllowed) {
		this.cashAllowed = cashAllowed;
	}

	public Boolean getCardAllowed() {
		return cardAllowed;
	}

	public void setCardAllowed(final Boolean cardAllowed) {
		this.cardAllowed = cardAllowed;
	}

	public Boolean getChequeAllowed() {
		return chequeAllowed;
	}

	public void setChequeAllowed(final Boolean chequeAllowed) {
		this.chequeAllowed = chequeAllowed;
	}

	public Boolean getDdAllowed() {
		return ddAllowed;
	}

	public void setDdAllowed(final Boolean ddAllowed) {
		this.ddAllowed = ddAllowed;
	}

	public Boolean getBankAllowed() {
		return bankAllowed;
	}

	public void setBankAllowed(final Boolean bankAllowed) {
		this.bankAllowed = bankAllowed;
	}

	/**
	 * @return the voucherDate
	 */
	public Date getVoucherDate() {
		return voucherDate;
	}

	/**
	 * @param voucherDate the voucherDate to set
	 */
	public void setVoucherDate(final Date voucherDate) {
		this.voucherDate = voucherDate;
	}

	/**
	 * @return the voucherNumber
	 */
	public String getVoucherNum() {
		return voucherNum;
	}

	/**
	 * @param voucherNumber the voucherNumber to set
	 */
	public void setVoucherNum(final String voucherNum) {
		this.voucherNum = voucherNum;
	}

	/**
	 * This getter will be invoked by framework from UI. This value will be used
	 * during misc receipts for account details
	 *
	 * @return
	 */
	public List<ReceiptDetailInfo> getBillCreditDetailslist() {
		return billCreditDetailslist;
	}

	public void setBillCreditDetailslist(final List<ReceiptDetailInfo> billCreditDetailslist) {
		this.billCreditDetailslist = billCreditDetailslist;
	}

	public List<ReceiptDetailInfo> getBillRebateDetailslist() {
		return billRebateDetailslist;
	}

	public void setBillRebateDetailslist(final List<ReceiptDetailInfo> billRebateDetailslist) {
		this.billRebateDetailslist = billRebateDetailslist;
	}

	public List<ReceiptDetailInfo> getSubLedgerlist() {
		return subLedgerlist;
	}

	public void setSubLedgerlist(final List<ReceiptDetailInfo> subLedgerlist) {
		this.subLedgerlist = subLedgerlist;
	}

	public String getBillSource() {
		return billSource;
	}

	public void setBillSource(final String billSource) {
		this.billSource = billSource;
	}

	/**
	 * @return the receiptPayeeDetailsService
	 */
	public ReceiptMisc getReceiptMisc() {
		return receiptMisc;
	}

	public void setReceiptMisc(final ReceiptMisc receiptMisc) {
		this.receiptMisc = receiptMisc;
	}

	/**
	 * @return the reportId
	 */
	public String getReportId() {
		return reportId;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(final String deptId) {
		this.deptId = deptId;
	}

	public BigDecimal getTotalDebitAmount() {
		return totalDebitAmount;
	}

	public void setTotalDebitAmount(final BigDecimal totalDebitAmount) {
		this.totalDebitAmount = totalDebitAmount;
	}

	protected boolean validateData(final List<ReceiptDetailInfo> billDetailslistd,
			final List<ReceiptDetailInfo> subLedgerList) {
		BigDecimal totalDrAmt = BigDecimal.ZERO;
		BigDecimal totalCrAmt = BigDecimal.ZERO;
		Integer index = 0;
		boolean isDataValid = true;
		for (final ReceiptDetailInfo rDetails : billDetailslistd) {
			index = index + 1;
			totalDrAmt = totalDrAmt.add(rDetails.getDebitAmountDetail());
			totalCrAmt = totalCrAmt.add(rDetails.getCreditAmountDetail());
			if (rDetails.getDebitAmountDetail().compareTo(BigDecimal.ZERO) == 0
					&& rDetails.getCreditAmountDetail().compareTo(BigDecimal.ZERO) == 0
					&& rDetails.getGlcodeDetail().trim().length() == 0) {

				addActionError(getText("miscreceipt.accdetail.emptyaccrow", new String[] { index.toString() }));
				isDataValid = false;
			} else if (rDetails.getDebitAmountDetail().compareTo(BigDecimal.ZERO) == 0
					&& rDetails.getCreditAmountDetail().compareTo(BigDecimal.ZERO) == 0
					&& rDetails.getGlcodeDetail().trim().length() != 0) {
				addActionError(
						getText("miscreceipt.accdetail.amountZero", new String[] { rDetails.getGlcodeDetail() }));
				isDataValid = false;
			} else if (rDetails.getDebitAmountDetail().compareTo(BigDecimal.ZERO) > 0
					&& rDetails.getCreditAmountDetail().compareTo(BigDecimal.ZERO) > 0) {
				addActionError(getText("miscreceipt.accdetail.amount", new String[] { rDetails.getGlcodeDetail() }));
				isDataValid = false;
			} else if ((rDetails.getDebitAmountDetail().compareTo(BigDecimal.ZERO) > 0
					|| rDetails.getCreditAmountDetail().compareTo(BigDecimal.ZERO) > 0)
					&& rDetails.getGlcodeDetail().trim().length() == 0) {
				addActionError(getText("miscreceipt.accdetail.accmissing", new String[] { index.toString() }));
				isDataValid = false;
			}

		}
		if (isDataValid)
			isDataValid = validateSubledgerDetails(billCreditDetailslist, subLedgerList);
		return isDataValid;
	}

	protected boolean validateRebateData(final List<ReceiptDetailInfo> billDetailslistd,
			final List<ReceiptDetailInfo> subLedgerList) {
		Integer index = 0;
		boolean isDataValid = true;
		for (final ReceiptDetailInfo rDetails : billDetailslistd) {
			index = index + 1;
			if (rDetails.getDebitAmountDetail().compareTo(BigDecimal.ZERO) == 0
					&& rDetails.getGlcodeDetail().trim().length() != 0) {
				addActionError(
						getText("miscreceipt.accdetail.amountZero", new String[] { rDetails.getGlcodeDetail() }));
				isDataValid = false;
			} else if (rDetails.getDebitAmountDetail().compareTo(BigDecimal.ZERO) > 0
					&& rDetails.getGlcodeDetail().trim().length() == 0) {
				addActionError(getText("miscreceipt.accdetail.accmissing", new String[] { index.toString() }));
				isDataValid = false;
			}

		}
		if (isDataValid)
			isDataValid = validateSubledgerDetails(billRebateDetailslist, subLedgerList);
		return isDataValid;
	}

	@SuppressWarnings("unchecked")
	protected boolean validateSubledgerDetails(final List<ReceiptDetailInfo> billRebateDetailslist,
			final List<ReceiptDetailInfo> subLedgerlist) {
		Map<String, Object> accountDetailMap;
		final Map<String, BigDecimal> subledAmtmap = new HashMap<>(0);
		List<Map<String, Object>> subLegAccMap = null; // this list will contain
		// the details about the
		// account coe those are
		// detail codes.
		for (final ReceiptDetailInfo rDetails : billRebateDetailslist) {
			final CChartOfAccountDetail chartOfAccountDetail = (CChartOfAccountDetail) getPersistenceService().find(
					" from CChartOfAccountDetail" + " where glCodeId=(select id from CChartOfAccounts where glcode=?)",
					rDetails.getGlcodeDetail());
			if (null != chartOfAccountDetail) {
				accountDetailMap = new HashMap<>();
				accountDetailMap.put("glcodeId", rDetails.getGlcodeIdDetail());
				accountDetailMap.put(GLCODE, rDetails.getGlcodeDetail());
				if (rDetails.getDebitAmountDetail().compareTo(BigDecimal.ZERO) == 0)
					accountDetailMap.put(AMOUNT, rDetails.getCreditAmountDetail());
				else if (rDetails.getCreditAmountDetail().compareTo(BigDecimal.ZERO) == 0)
					accountDetailMap.put(AMOUNT, rDetails.getDebitAmountDetail());
				if (null == subLegAccMap) {
					subLegAccMap = new ArrayList<>();
					subLegAccMap.add(accountDetailMap);
				} else
					subLegAccMap.add(accountDetailMap);

			}
		}
		if (null != subLegAccMap) {
			final Map<String, String> subLedgerMap = new HashMap<>();
			for (final ReceiptDetailInfo rDetails : subLedgerlist)
				if (rDetails.getGlcode().getId() != 0) {
					if (null == subledAmtmap.get(rDetails.getGlcode().getId().toString()))
						subledAmtmap.put(rDetails.getGlcode().getId().toString(), rDetails.getAmount());
					else {
						final BigDecimal debitTotalAmount = subledAmtmap.get(rDetails.getGlcode().getId().toString())
								.add(rDetails.getAmount());
						subledAmtmap.put(rDetails.getGlcode().getId().toString(), debitTotalAmount);
					}
					final StringBuilder subledgerDetailRow = new StringBuilder();
					subledgerDetailRow.append(rDetails.getGlcode().getId().toString())
							.append(rDetails.getDetailType().getId().toString())
							.append(rDetails.getDetailKeyId().toString());
					if (null == subLedgerMap.get(subledgerDetailRow.toString()))
						subLedgerMap.put(subledgerDetailRow.toString(), subledgerDetailRow.toString());
					else {
						addActionError(getText("miscreciept.samesubledger.repeated"));
						return false;
					}

				}
			for (final Map<String, Object> map : subLegAccMap) {
				final String glcodeId = map.get("glcodeId").toString();
				if (null == subledAmtmap.get(glcodeId)) {
					addActionError(
							getText("miscreciept.subledger.entrymissing", new String[] { map.get(GLCODE).toString() }));
					return false;
				} else if (subledAmtmap.get(glcodeId).compareTo(new BigDecimal(map.get(AMOUNT).toString())) != 0) {
					addActionError(getText("miscreciept.subledger.amtnotmatchinng",
							new String[] { map.get(GLCODE).toString() }));
					return false;
				}
			}
		}
		final List<CFinancialYear> list = persistenceService.findAllBy(
				"from CFinancialYear where isActiveForPosting=true and startingDate <= ? and endingDate >= ?",
				getVoucherDate(), getVoucherDate());
		if (list.isEmpty()) {
			addActionError(getText("miscreciept.fYear.notActive"));
			return false;
		}
		return true;
	}

	public void apportionBillAmount() {
		receiptDetailList = collectionCommon.apportionBillAmount(instrumenttotal,
				(ArrayList<ReceiptDetail>) getReceiptDetailList());
	}

	void removeEmptyRows(final List<ReceiptDetailInfo> list) {
		for (final Iterator<ReceiptDetailInfo> detail = list.iterator(); detail.hasNext();)
			if (detail.next() == null)
				detail.remove();
	}

	public void setFinancialsUtil(final FinancialsUtil financialsUtil) {
		this.financialsUtil = financialsUtil;
	}

	public List<String> getHeaderFields() {
		return headerFields;
	}

	public void setHeaderFields(final List<String> headerFields) {
		this.headerFields = headerFields;
	}

	public List<String> getMandatoryFields() {
		return mandatoryFields;
	}

	public void setMandatoryFields(final List<String> mandatoryFields) {
		this.mandatoryFields = mandatoryFields;
	}

	public Integer getBankBranchId() {
		return bankBranchId;
	}

	public void setBankBranchId(final Integer bankBranchId) {
		this.bankBranchId = bankBranchId;
	}

	public String getFundName() {
		return fundName;
	}

	public void setFundName(final String fundName) {
		this.fundName = fundName;
	}

	/**
	 * @param collectionCommon the collectionCommon to set
	 */
	public void setCollectionCommon(final CollectionCommon collectionCommon) {
		this.collectionCommon = collectionCommon;
	}

	/**
	 * @param receiptHeaderService The receipt header service to set
	 */
	public void setReceiptHeaderService(final ReceiptHeaderService receiptHeaderService) {
		this.receiptHeaderService = receiptHeaderService;
	}

	public String getCollectXML() {
		return collectXML;
	}

	public void setCollectXML(final String collectXML) {
		this.collectXML = collectXML;
	}

	@Override
	public Object getModel() {
		return receiptHeader;
	}

	public ReceiptHeader[] getReceipts() {
		return receipts;
	}

	public void setReceipts(final ReceiptHeader[] receipts) {
		this.receipts = receipts;
	}

	public String[] getSelectedReceipts() {
		return selectedReceipts;
	}

	public void setSelectedReceipts(final String[] selectedReceipts) {
		this.selectedReceipts = selectedReceipts;
	}

	public void setPayeename(final String payeename) {
		this.payeename = payeename;
	}

	public Date getManualReceiptDate() {
		return manualReceiptDate;
	}

	public void setManualReceiptDate(final Date manualReceiptDate) {
		this.manualReceiptDate = manualReceiptDate;
	}

	public Boolean getReceiptBulkUpload() {
		return receiptBulkUpload;
	}

	public void setReceiptBulkUpload(final Boolean receiptBulkUpload) {
		this.receiptBulkUpload = receiptBulkUpload;
	}

	public BigDecimal getInstrumenttotal() {
		return instrumenttotal;
	}

	public void setInstrumenttotal(final BigDecimal instrumenttotal) {
		this.instrumenttotal = instrumenttotal;
	}

	public List<InstrumentHeader> getInstrumentProxyList() {
		return instrumentProxyList;
	}

	public void setInstrumentProxyList(final List<InstrumentHeader> instrumentProxyList) {
		this.instrumentProxyList = instrumentProxyList;
	}

	public int getInstrumentCount() {
		return instrumentCount;
	}

	public void setInstrumentCount(final int instrumentCount) {
		this.instrumentCount = instrumentCount;
	}

	/**
	 * @return the manualReceiptNumber
	 */
	public String getManualReceiptNumber() {
		return manualReceiptNumber;
	}

	/**
	 * @param manualReceiptNumber the manualReceiptNumber to set
	 */
	public void setManualReceiptNumber(final String manualReceiptNumber) {
		this.manualReceiptNumber = manualReceiptNumber;
	}

	/**
	 * @return the manualReceiptNumberAndDateReq
	 */
	public Boolean getManualReceiptNumberAndDateReq() {
		return manualReceiptNumberAndDateReq;
	}

	/**
	 * @param manualReceiptNumberAndDateReq the manualReceiptNumberAndDateReq to set
	 */
	public void setManualReceiptNumberAndDateReq(final Boolean manualReceiptNumberAndDateReq) {
		this.manualReceiptNumberAndDateReq = manualReceiptNumberAndDateReq;
	}

	public ReceiptHeader getReceiptHeader() {
		return receiptHeader;
	}

	public void setReceiptHeader(final ReceiptHeader receiptHeader) {
		this.receiptHeader = receiptHeader;
	}

	public String getFunctionId() {
		return functionId;
	}

	public void setFunctionId(final String functionId) {
		this.functionId = functionId;
	}

	public String getServiceId() {
		return serviceId;
	}

	public void setServiceId(final String serviceId) {
		this.serviceId = serviceId;
	}

	public String getInstrumentType() {
		return instrumentType;
	}

	public void setInstrumentType(final String instrumentType) {
		this.instrumentType = instrumentType;
	}

	public Boolean getOnlineAllowed() {
		return onlineAllowed;
	}

	public void setOnlineAllowed(final Boolean onlineAllowed) {
		this.onlineAllowed = onlineAllowed;
	}

	public CollectionService getCollectionService() {
		return collectionService;
	}

	public void setCollectionService(final CollectionService collectionService) {
		this.collectionService = collectionService;
	}

	public PaymentRequest getPaymentRequest() {
		return paymentRequest;
	}

	public void setPaymentRequest(final PaymentRequest paymentRequest) {
		this.paymentRequest = paymentRequest;
	}

	public Boolean getIsReceiptCancelEnable() {
		return isReceiptCancelEnable;
	}

	public void setIsReceiptCancelEnable(Boolean isReceiptCancelEnable) {
		this.isReceiptCancelEnable = isReceiptCancelEnable;
	}

	public String getReceipt() {
		return receipt;
	}

	public void setReceipt(String receipt) {
		this.receipt = receipt;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getServiceIdText() {
		return serviceIdText;
	}

	public void setServiceIdText(String serviceIdText) {
		this.serviceIdText = serviceIdText;
	}

	public Map<String, String> getServiceCategoryNames() {
		return serviceCategoryNames;
	}

	public void setServiceCategoryNames(Map<String, String> serviceCategoryNames) {
		this.serviceCategoryNames = serviceCategoryNames;
	}

	public Map<String, Map<String, String>> getServiceTypeMap() {
		return serviceTypeMap;
	}

	public void setServiceTypeMap(Map<String, Map<String, String>> serviceTypeMap) {
		this.serviceTypeMap = serviceTypeMap;
	}

	public void setServiceCategory(String serviceCategory) {
		this.serviceCategory = serviceCategory;
	}

	public String getServiceCategory() {
		return this.serviceCategory;
	}

	public String[] getSelectedPayments() {
		return selectedPayments;
	}

	public void setSelectedPayments(String[] selectedPayments) {
		this.selectedPayments = selectedPayments;
	}

	public String getServiceTypeId() {
		return serviceTypeId;
	}

	public void setServiceTypeId(final String serviceType) {
		serviceTypeId = serviceType;
	}
}
