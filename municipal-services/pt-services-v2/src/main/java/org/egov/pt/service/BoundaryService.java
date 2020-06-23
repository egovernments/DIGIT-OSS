package org.egov.pt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.models.Boundary;
import org.egov.pt.web.models.PropertyRequest;
import org.egov.pt.web.models.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Service
@Slf4j
public class BoundaryService {


    @Value("${egov.location.host}")
    private String locationHost;

    @Value("${egov.location.context.path}")
    private String locationContextPath;

    @Value("${egov.location.endpoint}")
    private String locationEndpoint;


    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ObjectMapper mapper;

    /**
     *  Enriches the locality object by calling the location service
     * @param request PropertyRequest for create
     * @param hierarchyTypeCode HierarchyTypeCode of the boundaries
     */
    public void getAreaType(PropertyRequest request,String hierarchyTypeCode){
        if(CollectionUtils.isEmpty(request.getProperties()))
            return;

        String tenantId = request.getProperties().get(0).getTenantId();

        LinkedList<String> localities = new LinkedList<>();
        request.getProperties().forEach(property -> {
            if(property.getAddress()==null || property.getAddress().getLocality()==null)
                throw new CustomException("INVALID ADDRESS","The address or locality cannot be null");
            localities.add(property.getAddress().getLocality().getCode());
        });

        StringBuilder uri = new StringBuilder(locationHost);
        uri.append(locationContextPath).append(locationEndpoint);
        uri.append("?").append("tenantId=").append(tenantId);
        if(hierarchyTypeCode!=null)
            uri.append("&").append("hierarchyTypeCode=").append(hierarchyTypeCode);
        uri.append("&").append("boundaryType=").append("Block");

        if(!CollectionUtils.isEmpty(localities)) {
            uri.append("&").append("codes=");
            for (int i = 0; i < localities.size(); i++) {
                uri.append(localities.get(i));
                if(i!=localities.size()-1)
                    uri.append(",");
            }
        }
        RequestInfoWrapper requestInfoWrapper = RequestInfoWrapper.builder().requestInfo(request.getRequestInfo()).build();
        LinkedHashMap responseMap = (LinkedHashMap)serviceRequestRepository.fetchResult(uri, requestInfoWrapper);
        if(CollectionUtils.isEmpty(responseMap))
            throw new CustomException("BOUNDARY ERROR","The response from location service is empty or null");
        String jsonString = new JSONObject(responseMap).toString();
        DocumentContext context = JsonPath.parse(jsonString);

        request.getProperties().forEach(property -> {

            String localityJsonPath = "$..boundary[0].children.[?(@.code==\"{}\")]";
            String wardJsonPath = "$..boundary[*][?(\"{}\" in @.children.*.code)]";

            Object localityObject = context.read(localityJsonPath.replace("{}",
                    property.getAddress().getLocality().getCode()));

            if(!(localityObject instanceof ArrayList) || CollectionUtils.isEmpty((ArrayList)localityObject))
                return;

            ArrayList wardResponse = context.read(wardJsonPath.replace("{}",property.getAddress().getLocality().getCode()));
            ArrayList localityResponse = (ArrayList) localityObject;

            Boundary ward = mapper.convertValue(wardResponse.get(0),Boundary.class);
            // Only require ward information
            ward.setChildren(null);
            Boundary locality = mapper.convertValue(localityResponse.get(0),Boundary.class);

            if(locality.getArea()==null || locality.getName()==null)
                throw new CustomException("INVALID BOUNDARY DATA","The boundary data for the code "+property.getAddress().getLocality().getCode()+ " is not available");
            property.getAddress().setWard(ward);
            property.getAddress().setLocality(locality);

        });

        //$..boundary[?(@.code=="JLC476")].area

    }


    /**
     *  Prepares map of propertyId to jsonpath which contains the code of the property
     * @param request PropertyRequest for create
     * @return Map of propertyId to jsonPath with properties locality code
     */
    private Map<String,String> getJsonpath(PropertyRequest request){
        Map<String,String> propertyIdToJsonPath = new LinkedHashMap<>();
        String jsonpath = "$..boundary[0].children.[?(@.code==\"{}\")]";
        request.getProperties().forEach(property -> {
            propertyIdToJsonPath.put(property.getPropertyId(),jsonpath.replace("{}",property.getAddress().getLocality().getCode()
            ));
        });

        return  propertyIdToJsonPath;
    }










}
