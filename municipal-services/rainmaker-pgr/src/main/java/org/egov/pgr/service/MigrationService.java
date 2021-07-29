package org.egov.pgr.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pgr.contract.Address;
import org.egov.pgr.contract.MigrationCriteria;
import org.egov.pgr.contract.ServiceReqSearchCriteria;
import org.egov.pgr.contract.ServiceResponse;
import org.egov.pgr.model.ActionHistory;
import org.egov.pgr.model.ActionInfo;
import org.egov.pgr.producer.PGRProducer;
import org.egov.pgr.repository.rowmapper.ActionInfoRowMapper;
import org.egov.pgr.repository.rowmapper.AddressRowMapper;
import org.egov.pgr.repository.rowmapper.ServiceRowMapper;
import org.egov.pgr.utils.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Service
@Slf4j
public class MigrationService {



    @Value("${migration.batch.size}")
    private Long batchSize;

    @Value("${kafka.migration.topic}")
    private String migrationTopic;


    private PGRProducer producer;

    private GrievanceService grievanceService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ServiceRowMapper svcRowMapper;

    @Autowired
    private AddressRowMapper addressRowMapper;

    @Autowired
    private ActionInfoRowMapper actionInfoRowMapper;

    @Autowired
    private ResponseInfoFactory factory;

    @Autowired
    public MigrationService(PGRProducer producer, GrievanceService grievanceService) {
        this.producer = producer;
        this.grievanceService = grievanceService;
    }

    public void migrateData(RequestInfo requestInfo, MigrationCriteria migrationCriteria){

        Set<String> tenantIds = (!CollectionUtils.isEmpty(migrationCriteria.getTenantIds())) ? migrationCriteria.getTenantIds() : getListOfTenantId();
        Long noOfRecords = 0l;

        for(String tenantId : tenantIds){

            String sqlCount="  SELECT count(*)"+
                    " FROM eg_pgr_service_v2 "+
                    " WHERE tenantid = ?";

            String sqlFetch = " SELECT * FROM eg_pgr_service"+
                    " WHERE tenantid = ?";

            Long count = jdbcTemplate.queryForObject(sqlCount, new Object[] { tenantId }, Long.class);

            Long offset = CollectionUtils.isEmpty(migrationCriteria.getServiceRequestIds()) ? count : 0l;

            while (true){

                /* ######### COMMENTED OUT SINCE plainSearch QUERY WAS INEFFICIENT ############
                ServiceReqSearchCriteria criteria = ServiceReqSearchCriteria.builder().offset(offset).limit(batchSize).tenantId(tenantId).build();
                ServiceResponse serviceReqResponse = (ServiceResponse) grievanceService.getServiceRequestDetailsForPlainSearch(requestInfo,criteria);
                ############################################################################ */

                log.info("####### OFFSET ####### " + offset);

                List<Object> preparedStmtList = new ArrayList<>();
                preparedStmtList.add(tenantId);

                String addServiceRequestIdSearchClause = createServiceRequestIdSearchClause(sqlFetch, migrationCriteria.getServiceRequestIds());
                if(!CollectionUtils.isEmpty(migrationCriteria.getServiceRequestIds()))
                    addToPreparedStatement(preparedStmtList, migrationCriteria.getServiceRequestIds());

                String finalQuery = addPagination(addServiceRequestIdSearchClause);
                preparedStmtList.add(offset);
                preparedStmtList.add(batchSize);

                log.info("Final Search Query: " + finalQuery);

                List<org.egov.pgr.model.Service> services = jdbcTemplate.query(finalQuery, preparedStmtList.toArray(), svcRowMapper);

                noOfRecords += services.size();

                List<String> addressIds = new ArrayList<>();
                services.forEach(service -> {
                    addressIds.add(service.getAddressId());
                });

                Map<String, Address> idToAddressMap = fetchAddressIdToAddressMap(addressIds);

                services.forEach(service -> {
                    service.setAddressDetail(idToAddressMap.get(service.getAddressId()));
                });

                List<ActionHistory> actionHistoryList = new ArrayList<>();

                List<String> actionIds = new ArrayList<>();
                services.forEach(service -> actionIds.add(service.getServiceRequestId()));


                Map<String, ActionHistory> idToActionHistoryMap = fetchServiceRequestIdToActionHistoryMap(actionIds);

                services.forEach(service -> {
                    actionHistoryList.add(idToActionHistoryMap.get(service.getServiceRequestId()));
                });

                ServiceResponse serviceReqResponse = ServiceResponse.builder()
                        .responseInfo(factory.createResponseInfoFromRequestInfo(requestInfo, true))
                        .services(services)
                        .actionHistory(actionHistoryList)
                        .build();

                if(CollectionUtils.isEmpty(serviceReqResponse.getServices())){
                    log.info("Total number of records pushed: " + noOfRecords);
                    log.info("Records pushed for tenantId: "+tenantId+" Current offset for the tenant: "+offset);
                    break;
                }

                offset = offset + batchSize;

                producer.push(migrationTopic,serviceReqResponse);

            }

        }

    }

    private Map<String, Address> fetchAddressIdToAddressMap(List<String> ids){

        Map<String, Address> idToAddressMap = new HashMap<>();

        if(CollectionUtils.isEmpty(ids)){
            return idToAddressMap;
        }

        StringBuilder fetchAddress = new StringBuilder(" SELECT * FROM eg_pgr_address"+
                " WHERE uuid IN (");

        fetchAddress.append(createQuery(ids)).append(")");

        List<Object> preparedStatementList = new ArrayList<>();

        addToPreparedStatement(preparedStatementList, ids);

        List<Address> addressList = jdbcTemplate.query(fetchAddress.toString(), preparedStatementList.toArray(), addressRowMapper);

        addressList.forEach(address -> {
            idToAddressMap.put(address.getUuid(), address);
        });

        return idToAddressMap;
    }

    private Map<String, ActionHistory> fetchServiceRequestIdToActionHistoryMap(List<String> ids){

        Map<String, ActionHistory> idToActionHistoryMap = new HashMap<>();

        if(CollectionUtils.isEmpty(ids)){
            return idToActionHistoryMap;
        }

        StringBuilder fetchActions = new StringBuilder(" SELECT * FROM eg_pgr_action"+
                " WHERE businesskey IN (");

        fetchActions.append(createQuery(ids)).append(")");

        Map<String, List<ActionInfo> > idToActionListMap = new HashMap<>();

        List<Object> preparedStatementList = new ArrayList<>();

        addToPreparedStatement(preparedStatementList, ids);

        List<ActionInfo> actionInfoList = jdbcTemplate.query(fetchActions.toString(), preparedStatementList.toArray(), actionInfoRowMapper);

        actionInfoList.forEach(actionInfo -> {
            if(!idToActionListMap.containsKey(actionInfo.getBusinessKey())){
                idToActionListMap.put(actionInfo.getBusinessKey(), new ArrayList<>());
            }
            idToActionListMap.get(actionInfo.getBusinessKey()).add(actionInfo);
        });

        for(String id : idToActionListMap.keySet()){
            idToActionHistoryMap.put(id, ActionHistory.builder().actions(idToActionListMap.get(id)).build());
        }

        return idToActionHistoryMap;
    }

    private String createQuery(Collection<String> ids) {
        StringBuilder builder = new StringBuilder();
        int length = ids.size();
        for( int i = 0; i< length; i++){
            builder.append(" ? ");
            if(i != length-1) builder.append(",");
        }
        return builder.toString();
    }

    private void addToPreparedStatement(List<Object> preparedStmtList, Collection<String> ids)
    {
        ids.forEach(id ->{ preparedStmtList.add(id);});
    }

    private String addPagination(String sql){
        StringBuilder query = new StringBuilder(sql);
        query.append(" OFFSET ? LIMIT ?");
        return query.toString();
    }

    private String createServiceRequestIdSearchClause(String sql, Set<String> ids) {
        if(CollectionUtils.isEmpty(ids)){
            return sql;
        }
        StringBuilder query = new StringBuilder(sql);
        query.append(" AND servicerequestid IN (").append(createQuery(ids)).append(")");
        return query.toString();
    }

    private Set<String> getListOfTenantId(){
        Set<String> tenantIds = new HashSet<>();

        // TO DO

        return tenantIds;


    }


}
