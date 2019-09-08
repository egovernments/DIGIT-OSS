package org.egov.demand.repository;

import org.egov.demand.TestConfiguration;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.BillSearchCriteria;
import org.egov.demand.repository.querybuilder.BillQueryBuilder;
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
@WebMvcTest(BillQueryBuilder.class)
@Import(TestConfiguration.class)
@ActiveProfiles("test")
public class BillQueryBuilderTest {

	@InjectMocks
	private BillQueryBuilder billQueryBuilder;
	
	@MockBean
	private ApplicationProperties applicationProperties;
	
	@Before
	public void initMocks() {
		MockitoAnnotations.initMocks(this);
	}

	private String billSearchquery = "SELECT b.id AS b_id, b.tenantid AS b_tenantid, b.payeename AS b_payeename,"
			+ " b.payeeaddress AS b_payeeaddress, b.payeeemail AS b_payeeemail, b.isactive AS b_isactive,"
			+ " b.iscancelled AS b_iscancelled, b.createdby AS b_createdby, b.createddate AS b_createddate,"
			+ " b.lastmodifiedby AS b_lastmodifiedby, b.lastmodifieddate AS b_lastmodifieddate,"
			+ " bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS bd_tenantid, bd.businessservice AS bd_businessservice,"
			+ " bd.billno AS bd_billno, bd.billdate AS bd_billdate, bd.consumercode AS bd_consumercode,bd.consumertype AS bd_consumertype,"
			+ " bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage,"
			+ " bd.minimumamount AS bd_minimumamount, bd.totalamount AS bd_totalamount,"
			+ " bd.callbackforapportioning AS bd_callbackforapportioning, bd.partpaymentallowed AS bd_partpaymentallowed,"
			+ " bd.collectionmodesnotallowed AS bd_collectionmodesnotallowed,"
			+ " ad.id AS ad_id, ad.tenantid AS ad_tenantid, ad.billdetail AS ad_billdetail, ad.glcode AS ad_glcode,"
			+ " ad.orderno AS ad_orderno, ad.accountdescription AS ad_accountdescription, ad.creditamount AS ad_creditamount,"
			+ " ad.debitamount AS ad_debitamount, ad.isactualdemand AS ad_isactualdemand, ad.purpose AS ad_purpose,"
			+ " ad.cramounttobepaid AS ad_cramounttobepaid"
			+ " FROM egbs_bill b"
			+ " LEFT OUTER JOIN egbs_billdetail bd ON b.id = bd.billid AND b.tenantid = bd.tenantid"
			+ " LEFT OUTER JOIN egbs_billaccountdetail ad ON bd.id = ad.billdetail AND bd.tenantid = ad.tenantid"
			+ " WHERE b.tenantid = ? ORDER BY b.payeename LIMIT ? OFFSET ?";
	
	@Test
	public void testGetQuery() {
		List<Object> preparedStatementValues = new ArrayList<>();
		BillSearchCriteria billSearchCriteriaQuery = BillSearchCriteria.builder().tenantId("ap.kurnool").build();
		
		Mockito.doReturn("500").when(applicationProperties).commonsSearchPageSizeDefault();
		
		assertEquals(billSearchquery,
				billQueryBuilder.getBillQuery(billSearchCriteriaQuery, preparedStatementValues));

		List<Object> expectedPreparedStatementValues = new ArrayList<>();
		expectedPreparedStatementValues.add("ap.kurnool");
		expectedPreparedStatementValues.add(Long.valueOf("500"));
		expectedPreparedStatementValues.add(Long.valueOf("0"));
		assertTrue(preparedStatementValues.equals(expectedPreparedStatementValues));
	}

}
