/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.boundary.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.boundary.exception.CustomException;
import org.egov.boundary.persistence.repository.BoundaryTypeRepository;
import org.egov.boundary.persistence.repository.HierarchyTypeRepository;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.BoundaryTypeRequest;
import org.egov.boundary.web.contract.BoundaryTypeSearchRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class BoundaryTypeService {
	
	private static final Logger LOG = LoggerFactory.getLogger(BoundaryTypeService.class);

	@Autowired
	private BoundaryTypeRepository boundaryTypeRepository;

	@Autowired
	private HierarchyTypeRepository hierarchyTypeRepository;

	public BoundaryType createBoundaryType(BoundaryType boundaryType) {
		if (boundaryType.getHierarchyType() != null && boundaryType.getHierarchyType().getCode() != null
				&& !boundaryType.getHierarchyType().getCode().isEmpty())
			boundaryType.setHierarchyType(hierarchyTypeRepository
					.findByCodeAndTenantId(boundaryType.getHierarchyType().getCode(), boundaryType.getTenantId()));

		if (boundaryType.getParent() != null && boundaryType.getParent().getCode() != null
				&& !boundaryType.getParent().getCode().isEmpty())
			boundaryType.setParent(boundaryTypeRepository.findByTenantIdAndCode(boundaryType.getTenantId(),
					boundaryType.getParent().getCode()));
		BoundaryType bndryType = null;
		try{
			bndryType = boundaryTypeRepository.save(boundaryType);
		}catch(Exception e){
			LOG.error("Exception while creating BoundaryType: ", e);
			throw new CustomException(
					Long.valueOf(HttpStatus.INTERNAL_SERVER_ERROR
							.toString()),
					BoundaryConstants.BOUNDARYTYPE_CREATE_EXCEPTION_MSG,
					BoundaryConstants.BOUNDARYTYPE_CREATE_EXCEPTION_DESC);	
		}
		return bndryType;
	}

	public BoundaryType findByIdAndTenantId(Long id, String tenantId) {
		return boundaryTypeRepository.findByIdAndTenantId(id, tenantId);
	}

	public BoundaryType updateBoundaryType(final BoundaryType boundaryType) {
		if (boundaryType.getHierarchyType() != null && boundaryType.getHierarchyType().getCode() != null
				&& !boundaryType.getHierarchyType().getCode().isEmpty())
			boundaryType.setHierarchyType(hierarchyTypeRepository
					.findByCodeAndTenantId(boundaryType.getHierarchyType().getCode(), boundaryType.getTenantId()));

		if (boundaryType.getParent() != null && boundaryType.getParent().getCode() != null
				&& !boundaryType.getParent().getCode().isEmpty())
			boundaryType.setParent(boundaryTypeRepository.findByTenantIdAndCode(boundaryType.getTenantId(),
					boundaryType.getParent().getCode()));

		BoundaryType bndryType = null;
		try{
			bndryType = boundaryTypeRepository.update(boundaryType);
		}catch(Exception e){
			LOG.error("Exception while updating BoundaryType: ", e);
			throw new CustomException(
					Long.valueOf(HttpStatus.INTERNAL_SERVER_ERROR
							.toString()),
					BoundaryConstants.BOUNDARYTYPE_UPDATE_EXCEPTION_MSG,
					BoundaryConstants.BOUNDARYTYPE_UPDATE_EXCEPTION_DESC);	
		}
		return bndryType;
	}

	public List<BoundaryType> getAllBoundarTypesByHierarchyTypeIdAndTenantName(final String hierarchyTypeName,
			final String tenantId) {
		return boundaryTypeRepository.getAllBoundarTypesByHierarchyTypeIdAndTenantName(hierarchyTypeName, tenantId);
	}

	public BoundaryType setHierarchyLevel(final BoundaryType boundaryType, final String mode) {
		if ("create".equalsIgnoreCase(mode))
			boundaryType.setHierarchy(1l);
		else {
			final Long parentBoundaryTypeId = Long.valueOf(boundaryType.getParent().getId());
			Long childHierarchy = 0l;
			Long parentHierarchy = boundaryType.getParent().getHierarchy();
			if (parentBoundaryTypeId != null)
				childHierarchy = ++parentHierarchy;
			boundaryType.setHierarchy(childHierarchy);
		}
		return boundaryType;
	}

	public BoundaryType getBoundaryTypeByNameAndHierarchyTypeName(final String boundaryTypename,
			final String hierarchyTypeName, String tenantId) {
		return boundaryTypeRepository.findByNameAndHierarchyTypeName(boundaryTypename, hierarchyTypeName, tenantId);
	}

	public BoundaryType findByTenantIdAndCode(String tenantId, String code) {
		return boundaryTypeRepository.findByTenantIdAndCode(tenantId, code);
	}

	public List<BoundaryType> getAllBoundaryTypes(BoundaryTypeRequest boundaryTypeRequest) {
		List<BoundaryType> boundaryTypes = new ArrayList<BoundaryType>();
		if (boundaryTypeRequest.getBoundaryType().getTenantId() != null
				&& !boundaryTypeRequest.getBoundaryType().getTenantId().isEmpty()) {
			if (boundaryTypeRequest.getBoundaryType().getId() != null) {
				boundaryTypes.add(boundaryTypeRepository.findByIdAndTenantId(
						Long.valueOf(boundaryTypeRequest.getBoundaryType().getId()),
						boundaryTypeRequest.getBoundaryType().getTenantId()));
			} else {
				if (boundaryTypeRequest.getBoundaryType().getCode() != null) {

					boundaryTypes.add(findByTenantIdAndCode(boundaryTypeRequest.getBoundaryType().getTenantId(),
							boundaryTypeRequest.getBoundaryType().getCode()));
				} else {
					boundaryTypes.addAll(boundaryTypeRepository
							.findAllByTenantId(boundaryTypeRequest.getBoundaryType().getTenantId()));
				}
			}
		}
		return boundaryTypes;
	}

	public List<BoundaryType> getAllBoundaryTypes(BoundaryTypeSearchRequest boundarytypeRequest) {
		List<BoundaryType> boundaryTypes = new ArrayList<BoundaryType>();
		if (boundarytypeRequest.getBoundaryType().getTenantId() != null
				&& !boundarytypeRequest.getBoundaryType().getTenantId().isEmpty()) {
			if (boundarytypeRequest.getBoundaryType().getId() != null) {
				boundaryTypes
						.add(boundaryTypeRepository.findByIdAndTenantId(boundarytypeRequest.getBoundaryType().getId(),
								boundarytypeRequest.getBoundaryType().getTenantId()));
			} else {
				if (boundarytypeRequest.getBoundaryType().getCode() != null) {
					boundaryTypes.add(findByTenantIdAndCode(boundarytypeRequest.getBoundaryType().getTenantId(),
							boundarytypeRequest.getBoundaryType().getCode()));
				} else {
					boundaryTypes.addAll(boundaryTypeRepository
							.findAllByTenantId(boundarytypeRequest.getBoundaryType().getTenantId()));
				}
			}
		}
		return boundaryTypes;
	}

	public List<BoundaryType> getAllBoundarytypesByNameAndTenant(String name, String tenantId) {
		return boundaryTypeRepository.findAllByTenantIdAndName(tenantId, name);
	}
}
