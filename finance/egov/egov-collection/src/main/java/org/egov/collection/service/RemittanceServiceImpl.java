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

package org.egov.collection.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.egov.billsaccounting.services.VoucherConstant;
import org.egov.collection.bean.ReceiptBean;
import org.egov.collection.constants.CollectionConstants;
import org.egov.collection.entity.BranchUserMap;
import org.egov.collection.entity.ReceiptHeader;
import org.egov.collection.entity.Remittance;
import org.egov.collection.entity.RemittanceDetail;
import org.egov.collection.entity.RemittanceInstrument;
import org.egov.collection.integration.services.RemittanceSchedulerService;
import org.egov.collection.utils.CollectionsNumberGenerator;
import org.egov.collection.utils.CollectionsUtil;
import org.egov.collection.utils.FinancialsUtil;
import org.egov.commons.Bankaccount;
import org.egov.commons.CFinancialYear;
import org.egov.commons.CVoucherHeader;
import org.egov.commons.EgwStatus;
import org.egov.commons.Fund;
import org.egov.commons.dao.ChartOfAccountsDAO;
import org.egov.commons.dao.FunctionHibernateDAO;
import org.egov.commons.dao.FundHibernateDAO;
import org.egov.commons.entity.Source;
import org.egov.infra.microservice.models.BusinessDetails;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.models.FinancialStatus;
import org.egov.infra.microservice.models.Instrument;
import org.egov.infra.microservice.models.InstrumentAccountCode;
import org.egov.infra.microservice.models.InstrumentResponse;
import org.egov.infra.microservice.models.InstrumentVoucher;
import org.egov.infra.microservice.models.Receipt;
import org.egov.infra.microservice.models.RemittanceResponse;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infra.utils.DateUtils;
import org.egov.infra.validation.exception.ValidationError;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.infstr.models.ServiceDetails;
import org.egov.infstr.services.PersistenceService;
import org.egov.model.instrument.InstrumentHeader;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public class RemittanceServiceImpl extends RemittanceService {
    private static final long serialVersionUID = 5581301494846870670L;
    private static final Logger LOGGER = Logger.getLogger(ReceiptHeaderService.class);
    private CollectionsUtil collectionsUtil;
    private FinancialsUtil financialsUtil;
    private ReceiptHeaderService receiptHeaderService;
    private PersistenceService persistenceService;
    private CollectionsNumberGenerator collectionsNumberGenerator;
    @Autowired
    private FundHibernateDAO fundHibernateDAO;
    @Autowired
    private FunctionHibernateDAO functionHibernateDAO;
    @Autowired
    private ChartOfAccountsDAO chartOfAccountsDAO;
    private PersistenceService<Remittance, Long> remittancePersistService;
    @Autowired
    @Qualifier("branchUserMapService")
    private PersistenceService<BranchUserMap, Long> branchUserMapService;
    @Autowired
    @Qualifier("remittanceInstrumentService")
    private PersistenceService<RemittanceInstrument, Long> remittanceInstrumentService;
    @Autowired
    private transient RemittanceSchedulerService remittanceSchedulerService;
    @Autowired
    private MicroserviceUtils microserviceUtils;

    /**
     * Create Contra Vouchers
     *
     * @return List of Contra Vouchers Created
     */
    @Transactional
    @Override
    public List<Receipt> createCashBankRemittance(List<ReceiptBean> receiptList, final String accountNumberId,
            final Date remittanceDate) {

        final Set<Receipt> bankRemittanceList = new HashSet<>();
        final SimpleDateFormat dateFomatter = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());

        InstrumentAccountCode accountCode = microserviceUtils
                .getInstrumentAccountCodeByType(CollectionConstants.INSTRUMENTTYPE_NAME_CASH);

        final String cashInHandQueryString = "SELECT COA.GLCODE FROM CHARTOFACCOUNTS COA WHERE COA.GLCODE = '"
                + accountCode.getAccountCode().getGlcode()
                + "'";
        final Query cashInHand = persistenceService.getSession().createSQLQuery(cashInHandQueryString);

        String cashInHandGLCode = null;

        if (!cashInHand.list().isEmpty())
            cashInHandGLCode = cashInHand.list().get(0).toString();

        final String createVoucher = collectionsUtil.getAppConfigValue(CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
                CollectionConstants.APPCONFIG_VALUE_CREATEVOUCHER_FOR_REMITTANCE);

        final String functionCode = collectionsUtil.getAppConfigValue(CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
                CollectionConstants.APPCONFIG_VALUE_COLLECTION_BANKREMITTANCE_FUNCTIONCODE);

        FinancialStatus instrmentStatusNew = microserviceUtils
                .getInstrumentStatusByCode(CollectionConstants.INSTRUMENT_NEW_STATUS);

        Boolean showRemitDate = false;
        BigDecimal totalCashAmt = BigDecimal.ZERO;
        BigDecimal totalCashVoucherAmt = BigDecimal.ZERO;
        String fundCode = "";
        Date voucherDate = null;
        if (collectionsUtil
                .getAppConfigValue(CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
                        CollectionConstants.APPCONFIG_VALUE_COLLECTION_BANKREMITTANCE_SHOWREMITDATE)
                .equals(CollectionConstants.YES))
            showRemitDate = true;

        final Bankaccount depositedBankAccount = (Bankaccount) persistenceService.find("from Bankaccount where accountnumber=?",
                accountNumberId);
        final String serviceGlCode = depositedBankAccount.getChartofaccounts().getGlcode();
        List<Receipt> receipts;
        final HashSet<String> receiptIds = new HashSet<>(0);
        for (ReceiptBean receipt : receiptList) {
            if (receipt.getFund() != null && !receipt.getFund().isEmpty())
                fundCode = receipt.getFund();
            if (showRemitDate && remittanceDate != null)
                voucherDate = remittanceDate;
            else
                try {
                    voucherDate = collectionsUtil.getRemittanceVoucherDate(dateFomatter.parse(receipt.getReceiptDate()));
                } catch (final ParseException e) {
                    LOGGER.error("Error Parsing Date", e);
                }
            if (receipt.getService() != null && receipt.getService().length() > 0) {
                BusinessDetails businessDetails = microserviceUtils.getBusinessDetailsByCode(receipt.getService());
                // If Cash Amount is present
                if (receipt.getInstrumentAmount() != null && cashInHandGLCode != null) {

                    receipts = microserviceUtils.getReceipts(CollectionConstants.RECEIPT_STATUS_APPROVED, receipt.getService(),
                            receipt.getFund(), receipt.getDepartment(), receipt.getReceiptDate());
                    if (receipts != null) {
                        for (Receipt r : receipts) {
                            receiptIds.add(r.getBill().get(0).getBillDetails().get(0).getId());
                        }
                    }

                    List<Instrument> instruments = microserviceUtils.getInstrumentsByReceiptIds(
                            CollectionConstants.INSTRUMENTTYPE_NAME_CASH, instrmentStatusNew.getId(),
                            StringUtils.join(receiptIds, ","));

                    totalCashAmt = totalCashAmt.add(receipt.getInstrumentAmount());
                    if (CollectionConstants.YES.equalsIgnoreCase(createVoucher) && businessDetails.getVoucherCreation()) {
                        totalCashVoucherAmt = totalCashVoucherAmt.add(receipt.getInstrumentAmount());
                    } else {
                        InstrumentResponse instrumentResponse = microserviceUtils.reconcileInstruments(instruments,
                                accountNumberId);
                    }

                    bankRemittanceList.addAll(receipts);
                }
            }
        }
        if (totalCashVoucherAmt.compareTo(totalCashAmt) != 0) {
            String validationMessage = "There is a difference of amount " + totalCashAmt.subtract(totalCashVoucherAmt)
                    + " between bank challan and the remittance voucher , please contact system administrator ";
            throw new ValidationException(Arrays.asList(new ValidationError(validationMessage, validationMessage)));
        }
        final Remittance remittance = populateAndPersistRemittance(totalCashAmt, BigDecimal.ZERO, fundCode,
                cashInHandGLCode, null, serviceGlCode, functionCode, bankRemittanceList, createVoucher,
                voucherDate, depositedBankAccount, totalCashVoucherAmt, BigDecimal.ZERO, Collections.EMPTY_LIST);

        for (final Receipt receiptHeader : bankRemittanceList) {
            receiptHeader.getBill().get(0).getBillDetails().get(0).setStatus("Remitted");
        }
        microserviceUtils.updateReceipts(new ArrayList<>(bankRemittanceList));
        return new ArrayList(bankRemittanceList);
    }

    @Transactional
    public CVoucherHeader createVoucherForRemittance(final String cashInHandGLCode, final String chequeInHandGLcode,
            final String serviceGLCode, final String functionCode, final BigDecimal totalCashVoucherAmt,
            final BigDecimal totalChequeVoucherAmt, final Date voucherDate, final String fundCode) {
        CVoucherHeader voucherHeader;
        final List<HashMap<String, Object>> accountCodeList = new ArrayList<>(0);
        HashMap<String, Object> accountcodedetailsHashMap;
        if (totalCashVoucherAmt.compareTo(BigDecimal.ZERO) > 0 && !cashInHandGLCode.isEmpty()) {
            accountcodedetailsHashMap = prepareAccountCodeDetails(cashInHandGLCode, functionCode, totalCashVoucherAmt,
                    BigDecimal.ZERO);
            accountCodeList.add(accountcodedetailsHashMap);
        }
        if (totalChequeVoucherAmt.compareTo(BigDecimal.ZERO) > 0 && !chequeInHandGLcode.isEmpty()) {
            accountcodedetailsHashMap = prepareAccountCodeDetails(chequeInHandGLcode, functionCode,
                    totalChequeVoucherAmt, BigDecimal.ZERO);
            accountCodeList.add(accountcodedetailsHashMap);
        }
        final BigDecimal totalDebitAmount = totalChequeVoucherAmt.add(totalCashVoucherAmt);
        if (!serviceGLCode.isEmpty()) {
            accountcodedetailsHashMap = prepareAccountCodeDetails(serviceGLCode, functionCode, BigDecimal.ZERO,
                    totalDebitAmount);
            accountCodeList.add(accountcodedetailsHashMap);
        }
        voucherHeader = financialsUtil.createRemittanceVoucher(prepareHeaderDetails(fundCode, voucherDate),
                accountCodeList, new ArrayList<HashMap<String, Object>>(0));
        return voucherHeader;
    }

    @SuppressWarnings("unchecked")
    public List<ReceiptHeader> getRemittanceList(final ServiceDetails serviceDetails,
            final List<InstrumentHeader> instrumentHeaderList) {
        final List<Long> instHeaderList = new ArrayList<>();
        for (final InstrumentHeader instHead : instrumentHeaderList)
            instHeaderList.add(instHead.getId());
        final List<ReceiptHeader> bankRemittanceList = new ArrayList<>();
        final List<ReceiptHeader> receiptHeaders = persistenceService.findAllByNamedQuery(
                CollectionConstants.QUERY_RECEIPTS_BY_INSTRUMENTHEADER_AND_SERVICECODE, serviceDetails.getCode(),
                instHeaderList);
        bankRemittanceList.addAll(receiptHeaders);
        return bankRemittanceList;
    }

    @Transactional
    public Remittance populateAndPersistRemittance(final BigDecimal totalCashAmount, final BigDecimal totalChequeAmount,
            final String fundCode, final String cashInHandGLCode, final String chequeInHandGLcode,
            final String serviceGLCode, final String functionCode, final Set<Receipt> receiptHeadList,
            final String createVoucher, final Date voucherDate, final Bankaccount depositedBankAccount,
            final BigDecimal totalCashVoucherAmt, final BigDecimal totalChequeVoucherAmt, List<String> instrumentId) {
        FinancialStatus instrmentStatusNew = microserviceUtils
                .getInstrumentStatusByCode(CollectionConstants.INSTRUMENT_NEW_STATUS);
        CVoucherHeader voucherHeader;
        final CFinancialYear financialYear = collectionsUtil.getFinancialYearforDate(new Date());
        BigDecimal totalAmount = BigDecimal.ZERO;
        final Remittance remittance = new Remittance();
        final List<RemittanceDetail> remittanceDetailsList = new ArrayList<>();
        Boolean isChequeAmount = Boolean.FALSE;
        remittance.setReferenceDate(voucherDate);
        final EgwStatus receiptStatusApproved = collectionsUtil.getStatusForModuleAndCode(
                CollectionConstants.MODULE_NAME_REMITTANCE, CollectionConstants.REMITTANCE_STATUS_CODE_APPROVED);
        remittance.setStatus(receiptStatusApproved);
        remittance.setReferenceNumber(collectionsNumberGenerator.generateRemittanceNumber(financialYear));
        remittance.setFund(fundHibernateDAO.fundByCode(fundCode));
        remittance.setFunction(functionHibernateDAO.getFunctionByCode(functionCode));
        remittance.setCollectionRemittance(new HashSet<ReceiptHeader>());
        remittance.setBankAccount(depositedBankAccount);
        if (totalCashAmount != null && totalCashAmount.compareTo(BigDecimal.ZERO) > 0 && cashInHandGLCode != null) {
            remittanceDetailsList
                    .addAll(getRemittanceDetailsList(totalCashAmount, BigDecimal.ZERO, cashInHandGLCode, remittance));
            totalAmount = totalAmount.add(totalCashAmount);
        }
        if (totalChequeAmount != null && totalChequeAmount.compareTo(BigDecimal.ZERO) > 0
                && chequeInHandGLcode != null) {
            remittanceDetailsList.addAll(
                    getRemittanceDetailsList(totalChequeAmount, BigDecimal.ZERO, chequeInHandGLcode, remittance));
            totalAmount = totalAmount.add(totalChequeAmount);
            isChequeAmount = Boolean.TRUE;
        }
        remittanceDetailsList.addAll(getRemittanceDetailsList(BigDecimal.ZERO, totalAmount, serviceGLCode, remittance));
        remittance.setRemittanceDetails(new HashSet<RemittanceDetail>(remittanceDetailsList));
        HashSet<RemittanceInstrument> remittanceInstrumentSet = new HashSet<RemittanceInstrument>();
        if (CollectionConstants.YES.equalsIgnoreCase(createVoucher)
                && (totalCashVoucherAmt.compareTo(BigDecimal.ZERO) > 0
                        || totalChequeVoucherAmt.compareTo(BigDecimal.ZERO) > 0)) {
            voucherHeader = createVoucherForRemittance(cashInHandGLCode, chequeInHandGLcode, serviceGLCode,
                    functionCode, totalCashVoucherAmt, totalChequeVoucherAmt, voucherDate, fundCode);
            remittance.setVoucherHeader(voucherHeader);
            for (Receipt receiptHeader : receiptHeadList) {
                List<Instrument> instruments = microserviceUtils.getInstrumentsByReceiptIds(
                        CollectionConstants.INSTRUMENTTYPE_NAME_CASH, instrmentStatusNew.getId(),
                        receiptHeader.getBill().get(0).getBillDetails().get(0).getId());
                for (Instrument instHead : instruments) {
                    if (!isChequeAmount || (isChequeAmount && instrumentId.contains(instHead.getId().toString())))
                        remittanceInstrumentSet.add(prepareRemittanceInstrument(remittance, instHead));
                }
            }
            remittance.setRemittanceInstruments(remittanceInstrumentSet);
            RemittanceResponse response = create(remittance);
        }
        return remittance;
    }

    private RemittanceResponse create(Remittance remittance) {
        org.egov.infra.microservice.models.Remittance r = new org.egov.infra.microservice.models.Remittance();
        r.setBankaccount(remittance.getBankAccount().getAccountnumber());
        r.setFunction(remittance.getFunction().getCode());
        r.setFund(remittance.getFund().getCode());
        r.setReasonForDelay(remittance.getReasonForDelay());
        r.setReferenceNumber(remittance.getReferenceNumber());
        r.setReferenceDate(remittance.getReferenceDate().getTime());
        r.setRemarks(remittance.getRemarks());
        r.setTenantId(microserviceUtils.getTenentId());
        r.setVoucherHeader(remittance.getVoucherHeader().getVoucherNumber());
        r.setRemittanceDetails(new HashSet<>());
        r.setRemittanceInstruments(new HashSet<>());
        org.egov.infra.microservice.models.RemittanceDetail rd;
        for (RemittanceDetail detail : remittance.getRemittanceDetails()) {
            rd = new org.egov.infra.microservice.models.RemittanceDetail();
            rd.setChartOfAccount(detail.getChartOfAccount().getGlcode());
            rd.setCreditAmount(detail.getCreditAmount());
            rd.setDebitAmount(detail.getDebitAmount());
            r.getRemittanceDetails().add(rd);
        }
        org.egov.infra.microservice.models.RemittanceInstrument ri;
        for (RemittanceInstrument instrument : remittance.getRemittanceInstruments()) {
            ri = new org.egov.infra.microservice.models.RemittanceInstrument();
            ri.setInstrument(instrument.getInstrument().getId());
            ri.setReconciled(instrument.getReconciled());
            r.getRemittanceInstruments().add(ri);
        }
        return microserviceUtils.createRemittance(Collections.singletonList(r));
    }

    private RemittanceInstrument prepareRemittanceInstrument(Remittance remittance, Instrument instrumentHeader) {
        RemittanceInstrument remittanceInstrument = new RemittanceInstrument();
        remittanceInstrument.setRemittance(remittance);
        remittanceInstrument.setInstrument(instrumentHeader);
        remittanceInstrument.setReconciled(Boolean.FALSE);
        return remittanceInstrument;
    }

    public HashMap<String, Object> prepareAccountCodeDetails(final String glCode, final String functionCode,
            final BigDecimal creditAmount, final BigDecimal debitAmount) {
        final HashMap<String, Object> accountcodedetailsHashMap = new HashMap<>(0);
        accountcodedetailsHashMap.put(VoucherConstant.GLCODE, glCode);
        accountcodedetailsHashMap.put(VoucherConstant.FUNCTIONCODE, functionCode);
        accountcodedetailsHashMap.put(VoucherConstant.CREDITAMOUNT, creditAmount);
        accountcodedetailsHashMap.put(VoucherConstant.DEBITAMOUNT, debitAmount);
        return accountcodedetailsHashMap;
    }

    public HashMap<String, Object> prepareHeaderDetails(final String fundCode, final Date voucherDate) {
        final HashMap<String, Object> headerdetails = new HashMap<>(0);
        if (collectionsUtil.getVoucherType()) {
            headerdetails.put(VoucherConstant.VOUCHERNAME, CollectionConstants.FINANCIAL_RECEIPTS_VOUCHERNAME);
            headerdetails.put(VoucherConstant.VOUCHERTYPE, CollectionConstants.FINANCIAL_RECEIPTS_VOUCHERTYPE);
        } else {
            headerdetails.put(VoucherConstant.VOUCHERNAME, CollectionConstants.FINANCIAL_CONTRATVOUCHER_VOUCHERNAME);
            headerdetails.put(VoucherConstant.VOUCHERTYPE, CollectionConstants.FINANCIAL_CONTRAVOUCHER_VOUCHERTYPE);
        }
        headerdetails.put(VoucherConstant.DESCRIPTION, CollectionConstants.FINANCIAL_VOUCHERDESCRIPTION);
        headerdetails.put(VoucherConstant.VOUCHERDATE, voucherDate);
        headerdetails.put(VoucherConstant.FUNDCODE, fundCode);
        headerdetails.put(VoucherConstant.DEPARTMENTCODE, CollectionConstants.DEPT_CODE_FOR_ACCOUNTS);
        return headerdetails;
    }

    public List<RemittanceDetail> getRemittanceDetailsList(final BigDecimal creditAmount, final BigDecimal debitAmount,
            final String glCode, final Remittance remittance) {
        final List<RemittanceDetail> remittanceDetailsList = new ArrayList<>();
        final RemittanceDetail remittanceDetail = new RemittanceDetail();
        remittanceDetail.setCreditAmount(creditAmount);
        remittanceDetail.setDebitAmount(debitAmount);
        remittanceDetail.setRemittance(remittance);
        remittanceDetail.setChartOfAccount(chartOfAccountsDAO.getCChartOfAccountsByGlCode(glCode));
        remittanceDetailsList.add(remittanceDetail);
        return remittanceDetailsList;
    }

    /**
     * Method to find all the Cash instruments with status as :new and
     *
     * @return List of HashMap
     */
    @Override
    public List<ReceiptBean> findCashRemittanceDetailsForServiceAndFund(final String boundaryIdList,
            final String serviceCodes, final String fundCodes, final Date startDate, final Date endDate) {

        FinancialStatus status = microserviceUtils.getInstrumentStatusByCode(CollectionConstants.INSTRUMENT_NEW_STATUS);
        List<Instrument> instruments = microserviceUtils.getInstruments(CollectionConstants.INSTRUMENTTYPE_NAME_CASH, "Debit",
                status.getId());
        List<String> receiptIds = new ArrayList<>();
        for (Instrument i : instruments) {
            if (i.getInstrumentVouchers() != null)
                for (InstrumentVoucher iv : i.getInstrumentVouchers()) {
                    receiptIds.add(iv.getReceiptHeaderId());
                }
        }
        List<Receipt> receipts = microserviceUtils.getReceipts(StringUtils.join(receiptIds, ","), "Approved", serviceCodes);
        Map<String, List<Receipt>> receiptDateWiseMap = new HashMap<>();
        Map<String, List<Receipt>> serviceWiseMap = new HashMap<>();
        Map<String, List<Receipt>> instrumentWiseMap = new HashMap<>();
        Map<String, List<Receipt>> fundWiseMap = new HashMap<>();
        Map<String, List<Receipt>> departmentWiseMap = new HashMap<>();
        List<ReceiptBean> resultList = new ArrayList<>();

        groupByReceiptDate(receiptDateWiseMap, receipts);

        for (String key : receiptDateWiseMap.keySet()) {
            List<Receipt> tempList = receiptDateWiseMap.get(key);
            groupByService(key, serviceWiseMap, tempList);
        }

        for (String key : serviceWiseMap.keySet()) {
            List<Receipt> tempList = serviceWiseMap.get(key);
            groupByInstrument(key, instrumentWiseMap, tempList);
        }

        for (String key : instrumentWiseMap.keySet()) {
            List<Receipt> tempList = instrumentWiseMap.get(key);
            groupByFund(key, fundWiseMap, tempList);
        }

        for (String key : fundWiseMap.keySet()) {
            List<Receipt> tempList = fundWiseMap.get(key);
            groupByDepartment(key, departmentWiseMap, tempList);
        }

        for (String key : departmentWiseMap.keySet()) {
            List<Receipt> tempList = departmentWiseMap.get(key);
            populateResultList(key, resultList, tempList);
        }

        populateFundAndDepartmentNames(resultList);

        return resultList;
    }

    private void populateFundAndDepartmentNames(List<ReceiptBean> resultList) {
        List<Fund> fundList = fundHibernateDAO.findAllActiveFunds();
        List<Department> departmentList = microserviceUtils.getDepartments();
        Map<String, String> fundCodeNameMap = new HashMap<>();
        Map<String, String> deptCodeNameMap = new HashMap<>();

        if (fundList != null)
            for (Fund f : fundList) {
                fundCodeNameMap.put(f.getCode(), f.getName());
            }

        if (departmentList != null)
            for (Department dept : departmentList) {
                deptCodeNameMap.put(dept.getCode(), dept.getName());
            }

        for (ReceiptBean rb : resultList) {
            if (rb.getFund() != null && !rb.getFund().isEmpty())
                rb.setFundName(fundCodeNameMap.get(rb.getFund()));
            if (rb.getDepartment() != null && !rb.getDepartment().isEmpty())
                rb.setDepartmentName(deptCodeNameMap.get(rb.getDepartment()));
        }
    }

    private void populateResultList(String key, List<ReceiptBean> result, List<Receipt> tempList) {
        ReceiptBean receipt = new ReceiptBean();
        BigDecimal amount = BigDecimal.ZERO;

        for (Receipt r : tempList) {
            amount = amount.add(r.getInstrument().getAmount());
        }

        receipt.setReceiptDate(key.split("-")[0]);
        receipt.setService(key.split("-")[1]);
        receipt.setInstrumentType(key.split("-")[2]);
        if (key.split("-").length > 3)
            receipt.setFund(key.split("-")[3]);
        if (key.split("-").length > 4)
            receipt.setDepartment(key.split("-")[4]);
        receipt.setInstrumentAmount(amount);
        result.add(receipt);
    }

    private void groupByDepartment(String key, Map<String, List<Receipt>> departmentWiseMap,
            List<Receipt> tempList) {
        String department;
        for (Receipt r : tempList) {
            department = r.getBill().get(0).getBillDetails().get(0).getDepartment();
            if (department != null && !department.isEmpty()) {
                if (!departmentWiseMap.containsKey(key + "-" + department)) {
                    List<Receipt> list = new ArrayList<Receipt>();
                    list.add(r);
                    departmentWiseMap.put(key + "-" + department, list);
                } else {
                    departmentWiseMap.get(key + "-" + department).add(r);
                }
            } else {
                if (!departmentWiseMap.containsKey(key)) {
                    List<Receipt> list = new ArrayList<Receipt>();
                    list.add(r);
                    departmentWiseMap.put(key, list);
                } else {
                    departmentWiseMap.get(key).add(r);
                }
            }
        }
    }

    private void groupByFund(String key, Map<String, List<Receipt>> fundWiseMap,
            List<Receipt> tempList) {
        String fund;
        for (Receipt r : tempList) {
            fund = r.getBill().get(0).getBillDetails().get(0).getFund();
            if (fund != null && !fund.isEmpty()) {
                if (!fundWiseMap.containsKey(key + "-" + fund)) {
                    List<Receipt> list = new ArrayList<Receipt>();
                    list.add(r);
                    fundWiseMap.put(key + "-" + fund, list);
                } else {
                    fundWiseMap.get(key + "-" + fund).add(r);
                }
            } else {
                if (!fundWiseMap.containsKey(key)) {
                    List<Receipt> list = new ArrayList<Receipt>();
                    list.add(r);
                    fundWiseMap.put(key, list);
                } else {
                    fundWiseMap.get(key).add(r);
                }
            }
        }
    }

    private void groupByInstrument(String receiptDateAndService, Map<String, List<Receipt>> instrumentWiseMap,
            List<Receipt> tempList) {
        String instrument;
        for (Receipt r : tempList) {
            instrument = r.getInstrument().getInstrumentType().getName();
            if (!instrumentWiseMap.containsKey(receiptDateAndService + "-" + instrument)) {
                List<Receipt> list = new ArrayList<Receipt>();
                list.add(r);
                instrumentWiseMap.put(receiptDateAndService + "-" + instrument, list);
            } else {
                instrumentWiseMap.get(receiptDateAndService + "-" + instrument).add(r);
            }
        }
    }

    private void groupByService(String receiptDate, Map<String, List<Receipt>> serviceWiseMap, List<Receipt> tempList) {
        String service;
        for (Receipt r : tempList) {
            service = r.getBill().get(0).getBillDetails().get(0).getBusinessService();
            if (!serviceWiseMap.containsKey(receiptDate + "-" + service)) {
                List<Receipt> list = new ArrayList<Receipt>();
                list.add(r);
                serviceWiseMap.put(receiptDate + "-" + service, list);
            } else {
                serviceWiseMap.get(receiptDate + "-" + service).add(r);
            }
        }
    }

    private void groupByReceiptDate(Map<String, List<Receipt>> receiptDateWiseMap, List<Receipt> receipts) {
        String receiptDate;
        for (Receipt receipt : receipts) {
            receiptDate = DateUtils
                    .toDefaultDateFormat(new Date(receipt.getBill().get(0).getBillDetails().get(0).getReceiptDate()));
            if (!receiptDateWiseMap.containsKey(receiptDate)) {
                List<Receipt> list = new ArrayList<Receipt>();
                list.add(receipt);

                receiptDateWiseMap.put(receiptDate, list);
            } else {
                receiptDateWiseMap.get(receiptDate).add(receipt);
            }

        }

    }

    /**
     * Method to find all the Cheque and DD type instruments with status as :new and
     *
     * @return List of HashMap
     */
    @Override
    public List<HashMap<String, Object>> findChequeRemittanceDetailsForServiceAndFund(final String boundaryIdList,
            final String serviceCodes, final String fundCodes, final Date startDate, final Date endDate) {

        final List<HashMap<String, Object>> paramList = new ArrayList<>();
        final StringBuilder chequeRemittanceListQuery = new StringBuilder(
                "SELECT ih.instrumentamount as INSTRUMENTMAOUNT,date(ch.RECEIPTDATE) AS RECEIPTDATE,")
                        .append(" ch.RECEIPTNUMBER AS RECEIPTNUMBER,ih.INSTRUMENTNUMBER AS INSTRUMENTNUMBER,ih.INSTRUMENTDATE as INSTRUMENTDATE,sd.NAME as SERVICENAME, ")
                        .append("it.TYPE as INSTRUMENTTYPE,fnd.name AS FUNDNAME,dpt.name AS DEPARTMENTNAME,")
                        .append("fnd.code AS FUNDCODE,dpt.code AS DEPARTMENTCODE,ih.ID as INSTRUMENTID,ih.BANKBRANCHNAME as bankbranchname,bank.NAME as bankname ")
                        .append(" from EGCL_COLLECTIONHEADER ch,EGF_INSTRUMENTHEADER ih,EGCL_COLLECTIONINSTRUMENT ci,EGCL_SERVICEDETAILS sd,")
                        .append("EGF_INSTRUMENTTYPE it,EGCL_COLLECTIONMIS cm,FUND fnd,EG_DEPARTMENT dpt, BANK bank  where ch.id=cm.collectionheader AND ")
                        .append("fnd.id=cm.fund AND dpt.id=cm.department and ci.INSTRUMENTHEADER=ih.ID and ")
                        .append("ch.SERVICEDETAILS=sd.ID and ch.ID=ci.COLLECTIONHEADER and ih.INSTRUMENTTYPE=it.ID and ih.BANKID=bank.ID and")
                        .append(" sd.code in (" + serviceCodes + ")" + " and fnd.code in (")
                        .append(fundCodes + ")" + " and  it.TYPE in ('" + CollectionConstants.INSTRUMENTTYPE_CHEQUE + "','")
                        .append(CollectionConstants.INSTRUMENTTYPE_DD)
                        .append("')  AND ih.ID_STATUS=(select id from egw_status where moduletype='")
                        .append(CollectionConstants.MODULE_NAME_INSTRUMENTHEADER)
                        .append("' ").append("and description='")
                        .append(CollectionConstants.INSTRUMENT_NEW_STATUS)
                        .append("') and ih.ISPAYCHEQUE='0' and ch.STATUS in(select id from egw_status where moduletype='")
                        .append(CollectionConstants.MODULE_NAME_RECEIPTHEADER + "' and code in('")
                        .append(CollectionConstants.RECEIPT_STATUS_CODE_APPROVED + "','")
                        .append(CollectionConstants.RECEIPT_STATUS_CODE_PARTIAL_REMITTED)
                        .append("')) " + " AND ch.source='" + Source.SYSTEM + "' ");

        if (startDate != null && endDate != null)
            chequeRemittanceListQuery.append(" AND date(ch.receiptdate) between '" + startDate + "' and '" + endDate + "' ");
        if (collectionsUtil.isBankCollectionRemitter(collectionsUtil.getLoggedInUser())) {
            BranchUserMap branchUserMap = branchUserMapService.findByNamedQuery(
                    CollectionConstants.QUERY_ACTIVE_BRANCHUSER_BY_USER,
                    collectionsUtil.getLoggedInUser().getId());
            chequeRemittanceListQuery.append(" AND cm.depositedbranch=" + branchUserMap.getBankbranch().getId());
        } else
            chequeRemittanceListQuery.append(
                    " AND cm.depositedbranch is null AND ch.CREATEDBY in (select distinct ujl.employee from egeis_jurisdiction ujl where ujl.boundary in (")
                    .append(boundaryIdList).append("))");
        chequeRemittanceListQuery.append(" order by RECEIPTDATE,bankname ");
        final Query query = receiptHeaderService.getSession()
                .createSQLQuery(chequeRemittanceListQuery.toString());

        final List<Object[]> queryResults = query.list();
        final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        for (int i = 0; i < queryResults.size(); i++) {
            final Object[] arrayObjectInitialIndex = queryResults.get(i);
            HashMap<String, Object> objHashMap = new HashMap<>(0);
            if (i == 0) {
                objHashMap.put(CollectionConstants.BANKREMITTANCE_SERVICETOTALCHEQUEAMOUNT,
                        arrayObjectInitialIndex[0]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_RECEIPTDATE, arrayObjectInitialIndex[1]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_RECEIPTNUMBER, arrayObjectInitialIndex[2]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_CHEQUEDD_NUMBER, arrayObjectInitialIndex[3]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_CHEQUEDD_DATE, dateFormat.format(arrayObjectInitialIndex[4]));
                objHashMap.put(CollectionConstants.BANKREMITTANCE_SERVICENAME, arrayObjectInitialIndex[5]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_FUNDNAME, arrayObjectInitialIndex[7]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_DEPARTMENTNAME, arrayObjectInitialIndex[8]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_FUNDCODE, arrayObjectInitialIndex[9]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_DEPARTMENTCODE, arrayObjectInitialIndex[10]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_INSTRUMENTID, arrayObjectInitialIndex[11]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_DRAWEE_BANKBRANCH, arrayObjectInitialIndex[12]);
                objHashMap.put(CollectionConstants.BANKREMITTANCE_DRAWEE_BANK, arrayObjectInitialIndex[13]);
            } else {
                final int checknew = receiptHeaderService.checkIfChequeMapObjectExist(paramList, arrayObjectInitialIndex);
                if (checknew == -1) {
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_SERVICETOTALCHEQUEAMOUNT,
                            arrayObjectInitialIndex[0]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_RECEIPTDATE, arrayObjectInitialIndex[1]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_RECEIPTNUMBER, arrayObjectInitialIndex[2]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_CHEQUEDD_NUMBER, arrayObjectInitialIndex[3]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_CHEQUEDD_DATE,
                            dateFormat.format(arrayObjectInitialIndex[4]));
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_SERVICENAME, arrayObjectInitialIndex[5]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_FUNDNAME, arrayObjectInitialIndex[7]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_DEPARTMENTNAME, arrayObjectInitialIndex[8]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_FUNDCODE, arrayObjectInitialIndex[9]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_DEPARTMENTCODE, arrayObjectInitialIndex[10]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_INSTRUMENTID, arrayObjectInitialIndex[11]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_DRAWEE_BANKBRANCH, arrayObjectInitialIndex[12]);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_DRAWEE_BANK, arrayObjectInitialIndex[13]);
                } else {
                    objHashMap = paramList.get(checknew);
                    paramList.remove(checknew);
                    objHashMap.put(CollectionConstants.BANKREMITTANCE_SERVICETOTALCHEQUEAMOUNT,
                            arrayObjectInitialIndex[0]);
                }
            }
            if (objHashMap.get(CollectionConstants.BANKREMITTANCE_RECEIPTDATE) != null
                    && objHashMap.get(CollectionConstants.BANKREMITTANCE_SERVICENAME) != null)
                paramList.add(objHashMap);
        }
        return paramList;
    }

    public void setCollectionsUtil(final CollectionsUtil collectionsUtil) {
        this.collectionsUtil = collectionsUtil;
    }

    public void setFinancialsUtil(final FinancialsUtil financialsUtil) {
        this.financialsUtil = financialsUtil;
    }

    public void setReceiptHeaderService(final ReceiptHeaderService receiptHeaderService) {
        this.receiptHeaderService = receiptHeaderService;
    }

    public CollectionsNumberGenerator getCollectionsNumberGenerator() {
        return collectionsNumberGenerator;
    }

    public void setCollectionsNumberGenerator(final CollectionsNumberGenerator collectionsNumberGenerator) {
        this.collectionsNumberGenerator = collectionsNumberGenerator;
    }

    public void setPersistenceService(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    public void setRemittancePersistService(final PersistenceService<Remittance, Long> remittancePersistService) {
        this.remittancePersistService = remittancePersistService;
    }

    @Transactional
    @Override
    public List<ReceiptHeader> createChequeBankRemittance(String[] serviceNameArr, String[] totalCashAmount,
            String[] totalChequeAmountArr, String[] totalCardAmount, String[] receiptDateArray, String[] fundCodeArray,
            String[] departmentCodeArray, Integer accountNumberId, Integer positionUser, String[] receiptNumberArray,
            Date remittanceDate, String[] instrumentIdArray) {
        final List<ReceiptHeader> bankRemittanceList = new ArrayList<>(0);
        final List<ReceiptHeader> bankRemitList = new ArrayList<>();
        final SimpleDateFormat dateFomatter = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        final String receiptInstrumentQueryString = "select DISTINCT (instruments) from org.egov.collection.entity.ReceiptHeader receipt "
                + "join receipt.receiptInstrument as instruments join receipt.receiptMisc as receiptMisc where instruments.id=?";

        StringBuilder chequeInHandQuery = new StringBuilder(
                "SELECT COA.GLCODE FROM CHARTOFACCOUNTS COA,EGF_INSTRUMENTACCOUNTCODES IAC,EGF_INSTRUMENTTYPE IT ")
                        .append("WHERE IT.ID=IAC.TYPEID AND IAC.GLCODEID=COA.ID AND IT.TYPE='")
                        .append(CollectionConstants.INSTRUMENTTYPE_CHEQUE).append("'");
        final Query chequeInHand = persistenceService.getSession()
                .createSQLQuery(chequeInHandQuery.toString());
        String chequeInHandGlcode = null;
        if (!chequeInHand.list().isEmpty())
            chequeInHandGlcode = chequeInHand.list().get(0).toString();

        final String createVoucher = collectionsUtil.getAppConfigValue(
                CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
                CollectionConstants.APPCONFIG_VALUE_CREATEVOUCHER_FOR_REMITTANCE);
        final String functionCode = collectionsUtil.getAppConfigValue(
                CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
                CollectionConstants.APPCONFIG_VALUE_COLLECTION_BANKREMITTANCE_FUNCTIONCODE);
        final EgwStatus instrmentStatusNew = collectionsUtil.getStatusForModuleAndCode(
                CollectionConstants.MODULE_NAME_INSTRUMENTHEADER, CollectionConstants.INSTRUMENT_NEW_STATUS);
        final EgwStatus instrumentStatusDeposited = collectionsUtil.getStatusForModuleAndCode(
                CollectionConstants.MODULE_NAME_INSTRUMENTHEADER, CollectionConstants.INSTRUMENT_DEPOSITED_STATUS);
        final EgwStatus receiptStatusRemitted = collectionsUtil
                .getReceiptStatusForCode(CollectionConstants.RECEIPT_STATUS_CODE_REMITTED);
        final EgwStatus receiptStatusPartialRemitted = collectionsUtil
                .getReceiptStatusForCode(CollectionConstants.RECEIPT_STATUS_CODE_PARTIAL_REMITTED);

        Boolean showRemitDate = false;
        BigDecimal totalChequeAmount = BigDecimal.ZERO;
        BigDecimal totalChequeVoucherAmt = BigDecimal.ZERO;
        String fundCode = "";
        Date voucherDate = null;
        List<InstrumentHeader> instrumentHeaderListCheque;
        if (collectionsUtil
                .getAppConfigValue(CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
                        CollectionConstants.APPCONFIG_VALUE_COLLECTION_BANKREMITTANCE_SHOWREMITDATE)
                .equals(CollectionConstants.YES))
            showRemitDate = true;

        final Bankaccount depositedBankAccount = (Bankaccount) persistenceService.find("from Bankaccount where id=?",
                Long.valueOf(accountNumberId.longValue()));
        final String serviceGlCode = depositedBankAccount.getChartofaccounts().getGlcode();

        Boolean voucherTypeForChequeDDCard = false;
        if (collectionsUtil.getAppConfigValue(CollectionConstants.MODULE_NAME_COLLECTIONS_CONFIG,
                CollectionConstants.APPCONFIG_VALUE_REMITTANCEVOUCHERTYPEFORCHEQUEDDCARD).equals(
                        CollectionConstants.FINANCIAL_RECEIPTS_VOUCHERTYPE))
            voucherTypeForChequeDDCard = true;
        final Map<String, Object> instrumentDepositMap = financialsUtil.prepareForUpdateInstrumentDepositSQL();
        for (int i = 0; i < serviceNameArr.length; i++) {
            final String serviceName = serviceNameArr[i].trim();
            if (serviceName != null && serviceName.length() > 0) {
                if (showRemitDate && remittanceDate != null)
                    voucherDate = remittanceDate;
                else
                    try {
                        collectionsUtil.getRemittanceVoucherDate(dateFomatter.parse(receiptDateArray[i]));
                    } catch (final ParseException e) {
                        LOGGER.error("Error Parsing Date", e);
                    }
                final ServiceDetails serviceDetails = (ServiceDetails) persistenceService
                        .findByNamedQuery(CollectionConstants.QUERY_SERVICE_BY_NAME, serviceName);

                // If Cheque Amount is present
                if (totalChequeAmountArr[i].trim() != null && totalChequeAmountArr[i].trim().length() > 0
                        && chequeInHandGlcode != null) {
                    final StringBuilder chequeQueryBuilder = new StringBuilder(receiptInstrumentQueryString);
                    final Object arguments[] = new Object[1];
                    arguments[0] = Long.valueOf(instrumentIdArray[i]);
                    fundCode = fundCodeArray[i];
                    instrumentHeaderListCheque = persistenceService.findAllBy(chequeQueryBuilder.toString(), arguments);
                    totalChequeAmount = totalChequeAmount.add(new BigDecimal(totalChequeAmountArr[i]));
                    if (CollectionConstants.YES.equalsIgnoreCase(createVoucher) && serviceDetails.getVoucherCreation())
                        totalChequeVoucherAmt = totalChequeVoucherAmt.add(new BigDecimal(totalChequeAmountArr[i]));
                    else
                        financialsUtil.updateInstrumentHeader(instrumentHeaderListCheque, instrumentStatusDeposited,
                                depositedBankAccount);
                    bankRemittanceList.addAll(getRemittanceList(serviceDetails, instrumentHeaderListCheque));
                }
                for (final ReceiptHeader receiptHeader : bankRemittanceList)
                    if (!bankRemitList.contains(receiptHeader))
                        bankRemitList.add(receiptHeader);
            }
        }
        if (totalChequeVoucherAmt.compareTo(totalChequeAmount) != 0) {
            String validationMessage = "There is a difference of amount " + totalChequeAmount.subtract(totalChequeVoucherAmt)
                    + " between bank challan and the remittance voucher , please contact system administrator ";
            throw new ValidationException(Arrays.asList(new ValidationError(validationMessage, validationMessage)));
        }
        List<String> instrumentIdList = Arrays.asList(instrumentIdArray);
        final Remittance remittance = null;/*
                                            * populateAndPersistRemittance(BigDecimal.ZERO, totalChequeAmount, fundCode, null,
                                            * chequeInHandGlcode, serviceGlCode, functionCode, bankRemitList, createVoucher,
                                            * voucherDate, depositedBankAccount, BigDecimal.ZERO, totalChequeVoucherAmt,
                                            * instrumentIdList);
                                            */

        // For cheque update instrument status to deposited.
        for (final RemittanceInstrument bankRemitInstrument : remittance.getRemittanceInstruments()) {
            final Map<String, Object> chequeMap = remittanceSchedulerService.constructInstrumentMap(instrumentDepositMap,
                    depositedBankAccount, bankRemitInstrument.getInstrumentHeader(), remittance.getVoucherHeader());
            if (voucherTypeForChequeDDCard)
                financialsUtil.updateCheque_DD_Card_Deposit_Receipt(chequeMap);
            else
                financialsUtil.updateCheque_DD_Card_Deposit(chequeMap, remittance.getVoucherHeader(),
                        bankRemitInstrument.getInstrumentHeader(), depositedBankAccount);
            bankRemitInstrument.setReconciled(Boolean.TRUE);
            remittanceInstrumentService.persist(bankRemitInstrument);
        }

        for (final ReceiptHeader receiptHeader : bankRemitList) {

            if (receiptHeader.getReceiptInstrument().size() == 1) {
                receiptHeader.setStatus(receiptStatusRemitted);
            } else {

                boolean allInstrumentsRemitted = Boolean.TRUE;
                for (InstrumentHeader instrumentHead : receiptHeader.getReceiptInstrument()) {
                    if (!(instrumentIdList.contains(instrumentHead.getId().toString()))
                            && instrumentHead.getStatusId().getCode().equals(instrmentStatusNew.getCode()))
                        allInstrumentsRemitted = Boolean.FALSE;
                }
                if (allInstrumentsRemitted)
                    receiptHeader.setStatus(receiptStatusRemitted);
                else
                    receiptHeader.setStatus(receiptStatusPartialRemitted);// check receipt has multiple instruments and if few
                                                                          // instrument deposited few are not deposite then set
                                                                          // receipt status as partial remitted.
            }
            receiptHeader.setRemittanceReferenceNumber(remittance.getReferenceNumber());
            receiptHeaderService.update(receiptHeader);
            receiptHeaderService.updateCollectionIndexAndPushMail(receiptHeader);
        }
        return bankRemitList;
    }

}