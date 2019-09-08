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
package org.egov.commons.service;

import java.util.List;

import org.egov.commons.model.BusinessCategory;
import org.egov.commons.model.BusinessCategoryCriteria;
import org.egov.commons.repository.BusinessCategoryRepository;
import org.egov.commons.web.contract.BusinessCategoryRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BusinessCategoryService {

	private BusinessCategoryRepository businessCategoryRepository;
	private LogAwareKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	public BusinessCategoryService(LogAwareKafkaTemplate<String, Object> kafkaTemplate,
			BusinessCategoryRepository businessCategoryRepository) {
		this.kafkaTemplate = kafkaTemplate;
		this.businessCategoryRepository = businessCategoryRepository;
	}

	public BusinessCategoryService(BusinessCategoryRepository businessCategoryRepository) {
		this.businessCategoryRepository = businessCategoryRepository;
	}

	public BusinessCategoryRequest createAsync(BusinessCategoryRequest businessCategoryRequest) {
		kafkaTemplate.send("egov-common-business-category-create", businessCategoryRequest);
		return businessCategoryRequest;
	}

	public void create(List<BusinessCategory> businessCategories) {
		businessCategoryRepository.create(businessCategories);

	}

	public BusinessCategoryRequest updateAsync(BusinessCategoryRequest businessCategoryRequest) {
		kafkaTemplate.send("egov-common-business-category-update", businessCategoryRequest);
		return businessCategoryRequest;
	}

	public void update(List<BusinessCategory> businessCategories) {
		businessCategoryRepository.update(businessCategories);
	}

	public List<BusinessCategory> getForCriteria(BusinessCategoryCriteria criteria) {

		return businessCategoryRepository.getForCriteria(criteria);
	}

	public boolean getBusinessCategoryByNameAndTenantId(String name, String tenantId, Long id, Boolean isUpdate) {
		return businessCategoryRepository.checkCategoryByNameAndTenantIdExists(name, tenantId, id, isUpdate);
	}

	public boolean getBusinessCategoryByCodeAndTenantId(String code, String tenantId, Long id, Boolean isUpdate) {

		return businessCategoryRepository.checkCategoryByCodeAndTenantIdExists(code, tenantId, id, isUpdate);
	}

	public BusinessCategory getBusinessCategoryByIdAndTenantId(Long id, String tenantId) {

		return businessCategoryRepository.getByIdAndTenantId(id, tenantId);
	}

}