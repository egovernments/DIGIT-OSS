package org.egov.tl.repository;

import static org.egov.tl.util.TLConstants.ACTION_ADHOC;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.producer.Producer;
import org.egov.tl.repository.builder.TLQueryBuilder;
import org.egov.tl.repository.rowmapper.TLRowMapper;
import org.egov.tl.util.TradeUtil;
import org.egov.tl.web.models.Accessory;
import org.egov.tl.web.models.Document;
import org.egov.tl.web.models.TradeLicense;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tl.web.models.TradeLicenseSearchCriteria;
import org.egov.tl.web.models.TradeUnit;
import org.egov.tl.web.models.User;
import org.egov.tl.workflow.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Repository
public class TLRepository {

    private JdbcTemplate jdbcTemplate;

    private TLQueryBuilder queryBuilder;

    private TLRowMapper rowMapper;

    private Producer producer;

    private TLConfiguration config;

    private WorkflowService workflowService;
    
    private TradeUtil utils;


    @Autowired
    public TLRepository(JdbcTemplate jdbcTemplate, TLQueryBuilder queryBuilder, TLRowMapper rowMapper,
                        Producer producer, TLConfiguration config, WorkflowService workflowService, TradeUtil utils) {
        this.jdbcTemplate = jdbcTemplate;
        this.queryBuilder = queryBuilder;
        this.rowMapper = rowMapper;
        this.producer = producer;
        this.config = config;
        this.workflowService = workflowService;
        this.utils = utils;
    }


    /**
     * Searhces license in databse
     *
     * @param criteria The tradeLicense Search criteria
     * @return List of TradeLicense from seach
     */
    public List<TradeLicense> getLicenses(TradeLicenseSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getTLSearchQuery(criteria, preparedStmtList);
        utils.replaceSchemaPlaceholder(query, criteria.getTenantId());
        List<TradeLicense> licenses =  jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
        sortChildObjectsById(licenses);
        return licenses;
    }

    /**
     * Pushes the request on save topic
     *
     * @param tradeLicenseRequest The tradeLciense create request
     */
    public void save(TradeLicenseRequest tradeLicenseRequest) {
        producer.push(tradeLicenseRequest.getLicenses().get(0).getTenantId(), config.getSaveTopic(), tradeLicenseRequest);
    }
    /**
     * Pushes the update request to update topic or on workflow topic depending on the status
     *
     * @param tradeLicenseRequest The update requuest
     */
    public void update(TradeLicenseRequest tradeLicenseRequest,Map<String,Boolean> idToIsStateUpdatableMap) {
        RequestInfo requestInfo = tradeLicenseRequest.getRequestInfo();
        List<TradeLicense> licenses = tradeLicenseRequest.getLicenses();

        List<TradeLicense> licesnsesForStatusUpdate = new LinkedList<>();
        List<TradeLicense> licensesForUpdate = new LinkedList<>();
        List<TradeLicense> licensesForAdhocChargeUpdate = new LinkedList<>();


        for (TradeLicense license : licenses) {
            if (idToIsStateUpdatableMap.get(license.getId())) {
                licensesForUpdate.add(license);
            }
            else if(license.getAction().equalsIgnoreCase(ACTION_ADHOC))
                licensesForAdhocChargeUpdate.add(license);
            else {
                licesnsesForStatusUpdate.add(license);
            }
        }

        if (!CollectionUtils.isEmpty(licensesForUpdate))
            producer.push(licensesForUpdate.get(0).getTenantId(), config.getUpdateTopic(), new TradeLicenseRequest(requestInfo, licensesForUpdate));

        if (!CollectionUtils.isEmpty(licesnsesForStatusUpdate))
            producer.push(licesnsesForStatusUpdate.get(0).getTenantId(), config.getUpdateWorkflowTopic(), new TradeLicenseRequest(requestInfo, licesnsesForStatusUpdate));

        if(!licensesForAdhocChargeUpdate.isEmpty())
            producer.push(licensesForAdhocChargeUpdate.get(0).getTenantId(), config.getUpdateAdhocTopic(),new TradeLicenseRequest(requestInfo,licensesForAdhocChargeUpdate));

    }




    /**
     * Sorts the child objects by  there ids
     * @param tradeLicenses The list of tradeLicense
     */
    private void sortChildObjectsById(List<TradeLicense> tradeLicenses){
        if(CollectionUtils.isEmpty(tradeLicenses))
            return;
        tradeLicenses.forEach(license -> {
            license.getTradeLicenseDetail().getOwners().sort(Comparator.comparing(User::getUuid));
            license.getTradeLicenseDetail().getTradeUnits().sort(Comparator.comparing(TradeUnit::getId));
            if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getAccessories()))
                license.getTradeLicenseDetail().getAccessories().sort(Comparator.comparing(Accessory::getId));
            if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getApplicationDocuments()))
                license.getTradeLicenseDetail().getApplicationDocuments().sort(Comparator.comparing(Document::getId));
            if(!CollectionUtils.isEmpty(license.getTradeLicenseDetail().getVerificationDocuments()))
                license.getTradeLicenseDetail().getVerificationDocuments().sort(Comparator.comparing(Document::getId));
        });
    }

    public List<TradeLicense> getPlainLicenseSearch(TradeLicenseSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getTLPlainSearchQuery(criteria, preparedStmtList);
        log.info("Query: " + query);
        List<TradeLicense> licenses =  jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
        sortChildObjectsById(licenses);
        return licenses;
    }

    public List<String> fetchTradeLicenseIds(TradeLicenseSearchCriteria criteria){

        List<Object> preparedStmtList = new ArrayList<>();
        preparedStmtList.add(criteria.getOffset());
        preparedStmtList.add(criteria.getLimit());

        return jdbcTemplate.query("SELECT id from eg_tl_tradelicense ORDER BY createdtime offset " +
                        " ? " +
                        "limit ? ",
                preparedStmtList.toArray(),
                new SingleColumnRowMapper<>(String.class));
    }

}
