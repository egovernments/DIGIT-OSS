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
import org.egov.egf.master.domain.enums.BankAccountType;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.BankAccountEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.BankAccountJdbcRepository;
import org.egov.egf.master.web.contract.BankAccountContract;
import org.egov.egf.master.web.contract.BankAccountSearchContract;
import org.egov.egf.master.web.contract.enums.BankAccountTypeContract;
import org.egov.egf.master.web.requests.BankAccountRequest;
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
public class BankAccountRepositoryTest {

	@Mock
	private BankAccountJdbcRepository bankAccountJdbcRepository;

	@Mock
	private MastersQueueRepository bankAccountQueueRepository;

	@InjectMocks
	private BankAccountRepository bankAccountRepository;

	@Mock
	private FinancialConfigurationService financialConfigurationService;

	private RequestInfo requestInfo = new RequestInfo();
	@Captor
	private ArgumentCaptor<Map<String, Object>> captor;

	private BankAccountRepository bankAccountRepositoryWithKafka;

	private BankAccountRepository bankAccountRepositoryWithOutKafka;

	@Mock
	private BankAccountESRepository bankAccountESRepository;

	@Before
	public void setup() {
		bankAccountRepositoryWithKafka = new BankAccountRepository(bankAccountJdbcRepository,
				bankAccountQueueRepository, financialConfigurationService, bankAccountESRepository, "yes");
		bankAccountRepositoryWithOutKafka = new BankAccountRepository(bankAccountJdbcRepository,
				bankAccountQueueRepository, financialConfigurationService, bankAccountESRepository, "no");

	}

	@Test
	public void testFindById() {
		BankAccountEntity bankAccountEntity = getBankAccountEntity();
		BankAccount expectedResult = bankAccountEntity.toDomain();
		when(bankAccountJdbcRepository.findById(any(BankAccountEntity.class))).thenReturn(bankAccountEntity);
		BankAccount actualResult = bankAccountRepository.findById(getBankAccountDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testSaveWithKafka() {
		List<BankAccount> expectedResult = new ArrayList<>();
		expectedResult.add(getBankAccountDomain());
		requestInfo.setAction(Constants.ACTION_CREATE);
		bankAccountRepositoryWithKafka.save(expectedResult, requestInfo);
		verify(bankAccountQueueRepository).add(captor.capture());
	}

	@Test
	public void testSaveWithOutKafka() {
		List<BankAccount> expectedResult = new ArrayList<>();
		expectedResult.add(getBankAccountDomain());
		BankAccountEntity entity = new BankAccountEntity().toEntity(expectedResult.get(0));
		when(bankAccountJdbcRepository.create(any(BankAccountEntity.class))).thenReturn(entity);
		bankAccountRepositoryWithOutKafka.save(expectedResult, requestInfo);
		verify(bankAccountQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testSave() {
		BankAccountEntity bankAccountEntity = getBankAccountEntity();
		BankAccount expectedResult = bankAccountEntity.toDomain();
		when(bankAccountJdbcRepository.create(any(BankAccountEntity.class))).thenReturn(bankAccountEntity);
		BankAccount actualResult = bankAccountRepository.save(getBankAccountDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testUpdateWithKafka() {
		List<BankAccount> expectedResult = new ArrayList<>();
		expectedResult.add(getBankAccountDomain());
		requestInfo.setAction(Constants.ACTION_CREATE);
		bankAccountRepositoryWithKafka.update(expectedResult, requestInfo);
		verify(bankAccountQueueRepository).add(captor.capture());
	}

	@Test
	public void testUpdateWithOutKafka() {
		List<BankAccount> expectedResult = new ArrayList<>();
		expectedResult.add(getBankAccountDomain());
		BankAccountEntity entity = new BankAccountEntity().toEntity(expectedResult.get(0));
		when(bankAccountJdbcRepository.update(any(BankAccountEntity.class))).thenReturn(entity);
		bankAccountRepositoryWithOutKafka.update(expectedResult, requestInfo);
		verify(bankAccountQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testUpdate() {
		BankAccountEntity bankAccountEntity = getBankAccountEntity();
		BankAccount expectedResult = bankAccountEntity.toDomain();
		when(bankAccountJdbcRepository.update(any(BankAccountEntity.class))).thenReturn(bankAccountEntity);
		BankAccount actualResult = bankAccountRepository.update(bankAccountEntity.toDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testAddToQue() {
		Mockito.doNothing().when(bankAccountQueueRepository).add(Mockito.any());
		BankAccountRequest request = new BankAccountRequest();
		request.setRequestInfo(getRequestInfo());
		request.setBankAccounts(new ArrayList<BankAccountContract>());
		request.getBankAccounts().add(getBankAccountContract());
		bankAccountRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bankaccount_create", request);
		Mockito.verify(bankAccountQueueRepository).add(message);
	}

	@Test
	public void testAddToQue1() {
		Mockito.doNothing().when(bankAccountQueueRepository).add(Mockito.any());
		BankAccountRequest request = new BankAccountRequest();
		request.setRequestInfo(getRequestInfo());
		request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		request.setBankAccounts(new ArrayList<BankAccountContract>());
		request.getBankAccounts().add(getBankAccountContract());
		bankAccountRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bankaccount_update", request);
		Mockito.verify(bankAccountQueueRepository).add(message);
	}

	@Test
	public void testAddToSearchQueue() {
		Mockito.lenient().doNothing().when(bankAccountQueueRepository).add(Mockito.any());
		BankAccountRequest request = new BankAccountRequest();
		request.setRequestInfo(getRequestInfo());
		request.setBankAccounts(new ArrayList<BankAccountContract>());
		request.getBankAccounts().add(getBankAccountContract());
		bankAccountRepository.addToSearchQueue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bankaccount_persisted", request);
		Mockito.verify(bankAccountQueueRepository).addToSearch(message);
	}

	@Test
	public void testSearch() {
		Pagination<BankAccount> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
		when(bankAccountJdbcRepository.search(any(BankAccountSearch.class))).thenReturn(expectedResult);
		Pagination<BankAccount> actualResult = bankAccountRepository.search(getBankAccountSearch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSearch1() {
		Pagination<BankAccount> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
		when(bankAccountESRepository.search(any(BankAccountSearchContract.class))).thenReturn(expectedResult);
		Pagination<BankAccount> actualResult = bankAccountRepository.search(getBankAccountSearch());
		assertEquals(expectedResult, actualResult);
	}

	private BankAccountEntity getBankAccountEntity() {
		BankAccountEntity bankAccountEntity = new BankAccountEntity();
		BankAccount bankAccount = getBankAccountDomain();
		bankAccountEntity.setId(bankAccount.getId());
		bankAccountEntity.setDescription(bankAccount.getDescription());
		bankAccountEntity.setActive(bankAccount.getActive());
		bankAccountEntity.setTenantId(bankAccount.getTenantId());
		bankAccountEntity.setType(bankAccount.getType().toString());
		return bankAccountEntity;
	}

	private BankAccount getBankAccountDomain() {
		BankAccount bankAccount = new BankAccount();
		bankAccount.setId("1");
		bankAccount.setDescription("description");
		bankAccount.setActive(true);
		bankAccount.setTenantId("default");
		bankAccount.setType(BankAccountType.PAYMENTS);
		return bankAccount;
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

	private BankAccountContract getBankAccountContract() {
		BankAccountContract bankAccountContract = BankAccountContract.builder().id("1").description("description")
				.active(true).type(BankAccountTypeContract.PAYMENTS).build();
		bankAccountContract.setTenantId("default");
		return bankAccountContract;
	}

	private BankAccountSearch getBankAccountSearch() {
		BankAccountSearch bankAccountSearch = new BankAccountSearch();
		bankAccountSearch.setPageSize(500);
		bankAccountSearch.setOffset(0);
		bankAccountSearch.setSortBy("name desc");
		return bankAccountSearch;
	}

}