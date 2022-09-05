package org.egov.rn.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.rn.service.dhis2.requests.CampaginDataEntryRequest;
import org.egov.rn.service.dhis2.requests.CreateCampaginRequest;
import org.egov.rn.service.dhis2.requests.DHis2Dataset;
import org.egov.rn.service.dhis2.requests.Form;
import org.egov.rn.service.dhis2.responses.CampaginDataEntryResponse;
import org.egov.rn.service.dhis2.responses.CampaginResponse;
import org.egov.rn.service.dhis2.responses.DHis2DatasetResponse;
import org.egov.rn.service.dhis2.responses.FetchDhis2DataSetResponse;
import org.egov.rn.service.dhis2.responses.dataentries.StoredCampaginDataEntryResponse;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.RegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DHIS2Service {

    private final String AUTHTOKEN = "Basic YWRtaW46ZGlzdHJpY3Q=";
    private final String DHIS2_INSTANCE = "http://43.205.92.152/api/";

    private RestTemplate restTemplate;

    private static String config = "{\n" +
            "  \"orgUnit\": \"LJX5GuypkKy\",\n" +
            "  \"name\": {\n" +
            "    \"dhis2DataElementId\": \"YDeCE3dFlrH\"\n" +
            "  },\n" +
            "  \"dateOfRegistration\": {\n" +
            "    \"dhis2DataElementId\": \"random-date-of-registration\"\n" +
            "  },\n" +
            "  \"registrationType\": {\n" +
            "    \"dhis2DataElementId\": \"random-registration-type\"\n" +
            "  },\n" +
            "  \"gender\": {\n" +
            "    \"dhis2DataElementId\": \"WeqK1J3Olk6\"\n" +
            "  },\n" +
            "  \"dateOfBirth\": {\n" +
            "    \"dhis2DataElementId\": \"ZZF2tgZtV2A\"\n" +
            "  },\n" +
            "  \"isHead\": {\n" +
            "    \"dhis2DataElementId\": \"VOKjiHnbhby\"\n" +
            "  }\n" +
            "}";

    @Autowired
    public DHIS2Service(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String getDHISResource(String resource) {
        return DHIS2_INSTANCE + resource;
    }

    public DHis2DatasetResponse createCampaign(CreateCampaginRequest campaginRequest) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", AUTHTOKEN);
        HttpEntity<DHis2Dataset> request = new HttpEntity(campaginRequest.getDHISRequest(restTemplate), headers);
        DHis2DatasetResponse response = restTemplate.postForEntity(getDHISResource("dataSets"), request, DHis2DatasetResponse.class).getBody();
        return response;
    }

    public CampaginDataEntryResponse createDataEntry(String campaignId, CampaginDataEntryRequest campaginDataEntryRequest) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", AUTHTOKEN);
        HttpEntity<CampaginDataEntryResponse> request = new HttpEntity(campaginDataEntryRequest.getDhis2DataEntryRequest(campaignId), headers);
        CampaginDataEntryResponse response = restTemplate.postForEntity(getDHISResource("dataValueSets"), request, CampaginDataEntryResponse.class).getBody();
        log.info(response.toString());
        return response;
    }

    public List<CampaginResponse> getCampagins() {
        return getDhis2Datasets().getDataSets().stream().map(element -> element.getCampaginResponse()).collect(Collectors.toList());
    }

    public List<DHis2Dataset> getCampaginsInDhis2Format() {
        return getDhis2Datasets().getDataSets();
    }

    private FetchDhis2DataSetResponse getDhis2Datasets() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", AUTHTOKEN);
        ResponseEntity<FetchDhis2DataSetResponse> response = restTemplate.exchange(
                getDHISResource("dataSets?fields=*&paging=false"),
                HttpMethod.GET,
                new HttpEntity(headers),
                FetchDhis2DataSetResponse.class,
                1
        );
        return response.getBody();
    }

    public StoredCampaginDataEntryResponse getDhis2DataEntires(String orgUnit, String campaginId, String startDate, String endDate) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", AUTHTOKEN);

        String urlTemplate = UriComponentsBuilder.fromHttpUrl(getDHISResource("dataValueSets"))
                .queryParam("orgUnit", "{orgUnit}")
                .queryParam("dataSet", "{dataSet}")
                .queryParam("startDate", "{startDate}")
                .queryParam("endDate", "{endDate}")
                .encode()
                .toUriString();
        Map<String, String> params = new HashMap<>();
        params.put("orgUnit", orgUnit);
        params.put("dataSet", campaginId);
        params.put("startDate", startDate);
        params.put("endDate", endDate);


        ResponseEntity<StoredCampaginDataEntryResponse> response = restTemplate.exchange(
                urlTemplate,
                HttpMethod.GET,
                new HttpEntity(headers),
                StoredCampaginDataEntryResponse.class,
                params
        );
        return response.getBody();

    }

    public void submitDataToDhis2(RegistrationRequest registrationRequest) {
        HouseholdRegistration hr = (HouseholdRegistration) registrationRequest.getRegistration();
        List<Form> forms = new ArrayList<Form>();
        CampaginDataEntryRequest campaginDataEntryRequest = new CampaginDataEntryRequest();
        ArrayList<String> fields = new ArrayList<String>(Arrays.asList("name", "gender", "dateOfBirth", "isHead"));
        fields.forEach(field -> {
            Form formElement = new Form();
            formElement.setComment(field);
            formElement.setDataElement(getDhis2FormId(field));
            try {
                formElement.setValue((String) hr.getClass().getMethod("get" + StringUtils.capitalize(field)).invoke(hr).toString());
            } catch (Exception e) {
                log.error(e.toString());
            }
            forms.add(formElement);
        });
        log.info(forms.toString());
        // Form as per our requirement
        campaginDataEntryRequest.setForm(forms);
        // Below two fields are DHIS2 requirement
        campaginDataEntryRequest.setOrgUnit(getOrgUnit());
        campaginDataEntryRequest.setPeriod(registrationRequest.getRegistration().getDateOfRegistration().toString());
        log.info(campaginDataEntryRequest.toString());
        createDataEntry(registrationRequest.getRegistration().getCampaginId(),campaginDataEntryRequest);
    }

    private String getOrgUnit() {
        try {
            Map<String, Object> mapping = new ObjectMapper().readValue(config, HashMap.class);
            return mapping.get("orgUnit").toString();
        } catch (Exception err) {
            return "";
        }

    }

    public static String getDhis2FormId(String dataElementName) {
        try {
            Map<String, Object> mapping = new ObjectMapper().readValue(config, HashMap.class);
            Map<String, Object> formElement = (Map<String, Object>) mapping.get(dataElementName);
            return formElement.get("dhis2DataElementId").toString();
        } catch (Exception err) {
            return "";
        }

    }
}
