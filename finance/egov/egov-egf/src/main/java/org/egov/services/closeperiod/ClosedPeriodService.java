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

package org.egov.services.closeperiod;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.IntStream;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.metamodel.Metamodel;

import org.egov.commons.CFinancialYear;
import org.egov.commons.service.CFinancialYearService;
import org.egov.egf.model.ClosedPeriod;
import org.egov.egf.model.ClosedPeriodSearchRequest;
import org.egov.repository.closeperiod.ClosedPeriodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

@Service
@Transactional(readOnly = true)
public class ClosedPeriodService {
	final SimpleDateFormat dtFormat = new SimpleDateFormat("dd-MM-yyyy");

	@Autowired
	private final ClosedPeriodRepository closedPeriodRepository;
	@Autowired
	CFinancialYearService cFinancialYearService;
	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	public ClosedPeriodService(final ClosedPeriodRepository closedPeriodRepository) {
		this.closedPeriodRepository = closedPeriodRepository;
	}

	@Transactional
	public ClosedPeriod create(final ClosedPeriod closedPeriod) {
		closedPeriod.setIsClosed(true);
		return closedPeriodRepository.save(closedPeriod);
	}

	@Transactional
	public ClosedPeriod update(final ClosedPeriod closedPeriod) {
		closedPeriod.setIsClosed(false);
		return closedPeriodRepository.save(closedPeriod);
	}

	@Transactional
	public void delete(final ClosedPeriod closedPeriod) {
		closedPeriodRepository.delete(closedPeriod);

	}

	public List<ClosedPeriod> findAll() {
		return closedPeriodRepository.findAll(new Sort(Sort.Direction.ASC, "financialYear"));
	}

	public ClosedPeriod findOne(final Long id) {
		return closedPeriodRepository.findOne(id);

	}

	public List<ClosedPeriod> search(final ClosedPeriodSearchRequest closedPeriodSearchRequest) {
		final CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		final CriteriaQuery<ClosedPeriod> createQuery = cb.createQuery(ClosedPeriod.class);

		final Root<ClosedPeriod> closedPeriods = createQuery.from(ClosedPeriod.class);
		createQuery.select(closedPeriods);
		final Metamodel m = entityManager.getMetamodel();
		m.entity(ClosedPeriod.class);

		final List<Predicate> predicates = new ArrayList<>();
		if (closedPeriodSearchRequest.getFinancialYearId() != null)
			predicates
					.add(cb.equal(closedPeriods.get("financialYear"), closedPeriodSearchRequest.getFinancialYearId()));

		if (closedPeriodSearchRequest.getIsClosed().booleanValue())
			predicates.add(cb.equal(closedPeriods.get("isClosed"), true));

		if (closedPeriodSearchRequest.getCloseType() != null) {
			predicates.add(cb.equal(closedPeriods.get("closeType"), closedPeriodSearchRequest.getCloseType()));
		}

		createQuery.where(predicates.toArray(new Predicate[] {}));
		final TypedQuery<ClosedPeriod> query = entityManager.createQuery(createQuery);
		return query.getResultList();

	}

	public void prepareSartingDateAndEndingDate(final ClosedPeriod closedPeriods) {

		final String[] year = closedPeriods.getFinancialYear().getFinYearRange().split("-");

		int fromYear;
		int toYear;
		final int firstDay = 01;
		final int fromMonth = closedPeriods.getFromDate();
		final int toMonth = closedPeriods.getToDate();
		Date startingDate = new Date();
		Date endingDate = new Date();
		if (closedPeriods.getFromDate() != 0) {
			if (IntStream.of(1, 2, 3).anyMatch(num -> num == closedPeriods.getFromDate()))
				fromYear = Integer.valueOf(year[0]) + 1;
			else
				fromYear = Integer.valueOf(year[0]);
			startingDate = getDateBasedOnDay(fromYear, fromMonth, firstDay, "FIRST");
		}
		if (closedPeriods.getToDate() != 0) {
			if (IntStream.of(1, 2, 3).anyMatch(num -> num == closedPeriods.getToDate()))
				toYear = Integer.valueOf(year[0]) + 1;
			else
				toYear = Integer.valueOf(year[0]);
			endingDate = getDateBasedOnDay(toYear, toMonth, firstDay, "LAST");
		}
		final String sdFormat = dtFormat.format(startingDate);
		final String edFormat = dtFormat.format(endingDate);

		try {
			closedPeriods.setStartingDate(dtFormat.parse(sdFormat));
			closedPeriods.setEndingDate(dtFormat.parse(edFormat));
		} catch (final ParseException e) {
			
		}

	}

	private Date getDateBasedOnDay(final int year, final int month, final int firstDay, final String dayType) {
		Date date = new Date();
		final Calendar calendar = Calendar.getInstance();
		if (dayType.equalsIgnoreCase("LAST")) {
			calendar.set(year, month - 1, firstDay);
			calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
			date = calendar.getTime();

		} else if (dayType.equalsIgnoreCase("FIRST")) {
			calendar.set(year, month - 1, firstDay);
			date = calendar.getTime();
		}
		return date;
	}

	public void validateClosedPeriods(final ClosedPeriod closedPeriods, final BindingResult errors) {
		final Date startingDate = closedPeriods.getStartingDate();
		final Date endingDate = closedPeriods.getEndingDate();
		final Long finId = closedPeriods.getFinancialYear().getId();
		final String startDate = dtFormat.format(startingDate);
		final String endDate = dtFormat.format(endingDate);
		if (closedPeriods.getStartingDate() != null && closedPeriods.getEndingDate() != null)
			if (startingDate.after(endingDate))
				errors.reject("msg.startingdate.endingdate.greater", new String[] {}, null);
		final List<ClosedPeriod> dateGreaterThanEqualAndIsClosedTrue = closedPeriodRepository.getAllClosedPeriods(finId,
				startingDate, endingDate, startingDate, endingDate);
		if (!dateGreaterThanEqualAndIsClosedTrue.isEmpty())
			errors.reject("msg.startingdate.endingdate.range.present.closedperiod", new String[] { startDate, endDate },
					null);
	}

	public List<CFinancialYear> getAllSoftClosePeriods() {
		return closedPeriodRepository.getAllSoftClosedPeriods();

	}

}