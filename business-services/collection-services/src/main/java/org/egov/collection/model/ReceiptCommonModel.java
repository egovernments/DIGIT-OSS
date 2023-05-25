/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 
package org.egov.collection.model;

import lombok.*;
import org.egov.collection.model.enums.CollectionType;
import org.egov.collection.model.enums.Purpose;
import org.egov.collection.model.enums.ReceiptType;
import org.egov.collection.web.contract.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@NoArgsConstructor
public class ReceiptCommonModel {

    private List<ReceiptHeader> receiptHeaders;

	public List<Receipt> toDomainContract() {
		List<Receipt> receipts = new ArrayList<>();

		for (ReceiptHeader receiptHeader : receiptHeaders) {

			List<BillAccountDetail> billAccountDetails = new ArrayList<>();
			for (ReceiptDetail rctDetail : receiptHeader.getReceiptDetails()) {
				if(null != rctDetail.getDramount() ){
				billAccountDetails.add(BillAccountDetail.builder().isActualDemand(rctDetail.getIsActualDemand())
						.id(rctDetail.getId().toString()).tenantId(rctDetail.getTenantId())
						.billDetail(rctDetail.getReceiptHeader().getId().toString())
						.purpose(Purpose.valueOf(rctDetail.getPurpose())).build());
			
				}else{
					billAccountDetails.add(BillAccountDetail.builder().isActualDemand(rctDetail.getIsActualDemand())
							.id(rctDetail.getId().toString()).tenantId(rctDetail.getTenantId())
							.billDetail(rctDetail.getReceiptHeader().getId().toString())
							.glcode(rctDetail.getChartOfAccount())
							.purpose(Purpose.valueOf(rctDetail.getPurpose())).build());
				}
			}
			CollectionType collectnType = null;
			for(CollectionType coll: CollectionType.values()){
				if(coll.getValue().equals(receiptHeader.getCollectionType())){
					collectnType = coll;
					break;
				}
			}
			BillDetail billDetail = BillDetail.builder().id(receiptHeader.getId().toString()).billNumber(receiptHeader.getReferenceNumber())
					.consumerCode(receiptHeader.getConsumerCode()).consumerType(receiptHeader.getConsumerType())
					.collectionModesNotAllowed(Collections.singletonList(receiptHeader.getCollModesNotAllwd()))
					.tenantId(receiptHeader.getTenantId())
					.billAccountDetails(billAccountDetails).businessService(receiptHeader.getBusinessDetails())
					.receiptNumber(receiptHeader.getReceiptNumber()).receiptType(receiptHeader.getReceiptType())
					.channel(receiptHeader.getChannel()).voucherHeader(receiptHeader.getVoucherheader())
					.collectionType(collectnType).boundary(receiptHeader.getBoundary())
					.reasonForCancellation(receiptHeader.getReasonForCancellation())
					.billAccountDetails(billAccountDetails).receiptDate(receiptHeader.getReceiptDateWithTimeStamp()) //read comment on receiptDateWithTimeStamp variable
                    .amountPaid(receiptHeader.getTotalAmount() != null ? BigDecimal.valueOf(receiptHeader.getTotalAmount()) : BigDecimal.ZERO).build();
			if(null != receiptHeader.getMinimumAmount()){
				billDetail.setMinimumAmount(BigDecimal.valueOf(receiptHeader.getMinimumAmount()));
			}
			if(null != receiptHeader.getTotalAmount()){
				billDetail.setTotalAmount(BigDecimal.valueOf(receiptHeader.getTotalAmount()));
			}
			
			Bill billInfo = Bill.builder().payerName(receiptHeader.getPayeename())
					.payerAddress(receiptHeader.getPayeeAddress()).payerEmail(receiptHeader.getPayeeEmail())
					.paidBy(receiptHeader.getPaidBy()).tenantId(receiptHeader.getTenantId())
					.billDetails(Collections.singletonList(billDetail)).build();
			Receipt receipt = Receipt.builder().tenantId(receiptHeader.getTenantId()).bill(Collections.singletonList(billInfo)).
                    transactionId(receiptHeader.getTransactionId()).instrument(receiptHeader.getReceiptInstrument()).build();
            receipts.add(receipt);
		}

		return receipts;
	}

}*/