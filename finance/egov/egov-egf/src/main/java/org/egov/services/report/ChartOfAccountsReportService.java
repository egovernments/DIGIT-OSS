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
import org.egov.infstr.services.PersistenceService;
import org.egov.model.report.ChartOfAccountsReport;
import org.egov.utils.Constants;
import org.egov.utils.FinancialConstants;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.transform.AliasToBeanResultTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
    @Qualifier("persistenceService")
    private PersistenceService persistenceService;

    @Autowired
    private AppConfigValueService appConfigValueService;

    @Autowired
    private ChartOfAccountsHibernateDAO chartOfAccountsHibernateDAO;

    public Session getCurrentSession() {
        return entityManager.unwrap(Session.class);
    }

    public List<ChartOfAccountsReport> getCoaReport(final ChartOfAccountsReport coaSearchResultObj) {
        Map<Character,String> typeNameMap = new HashMap();
        typeNameMap.put('I', "Income");
        typeNameMap.put('E', "Expense");
        typeNameMap.put('L', "Liability");
        typeNameMap.put('A', "Asset");
        if (coaSearchResultObj.getAccountCode() != null) {
            final String[] accountCodes = coaSearchResultObj.getAccountCode().split("-");
            coaSearchResultObj.setAccountCode(accountCodes[0].trim());
        }

		final StringBuilder queryStr = new StringBuilder();
		queryStr.append(" select coa.glcode as accountCode,coa.name as accountName,")
				.append("concat(minorcoa.glcode,'-',minorcoa.name) as ")
				.append(" minorCode,concat(majorcoa.glcode,'-',majorcoa.name) as majorCode,acp.name as purpose,")
				.append("string_agg(acdt.name,',') as accountDetailType ")
				.append(" ,coa.type as type,coa.isactiveforposting as isActiveForPosting  ")
				.append(" from chartofaccounts coa ")
				.append(" left join chartofaccountdetail coad on coa.id=coad.glcodeid ")
				.append(" left join accountdetailtype acdt on acdt.id=coad.detailtypeid")
				.append(" left join egf_accountcode_purpose acp on coa.purposeid=acp.id ")
				.append(",chartofaccounts minorcoa,chartofaccounts majorcoa,chartofaccounts parent")
				.append(" where coa.parentid=minorcoa.id and minorcoa.parentid=majorcoa.id and majorcoa.parentid=parent.id ");
		getAppendQuery(coaSearchResultObj, queryStr);
		queryStr.append(" group by coa.glcode,minorcoa.glcode,majorcoa.glcode,parent.glcode,coa.name,minorcoa.name,")
		.append("majorcoa.name,acp.name,coa.type,coa.isactiveforposting order by coa.glcode asc ");

        SQLQuery queryResult = persistenceService.getSession().createSQLQuery(queryStr.toString());
        setParametersToQuery(coaSearchResultObj, queryResult);
        final List<Object[]> coaReportList = queryResult.list();
        List<ChartOfAccountsReport> coaReport = new ArrayList<ChartOfAccountsReport>();
        for(Object[] obj : coaReportList) {
            ChartOfAccountsReport report = new ChartOfAccountsReport();
            report.setAccountCode(obj[0].toString());
            report.setAccountName(obj[1].toString());
            report.setMajorCode(obj[3].toString());
            report.setMinorCode(obj[2].toString());
            report.setPurpose(obj[4] != null ? obj[4].toString():null);
            report.setAccountDetailType(obj[5] !=null ? obj[5].toString(): null );

            report.setType(typeNameMap.get(obj[6].toString().charAt(0)));
            report.setIsActiveForPosting((Boolean) obj[7]);
            coaReport.add(report);
        }

        return coaReport;

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
            queryStr.append(" and coa.glcode = :accountCode");
        if (coaSearchResultObj.getMajorCodeId()!=null)
            queryStr.append(" and majorcoa.id =:majorCodeId ");
        if (coaSearchResultObj.getMinorCodeId()!=null)
            queryStr.append(" and minorcoa.id =:minorCodeId ");
        if (coaSearchResultObj.getType() != null)
            queryStr.append(" and coa.type =:type ");
        if (coaSearchResultObj.getPurposeId() != null)
            queryStr.append(" and acp.id =:purposeId");
        if (coaSearchResultObj.getDetailTypeId() != null)
            queryStr.append(" and acdt.id =:detailTypeId ");
        if (coaSearchResultObj.getIsActiveForPosting() != null)
            queryStr.append(" and coa.isActiveForPosting =:isActiveForPosting ");
        if (coaSearchResultObj.getBudgetCheckReq() != null)
            queryStr.append(" and coa.budgetCheckReq =:budgetCheckReq ");
        if (coaSearchResultObj.getFunctionReqd() != null)
            queryStr.append(" and coa.functionReqd =:functionReqd ");

    }

	private SQLQuery setParametersToQuery(final ChartOfAccountsReport coaSearchResultObj, final SQLQuery queryResult) {

		if (StringUtils.isNotBlank(coaSearchResultObj.getAccountCode()))
			queryResult.setString("accountCode", coaSearchResultObj.getAccountCode());
		if (coaSearchResultObj.getMajorCodeId() != null)
			queryResult.setLong("majorCodeId", coaSearchResultObj.getMajorCodeId());

		if (coaSearchResultObj.getMinorCodeId() != null)
			queryResult.setLong("minorCodeId", coaSearchResultObj.getMinorCodeId());

		if (coaSearchResultObj.getType() != null)
			queryResult.setString("type", coaSearchResultObj.getType());
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
