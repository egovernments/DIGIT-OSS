package org.egov.commons.persistence.repository.builder;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;

import org.egov.commons.model.BusinessDetailsCriteria;
import org.egov.commons.repository.builder.BusinessDetailsQueryBuilder;
import org.junit.Ignore;
import org.junit.Test;

public class BusinessDetailsQueryBuilderTest {

	@Test
    @Ignore
	public void no_input_test() {
		BusinessDetailsCriteria detailsCriteria = new BusinessDetailsCriteria();

		BusinessDetailsQueryBuilder builder = new BusinessDetailsQueryBuilder();
		assertEquals("Select bd.id as bd_id,bd.name as bd_name,bd.businessurl as bd_url,"
				+ "bd.isenabled as bd_enabled,bd.code as bd_code,bd.businesstype as bd_type,"
				+ "bd.fund as bd_fund,bd.function as bd_function,bd.fundsource as bd_fundsource,"
				+ "bd.functionary as bd_functionary,bd.department as bd_department,bd.callbackforapportioning as bd_callback,"
				+ "bd.vouchercreation as bd_vouc_creation,bd.businesscategory as bd_category,"
				+ "bd.isvoucherapproved as bd_is_Vou_approved,bd.vouchercutoffdate as bd_vou_cutoffdate,"
				+ "bd.ordernumber as bd_ordernumber,bd.tenantid as bd_tenant,bd.createdby as bd_createdby,"
				+ "bd.createddate as bd_createddate,bd.lastmodifiedby as bd_lastmodifiedby,bd.lastmodifieddate"
				+ " as bd_lastmodifieddate,bad.id as bad_id,bad.businessdetails as bd_id,bad.chartofaccount"
				+ " as bad_chartofacc,bad.amount as bad_amount,bad.tenantid as bad_tenant,basd.id  as basd_id,"
				+ "basd.accountdetailtype as basd_detailtype,basd.accountdetailkey as basd_detailkey,basd.amount"
				+ " as basd_amount,basd.businessaccountdetail"
				+ " as basd_id,basd.tenantid as basd_tenant from eg_businesscategory bc FULL JOIN eg_businessdetails"
				+ " bd ON bc.id=bd.businesscategory FULL JOIN"
				+ " eg_business_accountdetails bad ON bd.id=bad.businessdetails"
				+ " FULL JOIN eg_business_subledgerinfo basd ON bad.id=basd.businessaccountdetail"
				+ " ORDER BY bd.name ASC", builder.getQuery(detailsCriteria, new ArrayList<>()));
	}

	@Test
    @Ignore
	public void all_input_test() {
		BusinessDetailsCriteria detailsCriteria = new BusinessDetailsCriteria();
		BusinessDetailsQueryBuilder builder = new BusinessDetailsQueryBuilder();
		detailsCriteria.setBusinessCategoryCode("TL");
		detailsCriteria.setBusinessDetailsCodes(Arrays.asList("TL","PT"));
		detailsCriteria.setActive(true);
		detailsCriteria.setIds(Arrays.asList(1L, 2L));
		detailsCriteria.setTenantId("default");
		detailsCriteria.setSortBy("code");
		detailsCriteria.setSortOrder("DESC");
		String query = builder.getQuery(detailsCriteria, new ArrayList<>());

		assertEquals("Select bd.id as bd_id,bd.name as bd_name,bd.businessurl as bd_url,"
				+ "bd.isenabled as bd_enabled,bd.code as bd_code,bd.businesstype as bd_type,"
				+ "bd.fund as bd_fund,bd.function as bd_function,bd.fundsource as bd_fundsource,"
				+ "bd.functionary as bd_functionary,bd.department as bd_department,bd.callbackforapportioning as bd_callback,"
				+ "bd.vouchercreation as bd_vouc_creation,bd.businesscategory as bd_category,"
				+ "bd.isvoucherapproved as bd_is_Vou_approved,bd.vouchercutoffdate as bd_vou_cutoffdate,"
				+ "bd.ordernumber as bd_ordernumber,bd.tenantid as bd_tenant,bd.createdby as bd_createdby,"
				+ "bd.createddate as bd_createddate,bd.lastmodifiedby as bd_lastmodifiedby,bd.lastmodifieddate"
				+ " as bd_lastmodifieddate,bad.id as bad_id,bad.businessdetails as bd_id,bad.chartofaccount"
				+ " as bad_chartofacc,bad.amount as bad_amount,bad.tenantid as bad_tenant,basd.id  as basd_id,"
				+ "basd.accountdetailtype as basd_detailtype,basd.accountdetailkey as basd_detailkey,basd.amount"
				+ " as basd_amount,basd.businessaccountdetail"
				+ " as basd_id,basd.tenantid as basd_tenant from eg_businesscategory bc FULL JOIN eg_businessdetails"
				+ " bd ON bc.id=bd.businesscategory FULL JOIN"
				+ " eg_business_accountdetails bad ON bd.id=bad.businessdetails"
				+ " FULL JOIN eg_business_subledgerinfo basd ON bad.id=basd.businessaccountdetail"
				+ " WHERE bd.tenantId = ? AND bd.id IN (1, 2) AND bc.code = ? AND bd.isenabled = ?"
				+ " AND bd.code IN ('TL','PT') ORDER BY bd.code DESC", query);
	}

}