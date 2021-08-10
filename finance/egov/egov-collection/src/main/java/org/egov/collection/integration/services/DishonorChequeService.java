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
package org.egov.collection.integration.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.egov.billsaccounting.services.CreateVoucher;
import org.egov.billsaccounting.services.VoucherConstant;
import org.egov.collection.constants.CollectionConstants;
import org.egov.collection.entity.AccountPayeeDetail;
import org.egov.collection.entity.CollectionDishonorCheque;
import org.egov.collection.entity.CollectionDishonorChequeDetails;
import org.egov.collection.entity.CollectionDishonorChequeSubLedgerDetails;
import org.egov.collection.entity.DishonoredChequeBean;
import org.egov.collection.entity.ReceiptDetail;
import org.egov.collection.entity.ReceiptHeader;
import org.egov.collection.service.ReceiptHeaderService;
import org.egov.collection.utils.CollectionsUtil;
import org.egov.collection.utils.FinancialsUtil;
import org.egov.commons.Bankaccount;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.CGeneralLedger;
import org.egov.commons.CGeneralLedgerDetail;
import org.egov.commons.CVoucherHeader;
import org.egov.commons.EgwStatus;
import org.egov.commons.dao.EgwStatusHibernateDAO;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.microservice.models.BankAccountServiceMapping;
import org.egov.infra.microservice.models.DishonorReasonContract;
import org.egov.infra.microservice.models.FinancialStatus;
import org.egov.infra.microservice.models.Instrument;
import org.egov.infra.microservice.models.InstrumentSearchContract;
import org.egov.infra.microservice.models.InstrumentVoucher;
import org.egov.infra.microservice.models.PaymentWorkflow;
import org.egov.infra.microservice.models.Receipt;
import org.egov.infra.microservice.models.ReceiptResponse;
import org.egov.infra.microservice.models.ReceiptSearchCriteria;
import org.egov.infra.microservice.models.TransactionType;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.validation.exception.ValidationError;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.infstr.services.PersistenceService;
import org.egov.model.instrument.DishonorCheque;
import org.egov.model.instrument.DishonorChequeDetails;
import org.egov.model.instrument.DishonorChequeSubLedgerDetails;
import org.egov.model.instrument.InstrumentHeader;
import org.egov.services.instrument.FinancialIntegrationService;
import org.egov.services.instrument.InstrumentHeaderService;
import org.egov.services.voucher.GeneralLedgerDetailService;
import org.egov.services.voucher.GeneralLedgerService;
import org.egov.services.voucher.VoucherHeaderService;
import org.egov.utils.FinancialConstants;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

@Service
@Transactional(readOnly = true)
public class DishonorChequeService implements FinancialIntegrationService {

    private static final Logger LOGGER = Logger.getLogger(DishonorChequeService.class);

    private static final String VOUCHER_SEARCH_QUERY = " from CVoucherHeader where voucherNumber=?";

    @Autowired
    private FinancialsUtil financialsUtil;

    @Autowired
    @Qualifier("instrumentHeaderService")
    public InstrumentHeaderService instrumentHeaderService;

    @Autowired
    @Qualifier("persistenceService")
    private PersistenceService persistenceService;

    @Autowired
    @Qualifier("voucherHeaderService")
    private VoucherHeaderService voucherHeaderService;

    @Autowired
    private EgwStatusHibernateDAO egwStatusDAO;

    @Autowired
    @Qualifier("generalLedgerService")
    private GeneralLedgerService generalLedgerService;

    @Autowired
    @Qualifier("generalLedgerDetailService")
    private GeneralLedgerDetailService generalLedgerDetailService;

    @Autowired
    @Qualifier("chartOfAccountsService")
    private ChartOfAccountsService chartOfAccountsService;

    @Autowired
    @Qualifier("createVoucher")
    private CreateVoucher createVoucher;

    @Autowired
    @Qualifier("receiptHeaderService")
    public ReceiptHeaderService receiptHeaderService;

    @Autowired
    @Qualifier("collectionsUtil")
    public CollectionsUtil collectionsUtil;
    
    @Autowired
    private MicroserviceUtils microserviceUtils;
    
    @Value("${collection.payment.searchurl.enabled}")
    private Boolean paymentSearchEndPointEnabled;

    @Transactional
    public DishonorCheque createDishonorCheque(final DishonoredChequeBean chequeForm) {
        final DishonorCheque dishonorChq = new DishonorCheque();

        try {
            CVoucherHeader originalVoucher = null;
            if (!chequeForm.getVoucherHeaderIds().isEmpty())
                originalVoucher = voucherHeaderService.findById(
                        Long.valueOf(chequeForm.getVoucherHeaderIds().split(",")[0]), false);
            final InstrumentHeader instrumentHeader = instrumentHeaderService.findById(
                    Long.valueOf(chequeForm.getInstHeaderIds().split(",")[0]), false);
            if (originalVoucher != null)
                createDishonorChequeForVoucher(chequeForm, dishonorChq, originalVoucher, instrumentHeader);
            else
                createDishonorChequeWithoutVoucher(chequeForm, instrumentHeader);
        } catch (final ValidationException e) {
            LOGGER.error("Error in DishonorCheque >>>>" + e);
            final List<ValidationError> errors = new ArrayList<>();
            errors.add(new ValidationError("exp", e.getErrors().get(0).getMessage()));
            throw new ValidationException(errors);
        } /*
           * catch (final Exception e) {
           * LOGGER.error("Error in DishonorCheque >>>>" + e); final
           * List<ValidationError> errors = new ArrayList<>(); errors.add(new
           * ValidationError("exp", e.getMessage())); throw new
           * ValidationException(errors); }
           */
        return dishonorChq;
    }

    @Transactional
    public void createDishonorChequeForVoucher(final DishonoredChequeBean chequeForm, final DishonorCheque dishonorChq,
            final CVoucherHeader originalVoucher, final InstrumentHeader instrumentHeader) {
        DishonorChequeSubLedgerDetails dishonourChqSLDetails = new DishonorChequeSubLedgerDetails();
        dishonorChq.setStatus(egwStatusDAO.getStatusByModuleAndCode(FinancialConstants.STATUS_MODULE_DISHONORCHEQUE,
                FinancialConstants.DISHONORCHEQUE_APPROVED_STATUS));
        dishonorChq.setTransactionDate(chequeForm.getTransactionDate());
        dishonorChq.setBankReferenceNumber(chequeForm.getReferenceNo());
        dishonorChq.setInstrumentDishonorReason(chequeForm.getRemarks());
        dishonorChq.setOriginalVoucherHeader(originalVoucher);
        instrumentHeader.setSurrendarReason(chequeForm.getDishonorReason());
        instrumentHeaderService.update(instrumentHeader);
        dishonorChq.setInstrumentHeader(instrumentHeader);
        final String[] receiptGeneralLedger = chequeForm.getReceiptGLDetails().split(",");
        final String[] remittanceGeneralLedger = chequeForm.getRemittanceGLDetails().split(",");
        final Set<DishonorChequeDetails> dishonorChequeDetailsSet = new HashSet<>();
        CGeneralLedger ledger = new CGeneralLedger();
        for (final String gl : receiptGeneralLedger) {
            ledger = generalLedgerService.find("from CGeneralLedger where voucherHeaderId.id = ? and glcode = ?",
                    originalVoucher.getId(), gl.split("-")[0].trim());
            final List<CGeneralLedgerDetail> ledgerDetailSet = generalLedgerDetailService.findAllBy(
                    "from CGeneralLedgerDetail where generalLedgerId.id=?", ledger.getId());
            final DishonorChequeDetails dishonourChqDetails = new DishonorChequeDetails();
            dishonourChqDetails.setHeader(dishonorChq);
            final CChartOfAccounts glCode = chartOfAccountsService.find("from CChartOfAccounts where glcode=?",
                    ledger.getGlcode());
            dishonourChqDetails.setGlcodeId(glCode);
            if (ledger.getFunctionId() != null)
                dishonourChqDetails.setFunctionId(ledger.getFunctionId());
            dishonourChqDetails.setDebitAmt(BigDecimal.valueOf(Double.valueOf(gl.split("-")[1].trim())));
            dishonourChqDetails.setCreditAmount(BigDecimal.valueOf(Double.valueOf(gl.split("-")[2].trim())));
            for (final CGeneralLedgerDetail ledgerDetail : ledgerDetailSet) {
                dishonourChqSLDetails = new DishonorChequeSubLedgerDetails();
                dishonourChqSLDetails.setDetails(dishonourChqDetails);
                dishonourChqSLDetails
                        .setAmount(dishonourChqDetails.getDebitAmt().compareTo(BigDecimal.ZERO) == 0 ? dishonourChqDetails
                                .getCreditAmount() : dishonourChqDetails.getDebitAmt());
                dishonourChqSLDetails.setDetailTypeId(ledgerDetail.getDetailTypeId().getId());
                dishonourChqSLDetails.setDetailKeyId(ledgerDetail.getDetailKeyId());
                dishonourChqDetails.getSubLedgerDetails().add(dishonourChqSLDetails);
            }

            dishonorChequeDetailsSet.add(dishonourChqDetails);
            LOGGER.info("dishonorChq Details " + dishonorChequeDetailsSet.size());
        }

        for (final String gl : remittanceGeneralLedger) {
            final CVoucherHeader remittanceVoucher = voucherHeaderService
                    .find("select gl.voucherHeaderId from CGeneralLedger gl ,InstrumentOtherDetails iod"
                    		+ " where gl.voucherHeaderId.id = iod.payinslipId.id "
                    		+ "and iod.instrumentHeaderId.id   in (?) ", chequeForm.getInstHeaderIds());
            ledger = generalLedgerService.find("from CGeneralLedger where voucherHeaderId.id = ? and glcode = ?",
                    remittanceVoucher.getId(), gl.split("-")[0].trim());
            final List<CGeneralLedgerDetail> ledgerDetailSet = generalLedgerDetailService.findAllBy(
                    "from CGeneralLedgerDetail where generalLedgerId.id=?", ledger.getId());
            final DishonorChequeDetails dishonourChqDetails = new DishonorChequeDetails();
            dishonourChqDetails.setHeader(dishonorChq);
            final CChartOfAccounts glCode = chartOfAccountsService.find("from CChartOfAccounts where glcode=?",
                    ledger.getGlcode());
            dishonourChqDetails.setGlcodeId(glCode);
            if (ledger.getFunctionId() != null)
                dishonourChqDetails.setFunctionId(ledger.getFunctionId());
            dishonourChqDetails.setDebitAmt(BigDecimal.valueOf(Double.valueOf(gl.split("-")[1].trim())));
            dishonourChqDetails.setCreditAmount(BigDecimal.valueOf(Double.valueOf(gl.split("-")[2].trim())));
            for (final CGeneralLedgerDetail ledgerDetail : ledgerDetailSet) {
                dishonourChqSLDetails = new DishonorChequeSubLedgerDetails();
                dishonourChqSLDetails.setDetails(dishonourChqDetails);
                dishonourChqSLDetails
                        .setAmount(dishonourChqDetails.getDebitAmt().compareTo(BigDecimal.ZERO) == 0 ? dishonourChqDetails
                                .getCreditAmount() : dishonourChqDetails.getDebitAmt());
                dishonourChqSLDetails.setDetailTypeId(ledgerDetail.getDetailTypeId().getId());
                dishonourChqSLDetails.setDetailKeyId(ledgerDetail.getDetailKeyId());
                dishonourChqDetails.getSubLedgerDetails().add(dishonourChqSLDetails);
                // Need to handle multiple sub ledgers
                break;
            }
            dishonorChequeDetailsSet.add(dishonourChqDetails);
        }
        dishonorChq.getDetails().addAll(dishonorChequeDetailsSet);
        persistenceService.applyAuditing(dishonorChq);
        persistenceService.persist(dishonorChq);
        approve(chequeForm, dishonorChq, originalVoucher, instrumentHeader);
    }

    @Transactional
    public CollectionDishonorCheque populateAndPersistDishonorCheque(final DishonoredChequeBean chequeForm)
             {
        final CollectionDishonorCheque dishonorChq = new CollectionDishonorCheque();

        try {
            final InstrumentHeader instrumentHeader = instrumentHeaderService.findById(
                    Long.valueOf(chequeForm.getInstHeaderIds().split(",")[0]), false);
            final ReceiptHeader collectionHeader = receiptHeaderService.findById(
                    Long.valueOf(chequeForm.getReceiptHeaderIds().split(",")[0]), false);
            dishonorChq.setStatus(egwStatusDAO.getStatusByModuleAndCode(CollectionConstants.MODULE_NAME_DISHONORCHEQUE,
                    CollectionConstants.DISHONORCHEQUE_STATUS_CODE_APPROVED));
            dishonorChq.setTransactionDate(chequeForm.getTransactionDate());
            dishonorChq.setCollectionHeader(collectionHeader);
            dishonorChq.setBankReferenceNumber(chequeForm.getReferenceNo());
            dishonorChq.setInstrumentDishonorReason(chequeForm.getRemarks());
            instrumentHeader.setSurrendarReason(chequeForm.getDishonorReason());
            instrumentHeaderService.update(instrumentHeader);
            dishonorChq.setInstrumentHeader(instrumentHeader);
            final String[] receiptGeneralLedger = chequeForm.getReceiptGLDetails().split(",");
            final String[] remittanceGeneralLedger = chequeForm.getRemittanceGLDetails().split(",");
            dishonorChq.getDetails()
                    .add(populateDischonourChequedetails(chequeForm, dishonorChq, receiptGeneralLedger));
            dishonorChq.getDetails().add(
                    populateDischonourChequedetails(chequeForm, dishonorChq, remittanceGeneralLedger));
            persistenceService.applyAuditing(dishonorChq);
            persistenceService.persist(dishonorChq);
        } catch (final ValidationException e) {
            LOGGER.error("Error in DishonorCheque >>>>" + e.getMessage());
            final List<ValidationError> errors = new ArrayList<>();
            errors.add(new ValidationError("exp", e.getErrors().get(0).getMessage()));
            throw new ValidationException(errors);
        } /*
           * catch (final Exception e) {
           * LOGGER.error("Error in DishonorCheque >>>>" + e.getMessage());
           * final List<ValidationError> errors = new ArrayList<>();
           * errors.add(new ValidationError("exp", e.getMessage())); throw new
           * ValidationException(errors); }
           */
        return dishonorChq;
    }

    public CollectionDishonorChequeDetails populateDischonourChequedetails(final DishonoredChequeBean chequeForm,
            final CollectionDishonorCheque dishonorChq, final String[] receiptGeneralLedger)
                    throws NumberFormatException {
        CollectionDishonorChequeDetails dishonourChqDetails = new CollectionDishonorChequeDetails();
        CollectionDishonorChequeSubLedgerDetails dishonourChqSLDetails;
        ReceiptDetail ledger = new ReceiptDetail();
        for (final String gl : receiptGeneralLedger) {
            ledger = (ReceiptDetail) persistenceService.find(
                    "from ReceiptDetail where collectionheader = ? and accounthead.glcode = ?",
                    Long.valueOf(chequeForm.getReceiptHeaderIds().split(",")[0]), gl.split("-")[0].trim());
            final Set<AccountPayeeDetail> ledgerDetailSet = ledger.getAccountPayeeDetails();
            dishonourChqDetails = new CollectionDishonorChequeDetails();
            dishonourChqDetails.setDishonorcheque(dishonorChq);
            dishonourChqDetails.setChartofaccounts(ledger.getAccounthead());
            if (ledger.getFunction() != null)
                dishonourChqDetails.setFunction(ledger.getFunction());
            dishonourChqDetails.setDebitAmount(BigDecimal.valueOf(Double.valueOf(gl.split("-")[1].trim())));
            dishonourChqDetails.setCreditAmount(BigDecimal.valueOf(Double.valueOf(gl.split("-")[2].trim())));
            for (final AccountPayeeDetail ledgerDetail : ledgerDetailSet) {
                dishonourChqSLDetails = new CollectionDishonorChequeSubLedgerDetails();
                dishonourChqSLDetails.setDishonorchequedetail(dishonourChqDetails);
                dishonourChqSLDetails
                        .setAmount(dishonourChqDetails.getDebitAmount().compareTo(BigDecimal.ZERO) == 0 ? dishonourChqDetails
                                .getCreditAmount() : dishonourChqDetails.getDebitAmount());
                dishonourChqSLDetails.setDetailType(ledgerDetail.getAccountDetailType().getId());
                dishonourChqSLDetails.setDetailKey(ledgerDetail.getAccountDetailKey().getId());
                dishonourChqDetails.getSubLedgerDetails().add(dishonourChqSLDetails);
            }
        }
        return dishonourChqDetails;
    }

    @Transactional
    public void createDishonorChequeWithoutVoucher(final DishonoredChequeBean chequeForm,
            final InstrumentHeader instrumentHeader) {
        instrumentHeader.setSurrendarReason(chequeForm.getDishonorReason());
        persistenceService.update(instrumentHeader);
        populateAndPersistDishonorCheque(chequeForm);
        updateCollectionsOnInstrumentDishonor(instrumentHeader.getId());
    }

    @Transactional
    public void approve(final DishonoredChequeBean chequeForm, final DishonorCheque dishonorChq,
            final CVoucherHeader originalVoucher, final InstrumentHeader instrumentHeader) {
        try {
            final String instrumentHeaderIds[] = chequeForm.getInstHeaderIds().split(",");
            final CVoucherHeader reversalVoucher = createReversalVoucher(chequeForm, dishonorChq, originalVoucher,
                    instrumentHeader);

            dishonorChq.setReversalVoucherHeader(reversalVoucher);
            persistenceService.update(dishonorChq);
            final CollectionDishonorCheque collDisCheque = populateAndPersistDishonorCheque(chequeForm);
            collDisCheque.setReversalVoucherHeader(reversalVoucher);
            persistenceService.update(collDisCheque);
            for (final String instHeadId : instrumentHeaderIds)
                updateCollectionsOnInstrumentDishonor(Long.valueOf(instHeadId));

        } catch (final ValidationException e) {
            LOGGER.error("Error in DishonorCheque >>>>" + e);
            final List<ValidationError> errors = new ArrayList<ValidationError>();
            errors.add(new ValidationError("exp", e.getErrors().get(0).getMessage()));
            throw new ValidationException(errors);
        } /*
           * catch (final Exception e) {
           * LOGGER.error("Error in DishonorCheque >>>>" + e); final
           * List<ValidationError> errors = new ArrayList<ValidationError>();
           * errors.add(new ValidationError("exp", e.getMessage())); throw new
           * ValidationException(errors); }
           */
    }

    @Transactional
    public CVoucherHeader createReversalVoucher(final DishonoredChequeBean chequeForm,
            final DishonorCheque dishonorChq, final CVoucherHeader originalVoucher,
            final InstrumentHeader instrumentHeader) {
        final HashMap<String, Object> headerDetails = createHeaderAndMisDetails(originalVoucher, instrumentHeader);
        final List<HashMap<String, Object>> accountdetails = new ArrayList<HashMap<String, Object>>();
        final List<HashMap<String, Object>> subledgerdetails = new ArrayList<HashMap<String, Object>>();
        CVoucherHeader reversalVoucher = new CVoucherHeader();
        try {
            final List<DishonorChequeDetails> dishonorChequeDetails = new ArrayList<DishonorChequeDetails>();
            dishonorChequeDetails.addAll(dishonorChq.getDetails());
            HashMap<String, Object> detailMap = null;
            HashMap<String, Object> subledgerMap = null;
            for (final DishonorChequeDetails gl : dishonorChequeDetails) {
                detailMap = new HashMap<String, Object>();
                detailMap.put(VoucherConstant.GLCODE, gl.getGlcodeId().getGlcode());
                // debit becomes credit ,credit becomes debit
                detailMap.put(VoucherConstant.DEBITAMOUNT, gl.getDebitAmt());
                detailMap.put(VoucherConstant.CREDITAMOUNT, gl.getCreditAmount());
                accountdetails.add(detailMap);
                final Set<DishonorChequeSubLedgerDetails> dishonorChequeSubLedgerDetails = gl.getSubLedgerDetails();
                for (final DishonorChequeSubLedgerDetails slLedgerDetail : dishonorChequeSubLedgerDetails) {
                    subledgerMap = new HashMap<String, Object>();
                    subledgerMap.put(VoucherConstant.GLCODE, gl.getGlcodeId().getGlcode());
                    subledgerMap.put(VoucherConstant.DETAILTYPEID, slLedgerDetail.getDetailTypeId());
                    subledgerMap.put(VoucherConstant.DETAILKEYID, slLedgerDetail.getDetailKeyId());
                    subledgerMap.put(VoucherConstant.DEBITAMOUNT, slLedgerDetail.getAmount());
                    subledgerdetails.add(subledgerMap);
                    // Need to handle multiple sub ledgers
                    break;
                }
            }
            reversalVoucher = createVoucher.createVoucher(headerDetails, accountdetails, subledgerdetails);
            reversalVoucher.setStatus(0);
            voucherHeaderService.applyAuditing(reversalVoucher);
            voucherHeaderService.persist(reversalVoucher);
        } catch (final ValidationException e) {
            LOGGER.error("Error in DishonorCheque >>>>" + e);
            final List<ValidationError> errors = new ArrayList<ValidationError>();
            errors.add(new ValidationError("exp", e.getErrors().get(0).getMessage()));
            throw new ValidationException(errors);
        } /*
           * catch (final Exception e) {
           * LOGGER.error("Error in DishonorCheque >>>>" + e); final
           * List<ValidationError> errors = new ArrayList<ValidationError>();
           * errors.add(new ValidationError("exp", e.getMessage())); throw new
           * ValidationException(errors); }
           */
        return reversalVoucher;
    }

    private HashMap<String, Object> createHeaderAndMisDetails(final CVoucherHeader voucherHeader,
            final InstrumentHeader instrumentHeader) throws ValidationException {
        final HashMap<String, Object> headerdetails = new HashMap<String, Object>();
        // All reversal will be GJV
        headerdetails.put(VoucherConstant.VOUCHERNAME, FinancialConstants.JOURNALVOUCHER_NAME_RECEIPT_REVERSAL);
        headerdetails.put(VoucherConstant.VOUCHERTYPE, FinancialConstants.STANDARD_VOUCHER_TYPE_JOURNAL);
        headerdetails.put((String) VoucherConstant.VOUCHERSUBTYPE, voucherHeader.getVoucherSubType());
        headerdetails.put(VoucherConstant.VOUCHERNUMBER, null);
        headerdetails.put(VoucherConstant.VOUCHERDATE, voucherHeader.getVoucherDate());
        headerdetails.put(
                VoucherConstant.DESCRIPTION,
                " Reversal Voucher Entry for receipt number " + voucherHeader.getVoucherNumber() + ", Cheque Number "
                        + instrumentHeader.getInstrumentNumber() + " Cheque Dated :"
                        + instrumentHeader.getInstrumentDate());

        if (voucherHeader.getVouchermis().getDepartmentcode() != null)
            headerdetails
                    .put(VoucherConstant.DEPARTMENTCODE, voucherHeader.getVouchermis().getDepartmentcode());
        if (voucherHeader.getFundId() != null)
            headerdetails.put(VoucherConstant.FUNDCODE, voucherHeader.getFundId().getCode());
        if (voucherHeader.getVouchermis().getSchemeid() != null)
            headerdetails.put(VoucherConstant.SCHEMECODE, voucherHeader.getVouchermis().getSchemeid().getCode());
        if (voucherHeader.getVouchermis().getSubschemeid() != null)
            headerdetails.put(VoucherConstant.SUBSCHEMECODE, voucherHeader.getVouchermis().getSubschemeid().getCode());
        if (voucherHeader.getVouchermis().getFundsource() != null)
            headerdetails.put(VoucherConstant.FUNDSOURCECODE, voucherHeader.getVouchermis().getFundsource().getCode());
        if (voucherHeader.getVouchermis().getDivisionid() != null)
            headerdetails.put(VoucherConstant.DIVISIONID, voucherHeader.getVouchermis().getDivisionid().getId());
        if (voucherHeader.getVouchermis().getFunctionary() != null)
            headerdetails
                    .put(VoucherConstant.FUNCTIONARYCODE, voucherHeader.getVouchermis().getFunctionary().getCode());
        if (voucherHeader.getVouchermis().getFunction() != null)
            headerdetails.put(VoucherConstant.FUNCTIONCODE, voucherHeader.getVouchermis().getFunction().getCode());
        return headerdetails;
    }

    @Override
    @Transactional
    public void updateCollectionsOnInstrumentDishonor(final Long instrumentHeaderId) {
        LOGGER.debug("Update Collection and Billing system for dishonored instrument id: " + instrumentHeaderId);
        final EgwStatus receiptInstrumentBounceStatus = collectionsUtil
                .getReceiptStatusForCode(CollectionConstants.RECEIPT_STATUS_CODE_INSTRUMENT_BOUNCED);
        final EgwStatus receiptCancellationStatus = collectionsUtil
                .getReceiptStatusForCode(CollectionConstants.RECEIPT_STATUS_CODE_CANCELLED);
        final ReceiptHeader receiptHeader = (ReceiptHeader) persistenceService
                .find("select DISTINCT (receipt) from ReceiptHeader receipt "
                        + "join receipt.receiptInstrument as instruments where instruments.id=?"
                        + " and instruments.statusId.code not in (?,?)",
                        Long.valueOf(instrumentHeaderId), receiptInstrumentBounceStatus.getCode(),
                        receiptCancellationStatus.getCode());
        final InstrumentHeader instrumentHeader = (InstrumentHeader) persistenceService.findByNamedQuery(
                CollectionConstants.QUERY_GET_INSTRUMENTHEADER_BY_ID, instrumentHeaderId);
        instrumentHeader.setStatusId(getDishonoredStatus());
        financialsUtil.updateInstrumentHeader(instrumentHeader);
        // update receipts - set status to INSTR_BOUNCED and recon flag to false
        receiptHeaderService.updateDishonoredInstrumentStatus(receiptHeader, instrumentHeader,
                receiptInstrumentBounceStatus, false);
        LOGGER.debug("Updated receipt status to " + receiptInstrumentBounceStatus.getCode()
                + " set reconcilation to false");

    }

    private EgwStatus getDishonoredStatus() {
        return collectionsUtil.getStatusForModuleAndCode(FinancialConstants.STATUS_MODULE_INSTRUMENT,
                FinancialConstants.INSTRUMENT_DISHONORED_STATUS);
    }

    public void setPersistenceService(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    public void setCollectionsUtil(final CollectionsUtil collectionsUtil) {
        this.collectionsUtil = collectionsUtil;
    }

    public void setReceiptHeaderService(final ReceiptHeaderService receiptHeaderService) {
        this.receiptHeaderService = receiptHeaderService;
    }

    public void setFinancialsUtil(final FinancialsUtil financialsUtil) {
        this.financialsUtil = financialsUtil;
    }

    @Override
    public void updateSourceInstrumentVoucher(final String event, final Long instrumentHeaderId) {

    }

    public List<DishonoredChequeBean> getCollectionListForDishonorInstrument(String instrumentMode,String bankId, String accountNumber, String chequeNumber,
            Date chequeDate) {
        try {
            InstrumentSearchContract insSearchContra = new InstrumentSearchContract();
            insSearchContra.setBankAccountNumber(accountNumber != null && Long.parseLong(accountNumber)  > 0 ? accountNumber : null);
            insSearchContra.setInstrumentTypes(instrumentMode);
            insSearchContra.setFinancialStatuses("Deposited");
            insSearchContra.setTransactionType(TransactionType.Debit);
            insSearchContra.setTransactionNumber(chequeNumber);
            insSearchContra.setTransactionDate(chequeDate);
            insSearchContra.setBankId(bankId);
            List<Instrument> instList = microserviceUtils.getInstrumentsBySearchCriteria(insSearchContra );
            Map<String, String> receiptInstMap = instList.stream().map(Instrument::getInstrumentVouchers).flatMap(x -> x.stream()).collect(Collectors.toMap(InstrumentVoucher::getReceiptHeaderId, InstrumentVoucher::getInstrument));
            Set<String> receiptIds = receiptInstMap.keySet();
            ReceiptSearchCriteria rSearchcriteria=null;
            if (paymentSearchEndPointEnabled) {
                final Set<String> serviceCodeLists = new HashSet();
                final Set<String> accNumberList = new HashSet();
                instList.stream().forEach(ins -> {
                    accNumberList.add(ins.getBankAccount().getAccountNumber());
                });
                List<BankAccountServiceMapping> mappings = microserviceUtils
                        .getBankAcntServiceMappingsByBankAcc(StringUtils.join(accNumberList, ","), null);
                for (BankAccountServiceMapping basm : mappings) {
                    serviceCodeLists.add(basm.getBusinessDetails());
                }
                rSearchcriteria = ReceiptSearchCriteria.builder().receiptNumbers(receiptIds)
                        .businessCodes(serviceCodeLists).build();
            } else {
                rSearchcriteria = ReceiptSearchCriteria.builder().receiptNumbers(receiptIds).build();
            }
            List<Receipt> receipt = microserviceUtils.getReceipt(rSearchcriteria);
            Map<String, Receipt> receiptIdToReceiptMap= null;
            switch (ApplicationThreadLocals.getCollectionVersion().toUpperCase()) {
            case "V2":
                receiptIdToReceiptMap = receipt.stream().collect(Collectors.toMap(Receipt::getPaymentId, Function.identity()));
                break;

            default:
                receiptIdToReceiptMap = receipt.stream().collect(Collectors.toMap(Receipt::getReceiptNumber, Function.identity()));
                break;
            }
            final Map<String, Receipt> receiptIdToReceiptMapTemp = receiptIdToReceiptMap;
            List<DishonoredChequeBean> dishonoredChequeList = new ArrayList<>();
            instList.stream().filter(ins -> receiptIdToReceiptMapTemp.containsKey(ins.getInstrumentVouchers().get(0).getReceiptHeaderId())).forEach(ins -> {
                DishonoredChequeBean chequeBean = new DishonoredChequeBean();
                String voucherNumber = ins.getInstrumentVouchers().get(0).getVoucherHeaderId();
                CVoucherHeader receiptVoucherHeader = getVoucherByNumber(voucherNumber);
                CVoucherHeader payInSlipVoucher = getVoucherById(Long.parseLong(ins.getPayinSlipId()));
                chequeBean.setReceiptNumber(receiptIdToReceiptMapTemp.get(ins.getInstrumentVouchers().get(0).getReceiptHeaderId()).getReceiptNumber());
                chequeBean.setReceiptDate(receiptIdToReceiptMapTemp.get(ins.getInstrumentVouchers().get(0).getReceiptHeaderId()).getReceiptDate());
                chequeBean.setVoucherNumber(receiptVoucherHeader.getVoucherNumber());
                chequeBean.setVoucherHeaderId(receiptVoucherHeader.getId());
                chequeBean.setReceiptSourceUrl(receiptVoucherHeader.getVouchermis().getSourcePath());
                chequeBean.setInstrumentNumber(ins.getTransactionNumber());
                chequeBean.setInstHeaderIds(ins.getId());
                chequeBean.setInstrumentDate(ins.getTransactionDate().toString());
                chequeBean.setTransactionDate(ins.getTransactionDate());
                chequeBean.setInstrumentAmount(ins.getAmount());
                chequeBean.setBankName(getBankName(ins));
                chequeBean.setAccountNumber(ins.getBankAccount().getAccountNumber());
                chequeBean.setPayTo(ins.getPayee());
                chequeBean.setService(receiptIdToReceiptMapTemp.get(ins.getInstrumentVouchers().get(0).getReceiptHeaderId()).getService());
                populateReceiptVoucherAccountDetails(receiptVoucherHeader, chequeBean);
                populateReversalVoucherAccountDetails(receiptVoucherHeader, payInSlipVoucher, chequeBean);
                dishonoredChequeList.add(chequeBean);
            });
            return dishonoredChequeList;
        } catch (ObjectNotFoundException e) {
            LOGGER.error("Error in Cheques Dishonoring Listing :: ",e);
            throw e;
        }
    }

    private void populateReversalVoucherAccountDetails(CVoucherHeader receiptVoucher, CVoucherHeader payInSlipVoucher, DishonoredChequeBean chequeBean) {
        try {
            List<CGeneralLedger> accountCodeForReceiptVoucher = getAccountCodeForVoucher(receiptVoucher.getId());
            List<CGeneralLedger> accountCodeForPayInSlipVoucher = getAccountCodeForVoucher(payInSlipVoucher.getId());
            Map<String, Double> ledgerAmountMap = new LinkedHashMap<>();
            for(CGeneralLedger gl : accountCodeForReceiptVoucher){
                Double amount = gl.getCreditAmount() - gl.getDebitAmount();
                if(ledgerAmountMap.get(gl.getGlcode()) != null){
                    ledgerAmountMap.put(gl.getGlcode(), ledgerAmountMap.get(gl.getGlcode()) + amount);
                }else{
                    ledgerAmountMap.put(gl.getGlcode(), amount);
                }
            }
            Double amountCreditToBank = 0d;
            for(CGeneralLedger gl : accountCodeForPayInSlipVoucher){
                Double amount = gl.getCreditAmount() - gl.getDebitAmount();
                if(ledgerAmountMap.get(gl.getGlcode()) != null){
                    amountCreditToBank = ledgerAmountMap.get(gl.getGlcode());
                    ledgerAmountMap.remove(gl.getGlcode());
                }else{
                    ledgerAmountMap.put(gl.getGlcode(), amountCreditToBank);
                }
            }
            List<CChartOfAccounts> chartOfAccounts = getChartOfAccounts(ledgerAmountMap.keySet());
            Map<String, CChartOfAccounts> coaMap = chartOfAccounts.stream().collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
            chequeBean.setPayInSlipVoucherGLDetails(new ArrayList<>());
            ledgerAmountMap.keySet().stream().forEach(ac -> {
                if(ledgerAmountMap.get(ac) != 0){
                    DishonoredChequeBean.AccountCode accountCode = new DishonoredChequeBean.AccountCode (ac, coaMap.get(ac).getName() , ledgerAmountMap.get(ac) <= 0 ? 0 : ledgerAmountMap.get(ac), ledgerAmountMap.get(ac) >= 0 ? 0 : -ledgerAmountMap.get(ac));
                    chequeBean.getPayInSlipVoucherGLDetails().add(accountCode);
                }
            });
            
        } catch (ObjectNotFoundException e) {
            LOGGER.error("Error occurred in populateReversalVoucherAccountDetails : ",e);
            throw e;
        }
    }

    private String getBankName(Instrument ins) {
        StringBuilder query = new StringBuilder("from Bankaccount ba where ba.accountnumber=:bankaccount");
        if(ins.getBank().getId() != null){
            query.append(" and ba.bankbranch.bank.id=:bankId");
        }
        Query createQuery = persistenceService.getSession().createQuery(query.toString());
        createQuery.setParameter("bankaccount", ins.getBankAccount().getAccountNumber());
        if(ins.getBank().getId() != null){
            createQuery.setParameter("bankId", ins.getBank().getId().intValue());
        }
        Bankaccount bankAccount = (Bankaccount) createQuery.uniqueResult();
        return bankAccount.getBankbranch().getBank().getName();
    }

    private void populateReceiptVoucherAccountDetails(CVoucherHeader cVoucherHeader, DishonoredChequeBean chequeBean) {
        try {
            List<CGeneralLedger> accountCodeForVoucher = getAccountCodeForVoucher(cVoucherHeader.getId());
            Set<String> glcodeSet = accountCodeForVoucher.stream().map(CGeneralLedger::getGlcode).collect(Collectors.toSet());
            List<CChartOfAccounts> chartOfAccounts = getChartOfAccounts(glcodeSet);
            Map<String, CChartOfAccounts> coaMap = chartOfAccounts.stream().collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
            chequeBean.setReceiptVoucherGLDetails(new ArrayList<>());
            accountCodeForVoucher.stream().forEach(ac -> {
                DishonoredChequeBean.AccountCode accountCode = new DishonoredChequeBean.AccountCode (ac.getGlcode(), coaMap.get(ac.getGlcode()).getName(), ac.getDebitAmount() == null ? 0 : ac.getDebitAmount() , ac.getCreditAmount() == null ? 0 : ac.getCreditAmount());
                chequeBean.getReceiptVoucherGLDetails().add(accountCode);
            });
        } catch (ObjectNotFoundException e) {
            LOGGER.error("Error occurred in populateReceiptVoucherAccountDetails : ",e);
            throw e;
        }
    }

    private String getInstrument(String instrumentMode) {
        return instrumentMode.equals("cheque") ? "Cheque": instrumentMode.equals("dd") ? "DD" : null;
    }
    
    private CVoucherHeader getVoucherByNumber(String voucherNumber) {
        return (CVoucherHeader)persistenceService.find(VOUCHER_SEARCH_QUERY, voucherNumber);
    }
    
    private CVoucherHeader getVoucherById(Long vhId) {
        return persistenceService.getSession().get(CVoucherHeader.class, vhId);
    }

    public List<CGeneralLedger> getAccountCodeForVoucher(Long vouhcerHeaderId) {
        return persistenceService.findAllBy(" from CGeneralLedger where voucherHeaderId.id=? order by id asc",vouhcerHeaderId);
    }

    public List<CChartOfAccounts> getChartOfAccounts(Set<String> glcodeSet) {
        List list = persistenceService.getSession().createCriteria(CChartOfAccounts.class).add(Restrictions.in("glcode", glcodeSet)).list();
        return list;
    }

    public void processDishonor(DishonoredChequeBean model) {
        List<Receipt> receiptList = new ArrayList<>();
        Set<String> paymentIdSet = new HashSet();
        Set<String> receiptNumbers = new HashSet();
        final Set<String> accNumberList = new HashSet();
        final List<String> serviceCodeList = new ArrayList<>();
        List<Instrument> instruments = microserviceUtils.getInstruments(model.getInstHeaderIds());
        FinancialStatus finStatus = new FinancialStatus();
        finStatus.setCode("Dishonored");
        finStatus.setId("Dishonored");
        finStatus.setDescription("Status assign when instrument is Dishonored");
        instruments.stream().forEach(ins -> {
            DishonorReasonContract dishonorReasonContract = new DishonorReasonContract().builder()
                    .reason(model.getDishonorReason())
                    .remarks(model.getRemarks())
                    .dishonorDate(model.getDishonorDate().getTime())
                    .instrument(ins.getId())
                    .build();
            ins.setDishonor(dishonorReasonContract);
            ins.getInstrumentVouchers().stream().forEach(insVou -> {
                receiptNumbers.add(insVou.getReceiptHeaderId());
               });
            accNumberList.add(ins.getBankAccount().getAccountNumber());
        });
        microserviceUtils.updateInstruments(instruments, null, finStatus );
        // calling cancel receipt api
        if (!receiptNumbers.isEmpty()) {
            if (paymentSearchEndPointEnabled) {
                List<BankAccountServiceMapping> mappings = microserviceUtils
                        .getBankAcntServiceMappingsByBankAcc(StringUtils.join(accNumberList, ","), null);
                for (BankAccountServiceMapping basm : mappings) {
                    serviceCodeList.add(basm.getBusinessDetails());
                }
                receiptList = microserviceUtils.getReceiptsList(StringUtils.join(receiptNumbers, ","),
                        StringUtils.join(serviceCodeList, ","));
            } else {
                receiptList = microserviceUtils.getReceipts(StringUtils.join(receiptNumbers, ","));
            }
            for (Receipt receipts : receiptList) {
                paymentIdSet.add(receipts.getPaymentId());
                break;
            }
            switch (ApplicationThreadLocals.getCollectionVersion().toUpperCase()) {
            case "V2":
            case "VERSION2":
                if (!paymentIdSet.isEmpty()) {
                    if (paymentSearchEndPointEnabled) {
                        microserviceUtils.performWorkflowWithModuleName(paymentIdSet,
                                PaymentWorkflow.PaymentAction.DISHONOUR, model.getDishonorReason(), StringUtils.join(serviceCodeList, ","));
                    } else {
                        microserviceUtils.performWorkflow(paymentIdSet, PaymentWorkflow.PaymentAction.DISHONOUR,
                                model.getDishonorReason());
                    }
                }
                break;

            default:
                for (final Receipt receiptHeader : receiptList) {
                    receiptHeader.getBill().get(0).getBillDetails().get(0).setStatus("Cancelled");
                    receiptHeader.getInstrument().setTenantId(receiptHeader.getTenantId());
                    receiptHeader.getBill().get(0).setPayerName(receiptHeader.getBill().get(0).getPaidBy());
                }
                ReceiptResponse response = microserviceUtils.updateReceipts(new ArrayList<>(receiptList));
                break;
            }
        }
    }
    
    private void prepareDishonouredSearchCriteria(DishonoredChequeBean model, InstrumentSearchContract criteria) {
        criteria.setFinancialStatuses("Dishonored");
        
        if(StringUtils.isNotBlank(model.getAccountNumber())){
            criteria.setBankAccountNumber(model.getAccountNumber());
        }
        if(StringUtils.isNotBlank(model.getInstrumentMode())){
            criteria.setInstrumentTypes(model.getInstrumentMode());
        }
        if(StringUtils.isNotBlank(model.getInstrumentNumber())){
            criteria.setTransactionNumber(model.getInstrumentNumber());
        }
        criteria.setTransactionFromDate(model.getFromDate());
        criteria.setTransactionToDate(model.getToDate());
        
    }
    public List<DishonoredChequeBean> getDishonouredChequeReport(DishonoredChequeBean model) {
        try {
            InstrumentSearchContract insSearchContra = new InstrumentSearchContract();
            this.prepareDishonouredSearchCriteria(model, insSearchContra);
            List<Instrument> instList = microserviceUtils.getInstrumentsBySearchCriteria(insSearchContra );
            Map<String, String> receiptInstMap = instList.stream().map(Instrument::getInstrumentVouchers).flatMap(x -> x.stream()).collect(Collectors.toMap(InstrumentVoucher::getReceiptHeaderId, InstrumentVoucher::getInstrument));
            Set<String> receiptIds = receiptInstMap.keySet();
            ReceiptSearchCriteria rSearchcriteria=null;
            if (paymentSearchEndPointEnabled) {
                final Set<String> serviceCodeLists = new HashSet();
                final Set<String> accNumberList = new HashSet();
                instList.stream().forEach(ins -> {
                    accNumberList.add(ins.getBankAccount().getAccountNumber());
                    LOGGER.info("AccountNumer ---+ins.getBankAccount().getAccountNumber()");
                });
                LOGGER.info("AccountNumer ---+accNumberList");
                List<BankAccountServiceMapping> mappings = microserviceUtils
                        .getBankAcntServiceMappingsByBankAcc(StringUtils.join(accNumberList, ","), null);
                for (BankAccountServiceMapping basm : mappings) {
                    serviceCodeLists.add(basm.getBusinessDetails());
                }
                rSearchcriteria = ReceiptSearchCriteria.builder().receiptNumbers(receiptIds)
                        .businessCodes(serviceCodeLists).build();
            } else {
                rSearchcriteria = ReceiptSearchCriteria.builder().receiptNumbers(receiptIds).build();
            }
            List<Receipt> receipt = microserviceUtils.getReceipt(rSearchcriteria);
            Map<String, Receipt> receiptIdToReceiptMap= null;
            switch (ApplicationThreadLocals.getCollectionVersion().toUpperCase()) {
            case "V2":
                receiptIdToReceiptMap = receipt.stream().collect(Collectors.toMap(Receipt::getPaymentId, Function.identity()));
                break;

            default:
                receiptIdToReceiptMap = receipt.stream().collect(Collectors.toMap(Receipt::getReceiptNumber, Function.identity()));
                break;
            }
            final Map<String, Receipt> receiptIdToReceiptMapTemp = receiptIdToReceiptMap;
            List<DishonoredChequeBean> dishonoredChequeList = new ArrayList<>();
            instList.stream().filter(ins -> receiptIdToReceiptMapTemp.containsKey(ins.getInstrumentVouchers().get(0).getReceiptHeaderId())).forEach(ins -> {
                DishonoredChequeBean chequeBean = new DishonoredChequeBean();
                String voucherNumber = ins.getInstrumentVouchers().get(0).getVoucherHeaderId();
                CVoucherHeader receiptVoucherHeader = getVoucherByNumber(voucherNumber);
                CVoucherHeader payInSlipVoucher = getVoucherById(Long.parseLong(ins.getPayinSlipId()));
                chequeBean.setReceiptNumber(receiptIdToReceiptMapTemp.get(ins.getInstrumentVouchers().get(0).getReceiptHeaderId()).getReceiptNumber());
                chequeBean.setVoucherNumber(receiptVoucherHeader.getVoucherNumber());
                chequeBean.setVoucherHeaderId(receiptVoucherHeader.getId());
                chequeBean.setReceiptSourceUrl(receiptVoucherHeader.getVouchermis().getSourcePath());
                chequeBean.setInstrumentNumber(ins.getTransactionNumber());
                chequeBean.setTransactionDate(ins.getTransactionDate());
                chequeBean.setInstHeaderIds(ins.getId());
                chequeBean.setInstrumentDate(ins.getTransactionDate().toString());
                chequeBean.setInstrumentAmount(ins.getAmount());
                chequeBean.setBankName(getBankName(ins));
                chequeBean.setAccountNumber(ins.getBankAccount().getAccountNumber());
                Long dateVal=ins.getDishonor().getDishonorDate();
                Date date=new Date(dateVal); 
                chequeBean.setDishonorDate(date);
                chequeBean.setDishonorReason(ins.getDishonor().getReason());
                chequeBean.setService(receiptIdToReceiptMapTemp.get(ins.getInstrumentVouchers().get(0).getReceiptHeaderId()).getService());
                dishonoredChequeList.add(chequeBean);
            });
            return dishonoredChequeList;
        } catch (ObjectNotFoundException e) {
            LOGGER.error("Error in report Cheques Dishonoring Listing :: ",e);
            throw e;
        }
    }

    public void validateManadatoryFields(final DishonoredChequeBean chequeBean, final BindingResult resultBinder) {
        if (StringUtils.isEmpty(chequeBean.getRemarks()) || chequeBean.getRemarks() == null)
            resultBinder.reject("Remarks is Required");
        if (StringUtils.isEmpty(chequeBean.getDishonorReason()) || chequeBean.getDishonorReason() == null)
            resultBinder.reject("DishonourReason is Required");
        if (chequeBean.getDishonorDate() == null)
            resultBinder.reject("TransactionDate is Required");
    }

    public void validateBeforeSearch(final DishonoredChequeBean chequeBean, final BindingResult resultBinder) {
        if (StringUtils.isEmpty(chequeBean.getInstrumentMode()) || chequeBean.getInstrumentMode() == null)
            resultBinder.reject("msg.please.select.instrument.mode");
        if (StringUtils.isEmpty(chequeBean.getInstrumentNumber()) || chequeBean.getInstrumentNumber() == null)
            resultBinder.reject("msg.please.enter.cheque.dd.number");
        if (chequeBean.getTransactionDate() == null)
            resultBinder.reject("msg.please.select.cheque.dd.date");
    }
}