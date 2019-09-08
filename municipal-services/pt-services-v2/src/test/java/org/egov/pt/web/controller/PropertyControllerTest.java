//package org.egov.pt.web.controller;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.egov.pt.TestConfiguration;
//import org.egov.pt.producer.Producer;
//import org.egov.pt.service.PropertyService;
//import org.egov.pt.util.FileUtils;
//import org.egov.pt.web.controllers.PropertyController;
//import org.egov.pt.web.models.AuditDetails;
//import org.egov.pt.web.models.Property;
//import org.egov.pt.web.models.PropertyRequest;
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Import;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.context.junit4.SpringRunner;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.io.IOException;
//import java.util.List;
//
//import static org.junit.Assert.fail;
//import static org.mockito.Matchers.any;
//import static org.mockito.Matchers.anyObject;
//import static org.mockito.Matchers.anyString;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@RunWith(SpringRunner.class)
//@WebMvcTest(PropertyController.class)
//@Import(TestConfiguration.class)
//public class PropertyControllerTest {
//
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private PropertyService propertyServiceMock;
//
//    @MockBean
//    private Producer producerMock;
//
//
//    @InjectMocks
//    private PropertyController propertyControllerMock;
///*
//    @Before
//    public void Setup() throws Exception{
//        MockitoAnnotations.initMocks(this);
//    }*/
//
//    @Test
//    public void createTest(){
//
//        PropertyRequest request = null;
//        try{
//            request = getPropertRequest("src/test/PropertyRequest.json");}
//        catch(Exception e){
//            e.printStackTrace();
//            fail();
//        }
//
//        when(propertyServiceMock.createProperty(any(PropertyRequest.class))).thenReturn(request.getProperties());
//        FileUtils fileUtils = new FileUtils();
//        try {
//            String requestString = fileUtils.getFileContents("src/test/PropertyRequest.json");
//            mockMvc.perform(post("/property/_create").param("tenantId", "default")
//                    .contentType(MediaType.APPLICATION_JSON)
//                    .content(fileUtils.getFileContents("src/test/PropertyRequest.json"))).andExpect(status().isCreated())
//                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
//                    .andExpect(content().json(fileUtils.getFileContents("src/test/PropertyResponse.json")));
//        }
//        catch(Exception e){
//            e.printStackTrace();
//            fail();
//        }
//
//    }
//
//    private AuditDetails getAuditDetails(){
//        AuditDetails auditDetails = new AuditDetails();
//        auditDetails.setCreatedBy("xyz");
//        auditDetails.setLastModifiedBy("xyz");
//        auditDetails.setCreatedTime((long)10000);
//        auditDetails.setLastModifiedTime((long)10000);
//
//        return auditDetails;
//    }
//
//    private PropertyRequest getPropertRequest(final String filepath) throws IOException {
//        final String propertRequestJson = new FileUtils().getFileContents(filepath);
//        return new ObjectMapper().readValue(propertRequestJson, PropertyRequest.class);
//    }
//
//
//
//
//}
