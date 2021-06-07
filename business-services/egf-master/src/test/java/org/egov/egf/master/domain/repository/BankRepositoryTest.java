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
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.BankEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.BankJdbcRepository;
import org.egov.egf.master.web.contract.BankContract;
import org.egov.egf.master.web.contract.BankSearchContract;
import org.egov.egf.master.web.requests.BankRequest;
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
public class BankRepositoryTest {

	@Mock
	private BankJdbcRepository bankJdbcRepository;

	@Mock
	private MastersQueueRepository bankQueueRepository;

	@InjectMocks
	private BankRepository bankRepository;

	private BankRepository bankRepositoryWithKafka;

	private BankRepository bankRepositoryWithOutKafka;

	@Mock
	private BankESRepository bankESRepository;

	@Mock
	private FinancialConfigurationService financialConfigurationService;

	private RequestInfo requestInfo = new RequestInfo();

	@Captor
	private ArgumentCaptor<Map<String, Object>> captor;

	@Before
	public void setup() {
		bankRepositoryWithKafka = new BankRepository(bankJdbcRepository, bankQueueRepository,
				financialConfigurationService, bankESRepository, "yes");
		bankRepositoryWithOutKafka = new BankRepository(bankJdbcRepository, bankQueueRepository,
				financialConfigurationService, bankESRepository, "no");

	}

	@Test
	public void testFindById() {
		BankEntity bankEntity = getBankEntity();
		Bank expectedResult = bankEntity.toDomain();
		when(bankJdbcRepository.findById(any(BankEntity.class))).thenReturn(bankEntity);
		Bank actualResult = bankRepository.findById(getBankDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testSaveWithKafka() {
		List<Bank> expectedResult = getBanks();
		requestInfo.setAction(Constants.ACTION_CREATE);
		bankRepositoryWithKafka.save(expectedResult, requestInfo);
		verify(bankQueueRepository).add(captor.capture());
	}

	@Test
	public void testSaveWithOutKafka() {
		List<Bank> expectedResult = getBanks();
		BankEntity entity = new BankEntity().toEntity(expectedResult.get(0));
		when(bankJdbcRepository.create(any(BankEntity.class))).thenReturn(entity);
		bankRepositoryWithOutKafka.save(expectedResult, requestInfo);
		verify(bankQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testSave() {
		BankEntity bankEntity = getBankEntity();
		Bank expectedResult = bankEntity.toDomain();
		when(bankJdbcRepository.create(any(BankEntity.class))).thenReturn(bankEntity);
		Bank actualResult = bankRepository.save(getBankDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testUpdateWithKafka() {
		List<Bank> expectedResult = getBanks();
		requestInfo.setAction(Constants.ACTION_CREATE);
		bankRepositoryWithKafka.update(expectedResult, requestInfo);
		verify(bankQueueRepository).add(captor.capture());
	}

	@Test
	public void testUpdateWithOutKafka() {
		List<Bank> expectedResult = getBanks();
		BankEntity entity = new BankEntity().toEntity(expectedResult.get(0));
		when(bankJdbcRepository.update(any(BankEntity.class))).thenReturn(entity);
		bankRepositoryWithOutKafka.update(expectedResult, requestInfo);
		verify(bankQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testUpdate() {
		BankEntity bankEntity = getBankEntity();
		Bank expectedResult = bankEntity.toDomain();
		when(bankJdbcRepository.update(any(BankEntity.class))).thenReturn(bankEntity);
		Bank actualResult = bankRepository.update(bankEntity.toDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testAddToQue() {
		Mockito.doNothing().when(bankQueueRepository).add(Mockito.any());
		BankRequest request = new BankRequest();
		request.setRequestInfo(getRequestInfo());
		request.setBanks(new ArrayList<BankContract>());
		request.getBanks().add(getBankContract());
		bankRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bank_create", request);
		Mockito.verify(bankQueueRepository).add(message);
	}

	@Test
	public void testAddToQue1() {
		Mockito.doNothing().when(bankQueueRepository).add(Mockito.any());
		BankRequest request = new BankRequest();
		request.setRequestInfo(getRequestInfo());
		request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		request.setBanks(new ArrayList<BankContract>());
		request.getBanks().add(getBankContract());
		bankRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bank_update", request);
		Mockito.verify(bankQueueRepository).add(message);
	}

	@Test
	public void testAddToSearchQueue() {
		Mockito.lenient().doNothing().when(bankQueueRepository).add(Mockito.any());
		BankRequest request = new BankRequest();
		request.setRequestInfo(getRequestInfo());
		request.setBanks(new ArrayList<BankContract>());
		request.getBanks().add(getBankContract());
		bankRepository.addToSearchQueue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bank_persisted", request);
		Mockito.verify(bankQueueRepository).addToSearch(message);
	}

	@Test
	public void testSearch() {
		Pagination<Bank> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
		when(bankJdbcRepository.search(any(BankSearch.class))).thenReturn(expectedResult);
		Pagination<Bank> actualResult = bankRepository.search(getBankSearch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSearch1() {
		Pagination<Bank> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
		when(bankESRepository.search(any(BankSearchContract.class))).thenReturn(expectedResult);
		Pagination<Bank> actualResult = bankRepository.search(getBankSearch());
		assertEquals(expectedResult, actualResult);
	}

	private BankContract getBankContract() {
		return BankContract.builder().code("code").name("name").active(true).build();
	}

	private BankEntity getBankEntity() {
		BankEntity entity = new BankEntity();
		Bank bank = getBankDomain();
		entity.setId(bank.getId());
		entity.setCode(bank.getCode());
		entity.setName(bank.getName());
		entity.setActive(bank.getActive());
		entity.setDescription(bank.getDescription());
		entity.setTenantId(bank.getTenantId());
		return entity;
	}

	private Bank getBankDomain() {
		Bank bank = new Bank();
		bank.setId("1");
		bank.setCode("code");
		bank.setName("name");
		bank.setActive(true);
		bank.setDescription("description");
		bank.setTenantId("default");
		return bank;
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

	private BankSearch getBankSearch() {
		BankSearch bankSearch = new BankSearch();
		bankSearch.setPageSize(500);
		bankSearch.setOffset(0);
		bankSearch.setSortBy("name desc");
		return bankSearch;
	}

	private List<Bank> getBanks() {
		List<Bank> banks = new ArrayList<Bank>();
		Bank bank = Bank.builder().id("1").name("name").code("code").active(true).build();
		bank.setTenantId("default");
		banks.add(bank);
		return banks;
	}

	private BankSearchContract getBankSearchContract() {
		BankSearchContract bankSearchContract = new BankSearchContract();
		bankSearchContract.setPageSize(0);
		bankSearchContract.setOffset(0);
		bankSearchContract.setSortBy("name desc");
		return bankSearchContract;
	}
}