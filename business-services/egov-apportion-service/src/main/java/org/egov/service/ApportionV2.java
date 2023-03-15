package org.egov.service;

import org.egov.web.models.ApportionRequestV2;
import org.egov.web.models.Bill;
import org.egov.web.models.BillDetail;
import org.egov.web.models.TaxDetail;

import java.util.List;

public interface ApportionV2 {

    /**
     * Should return the code of the BusinessService for which the interface is implemented
     * @return Code of the BusinessService
     */
    String getBusinessService();



    List<TaxDetail> apportionPaidAmount(ApportionRequestV2 apportionRequestV2, Object masterData);

}
