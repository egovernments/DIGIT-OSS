package org.egov.egf.instrument.domain.repository;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.common.util.ElasticSearchUtils;
import org.egov.egf.instrument.web.contract.InstrumentAccountCodeSearchContract;
import org.egov.egf.instrument.web.contract.InstrumentSearchContract;
import org.egov.egf.instrument.web.contract.InstrumentTypeSearchContract;
import org.egov.egf.instrument.web.contract.SurrenderReasonSearchContract;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ElasticSearchQueryFactory {

    @Autowired
    private ElasticSearchUtils elasticSearchUtils;

    public BoolQueryBuilder searchInstrument(InstrumentSearchContract instrumentSearchContract) {
        BoolQueryBuilder boolQueryBuilder = boolQuery();
        if (instrumentSearchContract.getIds() != null && !instrumentSearchContract.getIds().isEmpty())
            elasticSearchUtils.add(instrumentSearchContract.getIds(), "id", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getId(), "id", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getTransactionNumber(), "transactionNumber", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getTransactionDate(), "transactionDate", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getAmount(), "amount", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getInstrumentType(), "instrumentType", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getBank(), "bank", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getBranchName(), "branchName", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getBankAccount(), "bankAccount", boolQueryBuilder);

        elasticSearchUtils.add(instrumentSearchContract.getFinancialStatus(), "financialStatus", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getTransactionType(), "transactionType", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getPayee(), "payee", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getDrawer(), "drawer", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getSurrenderReason(), "surrenderReason", boolQueryBuilder);
        elasticSearchUtils.add(instrumentSearchContract.getSerialNo(), "serialNo", boolQueryBuilder);
        if (!instrumentSearchContract.getInstrumentVouchers().isEmpty())
            elasticSearchUtils.add(instrumentSearchContract.getInstrumentVouchers(), "instrumentVouchers", boolQueryBuilder);

        return boolQueryBuilder;
    }

    public BoolQueryBuilder searchInstrumentType(InstrumentTypeSearchContract instrumentTypeSearchContract) {
        BoolQueryBuilder boolQueryBuilder = boolQuery();
        if (instrumentTypeSearchContract.getIds() != null && !instrumentTypeSearchContract.getIds().isEmpty())
            elasticSearchUtils.add(instrumentTypeSearchContract.getIds(), "id", boolQueryBuilder);
        elasticSearchUtils.add(instrumentTypeSearchContract.getId(), "id", boolQueryBuilder);
        elasticSearchUtils.add(instrumentTypeSearchContract.getName(), "name", boolQueryBuilder);
        elasticSearchUtils.add(instrumentTypeSearchContract.getDescription(), "description", boolQueryBuilder);
        elasticSearchUtils.add(instrumentTypeSearchContract.getActive(), "active", boolQueryBuilder);
        // elasticSearchUtils.add(instrumentTypeSearchContract.getInstrumentTypeProperties(), "instrumentTypeProperties",
        // boolQueryBuilder);
        return boolQueryBuilder;
    }

    public BoolQueryBuilder searchInstrumentAccountCode(InstrumentAccountCodeSearchContract instrumentAccountCodeSearchContract) {
        BoolQueryBuilder boolQueryBuilder = boolQuery();
        if (instrumentAccountCodeSearchContract.getIds() != null && !instrumentAccountCodeSearchContract.getIds().isEmpty())
            elasticSearchUtils.add(instrumentAccountCodeSearchContract.getId(), "id", boolQueryBuilder);
        elasticSearchUtils.add(instrumentAccountCodeSearchContract.getInstrumentType(), "instrumentType", boolQueryBuilder);
        elasticSearchUtils.add(instrumentAccountCodeSearchContract.getAccountCode(), "accountCode", boolQueryBuilder);
        return boolQueryBuilder;
    }

    public BoolQueryBuilder searchSurrenderReason(SurrenderReasonSearchContract surrenderReasonSearchContract) {
        BoolQueryBuilder boolQueryBuilder = boolQuery();
        if (surrenderReasonSearchContract.getIds() != null && !surrenderReasonSearchContract.getIds().isEmpty())
            elasticSearchUtils.add(surrenderReasonSearchContract.getId(), "id", boolQueryBuilder);
        elasticSearchUtils.add(surrenderReasonSearchContract.getName(), "name", boolQueryBuilder);
        elasticSearchUtils.add(surrenderReasonSearchContract.getDescription(), "description", boolQueryBuilder);
        return boolQueryBuilder;
    }

    public List<String> prepareOrderBys(String sortBy) {
        List<String> orderByList = new ArrayList<String>();
        List<String> sortByList = new ArrayList<String>();
        if (sortBy.contains(","))
            sortByList = Arrays.asList(sortBy.split(","));
        else
            sortByList = Arrays.asList(sortBy);
        for (String s : sortByList)
            if (s.contains(" ") && (s.toLowerCase().trim().endsWith("asc") || s.toLowerCase().trim().endsWith("desc")))
                orderByList.add(s.trim());
            else
                orderByList.add(s.trim() + " asc");

        return orderByList;
    }

}
