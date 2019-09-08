package org.egov.demand.repository;

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.demand.model.GlCodeMaster;
import org.egov.demand.model.GlCodeMasterCriteria;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.repository.querybuilder.GlCodeMasterQueryBuilder;
import org.egov.demand.repository.rowmapper.GlCodeMasterRowMapper;
import org.egov.demand.web.contract.GlCodeMasterRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class GlCodeMasterRepositoryTest {

	@Mock
	private JdbcTemplate jdbcTemplate;
	
	@InjectMocks
	private GlCodeMasterRepository glCodeMasterRepository;
	
	@Mock
	private GlCodeMasterQueryBuilder glCodeMasterQueryBuilder;
	@Mock
	private GlCodeMasterRowMapper glCodeMasterRowMapper;
	
	@Test
	public void testFindForCriteria() {
		List<GlCodeMaster> glCodeMaster = new ArrayList<>();
		glCodeMaster.add(getGlCodeMaster());
		String query ="";
		when(glCodeMasterQueryBuilder.getQuery(new GlCodeMasterCriteria(),new ArrayList<>())).thenReturn(query);
		when(jdbcTemplate.query(any(String.class), any(Object[].class), any(GlCodeMasterRowMapper.class))).thenReturn(glCodeMaster);

		assertTrue(glCodeMaster.equals(glCodeMasterRepository.findForCriteria(new GlCodeMasterCriteria())));
	}
	
	/*@Test
	public void testCreateGlCodeMaster() {
		
		GlCodeMasterRequest glCodeMasterRequest = new GlCodeMasterRequest();
		RequestInfo requestInfo = new RequestInfo();
		User user = new User();
		user.setId(1l);
		requestInfo.setUserInfo(user);
		glCodeMasterRequest.setRequestInfo(requestInfo);
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		List<GlCodeMaster> glCodes = new ArrayList<>();
		glCodes.add(glCodeMaster);
		glCodeMasterRequest.setGlCodeMasters(glCodes);
		
		when(jdbcTemplate.batchUpdate(any(String.class),any(List.class))).thenReturn(new int[] {1});
		assertTrue(glCodes.equals(glCodeMasterRepository.create(glCodeMasterRequest)));
	}
	
	@Test
	public void testUpdateGlCodeMaster() {
		
		GlCodeMasterRequest glCodeMasterRequest = new GlCodeMasterRequest();
		RequestInfo requestInfo = new RequestInfo();
		glCodeMasterRequest.setRequestInfo(requestInfo);
		GlCodeMaster glCodeMaster = getGlCodeMaster();
		List<GlCodeMaster> glCodes = new ArrayList<>();
		glCodes.add(glCodeMaster);
		glCodeMasterRequest.setGlCodeMasters(glCodes);
		
		when(jdbcTemplate.batchUpdate(any(String.class),any(List.class))).thenReturn(new int[]{1});
		assertTrue(glCodes.equals(glCodeMasterRepository.update(glCodeMasterRequest)));
	}*/
	
	private GlCodeMaster getGlCodeMaster(){
		GlCodeMaster glCodeMaster=new GlCodeMaster();
		
		glCodeMaster.setId("12");
		glCodeMaster.setService("string");
		glCodeMaster.setTaxHead("string");
		glCodeMaster.setTenantId("ap.kurnool");
		glCodeMaster.setGlCode("string");
		glCodeMaster.setFromDate(0l);
		glCodeMaster.setToDate(0l);
		
		return glCodeMaster;
	}
}
