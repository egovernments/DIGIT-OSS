/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.boundary.persistence.repository.querybuilder;

import java.util.Map;

import org.egov.boundary.domain.model.BoundarySearchRequest;
import org.springframework.stereotype.Component;

@Component
public class BoundaryQueryBuilder {

	public static String getBoundaryInsertquery() {
		return "insert into eg_boundary (id,boundarynum,parent,code,name,boundarytype,localname,fromdate,todate,bndryid,longitude,latitude,materializedpath,ishistory,tenantid,createddate,lastmodifieddate,createdby,lastmodifiedby)"
				+ "values (:id,:boundarynum,:parent,:code,:name,:boundarytype,:localname,:fromdate,:todate,:bndryid,:longitude,:latitude,:materializedpath,:ishistory,:tenantid,:createddate,:lastmodifieddate,:createdby,:lastmodifiedby) ";
	}
	
	public static String getBoundaryUpdateQuery(){
		
		return "update eg_boundary set boundarynum=:boundarynum,parent=:parent,name=:name,boundarytype=:boundarytype,localname=:localname,fromdate=:fromdate,todate=:todate,bndryid=:bndryid,longitude=:longitude,latitude=:latitude,materializedpath=:materializedpath,"
				+ "ishistory=:ishistory,lastmodifiedby=:lastmodifiedby,lastmodifieddate=:lastmodifieddate where tenantid=:tenantid and code=:code";
	}

	private static final String QUERY = "(WITH RECURSIVE nodes(bId,bBoundaryNum,bParent,bCode,bName,bBoundaryType,bLocalName,bFromdate,bToDate,bBndryid,bLongitude,bLatitude,bMaterialiedPath,bHistory,bCreatedDate,bLastModifiedDate,bCreatedBy,bLastModifiedBy,"
			+ " bTenantId,btId,btHierarchy,btParent,btName,btHierarchyType,btCreatedDate,btLastModifiedDate,btCreatedBy,btLastModifiedBy,btLocalName,btCode,btTenantId) AS"
			+ " (SELECT b.id,b.boundarynum,b.parent,b.code,b.name,b.boundarytype,b.localname,b.fromdate,b.todate,b.bndryid,b.longitude,b.latitude,b.materializedpath,b.ishistory,b.createddate,b.lastmodifieddate,b.createdby,"
			+ " b.lastmodifiedby,b.tenantid,bt.id,bt.hierarchy,bt.parent,bt.name,bt.hierarchytype,bt.createddate,bt.lastmodifieddate,bt.createdby,bt.lastmodifiedby,bt.localname,bt.code,bt.tenantid"
			+ " FROM eg_boundary b,eg_boundary_type bt WHERE b.boundarytype = bt.id and b.tenantid = :tenantId and bt.tenantid =:tenantId";

	private static final String SUBQUERY = " UNION ALL  SELECT b.id,b.boundarynum,b.parent,b.code,b.name,b.boundarytype,b.localname,b.fromdate,b.todate,b.bndryid,b.longitude,b.latitude,b.materializedpath,b.ishistory,b.createddate,b.lastmodifieddate,b.createdby,b.lastmodifiedby,b.tenantid,"
			+ " bt.id,bt.hierarchy,bt.parent,bt.name,bt.hierarchytype,bt.createddate,bt.lastmodifieddate,bt.createdby,bt.lastmodifiedby,bt.localname,bt.code,bt.tenantid"
			+ " FROM nodes s2, eg_boundary b,eg_boundary_type bt WHERE b.id = s2.bparent and b.tenantid =:tenantId and bt.tenantid =:tenantId and b.boundarytype = bt.id) SELECT DISTINCT * FROM nodes)";

	public static String getBoundaryByIdAndTenant() {
		return QUERY + " and b.id =:id" + SUBQUERY;
	}

	public static String getBoundaryByCodeAndTenant() {
		return QUERY + " and b.code =:code" + SUBQUERY;
	}
	
	public static String getBoundaryByCodesAndTenant() {
		return QUERY + " and b.code in (:codes)" + SUBQUERY;
	}
	
	public static String getAllByTenantId() {
		return QUERY + SUBQUERY;
	}

	public static String getBoundarieByBoundaryTypeAndBoundaryNumAndTenantId() {
		return QUERY + " and b.boundarytype =:id and b.boundarynum=:boundaryNum" + SUBQUERY;
	}

	public static String getAllBoundarieByBoundaryTypeAndTenantId() {
		return QUERY + " and b.boundarytype =:boundaryTypeId" + SUBQUERY;
	}

	public static String getBoundarieByBoundaryTypeAndBoundaryNum() {
		return QUERY + " and bt.id =:id and b.boundarynum=:boundaryNum" + SUBQUERY;
	}

	public static String getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId() {
		return "select b.* from eg_Boundary b where b.boundarytype="
				+ "(select id from eg_boundary_Type t where upper(t.name)=upper(:boundaryTypeName) and t.hierarchyType="
				+ "(select id from eg_hierarchy_type h where upper(name)=upper(:hierarchyTypeName) and h.tenantId=:tenantId) and t.tenantId=:tenantId)  "
				+ "and b.tenantid=:tenantId";
	}

	public static String findAllBoundariesByNumberAndType() {
		return QUERY + " and b.boundarytype in (:boundaryTypeIds) and b.boundarynum in (:boundaryNumbers)" + SUBQUERY;
	}

	public static String getAllBoundaryByTenantIdAndTypeIds() {
		return QUERY + " and b.boundarytype in (:boundaryTypeIds)" + SUBQUERY;
	}

	public static String getAllBoundaryByTenantIdAndNumber() {
		return QUERY + " and b.boundarynum in (:boundaryNumbers)" + SUBQUERY;
	}

	public static String findAllBoundariesByIdsAndTenant() {
		return QUERY + " and b.id in (:boundaryIds)" + SUBQUERY;
	}

	public static String getAllBoundaryByTenantAndNumAndTypeAndTypeIds() {
		return QUERY
				+ " and b.id in (:boundaryIds) and b.boundarynum in (:boundaryNumbers) and b.boundarytype in(:boundaryTypeIds)"
				+ SUBQUERY;
	}

	public static String getAllParents() {
		return "select * from eg_boundary where parent is null";
	}

	public static String getActiveImmediateChildrenWithOutParent() {
		return "select * from eg_boundary where isHistory=false AND parent=:parentId";

	}
	
	public static String getAllBoundariesByIdsAndTypeAndNumberAndCodeAndTenant(BoundarySearchRequest boundarySearchRequest,Map<String, Object> parametersMap){
		
		StringBuilder Query =  new StringBuilder(QUERY);
		
		if(boundarySearchRequest.getTenantId()!=null && !boundarySearchRequest.getTenantId().isEmpty()){
			parametersMap.put("tenantId", boundarySearchRequest.getTenantId());
		}
		if(boundarySearchRequest.getCodes()!=null && !boundarySearchRequest.getCodes().isEmpty()){
			parametersMap.put("codes", boundarySearchRequest.getCodes());
			Query.append(" and b.code in (:codes)");
		}
		if(boundarySearchRequest.getBoundaryIds()!=null && !boundarySearchRequest.getBoundaryIds().isEmpty()){
			parametersMap.put("boundaryIds", boundarySearchRequest.getBoundaryIds());
			Query.append(" and b.id in (:boundaryIds)");
		}
		if(boundarySearchRequest.getBoundaryTypeIds()!=null && !boundarySearchRequest.getBoundaryTypeIds().isEmpty()){
			parametersMap.put("boundaryTypeIds", boundarySearchRequest.getBoundaryTypeIds());
			Query.append(" and b.boundarytype in (:boundaryTypeIds)");
		}
		if(boundarySearchRequest.getBoundaryNumbers()!=null && !boundarySearchRequest.getBoundaryNumbers().isEmpty()){
			parametersMap.put("boundaryNumbers", boundarySearchRequest.getBoundaryNumbers());
			Query.append(" and b.boundarynum in (:boundaryNumbers)");
		}
		if(boundarySearchRequest.getHierarchyTypeIds()!=null && !boundarySearchRequest.getHierarchyTypeIds().isEmpty()){
			parametersMap.put("hierarchyType", boundarySearchRequest.getHierarchyTypeIds());
			Query.append(" and bt.hierarchytype in (:hierarchyType)");
		}
		
		return Query+SUBQUERY;
	}
	
}
