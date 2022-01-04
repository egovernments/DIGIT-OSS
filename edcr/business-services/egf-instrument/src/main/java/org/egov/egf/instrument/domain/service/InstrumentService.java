package org.egov.egf.instrument.domain.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.ErrorCode;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentSearch;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.InstrumentTypeSearch;
import org.egov.egf.instrument.domain.repository.InstrumentRepository;
import org.egov.egf.instrument.domain.repository.InstrumentTypeRepository;
import org.egov.egf.instrument.web.requests.InstrumentRequest;
import org.egov.egf.master.web.contract.FinancialStatusContract;
import org.egov.egf.master.web.repository.BankAccountContractRepository;
import org.egov.egf.master.web.repository.BankContractRepository;
import org.egov.egf.master.web.repository.FinancialStatusContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.SmartValidator;

@Service
@Transactional(readOnly = true)
public class InstrumentService {

    public static final String ACTION_CREATE = "create";
    public static final String ACTION_UPDATE = "update";
    public static final String ACTION_DELETE = "delete";
    public static final String ACTION_VIEW = "view";
    public static final String ACTION_EDIT = "edit";
    public static final String ACTION_SEARCH = "search";

    private InstrumentRepository instrumentRepository;

    private SmartValidator validator;

    private BankContractRepository bankContractRepository;

    private FinancialStatusContractRepository financialStatusContractRepository;

    private BankAccountContractRepository bankAccountContractRepository;

    private InstrumentTypeRepository instrumentTypeRepository;

    @Autowired
    public InstrumentService(SmartValidator validator, InstrumentRepository instrumentRepository, BankContractRepository bankContractRepository,
            FinancialStatusContractRepository financialStatusContractRepository,
            BankAccountContractRepository bankAccountContractRepository,
            InstrumentTypeRepository instrumentTypeRepository) {
        this.validator = validator;
        this.instrumentRepository = instrumentRepository;
        this.bankContractRepository = bankContractRepository;
        this.financialStatusContractRepository = financialStatusContractRepository;
        this.bankAccountContractRepository = bankAccountContractRepository;
        this.instrumentTypeRepository = instrumentTypeRepository;
    }

    @Transactional
    public List<Instrument> create(List<Instrument> instruments, BindingResult errors, RequestInfo requestInfo) {

        try {

            instruments = fetchRelated(instruments, requestInfo);

            validate(instruments, ACTION_CREATE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return instrumentRepository.save(instruments, requestInfo);

    }

    @Transactional
    public List<Instrument> update(List<Instrument> instruments, BindingResult errors, RequestInfo requestInfo) {

        try {

            instruments = fetchRelated(instruments, requestInfo);

            validate(instruments, ACTION_UPDATE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return instrumentRepository.update(instruments, requestInfo);

    }

    @Transactional
    public List<Instrument> delete(List<Instrument> instruments, BindingResult errors, RequestInfo requestInfo) {

        try {

            validate(instruments, ACTION_DELETE, errors);

            if (errors.hasErrors())
                throw new CustomBindException(errors);

        } catch (CustomBindException e) {

            throw new CustomBindException(errors);
        }

        return instrumentRepository.delete(instruments, requestInfo);

    }

    private BindingResult validate(List<Instrument> instruments, String method, BindingResult errors) {

        try {
            switch (method) {
            case ACTION_VIEW:
                // validator.validate(instrumentContractRequest.getInstrument(),
                // errors);
                break;
            case ACTION_CREATE:
                if (instruments == null)
                    throw new InvalidDataException("instruments", ErrorCode.NOT_NULL.getCode(), null);
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.MONTH, -6);
                Calendar cal1 = Calendar.getInstance();
                for (Instrument instrument : instruments) {
                    switch (instrument.getInstrumentType().getName().toLowerCase()) {
                    case "cash":
                        if (instrument.getTransactionNumber() == null)
                            throw new InvalidDataException("TransactionNumber(Cash)", ErrorCode.NOT_NULL.getCode(), null);
                        // Assert.isTrue(DateUtils.isSameDay(instrument.getTransactionDate(), Calendar.getInstance().getTime()),
                        // "Cash Transaction Date must be current date");
                        // Assert.notNull(instrument.getPayee(), "Payee Details for Cash Transaction must not be null");
                        break;
                    case "cheque":
                        if (instrument.getTransactionNumber() == null)
                            throw new InvalidDataException("TransactionNumber(Cheque)", ErrorCode.NOT_NULL.getCode(), null);
                        // Assert.notNull(instrument.getPayee(), "Cheque Payee Details must not be null");
                        // cal1.setTime(instrument.getTransactionDate());
                        // Assert.isTrue(cal1.after(cal), "Cheque Transaction should be before 6 months of current date or a
                        // future date");
                        if (instrument.getBank() == null)
                            throw new InvalidDataException("BankDetails(Cheque)", ErrorCode.NOT_NULL.getCode(), null);
                        break;
                    case "dd":
                        if (instrument.getTransactionNumber() == null)
                            throw new InvalidDataException("TransactionNumber(DD)", ErrorCode.NOT_NULL.getCode(), null);
                        cal1.setTime(instrument.getTransactionDate());
                        // Assert.isTrue(cal1.after(cal), "DD Transaction should be before 6 months of current date or a future
                        // date");
                        // Assert.notNull(instrument.getPayee(), "DD Payee Details must not be null");
                        if (instrument.getBank() == null)
                            throw new InvalidDataException("BankDetails(DD)", ErrorCode.NOT_NULL.getCode(), null);
                        break;
                    case "online":
                        if (instrument.getTransactionNumber() == null)
                            throw new InvalidDataException("TransactionNumber(Online)", ErrorCode.NOT_NULL.getCode(), null);
                        // Assert.notNull(instrument.getPayee(), "Online Payee Details must not be null");
                        // cal1.setTime(instrument.getTransactionDate());
                        // Assert.isTrue(cal1.after(cal), "DD Transaction should be before 6 months of current date or a future
                        // date");
                        break;
                    case "bankchallan":
                        if (instrument.getTransactionNumber() == null)
                            throw new InvalidDataException("TransactionNumber(BankChallan)", ErrorCode.NOT_NULL.getCode(), null);
                        if (instrument.getBank() == null)
                            throw new InvalidDataException("BankDetails(BankChallan)", ErrorCode.NOT_NULL.getCode(), null);
                        if (instrument.getBankAccount() == null)
                            throw new InvalidDataException("BankAccountDetails(BankChallan)", ErrorCode.NOT_NULL.getCode(), null);
                        // Assert.notNull(instrument.getPayee(), "Bank Challan Payee Details must not be null");
                        // cal1.setTime(instrument.getTransactionDate());
                        // Assert.isTrue(cal1.after(cal), "DD Transaction should be before 6 months of current date or a future
                        // date");
                        break;
                    }
                    validator.validate(instrument, errors);
                }
                break;
            case ACTION_UPDATE:
                if (instruments == null)
                    throw new InvalidDataException("instruments", ErrorCode.NOT_NULL.getCode(), null);
                for (Instrument instrument : instruments) {
                    if (instrument.getId() == null)
                        throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), instrument.getId());
                    validator.validate(instrument, errors);
                }
                break;
            case ACTION_DELETE:
                if (instruments == null)
                    throw new InvalidDataException("instruments", ErrorCode.NOT_NULL.getCode(), null);
                for (Instrument instrument : instruments)
                    if (instrument.getId() == null)
                        throw new InvalidDataException("id", ErrorCode.MANDATORY_VALUE_MISSING.getCode(), instrument.getId());
                break;
            default:

            }
        } catch (IllegalArgumentException e) {
            errors.addError(new ObjectError("Missing data", e.getMessage()));
        }
        return errors;

    }

    public List<Instrument> fetchRelated(List<Instrument> instruments, RequestInfo requestInfo) {

        if (instruments != null)
            for (Instrument instrument : instruments) {

                if ("create".equalsIgnoreCase(requestInfo.getAction()))
                    instrument.setId(UUID.randomUUID().toString().replace("-", ""));

                // fetch related items

                if (instrument.getInstrumentType() != null && instrument.getInstrumentType().getName() != null) {
                    InstrumentTypeSearch instrumentTypeSearch = new InstrumentTypeSearch();
                    instrumentTypeSearch.setName(instrument.getInstrumentType().getName());
                    instrumentTypeSearch.setTenantId(instrument.getTenantId());
                    Pagination<InstrumentType> response = instrumentTypeRepository.search(instrumentTypeSearch);
                    if (response == null || response.getPagedData() == null || response.getPagedData().isEmpty())
                        throw new InvalidDataException("instrumentType", "instrumentType.invalid",
                                " Invalid instrumentType");
                    instrument.setInstrumentType(response.getPagedData().get(0));
                }
                bankContractRepository.getClass();
               /* if (instrument.getBank() != null && instrument.getBank().getId() != null) {
                    instrument.getBank().setTenantId(instrument.getTenantId());
                    BankContract bank = bankContractRepository.findById(instrument.getBank(), requestInfo);
                    if (bank == null)
                        throw new InvalidDataException("bank", "bank.invalid", " Invalid bank");
                    instrument.setBank(bank);
                }*/
               /* if (instrument.getBankAccount() != null && instrument.getBankAccount().getAccountNumber() != null) {
                    instrument.getBankAccount().setTenantId(instrument.getTenantId());
                    BankAccountContract bankAccount = bankAccountContractRepository
                            .findByAccountNumber(instrument.getBankAccount(), requestInfo);
                    if (bankAccount == null)
                        throw new InvalidDataException("bankAccount", "bankAccount.invalid", " Invalid bankAccount");
                    instrument.setBankAccount(bankAccount);
                }*/
                bankAccountContractRepository.getClass();
//                if (instrument.getFinancialStatus() != null) {
//                    instrument.getFinancialStatus().setTenantId(instrument.getTenantId());
//                    FinancialStatusContract financialStatus = financialStatusContractRepository
//                            .findById(instrument.getFinancialStatus(), requestInfo);
//                    if (financialStatus == null)
//                        throw new InvalidDataException("financialStatus", "financialStatus.invalid",
//                                " Invalid financialStatus");
//                    instrument.setFinancialStatus(financialStatus);
//                }
                
                //Reason for instrument surrender is not initiated by collection service so that for now we are commenting out the validation from this service.
                
                /* if (instrument.getSurrenderReason() != null) {
                    instrument.getSurrenderReason().setTenantId(instrument.getTenantId());
                    SurrenderReason surrenderReason = surrenderReasonRepository
                            .findById(instrument.getSurrenderReason());
                    if (surrenderReason == null)
                        throw new InvalidDataException("surrenderReason", "surrenderReason.invalid",
                                " Invalid surrenderReason");
                    instrument.setSurrenderReason(surrenderReason);
                } */

            }

        return instruments;
    }

    public Pagination<Instrument> search(InstrumentSearch instrumentSearch) {
        return instrumentRepository.search(instrumentSearch);
    }

    @Transactional
    public Instrument save(Instrument instrument) {
        return instrumentRepository.save(instrument);
    }

    @Transactional
    public Instrument update(Instrument instrument) {
        return instrumentRepository.update(instrument);
    }

    @Transactional
    public Instrument delete(Instrument instrument) {
        return instrumentRepository.delete(instrument);
    }

    public List<Instrument> deposit(InstrumentRequest instrumentDepositRequest, BindingResult errors,
            RequestInfo requestInfo) {
        Instrument instrument = new Instrument();
        instrument.setId(instrumentDepositRequest.getInstruments().get(0).getId());
        instrument.setTenantId(instrumentDepositRequest.getInstruments().get(0).getTenantId());

        FinancialStatusContract financialStatusContract = new FinancialStatusContract();
        financialStatusContract.setCode("Deposited");
        financialStatusContract.setModuleType("Instrument");

        instrument = instrumentRepository.findById(instrument);
        FinancialStatusContract financialStatusContract1 = new FinancialStatusContract();
        financialStatusContract1 = financialStatusContractRepository.findByModuleCode(financialStatusContract);
        instrument.setFinancialStatus(financialStatusContract1);
        instrument.setRemittanceVoucherId(instrumentDepositRequest.getInstruments().get(0).getRemittanceVoucherId());
        List<Instrument> instrumentsToUpdate = new ArrayList<>();
        instrumentsToUpdate.add(instrument);
        return instrumentRepository.update(instrumentsToUpdate, requestInfo);
    }

    public List<Instrument> dishonor(InstrumentRequest instrumentDepositRequest, BindingResult errors,
            RequestInfo requestInfo) {
        Instrument instrument = new Instrument();
        instrument.setId(instrumentDepositRequest.getInstruments().get(0).getId());
        instrument.setTenantId(instrumentDepositRequest.getInstruments().get(0).getTenantId());

        FinancialStatusContract financialStatusContract = new FinancialStatusContract();
        financialStatusContract.setCode("Deposited");
        financialStatusContract.setModuleType("Instrument");

        instrument = instrumentRepository.findById(instrument);
        FinancialStatusContract financialStatusContract1 = new FinancialStatusContract();
        financialStatusContract1 = financialStatusContractRepository.findByModuleCode(financialStatusContract);
        instrument.setFinancialStatus(financialStatusContract1);
        List<Instrument> instrumentsToUpdate = new ArrayList<>();
        instrumentsToUpdate.add(instrument);
        return instrumentRepository.update(instrumentsToUpdate, requestInfo);
    }

}