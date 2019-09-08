package org.egov.egf.instrument.persistence.entity;

import java.math.BigDecimal;
import java.util.Date;

import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.instrument.domain.model.Instrument;
import org.egov.egf.instrument.domain.model.InstrumentType;
import org.egov.egf.instrument.domain.model.SurrenderReason;
import org.egov.egf.instrument.domain.model.TransactionType;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.FinancialStatusContract;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class InstrumentEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_instrument";
    private String id;
    private String transactionNumber;
    private Date transactionDate;
    private BigDecimal amount;
    private String instrumentTypeId;
    private String bankId;
    private String branchName;
    private String bankAccountId;
    private String financialStatusId;
    private String remittanceVoucherId;
    private String transactionType;
    private String payee;
    private String drawer;
    private String surrenderReasonId;
    private String serialNo;
    private String payinSlipId;
    private BigDecimal reconciledAmount;
    private Date reconciledOn;

    public Instrument toDomain() {
        Instrument instrument = new Instrument();
        super.toDomain(instrument);
        instrument.setId(id);
        instrument.setTransactionNumber(transactionNumber);
        instrument.setTransactionDate(transactionDate);
        instrument.setAmount(amount);
        instrument.setInstrumentType(InstrumentType.builder().name(instrumentTypeId).build());
        instrument.setBank(BankContract.builder().id(bankId).build());
        instrument.setBranchName(branchName);
        instrument.setBankAccount(BankAccountContract.builder().accountNumber(bankAccountId).build());
        instrument.setFinancialStatus(FinancialStatusContract.builder().id(financialStatusId).build());
        instrument.setRemittanceVoucherId(remittanceVoucherId);
        if (transactionType != null)
            instrument.setTransactionType(TransactionType.valueOf(transactionType));
        instrument.setPayee(payee);
        instrument.setDrawer(drawer);
        instrument.setSurrenderReason(SurrenderReason.builder().id(surrenderReasonId).build());
        instrument.setSerialNo(serialNo);
        instrument.setPayinSlipId(payinSlipId);
        instrument.setReconciledAmount(reconciledAmount);
        instrument.setReconciledOn(reconciledOn);
        return instrument;
    }

    public InstrumentEntity toEntity(Instrument instrument) {
        super.toEntity(instrument);
        id = instrument.getId();
        transactionNumber = instrument.getTransactionNumber();
        transactionDate = instrument.getTransactionDate();
        amount = instrument.getAmount();
        instrumentTypeId = instrument.getInstrumentType() != null ? instrument.getInstrumentType().getName()
                : null;
        bankId = instrument.getBank() != null ? instrument.getBank().getId() : null;
        branchName = instrument.getBranchName();
        bankAccountId = instrument.getBankAccount() != null ? instrument.getBankAccount().getAccountNumber()
                : null;
        financialStatusId = instrument.getFinancialStatus() != null ? instrument.getFinancialStatus().getId()
                : null;
        remittanceVoucherId = instrument.getRemittanceVoucherId();
        transactionType = instrument.getTransactionType() != null ? instrument.getTransactionType().toString()
                : null;
        payee = instrument.getPayee();
        drawer = instrument.getDrawer();
        surrenderReasonId = instrument.getSurrenderReason() != null ? instrument.getSurrenderReason().getId()
                : null;
        serialNo = instrument.getSerialNo();
        payinSlipId = instrument.getPayinSlipId();
        reconciledAmount = instrument.getReconciledAmount();
        reconciledOn = instrument.getReconciledOn();
        return this;
    }

}
