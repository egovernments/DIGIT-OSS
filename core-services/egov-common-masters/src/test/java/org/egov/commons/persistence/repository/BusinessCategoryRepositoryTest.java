package org.egov.commons.persistence.repository;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessCategoryCriteria;
import org.egov.commons.repository.BusinessCategoryRepository;
import org.egov.commons.repository.builder.BusinessCategoryQueryBuilder;
import org.egov.commons.repository.rowmapper.BusinessCategoryRowMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.jdbc.core.JdbcTemplate;

@RunWith(MockitoJUnitRunner.class)
public class BusinessCategoryRepositoryTest {

	@Mock
	private JdbcTemplate jdbcTemplate;

	@Mock
	private BusinessCategoryRowMapper businessCategoryRowMapper;

	@Mock
	private BusinessCategoryQueryBuilder businessCategoryQueryBuilder;

	@InjectMocks
	private BusinessCategoryRepository businessCategoryRepository;

	@Test
	public void test_should_save_serviceCategory_inDB() {
	
		when(jdbcTemplate.update(any(String.class), any(Object[].class))).thenReturn(1);
		
	}

	@Test
	public void test_should_update_serviceCategory_inDB() {

		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(getListOfModelServiceCategories());
		when(jdbcTemplate.update(any(String.class), any(Object[].class))).thenReturn(1);
		
	}

	private BusinessCategory getBusinessCategoryModelForUpdate() {
		BusinessCategory category = BusinessCategory.builder().id(1L).code("CLS").name("Collections").isactive(true)
				.tenantId("default").createdBy(1L).lastModifiedBy(1L).build();
		return category;
	}

	@Test
	public void test_should_get_All_ServiceCategories_As_per_Criteria() {
		when(businessCategoryQueryBuilder.getQuery(any(BusinessCategoryCriteria.class), any(List.class)))
				.thenReturn("");
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(getListOfModelBusinessCategories());
		List<BusinessCategory> listOfCategories = businessCategoryRepository
				.getForCriteria(new BusinessCategoryCriteria());
		assertTrue(listOfCategories.equals(getListOfModelBusinessCategories()));
	}

	@Test
	public void test_should_return_false_if_category_exists_with_name_and_tenantid_for_create() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(getListOfModelServiceCategories());
		Boolean value = businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Collection", "default", 1L,
				false);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_category_doesnot_exists_with_name_and_tenantid_for_Create() {
		List<BusinessCategory> categories = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(categories);
		Boolean value = businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Collection", "default", 1L,
				false);
		assertTrue(value.equals(true));
	}

	@Test
	public void test_should_return_false_if_category_exists_with_name_and_tenantid_for_update() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(getListOfModelServiceCategories());
		Boolean value = businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Collection", "default", 1L,
				true);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_category_doesnot_exists_with_name_and_tenantid_for_update() {
		List<BusinessCategory> categories = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(categories);
		Boolean value = businessCategoryRepository.checkCategoryByNameAndTenantIdExists("Collection", "default", 1L,
				true);
		assertTrue(value.equals(true));
	}

	@Test
	public void test_should_return_false_if_category_exists_with_code_and_tenantid_for_create() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(getListOfModelServiceCategories());
		Boolean value = businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("CL", "default", 1L, false);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_category_exists_with_code_and_tenantid_for_create() {
		List<BusinessCategory> categories = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(categories);
		Boolean value = businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("CL", "default", 1L, false);
		assertTrue(value.equals(true));
	}

	@Test
	public void test_should_return_false_if_category_exists_with_code_and_tenantid_for_update() {
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(getListOfModelServiceCategories());
		Boolean value = businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("CL", "default", 1L, true);
		assertTrue(value.equals(false));
	}

	@Test
	public void test_should_return_true_if_category_exists_with_code_and_tenantid_for_update() {
		List<BusinessCategory> categories = new ArrayList<>();
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(BusinessCategoryRowMapper.class)))
				.thenReturn(categories);
		Boolean value = businessCategoryRepository.checkCategoryByCodeAndTenantIdExists("CL", "default", 1L, true);
		assertTrue(value.equals(true));
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

	private List<BusinessCategory> getListOfModelServiceCategories() {
		return Arrays.asList(
				BusinessCategory.builder().id(5L).code("CLL").name("Collection Label").tenantId("default").build());
	}

	private BusinessCategory getBusinessCategoryModel() {
		BusinessCategory category = BusinessCategory.builder().id(1L).code("CL").name("Collection").isactive(true)
				.tenantId("default").createdBy(1L).lastModifiedBy(1L).build();
		return category;
	}

}
