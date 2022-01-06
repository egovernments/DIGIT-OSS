package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.FundSearch;
import org.egov.egf.master.domain.repository.FundRepository;
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
public class FundServiceTest {

	@InjectMocks
	private FundService fundService;

	@Mock
	private SmartValidator validator;

	@Mock
	private FundRepository fundRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);
	private RequestInfo requestInfo = new RequestInfo();
	private List<Fund> funds = new ArrayList<>();

	@Before
	public void setup() {
	}

	/*@Test
	public final void testCreate() {
		when(fundRepository.findById(any(Fund.class))).thenReturn(getParentFund());
		fundService.create(getFunds(), errors, requestInfo);
	}*/
/*
	@Test
	public final void testUpdate() {
		when(fundRepository.findById(any(Fund.class))).thenReturn(getParentFund());
		fundService.update(getFunds(), errors, requestInfo);
	}*/

/*	@Test
	public final void testCreateInvalid() {
		Fund fund1 = Fund.builder().id("a").code("code").identifier('I').active(true).parent(null).level(1234l).build();
		funds.add(fund1);
		fundService.create(funds, errors, requestInfo);
	}
*/
	@Test
	public final void test_save() {
		Fund expextedResult = getFunds().get(0);
		when(fundRepository.save(any(Fund.class))).thenReturn(expextedResult);
		Fund actualResult = fundService.save(getFunds().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void testSearch() {
		List<Fund> search = new ArrayList<>();
		search.add(getFundSearch());
		Pagination<Fund> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(fundRepository.search(any(FundSearch.class))).thenReturn(expectedResult);
		Pagination<Fund> actualResult = fundService.search(getFundSearch(), errors);
		assertEquals(expectedResult, actualResult);

	}

	@Test
	public final void test_update() {
		Fund expextedResult = getFunds().get(0);
		when(fundRepository.update(any(Fund.class))).thenReturn(expextedResult);
		Fund actualResult = fundService.update(getFunds().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void test_fetch_related_data() {
		List<Fund> expextedResult = new ArrayList<>();
		expextedResult.add(getParentFund());
		when(fundRepository.findById(any(Fund.class))).thenReturn(getParentFund());
		List<Fund> actualResult = fundService.fetchRelated(getFunds());
		assertEquals(expextedResult.get(0).getId(), actualResult.get(0).getParent().getId());
		assertEquals(expextedResult.get(0).getName(), actualResult.get(0).getParent().getName());
	}

	private List<Fund> getFunds() {
		List<Fund> funds = new ArrayList<Fund>();
		Fund fund = Fund.builder().id("1").name("name").code("code").identifier('I').parent(getParentFund())
				.level(1234l).active(true).build();
		fund.setTenantId("default");
		funds.add(fund);
		return funds;
	}

	private Fund getParentFund() {
		return Fund.builder().id("2").name("nameP").code("codeP").identifier('P').parent(null).level(1234l).active(true)
				.build();
	}

	private FundSearch getFundSearch() {
		FundSearch fundSearch = new FundSearch();
		fundSearch.setPageSize(0);
		fundSearch.setOffset(0);
		fundSearch.setSortBy("Sort");
		fundSearch.setTenantId("default");
		return fundSearch;
	}
}