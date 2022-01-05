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

    private static final String EXCEPTION_DISTRICT_CODE = "districtcode";
    private static final String EXCEPTION_CODE = "AP.KURNOOL";
    private static final String EXCEPTION_NAME = "kurnool";
    private static final String EXCEPTION_DESCRIPTION = "description";
    private static final String EXCEPTION_LOGO_ID = "logoId";
    private static final String EXCEPTION_IMAGE_ID = "imageId";
    private static final String EXCEPTION_DOMAIN_URL = "domainUrl";
    private static final String EXCEPTION_TWITTER_URL = "twitterUrl";
    private static final String EXCEPTION_FACEBOOK_URL = "faceBookUrl";
    private static final String EXCEPTION_EMAIL_ID = "email";
    private static final String EXCEPTION_ADDRESS = "address";
    private static final String EXCEPTION_CONTACT_NUMBER = "contactNumber";
    private static final String EXCEPTION_HELPLINE_NUMBER = "helpLineNumber";
    private static final String EXCEPTION_POST_CREATE = "/v1/tenant/_create";
    private static final String EXCEPTION_GET_FILE_CONTENTS_CREATE = "tenantCreateRequest.json";
    private static final String EXCEPTION_TEST_NAME = "testname";
    private static final String EXCEPTION_TEST_LOCAL_NAME = "testlocalname";
    private static final String EXCEPTION_TEST_DISTRICT_NAME = "testdistrictname";
    private static final String EXCEPTION_TEST_REGION_NAME = "testregionname";
    private static final String EXCEPTION_TEST_CORPORATION = "testCorporation";
    private static final String EXCEPTION_TEST_SHAPE_FILE_LOCATION = "testshapeFileLocation";
    private static final String EXCEPTION_TEST_CAPTCHA = "testcaptcha";
    private static final String EXCEPTION_TEST_DESCRIPTION = "testdescription";
    private static final String EXCEPTION_TEST_LOGO_ID = "testlogoId";
    private static final String EXCEPTION_TEST_IMAGE_ID = "testimageId";
    private static final String EXCEPTION_TEST_DOMAIN_URL = "testdomainUrl";
    private static final String EXCEPTION_TEST_TWITTER_URL = "testtwitterUrl";
    private static final String EXCEPTION_TEST_FACEBOOK_URL = "testfaceBookUrl";
    private static final String EXCEPTION_TEST_EMAIL = "testemail";
    private static final String EXCEPTION_TEST_ADDRESS = "testaddress";
    private static final String EXCEPTION_POST_UPDATE = "/v1/tenant/_update";
    private static final String EXCEPTION_GET_FILE_CONTENTS_UPDATE = "tenantUpdateRequest.json";

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
            .districtCode(EXCEPTION_DISTRICT_CODE)
            .districtName("districtname")
            .regionName("regionname")
            .longitude(35.456)
            .latitude(75.443)
            .ulbGrade("Corporation")
            .shapeFileLocation("shapeFileLocation")
            .captcha("captcha")
            .build();

        Tenant tenant = Tenant.builder()
            .code(EXCEPTION_CODE)
            .name(EXCEPTION_NAME)
            .description(EXCEPTION_DESCRIPTION)
            .logoId(EXCEPTION_LOGO_ID)
            .imageId(EXCEPTION_IMAGE_ID)
            .domainUrl(EXCEPTION_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(EXCEPTION_TWITTER_URL)
            .facebookUrl(EXCEPTION_FACEBOOK_URL)
            .emailId(EXCEPTION_EMAIL_ID)
            .address(EXCEPTION_ADDRESS)
            .contactNumber(EXCEPTION_CONTACT_NUMBER)
            .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
            .city(city)
            .build();
        ResponseInfo responseInfo = ResponseInfo.builder().apiId("emp").build();
        
        when(tenantService.createTenant(tenant)).thenReturn(tenant);
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class),any(Boolean.class))).thenReturn(responseInfo);

        mockMvc.perform(post(EXCEPTION_POST_CREATE)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents(EXCEPTION_GET_FILE_CONTENTS_CREATE)))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("tenantCreateResponse.json")));
    }

    @Test
    public void test_should_return_400_when_invalid_tenant_exception() throws Exception {

        Tenant tenant = Tenant.builder()
            .code(EXCEPTION_CODE)
            .name(EXCEPTION_NAME)
            .description(EXCEPTION_DESCRIPTION)
            .logoId(EXCEPTION_LOGO_ID)
            .imageId(EXCEPTION_IMAGE_ID)
            .domainUrl(EXCEPTION_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(EXCEPTION_TWITTER_URL)
            .facebookUrl(EXCEPTION_FACEBOOK_URL)
            .emailId(EXCEPTION_EMAIL_ID)
            .address(EXCEPTION_ADDRESS)
            .contactNumber(EXCEPTION_CONTACT_NUMBER)
            .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
            .city(null)
            .build();

        when(tenantService.createTenant(any(Tenant.class))).thenThrow(new InvalidTenantDetailsException(tenant));

        mockMvc.perform(post(EXCEPTION_POST_CREATE)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents(EXCEPTION_GET_FILE_CONTENTS_CREATE)))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("tenantCreateErrorResponse.json")));
    }

    @Test
    public void test_should_return_400_when_duplicate_tenant_code_exception() throws Exception {

        Tenant tenant = Tenant.builder()
            .code(EXCEPTION_CODE)
            .name(EXCEPTION_NAME)
            .description(EXCEPTION_DESCRIPTION)
            .logoId(EXCEPTION_LOGO_ID)
            .imageId(EXCEPTION_IMAGE_ID)
            .domainUrl(EXCEPTION_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(EXCEPTION_TWITTER_URL)
            .facebookUrl(EXCEPTION_FACEBOOK_URL)
            .emailId(EXCEPTION_EMAIL_ID)
            .address(EXCEPTION_ADDRESS)
            .contactNumber(EXCEPTION_CONTACT_NUMBER)
            .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
            .city(null)
            .build();

        when(tenantService.createTenant(any(Tenant.class))).thenThrow(new DuplicateTenantCodeException(tenant));

        mockMvc.perform(post(EXCEPTION_POST_CREATE)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents(EXCEPTION_GET_FILE_CONTENTS_CREATE)))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("duplicateTenantCodeErrorResponse.json")));
    }

    private List<Tenant> getListOfTenants() {
        City city = City.builder()
            .id(1L)
            .name("name")
            .localName("localname")
            .districtCode(EXCEPTION_DISTRICT_CODE)
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
                .code(EXCEPTION_CODE)
                .name(EXCEPTION_NAME)
                .description(EXCEPTION_DESCRIPTION)
                .logoId(EXCEPTION_LOGO_ID)
                .imageId(EXCEPTION_IMAGE_ID)
                .domainUrl(EXCEPTION_DOMAIN_URL)
                .type("CITY")
                .twitterUrl(EXCEPTION_TWITTER_URL)
                .facebookUrl(EXCEPTION_FACEBOOK_URL)
                .emailId(EXCEPTION_EMAIL_ID)
                .address(EXCEPTION_ADDRESS)
                .contactNumber(EXCEPTION_CONTACT_NUMBER)
                .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
                .city(city)
                .build(),

            Tenant.builder()
                .id(2L)
                .code("AP.GUNTOOR")
                .name("guntoor")
                .description(EXCEPTION_DESCRIPTION)
                .logoId(EXCEPTION_LOGO_ID)
                .imageId(EXCEPTION_IMAGE_ID)
                .domainUrl(EXCEPTION_DOMAIN_URL)
                .type("CITY")
                .twitterUrl(EXCEPTION_TWITTER_URL)
                .facebookUrl(EXCEPTION_FACEBOOK_URL)
                .emailId(EXCEPTION_EMAIL_ID)
                .address(EXCEPTION_ADDRESS)
                .contactNumber(EXCEPTION_CONTACT_NUMBER)
                .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
                .city(city)
                .build()
        );
    }

    @Test
    public void test_should_update_tenant() throws Exception {
        City city = City.builder()
            .name(EXCEPTION_TEST_NAME)
            .localName(EXCEPTION_TEST_LOCAL_NAME)
            .districtCode(EXCEPTION_DISTRICT_CODE)
            .districtName(EXCEPTION_TEST_DISTRICT_NAME)
            .regionName(EXCEPTION_TEST_REGION_NAME)
            .longitude(35.456)
            .latitude(75.443)
            .ulbGrade(EXCEPTION_TEST_CORPORATION)
            .shapeFileLocation(EXCEPTION_TEST_SHAPE_FILE_LOCATION)
            .captcha(EXCEPTION_TEST_CAPTCHA)
            .build();

        Tenant tenant = Tenant.builder()
            .code(EXCEPTION_CODE)
            .name(EXCEPTION_NAME)
            .description(EXCEPTION_TEST_DESCRIPTION)
            .logoId(EXCEPTION_TEST_LOGO_ID)
            .imageId(EXCEPTION_TEST_IMAGE_ID)
            .domainUrl(EXCEPTION_TEST_DOMAIN_URL)
            .type("CITY")
            .twitterUrl(EXCEPTION_TEST_TWITTER_URL)
            .facebookUrl(EXCEPTION_TEST_FACEBOOK_URL)
            .emailId(EXCEPTION_TEST_EMAIL)
            .address(EXCEPTION_TEST_ADDRESS)
            .contactNumber(EXCEPTION_CONTACT_NUMBER)
            .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
            .city(city)
            .build();

        when(tenantService.updateTenant(any(Tenant.class))).thenReturn(tenant);
        
        ResponseInfo responseInfo = ResponseInfo.builder().apiId("emp").build();
               
        when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class),any(Boolean.class))).thenReturn(responseInfo);

        mockMvc.perform(post(EXCEPTION_POST_UPDATE)
            .contentType(MediaType.APPLICATION_JSON)
            .content(new Resources().getFileContents(EXCEPTION_GET_FILE_CONTENTS_UPDATE)))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json(new Resources().getFileContents("tenantUpdateResponse.json")));
    }
    
    @Test
    public void test_shouldReturn_tenantCode_error() throws Exception{
    	
    	City city = City.builder()
                .name(EXCEPTION_TEST_NAME)
                .localName(EXCEPTION_TEST_LOCAL_NAME)
                .districtCode(EXCEPTION_DISTRICT_CODE)
                .districtName(EXCEPTION_TEST_DISTRICT_NAME)
                .regionName(EXCEPTION_TEST_REGION_NAME)
                .longitude(35.456)
                .latitude(75.443)
                .ulbGrade(EXCEPTION_TEST_CORPORATION)
                .shapeFileLocation(EXCEPTION_TEST_SHAPE_FILE_LOCATION)
	            .captcha(EXCEPTION_TEST_CAPTCHA)
                
                .build();
    	 Tenant tenant = Tenant.builder()
    	            .description(EXCEPTION_TEST_DESCRIPTION)
    	            .logoId(EXCEPTION_TEST_LOGO_ID)
    	            .imageId(EXCEPTION_TEST_IMAGE_ID)
    	            .domainUrl(EXCEPTION_TEST_DOMAIN_URL)
    	            .type("CITY")
    	            .twitterUrl(EXCEPTION_TEST_TWITTER_URL)
    	            .facebookUrl(EXCEPTION_TEST_FACEBOOK_URL)
    	            .emailId(EXCEPTION_TEST_EMAIL)
    	            .address(EXCEPTION_TEST_ADDRESS)
                    .contactNumber(EXCEPTION_CONTACT_NUMBER)
                    .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
    	            .city(city)
    	            .build();
    	 
    	 when(tenantService.updateTenant(any(Tenant.class))).thenThrow(new InvalidTenantDetailsException(tenant));

         mockMvc.perform(post(EXCEPTION_POST_UPDATE)
             .contentType(MediaType.APPLICATION_JSON)
             .content(new Resources().getFileContents(EXCEPTION_GET_FILE_CONTENTS_UPDATE)))
             .andExpect(status().isBadRequest())
             .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
             .andExpect(content().json(new Resources().getFileContents("tenantCodeErrorResponse.json")));
    	
    }
    
    @Test
    public void test_shouldReturn_tenantCode_invalid_error() throws Exception{
    	
    	City city = City.builder()
                .name(EXCEPTION_TEST_NAME)
                .localName(EXCEPTION_TEST_LOCAL_NAME)
                .districtCode(EXCEPTION_DISTRICT_CODE)
                .districtName(EXCEPTION_TEST_DISTRICT_NAME)
                .regionName(EXCEPTION_TEST_REGION_NAME)
                .longitude(35.456)
                .latitude(75.443)
                .ulbGrade(EXCEPTION_TEST_CORPORATION)
                .shapeFileLocation(EXCEPTION_TEST_SHAPE_FILE_LOCATION)
	            .captcha(EXCEPTION_TEST_CAPTCHA)
                .build();
    	 Tenant tenant = Tenant.builder()
    			    .code("aaaaaaaa") 
    	            .description(EXCEPTION_TEST_DESCRIPTION)
    	            .logoId(EXCEPTION_TEST_LOGO_ID)
    	            .imageId(EXCEPTION_TEST_IMAGE_ID)
    	            .domainUrl(EXCEPTION_TEST_DOMAIN_URL)
    	            .type("CITY")
    	            .twitterUrl(EXCEPTION_TEST_TWITTER_URL)
    	            .facebookUrl(EXCEPTION_TEST_FACEBOOK_URL)
    	            .emailId(EXCEPTION_TEST_EMAIL)
    	            .address(EXCEPTION_TEST_ADDRESS)
                    .contactNumber(EXCEPTION_CONTACT_NUMBER)
                    .helpLineNumber(EXCEPTION_HELPLINE_NUMBER)
    	            .city(city)
    	            .build();
    	 
    	 when(tenantService.updateTenant(any(Tenant.class))).thenThrow(new TenantInvalidCodeException(tenant));

         mockMvc.perform(post(EXCEPTION_POST_UPDATE)
             .contentType(MediaType.APPLICATION_JSON)
             .content(new Resources().getFileContents(EXCEPTION_GET_FILE_CONTENTS_UPDATE)))
             .andExpect(status().isBadRequest())
             .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
             .andExpect(content().json(new Resources().getFileContents("tenantInvalidCodeErrorResponse.json")));
    	
    }
  
}