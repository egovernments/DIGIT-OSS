package org.egov.demand.repository;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.model.enums.Category;
import org.egov.demand.repository.querybuilder.TaxHeadMasterQueryBuilder;
import org.egov.demand.repository.rowmapper.TaxHeadMasterRowMapper;
import org.egov.demand.web.contract.TaxHeadMasterRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import com.fasterxml.jackson.databind.ObjectMapper;
@RunWith(SpringRunner.class)
public class TaxHeadMasterRepositoryTest {

	@Mock
	private JdbcTemplate jdbcTemplate;
	
	@Mock
	private TaxHeadMasterQueryBuilder taxHeadMasterQueryBuilder;
	
	@InjectMocks
	private TaxHeadMasterRepository taxHeadMasterRepository;
	
	@Mock
	private ObjectMapper objectMapper;
	
	@Test
	public void testFindForCriteria() {
		List<TaxHeadMaster> taxHeadMaster = new ArrayList<>();
		taxHeadMaster.add(getTaxHeadMaster());
		String query ="";
		when(taxHeadMasterQueryBuilder.getQuery(new TaxHeadMasterCriteria(),new ArrayList<>())).thenReturn(query);
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(TaxHeadMasterRowMapper.class))).thenReturn(taxHeadMaster);

		assertTrue(taxHeadMaster.equals(taxHeadMasterRepository.findForCriteria(new TaxHeadMasterCriteria())));
	}
	
	
	@Test
	public void testCreateTaxHeadMaster() {
		
		TaxHeadMasterRequest taxHeadMasterRequest = new TaxHeadMasterRequest();
		RequestInfo requestInfo = new RequestInfo();
		User user = new User();
		user.setId(1l);
		requestInfo.setUserInfo(user);
		taxHeadMasterRequest.setRequestInfo(requestInfo);
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		List<TaxHeadMaster> taxHeads = new ArrayList<>();
		taxHeads.add(taxHeadMaster);
		taxHeadMasterRequest.setTaxHeadMasters(taxHeads);
		
		when(jdbcTemplate.batchUpdate(any(String.class),any(List.class))).thenReturn(new int[] { 1 });
		assertTrue(taxHeads.equals(taxHeadMasterRepository.create(taxHeadMasterRequest)));
	}
	
	@Test
	public void testUpdateTaxHeadMaster() {
		
		TaxHeadMasterRequest taxHeadMasterRequest = new TaxHeadMasterRequest();
		RequestInfo requestInfo = new RequestInfo();
		User user = new User();
		user.setId(1l);
		requestInfo.setUserInfo(user);
		taxHeadMasterRequest.setRequestInfo(requestInfo);
		TaxHeadMaster taxHeadMaster = getTaxHeadMaster();
		List<TaxHeadMaster> taxHeads = new ArrayList<>();
		taxHeads.add(taxHeadMaster);
		taxHeadMasterRequest.setTaxHeadMasters(taxHeads);
		
		when(jdbcTemplate.batchUpdate(any(String.class),any(List.class))).thenReturn(new int[] { 1 });
		assertTrue(taxHeads.equals(taxHeadMasterRepository.update(taxHeadMasterRequest)));
	}
	
	
	private TaxHeadMaster getTaxHeadMaster() {
		TaxHeadMaster taxHeadMaster = new TaxHeadMaster();
		TaxPeriod taxPeriod = new TaxPeriod();
		taxHeadMaster.setId("23");
		taxHeadMaster.setCode("string");
		taxHeadMaster.setTenantId("ap.kurnool");
		taxHeadMaster.setCategory(Category.fromValue("TAX"));
		taxHeadMaster.setService("string");
		taxHeadMaster.setName("string");
		taxHeadMaster.setIsDebit(true);
		taxHeadMaster.setIsActualDemand(true);
		taxHeadMaster.setValidFrom(324l);
		taxHeadMaster.setValidTill(23l);
		taxHeadMaster.setOrder(12);

		return taxHeadMaster;
	}

}
