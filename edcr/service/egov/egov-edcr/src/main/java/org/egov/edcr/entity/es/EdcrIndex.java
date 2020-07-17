package org.egov.edcr.entity.es;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.elasticsearch.annotations.*;

import java.util.Date;

import static org.egov.infra.utils.ApplicationConstant.DEFAULT_TIMEZONE;
import static org.egov.infra.utils.ApplicationConstant.ES_DATE_FORMAT;

@Document(indexName = "edcr", type = "edcr")
public class EdcrIndex {
	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String id;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String ulbName;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String districtName;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String regionName;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String ulbGrade;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String ulbCode;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String applicationNumber;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = ES_DATE_FORMAT, timezone = DEFAULT_TIMEZONE)
	@Field(type = FieldType.Date, format = DateFormat.date_optional_time, pattern = ES_DATE_FORMAT)
	private Date applicationDate;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String status;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String occupancy;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String applicantName;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String serviceType;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String amenities;

	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String dcrNumber;
	
	@Field(type = FieldType.String, index = FieldIndex.not_analyzed)
	private String stakeHolderId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUlbName() {
		return ulbName;
	}

	public void setUlbName(String ulbName) {
		this.ulbName = ulbName;
	}

	public String getDistrictName() {
		return districtName;
	}

	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	public String getUlbGrade() {
		return ulbGrade;
	}

	public void setUlbGrade(String ulbGrade) {
		this.ulbGrade = ulbGrade;
	}

	public String getUlbCode() {
		return ulbCode;
	}

	public void setUlbCode(String ulbCode) {
		this.ulbCode = ulbCode;
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

	public String getOccupancy() {
		return occupancy;
	}

	public void setOccupancy(String occupancy) {
		this.occupancy = occupancy;
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

	public String getAmenities() {
		return amenities;
	}

	public void setAmenities(String amenities) {
		this.amenities = amenities;
	}

	public String getDcrNumber() {
		return dcrNumber;
	}

	public void setDcrNumber(String dcrNumber) {
		this.dcrNumber = dcrNumber;
	}

	public String getStakeHolderId() {
		return stakeHolderId;
	}

	public void setStakeHolderId(String stakeHolderId) {
		this.stakeHolderId = stakeHolderId;
	}
}
