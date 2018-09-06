package org.egov.egf.contract.model;

import java.io.Serializable;

public class BankBranch implements Serializable {
	
	private Long id;
	private Bank bank;
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
	private boolean active;
	private String description;
	private String micr;
	private AuditDetails auditDetails;
	public BankBranch(Long id, Bank bank, String code, String name, String address, String address2, String city,
			String state, String pincode, String phone, String fax, String contactPerson, boolean active,
			String description, String micr, AuditDetails auditDetails) {
		this.id = id;
		this.bank = bank;
		this.code = code;
		this.name = name;
		this.address = address;
		this.address2 = address2;
		this.city = city;
		this.state = state;
		this.pincode = pincode;
		this.phone = phone;
		this.fax = fax;
		this.contactPerson = contactPerson;
		this.active = active;
		this.description = description;
		this.micr = micr;
		this.auditDetails = auditDetails;
	}
	
	public BankBranch(){}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Bank getBank() {
		return bank;
	}

	public void setBank(Bank bank) {
		this.bank = bank;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getContactPerson() {
		return contactPerson;
	}

	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getMicr() {
		return micr;
	}

	public void setMicr(String micr) {
		this.micr = micr;
	}

	public AuditDetails getAuditDetails() {
		return auditDetails;
	}

	public void setAuditDetails(AuditDetails auditDetails) {
		this.auditDetails = auditDetails;
	}
	
	

}
