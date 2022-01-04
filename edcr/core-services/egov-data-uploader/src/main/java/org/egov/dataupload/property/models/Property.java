package org.egov.dataupload.property.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Property
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")
@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Property extends PropertyInfo{


	@JsonProperty("auditDetails")
	private AuditDetails auditDetails;


	public enum CreationReasonEnum {
		NEWPROPERTY("NEWPROPERTY"),

		SUBDIVISION("SUBDIVISION");

		private String value;

		CreationReasonEnum(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return String.valueOf(value);
		}

		@JsonCreator
		public static CreationReasonEnum fromValue(String text) {
			for (CreationReasonEnum b : CreationReasonEnum.values()) {
				if (String.valueOf(b.value).equals(text)) {
					return b;
				}
			}
			return null;
		}
	}

	@JsonProperty("creationReason")
	private CreationReasonEnum creationReason;

	@JsonProperty("occupancyDate")
	private Long occupancyDate;

	@Valid
	@JsonProperty("propertyDetails")
	private List<PropertyDetail> propertyDetails = Arrays.asList(new PropertyDetail());


	public Property addpropertyDetailsItem(PropertyDetail propertyDetailsItem) {
		if (this.propertyDetails == null) {
			this.propertyDetails = new ArrayList<>();
		}
		this.propertyDetails.add(propertyDetailsItem);
		return this;
	}

	@Builder
	public Property(String propertyId, String tenantId, String acknowldgementNumber, String oldPropertyId, StatusEnum status, Address address, AuditDetails auditDetails, CreationReasonEnum creationReason, Long occupancyDate, List<PropertyDetail> propertyDetails) {
		super(propertyId, tenantId, acknowldgementNumber, oldPropertyId, status, address);
		this.auditDetails = auditDetails;
		this.creationReason = creationReason;
		this.occupancyDate = occupancyDate;
		this.propertyDetails = propertyDetails;
	}

}








/*
	public static PropertyBuilder builder(){
		return new PropertyBuilder();
	}

    public static class PropertyBuilder{

		private CreationReasonEnum creationReason;
		private Long occupancyDate;
		private List<PropertyDetail>  propertyDetails;
		private AuditDetails auditDetails;
		private String accountId;

		private String propertyId;
		private String tenantId;
		private String acknowldgementNumber;
		private String oldPropertyId;
		private StatusEnum status;
		private Address address;



		public PropertyBuilder creationReason(CreationReasonEnum creationReason){
			this.creationReason=creationReason;
			return this;
		}

		public PropertyBuilder occupancyDate(Long occupancyDate){
			this.occupancyDate=occupancyDate;
			return this;
		}

		public PropertyBuilder propertyDetail( List<PropertyDetail> propertyDetails){
			this.propertyDetails=propertyDetails;
			return this;
		}

		public PropertyBuilder auditDetails(AuditDetails auditDetails){
			this.auditDetails=auditDetails;
			return this;
		}

		public PropertyBuilder propertyId(String propertyId){
			this.propertyId =propertyId ;
			return this;
		}

		public PropertyBuilder accountId(String accountId){
			this.accountId =accountId ;
			return this;
		}

		public PropertyBuilder tenantId(String tenantId){
			this.tenantId =tenantId ;
			return this;
		}

		public PropertyBuilder acknowldgementNumber(String acknowldgementNumber){
			this.acknowldgementNumber =acknowldgementNumber ;
			return this;
		}

		public PropertyBuilder oldPropertyId(String oldPropertyId){
			this.oldPropertyId=oldPropertyId;
			return this;
		}

		public PropertyBuilder status(StatusEnum status){
			this.status = status;
			return this;
		}

		public PropertyBuilder address(Address address){
			this.address = address;
			return this;
		}

		public Property build(){
			return new Property(this);
		}


	}


	public Property(PropertyBuilder builder) {
		super(builder.propertyId,builder.tenantId,builder.acknowldgementNumber,builder.oldPropertyId,builder.status,builder.address);
		this.auditDetails = builder.auditDetails;
		this.creationReason = builder.creationReason;
		this.occupancyDate = builder.occupancyDate;
		this.propertyDetails = builder.propertyDetails;
		this.accountId=builder.accountId;
	}*/



	/*public Property(AuditDetails auditDetails, String accountId, CreationReasonEnum creationReason, Long occupancyDate, List<PropertyDetail> propertyDetails) {
		this.auditDetails = auditDetails;
		this.accountId = accountId;
		this.creationReason = creationReason;
		this.occupancyDate = occupancyDate;
		this.propertyDetails = propertyDetails;
	}*/

