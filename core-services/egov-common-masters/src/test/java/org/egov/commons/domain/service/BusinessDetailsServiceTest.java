package org.egov.commons.domain.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessDetailsCommonModel;
import org.egov.commons.model.BusinessDetailsCriteria;
import org.egov.commons.repository.BusinessDetailsRepository;
import org.egov.commons.service.BusinessDetailsService;
import org.egov.commons.web.contract.BusinessAccountSubLedger;
import org.egov.commons.web.contract.BusinessDetailsRequest;
import org.egov.commons.web.contract.BusinessDetails;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(MockitoJUnitRunner.class)
@WebMvcTest(BusinessDetailsService.class)
@WebAppConfiguration
public class BusinessDetailsServiceTest {
	@Mock
	BusinessDetailsRepository businessDetailsRepository;

	private BusinessDetailsService businessDetailsService;
	@Mock
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

	@Before
	public void before() {
		businessDetailsService = new BusinessDetailsService(businessDetailsRepository, kafkaTemplate);
	}

	@Test
	public void test_should_create_businessDetails() {
		businessDetailsService.createBusinessDetails(getModelDetails());
		verify(businessDetailsRepository).createBusinessDetails(getModelDetails());
	}

	@Test
	public void test_should_create_businessDetails_asynchronously() {
		businessDetailsService.createDetailsAsync(getBusinessDetailsRequest());
		verify(kafkaTemplate).send("egov-common-business-details-create", getBusinessDetailsRequest());
	}

	@Test
	public void test_should_update_businessDetails() {
		businessDetailsService.updateBusinessDetails(getModelDetails());
		verify(businessDetailsRepository).updateBusinessDetails(getModelDetails());
	}

	@Test
	public void test_should_update_businessDetails_asynchronously() {
		businessDetailsService.updateDetailsAsync(getBusinessDetailsRequestForUpdate());
		verify(kafkaTemplate).send("egov-common-business-details-update", getBusinessDetailsRequestForUpdate());
	}

	@Test
	public void test_should_search_businessDetails_based_on_criteria() {
		when(businessDetailsRepository.getForCriteria(getBusinessDetailsCriteria()))
				.thenReturn(getBusinessDetailCommonModel());
		BusinessDetailsCommonModel commonModel = businessDetailsService.getForCriteria(getBusinessDetailsCriteria());
		assertThat(getBusinessDetailCommonModel().getBusinessDetails().get(0).getCode())
				.isEqualTo(commonModel.getBusinessDetails().get(0).getCode());
		assertThat(getBusinessDetailCommonModel().getBusinessDetails().get(1).getCode())
				.isEqualTo(commonModel.getBusinessDetails().get(1).getCode());
		assertThat(getBusinessDetailCommonModel().getBusinessAccountDetails().get(0).getChartOfAccount())
				.isEqualTo(commonModel.getBusinessAccountDetails().get(0).getChartOfAccount());
	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_nameAndtenantId_isPresent_inDB_for_Create() {
		when(businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default", 1L, false))
				.thenReturn(true);
		Boolean value = businessDetailsService.getBusinessDetailsByNameAndTenantId("Trade Licence", "default", 1L,
				false);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_nameAndtenantId_isPresent_inDB_for_Create() {
		when(businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default", 1L, false))
				.thenReturn(false);
		Boolean value = businessDetailsService.getBusinessDetailsByNameAndTenantId("Trade Licence", "default", 1L,
				false);
		assertEquals(false, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_nameAndtenantId_isPresent_inDB_for_Update() {
		when(businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default", 1L, true))
				.thenReturn(true);
		Boolean value = businessDetailsService.getBusinessDetailsByNameAndTenantId("Trade Licence", "default", 1L,
				true);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_nameAndtenantId_isPresent_inDB_for_Update() {
		when(businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default", 1L, true))
				.thenReturn(false);
		Boolean value = businessDetailsService.getBusinessDetailsByNameAndTenantId("Trade Licence", "default", 1L,
				true);
		assertEquals(false, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_codeAndtenantId_isPresent_inDB_for_Create() {
		when(businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default", 1L, false))
				.thenReturn(true);
		Boolean value = businessDetailsService.getBusinessDetailsByCodeAndTenantId("TL", "default", 1L, false);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_codeAndtenantId_isPresent_inDB_for_Create() {
		when(businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default", 1L, false))
				.thenReturn(false);
		Boolean value = businessDetailsService.getBusinessDetailsByCodeAndTenantId("TL", "default", 1L, false);
		assertEquals(false, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_codeAndtenantId_isPresent_inDB_for_Update() {
		when(businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default", 1L, true)).thenReturn(true);
		Boolean value = businessDetailsService.getBusinessDetailsByCodeAndTenantId("TL", "default", 1L, true);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_codeAndtenantId_isPresent_inDB_for_Update() {
		when(businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default", 1L, true))
				.thenReturn(false);
		Boolean value = businessDetailsService.getBusinessDetailsByCodeAndTenantId("TL", "default", 1L, true);
		assertEquals(false, value);
	}

	private BusinessDetailsRequest getBusinessDetailsRequestForUpdate() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
		BusinessDetails detailsRequestInfo = BusinessDetails.builder().id(1L).code("TLM")
				.name("Trade Licence Mutation").active(true).businessCategory(1L).businessType("C")
				.callBackForApportioning(true).businessUrl("/receipts/receipt-create.action").voucherCreation(true)
				.isVoucherApproved(true).ordernumber(2).fund("12").function("123").fundSource("234").functionary("456")
				.department("56").tenantId("default").accountDetails(getListOfModelAccountDetailsContractForUpdate())
        .build();
		return BusinessDetailsRequest.builder().requestInfo(requestInfo).businessDetails(Arrays.asList(detailsRequestInfo)).build();
	}

	private List<BusinessAccountSubLedger> getListOfModelAccountSubledgerContractForUpdate() {
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

	private List<org.egov.commons.web.contract.BusinessAccountDetails> getListOfModelAccountDetailsContractForUpdate() {
		org.egov.commons.web.contract.BusinessAccountDetails account1 = org.egov.commons.web.contract.BusinessAccountDetails
				.builder().id(1L).amount(5000.00).chartOfAccounts(56L).businessDetails(1L).build();
		org.egov.commons.web.contract.BusinessAccountDetails account2 = org.egov.commons.web.contract.BusinessAccountDetails
				.builder().id(5L).amount(3000.00).chartOfAccounts(58L).businessDetails(1L).build();
		org.egov.commons.web.contract.BusinessAccountDetails account3 = org.egov.commons.web.contract.BusinessAccountDetails
				.builder().id(6L).amount(4000.00).chartOfAccounts(59L).businessDetails(1L).build();
		return Arrays.asList(account1, account2, account3);
	}

	private BusinessDetailsRequest getBusinessDetailsRequest() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
		BusinessDetails detailsRequestInfo = BusinessDetails.builder().id(1L).code("TL")
				.name("Trade Licence").active(true).businessCategory(1L).businessType("C")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").callBackForApportioning(true).accountDetails(getListOfAccountDetails())
				.build();
		return BusinessDetailsRequest.builder().requestInfo(requestInfo).businessDetails(Arrays.asList(detailsRequestInfo)).build();
	}

	private List<BusinessAccountSubLedger> getListOfAccountSubledger() {
		BusinessAccountSubLedger subledger1 = BusinessAccountSubLedger.builder().id(1L).detailType(34L).detailKey(23L)
				.amount(10000.00).businessAccountDetails(1L).build();
		BusinessAccountSubLedger subledger2 = BusinessAccountSubLedger.builder().id(2L).detailType(35L).detailKey(24L)
				.amount(20000.00).businessAccountDetails(1L).build();
		return Arrays.asList(subledger1, subledger2);
	}



	private List<org.egov.commons.web.contract.BusinessAccountDetails> getListOfAccountDetails() {
		org.egov.commons.web.contract.BusinessAccountDetails account1 = org.egov.commons.web.contract.BusinessAccountDetails
				.builder().id(1L).amount(1000.00).chartOfAccounts(56L).businessDetails(1L).build();
		org.egov.commons.web.contract.BusinessAccountDetails account2 = org.egov.commons.web.contract.BusinessAccountDetails
				.builder().id(2L).amount(2000.00).chartOfAccounts(57L).businessDetails(1L).build();
		return Arrays.asList(account1, account2);
	}


	private BusinessDetailsCommonModel getBusinessDetailCommonModel() {
		org.egov.commons.model.BusinessDetails details1 = org.egov.commons.model.BusinessDetails.builder().id(1L).code("TL").name("Trade Licence").isEnabled(true)
				.businessType("C").businessUrl("/receipts/receipt-create.action").voucherCreation(true)
				.isVoucherApproved(true).ordernumber(2).fund("12").function("123").fundSource("234").functionary("456")
				.department("56").tenantId("default").businessCategory(1L).build();
		org.egov.commons.model.BusinessDetails details2 = org.egov.commons.model.BusinessDetails.builder().id(2L).code("PT").name("Property Tax").isEnabled(true)
				.businessType("C").businessUrl("/receipts/receipt-create.action").voucherCreation(true)
				.isVoucherApproved(true).ordernumber(2).fund("12").function("123").fundSource("234").functionary("456")
				.department("56").tenantId("default").businessCategory(1L).build();

		List<org.egov.commons.model.BusinessDetails> listBusinessDetails = Arrays.asList(details1, details2);
		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).chartOfAccount(56L).amount(1000.0)
				.tenantId("default").businessDetails(1l).build();
		BusinessAccountDetails account2 = BusinessAccountDetails.builder().id(2L).chartOfAccount(57L).amount(2000.0)
				.tenantId("default").businessDetails(1L).build();
		BusinessAccountDetails account3 = BusinessAccountDetails.builder().id(3L).chartOfAccount(56L).amount(1000.0)
				.tenantId("default").businessDetails(1L).build();
		BusinessAccountDetails account4 = BusinessAccountDetails.builder().id(4L).chartOfAccount(57L).amount(2000.0)
				.tenantId("default").businessDetails(1L).build();

		List<BusinessAccountDetails> listAccountDetails = Arrays.asList(account1, account2, account3, account4);

		BusinessAccountDetails businessAccountDetail = BusinessAccountDetails.builder().id(1L).build();
		BusinessAccountDetails businessAccountDetail2 = BusinessAccountDetails.builder().id(3L).build();
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

	private List<BusinessAccountSubLedgerDetails> getListOfModelAccountSubledgerForUpdate() {
		BusinessAccountDetails accountDetail1 = BusinessAccountDetails.builder().id(1L).build();
		BusinessAccountDetails accountDetail2 = BusinessAccountDetails.builder().id(5L).build();
		BusinessAccountDetails accountDetail3 = BusinessAccountDetails.builder().id(6L).build();

		BusinessAccountSubLedgerDetails subledger1 = BusinessAccountSubLedgerDetails.builder().id(1L)
				.accountDetailType(34L).accountDetailKey(23L).amount(50000.00).tenantId("default")
				.businessAccountDetail(accountDetail1).build();
		BusinessAccountSubLedgerDetails subledger2 = BusinessAccountSubLedgerDetails.builder().id(3L)
				.accountDetailType(34L).accountDetailKey(23L).amount(30000.00).tenantId("default")
				.businessAccountDetail(accountDetail2).build();
		BusinessAccountSubLedgerDetails subledger3 = BusinessAccountSubLedgerDetails.builder().id(4L)
				.accountDetailType(34L).accountDetailKey(23L).amount(40000.00).tenantId("default")
				.businessAccountDetail(accountDetail3).build();
		BusinessAccountSubLedgerDetails subledger4 = BusinessAccountSubLedgerDetails.builder().id(5L)
				.accountDetailType(34L).accountDetailKey(23L).amount(50000.00).tenantId("default")
				.businessAccountDetail(accountDetail1).build();
		return Arrays.asList(subledger1, subledger2, subledger3, subledger4);
	}

	private List<BusinessAccountDetails> getListOfModelAccountDetailsForUpdate() {
		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).amount(5000.00).chartOfAccount(56L)
				.tenantId("default").businessDetails(1L).build();
		BusinessAccountDetails account2 = BusinessAccountDetails.builder().id(5L).amount(3000.00).chartOfAccount(58L)
				.tenantId("default").businessDetails(1L).build();
		BusinessAccountDetails account3 = BusinessAccountDetails.builder().id(6L).amount(4000.00).chartOfAccount(59L)
				.tenantId("default").businessDetails(1L).build();

		return Arrays.asList(account1, account2, account3);
	}

	private org.egov.commons.model.BusinessDetails getModelDetailsForUpdate() {
		return org.egov.commons.model.BusinessDetails.builder().id(1L).code("TLM").name("Trade Licence Mutation").isEnabled(true)
				.businessCategory(1L).businessType("C")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").build();
	}

	private List<org.egov.commons.model.BusinessDetails> getModelDetails() {
		org.egov.commons.model.BusinessDetails businessDetails1 = org.egov.commons.model.BusinessDetails.builder().id(1L).code("TL").name("Trade Licence").isEnabled(true)
				.businessCategory(1L).businessType("BILLBASED")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").build();

        org.egov.commons.model.BusinessDetails businessDetails2 = org.egov.commons.model.BusinessDetails.builder().id(1L).code("TL").name("Trade Licence").isEnabled(true)
                .businessCategory(2L).businessType("BILLBASED")
                .businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
                .ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
                .tenantId("default").build();
        return Arrays.asList(businessDetails1, businessDetails2);

	}

	private BusinessAccountDetails getAccountAssociatedWithSubledger() {
		return BusinessAccountDetails.builder().id(1L).amount(1000.00).chartOfAccount(56L).tenantId("default")
				.businessDetails(1L).build();

	}

	private BusinessCategory getBusinessCategoryModel() {
		BusinessCategory category = BusinessCategory.builder().id(1L).code("TL").name("Trade Licence").isactive(true)
				.tenantId("default").build();
		return category;
	}

	private List<BusinessAccountDetails> getListOfModelAccountDetails() {
		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).amount(1000.00).chartOfAccount(56L)
				.tenantId("default").businessDetails(1L).build();
		BusinessAccountDetails account2 = BusinessAccountDetails.builder().id(2L).amount(2000.00).chartOfAccount(57L)
				.tenantId("default").businessDetails(1L).build();
		return Arrays.asList(account1, account2);
	}

	private List<BusinessAccountSubLedgerDetails> getListOfModelAccountSubledger() {
		BusinessAccountSubLedgerDetails subledger1 = BusinessAccountSubLedgerDetails.builder().id(1L)
				.accountDetailType(34L).accountDetailKey(23L).amount(10000.00)
				.businessAccountDetail(getAccountAssociatedWithSubledger()).tenantId("default").build();
		BusinessAccountSubLedgerDetails subledger2 = BusinessAccountSubLedgerDetails.builder().id(2L)
				.accountDetailType(35L).accountDetailKey(24L).amount(20000.00)
				.businessAccountDetail(getAccountAssociatedWithSubledger()).tenantId("default").build();
		return Arrays.asList(subledger1, subledger2);
	}
}
