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

import org.springframework.stereotype.Component;

@Component
public class BoundaryTypeQueryBuilder {

	public static String getBoundaryTypeInsertquery() {
		return "insert into eg_boundary_type (id,hierarchy,parent,name,hierarchytype,localname,code,tenantid,createddate,lastmodifieddate,createdby,lastmodifiedby)"
				+ "values (:id,:hierarchy,:parent,:name,:hierarchytype,:localname,:code,:tenantid,:createddate,:lastmodifieddate,:createdby,:lastmodifiedby) ";
	}
	
	public static String getBoundaryTypeUpdatequery(){
		
		return "update eg_boundary_type set hierarchy=:hierarchy,parent=:parent,name=:name,hierarchytype=:hierarchytype,localname=:localname,lastmodifieddate=:lastmodifieddate,lastmodifiedby=:lastmodifiedby where code=:code and tenantid=:tenantid";
	}

	private static final String QUERY = "(WITH RECURSIVE nodes(btId,btHierarchy,btParent,btName,btHierarchyType,btCreatedDate,btLastModifiedDate,btCreatedBy,btLastModifiedBy,btLocalName,btCode,btTenantId,htId,htName,htCode,htTenantId,htLocalName,htCreatedDate,htLastModifiedDate,htCreatedBy,htLastModifiedBy) AS"
			+ " (SELECT bt.id,bt.hierarchy,bt.parent,bt.name,bt.hierarchytype,bt.createddate,bt.lastmodifieddate,bt.createdby,bt.lastmodifiedby,bt.localname,bt.code,bt.tenantid,"
			+ " ht.id,ht.name,ht.code,ht.tenantid,ht.localname,ht.createddate,ht.lastmodifieddate,ht.createdby,ht.lastmodifiedby"
			+ " FROM eg_boundary_type bt,eg_hierarchy_type ht WHERE bt.hierarchytype = ht.id and bt.tenantid =:tenantId and ht.tenantid =:tenantId ";

	private static final String SUBQUERY = " UNION ALL SELECT bt.id,bt.hierarchy,bt.parent,bt.name,bt.hierarchytype,bt.createddate,bt.lastmodifieddate,bt.createdby,bt.lastmodifiedby,bt.localname,bt.code,bt.tenantid,"
			+ " ht.id,ht.name,ht.code,ht.tenantid,ht.localname,ht.createddate,ht.lastmodifieddate,ht.createdby,ht.lastmodifiedby"
			+ " FROM nodes s2, eg_boundary_type bt,eg_hierarchy_type ht WHERE bt.id = s2.btParent and bt.tenantid =:tenantId and ht.tenantid =:tenantId and bt.hierarchytype = ht.id) SELECT DISTINCT * FROM nodes)";

	public static String getBoundaryTypeByIdAndTenant() {
		return QUERY + " and bt.id =:id" + SUBQUERY;
	}

	public static String getAllByTenantId() {
		return QUERY + SUBQUERY;
	}

	public static String getAllByTByTenantIdAndName() {
		return QUERY + " and bt.name=:name" + SUBQUERY;
	}

	public static String getAllByTByTenantIdAndCode() {
		return QUERY + " and bt.code=:code" + SUBQUERY;
	}

	public static String getAllByTByNameAndHierarchyTypeName() {
		return QUERY + " and bt.name=:boundaryTypename and ht.name=:hierarchyTypeName" + SUBQUERY;
	}

	public static String getAllByHierarchyTypeAndTenant() {
		return "select * from eg_boundary_type where hierarchytype in (select id from eg_hierarchy_type where upper(name)=upper(:hierarchyTypeName) and tenantId=:tenantId) and tenantId=:tenantId";
	}
}
