package org.egov.demand.repository;

import org.egov.demand.TestConfiguration;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.GlCodeMasterCriteria;
import org.egov.demand.repository.querybuilder.GlCodeMasterQueryBuilder;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@WebMvcTest(GlCodeMasterQueryBuilder.class)
@Import(TestConfiguration.class)
@ActiveProfiles("test")
public class GlCodeMasterQueryBuilderTest {

	@InjectMocks
	private GlCodeMasterQueryBuilder glCodeMasterQueryBuilder;
	
	@MockBean
	private ApplicationProperties applicationProperties;
	
	@Before
	public void initMocks() {
		MockitoAnnotations.initMocks(this);
	}
	
	@Test
	public void getQueryTest() {
		List<Object> preparedStatementValues = new ArrayList<>();
		GlCodeMasterCriteria glCodeMasterCriteriaQuery = GlCodeMasterCriteria.builder().tenantId("ap.kurnool").build();
		Mockito.doReturn("500").when(applicationProperties).commonsSearchPageSizeDefault();
		String queryWithTenantId = "select * from egbs_glcodemaster WHERE tenantId = ?  ORDER BY fromdate LIMIT ? OFFSET ?";
		
		assertEquals(queryWithTenantId,
				glCodeMasterQueryBuilder.getQuery(glCodeMasterCriteriaQuery, preparedStatementValues));

		List<Object> expectedPreparedStatementValues = new ArrayList<>();
		expectedPreparedStatementValues.add("ap.kurnool");
		expectedPreparedStatementValues.add(Long.valueOf("500"));
		expectedPreparedStatementValues.add(Long.valueOf("0"));
		assertTrue(preparedStatementValues.equals(expectedPreparedStatementValues));
	}
}
