package org.egov.commons.model;

import lombok.*;
import org.egov.common.contract.request.User;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Builder
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class BusinessDetails {

	@NotNull
	private Long id;

	@NotNull
	private String name;

	private Boolean isEnabled;

	@NotNull
	private String code;

	@NotNull
	private String businessType;

	private String businessUrl;

	private Long voucherCutoffDate;

	private Integer ordernumber;

	private Boolean voucherCreation;

	private Boolean isVoucherApproved;

	@NotNull
	private String fund;

	private String department;

	private String fundSource;

	private String functionary;
	
	private Boolean callBackForApportioning;

	@NotNull
	private Long businessCategory;

	@NotNull
	private String function;

	@NotNull
	private String tenantId;

	@NotNull
	private Long createdBy;

	private Long createdDate;

	private List<BusinessAccountDetails> accountDetails;

	@NotNull
	private Long lastModifiedBy;

	private Long lastModifiedDate;

	public BusinessDetails(org.egov.commons.web.contract.BusinessDetails detailsInfo,User user) {
		id = detailsInfo.getId();
		name = detailsInfo.getName();
		isEnabled = detailsInfo.getActive();
		code = detailsInfo.getCode();
		businessType = detailsInfo.getBusinessType();
		businessUrl = detailsInfo.getBusinessUrl();
		voucherCutoffDate = detailsInfo.getVoucherCutoffDate();
		ordernumber = detailsInfo.getOrdernumber();
		voucherCreation = detailsInfo.getVoucherCreation();
		isVoucherApproved = detailsInfo.getIsVoucherApproved();
		fund = detailsInfo.getFund();
		department = detailsInfo.getDepartment();
		fundSource = detailsInfo.getFundSource();
		functionary = detailsInfo.getFunctionary();
		businessCategory = detailsInfo.getBusinessCategory();
		function = detailsInfo.getFunction();
		tenantId = detailsInfo.getTenantId();
		createdBy=user.getId();
		lastModifiedBy=user.getId();
		callBackForApportioning=detailsInfo.getCallBackForApportioning();
        accountDetails = new BusinessAccountDetails().getAccountDetails(detailsInfo.getAccountDetails());
	}

	public BusinessDetails toDomainModel() {
		return org.egov.commons.model.BusinessDetails.builder().id(id).name(name).isEnabled(isEnabled).code(code).businessType(businessType)
				.businessUrl(businessUrl).voucherCreation(voucherCreation).isVoucherApproved(isVoucherApproved)
				.voucherCutoffDate(voucherCutoffDate).ordernumber(ordernumber).function(function).fund(fund)
				.functionary(functionary).fundSource(fundSource).tenantId(tenantId).department(department)
                .callBackForApportioning(callBackForApportioning)
                .businessCategory(businessCategory).build();
	}

    public List<BusinessDetails> getDomainList(List<org.egov.commons.web.contract.BusinessDetails> detailsList,User user) {
        return detailsList.stream().map(businessDetails -> new BusinessDetails(businessDetails, user))
                .collect(Collectors.toList());
    }

}
