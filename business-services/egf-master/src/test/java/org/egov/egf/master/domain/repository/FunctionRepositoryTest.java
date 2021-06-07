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
import org.egov.egf.master.domain.model.Function;
import org.egov.egf.master.domain.model.FunctionSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.FunctionEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FunctionJdbcRepository;
import org.egov.egf.master.web.contract.FunctionContract;
import org.egov.egf.master.web.contract.FunctionSearchContract;
import org.egov.egf.master.web.requests.FunctionRequest;
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
public class FunctionRepositoryTest {

	private FunctionRepository functionRepositoryWithKafka;
	private FunctionRepository functionRepositoryWithOutKafka;

	@InjectMocks
	private FunctionRepository functionRepository;

	@Mock
	private FunctionJdbcRepository functionJdbcRepository;

	@Mock
	private MastersQueueRepository functionQueueRepository;

	@Mock
	private FinancialConfigurationService financialConfigurationService;

	@Mock
	private FunctionESRepository functionESRepository;

	@Captor
	private ArgumentCaptor<Map<String, Object>> captor;

	private RequestInfo requestInfo = new RequestInfo();

	@Before
	public void setup() {
		functionRepositoryWithKafka = new FunctionRepository(functionJdbcRepository, functionQueueRepository,
				financialConfigurationService, functionESRepository, "yes");
		functionRepositoryWithOutKafka = new FunctionRepository(functionJdbcRepository, functionQueueRepository,
				financialConfigurationService, functionESRepository, "no");

	}

	@Test
	public void testFindById() {
		FunctionEntity functionEntity = getFunctionEntity();
		Function expectedResult = functionEntity.toDomain();
		when(functionJdbcRepository.findById(any(FunctionEntity.class))).thenReturn(functionEntity);
		Function actualResult = functionRepository.findById(getFunctionDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSave() {
		List<Function> expectedResult = getFunctions();
		requestInfo.setAction(Constants.ACTION_CREATE);
		functionRepositoryWithKafka.save(expectedResult, requestInfo);
		verify(functionQueueRepository).add(captor.capture());
	}

	@Test
	public void testSave1() {
		List<Function> expectedResult = getFunctions();
		FunctionEntity entity = new FunctionEntity().toEntity(expectedResult.get(0));
		when(functionJdbcRepository.create(any(FunctionEntity.class))).thenReturn(entity);
		functionRepositoryWithOutKafka.save(expectedResult, requestInfo);
		verify(functionQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testSavee() {
		FunctionEntity functionEntity = getFunctionEntity();
		Function expectedResult = functionEntity.toDomain();
		when(functionJdbcRepository.create(any(FunctionEntity.class))).thenReturn(functionEntity);
		Function actualResult = functionRepository.save(getFunctionDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testUpdate() {
		List<Function> expectedResult = getFunctions();
		requestInfo.setAction(Constants.ACTION_CREATE);
		functionRepositoryWithKafka.update(expectedResult, requestInfo);
		verify(functionQueueRepository).add(captor.capture());
	}

	@Test
	public void testUpdate1() {
		List<Function> expectedResult = getFunctions();
		FunctionEntity entity = new FunctionEntity().toEntity(expectedResult.get(0));
		when(functionJdbcRepository.update(any(FunctionEntity.class))).thenReturn(entity);
		functionRepositoryWithOutKafka.update(expectedResult, requestInfo);
		verify(functionQueueRepository).addToSearch(any(Map.class));
	}

	@Test
	public void testUpdatee() {
		FunctionEntity functionEntity = getFunctionEntity();
		Function expectedResult = functionEntity.toDomain();
		when(functionJdbcRepository.update(any(FunctionEntity.class))).thenReturn(functionEntity);
		Function actualResult = functionRepository.update(getFunctionDomain());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testAddToQue() {
		Mockito.doNothing().when(functionQueueRepository).add(Mockito.any());
		FunctionRequest request = new FunctionRequest();
		request.setRequestInfo(getRequestInfo());
		request.setFunctions(new ArrayList<FunctionContract>());
		request.getFunctions().add(getFunctionContract());
		functionRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("function_create", request);
		Mockito.verify(functionQueueRepository).add(message);
	}

	@Test
	public void testAddToQue1() {
		Mockito.doNothing().when(functionQueueRepository).add(Mockito.any());
		FunctionRequest request = new FunctionRequest();
		request.setRequestInfo(getRequestInfo());
		request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
		request.setFunctions(new ArrayList<FunctionContract>());
		request.getFunctions().add(getFunctionContract());
		functionRepository.addToQue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("function_update", request);
		Mockito.verify(functionQueueRepository).add(message);
	}

	@Test
	public void testAddToSearchQueue() {
		Mockito.lenient().doNothing().when(functionQueueRepository).add(Mockito.any());
		FunctionRequest request = new FunctionRequest();
		request.setRequestInfo(getRequestInfo());
		request.setFunctions(new ArrayList<FunctionContract>());
		request.getFunctions().add(getFunctionContract());
		functionRepository.addToSearchQueue(request);
		Map<String, Object> message = new HashMap<>();
		message.put("function_persisted", request);
		Mockito.verify(functionQueueRepository).addToSearch(message);
	}

	@Test
	public void testSearch() {
		Pagination<Function> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
		when(functionJdbcRepository.search(any(FunctionSearch.class))).thenReturn(expectedResult);
		Pagination<Function> actualResult = functionRepository.search(getFunctionSearch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public void testSearch1() {
		Pagination<Function> expectedResult = new Pagination<>();
		expectedResult.setPageSize(500);
		expectedResult.setOffset(0);
		when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
		when(functionESRepository.search(any(FunctionSearchContract.class))).thenReturn(expectedResult);
		Pagination<Function> actualResult = functionRepository.search(getFunctionSearch());
		assertEquals(expectedResult, actualResult);
	}

	private FunctionContract getFunctionContract() {
		return FunctionContract.builder().code("code").name("name").active(true).level(1).build();
	}

	private FunctionEntity getFunctionEntity() {
		FunctionEntity entity = new FunctionEntity();
		Function function = getFunctionDomain();
		entity.setCode(function.getCode());
		entity.setName(function.getName());
		entity.setActive(function.getActive());
		entity.setLevel(function.getLevel());
		entity.setTenantId(function.getTenantId());
		return entity;
	}

	private Function getFunctionDomain() {
		Function function = new Function();
		function.setId("1");
		function.setCode("code");
		function.setName("name");
		function.setActive(true);
		function.setLevel(1);
		function.setTenantId("default");
		return function;
	}

	public List<Function> getFunctionDomains() {
		List<Function> functions = new ArrayList<>();
		functions.add(getFunctionDomain());
		return functions;
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

	private FunctionSearch getFunctionSearch() {
		FunctionSearch functionSearch = new FunctionSearch();
		functionSearch.setPageSize(500);
		functionSearch.setOffset(0);
		functionSearch.setSortBy("name desc");
		return functionSearch;
	}

	private List<Function> getFunctions() {
		List<Function> functions = new ArrayList<Function>();
		Function function = Function.builder().id("1").name("name").code("code").level(1).active(true).build();
		function.setTenantId("default");
		functions.add(function);
		return functions;
	}

	private FunctionSearchContract getFunctionSearchContract() {
		FunctionSearchContract functionSearchContract = new FunctionSearchContract();
		functionSearchContract.setPageSize(0);
		functionSearchContract.setOffset(0);
		functionSearchContract.setSortBy("name desc");
		return functionSearchContract;
	}
}
