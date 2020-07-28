package org.egov.collection.service.v1;

import static java.util.Objects.isNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.v1.ReceiptRequest_v1;
import org.egov.collection.model.v1.ReceiptSearchCriteria_v1;
import org.egov.collection.model.v1.Receipt_v1;
import org.egov.collection.repository.querybuilder.v1.CollectionQueryBuilder_v1;
import org.egov.collection.repository.querybuilder.v1.CollectionResultSetExtractor_v1;
import org.egov.collection.util.v1.ReceiptValidator_v1;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CollectionService_v1 {

    private ReceiptValidator_v1 receiptValidator;
    private ApplicationProperties applicationProperties;

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private CollectionResultSetExtractor_v1 collectionResultSetExtractor;
    /**
     * Fetch all receipts matching the given criteria, enrich receipts with instruments
     *
     * @param requestInfo           Request info of the search
     * @param receiptSearchCriteria Criteria against which search has to be performed
     * @return List of matching receipts
     */
    public List<Receipt_v1> getReceipts(RequestInfo requestInfo, ReceiptSearchCriteria_v1 receiptSearchCriteria) {
        ReceiptRequest_v1 receiptReq = ReceiptRequest_v1.builder().requestInfo(requestInfo).build();
        Map<String, String> errorMap = new HashMap<>();
        receiptValidator.validateUserInfo(receiptReq, errorMap);
        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);

        if (applicationProperties.isReceiptsSearchPaginationEnabled()) {
            receiptSearchCriteria.setOffset(isNull(receiptSearchCriteria.getOffset()) ? 0 : receiptSearchCriteria.getOffset());
            receiptSearchCriteria.setLimit(isNull(receiptSearchCriteria.getLimit()) ? applicationProperties.getReceiptsSearchDefaultLimit() :
                    receiptSearchCriteria.getLimit());
        } else {
            receiptSearchCriteria.setOffset(0);
            receiptSearchCriteria.setLimit(applicationProperties.getReceiptsSearchDefaultLimit());
        }
        if(requestInfo.getUserInfo().getType().equals("CITIZEN")) {
            List<String> payerIds = new ArrayList<>();
            payerIds.add(requestInfo.getUserInfo().getUuid());
            receiptSearchCriteria.setPayerIds(payerIds);
        }
        List<Receipt_v1> receipts = fetchReceipts(receiptSearchCriteria);

        return receipts;
    }

    public List<Receipt_v1> fetchReceipts(ReceiptSearchCriteria_v1 receiptSearchCriteria){
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = CollectionQueryBuilder_v1.getReceiptSearchQuery(receiptSearchCriteria, preparedStatementValues);
        log.debug(query);
        List<Receipt_v1> receipts = namedParameterJdbcTemplate.query(query, preparedStatementValues,
                collectionResultSetExtractor);
        return receipts;
    }


}
