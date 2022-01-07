package org.egov.tenant.web.controller;

import static java.util.Arrays.asList;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.tenant.Resources;
import org.egov.tenant.domain.exception.DuplicateTenantCodeException;
import org.egov.tenant.domain.exception.InvalidTenantDetailsException;
import org.egov.tenant.domain.exception.TenantInvalidCodeException;
import org.egov.tenant.domain.model.City;
import org.egov.tenant.domain.model.Tenant;
import org.egov.tenant.domain.service.TenantService;
import org.egov.tenant.web.contract.factory.ResponseInfoFactory;
import org.egov.tracer.kafka.ErrorQueueProducer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest(TenantController.class)
public class TenantControllerTest {

    @MockBean
    TenantService tenantService;

    @MockBean
    ResponseInfoFactory responseInfoFactory;
    
    @Autowired
    MockMvc mockMvc;
    
    @MockBean
    ErrorQueueProducer errorQueueProducer;
    
    @Test
    public void test_should_create_tenant() throws Exception {
        City city = City.builder()
            .name("name")
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .longitude(35.456)
            .latitude(75.443)
            .ulbGrade("Corporation")
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .build();

        Tenant tenant = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .logoId("logoId")
            .imageId("imageId")
            .domainUrl("domainUrl")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(city)
            .build();
        ResponseInfo responseInfo = ResponseInfo.builder().apiId("emp").build();
        
        when(tenantService.createTenant(tenant)).thenReturn(tenant);
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class),any(Boolean.class))).thenReturn(responseInfo);

        mockMvc.perform(post("/v1/tenant/_create")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents("tenantCreateRequest.json")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("tenantCreateResponse.json")));
    }

    @Test
    public void test_should_return_400_when_invalid_tenant_exception() throws Exception {

        Tenant tenant = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .logoId("logoId")
            .imageId("imageId")
            .domainUrl("domainUrl")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(null)
            .build();

        when(tenantService.createTenant(any(Tenant.class))).thenThrow(new InvalidTenantDetailsException(tenant));

        mockMvc.perform(post("/v1/tenant/_create")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents("tenantCreateRequest.json")))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("tenantCreateErrorResponse.json")));
    }

    @Test
    public void test_should_return_400_when_duplicate_tenant_code_exception() throws Exception {

        Tenant tenant = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("description")
            .logoId("logoId")
            .imageId("imageId")
            .domainUrl("domainUrl")
            .type("CITY")
            .twitterUrl("twitterUrl")
            .facebookUrl("faceBookUrl")
            .emailId("email")
            .address("address")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(null)
            .build();

        when(tenantService.createTenant(any(Tenant.class))).thenThrow(new DuplicateTenantCodeException(tenant));

        mockMvc.perform(post("/v1/tenant/_create")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents("tenantCreateRequest.json")))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("duplicateTenantCodeErrorResponse.json")));
    }

    private List<Tenant> getListOfTenants() {
        City city = City.builder()
            .id(1L)
            .name("name")
            .localName("localname")
            .districtCode("districtcode")
            .districtName("districtname")
            .regionName("regionname")
            .ulbGrade("Municipality")
            .longitude(35.456)
            .latitude(75.443)
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .build();

        return asList(
            Tenant.builder()
                .id(1L)
                .code("AP.KURNOOL")
                .name("kurnool")
                .description("description")
                .logoId("logoId")
                .imageId("imageId")
                .domainUrl("domainUrl")
                .type("CITY")
                .twitterUrl("twitterUrl")
                .facebookUrl("faceBookUrl")
                .emailId("email")
                .address("address")
                .contactNumber("contactNumber")
                .helpLineNumber("helpLineNumber")
                .city(city)
                .build(),

            Tenant.builder()
                .id(2L)
                .code("AP.GUNTOOR")
                .name("guntoor")
                .description("description")
                .logoId("logoId")
                .imageId("imageId")
                .domainUrl("domainUrl")
                .type("CITY")
                .twitterUrl("twitterUrl")
                .facebookUrl("faceBookUrl")
                .emailId("email")
                .address("address")
                .contactNumber("contactNumber")
                .helpLineNumber("helpLineNumber")
                .city(city)
                .build()
        );
    }

    @Test
    public void test_should_update_tenant() throws Exception {
        City city = City.builder()
            .name("testname")
            .localName("testlocalname")
            .districtCode("districtcode")
            .districtName("testdistrictname")
            .regionName("testregionname")
            .longitude(35.456)
            .latitude(75.443)
            .ulbGrade("testCorporation")
            .shapeFileLocation("testshapeFileLocation")
            .captcha("testcaptcha")
            .build();

        Tenant tenant = Tenant.builder()
            .code("AP.KURNOOL")
            .name("kurnool")
            .description("testdescription")
            .logoId("testlogoId")
            .imageId("testimageId")
            .domainUrl("testdomainUrl")
            .type("CITY")
            .twitterUrl("testtwitterUrl")
            .facebookUrl("testfaceBookUrl")
            .emailId("testemail")
            .address("testaddress")
            .contactNumber("contactNumber")
            .helpLineNumber("helpLineNumber")
            .city(city)
            .build();

        when(tenantService.updateTenant(any(Tenant.class))).thenReturn(tenant);
        
        ResponseInfo responseInfo = ResponseInfo.builder().apiId("emp").build();
               
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class),any(Boolean.class))).thenReturn(responseInfo);

        mockMvc.perform(post("/v1/tenant/_update")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents("tenantUpdateRequest.json")))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("tenantUpdateResponse.json")));
    }
    
    @Test
    public void test_shouldReturn_tenantCode_error() throws Exception{
    	
    	City city = City.builder()
                .name("testname")
                .localName("testlocalname")
                .districtCode("districtcode")
                .districtName("testdistrictname")
                .regionName("testregionname")
                .longitude(35.456)
                .latitude(75.443)
                .ulbGrade("testCorporation")
                .shapeFileLocation("testshapeFileLocation")
	            .captcha("testcaptcha")
                
                .build();
    	 Tenant tenant = Tenant.builder()
    	            .description("testdescription")
    	            .logoId("testlogoId")
    	            .imageId("testimageId")
    	            .domainUrl("testdomainUrl")
    	            .type("CITY")
    	            .twitterUrl("testtwitterUrl")
    	            .facebookUrl("testfaceBookUrl")
    	            .emailId("testemail")
    	            .address("testaddress")
                    .contactNumber("contactNumber")
                    .helpLineNumber("helpLineNumber")
    	            .city(city)
    	            .build();
    	 
    	 when(tenantService.updateTenant(any(Tenant.class))).thenThrow(new InvalidTenantDetailsException(tenant));

         mockMvc.perform(post("/v1/tenant/_update")
             .contentType(MediaType.APPLICATION_JSON)
             .content(new Resources().getFileContents("tenantUpdateRequest.json")))
             .andExpect(status().isBadRequest())
             .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
             .andExpect(content().json(new Resources().getFileContents("tenantCodeErrorResponse.json")));
    	
    }
    
    @Test
    public void test_shouldReturn_tenantCode_invalid_error() throws Exception{
    	
    	City city = City.builder()
                .name("testname")
                .localName("testlocalname")
                .districtCode("districtcode")
                .districtName("testdistrictname")
                .regionName("testregionname")
                .longitude(35.456)
                .latitude(75.443)
                .ulbGrade("testCorporation")
                .shapeFileLocation("testshapeFileLocation")
	            .captcha("testcaptcha")
                .build();
    	 Tenant tenant = Tenant.builder()
    			    .code("aaaaaaaa") 
    	            .description("testdescription")
    	            .logoId("testlogoId")
    	            .imageId("testimageId")
    	            .domainUrl("testdomainUrl")
    	            .type("CITY")
    	            .twitterUrl("testtwitterUrl")
    	            .facebookUrl("testfaceBookUrl")
    	            .emailId("testemail")
    	            .address("testaddress")
                    .contactNumber("contactNumber")
                    .helpLineNumber("helpLineNumber")
    	            .city(city)
    	            .build();
    	 
    	 when(tenantService.updateTenant(any(Tenant.class))).thenThrow(new TenantInvalidCodeException(tenant));

         mockMvc.perform(post("/v1/tenant/_update")
             .contentType(MediaType.APPLICATION_JSON)
             .content(new Resources().getFileContents("tenantUpdateRequest.json")))
             .andExpect(status().isBadRequest())
             .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
             .andExpect(content().json(new Resources().getFileContents("tenantInvalidCodeErrorResponse.json")));
    	
    }
  
}