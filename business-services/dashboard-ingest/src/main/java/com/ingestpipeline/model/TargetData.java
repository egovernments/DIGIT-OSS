package com.ingestpipeline.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "TargetData")
@JsonIgnoreProperties
public class TargetData implements Serializable {

	@Id  /*@GeneratedValue(strategy=GenerationType.AUTO) */
	@Column(name = "id", nullable = false)
	private int id;

	@Column(name = "snoForMunicipalCorporation", nullable = false)
	private String snoForMunicipalCorporation;

	@Column(name = "tenantIdForMunicipalCorporation", nullable = false)
	private String tenantIdForMunicipalCorporation;

	@Column(name = "ulbName", nullable = false)
	private String ulbName;
	
	@Column(name = "actualCollectionForMunicipalCorporation", nullable = false)
	private BigDecimal actualCollectionForMunicipalCorporation;

	@Column(name = "budgetProposedForMunicipalCorporation", nullable = false)
	private BigDecimal budgetProposedForMunicipalCorporation;
	
	@Column(name = "actualCollectionBudgetedForMunicipalCorporation", nullable = false)
	private BigDecimal actualCollectionBudgetedForMunicipalCorporation;
	
	@Column(name = "financialYear", nullable = false)
	private String financialYear;
	
	@Column(name = "Timestamp", nullable = false)
	private String Timestamp;
	
	@Column(name = "businessService", nullable = false)
	private String businessService;

	public TargetData() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	@JsonProperty("id")
	public int getId() {
		return id;
	}
	@JsonProperty("id")
	public void setId(int id) {
		this.id = id;
	}
	@JsonProperty("snoForMunicipalCorporation")
	public String getSnoForMunicipalCorporation() {
		return snoForMunicipalCorporation;
	}

	public void setSnoForMunicipalCorporation(String snoForMunicipalCorporation) {
		this.snoForMunicipalCorporation = snoForMunicipalCorporation;
	}
	@JsonProperty("tenantIdForMunicipalCorporation")
	public String getTenantIdForMunicipalCorporation() {
		return tenantIdForMunicipalCorporation;
	}

	public void setTenantIdForMunicipalCorporation(String tenantIdForMunicipalCorporation) {
		this.tenantIdForMunicipalCorporation = tenantIdForMunicipalCorporation;
	}
	@JsonProperty("ulbName")
	public String getUlbName() {
		return ulbName;
	}
	@JsonProperty("ulbName")
	public void setUlbName(String ulbName) {
		this.ulbName = ulbName;
	}
	@JsonProperty("actualCollectionForMunicipalCorporation")
	public BigDecimal getActualCollectionForMunicipalCorporation() {
		return actualCollectionForMunicipalCorporation;
	}
	@JsonProperty("actualCollectionForMunicipalCorporation")
	public void setActualCollectionForMunicipalCorporation(BigDecimal actualCollectionForMunicipalCorporation) {
		this.actualCollectionForMunicipalCorporation = actualCollectionForMunicipalCorporation;
	}
	@JsonProperty("budgetProposedForMunicipalCorporation")
	public BigDecimal getBudgetProposedForMunicipalCorporation() {
		return budgetProposedForMunicipalCorporation;
	}
	@JsonProperty("budgetProposedForMunicipalCorporation")
	public void setBudgetProposedForMunicipalCorporation(BigDecimal budgetProposedForMunicipalCorporation) {
		this.budgetProposedForMunicipalCorporation = budgetProposedForMunicipalCorporation;
	}
	@JsonProperty("actualCollectionBudgetedForMunicipalCorporation")
	public BigDecimal getActualCollectionBudgetedForMunicipalCorporation() {
		return actualCollectionBudgetedForMunicipalCorporation;
	}
	@JsonProperty("actualCollectionBudgetedForMunicipalCorporation")
	public void setActualCollectionBudgetedForMunicipalCorporation(BigDecimal actualCollectionBudgetedForMunicipalCorporation) {
		this.actualCollectionBudgetedForMunicipalCorporation = actualCollectionBudgetedForMunicipalCorporation;
	}
	@JsonProperty("financialYear")
	public String getFinancialYear() {
		return financialYear;
	}
	@JsonProperty("financialYear")
	public void setFinancialYear(String financialYear) {
		this.financialYear = financialYear;
	}
	@JsonProperty("Timestamp")
	public String getTimestamp() {
		return Timestamp;
	}
	@JsonProperty("Timestamp")
	public void setTimestamp(String timestamp) {
		Timestamp = timestamp;
	}
	@JsonProperty("businessService")
	public String getBusinessService() {
		return businessService;
	}
	@JsonProperty("businessService")
	public void setBusinessService(String businessService) {
		this.businessService = businessService;
	}

	@Override
	public String toString() {
		return "TargetData [id=" + id + ", snoForMunicipalCorporation=" + snoForMunicipalCorporation
				+ ", tenantIdForMunicipalCorporation=" + tenantIdForMunicipalCorporation + ", ulbName=" + ulbName
				+ ", actualCollectionForMunicipalCorporation=" + actualCollectionForMunicipalCorporation
				+ ", budgetProposedForMunicipalCorporation=" + budgetProposedForMunicipalCorporation
				+ ", actualCollectionBudgetedForMunicipalCorporation=" + actualCollectionBudgetedForMunicipalCorporation
				+ ", financialYear=" + financialYear + ", Timestamp=" + Timestamp + ", businessService="
				+ businessService + "]";
	}
		
}
