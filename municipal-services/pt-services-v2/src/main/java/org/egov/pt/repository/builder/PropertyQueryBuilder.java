package org.egov.pt.repository.builder;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.web.models.PropertyCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class PropertyQueryBuilder {
	
	@Autowired
	private PropertyConfiguration config;

	private static final String INNER_JOIN_STRING = "INNER JOIN";
	private static final String LEFT_OUTER_JOIN_STRING = "LEFT OUTER JOIN";

	private static final String QUERY = "SELECT pt.*,ptdl.*,address.*,owner.*,doc.*,unit.*,insti.*,"
			+ " pt.propertyid as propertyid,ptdl.assessmentnumber as propertydetailid,doc.id as documentid,unit.id as unitid,"
			+ "address.id as addresskeyid,insti.id as instiid,pt.additionalDetails as pt_additionalDetails,"
			+ "ownerdoc.id as ownerdocid,ownerdoc.documenttype as ownerdocType,ownerdoc.filestore as ownerfileStore,"
			+ "ownerdoc.documentuid as ownerdocuid,ptdl.additionalDetails as ptdl_additionalDetails,"
			+ "ptdl.createdby as assesscreatedby,ptdl.lastModifiedBy as assesslastModifiedBy,ptdl.createdTime as assesscreatedTime,"
			+ "ptdl.lastModifiedTime as assesslastModifiedTime,"
			+ "ptdl.status as propertydetailstatus, unit.occupancyDate as unitoccupancyDate,"
			+ "insti.name as institutionname,insti.type as institutiontype,insti.tenantid as institenantId,"
			+ "ownerdoc.userid as docuserid,ownerdoc.propertydetail as docassessmentnumber,"
			+ "unit.usagecategorymajor as unitusagecategorymajor,unit.usagecategoryminor as unitusagecategoryminor"
			+ " FROM eg_pt_property_v2 pt " + INNER_JOIN_STRING
			+ " eg_pt_propertydetail_v2 ptdl ON pt.propertyid =ptdl.property " + INNER_JOIN_STRING
			+ " eg_pt_owner_v2 owner ON ptdl.assessmentnumber=owner.propertydetail " + INNER_JOIN_STRING
			+ " eg_pt_address_v2 address on address.property=pt.propertyid " + LEFT_OUTER_JOIN_STRING
			+ " eg_pt_unit_v2 unit ON ptdl.assessmentnumber=unit.propertydetail " + LEFT_OUTER_JOIN_STRING
			+ " eg_pt_document_propertydetail_v2 doc ON ptdl.assessmentnumber=doc.propertydetail "
			+ LEFT_OUTER_JOIN_STRING + " eg_pt_document_owner_v2 ownerdoc ON ownerdoc.userid=owner.userid "
			+ LEFT_OUTER_JOIN_STRING + " eg_pt_institution_v2 insti ON ptdl.assessmentnumber=insti.propertydetail "
			+ " WHERE ";

	private static final String LIKE_QUERY = "SELECT pt.*,ptdl.*,address.*,owner.*,doc.*,unit.*,insti.*,"
			+ " pt.propertyid as ptid,ptdl.assessmentnumber as propertydetailid,doc.id as documentid,unit.id as unitid,"
			+ "address.id as addresskeyid,insti.id as instiid,pt.additionalDetails as pt_additionalDetails,"
			+ "ownerdoc.id as ownerdocid,ownerdoc.documenttype as ownerdocType,ownerdoc.filestore as ownerfileStore,"
			+ "ownerdoc.documentuid as ownerdocuid, ptdl.additionalDetails as ptdl_additionalDetails,"
			+ "ptdl.createdby as assesscreatedby,ptdl.lastModifiedBy as assesslastModifiedBy,ptdl.createdTime as assesscreatedTime,"
			+ "ptdl.lastModifiedTime as assesslastModifiedTime,"
			+ "ptdl.status as propertydetailstatus, unit.occupancyDate as unitoccupancyDate,"
			+ "insti.name as institutionname,insti.type as institutiontype,insti.tenantid as institenantId,"
			+ "ownerdoc.userid as docuserid,ownerdoc.propertydetail as docassessmentnumber,"
			+ "unit.usagecategorymajor as unitusagecategorymajor,unit.usagecategoryminor as unitusagecategoryminor,"
			+ "pt.lastModifiedTime as propertylastModifiedTime,pt.createdby as propertyCreatedby,"
			+ "pt.lastModifiedBy as propertyModifiedBy,pt.createdTime as propertyCreatedTime "
			+ " FROM eg_pt_property_v2 pt " + INNER_JOIN_STRING
			+ " eg_pt_propertydetail_v2 ptdl ON pt.propertyid =ptdl.property " + INNER_JOIN_STRING
			+ " eg_pt_owner_v2 owner ON ptdl.assessmentnumber=owner.propertydetail " + INNER_JOIN_STRING
			+ " eg_pt_address_v2 address on address.property=pt.propertyid " + LEFT_OUTER_JOIN_STRING
			+ " eg_pt_unit_v2 unit ON ptdl.assessmentnumber=unit.propertydetail " + LEFT_OUTER_JOIN_STRING
			+ " eg_pt_document_propertydetail_v2 doc ON ptdl.assessmentnumber=doc.propertydetail "
			+ LEFT_OUTER_JOIN_STRING + " eg_pt_document_owner_v2 ownerdoc ON ownerdoc.userid=owner.userid "
			+ LEFT_OUTER_JOIN_STRING + " eg_pt_institution_v2 insti ON ptdl.assessmentnumber=insti.propertydetail "
			+ " WHERE ";

	private final String paginationWrapper = "SELECT * FROM "
			+ "(SELECT *, DENSE_RANK() OVER (ORDER BY ptid) offset_ FROM " + "({})" + " result) result_offset "
			+ "WHERE offset_ > ? AND offset_ <= ?";



	private static final String NEWQUERY = "SELECT asmt.*,address.*,owner.*,doc.*,unit.*,insti.*,doc.id as documentid,unit.id as unitid,"+
			"  	 address.id as addresskeyid,insti.id as instiid, "+
			"    ownerdoc.id as ownerdocid,ownerdoc.documenttype as ownerdocType,ownerdoc.filestore as ownerfileStore,  "+
			"    ownerdoc.documentuid as ownerdocuid, unit.occupancyDate as unitoccupancyDate, "+
			"    insti.name as institutionname,insti.type as institutiontype,insti.tenantid as institenantId, "+
			"    ownerdoc.userid as docuserid,ownerdoc.propertydetail as docassessmentnumber, "+
			"    unit.usagecategorymajor as unitusagecategorymajor,unit.usagecategoryminor as unitusagecategoryminor,"+
			"    unit.additionalDetails as unit_additionalDetails,owner.additionalDetails as ownerInfo_additionalDetails,"+
			"    insti.additionalDetails as insti_additionalDetails,address.additionalDetails as add_additionalDetails "+
			"    FROM (" +
			"    select *,pt.propertyid as ptid,ptdl.assessmentnumber as propertydetailid,pt.additionalDetails as pt_additionalDetails, "+
			"    ptdl.additionalDetails as ptdl_additionalDetails,ptdl.createdby as assesscreatedby,"+
			"    ptdl.lastModifiedBy as assesslastModifiedBy,ptdl.createdTime as assesscreatedTime,"+
			"    ptdl.lastModifiedTime as assesslastModifiedTime,ptdl.createdby as assesscreatedby," +
			"    pt.lastModifiedBy as propertyModifiedBy,pt.createdTime as propertyCreatedTime," +
			"    pt.lastModifiedTime as propertylastModifiedTime,pt.createdby as propertyCreatedby,"+
			"    ptdl.status as propertydetailstatus "+
			"    FROM eg_pt_property_v2 pt INNER JOIN eg_pt_propertydetail_v2 ptdl ON pt.propertyid =ptdl.property " +
			"    INNER JOIN (Select max(createdTime) as maxcreatedtime,property from eg_pt_propertydetail_v2 ptd " +
			"	 WHERE_CLAUSE_PLACHOLDER_ASSESSMENT " +
			"	 GROUP BY property,financialyear) as maxasses " +
			"    ON maxasses.property = ptdl.property and maxasses.maxcreatedtime = ptdl.createdtime" +
		"		 WHERE_CLAUSE_PLACHOLDER_PROPERTY) as asmt "+
				 INNER_JOIN_STRING+
			"    eg_pt_owner_v2 owner ON asmt.assessmentnumber=owner.propertydetail     " +
				 INNER_JOIN_STRING+
			"    eg_pt_address_v2 address on address.property=asmt.ptid      " +
				 LEFT_OUTER_JOIN_STRING+
			"    eg_pt_unit_v2 unit ON asmt.assessmentnumber=unit.propertydetail      " +
				 LEFT_OUTER_JOIN_STRING+
			"    eg_pt_document_propertydetail_v2 doc ON asmt.assessmentnumber=doc.propertydetail  "+
				 LEFT_OUTER_JOIN_STRING+
			"    eg_pt_document_owner_v2 ownerdoc ON ownerdoc.userid=owner.userid  "+
				 LEFT_OUTER_JOIN_STRING+
			"    eg_pt_institution_v2 insti ON asmt.assessmentnumber=insti.propertydetail WHERE_CLAUSE_PLACHOLDER ";
	

	public String getPropertyLikeQuery(PropertyCriteria criteria, List<Object> preparedStmtList) {
		StringBuilder builder = new StringBuilder(LIKE_QUERY);

		Set<String> ids = criteria.getIds();
		if (!CollectionUtils.isEmpty(ids)) {

			builder.append(" pt.propertyid IN (").append(createQuery(ids)).append(")");
			addToPreparedStatement(preparedStmtList, ids);
		}


		/*builder.append("AND pt.propertyid LIKE ?");
		System.out.println("\n\ncriteria.getPropertyId()-->"+criteria.getPropertyId()+"\n\n");
		preparedStmtList.add(criteria.getPropertyId());*/

		//return addPaginationWrapper(builder.toString(), preparedStmtList, criteria);
		return addPaginationClause(builder, preparedStmtList, criteria);

	}

	private static String addPaginationClause(StringBuilder selectQuery, List<Object> preparedStmtList,
											  PropertyCriteria criteria) {

		if (criteria.getLimit()!=null && criteria.getLimit() != 0) {
			selectQuery.append("and pt.propertyid in (select propertyid from eg_pt_property_v2 where tenantid= ? order by propertyid offset ? limit ?)");
			preparedStmtList.add(criteria.getTenantId());
			preparedStmtList.add(criteria.getOffset());
			preparedStmtList.add(criteria.getLimit());

			return addOrderByClause(selectQuery, criteria);

		} else
			return addOrderByClause(selectQuery, criteria);
	}

	private static String addOrderByClause(StringBuilder selectQuery,
										   PropertyCriteria criteria) {
		return selectQuery.append(" ORDER BY pt.propertyid DESC ").toString();
	}

	private String addPaginationWrapper(String query, List<Object> preparedStmtList,
			PropertyCriteria criteria) {
		Long limit = config.getDefaultLimit();
		Long offset = config.getDefaultOffset();
		String finalQuery = paginationWrapper.replace("{}", query);

		if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
			limit = criteria.getLimit();

		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
			limit = config.getMaxSearchLimit();

		if (criteria.getOffset() != null)
			offset = criteria.getOffset();

		preparedStmtList.add(offset);
		preparedStmtList.add(limit + offset);

		return finalQuery;
	}

	public String getPropertySearchQuery(PropertyCriteria criteria, List<Object> preparedStmtList) {

		StringBuilder builder = new StringBuilder(NEWQUERY);

		StringBuilder WHERE_CLAUSE_PLACHOLDER_ASSESSMENT = new StringBuilder("");

		StringBuilder WHERE_CLAUSE_PLACHOLDER_PROPERTY = new StringBuilder("");

		StringBuilder WHERE_CLAUSE_PLACHOLDER = new StringBuilder("");


		if (criteria.getAccountId() != null) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER);
			WHERE_CLAUSE_PLACHOLDER.append(" asmt.accountid = ? ");
			preparedStmtList.add(criteria.getAccountId());

			Set<String> ownerids = criteria.getOwnerids();
			if (!CollectionUtils.isEmpty(ownerids)) {
				WHERE_CLAUSE_PLACHOLDER.append(" OR ");
				WHERE_CLAUSE_PLACHOLDER.append(" owner.userid IN (").append(createQuery(ownerids)).append(")");
				addToPreparedStatement(preparedStmtList, ownerids);
			}

			String defaultQuery =  builder.toString().replace("WHERE_CLAUSE_PLACHOLDER_ASSESSMENT",WHERE_CLAUSE_PLACHOLDER_ASSESSMENT.toString())
					.replace("WHERE_CLAUSE_PLACHOLDER_PROPERTY","").replace("WHERE_CLAUSE_PLACHOLDER",WHERE_CLAUSE_PLACHOLDER);

			return addPaginationWrapper(defaultQuery, preparedStmtList, criteria);
		}

		
		if (criteria.getPropertyDetailStatus() != null) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_ASSESSMENT);
			WHERE_CLAUSE_PLACHOLDER_ASSESSMENT.append(" ptd.status = ? ");
			preparedStmtList.add(criteria.getPropertyDetailStatus());
		}else {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_ASSESSMENT);
			WHERE_CLAUSE_PLACHOLDER_ASSESSMENT.append(" ptd.status = 'ACTIVE' ");
		}

		Set<String> propertyDetailids = criteria.getPropertyDetailids();
		if (!CollectionUtils.isEmpty(propertyDetailids)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_ASSESSMENT);
			WHERE_CLAUSE_PLACHOLDER_ASSESSMENT.append(" ptd.assessmentnumber IN (").append(createQuery(propertyDetailids)).append(")");
			addToPreparedStatement(preparedStmtList, propertyDetailids);
		}

		if(criteria.getAsOnDate()!=null){
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_ASSESSMENT);
			WHERE_CLAUSE_PLACHOLDER_ASSESSMENT.append(" createdTime <= ?");
			preparedStmtList.add(criteria.getAsOnDate());
		}

		if(criteria.getFinancialYear()!=null){
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_ASSESSMENT);
			WHERE_CLAUSE_PLACHOLDER_ASSESSMENT.append(" financialYear = ?");
			preparedStmtList.add(criteria.getFinancialYear());
		}

		if(criteria.getTenantId()!=null){
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_PROPERTY);
			WHERE_CLAUSE_PLACHOLDER_PROPERTY.append("  pt.tenantid=? ");
			preparedStmtList.add(criteria.getTenantId());
		}

		Set<String> statuses = new HashSet<>();
		criteria.getStatuses().forEach(statusEnum -> {
			statuses.add(statusEnum.toString());
		});

		if (!CollectionUtils.isEmpty(statuses)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_PROPERTY);
			WHERE_CLAUSE_PLACHOLDER_PROPERTY.append(" pt.status IN (").append(createQuery(statuses)).append(")");
			addToPreparedStatement(preparedStmtList, statuses);
		}

		Set<String> ids = criteria.getIds();
		if (!CollectionUtils.isEmpty(ids)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_PROPERTY);
			WHERE_CLAUSE_PLACHOLDER_PROPERTY.append(" pt.propertyid IN (").append(createQuery(ids)).append(")");
			addToPreparedStatement(preparedStmtList, ids);
		}

		Set<String> oldpropertyids = criteria.getOldpropertyids();
		if (!CollectionUtils.isEmpty(oldpropertyids)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER_PROPERTY);
			WHERE_CLAUSE_PLACHOLDER_PROPERTY.append(" pt.oldpropertyid IN (").append(createQuery(oldpropertyids)).append(")");
			addToPreparedStatement(preparedStmtList, oldpropertyids);
		}


		Set<String> addressids = criteria.getAddressids();
		if (!CollectionUtils.isEmpty(addressids)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER);
			WHERE_CLAUSE_PLACHOLDER.append(" address.id IN (").append(createQuery(addressids)).append(")");
			addToPreparedStatement(preparedStmtList, addressids);
		}

		Set<String> ownerids = criteria.getOwnerids();
		if (!CollectionUtils.isEmpty(ownerids)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER);
			WHERE_CLAUSE_PLACHOLDER.append(" owner.userid IN (").append(createQuery(ownerids)).append(")");
			addToPreparedStatement(preparedStmtList, ownerids);
		}

		Set<String> unitids = criteria.getUnitids();
		if (!CollectionUtils.isEmpty(unitids)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER);
			WHERE_CLAUSE_PLACHOLDER.append(" unit.id IN (").append(createQuery(unitids)).append(")");
			addToPreparedStatement(preparedStmtList, unitids);
		}

		Set<String> documentids = criteria.getDocumentids();
		if (!CollectionUtils.isEmpty(documentids)) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER);
			WHERE_CLAUSE_PLACHOLDER.append(" doc.id IN (").append(createQuery(documentids)).append(")");
			addToPreparedStatement(preparedStmtList, documentids);
		}

		if (criteria.getDoorNo() != null && criteria.getLocality() != null) {
			addClauseIfRequired(WHERE_CLAUSE_PLACHOLDER);
			WHERE_CLAUSE_PLACHOLDER.append(" address.doorno = ? ").append(" and address.locality = ? ");
			preparedStmtList.add(criteria.getDoorNo());
			preparedStmtList.add(criteria.getLocality());
		}

        String query = builder.toString();

		query = query.replace("WHERE_CLAUSE_PLACHOLDER_ASSESSMENT",WHERE_CLAUSE_PLACHOLDER_ASSESSMENT);

		query = query.replace("WHERE_CLAUSE_PLACHOLDER_PROPERTY",WHERE_CLAUSE_PLACHOLDER_PROPERTY);

		query = query.replace("WHERE_CLAUSE_PLACHOLDER",WHERE_CLAUSE_PLACHOLDER);

		return addPaginationWrapper(query, preparedStmtList, criteria);

	}

	/*
	 * private String createQuery(Set<String> ids) {
	 * 
	 * final String quotes = "'"; final String comma = ","; StringBuilder builder =
	 * new StringBuilder(); Iterator<String> iterator = ids.iterator();
	 * while(iterator.hasNext()) {
	 * builder.append(quotes).append(iterator.next()).append(quotes);
	 * if(iterator.hasNext()) builder.append(comma); } return builder.toString(); }
	 */

	private String createQuery(Set<String> ids) {
		StringBuilder builder = new StringBuilder();
		int length = ids.size();
		for (int i = 0; i < length; i++) {
			builder.append(" ?");
			if (i != length - 1)
				builder.append(",");
		}
		return builder.toString();
	}

	private void addToPreparedStatement(List<Object> preparedStmtList, Set<String> ids) {
		ids.forEach(id -> {
			preparedStmtList.add(id);
		});
	}

	private void addClauseIfRequired(StringBuilder builder){
		if(builder.toString().isEmpty())
			builder.append(" WHERE");
		else builder.append(" AND ");
	}

}
