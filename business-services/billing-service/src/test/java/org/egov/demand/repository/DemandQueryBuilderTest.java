package org.egov.demand.repository;

import org.egov.demand.TestConfiguration;
import org.egov.demand.model.DemandDetailCriteria;
import org.egov.demand.model.DemandUpdateMisRequest;
import org.egov.demand.repository.querybuilder.DemandQueryBuilder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@WebMvcTest(DemandQueryBuilder.class)
@Import(TestConfiguration.class)
@ActiveProfiles("test")
public class DemandQueryBuilderTest {

	@InjectMocks
	private DemandQueryBuilder demandQueryBuilder;
	
	
//	@Test
//	public void testShouldGetDemandQuery() {
//		List<Object> preparedStatementValues = new ArrayList<>();
//		DemandCriteria demandCriteria=DemandCriteria.builder().tenantId("ap.kurnool").build();
//		String query = "SELECT demand.id AS did,demand.consumercode AS dconsumercode,"
//				+ "demand.consumertype AS dconsumertype,demand.businessservice AS dbusinessservice,"
//				+ "demand.owner AS downer,demand.taxperiodfrom AS dtaxperiodfrom,demand.taxperiodto"
//				+ " AS dtaxperiodto,demand.minimumamountpayable AS dminimumamountpayable,"
//				+ "demand.createdby AS dcreatedby,demand.lastmodifiedby AS dlastmodifiedby,"
//				+ "demand.createdtime AS dcreatedtime,demand.lastmodifiedtime AS dlastmodifiedtime"
//				+ ",demand.tenantid AS dtenantid,demanddetail.id AS dlid,"
//				+ "demanddetail.demandid AS dldemandid,demanddetail.taxheadcode AS dltaxheadcode,"
//				+ "demanddetail.taxamount AS dltaxamount,demanddetail.collectionamount AS "
//				+ "dlcollectionamount,demanddetail.createdby AS dlcreatedby,demanddetail."
//				+ "lastModifiedby AS dllastModifiedby,demanddetail.createdtime AS dlcreatedtime,"
//				+ "demanddetail.lastModifiedtime AS dllastModifiedtime,demanddetail.tenantid AS "
//				+ "dltenantid FROM egbs_demand demand INNER JOIN egbs_demanddetail demanddetail "
//				+ "ON demand.id=demanddetail.demandid AND demand.tenantid=demanddetail.tenantid "
//				+ "WHERE demand.tenantid=? ORDER BY demand.taxperiodfrom LIMIT ? OFFSET ?";
//		
//		assertEquals(query,
//				demandQueryBuilder.getDemandQuery(demandCriteria, new HashSet<>(),preparedStatementValues));
//		
//		List<Object> expectedPreparedStatementValues = new ArrayList<>();
//		expectedPreparedStatementValues.add("ap.kurnool");
//		expectedPreparedStatementValues.add(500);
//		expectedPreparedStatementValues.add(0);
//		assertTrue(preparedStatementValues.equals(expectedPreparedStatementValues));
//	}
	
	@Test
	public void testShouldGetDemandDetailQuery(){
		List<Object> preparedStatementValues = new ArrayList<>();
		DemandDetailCriteria demandDetailCriteria=new DemandDetailCriteria();
		demandDetailCriteria.setTenantId("ap.kurnool");
		String query="SELECT demanddetail.id AS dlid,demanddetail.demandid AS dldemandid,"
				+ "demanddetail.taxheadcode AS dltaxheadcode,demanddetail.taxamount AS dltaxamount"
				+ ",demanddetail.collectionamount AS dlcollectionamount,demanddetail.createdby AS "
				+ "dlcreatedby,demanddetail.lastModifiedby AS dllastModifiedby,"
				+ "demanddetail.createdtime AS dlcreatedtime,demanddetail.lastModifiedtime "
				+ "AS dllastModifiedtime,demanddetail.tenantid AS dltenantid  FROM egbs_demanddetail"
				+ " demanddetail INNER JOIN egbs_demand demand ON demanddetail.demandid=demand.id "
				+ "AND demanddetail.tenantid=demand.tenantid WHERE demanddetail.tenantid=? "
				+ "ORDER BY demanddetail.id LIMIT ? OFFSET ?";
		
		assertEquals(query,demandQueryBuilder.getDemandDetailQuery(demandDetailCriteria, preparedStatementValues));
		
		List<Object> expectedPreparedStatementValues = new ArrayList<>();
		expectedPreparedStatementValues.add("ap.kurnool");
		expectedPreparedStatementValues.add(500);
		expectedPreparedStatementValues.add(0);
		assertTrue(preparedStatementValues.equals(expectedPreparedStatementValues));
	}
	
	@Test
	public void testShoudgetDemandUpdateMisQuery(){
		Set<String> ids=new HashSet<>();
		ids.add("121");
		DemandUpdateMisRequest demandRequest=DemandUpdateMisRequest.builder().tenantId("default").consumerCode("consumerCode").id(ids).build();
		String query="UPDATE egbs_demand SET consumercode=?, lastmodifiedby=?, lastmodifiedtime=?  WHERE tenantid=? AND id IN ('121')";
		
		assertEquals(query,demandQueryBuilder.getDemandUpdateMisQuery(demandRequest));
	}

}
