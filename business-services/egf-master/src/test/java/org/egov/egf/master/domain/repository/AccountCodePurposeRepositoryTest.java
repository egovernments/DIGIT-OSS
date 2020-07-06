package org.egov.egf.master.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountCodePurposeEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountCodePurposeJdbcRepository;
import org.egov.egf.master.web.contract.AccountCodePurposeContract;
import org.egov.egf.master.web.contract.AccountCodePurposeSearchContract;
import org.egov.egf.master.web.requests.AccountCodePurposeRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class AccountCodePurposeRepositoryTest {

	private AccountCodePurposeRepository accountCodePurposeRepositoryWithKafka;
	private AccountCodePurposeRepository accountCodePurposeRepositoryWithOutKafka;

	@InjectMocks
	private AccountCodePurposeRepository accountCodePurposeRepository;

	@Mock
	private AccountCodePurposeJdbcRepository accountCodePurposeJdbcRepository;

	@Mock
	private MastersQueueRepository accountCodePurposeQueueRepository;

	@Mock
	private FinancialConfigurationService financialConfigurationService;

	@Mock
	private AccountCodePurposeESRepository accountCodePurposeESRepository;

	@Captor
	private ArgumentCaptor<Map<String, Object>> captor;

	private RequestInfo requestInfo = new RequestInfo();

	@Before
	public void setup() {
		accountCodePurposeRepositoryWithKafka = new AccountCodePurposeRepository(accountCodePurposeJdbcRepository,
				accountCodePurposeQueueRepository, financialConfigurationService, accountCodePurposeESRepository,
				"yes");
		accountCodePurposeRepositoryWithOutKafka = new AccountCodePurposeRepository(accountCodePurposeJdbcRepository,
				accountCodePurposeQueueRepository, financialConfigurationService, accountCodePurposeESRepository, "no");

	}

	@Test
	public void testFindById() {
		AccountCodePurposeEntity accountCodePurposeEntity = getAccountCodePurposeEntity();
		AccountCodePurpose expectedResult = accountCodePurposeEntity.toDomain();
		when(accountCodePurposeJdbcRepository.findById(any(AccountCodePurposeEntity.class)))
				.thenReturn(accountCodePurposeEntity);
		AccountCodePurpose actualResult = accountCodePurposeRepository.findById(getAccountCodePurposeDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSave() {
		List<AccountCodePurpose> expectedResult = getAccountCodePurposes();
		requestInfo.setAction(Constants.ACTION_CREATE);
		accountCodePurposeRepositoryWithKafka.save(expectedResult, requestInfo);
		verify(accountCodePurposeQueueRepository).add(captor.capture());
	}

	@Test
	public void testSave1() {
		List<AccountCodePurpose> expectedResult = getAccountCodePurposes();
		AccountCodePurposeEntity entity = new AccountCodePurposeEntity().toEntity(expectedResult.get(0));
		when(accountCodePurposeJdbcRepository.create(any(AccountCodePurposeEntity.class))).thenReturn(entity);
		accountCodePurposeRepositoryWithOutKafka.save(expectedResult, requestInfo);
		verify(accountCodePurposeQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testSavee() {
		AccountCodePurposeEntity accountCodePurposeEntity = getAccountCodePurposeEntity();
		AccountCodePurpose expectedResult = accountCodePurposeEntity.toDomain();
		when(accountCodePurposeJdbcRepository.create(any(AccountCodePurposeEntity.class)))
				.thenReturn(accountCodePurposeEntity);
		AccountCodePurpose actualResult = accountCodePurposeRepository.save(getAccountCodePurposeDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testUpdate() {
		List<AccountCodePurpose> expectedResult = getAccountCodePurposes();
		requestInfo.setAction(Constants.ACTION_CREATE);
		accountCodePurposeRepositoryWithKafka.update(expectedResult, requestInfo);
		verify(accountCodePurposeQueueRepository).add(captor.capture());
	}

	@Test
	public void testUpdate1() {
		List<AccountCodePurpose> expectedResult = getAccountCodePurposes();
		AccountCodePurposeEntity entity = new AccountCodePurposeEntity().toEntity(expectedResult.get(0));
		when(accountCodePurposeJdbcRepository.update(any(AccountCodePurposeEntity.class))).thenReturn(entity);
		accountCodePurposeRepositoryWithOutKafka.update(expectedResult, requestInfo);
		verify(accountCodePurposeQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testUpdatee() {
		AccountCodePurposeEntity accountCodePurposeEntity = getAccountCodePurposeEntity();
		AccountCodePurpose expectedResult = accountCodePurposeEntity.toDomain();
		when(accountCodePurposeJdbcRepository.update(any(AccountCodePurposeEntity.class)))
				.thenReturn(accountCodePurposeEntity);
		AccountCodePurpose actualResult = accountCodePurposeRepository.update(getAccountCodePurposeDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testAddToQue() {
		Mockito.doNothing().when(accountCodePurposeQueueRepository).add(Mockito.any());
		AccountCodePurposeRequest request = new AccountCodePurposeRequest();
		request.setRequestInfo(getRequestInfo());
		request.setAccountCodePurposes(new ArrayList<AccountCodePurposeContract>());
		request.getAccountCodePurposes().add(getAccountCodePurposeContract());
		accountCodePurposeRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountcodepurpose_create", request);
		Mockito.verify(accountCodePurposeQueueRepository).add(message);
	}

	@Test
	public void testAddToQue1() {
		Mockito.doNothing().when(accountCodePurposeQueueRepository).add(Mockito.any());
		AccountCodePurposeRequest request = new AccountCodePurposeRequest();
		request.setRequestInfo(getRequestInfo());
		request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		request.setAccountCodePurposes(new ArrayList<AccountCodePurposeContract>());
		request.getAccountCodePurposes().add(getAccountCodePurposeContract());
		accountCodePurposeRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountcodepurpose_update", request);
		Mockito.verify(accountCodePurposeQueueRepository).add(message);
	}

	@Test
	public void testAddToSearchQueue() {
		Mockito.lenient().doNothing().when(accountCodePurposeQueueRepository).add(Mockito.any());
		AccountCodePurposeRequest request = new AccountCodePurposeRequest();
		request.setRequestInfo(getRequestInfo());
		request.setAccountCodePurposes(new ArrayList<AccountCodePurposeContract>());
		request.getAccountCodePurposes().add(getAccountCodePurposeContract());
		accountCodePurposeRepository.addToSearchQueue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountcodepurpose_persisted", request);
		Mockito.verify(accountCodePurposeQueueRepository).addToSearch(message);
	}

	@Test
	public void testSearch() {
		Pagination<AccountCodePurpose> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
		when(accountCodePurposeJdbcRepository.search(any(AccountCodePurposeSearch.class))).thenReturn(expectedResult);
		Pagination<AccountCodePurpose> actualResult = accountCodePurposeRepository
				.search(getAccountCodePurposeSearch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSearch1() {
		Pagination<AccountCodePurpose> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
		when(accountCodePurposeESRepository.search(any(AccountCodePurposeSearchContract.class)))
				.thenReturn(expectedResult);
		Pagination<AccountCodePurpose> actualResult = accountCodePurposeRepository
				.search(getAccountCodePurposeSearch());
		assertEquals(expectedResult, actualResult);
	}

	private AccountCodePurposeContract getAccountCodePurposeContract() {
		return AccountCodePurposeContract.builder().name("name").build();
	}

	private AccountCodePurposeEntity getAccountCodePurposeEntity() {
		AccountCodePurposeEntity entity = new AccountCodePurposeEntity();
		AccountCodePurpose accountCodePurpose = getAccountCodePurposeDomain();
		entity.setName(accountCodePurpose.getName());
		entity.setTenantId(accountCodePurpose.getTenantId());
		return entity;
	}

	private AccountCodePurpose getAccountCodePurposeDomain() {
		AccountCodePurpose accountCodePurpose = new AccountCodePurpose();
		accountCodePurpose.setId("1");
		accountCodePurpose.setName("name");
		accountCodePurpose.setTenantId("default");
		return accountCodePurpose;
	}

	public List<AccountCodePurpose> getAccountCodePurposeDomains() {
		List<AccountCodePurpose> accountCodePurposes = new ArrayList<>();
		accountCodePurposes.add(getAccountCodePurposeDomain());
		return accountCodePurposes;
	}

	private RequestInfo getRequestInfo() {
		RequestInfo info = new RequestInfo();
		User user = new User();
		user.setId(1l);
		info.setAction(Constants.ACTION_CREATE);
		info.setDid("did");
		info.setApiId("apiId");
		info.setKey("key");
		info.setMsgId("msgId");
		info.setTs(new Date());
		info.setUserInfo(user);
		info.setAuthToken("null");
		return info;
	}

	private AccountCodePurposeSearch getAccountCodePurposeSearch() {
		AccountCodePurposeSearch accountCodePurposeSearch = new AccountCodePurposeSearch();
		accountCodePurposeSearch.setPageSize(500);
		accountCodePurposeSearch.setOffset(0);
		accountCodePurposeSearch.setSortBy("name desc");
		return accountCodePurposeSearch;
	}

	private List<AccountCodePurpose> getAccountCodePurposes() {
		List<AccountCodePurpose> accountCodePurposes = new ArrayList<AccountCodePurpose>();
		AccountCodePurpose accountCodePurpose = AccountCodePurpose.builder().id("1").name("name").build();
		accountCodePurpose.setTenantId("default");
		accountCodePurposes.add(accountCodePurpose);
		return accountCodePurposes;
	}

	private AccountCodePurposeSearchContract getAccountCodePurposeSearchContract() {
		AccountCodePurposeSearchContract accountCodePurposeSearchContract = new AccountCodePurposeSearchContract();
		accountCodePurposeSearchContract.setPageSize(0);
		accountCodePurposeSearchContract.setOffset(0);
		accountCodePurposeSearchContract.setSortBy("name desc");
		return accountCodePurposeSearchContract;
	}
}
