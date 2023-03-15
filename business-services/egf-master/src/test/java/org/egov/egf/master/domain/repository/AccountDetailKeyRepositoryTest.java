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
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountDetailKeyEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountDetailKeyJdbcRepository;
import org.egov.egf.master.web.contract.AccountDetailKeyContract;
import org.egov.egf.master.web.contract.AccountDetailKeySearchContract;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.requests.AccountDetailKeyRequest;
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
public class AccountDetailKeyRepositoryTest {

	private AccountDetailKeyRepository accountDetailKeyRepositoryWithKafka;
	private AccountDetailKeyRepository accountDetailKeyRepositoryWithOutKafka;

	@InjectMocks
	private AccountDetailKeyRepository accountDetailKeyRepository;

	@Mock
	private AccountDetailKeyJdbcRepository accountDetailKeyJdbcRepository;

	@Mock
	private MastersQueueRepository accountDetailKeyQueueRepository;

	@Mock
	private FinancialConfigurationService financialConfigurationService;

	@Mock
	private AccountDetailKeyESRepository accountDetailKeyESRepository;

	@Captor
	private ArgumentCaptor<Map<String, Object>> captor;

	private RequestInfo requestInfo = new RequestInfo();

	@Before
	public void setup() {
		accountDetailKeyRepositoryWithKafka = new AccountDetailKeyRepository(accountDetailKeyJdbcRepository,
				accountDetailKeyQueueRepository, financialConfigurationService, accountDetailKeyESRepository, "yes");
		accountDetailKeyRepositoryWithOutKafka = new AccountDetailKeyRepository(accountDetailKeyJdbcRepository,
				accountDetailKeyQueueRepository, financialConfigurationService, accountDetailKeyESRepository, "no");

	}

	@Test
	public void testFindById() {
		AccountDetailKeyEntity accountDetailKeyEntity = getAccountDetailKeyEntity();
		AccountDetailKey expectedResult = accountDetailKeyEntity.toDomain();
		when(accountDetailKeyJdbcRepository.findById(any(AccountDetailKeyEntity.class)))
				.thenReturn(accountDetailKeyEntity);
		AccountDetailKey actualResult = accountDetailKeyRepository.findById(getAccountDetailKeyDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSaveWithKafka() {
		List<AccountDetailKey> expectedResult = getAccountDetailKies();
		requestInfo.setAction(Constants.ACTION_CREATE);
		accountDetailKeyRepositoryWithKafka.save(expectedResult, requestInfo);
		verify(accountDetailKeyQueueRepository).add(captor.capture());
	}

	@Test
	public void testSaveWithOutKafka() {
		List<AccountDetailKey> expectedResult = getAccountDetailKies();
		AccountDetailKeyEntity entity = new AccountDetailKeyEntity().toEntity(expectedResult.get(0));
		when(accountDetailKeyJdbcRepository.create(any(AccountDetailKeyEntity.class))).thenReturn(entity);
		accountDetailKeyRepositoryWithOutKafka.save(expectedResult, requestInfo);
		verify(accountDetailKeyQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testSave() {
		AccountDetailKeyEntity accountDetailKeyEntity = getAccountDetailKeyEntity();
		AccountDetailKey expectedResult = accountDetailKeyEntity.toDomain();
		when(accountDetailKeyJdbcRepository.create(any(AccountDetailKeyEntity.class)))
				.thenReturn(accountDetailKeyEntity);
		AccountDetailKey actualResult = accountDetailKeyRepository.save(getAccountDetailKeyDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testUpdateWithKafka() {
		List<AccountDetailKey> expectedResult = getAccountDetailKies();
		requestInfo.setAction(Constants.ACTION_CREATE);
		accountDetailKeyRepositoryWithKafka.update(expectedResult, requestInfo);
		verify(accountDetailKeyQueueRepository).add(captor.capture());
	}

	@Test
	public void testUpdateWithOutKafka() {
		List<AccountDetailKey> expectedResult = getAccountDetailKies();
		AccountDetailKeyEntity entity = new AccountDetailKeyEntity().toEntity(expectedResult.get(0));
		when(accountDetailKeyJdbcRepository.update(any(AccountDetailKeyEntity.class))).thenReturn(entity);
		accountDetailKeyRepositoryWithOutKafka.update(expectedResult, requestInfo);
		verify(accountDetailKeyQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testUpdate() {
		AccountDetailKeyEntity accountDetailKeyEntity = getAccountDetailKeyEntity();
		AccountDetailKey expectedResult = accountDetailKeyEntity.toDomain();
		when(accountDetailKeyJdbcRepository.update(any(AccountDetailKeyEntity.class)))
				.thenReturn(accountDetailKeyEntity);
		AccountDetailKey actualResult = accountDetailKeyRepository.update(getAccountDetailKeyDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testAddToQue() {
		Mockito.doNothing().when(accountDetailKeyQueueRepository).add(Mockito.any());
		AccountDetailKeyRequest request = new AccountDetailKeyRequest();
		request.setRequestInfo(getRequestInfo());
		request.setAccountDetailKeys(new ArrayList<AccountDetailKeyContract>());
		request.getAccountDetailKeys().add(getAccountDetailKeyContract());
		accountDetailKeyRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountdetailkey_create", request);
		Mockito.verify(accountDetailKeyQueueRepository).add(message);
	}

	@Test
	public void testAddToQue1() {
		Mockito.doNothing().when(accountDetailKeyQueueRepository).add(Mockito.any());
		AccountDetailKeyRequest request = new AccountDetailKeyRequest();
		request.setRequestInfo(getRequestInfo());
		request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		request.setAccountDetailKeys(new ArrayList<AccountDetailKeyContract>());
		request.getAccountDetailKeys().add(getAccountDetailKeyContract());
		accountDetailKeyRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountdetailkey_update", request);
		Mockito.verify(accountDetailKeyQueueRepository).add(message);
	}

	@Test
	public void testAddToSearchQueue() {
		Mockito.lenient().doNothing().when(accountDetailKeyQueueRepository).add(Mockito.any());
		AccountDetailKeyRequest request = new AccountDetailKeyRequest();
		request.setRequestInfo(getRequestInfo());
		request.setAccountDetailKeys(new ArrayList<AccountDetailKeyContract>());
		request.getAccountDetailKeys().add(getAccountDetailKeyContract());
		accountDetailKeyRepository.addToSearchQueue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountdetailkey_persisted", request);
		Mockito.verify(accountDetailKeyQueueRepository).addToSearch(message);
	}

	@Test
	public void testSearch() {
		Pagination<AccountDetailKey> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
		when(accountDetailKeyJdbcRepository.search(any(AccountDetailKeySearch.class))).thenReturn(expectedResult);
		Pagination<AccountDetailKey> actualResult = accountDetailKeyRepository.search(getAccountDetailKeySearch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSearch1() {
		Pagination<AccountDetailKey> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
		when(accountDetailKeyESRepository.search(any(AccountDetailKeySearchContract.class))).thenReturn(expectedResult);
		Pagination<AccountDetailKey> actualResult = accountDetailKeyRepository.search(getAccountDetailKeySearch());
		assertEquals(expectedResult, actualResult);
	}

	private AccountDetailKeyContract getAccountDetailKeyContract() {
		return AccountDetailKeyContract.builder().id("1").key("1").accountDetailType(getAccountDetailTypeContract())
				.build();
	}

	private AccountDetailKeyEntity getAccountDetailKeyEntity() {
		AccountDetailKeyEntity entity = new AccountDetailKeyEntity();
		AccountDetailKey accountDetailKey = getAccountDetailKeyDomain();
		entity.setKey(accountDetailKey.getKey());
		entity.setAccountDetailTypeId(accountDetailKey.getAccountDetailType().getId());
		entity.setTenantId(accountDetailKey.getTenantId());
		return entity;
	}

	private AccountDetailKey getAccountDetailKeyDomain() {
		AccountDetailKey accountDetailKey = new AccountDetailKey();
		accountDetailKey.setId("1");
		accountDetailKey.setKey("1");
		accountDetailKey.setAccountDetailType(getAccountDetailType());
		accountDetailKey.setTenantId("default");
		return accountDetailKey;
	}

	public List<AccountDetailKey> getAccountDetailKeyDomains() {
		List<AccountDetailKey> accountDetailKies = new ArrayList<>();
		accountDetailKies.add(getAccountDetailKeyDomain());
		return accountDetailKies;
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

	private AccountDetailKeySearch getAccountDetailKeySearch() {
		AccountDetailKeySearch accountDetailKeySearch = new AccountDetailKeySearch();
		accountDetailKeySearch.setPageSize(500);
		accountDetailKeySearch.setOffset(0);
		accountDetailKeySearch.setSortBy("name desc");
		return accountDetailKeySearch;
	}

	private List<AccountDetailKey> getAccountDetailKies() {
		List<AccountDetailKey> accountDetailKies = new ArrayList<AccountDetailKey>();
		AccountDetailKey accountDetailKey = AccountDetailKey.builder().id("1").key("1")
				.accountDetailType(getAccountDetailType()).build();
		accountDetailKey.setTenantId("default");
		accountDetailKies.add(accountDetailKey);
		return accountDetailKies;
	}

	private AccountDetailKeySearchContract getAccountDetailKeySearchContract() {
		AccountDetailKeySearchContract accountDetailKeySearchContract = new AccountDetailKeySearchContract();
		accountDetailKeySearchContract.setPageSize(0);
		accountDetailKeySearchContract.setOffset(0);
		accountDetailKeySearchContract.setSortBy("name desc");
		return accountDetailKeySearchContract;
	}

	private AccountDetailTypeContract getAccountDetailTypeContract() {
		AccountDetailTypeContract accountDetailType = AccountDetailTypeContract.builder().id("1").name("name")
				.tableName("contractor").fullyQualifiedName("abc/acb").active(true).build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}

	private AccountDetailType getAccountDetailType() {
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("contractor")
				.fullyQualifiedName("abc/acb").active(true).build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}
}
