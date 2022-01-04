package org.egov.commons.persistence.repository;


import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.egov.commons.model.BusinessAccountDetails;
import org.egov.commons.model.BusinessAccountSubLedgerDetails;
import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessDetails;
import org.egov.commons.model.BusinessDetailsCommonModel;
import org.egov.commons.model.BusinessDetailsCriteria;
import org.egov.commons.repository.BusinessDetailsRepository;
import org.egov.commons.repository.builder.BusinessDetailsQueryBuilder;
import org.egov.commons.repository.rowmapper.BusinessAccountDetailsRowMapper;
import org.egov.commons.repository.rowmapper.BusinessAccountSubledgerDetailsRowMapper;
import org.egov.commons.repository.rowmapper.BusinessDetailsCombinedRowMapper;
import org.egov.commons.repository.rowmapper.BusinessDetailsRowMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

@RunWith(MockitoJUnitRunner.class)
public class BusinessDetailsRepositoryTest {
	@Mock
	JdbcTemplate jdbcTemplate;

	@Mock
	BusinessAccountDetailsRowMapper businessAccountDetailsRowMapper;

	@Mock
	BusinessDetailsCombinedRowMapper businessDetailsCombinedRowMapper;

	@Mock
	NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Mock
	BusinessDetailsRowMapper businessDetailsRowMapper;

	@Mock
	BusinessAccountSubledgerDetailsRowMapper businessAccountSubledgerDetailsRowMapper;

	@Mock
	BusinessDetailsQueryBuilder businessDetailsQueryBuilder;

	@InjectMocks
	BusinessDetailsRepository businessDetailsRepository;

	@Test
	public void test_should_create_businessDetail() {
		when(jdbcTemplate.update(any(String.class), any(Object[].class))).thenReturn(1);
		int[] intArray = { 1, 2 };
		when(jdbcTemplate.batchUpdate(any(String.class), any(List.class))).thenReturn(intArray);
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessAccountDetailsRowMapper.class)))
				.thenReturn(getListOfModelAccountDetails());
		when(jdbcTemplate.batchUpdate(any(String.class), any(List.class))).thenReturn(intArray);
		}

	@Test
	public void test_should_update_businessDetail() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessAccountDetailsRowMapper.class)))
				.thenReturn(getListOfModelAccountDetails());
		when(namedParameterJdbcTemplate.query(any(String.class), any(SqlParameterSource.class),
				any(BusinessAccountSubledgerDetailsRowMapper.class))).thenReturn(getListOfModelAccountSubledger());
		when(jdbcTemplate.update(any(String.class), any(Object[].class))).thenReturn(1);
      }

	@Test
	public void test_should_search_businessDetail() {
		BusinessDetailsCommonModel commonModel = getBusinessDetailsCommonModelForSearch();
		when(businessDetailsQueryBuilder.getQuery(any(BusinessDetailsCriteria.class), any(List.class))).thenReturn("");
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsCombinedRowMapper.class)))
				.thenReturn(Collections.singletonList(getModelDetailsForSearch()));
		assertTrue(commonModel.equals(businessDetailsRepository.getForCriteria(getBusinessDetailsCriteria())));

	}

	@Test
	public void test_should_return_false_if_details_exists_with_name_and_tenantid_for_Create() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(Arrays.asList(getModelDetails()));
		Boolean value = businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default",1L,false);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_details_doesnot_exists_with_name_and_tenantid_for_Create() {
		List<BusinessDetails> businessDetails = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(businessDetails);
		Boolean value = businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default",1L,false);
		assertTrue(value.equals(true));
	}
	
	
	@Test
	public void test_should_return_false_if_details_exists_with_name_and_tenantid_for_Update() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(Arrays.asList(getModelDetails()));
		Boolean value = businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default",1L,true);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_details_doesnot_exists_with_name_and_tenantid_for_Update() {
		List<BusinessDetails> businessDetails = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(businessDetails);
		Boolean value = businessDetailsRepository.checkDetailsByNameAndTenantIdExists("Trade Licence", "default",1L,true);
		assertTrue(value.equals(true));
	}

	@Test
	public void test_should_return_false_if_details_exists_with_code_and_tenantid_for_Create() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(Arrays.asList(getModelDetails()));
		Boolean value = businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default",1L,false);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_details_doesnot_exists_with_code_and_tenantid_for_Create() {
		List<BusinessDetails> businessDetails = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(businessDetails);
		Boolean value = businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default",1L,false);
		assertTrue(value.equals(true));
	}
	
	@Test
	public void test_should_return_false_if_details_exists_with_code_and_tenantid_for_Update() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(Arrays.asList(getModelDetails()));
		Boolean value = businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default",1L,true);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_details_doesnot_exists_with_code_and_tenantid_for_Update() {
		List<BusinessDetails> businessDetails = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessDetailsRowMapper.class)))
				.thenReturn(businessDetails);
		Boolean value = businessDetailsRepository.checkDetailsByCodeAndTenantIdExists("TL", "default",1L,true);
		assertTrue(value.equals(true));
	}

	private BusinessDetailsCommonModel getBusinessDetailsCommonModelForSearch() {
		BusinessDetails businessDetails = BusinessDetails.builder().id(1L).code("TL").name("Trade Licence")
				.isEnabled(true).businessCategory(1L).businessType("C")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").build();
		List<BusinessDetails> listOfBusinessDetails = new ArrayList<>();
		listOfBusinessDetails = Arrays.asList(businessDetails);
		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).amount(1000.00).chartOfAccount(56L)
				.tenantId("default").businessDetails(1L).build();

		BusinessAccountDetails businessAccountDetail = BusinessAccountDetails.builder().id(1L).build();
		BusinessAccountSubLedgerDetails subledger1 = BusinessAccountSubLedgerDetails.builder().id(1L)
				.accountDetailType(34L).accountDetailKey(23L).amount(10000.00)
				.businessAccountDetail(businessAccountDetail).tenantId("default").build();
		return BusinessDetailsCommonModel.builder().businessDetails(listOfBusinessDetails)
				.businessAccountDetails(Arrays.asList(account1))
				.businessAccountSubledgerDetails(Arrays.asList(subledger1)).build();
	}

	private BusinessDetails getModelDetailsForSearch() {
		return BusinessDetails.builder().id(1L).code("TL").name("Trade Licence").isEnabled(true)
				.businessCategory(1l).businessType("C").businessUrl("/receipts/receipt-create.action")
				.voucherCreation(true).isVoucherApproved(true).ordernumber(2).fund("12").function("123")
				.fundSource("234").functionary("456").department("56")
				.accountDetails(getListOfModelAccountDetailsForSearch()).tenantId("default").build();
	}

	private List<BusinessAccountDetails> getListOfModelAccountDetailsForSearch() {
		BusinessAccountDetails businessAccountDetail = BusinessAccountDetails.builder().id(1L).build();

		BusinessAccountSubLedgerDetails subledger1 = BusinessAccountSubLedgerDetails.builder().id(1L)
				.accountDetailType(34L).accountDetailKey(23L).amount(10000.00)
				.businessAccountDetail(businessAccountDetail).tenantId("default").build();
		BusinessAccountSubLedgerDetails subledger2 = BusinessAccountSubLedgerDetails.builder().id(2L)
				.accountDetailType(35L).accountDetailKey(24L).amount(20000.00)
				.businessAccountDetail(businessAccountDetail).tenantId("default").build();

		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).amount(1000.00).chartOfAccount(56L)
				.tenantId("default").businessDetails(1L)
				.subledgerDetails(Arrays.asList(subledger1, subledger2)).build();
		BusinessAccountDetails account2 = BusinessAccountDetails.builder().id(2L).amount(2000.00).chartOfAccount(57L)
				.tenantId("default").businessDetails(1L).build();
		return Arrays.asList(account1, account2);
	}

	private BusinessDetailsCriteria getBusinessDetailsCriteria() {

		return BusinessDetailsCriteria.builder().active(true).businessCategoryCode("TL").ids(Arrays.asList(1L))
				.tenantId("default").sortBy("code").sortOrder("desc").build();
	}

	private BusinessDetailsCommonModel getBusinessDetailsCommonModel() {
		return BusinessDetailsCommonModel.builder().businessDetails(Collections.singletonList(getModelDetails()))
				.businessAccountDetails(getListOfModelAccountDetails())
				.businessAccountSubledgerDetails(getListOfModelAccountSubledger()).build();
	}

	private BusinessAccountDetails getAccountAssociatedWithSubledger() {
		return BusinessAccountDetails.builder().id(1L).amount(1000.00).chartOfAccount(56L).tenantId("default")
				.businessDetails(1L).build();

	}

	private BusinessDetails getModelDetails() {
		return BusinessDetails.builder().id(1L).code("TL").name("Trade Licence").isEnabled(true)
				.businessCategory(1L).businessType("C")
				.businessUrl("/receipts/receipt-create.action").voucherCreation(true).isVoucherApproved(true)
				.ordernumber(2).fund("12").function("123").fundSource("234").functionary("456").department("56")
				.tenantId("default").callBackForApportioning(true).createdBy(1L).lastModifiedBy(1L).build();

	}

	/*private BusinessCategory getBusinessCategoryModel() {
		BusinessCategory category = BusinessCategory.builder().id(1L).code("TL").name("Trade Licence").isactive(true)
				.tenantId("default").build();
		return category;
	}*/

	private List<BusinessAccountSubLedgerDetails> getListOfModelAccountSubledger() {
		BusinessAccountSubLedgerDetails subledger1 = BusinessAccountSubLedgerDetails.builder().id(1L)
				.accountDetailType(34L).accountDetailKey(23L).amount(10000.00)
				.businessAccountDetail(getAccountAssociatedWithSubledger()).tenantId("default").build();
		BusinessAccountSubLedgerDetails subledger2 = BusinessAccountSubLedgerDetails.builder().id(2L)
				.accountDetailType(35L).accountDetailKey(24L).amount(20000.00)
				.businessAccountDetail(getAccountAssociatedWithSubledger()).tenantId("default").build();
		return Arrays.asList(subledger1, subledger2);
	}



	private List<BusinessAccountDetails> getListOfModelAccountDetails() {
		BusinessAccountDetails account1 = BusinessAccountDetails.builder().id(1L).amount(1000.00).chartOfAccount(56L)
				.tenantId("default").businessDetails(1L).build();
		BusinessAccountDetails account2 = BusinessAccountDetails.builder().id(2L).amount(2000.00).chartOfAccount(57L)
				.tenantId("default").businessDetails(1L).build();
		return Arrays.asList(account1, account2);
	}

}
