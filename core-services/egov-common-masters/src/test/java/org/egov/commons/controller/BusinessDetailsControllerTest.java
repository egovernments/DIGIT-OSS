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


import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessDetailsCommonModel;
import org.egov.commons.model.BusinessDetailsCriteria;

import org.egov.commons.service.BusinessCategoryService;
import org.egov.commons.service.BusinessDetailsService;
import org.egov.commons.web.contract.BusinessAccountDetails;
import org.egov.commons.web.contract.BusinessAccountSubLedger;
import org.egov.commons.web.contract.BusinessDetailsRequest;
import org.egov.commons.web.contract.BusinessDetails;
import org.egov.commons.web.contract.factory.ResponseInfoFact;
import org.egov.commons.web.controller.BusinessDetailsController;
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
@WebMvcTest(BusinessDetailsController.class)
@Import(TestConfiguration.class)
public class BusinessDetailsControllerTest {
	@MockBean
	private BusinessCategoryService businessCategoryService;
    @MockBean
	private BusinessDetailsService businessDetailsService;

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private RequestErrorHandler errHandler;

	@MockBean
	private ResponseInfoFact responseInfoFactory;

	@Test
    @Ignore
	public void test_should_create_business_details() throws Exception {
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
				.thenReturn(getResponseInfo());
		when(businessDetailsService.getBusinessDetailsByNameAndTenantId("Trade Licence", "default", 1L, false))
				.thenReturn(true);
		when(businessDetailsService.getBusinessDetailsByCodeAndTenantId("TL", "default", 1L, false)).thenReturn(true);
		when(businessCategoryService.getBusinessCategoryByIdAndTenantId(1L, "default"))
				.thenReturn(getBusinessCategoryModel());
		when(businessDetailsService.createDetailsAsync(getBusinessDetailsRequest()))
				.thenReturn(getBusinessDetailsRequest());

		mockMvc.perform(post("/businessDetails/_create").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("businessDetailsRequestCreate.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("businessDetailsResponseCreate.json")));

	}

	@Test
    @Ignore
	public void test_should_update_business_details() throws Exception {
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
				.thenReturn(getResponseInfo());
		when(businessDetailsService.getBusinessDetailsByNameAndTenantId("Trade Licence Mutation", "default", 1L, true))
				.thenReturn(true);
		when(businessDetailsService.getBusinessDetailsByCodeAndTenantId("TLM", "default", 1L, true)).thenReturn(true);
		when(businessCategoryService.getBusinessCategoryByIdAndTenantId(1L, "default"))
				.thenReturn(getBusinessCategoryModel());
		when(businessDetailsService.updateDetailsAsync(getBusinessDetailsRequestForUpdate()))
				.thenReturn(getBusinessDetailsRequestForUpdate());

		mockMvc.perform(post("/businessDetails/_update").contentType(MediaType.APPLICATION_JSON_UTF8)
				.content(getFileContents("businessDetailsRequestUpdate.json"))).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("businessDetailsResponseUpdate.json")));
	}

	@Test
    @Ignore
	public void test_should_search_business_details_based_on_criteria() throws Exception {
		when(responseInfoFactory.createResponseInfoFromRequestInfo(any(RequestInfo.class), eq(true)))
				.thenReturn(getResponseInfo());

		when(businessDetailsService.getForCriteria(getBusinessDetailsCriteria()))
				.thenReturn(getBusinessDetailCommonModel());
		mockMvc.perform(
				post("/businessDetails/_search?active=true&businessCategoryCode=TL&tenantId=default&ids=1,2&sortBy=code&sortOrder=desc")
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(getFileContents("businessDetailsRequest.json")))
				.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(getFileContents("businessDetailsResponse.json")));
	}

	private BusinessDetailsRequest getBusinessDetailsRequest() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
        List<BusinessDetails> detailsRequestInfo = getBusinessDetails();
        return BusinessDetailsRequest.builder().requestInfo(requestInfo).businessDetails(detailsRequestInfo).build();
	}

    private List<BusinessDetails> getBusinessDetails() {
        List<BusinessDetails> businessDetails = new ArrayList<BusinessDetails>();
        BusinessDetails businessDetail1 = BusinessDetails.builder().id(1L).code("TL")
                    .name("Trade Licence").active(true).businessCategory(1L).businessType("C")
                    .businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
                    .ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
                    .tenantId("default").callBackForApportioning(true).accountDetails(getListOfAccountDetails())
                    .build();
        BusinessDetails businessDetail2 = BusinessDetails.builder().id(1L).code("TL")
                .name("Trade Licence").active(true).businessCategory(1L).businessType("C")
                .businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
                .ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
                .tenantId("default").callBackForApportioning(true).accountDetails(getListOfAccountDetails())
                .build();
        return Arrays.asList(businessDetail1,businessDetail2);
    }

    private BusinessDetailsRequest getBusinessDetailsRequestForUpdate() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
		BusinessDetails detailsRequestInfo = BusinessDetails.builder().id(1L).code("TLM")
				.name("Trade Licence Mutation").active(true).businessCategory(1L).businessType("C")
				.callBackForApportioning(true).businessUrl("/receipts/receipt-create.action").voucherCreation(true)
				.isVoucherApproved(true).ordernumber(2).fund("12").function("123").fundSource("234").functionary("456")
				.department("56").tenantId("default").accountDetails(getListOfModelAccountDetailsForUpdate()).build();
		return BusinessDetailsRequest.builder().requestInfo(requestInfo).businessDetails(getBusinessDetails()).build();
	}

	private BusinessDetailsCommonModel getBusinessDetailCommonModel() {
		org.egov.commons.model.BusinessDetails details1 = org.egov.commons.model.BusinessDetails.builder().id(1L)
				.code("TL").name("Trade Licence").isEnabled(true).businessType("C")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").businessCategory(1L).build();
		org.egov.commons.model.BusinessDetails details2 = org.egov.commons.model.BusinessDetails.builder().id(2L)
				.code("PT").name("Property Tax").isEnabled(true).businessType("C")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").businessCategory(1L).build();
		org.egov.commons.model.BusinessDetails details = org.egov.commons.model.BusinessDetails.builder().id(1L)
				.build();
		org.egov.commons.model.BusinessDetails details12 = org.egov.commons.model.BusinessDetails.builder().id(2L)
				.build();
		List<org.egov.commons.model.BusinessDetails> listBusinessDetails = Arrays.asList(details1, details2);
		org.egov.commons.model.BusinessAccountDetails account1 = org.egov.commons.model.BusinessAccountDetails.builder()
				.id(1L).chartOfAccount(56L).amount(1000.0).tenantId("default").businessDetails(1L).build();
		org.egov.commons.model.BusinessAccountDetails account2 = org.egov.commons.model.BusinessAccountDetails.builder()
				.id(2L).chartOfAccount(57L).amount(2000.0).tenantId("default").businessDetails(1L).build();
		org.egov.commons.model.BusinessAccountDetails account3 = org.egov.commons.model.BusinessAccountDetails.builder()
				.id(3L).chartOfAccount(56L).amount(1000.0).tenantId("default").businessDetails(2L).build();
		org.egov.commons.model.BusinessAccountDetails account4 = org.egov.commons.model.BusinessAccountDetails.builder()
				.id(4L).chartOfAccount(57L).amount(2000.0).tenantId("default").businessDetails(2L).build();

		List<org.egov.commons.model.BusinessAccountDetails> listAccountDetails = Arrays.asList(account1, account2,
				account3, account4);

		org.egov.commons.model.BusinessAccountDetails businessAccountDetail = org.egov.commons.model.BusinessAccountDetails
				.builder().id(1L).build();
		org.egov.commons.model.BusinessAccountDetails businessAccountDetail2 = org.egov.commons.model.BusinessAccountDetails
				.builder().id(3L).build();
		BusinessAccountSubLedgerDetails subledger1 = BusinessAccountSubLedgerDetails.builder().id(1L)
				.accountDetailType(34L).accountDetailKey(23L).amount(10000.0).tenantId("default")
				.businessAccountDetail(businessAccountDetail).build();
		BusinessAccountSubLedgerDetails subledger2 = BusinessAccountSubLedgerDetails.builder().id(2L)
				.accountDetailType(35L).accountDetailKey(24L).amount(20000.0).tenantId("default")
				.businessAccountDetail(businessAccountDetail).build();
		BusinessAccountSubLedgerDetails subledger3 = BusinessAccountSubLedgerDetails.builder().id(3L)
				.accountDetailType(34L).accountDetailKey(23L).amount(10000.0).tenantId("default")
				.businessAccountDetail(businessAccountDetail2).build();
		BusinessAccountSubLedgerDetails subledger4 = BusinessAccountSubLedgerDetails.builder().id(4L)
				.accountDetailType(35L).accountDetailKey(24L).amount(20000.0).tenantId("default")
				.businessAccountDetail(businessAccountDetail2).build();
		List<BusinessAccountSubLedgerDetails> listSubledgerDetails = Arrays.asList(subledger1, subledger2, subledger3,
				subledger4);

		return BusinessDetailsCommonModel.builder().businessDetails(listBusinessDetails)
				.businessAccountDetails(listAccountDetails).businessAccountSubledgerDetails(listSubledgerDetails)
				.build();
	}

	private BusinessDetailsCriteria getBusinessDetailsCriteria() {

		return BusinessDetailsCriteria.builder().active(true).businessCategoryCode("TL").ids(Arrays.asList(1L, 2L))
				.tenantId("default").sortBy("code").sortOrder("desc").build();
	}

	private List<BusinessAccountSubLedger> getListOfModelAccountSubledgerForUpdate() {

	
		BusinessAccountSubLedger subledger1 = BusinessAccountSubLedger.builder().id(1L).detailType(34L).detailKey(23L)
				.amount(50000.00).businessAccountDetails(1L).build();
		BusinessAccountSubLedger subledger2 = BusinessAccountSubLedger.builder().id(3L).detailType(34L).detailKey(23L)
				.amount(30000.00).businessAccountDetails(5L).build();
		BusinessAccountSubLedger subledger3 = BusinessAccountSubLedger.builder().id(4L).detailType(34L).detailKey(23L)
				.amount(40000.00).businessAccountDetails(6L).build();
		BusinessAccountSubLedger subledger4 = BusinessAccountSubLedger.builder().id(5L).detailType(34L).detailKey(23L)
				.amount(50000.00).businessAccountDetails(1L).build();
		return Arrays.asList(subledger1, subledger2, subledger3, subledger4);
	}

	private List<BusinessAccountDetails> getListOfModelAccountDetailsForUpdate() {
		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).amount(5000.00).chartOfAccounts(56L)
				.businessDetails(1L).build();
		BusinessAccountDetails account2 = BusinessAccountDetails.builder().id(5L).amount(3000.00).chartOfAccounts(58L)
				.businessDetails(1L).build();
		BusinessAccountDetails account3 = BusinessAccountDetails.builder().id(6L).amount(4000.00).chartOfAccounts(59L)
				.businessDetails(1L).build();

		return Arrays.asList(account1, account2, account3);
	}

	private List<BusinessAccountSubLedger> getListOfAccountSubledger() {
		BusinessAccountSubLedger subledger1 = BusinessAccountSubLedger.builder().id(1L).detailType(34L).detailKey(23L)
				.amount(10000.00).businessAccountDetails(1L).build();
		BusinessAccountSubLedger subledger2 = BusinessAccountSubLedger.builder().id(2L).detailType(35L).detailKey(24L)
				.amount(20000.00).businessAccountDetails(1L).build();
		return Arrays.asList(subledger1, subledger2);
	}

	private List<BusinessAccountDetails> getListOfAccountDetails() {
		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).amount(1000.00).chartOfAccounts(56L)
				.businessDetails(1L).build();
		BusinessAccountDetails account2 = BusinessAccountDetails.builder().id(2L).amount(2000.00).chartOfAccounts(57L)
				.businessDetails(1L).build();
		return Arrays.asList(account1, account2);
	}



	private BusinessCategory getBusinessCategoryModel() {
		BusinessCategory category = BusinessCategory.builder().id(1L).code("TL").name("Trade Licence").isactive(true)
				.tenantId("default").build();
		return category;
	}

	private ResponseInfo getResponseInfo() {
		return ResponseInfo.builder().apiId("org.egov.collection").ver("1.0").resMsgId("uief87324").msgId("654654")
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
