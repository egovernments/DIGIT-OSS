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

package org.egov.boundary.domain.service;

import java.util.ArrayList;

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

import java.util.List;

import org.egov.boundary.exception.CustomException;
import org.egov.boundary.persistence.repository.HierarchyTypeRepository;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.HierarchyType;
import org.egov.boundary.web.contract.HierarchyTypeRequest;
import org.egov.boundary.web.contract.HierarchyTypeSearchRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Service for the HierarchyType
 *
 * @author nayeem
 */
@Service
public class HierarchyTypeService {
	
	private static final Logger LOG = LoggerFactory.getLogger(HierarchyTypeService.class);

	private HierarchyTypeRepository hierarchyTypeRepository;

	@Autowired
	public HierarchyTypeService(HierarchyTypeRepository hierarchyTypeRepository) {
		this.hierarchyTypeRepository = hierarchyTypeRepository;
	}

	public HierarchyType createHierarchyType(HierarchyType hierarchyType) {
		HierarchyType hierarcType = null;
		try{
			hierarcType = hierarchyTypeRepository.create(hierarchyType);
		}catch(Exception e){
			LOG.error("Exception while creating HierarchyType: ", e);
			throw new CustomException(
					Long.valueOf(HttpStatus.INTERNAL_SERVER_ERROR
							.toString()),
					BoundaryConstants.HIERARCHYTYPE_CREATE_EXCEPTION_MSG,
					BoundaryConstants.HIERARCHYTYPE_CREATE_EXCEPTION_DESC);	
		}
		return hierarcType;
	}

	public HierarchyType updateHierarchyType(HierarchyType hierarchyType) {
		HierarchyType hierarcType = null;
		try{
			hierarcType = hierarchyTypeRepository.update(hierarchyType);
		}catch(Exception e){
			LOG.error("Exception while updating HierarchyType: ", e);
			throw new CustomException(
					Long.valueOf(HttpStatus.INTERNAL_SERVER_ERROR
							.toString()),
					BoundaryConstants.HIERARCHYTYPE_UPDATE_EXCEPTION_MSG,
					BoundaryConstants.HIERARCHYTYPE_UPDATE_EXCEPTION_DESC);	
		}
		return hierarcType;
	}

	public HierarchyType findByCodeAndTenantId(String code, String tenantId) {
		return hierarchyTypeRepository.findByCodeAndTenantId(code, tenantId);

	}

	public HierarchyType getHierarchyTypeByNameAndTenantId(String name, String tenantId) {
		return hierarchyTypeRepository.findByNameAndTenantId(name, tenantId);
	}

	public HierarchyType findByIdAndTenantId(Long id, String tenantId) {
		return hierarchyTypeRepository.findByIdAndTenantId(id, tenantId);

	}

	public List<HierarchyType> getAllHierarchyTypes(HierarchyTypeSearchRequest hierarchyTypeSearchRequest) {
		List<HierarchyType> hierarchyTypes = new ArrayList<HierarchyType>();
		if (hierarchyTypeSearchRequest.getHierarchyType() != null
				&& hierarchyTypeSearchRequest.getHierarchyType().getTenantId() != null
				&& !hierarchyTypeSearchRequest.getHierarchyType().getTenantId().isEmpty()) {
			if (hierarchyTypeSearchRequest.getHierarchyType().getId() != null) {
				hierarchyTypes.add(hierarchyTypeRepository.findByIdAndTenantId(
						hierarchyTypeSearchRequest.getHierarchyType().getId(),
						hierarchyTypeSearchRequest.getHierarchyType().getTenantId()));

			} else {
				if (!StringUtils.isEmpty(hierarchyTypeSearchRequest.getHierarchyType().getCode())) {
					hierarchyTypes.add(findByCodeAndTenantId(hierarchyTypeSearchRequest.getHierarchyType().getCode(),
							hierarchyTypeSearchRequest.getHierarchyType().getTenantId()));

				} else {
					hierarchyTypes.addAll(hierarchyTypeRepository
							.findAllByTenantId(hierarchyTypeSearchRequest.getHierarchyType().getTenantId()));
				}
			}
		}
		return hierarchyTypes;

	}

	public List<HierarchyType> getAllHierarchyTypes(HierarchyTypeRequest hierarchyTypeRequest) {
		List<HierarchyType> hierarchyTypes = new ArrayList<HierarchyType>();
		if (hierarchyTypeRequest.getHierarchyType() != null
				&& hierarchyTypeRequest.getHierarchyType().getTenantId() != null
				&& !hierarchyTypeRequest.getHierarchyType().getTenantId().isEmpty()) {
			if (hierarchyTypeRequest.getHierarchyType().getId() != null) {
				hierarchyTypes.add(
						hierarchyTypeRepository.findByIdAndTenantId(hierarchyTypeRequest.getHierarchyType().getId(),
								hierarchyTypeRequest.getHierarchyType().getTenantId()));

			} else {
				if (!StringUtils.isEmpty(hierarchyTypeRequest.getHierarchyType().getCode())) {
					hierarchyTypes.add(findByCodeAndTenantId(hierarchyTypeRequest.getHierarchyType().getCode(),
							hierarchyTypeRequest.getHierarchyType().getTenantId()));

				} else {
					hierarchyTypes.addAll(hierarchyTypeRepository
							.findAllByTenantId(hierarchyTypeRequest.getHierarchyType().getTenantId()));
				}
			}
		}
		return hierarchyTypes;
	}

}
