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

package org.egov.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.infra.config.persistence.datasource.routing.annotation.ReadOnly;
import org.egov.infstr.services.PersistenceService;
import org.egov.model.budget.Budget;
import org.egov.model.budget.BudgetUploadReport;
import org.egov.services.budget.BudgetService;
import org.hibernate.Query;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BigDecimalType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BudgetUploadReportService {

    @Autowired
    @Qualifier("budgetService")
    private BudgetService budgetService;

    @Autowired
    @Qualifier("persistenceService")
    private PersistenceService persistenceService;

	@ReadOnly
	public List<BudgetUploadReport> search(BudgetUploadReport budgetUploadReport) {

		String reMaterializedPath = "", beMaterializedPath = "";
		Long functionId = null;
		Long fundId = null;
		String deptCode = null;
		Budget reBudget = new Budget();
		Budget beBudget = new Budget();
		if (budgetUploadReport.getReBudget() != null && budgetUploadReport.getReBudget().getId() != null) {
			reBudget = budgetService.findById(budgetUploadReport.getReBudget().getId(), false);
			reMaterializedPath = reBudget.getMaterializedPath();
		}

		if (reBudget != null) {
			beBudget = budgetService.getReferenceBudgetFor(reBudget);
			beMaterializedPath = beBudget.getMaterializedPath();
		}

		if (budgetUploadReport.getFund() != null && budgetUploadReport.getFund().getId() != null)
			fundId = budgetUploadReport.getFund().getId();

		if (budgetUploadReport.getFunction() != null && budgetUploadReport.getFunction().getId() != null)
			functionId = budgetUploadReport.getFunction().getId();

		if (budgetUploadReport.getDepartment() != null && budgetUploadReport.getDepartment().getCode() != null)
			deptCode = budgetUploadReport.getDepartment().getCode();

		List<BudgetUploadReport> budgetUploadReportList = new ArrayList<BudgetUploadReport>();
		final Map<String, Object> params = new HashMap<>();
		Query query = persistenceService.getSession()
				.createSQLQuery(getQuery(reMaterializedPath, beMaterializedPath, fundId, functionId, deptCode, params))
				.addScalar("fundCode", StringType.INSTANCE).addScalar("functionCode", StringType.INSTANCE)
				.addScalar("glCode", StringType.INSTANCE).addScalar("deptCode", StringType.INSTANCE)
				.addScalar("approvedReAmount", BigDecimalType.INSTANCE)
				.addScalar("planningReAmount", BigDecimalType.INSTANCE)
				.addScalar("approvedBeAmount", BigDecimalType.INSTANCE)
				.addScalar("planningBeAmount", BigDecimalType.INSTANCE)
				.setResultTransformer(Transformers.aliasToBean(BudgetUploadReport.class));
		params.entrySet().forEach(entry -> query.setParameter(entry.getKey(), entry.getValue()));
		budgetUploadReportList = query.list();

		return budgetUploadReportList;
	}

	public String getQuery(final String reMaterializedPath, final String beMaterializedPath, final Long fundId,
			final Long functionId, final String deptCode, final Map<String, Object> params) {

		final StringBuilder subQuery = new StringBuilder();
		String reMaterializedPathQuery = "";
		String beMaterializedPathQuery = "";
		if (reMaterializedPath != null) {
			reMaterializedPathQuery = " and bd.materializedpath like :reMaterializedPath";
			params.put("reMaterializedPath", reMaterializedPath + "%");
		}
		if (beMaterializedPath != null) {
			beMaterializedPathQuery = " and bd.materializedpath like :beMaterializedPath";
			params.put("beMaterializedPath", beMaterializedPath + "%");
		}
		if (fundId != null) {
			subQuery.append(" and bd.fund = :fundId");
			params.put("fundId", fundId);
		}
		if (deptCode != null) {
			subQuery.append(" and bd.executing_department  = :deptCode");
			params.put("deptCode", deptCode);
		}
		if (functionId != null) {
			subQuery.append(" and bd.function = :functionId");
			params.put("functionId", functionId);
		}

		return new StringBuilder("SELECT budgetuploadreport.fundCode ,budgetuploadreport.functionCode,").append(
				"budgetuploadreport.glCode,budgetuploadreport.deptCode,sum(budgetuploadreport.approvedReAmount)")
				.append(" as approvedReAmount,sum(budgetuploadreport.planningReAmount) as planningReAmount,")
				.append("sum(budgetuploadreport.approvedBeAmount) as approvedBeAmount,sum(budgetuploadreport.planningBeAmount)")
				.append(" as planningBeAmount FROM ")
				.append("(SELECT f.code AS fundCode,fn.code  AS functionCode,bg.name AS glCode,bd.executing_department ")
				.append(" AS deptCode,bd.approvedamount AS approvedReAmount,bd.budgetavailable AS planningReAmount,")
				.append("0 AS approvedBeAmount,0 AS planningBeAmount  FROM egf_budgetdetail bd , egf_budgetgroup bg , fund f, ")
				.append("function fn,chartofaccounts coa,egw_status st WHERE bd.status  = st.id ")
				.append(" AND st.moduletype  = 'BUDGETDETAIL' AND st.code  = 'Created' AND bd.budgetgroup = bg.id")
				.append("  AND bg.mincode = coa.id AND bd.fund = f.id AND bd.function  = fn.id ").append(subQuery)
				.append(" ").append(reMaterializedPathQuery)
				.append(" UNION SELECT f.code  AS fundCode,fn.code AS functionCode,bg.name AS glCode, ")
				.append("bd.executing_department  AS deptCode,0 AS approvedReAmount,0 AS planningReAmount,")
				.append("bd.approvedamount AS approvedBeAmount,bd.budgetavailable AS planningBeAmount")
				.append(" FROM egf_budgetdetail bd ,egf_budgetgroup bg ,fund f,function fn,chartofaccounts coa,")
				.append("egw_status st WHERE bd.status = st.id ")
				.append("AND st.moduletype = 'BUDGETDETAIL' AND st.code   = 'Created' AND bd.budgetgroup  = bg.id")
				.append(" AND bg.mincode  = coa.id AND bd.fund  = f.id AND bd.function = fn.id ").append(subQuery)
				.append(" ").append(beMaterializedPathQuery)
				.append(" )  budgetuploadreport GROUP BY budgetuploadreport.fundCode ,budgetuploadreport.functionCode,")
				.append("budgetuploadreport.glCode,budgetuploadreport.deptCode ").toString();
	}
}