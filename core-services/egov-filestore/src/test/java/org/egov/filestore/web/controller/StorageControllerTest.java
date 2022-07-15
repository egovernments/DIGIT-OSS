package org.egov.filestore.web.controller;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.Resource;
import org.egov.filestore.domain.service.StorageService;
import org.egov.filestore.utils.StorageUtil;
import org.egov.filestore.web.contract.GetFilesByTagResponse;
import org.egov.filestore.web.contract.ResponseFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ContextConfiguration(classes = {StorageController.class})
@ExtendWith(SpringExtension.class)
class StorageControllerTest {
    @MockBean
    private ResponseFactory responseFactory;

    @Autowired
    private StorageController storageController;

    @MockBean
    private StorageService storageService;

    @MockBean
    private StorageUtil storageUtil;

    @Test
    void testGetFile() throws Exception {
        when(storageService.retrieve((String) any(), (String) any())).thenReturn(
                new Resource("text/plain", "foo.txt", new ByteArrayResource("AAAAAAAA".getBytes("UTF-8")), "42", "File Size"));
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/v1/files/id")
                .param("fileStoreId", "foo")
                .param("tenantId", "foo");
        MockMvcBuilders.standaloneSetup(storageController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain"))
                .andExpect(MockMvcResultMatchers.content().string("AAAAAAAA"));
    }

    @Test
    void testGetFileContentTypeJson() throws Exception {
        when(storageService.retrieve((String) any(), (String) any())).thenReturn(
                new Resource("", "foo.txt", new ByteArrayResource("AAAAAAAA".getBytes("UTF-8")), "42", "File Size"));
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/v1/files/id")
                .param("fileStoreId", "foo")
                .param("tenantId", "foo");
        MockMvcBuilders.standaloneSetup(storageController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content().string("AAAAAAAA"));
    }

    @Test
    void testGetMetaData() throws Exception {
        when(storageService.retrieve((String) any(), (String) any())).thenReturn(
                new Resource("text/plain", "foo.txt", new ByteArrayResource("AAAAAAAA".getBytes("UTF-8")), "42", "File Size"));
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/v1/files/metadata")
                .param("fileStoreId", "foo")
                .param("tenantId", "foo");
        MockMvcBuilders.standaloneSetup(storageController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.content()
                        .string(
                                "{\"contentType\":\"text/plain\",\"fileName\":\"foo.txt\",\"resource\":null,\"tenantId\":\"42\",\"fileSize\":\"File"
                                        + " Size\"}"));
    }

    @Test
    void testGetUrlListByTag() throws Exception {
        when(storageService.retrieveByTag((String) any(), (String) any())).thenReturn(new ArrayList<>());
        when(responseFactory.getFilesByTagResponse((List<FileInfo>) any()))
                .thenReturn(new GetFilesByTagResponse(new ArrayList<>()));
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/v1/files/tag")
                .param("tag", "foo")
                .param("tenantId", "foo");
        MockMvcBuilders.standaloneSetup(storageController)
                .build()
                .perform(requestBuilder)
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andExpect(MockMvcResultMatchers.content().string("{\"files\":[]}"));
    }

    @Test
    void testGetUrls() throws Exception {
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/v1/files/url").param("tenantId", "foo");
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(storageController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(400));
    }

    @Test
    void testStoreFiles() throws Exception {
        MockHttpServletRequestBuilder requestBuilder = MockMvcRequestBuilders.get("/v1/files")
                .param("module", "foo")
                .param("tenantId", "foo");
        ResultActions actualPerformResult = MockMvcBuilders.standaloneSetup(storageController)
                .build()
                .perform(requestBuilder);
        actualPerformResult.andExpect(MockMvcResultMatchers.status().is(405));
    }
}

