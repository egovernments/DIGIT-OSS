package org.egov.pg.repository;


import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.models.ReceiptRes;
import org.egov.pg.web.models.RequestInfoWrapper;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

@Ignore
public class CollectionsRepositoryTest {

    @Test
    public void name() {
        String url = "http://egov-micro-dev.egovernments.org/collection-services/receipts/_search?tenantId=default&transactionId=DEFA1624961312";
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setTs(0L);
        requestInfo.setApiId("org.egov.pgr");
        requestInfo.setAuthToken("fc03f083-6152-4504-b96c-e0c12b0e8a5b");

        RestTemplate restTemplate = new RestTemplate();
        ReceiptRes receiptRes = restTemplate.postForObject(url, new RequestInfoWrapper(requestInfo), ReceiptRes
                .class);
        System.out.println(receiptRes);
    }
}
