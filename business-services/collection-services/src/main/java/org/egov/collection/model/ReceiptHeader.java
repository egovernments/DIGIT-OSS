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
 */

package org.egov.collection.model;

import lombok.*;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;
@ToString
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ReceiptHeader {
	
	private Long id;
	
	private String payeename;

	private String payeeAddress;

	private String payeeEmail;

	private String paidBy;
	
	private String referenceNumber;
	
	private Date referenceDate;
	
	@NotNull
	private String receiptType;
	
	private String receiptNumber;
	
	private Long reference_ch_id;
	
	private Set<ReceiptDetail> receiptDetails = new LinkedHashSet<>(0);
	
    private Instrument receiptInstrument;

	private Date receiptDate;
	
	//This has been added to obtain receipt date alongwith timestamp in search receipt result.
	//Ideally there has to be a change in the contract and modification in row mapping logic.
	private Long receiptDateWithTimeStamp; 
	
	private String referenceDesc;
	
	private String manualReceiptNumber;
	
	private Date manualReceiptDate;
	
	private String businessDetails;
	
	private String collectionType;
	
	private Long stateId;
	
	private Long location;
	
	private Boolean isReconciled;
	
	private String status;
	
	private String reasonForCancellation;
	
	private String channel;
	
	private Double minimumAmount;
	
	private Double totalAmount;
	
	private String consumerCode;
	
	private String consumerType;
	
	private String fund;
	
	private String collModesNotAllwd;
	
	private String fundSource;
	
	private String function;
	
	private String boundary;
	
	private String department;
	
	private String depositedBranch;
	
    private String tenantId;
    
    private String displayMsg;
    
    private String voucherheader;
    
    private Long version;
    
    private Long createdBy;
    
    private Date createdDate;
    
    private Long lastModifiedBy;
    
    private Date lastModifiedDate;
    
    private String cancellationRemarks;

    private String transactionId;
    
    
    
    public ReceiptHeader toDomainModel(){
    	return ReceiptHeader.builder().id(id).payeename(payeename).payeeAddress(payeeAddress).payeeEmail(payeeEmail).
    			paidBy(paidBy).referenceNumber(referenceNumber).referenceDate(referenceDate).referenceDesc(referenceDesc)
    			.manualReceiptNumber(manualReceiptNumber).manualReceiptDate(manualReceiptDate).businessDetails(businessDetails).
    			collectionType(collectionType).stateId(stateId).location(location).isReconciled(isReconciled).status(status)
    			.reasonForCancellation(reasonForCancellation).channel(channel).minimumAmount(minimumAmount).totalAmount(totalAmount)
    			.consumerCode(consumerCode).consumerType(consumerType).fund(fund).collModesNotAllwd(collModesNotAllwd).fundSource
    			(fundSource).function(function).boundary(boundary).receiptType(receiptType).receiptNumber(receiptNumber)
    			.cancellationRemarks(cancellationRemarks).reference_ch_id(reference_ch_id).receiptDate(receiptDate).
    			department(department).depositedBranch(depositedBranch).tenantId(tenantId).displayMsg(displayMsg).
    			voucherheader(voucherheader).version(version).createdBy(createdBy).createdDate(createdDate).
    			lastModifiedBy(lastModifiedBy).lastModifiedDate(lastModifiedDate).transactionId(transactionId).build();
    }
}