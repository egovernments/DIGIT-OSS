package org.egov.collection.web.contract;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@ToString

public class BusinessDetailsRequestInfo {

	private Long id;

	private String code;

	private String name;

	private Boolean active;

	private Long businessCategory;

	private String businessType;

	private String businessUrl;

	private String department;

	private String fundSource;

	private String functionary;

	private Boolean voucherCreation;

	private Boolean isVoucherApproved;
	
	private Boolean callBackForApportioning;

	@JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss", timezone = "UTC")
	private Date voucherCutoffDate;

	private Integer ordernumber;

	private String fund;

	private String function;

	private String tenantId;

	private List<BusinessAccountDetails> accountDetails;

	private List<BusinessAccountSubLedger> subledgerDetails;

}