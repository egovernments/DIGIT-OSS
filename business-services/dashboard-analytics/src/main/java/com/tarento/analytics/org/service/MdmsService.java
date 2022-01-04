package com.tarento.analytics.org.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.service.impl.RestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

import static com.tarento.analytics.constant.Constants.MDMS_REQUESTINFO;
import static com.tarento.analytics.constant.Constants.TENANTID_PLACEHOLDER;

@Component
public class MdmsService {

    private static Logger logger = LoggerFactory.getLogger(MdmsService.class);

    private Map<String, String> ddrTenantMapping = new HashMap<>();

    private static final String TENANT_MAPPING_PUT_PATIALA_DDR = "Patiala-DDR";
    private static final String TENANT_MAPPING_PUT_BATHINDA_DDR = "Bathinda-DDR";
    private static final String TENANT_MAPPING_PUT_FEROZEPUR_DDR = "Ferozepur-DDR";
    private static final String TENANT_MAPPING_PUT_LUDHIANA_DDR = "Ludhiana-DDR";
    private static final String TENANT_MAPPING_PUT_JALANDHAR_DDR = "Jalandhar-DDR";


    @Value("${egov.mdms.host}")
    private String mdmsServiceHost;
    
    @Value("${egov.mdms.search.endpoint}")
    private String mdmsSearchEndpoint;

    @Autowired
    private RestService restService;

    @Autowired
    private ObjectMapper mapper;

    @Value("${egov.statelevel.tenantId}")
    private  String stateLevelTenantId ;

    @PostConstruct
    public void loadMdmsService() throws Exception{

        String REQUEST_INFO_STR = MDMS_REQUESTINFO.replace(TENANTID_PLACEHOLDER,stateLevelTenantId);
        JsonNode requestInfo = mapper.readTree(REQUEST_INFO_STR);
        try {
            JsonNode response = restService.post(mdmsServiceHost + mdmsSearchEndpoint, "", requestInfo);
            ArrayNode tenants = (ArrayNode) response.findValues(Constants.MDMSKeys.TENANTS).get(0);


            for(JsonNode tenant : tenants) {
                JsonNode ddrCode = tenant.findValue(Constants.MDMSKeys.DISTRICT_CODE);
                JsonNode ddrName = tenant.findValue(Constants.MDMSKeys.DDR_NAME);

                if (!ddrTenantMapping.containsKey(ddrCode.asText())){
                    ddrTenantMapping.put(ddrCode.asText(), ddrName.asText());
                }
            }
        } catch (Exception e){
            getDefaultMapping();
            logger.error("Loading Mdms service error: "+e.getMessage()+" :: loaded default DDRs");
        }
        logger.info("ddrTenantMapping = "+ddrTenantMapping);
    }

    public String getDDRNameByCode(String ddrCode){
        return ddrTenantMapping.getOrDefault(ddrCode, "");
    }

    private void getDefaultMapping(){

        ddrTenantMapping.put("1", "Amritsar-DDR");
        ddrTenantMapping.put("2", TENANT_MAPPING_PUT_PATIALA_DDR);
        ddrTenantMapping.put("3", TENANT_MAPPING_PUT_BATHINDA_DDR);
        ddrTenantMapping.put("4", TENANT_MAPPING_PUT_FEROZEPUR_DDR);
        ddrTenantMapping.put("5", TENANT_MAPPING_PUT_LUDHIANA_DDR);
        ddrTenantMapping.put("6", TENANT_MAPPING_PUT_FEROZEPUR_DDR);
        ddrTenantMapping.put("7", TENANT_MAPPING_PUT_FEROZEPUR_DDR);
        ddrTenantMapping.put("8", "Amritsar-DDR");
        ddrTenantMapping.put("9", TENANT_MAPPING_PUT_JALANDHAR_DDR);
        ddrTenantMapping.put("10", TENANT_MAPPING_PUT_JALANDHAR_DDR);

        ddrTenantMapping.put("11", TENANT_MAPPING_PUT_JALANDHAR_DDR);
        ddrTenantMapping.put("12", TENANT_MAPPING_PUT_LUDHIANA_DDR);
        ddrTenantMapping.put("13", TENANT_MAPPING_PUT_BATHINDA_DDR);
        ddrTenantMapping.put("14", TENANT_MAPPING_PUT_FEROZEPUR_DDR);
        ddrTenantMapping.put("15", TENANT_MAPPING_PUT_PATIALA_DDR);
        ddrTenantMapping.put("16", TENANT_MAPPING_PUT_BATHINDA_DDR);
        ddrTenantMapping.put("17", TENANT_MAPPING_PUT_JALANDHAR_DDR);
        ddrTenantMapping.put("18", "Pathankot-MC");
        ddrTenantMapping.put("19", TENANT_MAPPING_PUT_PATIALA_DDR);
        ddrTenantMapping.put("20", TENANT_MAPPING_PUT_LUDHIANA_DDR);
        ddrTenantMapping.put("21", TENANT_MAPPING_PUT_PATIALA_DDR);
        ddrTenantMapping.put("22", TENANT_MAPPING_PUT_BATHINDA_DDR);
        ddrTenantMapping.put("140001", TENANT_MAPPING_PUT_LUDHIANA_DDR);

    }

}
