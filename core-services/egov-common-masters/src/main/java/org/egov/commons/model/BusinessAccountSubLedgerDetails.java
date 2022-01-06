package org.egov.commons.model;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.commons.web.contract.BusinessAccountSubLedger;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
@Builder
@AllArgsConstructor
@EqualsAndHashCode
public class BusinessAccountSubLedgerDetails {

	@NotNull
	private Long id;

	@NotNull
	private Double amount;

	@NotNull
	private BusinessAccountDetails businessAccountDetail;

	private Long accountDetailKey;

	@NotNull
	private Long accountDetailType;

	@NotNull
	private String tenantId;

	public BusinessAccountSubLedgerDetails(BusinessAccountSubLedger subledger,List<BusinessAccountDetails>listModelAccountDetails ,
			BusinessDetails modelDetails,
			boolean isUpdate) {
		id = subledger.getId();
		amount = subledger.getAmount();
		accountDetailKey = subledger.getDetailKey();
		accountDetailType = subledger.getDetailType();
		tenantId = modelDetails.getTenantId();
		if (!isUpdate)
			businessAccountDetail = getModelAccountDetail(subledger.getBusinessAccountDetails(),listModelAccountDetails);
		else
			businessAccountDetail = getBusinessAccountDetailForUpdate(subledger);
	}

	public BusinessAccountSubLedgerDetails toDomainModel() {

		BusinessAccountDetails accountDetails = BusinessAccountDetails.builder().id(businessAccountDetail.getId())
				.build();
		return BusinessAccountSubLedgerDetails.builder().accountDetailKey(accountDetailKey)
				.accountDetailType(accountDetailType).amount(amount).id(id).tenantId(tenantId)
				.businessAccountDetail(accountDetails).build();
	}

	private BusinessAccountDetails getBusinessAccountDetailForUpdate(BusinessAccountSubLedger subledger) {

		return BusinessAccountDetails.builder().id(subledger.getBusinessAccountDetails()).build();
	}

	private BusinessAccountDetails getModelAccountDetail(
			Long serviceAccountDetails,List<BusinessAccountDetails>listModelAccountDetails) {
		BusinessAccountDetails modelBusinessAccountDetail = new BusinessAccountDetails();
		for(BusinessAccountDetails accountDetail:listModelAccountDetails){
			if(accountDetail.getId() ==serviceAccountDetails)
				modelBusinessAccountDetail=accountDetail;
		}
		return modelBusinessAccountDetail;
	}

	@Override
	public boolean equals(Object obj) {
		System.out.println("beginning");
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		BusinessAccountSubLedgerDetails other = (BusinessAccountSubLedgerDetails) obj;
		if (accountDetailKey == null) {
			if (other.accountDetailKey != null)
				return false;
		} else if (!accountDetailKey.equals(other.accountDetailKey))
			return false;
		if (accountDetailType == null) {
			if (other.accountDetailType != null)
				return false;
		} else if (!accountDetailType.equals(other.accountDetailType))
			return false;
		if (amount == null) {
			if (other.amount != null)
				return false;
		} else if (!amount.equals(other.amount))
			return false;
		if (tenantId == null) {
			if (other.tenantId != null)
				return false;
		} else if (!tenantId.equals(other.tenantId))
			return false;
		if (businessAccountDetail == null) {
			if (other.businessAccountDetail != null)
				return false;
		} else if (!businessAccountDetail.equals(other.businessAccountDetail))
			return false;

		return true;

	}

}
