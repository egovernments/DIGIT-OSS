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
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.BankBranchEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.BankBranchJdbcRepository;
import org.egov.egf.master.web.contract.BankBranchContract;
import org.egov.egf.master.web.contract.BankBranchSearchContract;
import org.egov.egf.master.web.requests.BankBranchRequest;
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
public class BankBranchRepositoryTest {

	@Mock
	private BankBranchJdbcRepository bankBranchJdbcRepository;

	@Mock
	private MastersQueueRepository bankBranchQueueRepository;

	@InjectMocks
	private BankBranchRepository bankBranchRepository;

	private BankBranchRepository bankBranchRepositoryWithKafka;

	private BankBranchRepository bankBranchRepositoryWithOutKafka;

	@Mock
	private FinancialConfigurationService financialConfigurationService;
	@Mock
	private BankBranchESRepository bankBranchESRepository;

	private RequestInfo requestInfo = new RequestInfo();
	@Captor
	private ArgumentCaptor<Map<String, Object>> captor;

	@Before
	public void setup() {
		bankBranchRepositoryWithKafka = new BankBranchRepository(bankBranchJdbcRepository, bankBranchQueueRepository,
				financialConfigurationService, bankBranchESRepository, "yes");
		bankBranchRepositoryWithOutKafka = new BankBranchRepository(bankBranchJdbcRepository, bankBranchQueueRepository,
				financialConfigurationService, bankBranchESRepository, "no");

	}

	@Test
	public void testFindById() {
		BankBranchEntity bankBranchEntity = getBankBranchEntity();
		BankBranch expectedResult = bankBranchEntity.toDomain();
		when(bankBranchJdbcRepository.findById(any(BankBranchEntity.class))).thenReturn(bankBranchEntity);
		BankBranch actualResult = bankBranchRepository.findById(getBankBranchDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testSaveWithKafka() {
		List<BankBranch> expectedResult = getBankBranches();
		requestInfo.setAction(Constants.ACTION_CREATE);
		bankBranchRepositoryWithKafka.save(expectedResult, requestInfo);
		verify(bankBranchQueueRepository).add(captor.capture());
	}

	@Test
	public void testSaveWithOutKafka() {
		List<BankBranch> expectedResult = getBankBranches();
		BankBranchEntity entity = new BankBranchEntity().toEntity(expectedResult.get(0));
		when(bankBranchJdbcRepository.create(any(BankBranchEntity.class))).thenReturn(entity);
		bankBranchRepositoryWithOutKafka.save(expectedResult, requestInfo);
		verify(bankBranchQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testSave() {
		BankBranchEntity bankBranchEntity = getBankBranchEntity();
		BankBranch expectedResult = bankBranchEntity.toDomain();
		when(bankBranchJdbcRepository.create(any(BankBranchEntity.class))).thenReturn(bankBranchEntity);
		BankBranch actualResult = bankBranchRepository.save(getBankBranchDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testUpdateWithKafka() {
		List<BankBranch> expectedResult = getBankBranches();
		requestInfo.setAction(Constants.ACTION_CREATE);
		bankBranchRepositoryWithKafka.update(expectedResult, requestInfo);
		verify(bankBranchQueueRepository).add(captor.capture());
	}

	@Test
	public void testUpdateWithOutKafka() {
		List<BankBranch> expectedResult = getBankBranches();
		BankBranchEntity entity = new BankBranchEntity().toEntity(expectedResult.get(0));
		when(bankBranchJdbcRepository.update(any(BankBranchEntity.class))).thenReturn(entity);
		bankBranchRepositoryWithOutKafka.update(expectedResult, requestInfo);
		verify(bankBranchQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testUpdate() {
		BankBranchEntity bankBranchEntity = getBankBranchEntity();
		BankBranch expectedResult = bankBranchEntity.toDomain();
		when(bankBranchJdbcRepository.update(any(BankBranchEntity.class))).thenReturn(bankBranchEntity);
		BankBranch actualResult = bankBranchRepository.update(bankBranchEntity.toDomain());
		assertEquals(expectedResult.getId(), actualResult.getId());
	}

	@Test
	public void testAddToQue() {
		Mockito.doNothing().when(bankBranchQueueRepository).add(Mockito.any());
		BankBranchRequest request = new BankBranchRequest();
		request.setRequestInfo(getRequestInfo());
		request.setBankBranches(new ArrayList<BankBranchContract>());
		request.getBankBranches().add(getBankBranchContract());
		bankBranchRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bankbranch_create", request);
		Mockito.verify(bankBranchQueueRepository).add(message);
	}

	@Test
	public void testAddToQue1() {
		Mockito.doNothing().when(bankBranchQueueRepository).add(Mockito.any());
		BankBranchRequest request = new BankBranchRequest();
		request.setRequestInfo(getRequestInfo());
		request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		request.setBankBranches(new ArrayList<BankBranchContract>());
		request.getBankBranches().add(getBankBranchContract());
		bankBranchRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bankbranch_update", request);
		Mockito.verify(bankBranchQueueRepository).add(message);
	}

	@Test
	public void testAddToSearchQueue() {
		Mockito.lenient().doNothing().when(bankBranchQueueRepository).add(Mockito.any());
		BankBranchRequest request = new BankBranchRequest();
		request.setRequestInfo(getRequestInfo());
		request.setBankBranches(new ArrayList<BankBranchContract>());
		request.getBankBranches().add(getBankBranchContract());
		bankBranchRepository.addToSearchQueue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("bankbranch_persisted", request);
		Mockito.verify(bankBranchQueueRepository).addToSearch(message);
	}

	@Test
	public void testSearch() {
		Pagination<BankBranch> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
		when(bankBranchJdbcRepository.search(any(BankBranchSearch.class))).thenReturn(expectedResult);
		Pagination<BankBranch> actualResult = bankBranchRepository.search(getBankBranchSearch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSearch1() {
		Pagination<BankBranch> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
		when(bankBranchESRepository.search(any(BankBranchSearchContract.class))).thenReturn(expectedResult);
		Pagination<BankBranch> actualResult = bankBranchRepository.search(getBankBranchSearch());
		assertEquals(expectedResult, actualResult);
	}

	private BankBranchContract getBankBranchContract() {
		return BankBranchContract.builder().code("code").name("name").active(true).build();
	}

	private BankBranchEntity getBankBranchEntity() {
		BankBranchEntity entity = new BankBranchEntity();
		BankBranch bankBranch = getBankBranchDomain();
		entity.setId(bankBranch.getId());
		entity.setCode(bankBranch.getCode());
		entity.setName(bankBranch.getName());
		entity.setActive(bankBranch.getActive());
		entity.setDescription(bankBranch.getDescription());
		entity.setTenantId(bankBranch.getTenantId());
		return entity;
	}

	private BankBranch getBankBranchDomain() {
		BankBranch bankBranch = new BankBranch();
		bankBranch.setId("1");
		bankBranch.setCode("code");
		bankBranch.setName("name");
		bankBranch.setActive(true);
		bankBranch.setDescription("description");
		bankBranch.setTenantId("default");
		return bankBranch;
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

	private BankBranchSearch getBankBranchSearch() {
		BankBranchSearch bankBranchSearch = new BankBranchSearch();
		bankBranchSearch.setPageSize(500);
		bankBranchSearch.setOffset(0);
		bankBranchSearch.setSortBy("name desc");
		return bankBranchSearch;
	}

	private List<BankBranch> getBankBranches() {
		List<BankBranch> bankBranches = new ArrayList<BankBranch>();
		BankBranch bankBranch = BankBranch.builder().id("1").name("name").code("code").active(true).build();
		bankBranch.setTenantId("default");
		bankBranches.add(bankBranch);
		return bankBranches;
	}

	private BankBranchSearchContract getBankBranchSearchContract() {
		BankBranchSearchContract bankBranchSearchContract = new BankBranchSearchContract();
		bankBranchSearchContract.setPageSize(0);
		bankBranchSearchContract.setOffset(0);
		bankBranchSearchContract.setSortBy("name desc");
		return bankBranchSearchContract;
	}
}