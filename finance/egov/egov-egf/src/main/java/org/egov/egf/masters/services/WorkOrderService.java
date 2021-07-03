/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
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
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
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
 *
 */
package org.egov.egf.masters.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.Metamodel;

import org.egov.commons.Accountdetailkey;
import org.egov.commons.service.AccountDetailKeyService;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.commons.service.EntityTypeService;
import org.egov.commons.service.FundService;
import org.egov.egf.masters.repository.WorkOrderRepository;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.model.masters.WorkOrder;
import org.egov.model.masters.WorkOrderSearchRequest;
import org.egov.services.masters.SchemeService;
import org.egov.services.masters.SubSchemeService;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author venki
 */

@Service
@Transactional(readOnly = true)
public class WorkOrderService implements EntityTypeService {

	@Autowired
	private WorkOrderRepository workOrderRepository;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private AccountDetailKeyService accountDetailKeyService;

	@Autowired
	private AccountdetailtypeService accountdetailtypeService;

	@Autowired
	private FundService fundService;

	@Autowired
	private ContractorService contractorService;

	@Autowired
	private SchemeService schemeService;

	@Autowired
	private SubSchemeService subSchemeService;

	public Session getCurrentSession() {
		return entityManager.unwrap(Session.class);
	}

	public WorkOrder getById(final Long id) {
		return workOrderRepository.findOne(id);
	}

	public List<WorkOrder> getByContractorId(final Long contractorId) {
		return workOrderRepository.findByContractor_Id(contractorId);
	}

	public WorkOrder getByOrderNumber(final String orderNumber) {
		return workOrderRepository.findByOrderNumber(orderNumber);
	}

	@SuppressWarnings("deprecation")
	@Transactional
	public WorkOrder create(WorkOrder workOrder) {

		setAuditDetails(workOrder);
		if (workOrder.getFund() != null && workOrder.getFund().getId() != null) {
			workOrder.setFund(fundService.findOne(workOrder.getFund().getId()));
		}
		if (workOrder.getScheme() != null && workOrder.getScheme().getId() != null) {
			workOrder.setScheme(schemeService.findById(workOrder.getScheme().getId(), false));
		} else {
			workOrder.setScheme(null);
		}
		if (workOrder.getSubScheme() != null && workOrder.getSubScheme().getId() != null) {
			workOrder.setSubScheme(subSchemeService.findById(workOrder.getSubScheme().getId(), false));
		} else {
			workOrder.setSubScheme(null);
		}
		if (workOrder.getContractor() != null && workOrder.getContractor().getId() != null) {
			workOrder.setContractor(contractorService.getById(workOrder.getContractor().getId()));
		}
		workOrder = workOrderRepository.save(workOrder);
		saveAccountDetailKey(workOrder);
		return workOrder;
	}

	@Transactional
	public void saveAccountDetailKey(WorkOrder workOrder) {

		Accountdetailkey accountdetailkey = new Accountdetailkey();
		accountdetailkey.setDetailkey(workOrder.getId().intValue());
		accountdetailkey.setDetailname(workOrder.getName());
		accountdetailkey
				.setAccountdetailtype(accountdetailtypeService.findByName(workOrder.getClass().getSimpleName()));
		accountdetailkey.setGroupid(1);
		accountDetailKeyService.create(accountdetailkey);
	}

	@SuppressWarnings("deprecation")
	@Transactional
	public WorkOrder update(WorkOrder workOrder) {
		if (workOrder.getEditAllFields().booleanValue()) {
			setAuditDetails(workOrder);
			if (workOrder.getFund() != null && workOrder.getFund().getId() != null) {
				workOrder.setFund(fundService.findOne(workOrder.getFund().getId()));
			}
			if (workOrder.getScheme() != null && workOrder.getScheme().getId() != null) {
				workOrder.setScheme(schemeService.findById(workOrder.getScheme().getId(), false));
			} else {
				workOrder.setScheme(null);
			}
			if (workOrder.getSubScheme() != null && workOrder.getSubScheme().getId() != null) {
				workOrder.setSubScheme(subSchemeService.findById(workOrder.getSubScheme().getId(), false));
			} else {
				workOrder.setSubScheme(null);
			}
			if (workOrder.getContractor() != null && workOrder.getContractor().getId() != null) {
				workOrder.setContractor(contractorService.getById(workOrder.getContractor().getId()));
			}
			workOrder = workOrderRepository.save(workOrder);
		} else {
			setAuditDetails(workOrder);
			WorkOrder savedWorkOrder = workOrderRepository.findOne(workOrder.getId());
			savedWorkOrder.setName(workOrder.getName());
			savedWorkOrder.setDescription(workOrder.getDescription());
			savedWorkOrder.setActive(workOrder.getActive());
			savedWorkOrder.setSanctionNumber(workOrder.getSanctionNumber());
			savedWorkOrder.setSanctionDate(workOrder.getSanctionDate());

			workOrder = workOrderRepository.save(savedWorkOrder);
		}
		return workOrder;
	}

	private void setAuditDetails(WorkOrder workOrder) {
		if (workOrder.getId() == null) {
			workOrder.setCreatedDate(new Date());
			workOrder.setCreatedBy(ApplicationThreadLocals.getUserId());
		}
		workOrder.setLastModifiedDate(new Date());
		workOrder.setLastModifiedBy(ApplicationThreadLocals.getUserId());
	}

	public List<WorkOrder> search(final WorkOrderSearchRequest workOrderSearchRequest) {
		final CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		final CriteriaQuery<WorkOrder> createQuery = cb.createQuery(WorkOrder.class);
		final Root<WorkOrder> workOrders = createQuery.from(WorkOrder.class);
		createQuery.select(workOrders);
		final Metamodel m = entityManager.getMetamodel();
		final EntityType<WorkOrder> workOrderEntityType = m.entity(WorkOrder.class);

		final List<Predicate> predicates = new ArrayList<>();
		if (workOrderSearchRequest.getName() != null) {
			final String name = "%" + workOrderSearchRequest.getName().toLowerCase() + "%";
			predicates.add(cb.isNotNull(workOrders.get("name")));
			predicates.add(cb.like(
					cb.lower(workOrders.get(workOrderEntityType.getDeclaredSingularAttribute("name", String.class))),
					name));
		}
		if (workOrderSearchRequest.getOrderNumber() != null) {
			final String code = "%" + workOrderSearchRequest.getOrderNumber().toLowerCase() + "%";
			predicates.add(cb.isNotNull(workOrders.get("orderNumber")));
			predicates.add(cb.like(
					cb.lower(workOrders
							.get(workOrderEntityType.getDeclaredSingularAttribute("orderNumber", String.class))),
					code));
		}

		if (workOrderSearchRequest.getContractorId() != null) {
			predicates.add(cb.equal(workOrders.get("contractor").get("id"), workOrderSearchRequest.getContractorId()));
		}
		if (workOrderSearchRequest.getFundId() != null) {
			predicates.add(cb.equal(workOrders.get("fund").get("id"), workOrderSearchRequest.getFundId()));
		}

		createQuery.where(predicates.toArray(new Predicate[] {}));
		final TypedQuery<WorkOrder> query = entityManager.createQuery(createQuery);
		return query.getResultList();

	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> getAllActiveEntities(Integer accountDetailTypeId) {

		return workOrderRepository.findActiveOrders();
	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> filterActiveEntities(String filterKey, int maxRecords,
			Integer accountDetailTypeId) {
		return workOrderRepository.findByNameLikeIgnoreCaseOrOrderNumberLikeIgnoreCaseAndActive(filterKey + "%",
				filterKey + "%", true);
	}

	@Override
	public List<?> getAssetCodesForProjectCode(Integer accountdetailkey) throws ValidationException {
		return Collections.emptyList();
	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> validateEntityForRTGS(List<Long> idsList)
			throws ValidationException {
		return Collections.emptyList();
	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> getEntitiesById(List<Long> idsList)
			throws ValidationException {
		return Collections.emptyList();
	}

}
