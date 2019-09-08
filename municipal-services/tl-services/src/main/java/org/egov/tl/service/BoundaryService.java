package org.egov.tl.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.web.models.Boundary;
import org.egov.tl.web.models.TradeLicenseRequest;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.Map;

@Service
@Slf4j
public class BoundaryService {

    private ServiceRequestRepository serviceRequestRepository;

    private ObjectMapper mapper;

    private TLConfiguration config;

    @Autowired
    public BoundaryService(ServiceRequestRepository serviceRequestRepository, ObjectMapper mapper, TLConfiguration config) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.mapper = mapper;
        this.config = config;
    }

    /**
     *  Enriches the locality object by calling the location service
     * @param request TradeLicenseRequest for create
     * @param hierarchyTypeCode HierarchyTypeCode of the boundaries
     */
    public void getAreaType(TradeLicenseRequest request, String hierarchyTypeCode){
        if(CollectionUtils.isEmpty(request.getLicenses()))
            return;

        String tenantId = request.getLicenses().get(0).getTenantId();

        LinkedList<String> localities = new LinkedList<>();
        request.getLicenses().forEach(license -> {
            if(license.getTradeLicenseDetail().getAddress()==null ||
                    license.getTradeLicenseDetail().getAddress().getLocality()==null)
                throw new CustomException("INVALID ADDRESS","The address or locality cannot be null");
            localities.add(license.getTradeLicenseDetail().getAddress().getLocality().getCode());
        });

        StringBuilder uri = new StringBuilder(config.getLocationHost());
        uri.append(config.getLocationContextPath()).append(config.getLocationEndpoint());
        uri.append("?").append("tenantId=").append(tenantId);
        if(hierarchyTypeCode!=null)
            uri.append("&").append("hierarchyTypeCode=").append(hierarchyTypeCode);
        uri.append("&").append("boundaryType=").append("Locality");

        if(!CollectionUtils.isEmpty(localities)) {
            uri.append("&").append("codes=");
            for (int i = 0; i < localities.size(); i++) {
                uri.append(localities.get(i));
                if(i!=localities.size()-1)
                    uri.append(",");
            }
        }
        LinkedHashMap responseMap = (LinkedHashMap)serviceRequestRepository.fetchResult(uri, request.getRequestInfo());
        if(CollectionUtils.isEmpty(responseMap))
            throw new CustomException("BOUNDARY ERROR","The response from location service is empty or null");
        String jsonString = new JSONObject(responseMap).toString();

        Map<String,String> propertyIdToJsonPath = getJsonpath(request);

        DocumentContext context = JsonPath.parse(jsonString);

        request.getLicenses().forEach(license -> {
            Object boundaryObject = context.read(propertyIdToJsonPath.get(license.getId()));
            if(!(boundaryObject instanceof ArrayList) || CollectionUtils.isEmpty((ArrayList)boundaryObject))
                throw new CustomException("BOUNDARY MDMS DATA ERROR","The boundary data was not found");

            ArrayList boundaryResponse = context.read(propertyIdToJsonPath.get(license.getId()));
            Boundary boundary = mapper.convertValue(boundaryResponse.get(0),Boundary.class);
            if(boundary.getName()==null)
                throw new CustomException("INVALID BOUNDARY DATA","The boundary data for the code "+license.getTradeLicenseDetail().getAddress().getLocality().getCode()+ " is not available");
            license.getTradeLicenseDetail().getAddress().setLocality(boundary);

        });
    }


    /**
     *  Prepares map of tradeLicenseId to jsonpath which contains the code of the tradeLicense
     * @param request TradeLicenseRequest for create
     * @return Map of tradeLcienseId to jsonPath with tradeLcienses locality code
     */
    private Map<String,String> getJsonpath(TradeLicenseRequest request){
        Map<String,String> idToJsonPath = new LinkedHashMap<>();
        String jsonpath = "$..boundary[?(@.code==\"{}\")]";
        request.getLicenses().forEach(license -> {
            idToJsonPath.put(license.getId(),jsonpath.replace("{}",license.getTradeLicenseDetail().getAddress().getLocality().getCode()
            ));
        });

        return  idToJsonPath;
    }










}
