package org.egov.egf.master.persistence.entity;

import org.egov.common.domain.model.Auditable;
import org.egov.common.persistence.entity.AuditableEntity;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankBranch;

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
public class BankBranchEntity extends AuditableEntity {
    public static final String TABLE_NAME = "egf_bankbranch";
    public static final String SEQUENCE_NAME = "seq_egf_bankbranch";
    private String id;
    private String bankId;
    private String code;
    private String name;
    private String address;
    private String address2;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String fax;
    private String contactPerson;
    private Boolean active;
    private String description;
    private String micr;

    public BankBranch toDomain() {
        BankBranch bankBranch = new BankBranch();
        super.toDomain(bankBranch);
        bankBranch.setId(this.id);
        bankBranch.setBank(Bank.builder().id(bankId).build());
        bankBranch.setCode(this.code);
        bankBranch.setName(this.name);
        bankBranch.setAddress(this.address);
        bankBranch.setAddress2(this.address2);
        bankBranch.setCity(this.city);
        bankBranch.setState(this.state);
        bankBranch.setPincode(this.pincode);
        bankBranch.setPhone(this.phone);
        bankBranch.setFax(this.fax);
        bankBranch.setContactPerson(this.contactPerson);
        bankBranch.setActive(this.active);
        bankBranch.setDescription(this.description);
        bankBranch.setMicr(this.micr);
        return bankBranch;
    }

    public BankBranchEntity toEntity(BankBranch bankBranch) {
        super.toEntity((Auditable) bankBranch);
        this.id = bankBranch.getId();
        this.bankId = bankBranch.getBank() != null ? bankBranch.getBank().getId() : null;
        this.code = bankBranch.getCode();
        this.name = bankBranch.getName();
        this.address = bankBranch.getAddress();
        this.address2 = bankBranch.getAddress2();
        this.city = bankBranch.getCity();
        this.state = bankBranch.getState();
        this.pincode = bankBranch.getPincode();
        this.phone = bankBranch.getPhone();
        this.fax = bankBranch.getFax();
        this.contactPerson = bankBranch.getContactPerson();
        this.active = bankBranch.getActive();
        this.description = bankBranch.getDescription();
        this.micr = bankBranch.getMicr();
        return this;
    }

}
