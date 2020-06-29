package org.egov.demand.helper;

import java.util.List;
import java.util.UUID;

import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.BillRequestV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillHelperV2 {
	
	@Autowired
	private SequenceGenService sequenceGenService;
	
	@Autowired
	private ApplicationProperties applicationProperties;

	public void getBillRequestWithIds(BillRequestV2 billRequest) {
		
		List<BillV2> bills = billRequest.getBills();
		Integer totalNoOfBills = bills.size();
		Integer totalNoOfBillDetails = 0;
		Integer totalNoOfAccountDetails = 0;

		for (BillV2 bill : bills) {
			
			List<BillDetailV2> billDetails = bill.getBillDetails();
			totalNoOfBillDetails = totalNoOfBillDetails + billDetails.size();
			for (BillDetailV2 billDetail : billDetails) {
				
				List<BillAccountDetailV2> accountDetails = billDetail.getBillAccountDetails();
				totalNoOfAccountDetails = totalNoOfAccountDetails + accountDetails.size();
			}
		}
		
		List<String> billNumber = sequenceGenService.getIds(totalNoOfBills,applicationProperties.getBillNumSeqName());
		
		int billIndex = 0;

		for (BillV2 bill : bills) {
			bill.setId(getUUID());
			bill.setBillNumber(billNumber.get(billIndex++));
			List<BillDetailV2> billDetails = bill.getBillDetails();

			for (BillDetailV2 billDetail : billDetails) {
				billDetail.setId(getUUID());
				billDetail.setBillId(bill.getId());
				billDetail.setTenantId(bill.getTenantId());
				List<BillAccountDetailV2> accountDetails = billDetail.getBillAccountDetails();

				for (BillAccountDetailV2 billAccountDetail : accountDetails) {
					billAccountDetail.setId(getUUID());
					billAccountDetail.setBillDetailId(billDetail.getId());
					billAccountDetail.setTenantId(billDetail.getTenantId());
				}

			}
		}
	}

	private String getUUID() {
		return UUID.randomUUID().toString();
	}
}
