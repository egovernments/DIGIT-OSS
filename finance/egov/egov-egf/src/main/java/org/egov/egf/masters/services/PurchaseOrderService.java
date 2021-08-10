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
import org.egov.egf.masters.repository.PurchaseOrderRepository;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.model.masters.PurchaseOrder;
import org.egov.model.masters.PurchaseOrderSearchRequest;
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
public class PurchaseOrderService implements EntityTypeService {

	@Autowired
	private PurchaseOrderRepository purchaseOrderRepository;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private AccountDetailKeyService accountDetailKeyService;

	@Autowired
	private AccountdetailtypeService accountdetailtypeService;

	@Autowired
	private FundService fundService;

	@Autowired
	private SupplierService supplierService;

	@Autowired
	private SchemeService schemeService;

	@Autowired
	private SubSchemeService subSchemeService;

	public Session getCurrentSession() {
		return entityManager.unwrap(Session.class);
	}

	public PurchaseOrder getById(final Long id) {
		return purchaseOrderRepository.findOne(id);
	}

	public List<PurchaseOrder> getBySupplierId(final Long supplierId) {
		return purchaseOrderRepository.findBySupplier_Id(supplierId);
	}

	public PurchaseOrder getByOrderNumber(final String orderNumber) {
		return purchaseOrderRepository.findByOrderNumber(orderNumber);
	}

	@SuppressWarnings("deprecation")
	@Transactional
	public PurchaseOrder create(PurchaseOrder purchaseOrder) {

		setAuditDetails(purchaseOrder);
		if (purchaseOrder.getFund() != null && purchaseOrder.getFund().getId() != null) {
			purchaseOrder.setFund(fundService.findOne(purchaseOrder.getFund().getId()));
		}
		if (purchaseOrder.getScheme() != null && purchaseOrder.getScheme().getId() != null) {
			purchaseOrder.setScheme(schemeService.findById(purchaseOrder.getScheme().getId(), false));
		} else {
			purchaseOrder.setScheme(null);
		}
		if (purchaseOrder.getSubScheme() != null && purchaseOrder.getSubScheme().getId() != null) {
			purchaseOrder.setSubScheme(subSchemeService.findById(purchaseOrder.getSubScheme().getId(), false));
		} else {
			purchaseOrder.setSubScheme(null);
		}
		if (purchaseOrder.getSupplier() != null && purchaseOrder.getSupplier().getId() != null) {
			purchaseOrder.setSupplier(supplierService.getById(purchaseOrder.getSupplier().getId()));
		}
		purchaseOrder = purchaseOrderRepository.save(purchaseOrder);
		saveAccountDetailKey(purchaseOrder);
		return purchaseOrder;
	}

	@Transactional
	public void saveAccountDetailKey(PurchaseOrder purchaseOrder) {

		Accountdetailkey accountdetailkey = new Accountdetailkey();
		accountdetailkey.setDetailkey(purchaseOrder.getId().intValue());
		accountdetailkey.setDetailname(purchaseOrder.getName());
		accountdetailkey
				.setAccountdetailtype(accountdetailtypeService.findByName(purchaseOrder.getClass().getSimpleName()));
		accountdetailkey.setGroupid(1);
		accountDetailKeyService.create(accountdetailkey);
	}

	@SuppressWarnings("deprecation")
	@Transactional
	public PurchaseOrder update(PurchaseOrder purchaseOrder) {

		if (purchaseOrder.getEditAllFields().booleanValue()) {
			setAuditDetails(purchaseOrder);
			if (purchaseOrder.getFund() != null && purchaseOrder.getFund().getId() != null) {
				purchaseOrder.setFund(fundService.findOne(purchaseOrder.getFund().getId()));
			}
			if (purchaseOrder.getScheme() != null && purchaseOrder.getScheme().getId() != null) {
				purchaseOrder.setScheme(schemeService.findById(purchaseOrder.getScheme().getId(), false));
			} else {
				purchaseOrder.setScheme(null);
			}
			if (purchaseOrder.getSubScheme() != null && purchaseOrder.getSubScheme().getId() != null) {
				purchaseOrder.setSubScheme(subSchemeService.findById(purchaseOrder.getSubScheme().getId(), false));
			} else {
				purchaseOrder.setSubScheme(null);
			}
			if (purchaseOrder.getSupplier() != null && purchaseOrder.getSupplier().getId() != null) {
				purchaseOrder.setSupplier(supplierService.getById(purchaseOrder.getSupplier().getId()));
			}
			purchaseOrder = purchaseOrderRepository.save(purchaseOrder);
		} else {
			PurchaseOrder savedPurchaseOrder = purchaseOrderRepository.findOne(purchaseOrder.getId());
			savedPurchaseOrder.setName(purchaseOrder.getName());
			savedPurchaseOrder.setDescription(purchaseOrder.getDescription());
			savedPurchaseOrder.setActive(purchaseOrder.getActive());
			savedPurchaseOrder.setSanctionNumber(purchaseOrder.getSanctionNumber());
			savedPurchaseOrder.setSanctionDate(purchaseOrder.getSanctionDate());
			setAuditDetails(savedPurchaseOrder);
			purchaseOrder = purchaseOrderRepository.save(savedPurchaseOrder);
		}
		return purchaseOrder;
	}

	private void setAuditDetails(PurchaseOrder purchaseOrder) {
		if (purchaseOrder.getId() == null) {
			purchaseOrder.setCreatedDate(new Date());
			purchaseOrder.setCreatedBy(ApplicationThreadLocals.getUserId());
		}
		purchaseOrder.setLastModifiedDate(new Date());
		purchaseOrder.setLastModifiedBy(ApplicationThreadLocals.getUserId());
	}

	public List<PurchaseOrder> search(final PurchaseOrderSearchRequest purchaseOrderSearchRequest) {
		final CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		final CriteriaQuery<PurchaseOrder> createQuery = cb.createQuery(PurchaseOrder.class);
		final Root<PurchaseOrder> purchaseOrders = createQuery.from(PurchaseOrder.class);
		createQuery.select(purchaseOrders);
		final Metamodel m = entityManager.getMetamodel();
		final EntityType<PurchaseOrder> purchaseOrderEntityType = m.entity(PurchaseOrder.class);

		final List<Predicate> predicates = new ArrayList<>();
		if (purchaseOrderSearchRequest.getName() != null) {
			final String name = "%" + purchaseOrderSearchRequest.getName().toLowerCase() + "%";
			predicates.add(cb.isNotNull(purchaseOrders.get("name")));
			predicates
					.add(cb.like(
							cb.lower(purchaseOrders
									.get(purchaseOrderEntityType.getDeclaredSingularAttribute("name", String.class))),
							name));
		}
		if (purchaseOrderSearchRequest.getOrderNumber() != null) {
			final String code = "%" + purchaseOrderSearchRequest.getOrderNumber().toLowerCase() + "%";
			predicates.add(cb.isNotNull(purchaseOrders.get("orderNumber")));
			predicates.add(cb.like(
					cb.lower(purchaseOrders
							.get(purchaseOrderEntityType.getDeclaredSingularAttribute("orderNumber", String.class))),
					code));
		}
		if (purchaseOrderSearchRequest.getSupplierId() != null) {
			predicates.add(
					cb.equal(purchaseOrders.get("supplier").get("id"), purchaseOrderSearchRequest.getSupplierId()));
		}

		if (purchaseOrderSearchRequest.getFundId() != null) {
			predicates.add(cb.equal(purchaseOrders.get("fund").get("id"), purchaseOrderSearchRequest.getFundId()));
		}

		createQuery.where(predicates.toArray(new Predicate[] {}));
		final TypedQuery<PurchaseOrder> query = entityManager.createQuery(createQuery);
		return query.getResultList();

	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> getAllActiveEntities(Integer accountDetailTypeId) {

		return purchaseOrderRepository.findActiveOrders();
	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> filterActiveEntities(String filterKey, int maxRecords,
			Integer accountDetailTypeId) {
		return purchaseOrderRepository.findByNameLikeIgnoreCaseOrOrderNumberLikeIgnoreCaseAndActive(filterKey + "%",
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
