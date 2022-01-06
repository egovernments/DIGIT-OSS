package org.egov.commons.controller;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.commons.TestConfiguration;
import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessCategoryCriteria;
import org.egov.commons.service.BusinessCategoryService;
import org.egov.commons.web.contract.BusinessCategoryRequest;
import org.egov.commons.web.contract.factory.ResponseInfoFact;
import org.egov.commons.web.controller.BusinessCategoryController;
import org.egov.commons.web.errorhandlers.RequestErrorHandler;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@WebMvcTest(BusinessCategoryController.class)
@Import(TestConfiguration.class)
public class BusinessCategoryControllerTest {

	@MockBean
	private BusinessCategoryService serviceCategoryService;

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private RequestErrorHandler errHandler;

	@MockBean
	private ResponseInfoFact responseInfoFactory;

	private String string1="Trade Licence";

	private String string2="default";

	private String string3="org.egov.collection";

	private String string4="654654";

	@Test
    @Ignore
	public void test_should_create_business_category() throws Exception {
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(false)))
				.thenReturn(getResponseInfoInCaseOfFailure());
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
				.thenReturn(getResponseInfo());

		when(serviceCategoryService.getBusinessCategoryByNameAndTenantId(string1, string2, 1L, false))
				.thenReturn(true);
		when(serviceCategoryService.getBusinessCategoryByCodeAndTenantId("TL", string2, 1L, false)).thenReturn(true);
		when(serviceCategoryService.createAsync(getBusinessCategoryRequest())).thenReturn(getBusinessCategoryRequest());

		mockMvc.perform(post("/businessCategory/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("businessCategoryRequestCreate.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("businessCategoryResponseCreate.json")));

	}


	@Test
    @Ignore
	public void test_should_update_business_category() throws Exception {
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(false)))
				.thenReturn(getResponseInfoInCaseOfFailure());
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
				.thenReturn(getResponseInfo());
		when(serviceCategoryService.getBusinessCategoryByNameAndTenantId(string1, string2, 1L, true))
				.thenReturn(true);
		when(serviceCategoryService.getBusinessCategoryByCodeAndTenantId("TLM", string2, 1L, true)).thenReturn(true);
		when(serviceCategoryService.updateAsync(getBusinessCategoryRequestForUpdate()))
				.thenReturn(getBusinessCategoryRequestForUpdate());
		mockMvc.perform(post("/businessCategory/_update")
				.contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("businessCategoryRequestUpdate.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("businessCategoryResponseUpdate.json")));
	}


	private BusinessCategoryRequest getBusinessCategoryRequestForUpdate() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId(string3).ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId(string4).authToken("345678f").userInfo(userInfo).build();
        ;
        return BusinessCategoryRequest.builder().requestInfo(requestInfo).businessCategory(getBusinessCategory()).build();
	}

    private List<org.egov.commons.web.contract.BusinessCategory> getBusinessCategory() {
        List<org.egov.commons.web.contract.BusinessCategory> categories = new ArrayList<org.egov.commons.web.contract.BusinessCategory>();
        org.egov.commons.web.contract.BusinessCategory category1 = org.egov.commons.web.contract.BusinessCategory
                .builder().id(1L).code("TLM").name(string1).active(true).tenantId(string2).build();
        org.egov.commons.web.contract.BusinessCategory category2 = org.egov.commons.web.contract.BusinessCategory
                .builder().id(2L).code("PT").name("Property Tax").active(true).tenantId(string2).build();
        categories.add(category1);
        categories.add(category2);
        return  categories;
    }

    @Test
    @Ignore
	public void test_should_get_all_business_categories_with_the_params_criteria() throws Exception {
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
				.thenReturn(getResponseInfo());
		when(serviceCategoryService.getForCriteria(getBusinessCriteria()))
				.thenReturn(getListOfModelBusinessCategories());

		mockMvc.perform(
				post("/businessCategory/_search?active=true&tenantId=default&ids=1,2,3&sortBy=code&sortOrder=desc")
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(getFileContents("businessCategoryRequest.json")))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("businessCategoryResponse.json")));
	}

	private ResponseInfo getResponseInfoInCaseOfFailure() {
		return ResponseInfo.builder().apiId(string3).ver("1.0").resMsgId("uief87324").msgId(string4)
				.status("failed").build();
	}

	private BusinessCategoryRequest getBusinessCategoryRequest() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId(string3).ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId(string4).authToken("345678f").userInfo(userInfo).build();
		org.egov.commons.web.contract.BusinessCategory category = org.egov.commons.web.contract.BusinessCategory
				.builder().id(1L).code("TL").name(string1).active(true).tenantId(string2).build();
		return BusinessCategoryRequest.builder().requestInfo(requestInfo).businessCategory(getBusinessCategory()).build();
	}

	private List<BusinessCategory> getListOfModelBusinessCategories() {
		BusinessCategory category1 = BusinessCategory.builder().id(3L).code("TL").name(string1).isactive(true)
				.tenantId(string2).build();
		BusinessCategory category2 = BusinessCategory.builder().id(2L).code("MR").name("Marriage Registration")
				.isactive(true).tenantId(string2).build();
		BusinessCategory category3 = BusinessCategory.builder().id(1L).code("CL").name("Collection").isactive(true)
				.tenantId(string2).build();
		return Arrays.asList(category1, category2, category3);
	}

	private BusinessCategoryCriteria getBusinessCriteria() {
		return BusinessCategoryCriteria.builder().id(1L).active(true).sortBy("code")
				.sortOrder("desc").tenantId(string2).build();
	}

	private ResponseInfo getResponseInfo() {
		return ResponseInfo.builder().apiId(string3).ver("1.0").resMsgId("uief87324").msgId(string4)
				.status("successful").build();
	}

	private String getFileContents(String fileName) {
		try {
			return IOUtils.toString(this.getClass().getClassLoader().getResourceAsStream(fileName), "UTF-8");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

}