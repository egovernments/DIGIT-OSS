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
import org.egov.egf.masters.repository.ContractorRepository;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.model.masters.Contractor;
import org.egov.model.masters.ContractorSearchRequest;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author venki
 */

@Service
@Transactional(readOnly = true)
public class ContractorService implements EntityTypeService {

    @Autowired
    private ContractorRepository contractorRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private AccountDetailKeyService accountDetailKeyService;

    @Autowired
    private AccountdetailtypeService accountdetailtypeService;

    public Session getCurrentSession() {
        return entityManager.unwrap(Session.class);
    }

    public Contractor getById(final Long id) {
        return contractorRepository.findOne(id);
    }

    @Transactional
    public Contractor create(Contractor contractor) {

        setAuditDetails(contractor);
        contractor = contractorRepository.save(contractor);
        saveAccountDetailKey(contractor);
        return contractor;
    }

    @Transactional
    public void saveAccountDetailKey(Contractor contractor) {

        Accountdetailkey accountdetailkey = new Accountdetailkey();
        accountdetailkey.setDetailkey(contractor.getId().intValue());
        accountdetailkey.setDetailname(contractor.getName());
        accountdetailkey.setAccountdetailtype(accountdetailtypeService.findByName(contractor.getClass().getSimpleName()));
        accountdetailkey.setGroupid(1);
        accountDetailKeyService.create(accountdetailkey);
    }

    @Transactional
    public Contractor update(final Contractor contractor) {
        setAuditDetails(contractor);
        return contractorRepository.save(contractor);
    }

    private void setAuditDetails(Contractor contractor) {
        if (contractor.getId() == null) {
            contractor.setCreatedDate(new Date());
            contractor.setCreatedBy(ApplicationThreadLocals.getUserId());
        }
        contractor.setLastModifiedDate(new Date());
        contractor.setLastModifiedBy(ApplicationThreadLocals.getUserId());
    }

    public List<Contractor> search(final ContractorSearchRequest contractorSearchRequest) {
        final CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        final CriteriaQuery<Contractor> createQuery = cb.createQuery(Contractor.class);
        final Root<Contractor> contractors = createQuery.from(Contractor.class);
        createQuery.select(contractors);
        final Metamodel m = entityManager.getMetamodel();
        final EntityType<Contractor> contractorEntityType = m.entity(Contractor.class);

        final List<Predicate> predicates = new ArrayList<>();
        if (contractorSearchRequest.getName() != null) {
            final String name = "%" + contractorSearchRequest.getName().toLowerCase() + "%";
            predicates.add(cb.isNotNull(contractors.get("name")));
            predicates.add(cb.like(
                    cb.lower(contractors.get(contractorEntityType.getDeclaredSingularAttribute("name", String.class))), name));
        }
        if (contractorSearchRequest.getCode() != null) {
            final String code = "%" + contractorSearchRequest.getCode().toLowerCase() + "%";
            predicates.add(cb.isNotNull(contractors.get("code")));
            predicates.add(cb.like(
                    cb.lower(contractors.get(contractorEntityType.getDeclaredSingularAttribute("code", String.class))), code));
        }

        createQuery.where(predicates.toArray(new Predicate[] {}));
        final TypedQuery<Contractor> query = entityManager.createQuery(createQuery);
        return query.getResultList();

    }

    public List<Contractor> getAllActiveContractors() {
        return contractorRepository.findByStatus();
    }
    
    @Override
    public List<? extends org.egov.commons.utils.EntityType> getAllActiveEntities(Integer accountDetailTypeId) {
        return contractorRepository.findByStatus();
    }

    @Override
    public List<? extends org.egov.commons.utils.EntityType> filterActiveEntities(String filterKey, int maxRecords,
            Integer accountDetailTypeId) {
        return contractorRepository.findByNameLikeIgnoreCaseOrCodeLikeIgnoreCase(filterKey + "%", filterKey + "%");
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
