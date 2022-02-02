package org.egov.noc.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.exception.InvalidTenantIdException;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.noc.config.NOCConfiguration;
import org.egov.noc.producer.Producer;
import org.egov.noc.repository.builder.NocQueryBuilder;
import org.egov.noc.repository.rowmapper.NocRowMapper;
import org.egov.noc.util.NOCConstants;
import org.egov.noc.web.model.Noc;
import org.egov.noc.web.model.NocRequest;
import org.egov.noc.web.model.NocSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class NOCRepository {

    @Autowired
    private Producer producer;

    @Autowired
    private NOCConfiguration config;

    @Autowired
    private NocQueryBuilder queryBuilder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private NocRowMapper rowMapper;

    @Autowired
    private MultiStateInstanceUtil centralInstanceUtil;

    /**
     * push the nocRequest object to the producer on the save topic
     * @param nocRequest
     */
    public void save(NocRequest nocRequest) {
        producer.push(nocRequest.getNoc().getTenantId(), config.getSaveTopic(), nocRequest);
    }

    /**
     * pushes the nocRequest object to updateTopic if stateupdatable else to update workflow topic
     * @param nocRequest
     * @param isStateUpdatable
     */
    public void update(NocRequest nocRequest, boolean isStateUpdatable) {
        String tenantId = nocRequest.getNoc().getTenantId();
        if (isStateUpdatable) {
            producer.push(tenantId, config.getUpdateTopic(), nocRequest);
        } else {
            producer.push(tenantId, config.getUpdateWorkflowTopic(), nocRequest);
        }
    }

    /**
     * using the queryBulider query the data on applying the search criteria and return the data parsing throw row mapper
     * @param criteria
     * @return
     */
    public List<Noc> getNocData(NocSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getNocSearchQuery(criteria, preparedStmtList);
        try {
            query = centralInstanceUtil.replaceSchemaPlaceholder(query, criteria.getTenantId());
        } catch (InvalidTenantIdException e) {
            throw new CustomException(NOCConstants.EG_NOC_AS_TENANTID_ERROR,
                    "TenantId length is not sufficient to replace query schema in a multi state instance");
        }
        return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
    }

}
