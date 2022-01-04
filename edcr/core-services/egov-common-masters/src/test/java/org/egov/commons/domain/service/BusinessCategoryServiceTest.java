package org.egov.commons.domain.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessCategoryCriteria;
import org.egov.commons.repository.BusinessCategoryRepository;
import org.egov.commons.service.BusinessCategoryService;
import org.egov.commons.web.contract.BusinessCategoryRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(MockitoJUnitRunner.class)
@WebMvcTest(BusinessCategoryService.class)
@WebAppConfiguration
public class BusinessCategoryServiceTest {

	@Mock
	private BusinessCategoryRepository businessCategoryRepository;
	@Mock
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

	private BusinessCategoryService businessCategoryService;

	@Before
	public void before() {
		businessCategoryService = new BusinessCategoryService(kafkaTemplate, businessCategoryRepository);
	}

	@Test
	public void test_should_create_businessCategory() {
		businessCategoryService.create(getListOfModelBusinessCategories());
		verify(businessCategoryRepository).create(getListOfModelBusinessCategories());
	}

	@Test
	public void test_should_create_businessCategory_Asynchronously() {
		businessCategoryService.createAsync(getBusinessCategoryRequest());
		verify(kafkaTemplate).send("egov-common-business-category-create", getBusinessCategoryRequest());

	}

	@Test
	public void test_should_update_businessCategory() {
		businessCategoryService.update(getListOfModelBusinessCategories());
		verify(businessCategoryRepository).update(getListOfModelBusinessCategories());
	}

	@Test
	public void test_should_update_businessCategory_Asynchronously() {
		businessCategoryService.updateAsync(getBusinessCategoryRequestForUpdate());
		verify(kafkaTemplate).send("egov-common-business-category-update", getBusinessCategoryRequestForUpdate());

	}

	@Test
	public void test_should_return_all_serviceCategories_As_per_criteria() {
		when(businessCategoryRepository.getForCriteria(getBusinessCriteria()))
				.thenReturn(getListOfModelBusinessCategories());
		List<BusinessCategory> modelCategories = businessCategoryService.getForCriteria(getBusinessCriteria());
		assertThat(modelCategories.get(0).getCode()).isEqualTo(getListOfModelBusinessCategories().get(0).getCode());
		assertThat(modelCategories.get(1).getCode()).isEqualTo(getListOfModelBusinessCategories().get(1).getCode());
		assertThat(modelCategories.get(2).getCode()).isEqualTo(getListOfModelBusinessCategories().get(2).getCode());

	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_nameAndtenantId_isPresent_inDB_for_Create() {
		when(businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Trade Licence", "default", 1L, false))
				.thenReturn(true);
		Boolean value = businessCategoryService.getBusinessCategoryByNameAndTenantId("Trade Licence", "default", 1L,
				false);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_nameAndtenantId_isPresent_inDB_for_Create() {
		when(businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Trade Licence", "default", 1L, false))
				.thenReturn(false);
		Boolean value = businessCategoryService.getBusinessCategoryByNameAndTenantId("Trade Licence", "default", 1L,
				false);
		assertEquals(false, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_nameAndtenantId_isPresent_inDB_for_Update() {
		when(businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Trade Licence", "default", 1L, true))
				.thenReturn(true);
		Boolean value = businessCategoryService.getBusinessCategoryByNameAndTenantId("Trade Licence", "default", 1L,
				true);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_nameAndtenantId_isPresent_inDB_for_Update() {
		when(businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Trade Licence", "default", 1L, true))
				.thenReturn(false);
		Boolean value = businessCategoryService.getBusinessCategoryByNameAndTenantId("Trade Licence", "default", 1L,
				true);
		assertEquals(false, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_codeAndtenantId_isPresent_inDB_for_create() {
		when(businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("TL", "default", 1L, false))
				.thenReturn(true);
		Boolean value = businessCategoryService.getBusinessCategoryByCodeAndTenantId("TL", "default", 1L, false);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_codeAndtenantId_isPresent_inDB_for_create() {
		when(businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("TL", "default", 1L, false))
				.thenReturn(false);
		Boolean value = businessCategoryService.getBusinessCategoryByCodeAndTenantId("TL", "default", 1L, false);
		assertEquals(false, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isTrue_based_on_whether_codeAndtenantId_isPresent_inDB_for_update() {
		when(businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("TL", "default", 1L, true))
				.thenReturn(true);
		Boolean value = businessCategoryService.getBusinessCategoryByCodeAndTenantId("TL", "default", 1L, true);
		assertEquals(true, value);
	}

	@Test
	public void test_should_verify_boolean_value_returned_isFalse_based_on_whether_codeAndtenantId_isPresent_inDB_for_update() {
		when(businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("TL", "default", 1L, true))
				.thenReturn(false);
		Boolean value = businessCategoryService.getBusinessCategoryByCodeAndTenantId("TL", "default", 1L, true);
		assertEquals(false, value);
	}

	private BusinessCategoryRequest getBusinessCategoryRequestForUpdate() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
        return BusinessCategoryRequest.builder().requestInfo(requestInfo).businessCategory(getBusinessCategory()).build();
	}

    private List<org.egov.commons.web.contract.BusinessCategory> getBusinessCategory() {
        List<org.egov.commons.web.contract.BusinessCategory> categories = new ArrayList<org.egov.commons.web.contract.BusinessCategory>();
        org.egov.commons.web.contract.BusinessCategory businessCategory1 = org.egov.commons.web.contract.BusinessCategory
                    .builder().id(1L).code("TLM").name("Trade Licence").active(true).tenantId("default").build();
        org.egov.commons.web.contract.BusinessCategory businessCategory2 = org.egov.commons.web.contract.BusinessCategory
                .builder().id(2L).code("PT").name("Property Tax").active(true).tenantId("default").build();
        return Arrays.asList(businessCategory1,businessCategory2);
    }

    private BusinessCategory getBusinessCategoryModelForUpdate() {
		BusinessCategory category = BusinessCategory.builder().id(1L).code("TLM").name("Trade Licence").isactive(true)
				.tenantId("default").build();
		return category;
	}

	private BusinessCategoryRequest getBusinessCategoryRequest() {
		User userInfo = User.builder().id(1L).build();
		RequestInfo requestInfo = RequestInfo.builder().apiId("org.egov.collection").ver("1.0").action("POST")
				.did("4354648646").key("xyz").msgId("654654").authToken("345678f").userInfo(userInfo).build();
		return BusinessCategoryRequest.builder().requestInfo(requestInfo).businessCategory(getBusinessCategory()).build();
	}

	private List<BusinessCategory> getListOfModelBusinessCategories() {
		BusinessCategory category1 = BusinessCategory.builder().id(3L).code("TL").name("Trade Licence").isactive(true)
				.tenantId("default").build();
		BusinessCategory category2 = BusinessCategory.builder().id(2L).code("MR").name("Marriage Registration")
				.isactive(true).tenantId("default").build();
		BusinessCategory category3 = BusinessCategory.builder().id(1L).code("CL").name("Collection").isactive(true)
				.tenantId("default").build();
		return Arrays.asList(category1, category2, category3);
	}

	private BusinessCategoryCriteria getBusinessCriteria() {
		return BusinessCategoryCriteria.builder().id(1L).active(true).sortBy("code")
				.sortOrder("desc").tenantId("default").build();
	}

	private BusinessCategory getBusinessCategoryModel() {
		BusinessCategory category = BusinessCategory.builder().id(1L).code("TL").name("Trade Licence").isactive(true)
				.tenantId("default").build();
		return category;
	}

}
