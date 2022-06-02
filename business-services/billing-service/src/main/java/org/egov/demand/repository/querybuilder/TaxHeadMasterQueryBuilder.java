package org.egov.demand.repository.querybuilder;

import java.util.List;
import java.util.Set;

import org.egov.demand.model.TaxHeadMasterCriteria;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class TaxHeadMasterQueryBuilder {
	
	public static final String UPDATE_QUERY = "UPDATE {schema}.egbs_taxheadmaster SET  category = ?, service = ?,"
			+ " name = ?, code=?, isdebit = ?, isactualdemand = ?, orderno = ?, validfrom = ?, validtill = ?,"
			+ " lastmodifiedby = ?, lastmodifiedtime = ? WHERE tenantid = ? and id = ?";

	public static final String INSERT_QUERY = "INSERT INTO egbs_taxheadmaster(id, tenantid, category,"
			+ " service, name, code, isdebit,isactualdemand, orderno, validfrom, validtill,"
			+ " createdby, createdtime, lastmodifiedby, lastmodifiedtime)"
			+ " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

	private static final String BASE_QUERY = "SELECT *,taxhead.id AS taxheadId,"
			+ " taxhead.tenantid AS taxheadTenantid, taxhead.service taxheadService,"
			+ " taxhead.createdby AS taxcreatedby, taxhead.createdtime AS taxcreatedtime, taxhead.lAStmodifiedby AS taxlAStmodifiedby,"
			+ " taxhead.lAStmodifiedtime AS taxlAStmodifiedtime,glcode.id AS glCodeId, glcode.tenantid AS glCodeTenantId,glcode.service AS glCodeService,"
			+ " glcode.createdby AS glcreatedby, glcode.createdtime AS glcreatedtime, glcode.lastmodifiedby AS gllastmodifiedby,"
			+ " glcode.lastmodifiedtime AS gllastmodifiedtime"
			+ " FROM {schema}.egbs_taxheadmaster taxhead LEFT OUTER Join egbs_glcodemaster glcode "
			+ " ON taxhead.code=glcode.taxhead and taxhead.tenantid=glcode.tenantid "
			+ " WHERE taxhead.tenantId = ? ";
	
	public String getQuery(final TaxHeadMasterCriteria searchTaxHead, final List<Object> preparedStatementValues) {
		final StringBuilder selectQuery = new StringBuilder(BASE_QUERY);
		log.info("get query");
	    addWhereClause(selectQuery, preparedStatementValues, searchTaxHead);
		addPagingClause(selectQuery, preparedStatementValues, searchTaxHead);
		log.info("Query from taxHeadMaster querybuilde for search : " + selectQuery);
		return selectQuery.toString();
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void addWhereClause(final StringBuilder selectQuery, final List preparedStatementValues,
			final TaxHeadMasterCriteria searchTaxHead) {
		
		if(searchTaxHead.getTenantId() == null && searchTaxHead.getService() == null
				&& searchTaxHead.getName() == null && searchTaxHead.getCode() == null
				&&searchTaxHead.getCategory() == null)
			return;
		preparedStatementValues.add(searchTaxHead.getTenantId());
		
		if(searchTaxHead.getService() != null){
			selectQuery.append(" AND taxhead.service = ?");
			preparedStatementValues.add(searchTaxHead.getService());
		}
		
		if (searchTaxHead.getName() != null) {
			selectQuery.append(" AND taxhead.name like ?");
			preparedStatementValues.add("%" + searchTaxHead.getName() + "%");
		}

		if (searchTaxHead.getId() != null && !searchTaxHead.getId().isEmpty()) {
			selectQuery.append(" AND taxhead.id IN (" + getIdQuery(searchTaxHead.getId()));
		}else if(searchTaxHead.getCode() != null && !searchTaxHead.getCode().isEmpty()) {
			selectQuery.append(" AND taxhead.code IN ("+ getIdQuery(searchTaxHead.getCode()));
		}
		
		if (searchTaxHead.getCategory() != null) {
			selectQuery.append(" AND taxhead.category = ?");
			preparedStatementValues.add(searchTaxHead.getCategory());
		}
		
		if (searchTaxHead.getIsActualDemand() != null) {
			selectQuery.append(" AND taxhead.isActualDemand = ?");
			preparedStatementValues.add(searchTaxHead.getIsActualDemand());
		}
		
		if (searchTaxHead.getIsDebit() != null) {
			selectQuery.append(" AND taxhead.isDebit = ?");
			preparedStatementValues.add( searchTaxHead.getIsDebit());
		}
		

	}
	
	@SuppressWarnings({ "rawtypes" })
	private void addPagingClause(final StringBuilder selectQuery, final List preparedStatementValues,
			final TaxHeadMasterCriteria searchTaxHeads) {
		
		selectQuery.append(" ORDER BY taxhead.validfrom,taxhead.code");

		selectQuery.append(" LIMIT ?");
	/*	long pageSize = Integer.parseInt(applicationProperties.commonsSearchPageSizeDefault());
		if (searchTaxHeads.getSize() != null)
			pageSize = searchTaxHeads.getSize();
		preparedStatementValues.add(pageSize); // Set limit to pageSize

		// handle offset here
		selectQuery.append(" OFFSET ?");
		long pageNumber = 0; // Default pageNo is zero meaning first page
		if (searchTaxHeads.getOffset() != null)
			pageNumber = searchTaxHeads.getOffset() - 1;
		preparedStatementValues.add(pageNumber * pageSize); // Set offset to*/
															// pageNo * pageSize
	}
	
	private static String getIdQuery(Set<String> idList) {

		StringBuilder query = new StringBuilder();
		if (!idList.isEmpty()) {
			String[] list = idList.toArray(new String[idList.size()]);
			query.append("'"+list[0]+"'");
			for (int i = 1; i < idList.size(); i++)
				query.append("," + "'"+list[i]+"'");
		}
		return query.append(")").toString();
	}
}
