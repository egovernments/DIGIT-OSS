package org.egov.pt.models.oldProperty;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
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
public class OldProperty extends PropertyInfo {


	@JsonProperty("auditDetails")
	private OldAuditDetails oldAuditDetails;


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
	private List<PropertyDetail> propertyDetails;

	@JsonProperty("additionalDetails")
	private Object additionalDetails;


	public OldProperty addpropertyDetailsItem(PropertyDetail propertyDetailsItem) {
		if (this.propertyDetails == null) {
			this.propertyDetails = new ArrayList<>();
		}
		this.propertyDetails.add(propertyDetailsItem);
		return this;
	}


	public static PropertyBuilder builder(){
		return new PropertyBuilder();
	}

    public static class PropertyBuilder{

		private CreationReasonEnum creationReason;
		private Long occupancyDate;
		
		@NotNull
		@Valid
		private List<PropertyDetail>  propertyDetails;
		private OldAuditDetails oldAuditDetails;

		private String propertyId;
		
		@NotEmpty
		private String tenantId;
		private String acknowldgementNumber;
		private String oldPropertyId;
		private StatusEnum status;
		
		@NotNull
		@Valid
		private Address address;
		private Object additionalDetails;



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

		public PropertyBuilder auditDetails(OldAuditDetails oldAuditDetails){
			this.oldAuditDetails = oldAuditDetails;
			return this;
		}

		public PropertyBuilder additionalDetails(Object additionalDetails){
			this.additionalDetails = additionalDetails;
			return this;
		}

		public PropertyBuilder propertyId(String propertyId){
			this.propertyId =propertyId ;
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

		public OldProperty build(){
			return new OldProperty(this);
		}


	}


	public OldProperty(PropertyBuilder builder) {
		super(builder.propertyId,builder.tenantId,builder.acknowldgementNumber,builder.oldPropertyId,builder.status,builder.address);
		this.oldAuditDetails = builder.oldAuditDetails;
		this.creationReason = builder.creationReason;
		this.occupancyDate = builder.occupancyDate;
		this.propertyDetails = builder.propertyDetails;

	}
}
