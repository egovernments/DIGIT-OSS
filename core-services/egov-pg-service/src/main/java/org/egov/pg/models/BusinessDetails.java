package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@Builder
@Getter
@EqualsAndHashCode
@ToString

public class BusinessDetails {
	private Long id;

	private String code;

	private String name;

	private Boolean active;

	private Long businessCategory;

	private String businessType;

	private String businessUrl;

	private Boolean voucherCreation;

	private Boolean isVoucherApproved;
	
	private Boolean callBackForApportioning;

	@JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss", timezone = "UTC")
	private Date voucherCutoffDate;

	private Integer ordernumber;

	private String fund;

	private String function;

	private String tenantId;

	private String department;

	private String fundSource;

	private String functionary;

}
