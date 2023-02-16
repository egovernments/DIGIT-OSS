package org.egov.wf.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.repository.ServiceRequestRepository;
import org.egov.wf.web.models.user.UserDetailResponse;
import org.egov.wf.web.models.user.UserSearchRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {UserService.class})
@ExtendWith(SpringExtension.class)
class UserServiceTest {
    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private UserService userService;

    @MockBean
    private WorkflowConfig workflowConfig;


    @Test
    void testSearchUser() {
        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenThrow(new CustomException("name", "An error occurred"));
        RequestInfo requestInfo = new RequestInfo();
        assertThrows(CustomException.class, () -> this.userService.searchUser(requestInfo, new ArrayList<>()));
        verify(this.workflowConfig).getUserHost();
        verify(this.workflowConfig).getUserSearchEndpoint();
        verify(this.serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
    }


    @Test
    void testSearchUserWithLocalHost() {
        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenThrow(new IllegalArgumentException("name"));
        RequestInfo requestInfo = new RequestInfo();
        assertThrows(CustomException.class, () -> this.userService.searchUser(requestInfo, new ArrayList<>()));
        verify(this.workflowConfig).getUserHost();
        verify(this.workflowConfig).getUserSearchEndpoint();
        verify(this.serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
    }


    @Test

    void testSearchUserWithNull() throws IllegalArgumentException {


        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn(null);
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenReturn(new LinkedHashMap<>());
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn("Convert Value");
        RequestInfo requestInfo = new RequestInfo();

    }

    @Test
    void TestSearchUser() throws IllegalArgumentException {
        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenReturn(new LinkedHashMap<>());
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(new UserDetailResponse());
        RequestInfo requestInfo = new RequestInfo();
        assertThrows(CustomException.class, () -> this.userService.searchUser(requestInfo, new ArrayList<>()));
        verify(this.workflowConfig).getUserHost();
        verify(this.workflowConfig).getUserSearchEndpoint();
        verify(this.serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }


    @Test

    void testSearchUserNull() throws IllegalArgumentException {


        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenReturn(new LinkedHashMap<>());
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(null);
        RequestInfo requestInfo = new RequestInfo();

    }


    @Test
    void testSearchUserUuidsBasedOnRoleCodes() {
        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenThrow(new CustomException("yyyy-MM-dd", "An error occurred"));

        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setAadhaarNumber("42");
        userSearchRequest.setActive(true);
        userSearchRequest.setEmailId("42");
        userSearchRequest.setFuzzyLogic(true);
        userSearchRequest.setId(new ArrayList<>());
        userSearchRequest.setMobileNumber("42");
        userSearchRequest.setName("Name");
        userSearchRequest.setPageNumber(10);
        userSearchRequest.setPageSize(3);
        userSearchRequest.setPan("Pan");
        userSearchRequest.setRequestInfo(new RequestInfo());
        userSearchRequest.setRoleCodes(new ArrayList<>());
        userSearchRequest.setSort(new ArrayList<>());
        userSearchRequest.setTenantId("42");
        userSearchRequest.setUserName("janedoe");
        userSearchRequest.setUserType("User Type");
        userSearchRequest.setUuid(new ArrayList<>());
        assertThrows(CustomException.class, () -> this.userService.searchUserUuidsBasedOnRoleCodes(userSearchRequest));
        verify(this.workflowConfig).getUserHost();
        verify(this.workflowConfig).getUserSearchEndpoint();
        verify(this.serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
    }

    @Test
    void testSearchUserUuidsBasedOnRoleCodesWithUserSearchRequest() {
        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenThrow(new IllegalArgumentException("yyyy-MM-dd"));

        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setAadhaarNumber("42");
        userSearchRequest.setActive(true);
        userSearchRequest.setEmailId("42");
        userSearchRequest.setFuzzyLogic(true);
        userSearchRequest.setId(new ArrayList<>());
        userSearchRequest.setMobileNumber("42");
        userSearchRequest.setName("Name");
        userSearchRequest.setPageNumber(10);
        userSearchRequest.setPageSize(3);
        userSearchRequest.setPan("Pan");
        userSearchRequest.setRequestInfo(new RequestInfo());
        userSearchRequest.setRoleCodes(new ArrayList<>());
        userSearchRequest.setSort(new ArrayList<>());
        userSearchRequest.setTenantId("42");
        userSearchRequest.setUserName("janedoe");
        userSearchRequest.setUserType("User Type");
        userSearchRequest.setUuid(new ArrayList<>());
        assertThrows(CustomException.class, () -> this.userService.searchUserUuidsBasedOnRoleCodes(userSearchRequest));
        verify(this.workflowConfig).getUserHost();
        verify(this.workflowConfig).getUserSearchEndpoint();
        verify(this.serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
    }


    @Test

    void testSearchUserUuidsBasedOnRoleCodesWithNull() throws IllegalArgumentException {


        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn(null);
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenReturn(new LinkedHashMap<>());
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn("Convert Value");

        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setAadhaarNumber("42");
        userSearchRequest.setActive(true);
        userSearchRequest.setEmailId("42");
        userSearchRequest.setFuzzyLogic(true);
        userSearchRequest.setId(new ArrayList<>());
        userSearchRequest.setMobileNumber("42");
        userSearchRequest.setName("Name");
        userSearchRequest.setPageNumber(10);
        userSearchRequest.setPageSize(3);
        userSearchRequest.setPan("Pan");
        userSearchRequest.setRequestInfo(new RequestInfo());
        userSearchRequest.setRoleCodes(new ArrayList<>());
        userSearchRequest.setSort(new ArrayList<>());
        userSearchRequest.setTenantId("42");
        userSearchRequest.setUserName("janedoe");
        userSearchRequest.setUserType("User Type");
        userSearchRequest.setUuid(new ArrayList<>());

    }


    @Test
    void TestSearchUserUuidsBasedOnRoleCodes() throws IllegalArgumentException {
        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenReturn(new LinkedHashMap<>());
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(new UserDetailResponse());

        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setAadhaarNumber("42");
        userSearchRequest.setActive(true);
        userSearchRequest.setEmailId("42");
        userSearchRequest.setFuzzyLogic(true);
        userSearchRequest.setId(new ArrayList<>());
        userSearchRequest.setMobileNumber("42");
        userSearchRequest.setName("Name");
        userSearchRequest.setPageNumber(10);
        userSearchRequest.setPageSize(3);
        userSearchRequest.setPan("Pan");
        userSearchRequest.setRequestInfo(new RequestInfo());
        userSearchRequest.setRoleCodes(new ArrayList<>());
        userSearchRequest.setSort(new ArrayList<>());
        userSearchRequest.setTenantId("42");
        userSearchRequest.setUserName("janedoe");
        userSearchRequest.setUserType("User Type");
        userSearchRequest.setUuid(new ArrayList<>());
        assertThrows(CustomException.class, () -> this.userService.searchUserUuidsBasedOnRoleCodes(userSearchRequest));
        verify(this.workflowConfig).getUserHost();
        verify(this.workflowConfig).getUserSearchEndpoint();
        verify(this.serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
    }

    @Test

    void testSearchUserUuidsBasedOnRoleCodesWithList() throws IllegalArgumentException {

        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenReturn(new LinkedHashMap<>());
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(null);

        UserSearchRequest userSearchRequest = new UserSearchRequest();
        userSearchRequest.setAadhaarNumber("42");
        userSearchRequest.setActive(true);
        userSearchRequest.setEmailId("42");
        userSearchRequest.setFuzzyLogic(true);
        userSearchRequest.setId(new ArrayList<>());
        userSearchRequest.setMobileNumber("42");
        userSearchRequest.setName("Name");
        userSearchRequest.setPageNumber(10);
        userSearchRequest.setPageSize(3);
        userSearchRequest.setPan("Pan");
        userSearchRequest.setRequestInfo(new RequestInfo());
        userSearchRequest.setRoleCodes(new ArrayList<>());
        userSearchRequest.setSort(new ArrayList<>());
        userSearchRequest.setTenantId("42");
        userSearchRequest.setUserName("janedoe");
        userSearchRequest.setUserType("User Type");
        userSearchRequest.setUuid(new ArrayList<>());

    }


    @Test
    void testSearchUserUuidsBasedOnRoleCodesWithUserDetailResponse() throws IllegalArgumentException {
        when(this.workflowConfig.getUserSearchEndpoint()).thenReturn("https://config.us-east-2.amazonaws.com");
        when(this.workflowConfig.getUserHost()).thenReturn("localhost");
        when(this.serviceRequestRepository.fetchResult((StringBuilder) any(), (Object) any()))
                .thenReturn(new LinkedHashMap<>());
        when(this.objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(new UserDetailResponse());
        UserSearchRequest userSearchRequest = mock(UserSearchRequest.class);
        when(userSearchRequest.getRoleCodes()).thenReturn(new ArrayList<>());
        doNothing().when(userSearchRequest).setAadhaarNumber((String) any());
        doNothing().when(userSearchRequest).setActive((Boolean) any());
        doNothing().when(userSearchRequest).setEmailId((String) any());
        doNothing().when(userSearchRequest).setFuzzyLogic(anyBoolean());
        doNothing().when(userSearchRequest).setId((List<String>) any());
        doNothing().when(userSearchRequest).setMobileNumber((String) any());
        doNothing().when(userSearchRequest).setName((String) any());
        doNothing().when(userSearchRequest).setPageNumber(anyInt());
        doNothing().when(userSearchRequest).setPageSize(anyInt());
        doNothing().when(userSearchRequest).setPan((String) any());
        doNothing().when(userSearchRequest).setRequestInfo((RequestInfo) any());
        doNothing().when(userSearchRequest).setRoleCodes((List<String>) any());
        doNothing().when(userSearchRequest).setSort((List<String>) any());
        doNothing().when(userSearchRequest).setTenantId((String) any());
        doNothing().when(userSearchRequest).setUserName((String) any());
        doNothing().when(userSearchRequest).setUserType((String) any());
        doNothing().when(userSearchRequest).setUuid((List<String>) any());
        userSearchRequest.setAadhaarNumber("42");
        userSearchRequest.setActive(true);
        userSearchRequest.setEmailId("42");
        userSearchRequest.setFuzzyLogic(true);
        userSearchRequest.setId(new ArrayList<>());
        userSearchRequest.setMobileNumber("42");
        userSearchRequest.setName("Name");
        userSearchRequest.setPageNumber(10);
        userSearchRequest.setPageSize(3);
        userSearchRequest.setPan("Pan");
        userSearchRequest.setRequestInfo(new RequestInfo());
        userSearchRequest.setRoleCodes(new ArrayList<>());
        userSearchRequest.setSort(new ArrayList<>());
        userSearchRequest.setTenantId("42");
        userSearchRequest.setUserName("janedoe");
        userSearchRequest.setUserType("User Type");
        userSearchRequest.setUuid(new ArrayList<>());
        assertThrows(CustomException.class, () -> this.userService.searchUserUuidsBasedOnRoleCodes(userSearchRequest));
        verify(this.workflowConfig).getUserHost();
        verify(this.workflowConfig).getUserSearchEndpoint();
        verify(this.serviceRequestRepository).fetchResult((StringBuilder) any(), (Object) any());
        verify(this.objectMapper).convertValue((Object) any(), (Class<Object>) any());
        verify(userSearchRequest).getRoleCodes();
        verify(userSearchRequest).setAadhaarNumber((String) any());
        verify(userSearchRequest).setActive((Boolean) any());
        verify(userSearchRequest).setEmailId((String) any());
        verify(userSearchRequest).setFuzzyLogic(anyBoolean());
        verify(userSearchRequest).setId((List<String>) any());
        verify(userSearchRequest).setMobileNumber((String) any());
        verify(userSearchRequest).setName((String) any());
        verify(userSearchRequest).setPageNumber(anyInt());
        verify(userSearchRequest).setPageSize(anyInt());
        verify(userSearchRequest).setPan((String) any());
        verify(userSearchRequest).setRequestInfo((RequestInfo) any());
        verify(userSearchRequest).setRoleCodes((List<String>) any());
        verify(userSearchRequest).setSort((List<String>) any());
        verify(userSearchRequest).setTenantId((String) any());
        verify(userSearchRequest).setUserName((String) any());
        verify(userSearchRequest).setUserType((String) any());
        verify(userSearchRequest).setUuid((List<String>) any());
    }
}

