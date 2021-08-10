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
/**
 *
 */
package org.egov.dao.voucher;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.egov.commons.Accountdetailtype;
import org.egov.commons.CGeneralLedger;
import org.egov.commons.CGeneralLedgerDetail;
import org.egov.commons.CVoucherHeader;
import org.egov.commons.utils.EntityType;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.exception.ApplicationException;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.validation.exception.ValidationError;
import org.egov.infra.validation.exception.ValidationException;
import org.egov.infstr.services.PersistenceService;
import org.egov.utils.Constants;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Manoranjan
 *
 */
@Transactional(readOnly = true)
public class VoucherHibernateDAO extends PersistenceService<CVoucherHeader, Long> {

    private static final Logger LOGGER = Logger.getLogger(VoucherHibernateDAO.class);

    @Autowired
    private AppConfigValueService appConfigValuesService;
    private PersistenceService persistenceService;

    public VoucherHibernateDAO() {
        super(CVoucherHeader.class);
    }

    public VoucherHibernateDAO(Class<CVoucherHeader> type) {
        super(type);
    }

	public List<CVoucherHeader> getVoucherList(final CVoucherHeader voucherHeader,
			final Map<String, Object> searchFilterMap) throws ApplicationException, ParseException {

		final StringBuilder sql = new StringBuilder();
		final Map<String, Object> params = new HashMap<>();
		sql.append(" and vh.type='Journal Voucher' and vh.isConfirmed != 1 ");
		if (null != voucherHeader.getVoucherNumber() && StringUtils.isNotEmpty(voucherHeader.getVoucherNumber())) {
			sql.append(" and vh.voucherNumber like :voucherNumber");
			params.put("voucherNumber", "%" + voucherHeader.getVoucherNumber() + "%");
		}
		if (null != searchFilterMap.get(Constants.VOUCHERDATEFROM)
				&& StringUtils.isNotEmpty(searchFilterMap.get(Constants.VOUCHERDATEFROM).toString())) {
			sql.append(" and vh.voucherDate>=:voucherFromDate");
			params.put("voucherFromDate", Constants.DDMMYYYYFORMAT1.format(
					Constants.DDMMYYYYFORMAT2.parse(searchFilterMap.get(Constants.VOUCHERDATEFROM).toString())));
		}
		if (null != searchFilterMap.get(Constants.VOUCHERDATETO)
				&& StringUtils.isNotEmpty(searchFilterMap.get(Constants.VOUCHERDATETO).toString())) {
			sql.append(" and vh.voucherDate<=:voucherToDate");
			params.put("voucherToDate", Constants.DDMMYYYYFORMAT1
					.format(Constants.DDMMYYYYFORMAT2.parse(searchFilterMap.get(Constants.VOUCHERDATETO).toString())));
		}
		if (null != voucherHeader.getFundId()) {
			sql.append(" and vh.fundId=:fundId");
			params.put("fundId", voucherHeader.getFundId().getId());
		}
		if (null != voucherHeader.getVouchermis().getFundsource()) {
			sql.append(" and vh.fundsourceId=:fundsourceId");
			params.put("fundsourceId", voucherHeader.getVouchermis().getFundsource().getId());
		}
		if (null != voucherHeader.getVouchermis().getDepartmentcode()) {
			sql.append(" and vh.vouchermis.departmentcode=:departmentcode");
			params.put("departmentcode", voucherHeader.getVouchermis().getDepartmentcode());
		}

		if (voucherHeader.getVouchermis().getSchemeid() != null) {
			sql.append(" and vh.vouchermis.schemeid=:schemeid");
			params.put("schemeid", voucherHeader.getVouchermis().getSchemeid().getId());
		}

		if (null != voucherHeader.getVouchermis().getSubschemeid()) {
			sql.append(" and vh.vouchermis.subschemeid=:subschemeid");
			params.put("subschemeid", voucherHeader.getVouchermis().getSubschemeid().getId());
		}
		if (null != voucherHeader.getVouchermis().getFunctionary()) {
			sql.append(" and vh.vouchermis.functionary=:functionary");
			params.put("functionary", voucherHeader.getVouchermis().getFunctionary().getId());
		}
		if (null != voucherHeader.getVouchermis().getDivisionid()) {
			sql.append(" and vh.vouchermis.divisionid=:divisionid");
			params.put("divisionid", voucherHeader.getVouchermis().getDivisionid().getId());
		}

		if (LOGGER.isDebugEnabled())
			LOGGER.debug("sql====================" + sql.toString());
		final List<AppConfigValues> appList = appConfigValuesService.getConfigValuesByModuleAndKey("finance",
				"statusexcludeReport");
		final String statusExclude = appList.get(0).getValue();

		final Query query = getSession()
				.createQuery(new StringBuilder(" from CVoucherHeader vh where vh.status not in (:statusExclude) ")
						.append(sql.toString()).append(" order by vh.cgn,vh.voucherNumber,vh.voucherDate ").toString());
		params.put("statusExclude", statusExclude);

		params.entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
		final List<CVoucherHeader> list = query.list();
		return list;
	}

    @SuppressWarnings("unchecked")
    public CVoucherHeader getVoucherHeaderById(final Long voucherId) {

        if (LOGGER.isDebugEnabled())
            LOGGER.debug("VoucherHibernateDAO | getVoucherHeaderById | Start ");
        final List<CVoucherHeader> vhList = getSession()
                .createCriteria(CVoucherHeader.class).
                add(Restrictions.eq("id", voucherId)).list();
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("numer of voucher with voucherheaderid " + voucherId + "=" + vhList.size());
        return vhList.get(0);
    }

    @SuppressWarnings("unchecked")
    public List<CGeneralLedger> getGLInfo(final Long voucherId) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("VoucherHibernateDAO | getGLInfo | Start ");
        return getSession().createCriteria(CGeneralLedger.class).createCriteria("voucherHeaderId")
                .add(Restrictions.eq("id", voucherId)).list();

    }

    @SuppressWarnings("unchecked")
    public List<CGeneralLedgerDetail> getGeneralledgerdetail(final Long gledgerId) {

        final Criteria criteria = getSession().createCriteria(CGeneralLedgerDetail.class);
        criteria.add(Restrictions.eq("generalLedgerId.id",gledgerId));
        return criteria.list();

    }

    public Accountdetailtype getAccountDetailById(final Integer accDetailTypeId) {

        final Criteria criteria = getSession().createCriteria(Accountdetailtype.class);
        criteria.add(Restrictions.eq("id", accDetailTypeId));
        return (Accountdetailtype) criteria.list().get(0);

    }

	public EntityType getEntityInfo(final Integer detailKeyId, final Integer detailtypeId) throws NoSuchMethodException, SecurityException {
		if (LOGGER.isDebugEnabled())
			LOGGER.debug("VoucherHibernateDAO | getDetailCodeName | start");
		EntityType entity = null;
		try {
			final Accountdetailtype accountdetailtype = getAccountDetailById(detailtypeId);
			final Class<?> service = Class.forName(accountdetailtype.getFullQualifiedName());
			// getting the entity type service.
			final String detailTypeName = service.getSimpleName();
			String dataType = "";
			final java.lang.reflect.Method method = service.getMethod("getId");
			dataType = method.getReturnType().getSimpleName();
			if (dataType.equals("Long"))
				entity = (EntityType) persistenceService.find(
						String.format("from %s where id=? order by name", detailTypeName), detailKeyId.longValue());
			else
				entity = (EntityType) persistenceService
						.find(String.format("from %s where id=? order by name", detailTypeName), detailKeyId);
		} catch (final ValidationException | ClassNotFoundException e) {
			final List<ValidationError> errors = new ArrayList<ValidationError>();
			errors.add(new ValidationError("exp", e.getMessage()));
			throw new ValidationException(errors);
		}
		if (LOGGER.isDebugEnabled())
			LOGGER.debug("VoucherHibernateDAO | getDetailCodeName | End");
		return entity;

	}

	@Transactional
	@SuppressWarnings("unchecked")
	public void deleteGLDetailByVHId(final Object voucherHeaderId) {

		try {
			/**
			 * Deleting record from general ledger detail.
			 */
			final List<CGeneralLedger> glList = getGLInfo(Long.parseLong(voucherHeaderId.toString()));
			for (final CGeneralLedger generalLedger : glList) {
				final List<CGeneralLedgerDetail> glDetailList = getSession().createCriteria(CGeneralLedgerDetail.class)
						.add(Restrictions.eq("generalLedgerId.id", generalLedger.getId())).list();
				for (final CGeneralLedgerDetail generalLedgerDetail : glDetailList) {
					final Query qry = getSession()
							.createQuery("delete from EgRemittanceGldtl where generalledgerdetail.id=:gldetailId");
					qry.setInteger("gldetailId", Integer.valueOf(generalLedgerDetail.getId().toString()));
					qry.executeUpdate();
				}
			}

		} catch (final HibernateException e) {
			throw new HibernateException("exception in voucherHibDao while deleting from general ledger" + e);
		} catch (final ApplicationRuntimeException e) {
			throw new ApplicationRuntimeException("exception in voucherHibDao while deleting from general ledger" + e);
		}

	}

	@SuppressWarnings("unchecked")
	public List<CVoucherHeader> getVoucherHeaderByNumber(final Set<String> voucherNumbers) {

		if (LOGGER.isDebugEnabled())
			LOGGER.debug("VoucherHibernateDAO | getVoucherHeaderById | Start ");
		final List<CVoucherHeader> vhList = getSession().createCriteria(CVoucherHeader.class)
				.add(Restrictions.in("voucherNumber", voucherNumbers)).list();
		if (LOGGER.isDebugEnabled())
			LOGGER.debug("numer of voucher with voucherNumbers " + voucherNumbers + "=" + vhList.size());
		return vhList;
	}

    public PersistenceService getPersistenceService() {
        return persistenceService;
    }

    public void setPersistenceService(PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

}