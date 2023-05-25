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
public class CrossHierarchyQueryBuilder {
	
	public static String getCrossHierarchiesByParentIdAndTenantId() {
		return "select * from eg_crosshierarchy where parent=:parent and tenantid =:tenantId";
}
	public static String getInsertCrossHierarchy(){
	  return "insert into eg_crosshierarchy(id,parent,child,parenttype,childtype,tenantid,code,createdby,lastmodifiedby,createddate,lastmodifieddate) values "
	  		+ " (:id,:parent,:child,:parenttype,:childtype,:tenantid,:code,:createdby,:lastmodifiedby,:createddate,:lastmodifieddate)";	
	}
	
	public static String getUpdateCrossHierarchy(){
		return "update eg_crosshierarchy  set parent =:parent,child=:child,parenttype=:parenttype,childtype=:childtype,lastmodifiedby=:lastmodifiedby,lastmodifieddate=:lastmodifieddate where code=:code and tenantid=:tenantid";
	}
	
	public static String getCrossHierarchyByIdAndTenant(){
		return "select * from eg_crosshierarchy where id=:id and tenantid=:tenantId";
	}
	
	public static String getCrossHierarchyChildernByParentIdAndTenant(){
		return "select * from eg_boundary where tenantid=:tenantId";
	}
	
	public static String getAllCrossHierarchyByTenantId(){
		return "select * from eg_crosshierarchy where tenantid=:tenantId";
	}
	
	public static String getCrossHierarchyByCodeAndTenant(){
		return "select * from eg_crosshierarchy where code=:code and tenantid=:tenantId";
	}
	
	public static String getActiveBoundariesByNameAndBndryTypeNameAndHierarchyTypeNameAndTenantId(){
		return "select ch.id as id,child.name as childName,locparent.name as parentName ,parent.name childParentname from eg_crosshierarchy ch,eg_boundary_type childType,eg_hierarchy_type cht,"
               +" eg_boundary_type parentType,eg_hierarchy_type pht,eg_boundary child,eg_boundary parent,eg_boundary locparent where ch.parent=locparent.id and child.parent = parent.id and "
               +" ch.childtype = childType.id and UPPER(childType.name) = UPPER(:boundaryTypeName) and childtype.hierarchytype = cht.id and UPPER(cht.name) = UPPER(:hierarchyTypeName) and ch.parenttype = parentType.id and" 
               +" parentType.hierarchytype = pht.id and UPPER(pht.name) = UPPER(:parenthierarchyTypeName) and ch.child = child.id and UPPER(child.name) like UPPER(:name) and ch.tenantid=:tenantId order by child.name";
	}
}
