package org.egov.egf.master.domain.repository;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.common.util.ElasticSearchUtils;
import org.egov.egf.master.web.contract.AccountCodePurposeSearchContract;
import org.egov.egf.master.web.contract.AccountDetailKeySearchContract;
import org.egov.egf.master.web.contract.AccountDetailTypeSearchContract;
import org.egov.egf.master.web.contract.AccountEntitySearchContract;
import org.egov.egf.master.web.contract.BankAccountSearchContract;
import org.egov.egf.master.web.contract.BankBranchSearchContract;
import org.egov.egf.master.web.contract.BankSearchContract;
import org.egov.egf.master.web.contract.BudgetGroupSearchContract;
import org.egov.egf.master.web.contract.ChartOfAccountDetailSearchContract;
import org.egov.egf.master.web.contract.ChartOfAccountSearchContract;
import org.egov.egf.master.web.contract.FinancialYearSearchContract;
import org.egov.egf.master.web.contract.FiscalPeriodSearchContract;
import org.egov.egf.master.web.contract.FunctionSearchContract;
import org.egov.egf.master.web.contract.FunctionarySearchContract;
import org.egov.egf.master.web.contract.FundSearchContract;
import org.egov.egf.master.web.contract.FundsourceSearchContract;
import org.egov.egf.master.web.contract.RecoverySearchContract;
import org.egov.egf.master.web.contract.SchemeSearchContract;
import org.egov.egf.master.web.contract.SubSchemeSearchContract;
import org.egov.egf.master.web.contract.SupplierSearchContract;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ElasticSearchQueryFactory {

	@Autowired
	private ElasticSearchUtils elasticSearchUtils;

	public BoolQueryBuilder searchFund(FundSearchContract fundSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (fundSearchContract.getIds() != null && !fundSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(fundSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(fundSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(fundSearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(fundSearchContract.getIdentifier(), "identifier", boolQueryBuilder);
		elasticSearchUtils.add(fundSearchContract.getLevel(), "level", boolQueryBuilder);
		elasticSearchUtils.add(fundSearchContract.getParent(), "parent", boolQueryBuilder);
		elasticSearchUtils.add(fundSearchContract.getActive(), "active", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchAccountCodePurpose(
			AccountCodePurposeSearchContract accountCodePurposeSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (accountCodePurposeSearchContract.getIds() != null && !accountCodePurposeSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(accountCodePurposeSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(accountCodePurposeSearchContract.getName(), "name", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchAccountDetailKey(AccountDetailKeySearchContract accountDetailKeySearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (accountDetailKeySearchContract.getIds() != null && !accountDetailKeySearchContract.getIds().isEmpty())
			elasticSearchUtils.add(accountDetailKeySearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailKeySearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailKeySearchContract.getKey(), "key", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailKeySearchContract.getAccountDetailType(), "accountDetailType",
				boolQueryBuilder);
		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchAccountDetailType(AccountDetailTypeSearchContract accountDetailTypeSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (accountDetailTypeSearchContract.getIds() != null && !accountDetailTypeSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(accountDetailTypeSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailTypeSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailTypeSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailTypeSearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailTypeSearchContract.getTableName(), "tableName", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailTypeSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(accountDetailTypeSearchContract.getFullyQualifiedName(), "fullyQualifiedName",
				boolQueryBuilder);
		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchAccountEntity(AccountEntitySearchContract accountEntitySearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (accountEntitySearchContract.getIds() != null && !accountEntitySearchContract.getIds().isEmpty())
			elasticSearchUtils.add(accountEntitySearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(accountEntitySearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(accountEntitySearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(accountEntitySearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(accountEntitySearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(accountEntitySearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(accountEntitySearchContract.getAccountDetailType(), "accountDetailType",
				boolQueryBuilder);
		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchBankAccount(BankAccountSearchContract bankAccountSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (bankAccountSearchContract.getIds() != null && !bankAccountSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(bankAccountSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getChartOfAccount(), "chartOfAccount", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getFund(), "fund", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getAccountNumber(), "accountNumber", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getAccountType(), "accountType", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getPayTo(), "payTo", boolQueryBuilder);
		elasticSearchUtils.add(bankAccountSearchContract.getType(), "type", boolQueryBuilder);

		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchBankBranch(BankBranchSearchContract bankBranchSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (bankBranchSearchContract.getIds() != null && !bankBranchSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(bankBranchSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getBank(), "bank", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getAddress(), "address", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getAddress2(), "address2", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getBank(), "city", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getActive(), "state", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getAddress(), "pincode", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getPhone(), "phone", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getFax(), "fax", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getContactPerson(), "contactPerson", boolQueryBuilder);
		elasticSearchUtils.add(bankBranchSearchContract.getMicr(), "micr", boolQueryBuilder);

		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchBank(BankSearchContract bankSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (bankSearchContract.getIds() != null && !bankSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(bankSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(bankSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(bankSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(bankSearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(bankSearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(bankSearchContract.getType(), "type", boolQueryBuilder);
		elasticSearchUtils.add(bankSearchContract.getActive(), "active", boolQueryBuilder);
		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchBudgetGroup(BudgetGroupSearchContract budgetGroupSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (budgetGroupSearchContract.getIds() != null && !budgetGroupSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(budgetGroupSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getMajorCode(), "majorCode", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getMaxCode(), "maxCode", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getMinCode(), "minCode", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getAccountType(), "accountType", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(budgetGroupSearchContract.getBudgetingType(), "budgetingType", boolQueryBuilder);
		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchChartOfAccount(ChartOfAccountSearchContract chartOfAccountContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (chartOfAccountContract.getIds() != null && !chartOfAccountContract.getIds().isEmpty())
			elasticSearchUtils.add(chartOfAccountContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getMajorCode(), "majorCode", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getGlcode(), "glcode", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getAccountCodePurpose(), "accountCodePurpose", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getIsActiveForPosting(), "isActiveForPosting", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getParentId(), "parentId", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getType(), "type", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getClassification(), "classification", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getFunctionRequired(), "functionRequired", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getBudgetCheckRequired(), "budgetCheckRequired",
				boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountContract.getIsSubLedger(), "isSubLedger", boolQueryBuilder);
		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchChartOfAccountDetail(
			ChartOfAccountDetailSearchContract chartOfAccountDetailSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (chartOfAccountDetailSearchContract.getIds() != null
				&& !chartOfAccountDetailSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(chartOfAccountDetailSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountDetailSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountDetailSearchContract.getChartOfAccount(), "chartOfAccount",
				boolQueryBuilder);
		elasticSearchUtils.add(chartOfAccountDetailSearchContract.getAccountDetailType(), "accountDetailType",
				boolQueryBuilder);
		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchFinancialYear(FinancialYearSearchContract financialYearSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (financialYearSearchContract.getIds() != null && !financialYearSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(financialYearSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getFinYearRange(), "finYearRange", boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getStartingDate(), "startingDate", boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getEndingDate(), "endingDate", boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getIsActiveForPosting(), "isActiveForPosting",
				boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getIsClosed(), "isClosed", boolQueryBuilder);
		elasticSearchUtils.add(financialYearSearchContract.getTransferClosingBalance(), "transferClosingBalance",
				boolQueryBuilder);
		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchFunction(FunctionSearchContract functionSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (functionSearchContract.getIds() != null && !functionSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(functionSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(functionSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(functionSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(functionSearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(functionSearchContract.getLevel(), "level", boolQueryBuilder);
		elasticSearchUtils.add(functionSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(functionSearchContract.getParentId(), "parentId", boolQueryBuilder);
		return boolQueryBuilder;

	}

	public BoolQueryBuilder searchFunctionary(FunctionarySearchContract functionarySearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (functionarySearchContract.getIds() != null && !functionarySearchContract.getIds().isEmpty())
			elasticSearchUtils.add(functionarySearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(functionarySearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(functionarySearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(functionarySearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(functionarySearchContract.getActive(), "active", boolQueryBuilder);
		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchScheme(SchemeSearchContract schemeSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (schemeSearchContract.getIds() != null && !schemeSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(schemeSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getValidFrom(), "validFrom", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getValidTo(), "validTo", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getFund(), "fund", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(schemeSearchContract.getBoundary(), "boundary", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchSubScheme(SubSchemeSearchContract subSchemeSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (subSchemeSearchContract.getIds() != null && !subSchemeSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(subSchemeSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getValidFrom(), "validFrom", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getValidTo(), "validTo", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getScheme(), "scheme", boolQueryBuilder);
		elasticSearchUtils.add(subSchemeSearchContract.getDepartmentId(), "departmentId", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchSupplier(SupplierSearchContract supplierSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (supplierSearchContract.getIds() != null && !supplierSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(supplierSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getAddress(), "address", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getMobile(), "mobile", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getEmail(), "email", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getDescription(), "description", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getPanNo(), "panNo", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getTinNo(), "tinNo", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getRegistationNo(), "registationNo", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getBankAccount(), "bankAccount", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getIfscCode(), "ifscCode", boolQueryBuilder);
		elasticSearchUtils.add(supplierSearchContract.getBank(), "bank", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchFiscalPeriod(FiscalPeriodSearchContract fiscalPeriodSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (fiscalPeriodSearchContract.getIds() != null && !fiscalPeriodSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(fiscalPeriodSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getFinancialYear(), "financialYear", boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getStartingDate(), "startingDate", boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getEndingDate(), "endingDate", boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getIsActiveForPosting(), "isActiveForPosting",
				boolQueryBuilder);
		elasticSearchUtils.add(fiscalPeriodSearchContract.getIsClosed(), "isClosed", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchFundsource(FundsourceSearchContract fundsourceSearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (fundsourceSearchContract.getIds() != null && !fundsourceSearchContract.getIds().isEmpty())
			elasticSearchUtils.add(fundsourceSearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getId(), "id", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getActive(), "active", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getParent(), "parent", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getIsParent(), "isParent", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getLlevel(), "llevel", boolQueryBuilder);
		elasticSearchUtils.add(fundsourceSearchContract.getType(), "type", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public BoolQueryBuilder searchRecovery(RecoverySearchContract recoverySearchContract) {
		BoolQueryBuilder boolQueryBuilder = boolQuery();
		if (recoverySearchContract.getIds() != null && !recoverySearchContract.getIds().isEmpty())
			elasticSearchUtils.add(recoverySearchContract.getIds(), "id", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getName(), "name", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getCode(), "code", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getActive(), "active", boolQueryBuilder);
		if (recoverySearchContract.getChartOfAccount() != null)
			elasticSearchUtils.add(recoverySearchContract.getChartOfAccount(), "chartOfAccount", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getType(), "type", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getFlat(), "flat", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getPercentage(), "percentage", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getRemitted(), "remitted", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getIfscCode(), "ifscCode", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getMode(), "mode", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getRemittanceMode(), "remittanceMode", boolQueryBuilder);
		elasticSearchUtils.add(recoverySearchContract.getAccountNumber(), "accountNumber", boolQueryBuilder);

		return boolQueryBuilder;
	}

	public List<String> prepareOrderBys(String sortBy) {
		List<String> orderByList = new ArrayList<String>();
		List<String> sortByList = new ArrayList<String>();
		if (sortBy.contains(",")) {
			sortByList = Arrays.asList(sortBy.split(","));
		} else {
			sortByList = Arrays.asList(sortBy);
		}
		for (String s : sortByList) {
			if (s.contains(" ")
					&& (s.toLowerCase().trim().endsWith("asc") || s.toLowerCase().trim().endsWith("desc"))) {
				orderByList.add(s.trim());
			} else {
				orderByList.add(s.trim() + " asc");
			}
		}

		return orderByList;
	}

}
