package org.egov.edcr.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.egov.common.entity.edcr.OccupancyTypeHelper;

public class EdcrIndexData {
	private ApplicationType applicationType;

	private String applicationNumber;
	private Date applicationDate;
	private String status;

	// EdcrApplication
	private String planPermitNumber;
	private Date permitApplicationDate;
	private String transactionNumber;
	private String thirdPartyUserTenant;
	private String applicantName;

	// PlanInformation
	private String serviceType;
	private String architectInformation;

	// EdcrApplicationDetail
	private String dcrNumber;
	private String comparisonDcrNumber;

	// Plot-
	private BigDecimal plotBndryArea;

	// VirtualBuilding-
	private BigDecimal buildingHeight;
	private Set<OccupancyTypeHelper> occupancyTypes = new HashSet<>();
	private BigDecimal totalBuitUpArea;
	private BigDecimal totalFloorArea;
	private BigDecimal totalCarpetArea;
	private BigDecimal floorsAboveGround;

	public EdcrIndexData(ApplicationType applicationType, String applicationNumber, Date applicationDate, String status,
			String planPermitNumber, Date permitApplicationDate, String transactionNumber, String thirdPartyUserTenant,
			String applicantName, String serviceType, String architectInformation, String dcrNumber,
			String comparisonDcrNumber, BigDecimal plotBndryArea, BigDecimal buildingHeight,
			Set<OccupancyTypeHelper> occupancyTypes, BigDecimal totalBuitUpArea, BigDecimal totalFloorArea,
			BigDecimal totalCarpetArea, BigDecimal floorsAboveGround) {
		this.applicationType = applicationType;
		this.applicationNumber = applicationNumber;
		this.applicationDate = applicationDate;
		this.status = status;
		this.planPermitNumber = planPermitNumber;
		this.permitApplicationDate = permitApplicationDate;
		this.transactionNumber = transactionNumber;
		this.thirdPartyUserTenant = thirdPartyUserTenant;
		this.applicantName = applicantName;
		this.serviceType = serviceType;
		this.architectInformation = architectInformation;
		this.dcrNumber = dcrNumber;
		this.comparisonDcrNumber = comparisonDcrNumber;
		this.plotBndryArea = plotBndryArea;
		this.buildingHeight = buildingHeight;
		this.occupancyTypes = occupancyTypes;
		this.totalBuitUpArea = totalBuitUpArea;
		this.totalFloorArea = totalFloorArea;
		this.totalCarpetArea = totalCarpetArea;
		this.floorsAboveGround = floorsAboveGround;
	}

	public EdcrIndexData() {
	}

	public ApplicationType getApplicationType() {
		return applicationType;
	}

	public void setApplicationType(ApplicationType applicationType) {
		this.applicationType = applicationType;
	}

	public String getApplicationNumber() {
		return applicationNumber;
	}

	public void setApplicationNumber(String applicationNumber) {
		this.applicationNumber = applicationNumber;
	}

	public Date getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(Date applicationDate) {
		this.applicationDate = applicationDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPlanPermitNumber() {
		return planPermitNumber;
	}

	public void setPlanPermitNumber(String planPermitNumber) {
		this.planPermitNumber = planPermitNumber;
	}

	public Date getPermitApplicationDate() {
		return permitApplicationDate;
	}

	public void setPermitApplicationDate(Date permitApplicationDate) {
		this.permitApplicationDate = permitApplicationDate;
	}

	public String getTransactionNumber() {
		return transactionNumber;
	}

	public void setTransactionNumber(String transactionNumber) {
		this.transactionNumber = transactionNumber;
	}

	public String getThirdPartyUserTenant() {
		return thirdPartyUserTenant;
	}

	public void setThirdPartyUserTenant(String thirdPartyUserTenant) {
		this.thirdPartyUserTenant = thirdPartyUserTenant;
	}

	public String getApplicantName() {
		return applicantName;
	}

	public void setApplicantName(String applicantName) {
		this.applicantName = applicantName;
	}

	public String getServiceType() {
		return serviceType;
	}

	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}

	public String getArchitectInformation() {
		return architectInformation;
	}

	public void setArchitectInformation(String architectInformation) {
		this.architectInformation = architectInformation;
	}

	public String getDcrNumber() {
		return dcrNumber;
	}

	public void setDcrNumber(String dcrNumber) {
		this.dcrNumber = dcrNumber;
	}

	public String getComparisonDcrNumber() {
		return comparisonDcrNumber;
	}

	public void setComparisonDcrNumber(String comparisonDcrNumber) {
		this.comparisonDcrNumber = comparisonDcrNumber;
	}

	public BigDecimal getPlotBndryArea() {
		return plotBndryArea;
	}

	public void setPlotBndryArea(BigDecimal plotBndryArea) {
		this.plotBndryArea = plotBndryArea;
	}

	public BigDecimal getBuildingHeight() {
		return buildingHeight;
	}

	public void setBuildingHeight(BigDecimal buildingHeight) {
		this.buildingHeight = buildingHeight;
	}

	public Set<OccupancyTypeHelper> getOccupancyTypes() {
		return occupancyTypes;
	}

	public void setOccupancyTypes(Set<OccupancyTypeHelper> occupancyTypes) {
		this.occupancyTypes = occupancyTypes;
	}

	public BigDecimal getTotalBuitUpArea() {
		return totalBuitUpArea;
	}

	public void setTotalBuitUpArea(BigDecimal totalBuitUpArea) {
		this.totalBuitUpArea = totalBuitUpArea;
	}

	public BigDecimal getTotalFloorArea() {
		return totalFloorArea;
	}

	public void setTotalFloorArea(BigDecimal totalFloorArea) {
		this.totalFloorArea = totalFloorArea;
	}

	public BigDecimal getTotalCarpetArea() {
		return totalCarpetArea;
	}

	public void setTotalCarpetArea(BigDecimal totalCarpetArea) {
		this.totalCarpetArea = totalCarpetArea;
	}

	public BigDecimal getFloorsAboveGround() {
		return floorsAboveGround;
	}

	public void setFloorsAboveGround(BigDecimal floorsAboveGround) {
		this.floorsAboveGround = floorsAboveGround;
	}

	@Override
	public String toString() {
		return "EdcrIndexData [applicationType=" + applicationType + ", applicationNumber=" + applicationNumber
				+ ", applicationDate=" + applicationDate + ", status=" + status + ", planPermitNumber="
				+ planPermitNumber + ", permitApplicationDate=" + permitApplicationDate + ", transactionNumber="
				+ transactionNumber + ", thirdPartyUserTenant=" + thirdPartyUserTenant + ", applicantName="
				+ applicantName + ", serviceType=" + serviceType + ", architectInformation=" + architectInformation
				+ ", dcrNumber=" + dcrNumber + ", comparisonDcrNumber=" + comparisonDcrNumber + ", plotBndryArea="
				+ plotBndryArea + ", buildingHeight=" + buildingHeight + ", occupancyTypes=" + occupancyTypes
				+ ", totalBuitUpArea=" + totalBuitUpArea + ", totalFloorArea=" + totalFloorArea + ", totalCarpetArea="
				+ totalCarpetArea + ", floorsAboveGround=" + floorsAboveGround + "]";
	}

}
