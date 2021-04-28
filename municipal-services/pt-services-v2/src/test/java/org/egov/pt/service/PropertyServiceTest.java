//package org.egov.pt.service;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.aspectj.util.FileUtil;
//import org.egov.pt.config.PropertyConfiguration;
//import org.egov.pt.producer.Producer;
//import org.egov.pt.repository.PropertyRepository;
//import org.egov.pt.util.FileUtils;
//import org.egov.pt.util.PropertyUtil;
//import org.egov.pt.service.EnrichmentService;
//import org.egov.pt.web.models.AuditDetails;
//import org.egov.pt.web.models.Property;
//import org.egov.pt.web.models.PropertyCriteria;
//import org.egov.pt.web.models.PropertyRequest;
//import org.junit.Before;
//import org.junit.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.mockito.MockitoAnnotations;
//
//import java.io.File;
//import java.io.IOException;
//import java.net.URL;
//import java.nio.file.Files;
//import java.util.ArrayList;
//import java.util.List;
//
//import static junit.framework.TestCase.assertTrue;
//import static org.assertj.core.api.Java6Assertions.assertThat;
//import static org.junit.Assert.assertFalse;
//import static org.junit.Assert.assertNotNull;
//import static org.junit.Assert.fail;
//import static org.mockito.Matchers.any;
//import static org.mockito.Matchers.anyBoolean;
//import static org.mockito.Matchers.anyString;
//import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.when;
//
//public class PropertyServiceTest {
//
//    @Mock
//    private Producer producerMock;
//
//    @Mock
//    private PropertyUtil propertyutilMock;
//
//    @Mock
//    private PropertyConfiguration configMock;
//
//    @Mock
//    private PropertyRepository repositoryMock;
//
//    @Mock
//    private EnrichmentService enrichmentServiceMock;
//
//    @InjectMocks
//    private PropertyService propertyServiceMock;
//
//    @Before
//    public void setUp() throws Exception {
//
//        MockitoAnnotations.initMocks(this);
//    }
//
//    public void testenrichCreateRequest(){
//
//        AuditDetails auditDetails = getAuditDetails();
//        PropertyRequest request = null;
//        try{
//         request = getPropertRequest("src/test/PropertyRequest.json");}
//        catch(Exception e){
//            e.printStackTrace();
//            fail();
//        }
//       when(propertyutilMock.getAuditDetails("12",true)).thenReturn(auditDetails);
//
//        List<Property> properties = propertyServiceMock.createProperty(request);
//
//        properties.forEach(property -> {
//            assertNotNull(property.getId());
//            assertNotNull(property.getPropertyDetail().getId());
//            assertNotNull(property.getAddress().getId());
//
//            property.getOwners().forEach(owner -> {
//                assertNotNull((owner.getId()));
//            });
//
//            property.getPropertyDetail().getDocuments().forEach(document -> {
//                assertNotNull((document.getId()));
//            });
//
//            property.getPropertyDetail().getUnits().forEach(unit -> {
//                assertNotNull(unit.getId());
//            });
//
//        });
//    }
//
//    public void testenrichUpdateRequest(){
//
//        AuditDetails auditDetails = getAuditDetails();
//        PropertyRequest request = null;
//        try{
//            request = getPropertRequest("src/test/PropertyRequestUpdate.json");}
//        catch(Exception e){
//            e.printStackTrace();
//            fail();
//        }
//        when(repositoryMock.getProperties(any(PropertyCriteria.class))).thenReturn(request.getProperties());
//        when(propertyutilMock.getAuditDetails("12",false)).thenReturn(auditDetails);
//        List<Property> properties = propertyServiceMock.updateProperty(request);
//
//        properties.forEach(property -> {
//            assertNotNull(property.getPropertyDetail().getId());
//            assertNotNull(property.getAddress().getId());
//
//            property.getOwners().forEach(owner -> {
//                assertNotNull((owner.getId()));
//            });
//
//            property.getPropertyDetail().getDocuments().forEach(document -> {
//                assertNotNull((document.getId()));
//            });
//
//            property.getPropertyDetail().getUnits().forEach(unit -> {
//                assertNotNull(unit.getId());
//            });
//
//        });
//    }
//
//
//
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
//
//
//    private PropertyRequest getPropertRequest(final String filepath) throws IOException {
//        final String propertRequestJson = new FileUtils().getFileContents(filepath);
//        return new ObjectMapper().readValue(propertRequestJson, PropertyRequest.class);
//    }
//
//
//    public void name() {
//        ClassLoader classLoader = getClass().getClassLoader();
//        String path = "src/test/PropertyRequest.json";
//        try{
//            URL url = classLoader.getResource(path);
//        String s= new String(Files.readAllBytes(new File(path).toPath()));}
//        catch(Exception e){
//            e.printStackTrace();
//            fail();
//        }
//
//
//    }
//}
