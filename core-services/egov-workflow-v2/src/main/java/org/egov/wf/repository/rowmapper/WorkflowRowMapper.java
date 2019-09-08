package org.egov.wf.repository.rowmapper;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.User;
import org.egov.wf.web.models.Action;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.Document;
import org.egov.wf.web.models.ProcessInstance;
import org.egov.wf.web.models.State;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class WorkflowRowMapper implements ResultSetExtractor<List<ProcessInstance>> {


    /**
     * Converts resultset to List of processInstances
     * @param rs The resultSet from db query
     * @return List of ProcessInstances from the resultset
     * @throws SQLException
     * @throws DataAccessException
     */
    public List<ProcessInstance> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String,ProcessInstance> processInstanceMap = new LinkedHashMap<>();

        while (rs.next()){
            String id = rs.getString("wf_id");
            ProcessInstance processInstance = processInstanceMap.get(id);

            if(processInstance==null) {
                Long lastModifiedTime = rs.getLong("wf_lastModifiedTime");
                if (rs.wasNull()) {
                    lastModifiedTime = null;
                }

                Long sla = rs.getLong("sla");
                if (rs.wasNull()) {
                    sla = null;
                }

                Long businessServiceSla = rs.getLong("businessservicesla");
                if (rs.wasNull()) {
                    businessServiceSla = null;
                }

                AuditDetails auditdetails = AuditDetails.builder()
                        .createdBy(rs.getString("wf_createdBy"))
                        .createdTime(rs.getLong("wf_createdTime"))
                        .lastModifiedBy(rs.getString("wf_lastModifiedBy"))
                        .lastModifiedTime(lastModifiedTime)
                        .build();

                String assigneeUuid = rs.getString("assignee");
                String assignerUuid = rs.getString("assigner");
                User assignee=null,assigner;
                assigner = User.builder().uuid(assignerUuid).build();
                if(assigneeUuid!=null)
                     assignee = User.builder().uuid(assigneeUuid).build();

                State state = State.builder()
                        .tenantId(rs.getString("st_tenantId"))
                        .uuid(rs.getString("st_uuid"))
                        .state(rs.getString("state"))
                        .sla(sla)
                        .applicationStatus(rs.getString("applicationStatus"))
                        .isStartState(rs.getBoolean("isStartState"))
                        .isTerminateState(rs.getBoolean("isTerminateState"))
                        .docUploadRequired(rs.getBoolean("docuploadrequired"))
                        .businessServiceId(rs.getString("businessserviceid"))
                        .build();


                processInstance = ProcessInstance.builder()
                        .id(rs.getString("id"))
                        .tenantId(rs.getString("tenantid"))
                        .businessService(rs.getString("businessService"))
                        .businessId(rs.getString("businessId"))
                        .action(rs.getString("action"))
                        .state(state)
                        .comment(rs.getString("comment"))
                        .assignee(assignee)
                        .assigner(assigner)
                        .stateSla(sla)
                        .businesssServiceSla(businessServiceSla)
                        .previousStatus(rs.getString("previousStatus"))
                        .moduleName(rs.getString("moduleName"))
                        .auditDetails(auditdetails)
                        .build();
            }
            addChildrenToProperty(rs,processInstance);
            processInstanceMap.put(id,processInstance);
        }
        return new ArrayList<>(processInstanceMap.values());
    }


    /**
     * Adds nested object to the parent
     * @param rs The resultSet from db query
     * @param processInstance The parent ProcessInstance Object
     * @throws SQLException
     */
    private void addChildrenToProperty(ResultSet rs, ProcessInstance processInstance) throws SQLException {

        String documentId = rs.getString("doc_id");

        if(documentId!=null){

            Long lastModifiedTime = rs.getLong("doc_lastModifiedTime");
            if (rs.wasNull()) {
                lastModifiedTime = null;
            }

            AuditDetails auditdetails = AuditDetails.builder()
                    .createdBy(rs.getString("doc_createdBy"))
                    .createdTime(rs.getLong("doc_createdTime"))
                    .lastModifiedBy(rs.getString("doc_lastModifiedBy"))
                    .lastModifiedTime(lastModifiedTime)
                    .build();

            Document document = Document.builder()
                    .id(documentId)
                    .tenantId(rs.getString("doc_tenantid"))
                    .documentUid(rs.getString("documentUid"))
                    .documentType(rs.getString("documentType"))
                    .fileStoreId(rs.getString("fileStoreId"))
                    .auditDetails(auditdetails)
                    .build();
            processInstance.addDocumentsItem(document);
        }

        String actionUuid = rs.getString("ac_uuid");
        /*
         * null check added for action id to avoid adding empty action object in end state
         * 
         * also avoiding action related errors on end state
         */
        if(null != actionUuid) {
        String roles = rs.getString("roles");
        Action action = Action.builder()
                .tenantId(rs.getString("ac_tenantId"))
                .action(rs.getString("ac_action"))
                .nextState(rs.getString("nextState"))
                .uuid(actionUuid)
                .currentState(rs.getString("currentState"))
                .roles(StringUtils.isEmpty(roles) ? Arrays.asList() : Arrays.asList(roles.split(","))) 
                .build();
        processInstance.getState().addActionsItem(action);
        }
    }



    }
