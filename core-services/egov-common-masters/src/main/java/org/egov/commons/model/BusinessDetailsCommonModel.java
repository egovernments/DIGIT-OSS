package org.egov.commons.model;

import java.util.ArrayList;
import java.util.List;

import org.egov.commons.web.contract.BusinessAccountSubLedger;
import org.egov.commons.web.contract.BusinessDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class BusinessDetailsCommonModel {

	List<org.egov.commons.model.BusinessDetails> businessDetails;

	List<BusinessAccountDetails> businessAccountDetails;

	List<BusinessAccountSubLedgerDetails> businessAccountSubledgerDetails;

	public List<BusinessDetails> toDomainContract() {
		List<BusinessDetails> listOfDetailsInfo = new ArrayList<>();
		for (org.egov.commons.model.BusinessDetails details : businessDetails) {
			BusinessDetails detailsRequestInfo = BusinessDetails.builder().id(details.getId())
					.active(details.getIsEnabled()).code(details.getCode()).name(details.getName())
					.businessCategory(details.getBusinessCategory()).businessType(details.getBusinessType())
					.businessUrl(details.getBusinessUrl()).department(details.getDepartment())
					.fundSource(details.getFundSource()).function(details.getFunction())
					.functionary(details.getFunctionary()).fund(details.getFund())
					.isVoucherApproved(details.getIsVoucherApproved()).ordernumber(details.getOrdernumber())
					.tenantId(details.getTenantId()).voucherCreation(details.getVoucherCreation())
					.voucherCutoffDate(details.getVoucherCutoffDate()).callBackForApportioning(details.getCallBackForApportioning()).build();
			
			List<BusinessAccountDetails> requiredBusinessAccountDetails = new ArrayList<>();
			List<org.egov.commons.web.contract.BusinessAccountDetails> contractAccountDetails = new ArrayList<>();
			for (BusinessAccountDetails accountDetails : businessAccountDetails) {
				if (accountDetails.getBusinessDetails().equals(details.getId()))
					requiredBusinessAccountDetails.add(accountDetails);
			}
			for (BusinessAccountDetails requiredAccount : requiredBusinessAccountDetails) {
				contractAccountDetails.add(org.egov.commons.web.contract.BusinessAccountDetails.builder()
						.id(requiredAccount.getId()).amount(requiredAccount.getAmount())
						.chartOfAccounts(requiredAccount.getChartOfAccount()).businessDetails(requiredAccount.getBusinessDetails()).build());

			}
			detailsRequestInfo.setAccountDetails(contractAccountDetails);
			List<BusinessAccountSubLedger> contractAccountSubledger = new ArrayList<>();
			for (org.egov.commons.web.contract.BusinessAccountDetails account : contractAccountDetails) {
				for (BusinessAccountSubLedgerDetails subledgerDetails : businessAccountSubledgerDetails) {
					if (subledgerDetails.getBusinessAccountDetail().getId().equals(account.getId())) {
						contractAccountSubledger.add(BusinessAccountSubLedger.builder().id(subledgerDetails.getId())
								.amount(subledgerDetails.getAmount()).detailKey(subledgerDetails.getAccountDetailKey())
								.detailType(subledgerDetails.getAccountDetailType()).businessAccountDetails(account.getId())
								.build());
					}
				}
			}
			listOfDetailsInfo.add(detailsRequestInfo);
		}
		return listOfDetailsInfo;
	}


}
