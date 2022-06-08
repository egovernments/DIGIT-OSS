package org.bel.birthdeath.death.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.Valid;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchCriteria {

	@JsonProperty("tenantId")
	@Valid
	private String tenantId;

	@JsonProperty("dateOfDeath")
	@Valid
	private String dateOfDeath;
	
	@JsonProperty("motherName")
	@Valid
	private String motherName;
	
	@JsonProperty("registrationNo")
	@Valid
	private String registrationNo;
	
	@JsonProperty("gender")
	@Valid
	private Integer gender;
	
	@JsonProperty("hospitalId")
	@Valid
	private String hospitalId;
	
	@JsonProperty("deathDtlId")
	@Valid
	private String deathDtlId;
	
	@JsonProperty("id")
	@Valid
	private String id;
	
	@JsonProperty("consumerCode")
	@Valid
	private String consumerCode;
	
	@JsonProperty("fatherName")
	@Valid
	private String fatherName;
	
	@JsonProperty("name")
	@Valid
	private String name;
	
	@JsonProperty("spouseName")
	@Valid
	private String spouseName;

	@Valid
	private String deathcertificateno;

	@Valid
	private String fromDate;

	@Valid
	private String toDate;

	@Valid
	private Integer offset;

	@Valid
	private Integer limit;
	
	public enum SourceEnum {
    	sms("sms"),
        
        email("email"),
        
        ivr("ivr"),
        
        mobileapp("mobileapp"),
        
        whatsapp("whatsapp"),
        
        csc("csc"),
        
        web("web");

        private String value;

        SourceEnum(String value) {
          this.value = value;
        }

        @Override
        public String toString() {
          return String.valueOf(value);
        }

        public static SourceEnum fromValue(String text) {
          for (SourceEnum b : SourceEnum.values()) {
            if (String.valueOf(b.value).equals(text)) {
              return b;
            }
          }
          return null;
        }
      }

      private SourceEnum source;
}
