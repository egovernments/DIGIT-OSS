package org.egov.services.report;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.lang.StringUtils;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.dao.ChartOfAccountsHibernateDAO;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.model.report.ChartOfAccountsReport;
import org.egov.utils.Constants;
import org.egov.utils.FinancialConstants;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.transform.AliasToBeanResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ChartOfAccountsReportService {

    @Autowired
    private SecurityUtils securityUtils;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private AppConfigValueService appConfigValueService;

    @Autowired
    private ChartOfAccountsHibernateDAO chartOfAccountsHibernateDAO;

    public Session getCurrentSession() {
        return entityManager.unwrap(Session.class);
    }

    public List<ChartOfAccountsReport> getCoaReport(final ChartOfAccountsReport coaSearchResultObj) {
        if (coaSearchResultObj.getAccountCode() != null) {
            final String[] accountCodes = coaSearchResultObj.getAccountCode().split("-");
            coaSearchResultObj.setAccountCode(accountCodes[0].trim());
        }

        final StringBuilder queryStr = new StringBuilder();
        queryStr.append("select detailcoa.glcode as accountCode,detailcoa.name as accountName ,");
        queryStr.append("  majorcoa.glcode as majorCode,majorcoa.name as majorName ,");
        queryStr.append("  minorcoa.glcode as minorCode,minorcoa.name as minorName ,");
        queryStr.append(" accountcodePurpose.name  as  purpose ,detailtype.name as accountDetailType,");
        queryStr.append(" detailcoa.type  as  type ,detailcoa.isActiveForPosting as isActiveForPosting");
        queryStr.append(
                " from CChartOfAccounts detailcoa left join EgfAccountcodePurpose accountcodePurpose on detailcoa.purposeId=accountcodePurpose.id ,CChartOfAccounts majorcoa,CChartOfAccounts minorcoa ,Accountdetailtype detailtype,CChartOfAccountDetail coad");
        queryStr.append(" where ");
        queryStr.append("detailcoa.parentId=minorcoa.id and minorcoa.parentId=majorcoa.id and ");
        queryStr.append("detailcoa.id=coad.glCodeId and detailtype.id=coad.detailTypeId ");

        getAppendQuery(coaSearchResultObj, queryStr);
        Query queryResult = getCurrentSession().createQuery(queryStr.toString());
        queryResult = setParametersToQuery(coaSearchResultObj, queryResult);
        final List<ChartOfAccountsReport> coaReportList = queryResult.list();

        return prepareDetailTypeNames(coaReportList);

    }

    private List<ChartOfAccountsReport> prepareDetailTypeNames(List<ChartOfAccountsReport> coaReportList) {

        Map<String, ChartOfAccountsReport> coaMap = new HashMap<String, ChartOfAccountsReport>();

        for (ChartOfAccountsReport coar : coaReportList) {

            if (coaMap.get(coar.getAccountCode()) != null) {
                coaMap.get(coar.getAccountCode()).setAccountDetailType(
                        coaMap.get(coar.getAccountCode()).getAccountDetailType() + "," + coar.getAccountDetailType());
            } else {
                coaMap.put(coar.getAccountCode(), coar);
            }
        }

        return new ArrayList(coaMap.values());
    }

    private void getAppendQuery(final ChartOfAccountsReport coaSearchResultObj, final StringBuilder queryStr) {
        if (StringUtils.isNotBlank(coaSearchResultObj.getAccountCode()))
            queryStr.append(" and detailcoa.glcode = :accountCode");
        if (StringUtils.isNotBlank(coaSearchResultObj.getMajorCode()))
            queryStr.append(" and majorcoa.id =:majorCode ");
        if (StringUtils.isNotBlank(coaSearchResultObj.getMinorCode()))
            queryStr.append(" and minorcoa.id =:minorCode ");
        if (coaSearchResultObj.getType() != null)
            queryStr.append(" and detailcoa.type =:type ");
        if (coaSearchResultObj.getPurposeId() != null)
            queryStr.append(" and accountcodePurpose.id =:purposeId");
        if (coaSearchResultObj.getDetailTypeId() != null)
            queryStr.append(" and detailtype.id =:detailTypeId ");
        if (coaSearchResultObj.getIsActiveForPosting() != null)
            queryStr.append(" and detailcoa.isActiveForPosting =:isActiveForPosting ");
        if (coaSearchResultObj.getBudgetCheckReq() != null)
            queryStr.append(" and detailcoa.budgetCheckReq =:budgetCheckReq ");
        if (coaSearchResultObj.getFunctionReqd() != null)
            queryStr.append(" and detailcoa.functionReqd =:functionReqd ");

    }

    private Query setParametersToQuery(final ChartOfAccountsReport coaSearchResultObj, final Query queryResult) {

        if (StringUtils.isNotBlank(coaSearchResultObj.getAccountCode()))
            queryResult.setString("accountCode", coaSearchResultObj.getAccountCode());
        if (coaSearchResultObj.getMajorCodeId() != null)
            queryResult.setLong("majorCode", coaSearchResultObj.getMajorCodeId());

        if (coaSearchResultObj.getMinorCodeId() != null)
            queryResult.setLong("minorCode", coaSearchResultObj.getMinorCodeId());

        if (coaSearchResultObj.getType() != null)
            queryResult.setCharacter("type", coaSearchResultObj.getType());
        if (coaSearchResultObj.getPurposeId() != null)
            queryResult.setLong("purposeId", coaSearchResultObj.getPurposeId());
        if (coaSearchResultObj.getDetailTypeId() != null)
            queryResult.setLong("detailTypeId", coaSearchResultObj.getDetailTypeId());
        if (coaSearchResultObj.getIsActiveForPosting() != null)
            queryResult.setBoolean("isActiveForPosting", coaSearchResultObj.getIsActiveForPosting());
        if (coaSearchResultObj.getFunctionReqd() != null)
            queryResult.setBoolean("functionReqd", coaSearchResultObj.getFunctionReqd());
        if (coaSearchResultObj.getBudgetCheckReq() != null)
            queryResult.setBoolean("budgetCheckReq", coaSearchResultObj.getBudgetCheckReq());
        queryResult.setResultTransformer(new AliasToBeanResultTransformer(ChartOfAccountsReport.class));
        return queryResult;
    }

    public List<CChartOfAccounts> getMinCodeListByMajorCodeId(Long parentId) {

        Integer minorCodeLength = 0;
        minorCodeLength = Integer.valueOf(appConfigValueService
                .getConfigValuesByModuleAndKey(Constants.EGF, FinancialConstants.APPCONFIG_COA_MINORCODE_LENGTH).get(0)
                .getValue());

        return chartOfAccountsHibernateDAO.findCOAByLengthAndParentId(minorCodeLength, parentId);
    }

    public int getMajorCodeLength() {
        final List<AppConfigValues> appList = appConfigValueService.getConfigValuesByModuleAndKey(Constants.EGF,
                FinancialConstants.APPCONFIG_COA_MAJORCODE_LENGTH);
        return Integer.valueOf(appList.get(0).getValue());
    }

    public int getMinorCodeLength() {
        final List<AppConfigValues> appList = appConfigValueService.getConfigValuesByModuleAndKey(Constants.EGF,
                FinancialConstants.APPCONFIG_COA_MINORCODE_LENGTH);
        return Integer.valueOf(appList.get(0).getValue());
    }

    public List<CChartOfAccounts> getMajorCodeList() {
        return chartOfAccountsHibernateDAO.findCOAByLength(getMajorCodeLength());
    }

    public List<CChartOfAccounts> getMinorCodeList() {
        return chartOfAccountsHibernateDAO.findCOAByLength(getMinorCodeLength());
    }

}
