/**
 * 
 *//*
package org.egov.controller;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import org.egov.report.service.ReportService;
import org.egov.test.Resources;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

*//**
 * @author senthilkumar
 *
 *//*
@RunWith(SpringRunner.class)
@WebMvcTest(ReportController.class)
public class ReportControllerTest {
	
	@Autowired
    private MockMvc mockMvc;

	private Resources resources = new Resources();
	
	@MockBean
    private ReportService reportService;

	*//**
	 * Test method for {@link org.egov.controller.ReportController#ReportController(org.egov.domain.model.ReportDefinitions)}.
	 *//*
	@Test
	public void testReportController() {
		
	}

	*//**
	 * Test method for {@link org.egov.controller.ReportController#create(java.lang.String, org.egov.domain.model.MetaDataRequest, org.springframework.validation.BindingResult)}.
	 * @throws Exception 
	 *//*
	@Test
	public void testCreate() throws Exception {
		
		mockMvc.perform(post("/PGR/metadata/_get")
	            .param("tenantId", "tenantId")
	            .contentType(MediaType.APPLICATION_JSON_UTF8)
	            .content(resources.getFileContents("metadatarequest.json")))
	            .andExpect(status().isOk())
	            .andExpect(content().json(resources.getFileContents("metadataresponse.json")));
	}

	*//**
	 * Test method for {@link org.egov.controller.ReportController#getReportData(org.egov.swagger.model.ReportRequest, org.springframework.validation.BindingResult)}.
	 * @throws Exception 
	 *//*
	@Test
	public void testGetReportData() throws Exception {
		mockMvc.perform(post("/PGR/metadata/_get")
	            .contentType(MediaType.APPLICATION_JSON_UTF8)
	            .content(resources.getFileContents("metadatarequest.json")))
	            .andExpect(status().isOk())
	            .andExpect(content().json(resources.getFileContents("metadataresponse.json")));
	}

	*//**
	 * Test method for {@link org.egov.controller.ReportController#reloadYamlData(org.egov.domain.model.MetaDataRequest, org.springframework.validation.BindingResult)}.
	 * @throws Exception 
	 *//*
	@Test
	public void testReloadYamlData() throws Exception {
		System.out.println("Response is "+content().json(resources.getFileContents("reloadresponse.json")));
		
		mockMvc.perform(post("/PGR/_reload")
	            .contentType(MediaType.APPLICATION_JSON_UTF8)
	            .content(resources.getFileContents("reloadrequest.json")))
	            .andExpect(status().isOk())
	            .andExpect(content().json(resources.getFileContents("reloadresponse.json")));
		      
		//fail("Not yet implemented");
	}

}
*/