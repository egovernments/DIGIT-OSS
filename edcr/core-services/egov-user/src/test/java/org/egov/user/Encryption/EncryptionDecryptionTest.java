//package org.egov.user.Encryption;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.apache.commons.io.IOUtils;
//import org.egov.user.Resources;
//import org.egov.user.domain.model.Address;
//import org.egov.user.domain.model.Role;
//import org.egov.user.domain.model.User;
//import org.egov.user.domain.model.enums.*;
//import org.egov.user.domain.service.utils.EncryptionDecryptionUtil;
//import org.egov.user.web.contract.NonLoggedInUserUpdatePasswordRequest;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import javax.validation.constraints.Null;
//import java.io.IOException;
//import java.text.DateFormat;
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.*;
//
//import static org.junit.Assert.assertEquals;
//import static org.junit.Assert.assertNotNull;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//
//
//@RunWith(SpringRunner.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
//public class EncryptionDecryptionTest {
//
//    @Autowired
//    private EncryptionDecryptionUtil encryptionDecryptionUtil;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    private Resources resources=new Resources();
//
//    @Test
//    public void test_should_encrypt() throws JsonProcessingException {
//
//        User user=getUser();
//        String encUserfromSetvice=objectMapper.writeValueAsString(encryptionDecryptionUtil.encryptObject(user,"User",User.class));
//        String expectedUser=resources.getFileContents("encryptedUser.json");
//        assertEquals(expectedUser,encUserfromSetvice);
//    }
//
//    @Test
//    public void test_should_decrypt() throws IOException {
//
//        User user=objectMapper.readValue(resources.getFileContents("encryptedUser.json"),User.class);
//        String decUserfromSetvice=objectMapper.writeValueAsString(encryptionDecryptionUtil.decryptObject(user,"User",User.class,null));
//        String expectedUser=objectMapper.writeValueAsString(getUser());
//        assertEquals(expectedUser,decUserfromSetvice);
//    }
//
//    private User getUser() {
//
//        return User.builder()
//                .username("userName")
//                .salutation("salutation")
//                .name("name")
//                .gender(Gender.FEMALE)
//                .mobileNumber("mobileNumber1")
//                .emailId("email")
//                .altContactNumber("mobileNumber2")
//                .pan("pan")
//                .aadhaarNumber("aadhaarNumber")
//                .permanentAddress(getPermanentAddress())
//                .correspondenceAddress(getCorrespondenceAddress())
//                .active(true)
//                .locale("en_IN")
//                .type(UserType.CITIZEN)
//                .accountLocked(false)
//                .roles(getListOfRoles())
//                .guardian("nameofrelative")
//                .guardianRelation(GuardianRelation.Father)
//                .signature("7a9d7f12-bdcb-4487-9d43-709838a0ad39")
//                .bloodGroup(BloodGroup.A_POSITIVE)
//                .photo("3b26fb49-e43d-401b-899a-f8f0a1572de0")
//                .identificationMark("identificationmark")
//                .createdBy(1L)
//                .lastModifiedBy(2L)
//                .build();
//    }
//
//    private Address getPermanentAddress() {
//        return Address.builder()
//                .type(AddressType.PERMANENT)
//                .city("city/town/village1")
//                .address("postoffice")
//                .pinCode("pincode1")
//                .build();
//    }
//
//    private Address getCorrespondenceAddress() {
//        return Address.builder()
//                .type(AddressType.CORRESPONDENCE)
//                .city("city/town/village2")
//                .address("postoffice")
//                .pinCode("pincode2")
//                .build();
//    }
//
//
//    private Set<Role> getListOfRoles() {
//
//        Role role1 = Role.builder()
//                .name("nameoftherole1")
//                .description("description")
//                .createdBy(1L)
//                .lastModifiedBy(1L)
//                .build();
//
//        Role role2 = Role.builder()
//                .name("nameoftherole2")
//                .description("description")
//                .createdBy(1L)
//                .lastModifiedBy(1L)
//                .build();
//
//        return new HashSet<>(Arrays.asList(role1, role2));
//    }
//}
