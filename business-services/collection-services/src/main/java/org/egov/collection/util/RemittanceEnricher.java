package org.egov.collection.util;

import java.util.UUID;

import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.enums.RemittanceStatus;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceDetail;
import org.egov.collection.web.contract.RemittanceInstrument;
import org.egov.collection.web.contract.RemittanceReceipt;
import org.egov.collection.web.contract.RemittanceRequest;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RemittanceEnricher {

    public void enrichRemittancePreValidate(RemittanceRequest remittanceRequest) {
        Remittance remittance = remittanceRequest.getRemittances().get(0);

        remittance.setId(UUID.randomUUID().toString().replace("-", ""));
        remittance.setStatus(RemittanceStatus.APPROVED.name());
        AuditDetails auditDetails = AuditDetails.builder().createdBy(remittanceRequest.getRequestInfo().getUserInfo() != null
                ? remittanceRequest.getRequestInfo().getUserInfo().getId().toString() : null)
                .createdDate(System.currentTimeMillis()).lastModifiedBy(remittanceRequest.getRequestInfo().getUserInfo() != null
                        ? remittanceRequest.getRequestInfo().getUserInfo().getId().toString() : null)
                .lastModifiedDate(System.currentTimeMillis()).build();
        remittance.setAuditDetails(auditDetails);

        for (RemittanceDetail rd : remittance.getRemittanceDetails()) {
            rd.setId(UUID.randomUUID().toString().replace("-", ""));
            rd.setRemittance(remittance.getId());
            rd.setTenantId(remittance.getTenantId());
        }

        for (RemittanceInstrument ri : remittance.getRemittanceInstruments()) {
            ri.setId(UUID.randomUUID().toString().replace("-", ""));
            ri.setRemittance(remittance.getId());
            ri.setTenantId(remittance.getTenantId());
        }

        for (RemittanceReceipt rr : remittance.getRemittanceReceipts()) {
            rr.setId(UUID.randomUUID().toString().replace("-", ""));
            rr.setRemittance(remittance.getId());
            rr.setTenantId(remittance.getTenantId());
        }
    }

}
