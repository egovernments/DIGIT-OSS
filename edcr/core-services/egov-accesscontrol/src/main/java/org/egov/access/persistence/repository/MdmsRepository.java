package org.egov.access.persistence.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.ActionContainer;
import org.egov.access.domain.model.RoleAction;
import org.egov.access.util.Utils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@Repository
@Slf4j
public class MdmsRepository {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${egov.mdms.host}${egov.mdms.path}")
    private String url;

    @Value("${mdms.roleactionmodule.name}")
    private String roleActionModule;

    @Value("${mdms.actionstestmodule.name}")
    private String actionModule;

    @Value("${mdms.roleactionmaster.names}")
    private String roleActionMaster;

    @Value("${mdms.actiontestmaster.names}")
    private String actionMaster;

    @Value("${action.master.mdms.filter}")
    private String actionFilter;


    /**
     * Returns a map of role to URIs authorized
     *  - Ex, CITIZEN -> [/foo/bar, /foo/{}/bar]
     *  - Regular URIs will be part of regular uris
     *  - Regex patterns such as path params are handled and will be part of regex uris]
     *
     *  This method is cacheable and will only run the method when the cache expiration has reached
     *   part of config
     *
     *
     * @param tenantId tenant for which role actions need to be retrieved
     * @return Map of roles to URIs authorized
     */
    @Cacheable(value = "roleActions", sync = true)
    public  Map<String, ActionContainer> fetchRoleActionData(String tenantId){
        List<ModuleDetail> moduleDetail = new ArrayList<ModuleDetail>();
        RequestInfo requestInfo = new RequestInfo();

        MasterDetail actionsMasterDetail =
                MasterDetail.builder().name(actionMaster).filter(actionFilter).build();
        moduleDetail.add(ModuleDetail.builder().moduleName(actionModule).masterDetails(Collections.singletonList(
                actionsMasterDetail)).build());

        MasterDetail roleActionsMasterDetail = MasterDetail.builder().name(roleActionMaster).build();
        moduleDetail.add(ModuleDetail.builder().moduleName(roleActionModule).masterDetails(Collections.singletonList(
                roleActionsMasterDetail)).build());


        MdmsCriteria mc = new MdmsCriteria();
        mc.setTenantId(tenantId);
        mc.setModuleDetails(moduleDetail);

        MdmsCriteriaReq mcq = new MdmsCriteriaReq();
        mcq.setRequestInfo(requestInfo);
        mcq.setMdmsCriteria(mc);

        @SuppressWarnings("unchecked")
        Map<String, Map<String, List>> response = (Map<String, Map<String, List>>) restTemplate.postForObject(url, mcq,
                Map.class).get("MdmsRes");

        if(isNull(response.get(roleActionModule)) || isNull(response.get(roleActionModule).get(roleActionMaster))
                || isNull(response.get(actionModule)) || isNull(response.get(actionModule).get(actionMaster)))
            throw new CustomException("DATA_NOT_AVAILABLE", "Data not available for this tenant");


        return transformMdmsResponse(response);

//        Map<String, List<String>> map = Arrays.stream(roleActions)
//                .filter( roleAction -> actionMap.containsKey(roleAction.getActionId()) )
//                .collect(Collectors.groupingBy(
//                        RoleAction::getRoleCode,
//                        Collectors.mapping(roleAction -> actionMap.get(roleAction.getActionId()).get(0).getUrl(),
//                                Collectors.toList())));
//
//        return map;

    }

    private Map<String, ActionContainer> transformMdmsResponse(Map<String, Map<String, List>> rawResponse){
        RoleAction[] roleActions = objectMapper.convertValue(rawResponse.get(roleActionModule).get(
                roleActionMaster), RoleAction[].class);
        Action[] actions = objectMapper.convertValue(rawResponse.get(actionModule).get(
                actionMaster), Action[].class);


        Map<Long,List<Action>> actionMap =
                Arrays.stream(actions).collect(Collectors.groupingBy(Action::getId) );

        Map<String, ActionContainer> finalMap = new HashMap<>();

        for(RoleAction roleAction : roleActions){
            if(actionMap.containsKey(roleAction.getActionId())){
                if(finalMap.containsKey(roleAction.getRoleCode())){
                    ActionContainer container = finalMap.get(roleAction.getRoleCode());
                    String actionUrl = actionMap.get(roleAction.getActionId()).get(0).getUrl();
                    if(Utils.isRegexUri(actionUrl))
                        container.getRegexUris().add(actionUrl);
                    else
                        container.getUris().add(actionUrl);
                } else{
                    ActionContainer container = new ActionContainer();
                    String actionUrl = actionMap.get(roleAction.getActionId()).get(0).getUrl();
                    if(Utils.isRegexUri(actionUrl))
                        container.getRegexUris().add(actionUrl);
                    else
                        container.getUris().add(actionUrl);

                    finalMap.put(roleAction.getRoleCode(), container);

                }
            }
        }

        return finalMap;
    }


}
