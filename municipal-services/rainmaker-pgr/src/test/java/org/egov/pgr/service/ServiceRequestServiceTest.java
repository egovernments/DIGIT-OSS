package org.egov.pgr.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;


@RunWith(MockitoJUnitRunner.class)
public class ServiceRequestServiceTest {
	
	@Test
	public void test() {
		
	}
	
	
	/*
	
	@Mock
	private ServiceRequestRepository serviceRequestRepository;
	
	@Mock
	private LogAwareKafkaTemplate< String, Object> kafkaProducer;
	
    @Mock
	private PGRProducer pGRProducer;
	
	@Mock
	private ResponseInfoFactory factory;
	
	@Mock
	private PGRUtils pGRUtils;

	@Mock
	private IdGenRepo idGenRepo;
	
	private String saveTopic = "save-pgr-servicereq";

	private String updateTopic = "update-pgr-servicereq";
	
	private String tenantId = "default";
	
	@InjectMocks
	private ServiceRequestService service;
	
	@Before
	public void before() {
		
		ReflectionTestUtils.setField(service, "saveTopic", "save-pgr-servicereq");
		ReflectionTestUtils.setField(service, "updateTopic", "update-pgr-servicereq");
	}
	
	@Test
	public void createShouldSucceed() {
	
		ServiceReqRequest serviceReqRequest = getServiceReqRequest();
		RequestInfo requestInfo = serviceReqRequest.getRequestInfo();
		ServiceReqResponse serviceReqResponse = getServiceReqResponseForCreate();
		ResponseInfo responseInfo = serviceReqResponse.getResponseInfo();
		
		Boolean boolVal =  true;
		
		int longVal = serviceReqRequest.getServiceReq().size();
		
		
		Mockito.when(idGenRepo.getId(requestInfo, tenantId, longVal, PGRConstants.SERV_REQ_ID_NAME,
				PGRConstants.SERV_REQ_ID_FORMAT)).thenReturn(getIdGenResponse());
		Mockito.when(factory.createResponseInfoFromRequestInfo(requestInfo, boolVal)).thenReturn(responseInfo);
		Mockito.doNothing().when(pGRProducer).push(saveTopic, serviceReqRequest);

		assertTrue(serviceReqResponse.equals(service.create(serviceReqRequest)));
	}
	
	@Test
	public void updateShouldSucceed() {
	
		ServiceReqRequest serviceReqRequest = getServiceReqRequest();
		RequestInfo requestInfo = serviceReqRequest.getRequestInfo();
		ServiceReqResponse serviceReqResponse = getServiceReqResponseForUpdate();
		ResponseInfo responseInfo = serviceReqResponse.getResponseInfo();
		
		Boolean boolVal =  true;
		
		Mockito.when(factory.createResponseInfoFromRequestInfo(requestInfo, boolVal)).thenReturn(responseInfo);
		Mockito.doNothing().when(pGRProducer).push(updateTopic, serviceReqRequest);
		
		assertTrue(serviceReqResponse.equals(service.update(serviceReqRequest)));
	}
	
	private ServiceReqRequest getServiceReqRequest() {

		List<ServiceReq> reqs = new ArrayList<>();
		List<Role> roles = new ArrayList<>();
		roles.add(Role.builder().name("roleName").id(1l).build());
		reqs.add(ServiceReq.builder().tenantId(tenantId).build());
		return ServiceReqRequest.builder().serviceReq(reqs)
				.requestInfo(RequestInfo.builder().userInfo(User.builder().id(1l).roles(roles).build()).build())
				.build();
	}
	
	private ServiceReqResponse getServiceReqResponseForCreate() {
		
		List<ServiceReq> reqs = new ArrayList<>();
		reqs.add(ServiceReq.builder().tenantId(tenantId).serviceRequestId(getId()).build());
		return ServiceReqResponse.builder().serviceReq(reqs).responseInfo(ResponseInfo.builder().resMsgId("uief87324").build()).build();
	}
	
	private ServiceReqResponse getServiceReqResponseForUpdate() {
		
		List<ServiceReq> reqs = new ArrayList<>();
		reqs.add(ServiceReq.builder().tenantId(tenantId).build());
		return ServiceReqResponse.builder().serviceReq(reqs).responseInfo(ResponseInfo.builder().resMsgId("uief87324").build()).build();
	}
	
	private String getId(){
		
		return "id1";
	}
	
	private IdGenerationResponse getIdGenResponse() {

		List<IdResponse> idResponses = new ArrayList<>();
		IdResponse idResponse = new IdResponse();
		idResponse.setId(getId());
		idResponses.add(idResponse);
		return IdGenerationResponse.builder().idResponses(idResponses).build();
	}
	
	@Test
	public void testGetServiceRequestsSuccess() {
		Object response = null;
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = new ServiceReqSearchCriteria();
		serviceReqSearchCriteria.setGroup("group");
		serviceReqSearchCriteria.setTenantId("tenantId");		
		ServiceReqResponse serviceReqResponse = new ServiceReqResponse();
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(pGRUtils.prepareSearchRequest(null, serviceReqSearchCriteria, requestInfo)).thenReturn(searcherRequest);
		StringBuilder uri = new StringBuilder();
		uri.append("http://localhost:8093/infra-search/rainmaker-pgr/serviceRequestSearch/_get");
		Mockito.when(serviceRequestRepository.fetchResult(uri, searcherRequest))
		.thenReturn(serviceReqResponse);
		response = service.getServiceRequests(requestInfo, serviceReqSearchCriteria);
		
		assertNotNull(response);
		
		
	}
	
	@Test
	public void testGetServiceRequestsFailure() {
		ObjectMapper mapper = new ObjectMapper();
		Object response = new Object();
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = new ServiceReqSearchCriteria();
		serviceReqSearchCriteria.setGroup("group");
		serviceReqSearchCriteria.setTenantId("tenantId");
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(pGRUtils.prepareSearchRequest(null, serviceReqSearchCriteria, requestInfo)).thenReturn(searcherRequest);
		StringBuilder uri = new StringBuilder();
		uri.append("http://localhost:8093/infra-search/rainmaker-pgr/serviceRequestSearch/_get");
		Mockito.when(serviceRequestRepository.fetchResult(uri, searcherRequest))
		.thenReturn(null);
		
		response = service.getServiceRequests(requestInfo, serviceReqSearchCriteria);
		ServiceReqResponse serviceReqResponse = mapper.convertValue(response, ServiceReqResponse.class);

		assertTrue(serviceReqResponse.getServiceReq().isEmpty());
		
		
	}
	
	@Test(expected = Exception.class)
	public void testGetServiceRequestsException() {
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = new ServiceReqSearchCriteria();
		serviceReqSearchCriteria.setGroup("group");
		serviceReqSearchCriteria.setTenantId("tenantId");
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(service.fetchServiceCodes(requestInfo, "tenantId", "group")).thenReturn(new Object());
		Mockito.when(pGRUtils.prepareSearchRequest(Matchers.any(StringBuilder.class), 
				Matchers.any(ServiceReqSearchCriteria.class), Matchers.any(RequestInfo.class))).thenReturn(searcherRequest);
		Mockito.when(serviceRequestRepository.fetchResult(Matchers.any(StringBuilder.class), Matchers.any(SearcherRequest.class)))
		.thenThrow(Exception.class);
		
		service.getServiceRequests(requestInfo, serviceReqSearchCriteria);
				
	}
	
	@Test
	public void testGetCountSuccess() {
		Map<String, Double> innerMap= new HashMap<>();
		innerMap.put("count", 1D);
		Map<String, List<Object>> map = new HashMap<>();
		List<Object> list = new ArrayList<>();
		list.add(innerMap);
		map.put("count", list);
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = Mockito.mock(ServiceReqSearchCriteria.class);
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(pGRUtils.prepareSearchRequest(null, serviceReqSearchCriteria, requestInfo)).thenReturn(searcherRequest);
		StringBuilder uri = new StringBuilder();
		uri.append("http://localhost:8093/infra-search/rainmaker-pgr/count/_get");
		Mockito.when(serviceRequestRepository.fetchResult(uri, searcherRequest))
		.thenReturn(map);
		
		Object res = service.getCount(requestInfo, serviceReqSearchCriteria);
		
		assertNotNull(res);
		
		
	}
	
	@Test
	public void testGetCountFailure() {
		ObjectMapper mapper = new ObjectMapper();
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = Mockito.mock(ServiceReqSearchCriteria.class);
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(pGRUtils.prepareSearchRequest(null, serviceReqSearchCriteria, requestInfo)).thenReturn(searcherRequest);
		StringBuilder uri = new StringBuilder();
		uri.append("http://localhost:8093/infra-search/rainmaker-pgr/count/_get");
		Mockito.when(serviceRequestRepository.fetchResult(uri, searcherRequest))
		.thenReturn(null);
		Object res = service.getCount(requestInfo, serviceReqSearchCriteria);
		CountResponse response = mapper.convertValue(res, CountResponse.class);

		assertTrue(response.getCount() == 0D);
		
		
	}
	
	@Test(expected = Exception.class)
	public void testGetCountException() {
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = Mockito.mock(ServiceReqSearchCriteria.class);
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(pGRUtils.prepareSearchRequest(null, serviceReqSearchCriteria, requestInfo)).thenReturn(searcherRequest);
		Mockito.when(serviceRequestRepository.fetchResult(Matchers.any(StringBuilder.class), Matchers.any(SearcherRequest.class)))
		.thenReturn(Exception.class);
		
		service.getCount(requestInfo, serviceReqSearchCriteria);
		
				
	}
	
	@Test
	public void testGetHistorySuccess() {
		Object response = null;
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = new ServiceReqSearchCriteria();
		serviceReqSearchCriteria.setGroup("group");
		serviceReqSearchCriteria.setTenantId("tenantId");		
		ServiceReqResponse serviceReqResponse = new ServiceReqResponse();
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(pGRUtils.prepareHistoryRequest(null, serviceReqSearchCriteria, requestInfo)).thenReturn(searcherRequest);
		StringBuilder uri = new StringBuilder();
		uri.append("http://localhost:8093/infra-search/rainmaker-pgr/history/_get");
		Mockito.when(serviceRequestRepository.fetchResult(uri, searcherRequest))
		.thenReturn(serviceReqResponse);
		response = service.getHistory(requestInfo, serviceReqSearchCriteria);
		
		assertNotNull(response);
		
		
	}
	
	@Test
	public void testGetHistoryFailure() {
		ObjectMapper mapper = new ObjectMapper();
		Object response = new Object();
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = new ServiceReqSearchCriteria();
		serviceReqSearchCriteria.setGroup("group");
		serviceReqSearchCriteria.setTenantId("tenantId");
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(pGRUtils.prepareHistoryRequest(null, serviceReqSearchCriteria, requestInfo)).thenReturn(searcherRequest);
		StringBuilder uri = new StringBuilder();
		uri.append("http://localhost:8093/infra-search/rainmaker-pgr/history/_get");
		Mockito.when(serviceRequestRepository.fetchResult(uri, searcherRequest))
		.thenReturn(null);
		
		response = service.getServiceRequests(requestInfo, serviceReqSearchCriteria);
		ServiceReqResponse serviceReqResponse = mapper.convertValue(response, ServiceReqResponse.class);

		assertTrue(serviceReqResponse.getServiceReq().isEmpty());
		
		
	}
	
	@Test(expected = Exception.class)
	public void testGetHistoryException() {
		RequestInfo requestInfo = Mockito.mock(RequestInfo.class);
		ServiceReqSearchCriteria serviceReqSearchCriteria = new ServiceReqSearchCriteria();
		serviceReqSearchCriteria.setGroup("group");
		serviceReqSearchCriteria.setTenantId("tenantId");
		SearcherRequest searcherRequest = new SearcherRequest();
		Mockito.when(service.fetchServiceCodes(requestInfo, "tenantId", "group")).thenReturn(new Object());
		Mockito.when(pGRUtils.prepareHistoryRequest(Matchers.any(StringBuilder.class), 
				Matchers.any(ServiceReqSearchCriteria.class), Matchers.any(RequestInfo.class))).thenReturn(searcherRequest);
		Mockito.when(serviceRequestRepository.fetchResult(Matchers.any(StringBuilder.class), Matchers.any(SearcherRequest.class)))
		.thenThrow(Exception.class);
		
		service.getServiceRequests(requestInfo, serviceReqSearchCriteria);
				
	}

*/}
