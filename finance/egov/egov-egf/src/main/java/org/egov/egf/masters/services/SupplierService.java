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
import org.egov.egf.masters.repository.SupplierRepository;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.model.masters.Supplier;
import org.egov.model.masters.SupplierSearchRequest;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author venki
 */

@Service
@Transactional(readOnly = true)
public class SupplierService implements EntityTypeService {

	@Autowired
	private SupplierRepository supplierRepository;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private AccountDetailKeyService accountDetailKeyService;

	@Autowired
	private AccountdetailtypeService accountdetailtypeService;

	public Session getCurrentSession() {
		return entityManager.unwrap(Session.class);
	}

	public Supplier getById(final Long id) {
		return supplierRepository.findOne(id);
	}

	@Transactional
	public Supplier create(Supplier supplier) {
		setAuditDetails(supplier);
		supplier = supplierRepository.save(supplier);
		saveAccountDetailKey(supplier);
		return supplier;
	}

	@Transactional
	public Supplier update(final Supplier supplier) {
		setAuditDetails(supplier);
		return supplierRepository.save(supplier);
	}

	@Transactional
	public void saveAccountDetailKey(Supplier supplier) {

		Accountdetailkey accountdetailkey = new Accountdetailkey();
		accountdetailkey.setDetailkey(supplier.getId().intValue());
		accountdetailkey.setDetailname(supplier.getName());
		accountdetailkey.setAccountdetailtype(accountdetailtypeService.findByName(supplier.getClass().getSimpleName()));
		accountdetailkey.setGroupid(1);
		accountDetailKeyService.create(accountdetailkey);
	}

	private void setAuditDetails(Supplier supplier) {
		if (supplier.getId() == null) {
			supplier.setCreatedDate(new Date());
			supplier.setCreatedBy(ApplicationThreadLocals.getUserId());
		}
		supplier.setLastModifiedDate(new Date());
		supplier.setLastModifiedBy(ApplicationThreadLocals.getUserId());
	}

	public List<Supplier> search(final SupplierSearchRequest supplierSearchRequest) {
		final CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		final CriteriaQuery<Supplier> createQuery = cb.createQuery(Supplier.class);
		final Root<Supplier> suppliers = createQuery.from(Supplier.class);
		createQuery.select(suppliers);
		final Metamodel m = entityManager.getMetamodel();
		final EntityType<Supplier> supplierEntityType = m.entity(Supplier.class);

		final List<Predicate> predicates = new ArrayList<>();
		if (supplierSearchRequest.getName() != null) {
			final String name = "%" + supplierSearchRequest.getName().toLowerCase() + "%";
			predicates.add(cb.isNotNull(suppliers.get("name")));
			predicates.add(cb.like(
					cb.lower(suppliers.get(supplierEntityType.getDeclaredSingularAttribute("name", String.class))),
					name));
		}
		if (supplierSearchRequest.getCode() != null) {
			final String code = "%" + supplierSearchRequest.getCode().toLowerCase() + "%";
			predicates.add(cb.isNotNull(suppliers.get("code")));
			predicates.add(cb.like(
					cb.lower(suppliers.get(supplierEntityType.getDeclaredSingularAttribute("code", String.class))),
					code));
		}

		createQuery.where(predicates.toArray(new Predicate[] {}));
		createQuery.orderBy(cb.asc(suppliers.get("name")));
		final TypedQuery<Supplier> query = entityManager.createQuery(createQuery);
		return query.getResultList();

	}

	public List<Supplier> getAllActiveSuppliers() {
		return supplierRepository.findByStatus();
	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> getAllActiveEntities(Integer accountDetailTypeId) {
		return supplierRepository.findByStatus();
	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> filterActiveEntities(String filterKey, int maxRecords,
			Integer accountDetailTypeId) {
		return supplierRepository.findByNameLikeIgnoreCaseOrCodeLikeIgnoreCase(filterKey + "%", filterKey + "%");
	}

	@Override
	public List<? extends org.egov.commons.utils.EntityType> getAssetCodesForProjectCode(Integer accountdetailkey)
			throws ValidationException {
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
