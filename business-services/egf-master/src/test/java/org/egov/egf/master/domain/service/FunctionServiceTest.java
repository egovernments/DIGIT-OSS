package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.common.util.ApplicationThreadLocals;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.Function;
import org.egov.egf.master.domain.model.FunctionSearch;
import org.egov.egf.master.domain.repository.FunctionRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.SmartValidator;


@Import(TestConfiguration.class)
@RunWith(SpringRunner.class)
public class FunctionServiceTest {

	@InjectMocks
	private FunctionService functionService;

	@Mock
	private SmartValidator validator;

	@Mock
	private FunctionRepository functionRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);
	private RequestInfo requestInfo = new RequestInfo();
	private List<Function> functions = new ArrayList<>();

	@Before
	public void setup() {
	}

	@Test
	public final void testCreate() {
		when(functionRepository.findById(any(Function.class))).thenReturn(getParentFunction());
		when(functionRepository.uniqueCheck(any(String.class), any(Function.class))).thenReturn(true);
		functionService.create(getFunctions(), errors, requestInfo);
	}

	@Test
	public final void testUpdate() {
		when(functionRepository.findById(any(Function.class))).thenReturn(getParentFunction());
		when(functionRepository.uniqueCheck(any(String.class), any(Function.class))).thenReturn(true);
		functionService.update(getFunctions(), errors, requestInfo);
	}

	@Test
	public final void testCreateInvalid() {
		Function function1 = Function.builder().id("a").code("code").active(true).parentId(null).level(1).build();
		functions.add(function1);
		when(functionRepository.uniqueCheck(any(String.class), any(Function.class))).thenReturn(true);
		functionService.create(functions, errors, requestInfo);
	}

	@Test
	public final void test_save() {
		Function expextedResult = getFunctions().get(0);
		when(functionRepository.save(any(Function.class))).thenReturn(expextedResult);
		Function actualResult = functionService.save(getFunctions().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void testSearch() {
		List<Function> search = new ArrayList<>();
		search.add(getFunctionSearch());
		Pagination<Function> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(functionRepository.search(any(FunctionSearch.class))).thenReturn(expectedResult);
		Pagination<Function> actualResult = functionService.search(getFunctionSearch(), errors);
		assertEquals(expectedResult, actualResult);

	}

	@Test
	public final void test_update() {
		Function expextedResult = getFunctions().get(0);
		when(functionRepository.update(any(Function.class))).thenReturn(expextedResult);
		Function actualResult = functionService.update(getFunctions().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void test_fetch_related_data() {
		List<Function> expextedResult = new ArrayList<>();
		expextedResult.add(getParentFunction());
		List<Function> functions = new ArrayList<>();
		functions.add(getFunction());
		when(functionRepository.findById(any(Function.class))).thenReturn(getParentFunction());
		List<Function> actualResult = functionService.fetchRelated(functions);
		assertEquals(expextedResult.get(0).getId(), actualResult.get(0).getParentId().getId());
		assertEquals(expextedResult.get(0).getName(), actualResult.get(0).getParentId().getName());
	}

	@Test(expected = InvalidDataException.class)
	public final void test_fetch_related_data_when_parentid_is_wrong() {
		List<Function> expextedResult = new ArrayList<>();
		expextedResult.add(getParentFunction());
		List<Function> functions = new ArrayList<>();
		functions.add(getFunction());
		ApplicationThreadLocals.setTenantId("default");
		when(functionRepository.findById(any(Function.class))).thenReturn(null);
		functionService.fetchRelated(functions);
	}

	private List<Function> getFunctions() {
		List<Function> functions = new ArrayList<Function>();
		Function function = Function.builder().id("1").name("name").code("code").level(1).parentId(getParentFunction()).active(true).build();
		function.setTenantId("default");
		functions.add(function);
		return functions;
	}

	private FunctionSearch getFunctionSearch() {
		FunctionSearch functionSearch = new FunctionSearch();
		functionSearch.setPageSize(0);
		functionSearch.setOffset(0);
		functionSearch.setSortBy("Sort");
		functionSearch.setTenantId("default");
		return functionSearch;
	}

	private Function getFunction() {
		Function function = Function.builder().id("1").name("function").code("001").active(true)
				.parentId(getParentFunction()).level(1).build();
		function.setTenantId("default");
		return function;
	}

	private Function getParentFunction() {
		Function function = Function.builder().id("2").name("functionParent").code("002").active(true).parentId(null)
				.level(1).build();
		return function;
	}
}