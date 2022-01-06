package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;
import org.egov.egf.master.domain.repository.AccountDetailTypeRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountDetailRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.egov.egf.master.web.contract.ChartOfAccountDetailContract;
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
public class ChartOfAccountDetailServiceTest {
	
	@InjectMocks
	ChartOfAccountDetailService chartOfAccountDetailService;

	@Mock
	private SmartValidator validator;

	@Mock
	private ChartOfAccountRepository chartOfAccountRepository;
	
	@Mock
	private ChartOfAccountDetailRepository chartOfAccountDetailRepository;

	@Mock
	private AccountDetailTypeRepository accountDetailTypeRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);

	private List<ChartOfAccountDetail> chartOfAccountDetails = new ArrayList<>();

	@Before
	public void setup() {

	}
	
	@Test
	public final void testFetchRelated() {
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetailType());
		chartOfAccountDetails.add(getChartOfAccountDetail());
		chartOfAccountDetailService.fetchRelated(chartOfAccountDetails);
	}
	
	@Test
	public final void testAdd(){
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetailType());
		chartOfAccountDetails.add(getChartOfAccountDetail());
		chartOfAccountDetailService.add(chartOfAccountDetails, errors);
	}
	
	@Test
	public final void testUpdate(){
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetailType());
		chartOfAccountDetails.add(getChartOfAccountDetail());
		chartOfAccountDetailService.update(chartOfAccountDetails, errors);
	}
	
/*	@Test
	public final void testAddToQue(){
		CommonRequest<ChartOfAccountDetailContract> request = new CommonRequest<>();
		List<ChartOfAccountDetailContract> coadcs = new ArrayList<>();
		ChartOfAccountDetailContract coadc = getChartOfAccountDetailContract();
		coadcs.add(coadc);
		request.setData(coadcs);
		chartOfAccountDetailService.addToQue(request);
		verify(chartOfAccountDetailRepository).add(request);
	}*/
	
	@Test
	public final void testSearch(){
		List<ChartOfAccountDetail> search = new ArrayList<>();
		search.add(getChartOfAccountDetailSearch());
		Pagination<ChartOfAccountDetail> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(chartOfAccountDetailRepository.search(any(ChartOfAccountDetailSearch.class))).thenReturn(expectedResult);
		Pagination<ChartOfAccountDetail> actualResult = chartOfAccountDetailService.search(getChartOfAccountDetailSearch(), errors);
		assertEquals(expectedResult, actualResult);
	}
	
	@Test
	public final void testSave(){
		ChartOfAccountDetail expectedResult = getChartOfAccountDetail();
		when(chartOfAccountDetailRepository.save(any(ChartOfAccountDetail.class))).thenReturn(expectedResult);
		final ChartOfAccountDetail actualResult = chartOfAccountDetailService.save(getChartOfAccountDetail());
		assertEquals(expectedResult, actualResult);
	}
	
	@Test
	public final void test_Update(){
		ChartOfAccountDetail expectedResult = getChartOfAccountDetail();
		when(chartOfAccountDetailRepository.update(any(ChartOfAccountDetail.class))).thenReturn(expectedResult);
		final ChartOfAccountDetail actualResult = chartOfAccountDetailService.update(getChartOfAccountDetail());
		assertEquals(expectedResult, actualResult);
	}
	
	private ChartOfAccountDetail getChartOfAccountDetail() {
		ChartOfAccountDetail chartOfAccountDetail = ChartOfAccountDetail.builder().id("1").build();
		chartOfAccountDetail.setChartOfAccount(getChartOfAccount());
		chartOfAccountDetail.setAccountDetailType(getAccountDetailType());
		return chartOfAccountDetail;
	}
	
	private ChartOfAccount getChartOfAccount(){
		ChartOfAccount chartOfAccount = ChartOfAccount.builder()
				.glcode("glcode").name("name")
				.description("description").isActiveForPosting(true)
				.type('A').classification((long) 123456)
				.functionRequired(true).budgetCheckRequired(true).build();
		chartOfAccount.setTenantId("default");
		return chartOfAccount;
	}
	
	private AccountDetailType getAccountDetailType(){
		AccountDetailType accountDetailType = AccountDetailType.builder()
				.name("name").description("description").active(true).build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}
	
	private ChartOfAccountDetailContract getChartOfAccountDetailContract(){
		ChartOfAccountDetailContract chartOfAccountDetailContract = ChartOfAccountDetailContract.builder().id("1").build();
		chartOfAccountDetailContract.setChartOfAccount(getChartofAccountContract());
		chartOfAccountDetailContract.setAccountDetailType(getAccountDetailTypeContract());
		return chartOfAccountDetailContract;
	}
	
	private ChartOfAccountContract getChartofAccountContract(){
		ChartOfAccountContract chartOfAccountContract = ChartOfAccountContract.builder().glcode("glcode").name("name").type('A').isActiveForPosting(true).isActiveForPosting(true).build();
		return chartOfAccountContract;
	}
	
	private AccountDetailTypeContract getAccountDetailTypeContract(){
		AccountDetailTypeContract accountDetailTypeContract = AccountDetailTypeContract.builder()
				.name("name").description("description").active(true).build();
		accountDetailTypeContract.setTenantId("default");
		return accountDetailTypeContract;
	}
	
	private ChartOfAccountDetailSearch getChartOfAccountDetailSearch(){
		ChartOfAccountDetailSearch chartOfAccountDetailSearch = new ChartOfAccountDetailSearch();
		chartOfAccountDetailSearch.setPageSize(0);
		chartOfAccountDetailSearch.setOffset(0);
		chartOfAccountDetailSearch.setSortBy("Sort");
		chartOfAccountDetailSearch.setTenantId("default");
		return chartOfAccountDetailSearch;
	}
}