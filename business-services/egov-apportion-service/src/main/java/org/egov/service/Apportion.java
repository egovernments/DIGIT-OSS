package org.egov.service;

import org.egov.web.models.BillDetail;

import java.math.BigDecimal;
import java.util.*;

public interface Apportion {



    /**
     * Should return the code of the BusinessService for which the interface is implemented
     * @return Code of the BusinessService
     */
    String getBusinessService();


    /**
     * Distibutes the paid amount among the Bill account details
     * @param billDetails The list of BillDetail to be apportioned
     * @param amountPaid The total amount paid against the list of billDetails
     * @return Apportioned BillDetails
     */
    List<BillDetail> apportionPaidAmount(List<BillDetail> billDetails,BigDecimal amountPaid,Object masterData);



}
