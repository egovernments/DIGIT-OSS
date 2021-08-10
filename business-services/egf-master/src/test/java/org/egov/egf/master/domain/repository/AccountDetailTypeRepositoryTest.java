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
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountDetailTypeEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountDetailTypeJdbcRepository;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.contract.AccountDetailTypeSearchContract;
import org.egov.egf.master.web.requests.AccountDetailTypeRequest;
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
public class AccountDetailTypeRepositoryTest {

	private AccountDetailTypeRepository accountDetailTypeRepositoryWithKafka;
	private AccountDetailTypeRepository accountDetailTypeRepositoryWithOutKafka;

	@InjectMocks
	private AccountDetailTypeRepository accountDetailTypeRepository;

	@Mock
	private AccountDetailTypeJdbcRepository accountDetailTypeJdbcRepository;

	@Mock
	private MastersQueueRepository accountDetailTypeQueueRepository;

	@Mock
	private FinancialConfigurationService financialConfigurationService;

	@Mock
	private AccountDetailTypeESRepository accountDetailTypeESRepository;

	@Captor
	private ArgumentCaptor<Map<String, Object>> captor;

	private RequestInfo requestInfo = new RequestInfo();

	@Before
	public void setup() {
		accountDetailTypeRepositoryWithKafka = new AccountDetailTypeRepository(accountDetailTypeJdbcRepository,
				accountDetailTypeQueueRepository, financialConfigurationService, accountDetailTypeESRepository, "yes");
		accountDetailTypeRepositoryWithOutKafka = new AccountDetailTypeRepository(accountDetailTypeJdbcRepository,
				accountDetailTypeQueueRepository, financialConfigurationService, accountDetailTypeESRepository, "no");

	}

	@Test
	public void testFindById() {
		AccountDetailTypeEntity accountDetailTypeEntity = getAccountDetailTypeEntity();
		AccountDetailType expectedResult = accountDetailTypeEntity.toDomain();
		when(accountDetailTypeJdbcRepository.findById(any(AccountDetailTypeEntity.class)))
				.thenReturn(accountDetailTypeEntity);
		AccountDetailType actualResult = accountDetailTypeRepository.findById(getAccountDetailTypeDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testSaveWithKafka() {
		List<AccountDetailType> expectedResult = getAccountDetailTypes();
		requestInfo.setAction(Constants.ACTION_CREATE);
		accountDetailTypeRepositoryWithKafka.save(expectedResult, requestInfo);
		verify(accountDetailTypeQueueRepository).add(captor.capture());
	}

	@Test
	public void testSaveWithOutKafka() {
		List<AccountDetailType> expectedResult = getAccountDetailTypes();
		AccountDetailTypeEntity entity = new AccountDetailTypeEntity().toEntity(expectedResult.get(0));
		when(accountDetailTypeJdbcRepository.create(any(AccountDetailTypeEntity.class))).thenReturn(entity);
		accountDetailTypeRepositoryWithOutKafka.save(expectedResult, requestInfo);
		verify(accountDetailTypeQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testSave() {
		AccountDetailTypeEntity accountDetailTypeEntity = getAccountDetailTypeEntity();
		AccountDetailType expectedResult = accountDetailTypeEntity.toDomain();
		when(accountDetailTypeJdbcRepository.create(any(AccountDetailTypeEntity.class)))
				.thenReturn(accountDetailTypeEntity);
		AccountDetailType actualResult = accountDetailTypeRepository.save(getAccountDetailTypeDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testUpdateWithKafka() {
		List<AccountDetailType> expectedResult = getAccountDetailTypes();
		requestInfo.setAction(Constants.ACTION_CREATE);
		accountDetailTypeRepositoryWithKafka.update(expectedResult, requestInfo);
		verify(accountDetailTypeQueueRepository).add(captor.capture());
	}

	@Test
	public void testUpdateWithOutKafka() {
		List<AccountDetailType> expectedResult = getAccountDetailTypes();
		AccountDetailTypeEntity entity = new AccountDetailTypeEntity().toEntity(expectedResult.get(0));
		when(accountDetailTypeJdbcRepository.update(any(AccountDetailTypeEntity.class))).thenReturn(entity);
		accountDetailTypeRepositoryWithOutKafka.update(expectedResult, requestInfo);
		verify(accountDetailTypeQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testUpdate() {
		AccountDetailTypeEntity accountDetailTypeEntity = getAccountDetailTypeEntity();
		AccountDetailType expectedResult = accountDetailTypeEntity.toDomain();
		when(accountDetailTypeJdbcRepository.update(any(AccountDetailTypeEntity.class)))
				.thenReturn(accountDetailTypeEntity);
		AccountDetailType actualResult = accountDetailTypeRepository.update(getAccountDetailTypeDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testAddToQue() {
		Mockito.doNothing().when(accountDetailTypeQueueRepository).add(Mockito.any());
		AccountDetailTypeRequest request = new AccountDetailTypeRequest();
		request.setRequestInfo(getRequestInfo());
		request.setAccountDetailTypes(new ArrayList<AccountDetailTypeContract>());
		request.getAccountDetailTypes().add(getAccountDetailTypeContract());
		accountDetailTypeRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountdetailtype_create", request);
		Mockito.verify(accountDetailTypeQueueRepository).add(message);
	}

	@Test
	public void testAddToQue1() {
		Mockito.doNothing().when(accountDetailTypeQueueRepository).add(Mockito.any());
		AccountDetailTypeRequest request = new AccountDetailTypeRequest();
		request.setRequestInfo(getRequestInfo());
		request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		request.setAccountDetailTypes(new ArrayList<AccountDetailTypeContract>());
		request.getAccountDetailTypes().add(getAccountDetailTypeContract());
		accountDetailTypeRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountdetailtype_update", request);
		Mockito.verify(accountDetailTypeQueueRepository).add(message);
	}

	@Test
	public void testAddToSearchQueue() {
		Mockito.lenient().doNothing().when(accountDetailTypeQueueRepository).add(Mockito.any());
		AccountDetailTypeRequest request = new AccountDetailTypeRequest();
		request.setRequestInfo(getRequestInfo());
		request.setAccountDetailTypes(new ArrayList<AccountDetailTypeContract>());
		request.getAccountDetailTypes().add(getAccountDetailTypeContract());
		accountDetailTypeRepository.addToSearchQueue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("accountdetailtype_persisted", request);
		Mockito.verify(accountDetailTypeQueueRepository).addToSearch(message);
	}

	@Test
	public void testSearch() {
		Pagination<AccountDetailType> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
		when(accountDetailTypeJdbcRepository.search(any(AccountDetailTypeSearch.class))).thenReturn(expectedResult);
		Pagination<AccountDetailType> actualResult = accountDetailTypeRepository.search(getAccountDetailTypeSearch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSearch1() {
		Pagination<AccountDetailType> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
		when(accountDetailTypeESRepository.search(any(AccountDetailTypeSearchContract.class)))
				.thenReturn(expectedResult);
		Pagination<AccountDetailType> actualResult = accountDetailTypeRepository.search(getAccountDetailTypeSearch());
		assertEquals(expectedResult, actualResult);
	}

	private AccountDetailTypeContract getAccountDetailTypeContract() {
		return AccountDetailTypeContract.builder().tableName("contractor").fullyQualifiedName("abc/contractor")
				.name("name").active(true).build();
	}

	private AccountDetailTypeEntity getAccountDetailTypeEntity() {
		AccountDetailTypeEntity entity = new AccountDetailTypeEntity();
		AccountDetailType accountDetailType = getAccountDetailTypeDomain();
		entity.setTablename(accountDetailType.getTableName());
		entity.setName(accountDetailType.getName());
		entity.setActive(accountDetailType.getActive());
		entity.setFullyQualifiedName(accountDetailType.getFullyQualifiedName());
		entity.setTenantId(accountDetailType.getTenantId());
		return entity;
	}

	private AccountDetailType getAccountDetailTypeDomain() {
		AccountDetailType accountDetailType = new AccountDetailType();
		accountDetailType.setId("1");
		accountDetailType.setTableName("contractor");
		accountDetailType.setName("name");
		accountDetailType.setActive(true);
		accountDetailType.setFullyQualifiedName("abc/contractor");
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}

	public List<AccountDetailType> getAccountDetailTypeDomains() {
		List<AccountDetailType> accountDetailTypes = new ArrayList<>();
		accountDetailTypes.add(getAccountDetailTypeDomain());
		return accountDetailTypes;
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

	private AccountDetailTypeSearch getAccountDetailTypeSearch() {
		AccountDetailTypeSearch accountDetailTypeSearch = new AccountDetailTypeSearch();
		accountDetailTypeSearch.setPageSize(500);
		accountDetailTypeSearch.setOffset(0);
		accountDetailTypeSearch.setSortBy("name desc");
		return accountDetailTypeSearch;
	}

	private List<AccountDetailType> getAccountDetailTypes() {
		List<AccountDetailType> accountDetailTypes = new ArrayList<AccountDetailType>();
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("contractor")
				.fullyQualifiedName("abc/contractor").active(true).build();
		accountDetailType.setTenantId("default");
		accountDetailTypes.add(accountDetailType);
		return accountDetailTypes;
	}

	private AccountDetailTypeSearchContract getAccountDetailTypeSearchContract() {
		AccountDetailTypeSearchContract accountDetailTypeSearchContract = new AccountDetailTypeSearchContract();
		accountDetailTypeSearchContract.setPageSize(0);
		accountDetailTypeSearchContract.setOffset(0);
		accountDetailTypeSearchContract.setSortBy("name desc");
		return accountDetailTypeSearchContract;
	}
}
