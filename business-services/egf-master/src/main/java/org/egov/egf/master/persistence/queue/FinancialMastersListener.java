package org.egov.egf.master.persistence.queue;

import java.util.Map;

import org.egov.egf.master.domain.model.*;
import org.egov.egf.master.domain.service.*;
import org.egov.egf.master.web.contract.*;
import org.egov.egf.master.web.requests.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FinancialMastersListener {

	@Value("${kafka.topics.egf.masters.completed.topic}")
	private String completedTopic;

	@Value("${kafka.topics.egf.masters.fund.completed.key}")
	private String fundCompletedKey;

	@Value("${kafka.topics.egf.masters.bank.completed.key}")
	private String bankCompletedKey;
	
	@Value("${kafka.topics.egf.masters.bankbranch.completed.key}")
	private String bankBranchCompletedKey;

	@Value("${kafka.topics.egf.masters.financialyear.completed.key}")
	private String financialYearCompletedKey;
	
	@Value("${kafka.topics.egf.masters.fiscalperiod.completed.key}")
	private String fiscalPeriodCompletedKey;
	
	@Value("${kafka.topics.egf.masters.function.completed.key}")
	private String functionCompletedKey;
	
	@Value("${kafka.topics.egf.masters.functionary.completed.key}")
	private String functionaryCompletedKey;
	
	@Value("${kafka.topics.egf.masters.fundsource.completed.key}")
	private String fundsourceCompletedKey;
	
	@Value("${kafka.topics.egf.masters.scheme.completed.key}")
	private String schemeCompletedKey;
	
	@Value("${kafka.topics.egf.masters.bankaccount.completed.key}")
	private String bankAccountCompletedKey;
	
	@Value("${kafka.topics.egf.masters.subscheme.completed.key}")
	private String subSchemeCompletedKey;
	
	@Value("${kafka.topics.egf.masters.supplier.completed.key}")
	private String supplierCompletedKey;
	
	@Value("${kafka.topics.egf.masters.accountdetailtype.completed.key}")
	private String accountDetailTypeCompletedKey;
	
	@Value("${kafka.topics.egf.masters.accountdetailkey.completed.key}")
	private String accountDetailKeyCompletedKey;
	
	@Value("${kafka.topics.egf.masters.accountentity.completed.key}")
	private String accountEntityCompletedKey;
	
	@Value("${kafka.topics.egf.masters.accountcodepurpose.completed.key}")
	private String accountCodePurposeCompletedKey;
	
	@Value("${kafka.topics.egf.masters.chartofaccount.completed.key}")
	private String chartOfAccountCompletedKey;
	
	@Value("${kafka.topics.egf.masters.chartofaccountdetail.completed.key}")
	private String chartOfAccountDetailCompletedKey;
	
	@Value("${kafka.topics.egf.masters.budgetgroup.completed.key}")
	private String budgetGroupCompletedKey;
	
	@Value("${kafka.topics.egf.masters.financialstatus.completed.key}")
	private String financialStatusCompletedKey;
	
	@Value("${kafka.topics.egf.masters.financialconfiguration.completed.key}")
	private String financialConfigurationCompletedKey;

	@Value("${kafka.topics.egf.masters.recovery.completed.key}")
	private String recoveryCompletedKey;

	@Autowired
	ApplicationContext applicationContext;

	@Autowired
	ObjectMapper objectMapper;

	@Autowired
	private FinancialProducer financialProducer;

	@Autowired
	private FundService fundService;

	@Autowired
	private BankService bankService;

	@Autowired
	private FunctionService functionService;

	@Autowired
	private BankBranchService bankBranchService;

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private AccountCodePurposeService accountCodePurposeService;

	@Autowired
	private AccountDetailTypeService accountDetailTypeService;

	@Autowired
	private AccountDetailKeyService accountDetailKeyService;

	@Autowired
	private AccountEntityService accountEntityService;

	@Autowired
	private BudgetGroupService budgetGroupService;

	@Autowired
	private ChartOfAccountService chartOfAccountService;

	@Autowired
	private ChartOfAccountDetailService chartOfAccountDetailService;

	@Autowired
	private FinancialYearService financialYearService;

	@Autowired
	private FiscalPeriodService fiscalPeriodService;

	@Autowired
	private FunctionaryService functionaryService;

	@Autowired
	private FundsourceService fundsourceService;

	@Autowired
	private SchemeService schemeService;

	@Autowired
	private SubSchemeService subSchemeService;

	@Autowired
	private SupplierService supplierService;

	@Autowired
	private FinancialStatusService financialStatusService;

	@Autowired
	private FinancialConfigurationService financialConfigurationService;

	@Autowired
	private RecoveryService recoveryService;

	@KafkaListener(id = "${kafka.topics.egf.masters.validated.id}", topics = "${kafka.topics.egf.masters.validated.topic}", groupId = "${kafka.topics.egf.masters.validated.group}")
	public void process(Map<String, Object> mastersMap) {
		// implement the details here

		if (mastersMap.get("bank_create") != null) {
			BankRequest request = objectMapper.convertValue(
					mastersMap.get("bank_create"), BankRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (BankContract bankContract : request.getBanks()) {
				Bank domain = mapper.map(bankContract, Bank.class);
				bankService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("bank_persisted", request);
			financialProducer.sendMessage(completedTopic, bankCompletedKey,
					mastersMap);
		}
		if (mastersMap.get("bank_update") != null) {

			BankRequest request = objectMapper.convertValue(
					mastersMap.get("bank_update"), BankRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (BankContract bankContract : request.getBanks()) {
				Bank domain = mapper.map(bankContract, Bank.class);
				bankService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("bank_persisted", request);
			financialProducer.sendMessage(completedTopic, bankCompletedKey,
					mastersMap);
		}
		
		if (mastersMap.get("bankbranch_create") != null) {
			BankBranchRequest request = objectMapper.convertValue(
					mastersMap.get("bankbranch_create"), BankBranchRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (BankBranchContract bankBranchContract : request.getBankBranches()) {
				BankBranch domain = mapper.map(bankBranchContract, BankBranch.class);
				bankBranchService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("bankbranch_persisted", request);
			financialProducer.sendMessage(completedTopic, bankBranchCompletedKey,
					mastersMap);
		}
		if (mastersMap.get("bankbranch_update") != null) {

			BankBranchRequest request = objectMapper.convertValue(
					mastersMap.get("bankbranch_update"), BankBranchRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (BankBranchContract bankBranchContract : request.getBankBranches()) {
				BankBranch domain = mapper.map(bankBranchContract, BankBranch.class);
				bankBranchService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("bankbranch_persisted", request);
			financialProducer.sendMessage(completedTopic, bankBranchCompletedKey,
					mastersMap);
		}

		if (mastersMap.get("fund_create") != null) {
			FundRequest request = objectMapper.convertValue(
					mastersMap.get("fund_create"), FundRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FundContract fundContract : request.getFunds()) {
				Fund domain = mapper.map(fundContract, Fund.class);
				fundService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("fund_persisted", request);
			financialProducer.sendMessage(completedTopic, fundCompletedKey,
					mastersMap);
		}
		if (mastersMap.get("fund_update") != null) {

			FundRequest request = objectMapper.convertValue(
					mastersMap.get("fund_update"), FundRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FundContract fundContract : request.getFunds()) {
				Fund domain = mapper.map(fundContract, Fund.class);
				fundService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("fund_persisted", request);
			financialProducer.sendMessage(completedTopic, fundCompletedKey,
					mastersMap);
		}

		if (mastersMap.get("financialyear_create") != null) {
			FinancialYearRequest request = objectMapper.convertValue(
					mastersMap.get("financialyear_create"),
					FinancialYearRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FinancialYearContract financialYearContract : request
					.getFinancialYears()) {
				FinancialYear domain = mapper.map(financialYearContract,
						FinancialYear.class);
				financialYearService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("financialyear_persisted", request);
			financialProducer.sendMessage(completedTopic,
					financialYearCompletedKey, mastersMap);
		}
		if (mastersMap.get("financialyear_update") != null) {

			FinancialYearRequest request = objectMapper.convertValue(
					mastersMap.get("financialyear_update"),
					FinancialYearRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FinancialYearContract financialYearContract : request
					.getFinancialYears()) {
				FinancialYear domain = mapper.map(financialYearContract,
						FinancialYear.class);
				financialYearService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("financialyear_persisted", request);
			financialProducer.sendMessage(completedTopic,
					financialYearCompletedKey, mastersMap);
		}

		if (mastersMap.get("fiscalperiod_create") != null) {
			FiscalPeriodRequest request = objectMapper.convertValue(
					mastersMap.get("fiscalperiod_create"),
					FiscalPeriodRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FiscalPeriodContract fiscalPeriodContract : request
					.getFiscalPeriods()) {
				FiscalPeriod domain = mapper.map(fiscalPeriodContract,
						FiscalPeriod.class);
				fiscalPeriodService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("fiscalperiod_persisted", request);
			financialProducer.sendMessage(completedTopic,
					fiscalPeriodCompletedKey, mastersMap);
		}
		if (mastersMap.get("fiscalperiod_update") != null) {

			FiscalPeriodRequest request = objectMapper.convertValue(
					mastersMap.get("fiscalperiod_update"),
					FiscalPeriodRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FiscalPeriodContract fiscalPeriodContract : request
					.getFiscalPeriods()) {
				FiscalPeriod domain = mapper.map(fiscalPeriodContract,
						FiscalPeriod.class);
				fiscalPeriodService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("fiscalperiod_persisted", request);
			financialProducer.sendMessage(completedTopic,
					fiscalPeriodCompletedKey, mastersMap);
		}

		if (mastersMap.get("function_create") != null) {
			FunctionRequest request = objectMapper.convertValue(
					mastersMap.get("function_create"), FunctionRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FunctionContract functionContract : request.getFunctions()) {
				Function domain = mapper.map(functionContract, Function.class);
				functionService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("function_persisted", request);
			financialProducer.sendMessage(completedTopic, functionCompletedKey,
					mastersMap);
		}
		if (mastersMap.get("function_update") != null) {

			FunctionRequest request = objectMapper.convertValue(
					mastersMap.get("function_update"), FunctionRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FunctionContract functionContract : request.getFunctions()) {
				Function domain = mapper.map(functionContract, Function.class);
				functionService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("function_persisted", request);
			financialProducer.sendMessage(completedTopic, functionCompletedKey,
					mastersMap);
		}

		if (mastersMap.get("functionary_create") != null) {
			FunctionaryRequest request = objectMapper.convertValue(
					mastersMap.get("functionary_create"),
					FunctionaryRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FunctionaryContract functionaryContract : request
					.getFunctionaries()) {
				Functionary domain = mapper.map(functionaryContract,
						Functionary.class);
				functionaryService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("functionary_persisted", request);
			financialProducer.sendMessage(completedTopic,
					functionaryCompletedKey, mastersMap);
		}
		if (mastersMap.get("functionary_update") != null) {

			FunctionaryRequest request = objectMapper.convertValue(
					mastersMap.get("functionary_update"),
					FunctionaryRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FunctionaryContract functionaryContract : request
					.getFunctionaries()) {
				Functionary domain = mapper.map(functionaryContract,
						Functionary.class);
				functionaryService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("functionary_persisted", request);
			financialProducer.sendMessage(completedTopic,
					functionaryCompletedKey, mastersMap);
		}

		if (mastersMap.get("fundsource_create") != null) {
			FundsourceRequest request = objectMapper.convertValue(
					mastersMap.get("fundsource_create"),
					FundsourceRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FundsourceContract fundsourceContract : request
					.getFundsources()) {
				Fundsource domain = mapper.map(fundsourceContract,
						Fundsource.class);
				fundsourceService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("fundsource_persisted", request);
			financialProducer.sendMessage(completedTopic,
					fundsourceCompletedKey, mastersMap);
		}
		if (mastersMap.get("fundsource_update") != null) {

			FundsourceRequest request = objectMapper.convertValue(
					mastersMap.get("fundsource_update"),
					FundsourceRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FundsourceContract fundsourceContract : request
					.getFundsources()) {
				Fundsource domain = mapper.map(fundsourceContract,
						Fundsource.class);
				fundsourceService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("fundsource_persisted", request);
			financialProducer.sendMessage(completedTopic,
					fundsourceCompletedKey, mastersMap);
		}

		if (mastersMap.get("scheme_create") != null) {
			SchemeRequest request = objectMapper.convertValue(
					mastersMap.get("scheme_create"), SchemeRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (SchemeContract schemeContract : request.getSchemes()) {
				Scheme domain = mapper.map(schemeContract, Scheme.class);
				schemeService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("scheme_persisted", request);
			financialProducer.sendMessage(completedTopic, schemeCompletedKey,
					mastersMap);
		}
		if (mastersMap.get("scheme_update") != null) {

			SchemeRequest request = objectMapper.convertValue(
					mastersMap.get("scheme_update"), SchemeRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (SchemeContract schemeContract : request.getSchemes()) {
				Scheme domain = mapper.map(schemeContract, Scheme.class);
				schemeService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("scheme_persisted", request);
			financialProducer.sendMessage(completedTopic, schemeCompletedKey,
					mastersMap);
		}

		if (mastersMap.get("bankaccount_create") != null) {
			BankAccountRequest request = objectMapper.convertValue(
					mastersMap.get("bankaccount_create"),
					BankAccountRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (BankAccountContract bankAccountContract : request
					.getBankAccounts()) {
				BankAccount domain = mapper.map(bankAccountContract,
						BankAccount.class);
				bankAccountService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("bankaccount_persisted", request);
			financialProducer.sendMessage(completedTopic,
					bankAccountCompletedKey, mastersMap);
		}
		if (mastersMap.get("bankaccount_update") != null) {

			BankAccountRequest request = objectMapper.convertValue(
					mastersMap.get("bankaccount_update"),
					BankAccountRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (BankAccountContract bankAccountContract : request
					.getBankAccounts()) {
				BankAccount domain = mapper.map(bankAccountContract,
						BankAccount.class);
				bankAccountService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("bankaccount_persisted", request);
			financialProducer.sendMessage(completedTopic,
					bankAccountCompletedKey, mastersMap);
		}

		if (mastersMap.get("subscheme_create") != null) {
			SubSchemeRequest request = objectMapper.convertValue(
					mastersMap.get("subscheme_create"), SubSchemeRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (SubSchemeContract subSchemeContract : request.getSubSchemes()) {
				SubScheme domain = mapper.map(subSchemeContract,
						SubScheme.class);
				subSchemeService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("subscheme_persisted", request);
			financialProducer.sendMessage(completedTopic,
					subSchemeCompletedKey, mastersMap);
		}
		if (mastersMap.get("subscheme_update") != null) {

			SubSchemeRequest request = objectMapper.convertValue(
					mastersMap.get("subscheme_update"), SubSchemeRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (SubSchemeContract subSchemeContract : request.getSubSchemes()) {
				SubScheme domain = mapper.map(subSchemeContract,
						SubScheme.class);
				subSchemeService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("subscheme_persisted", request);
			financialProducer.sendMessage(completedTopic,
					subSchemeCompletedKey, mastersMap);
		}

		if (mastersMap.get("supplier_create") != null) {
			SupplierRequest request = objectMapper.convertValue(
					mastersMap.get("supplier_create"), SupplierRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (SupplierContract supplierContract : request.getSuppliers()) {
				Supplier domain = mapper.map(supplierContract, Supplier.class);
				supplierService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("supplier_persisted", request);
			financialProducer.sendMessage(completedTopic, supplierCompletedKey,
					mastersMap);
		}
		if (mastersMap.get("supplier_update") != null) {

			SupplierRequest request = objectMapper.convertValue(
					mastersMap.get("supplier_update"), SupplierRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (SupplierContract supplierContract : request.getSuppliers()) {
				Supplier domain = mapper.map(supplierContract, Supplier.class);
				supplierService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("supplier_persisted", request);
			financialProducer.sendMessage(completedTopic, supplierCompletedKey,
					mastersMap);
		}

		if (mastersMap.get("accountdetailtype_create") != null) {
			AccountDetailTypeRequest request = objectMapper.convertValue(
					mastersMap.get("accountdetailtype_create"),
					AccountDetailTypeRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (AccountDetailTypeContract accountDetailTypeContract : request
					.getAccountDetailTypes()) {
				AccountDetailType domain = mapper.map(
						accountDetailTypeContract, AccountDetailType.class);
				accountDetailTypeService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("accountdetailtype_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountDetailTypeCompletedKey, mastersMap);
		}
		if (mastersMap.get("accountdetailtype_update") != null) {

			AccountDetailTypeRequest request = objectMapper.convertValue(
					mastersMap.get("accountdetailtype_update"),
					AccountDetailTypeRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (AccountDetailTypeContract accountDetailTypeContract : request
					.getAccountDetailTypes()) {
				AccountDetailType domain = mapper.map(
						accountDetailTypeContract, AccountDetailType.class);
				accountDetailTypeService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("accountdetailtype_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountDetailTypeCompletedKey, mastersMap);
		}

		if (mastersMap.get("accountdetailkey_create") != null) {
			AccountDetailKeyRequest request = objectMapper.convertValue(
					mastersMap.get("accountdetailkey_create"),
					AccountDetailKeyRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (AccountDetailKeyContract accountDetailKeyContract : request
					.getAccountDetailKeys()) {
				AccountDetailKey domain = mapper.map(accountDetailKeyContract,
						AccountDetailKey.class);
				accountDetailKeyService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("accountdetailkey_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountDetailKeyCompletedKey, mastersMap);
		}
		if (mastersMap.get("accountdetailkey_update") != null) {

			AccountDetailKeyRequest request = objectMapper.convertValue(
					mastersMap.get("accountdetailkey_update"),
					AccountDetailKeyRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (AccountDetailKeyContract accountDetailKeyContract : request
					.getAccountDetailKeys()) {
				AccountDetailKey domain = mapper.map(accountDetailKeyContract,
						AccountDetailKey.class);
				accountDetailKeyService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("accountdetailkey_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountDetailKeyCompletedKey, mastersMap);
		}

		if (mastersMap.get("accountentity_create") != null) {
			AccountEntityRequest request = objectMapper.convertValue(
					mastersMap.get("accountentity_create"),
					AccountEntityRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (AccountEntityContract accountEntityContract : request
					.getAccountEntities()) {
				AccountEntity domain = mapper.map(accountEntityContract,
						AccountEntity.class);
				accountEntityService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("accountentity_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountEntityCompletedKey, mastersMap);
		}
		if (mastersMap.get("accountentity_update") != null) {

			AccountEntityRequest request = objectMapper.convertValue(
					mastersMap.get("accountentity_update"),
					AccountEntityRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (AccountEntityContract accountEntityContract : request
					.getAccountEntities()) {
				AccountEntity domain = mapper.map(accountEntityContract,
						AccountEntity.class);
				accountEntityService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("accountentity_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountEntityCompletedKey, mastersMap);
		}

		if (mastersMap.get("accountcodepurpose_create") != null) {
			AccountCodePurposeRequest request = objectMapper.convertValue(
					mastersMap.get("accountcodepurpose_create"),
					AccountCodePurposeRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (AccountCodePurposeContract accountCodePurposeContract : request
					.getAccountCodePurposes()) {
				AccountCodePurpose domain = mapper.map(
						accountCodePurposeContract, AccountCodePurpose.class);
				accountCodePurposeService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("accountcodepurpose_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountCodePurposeCompletedKey, mastersMap);
		}
		if (mastersMap.get("accountcodepurpose_update") != null) {

			AccountCodePurposeRequest request = objectMapper.convertValue(
					mastersMap.get("accountcodepurpose_update"),
					AccountCodePurposeRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (AccountCodePurposeContract accountCodePurposeContract : request
					.getAccountCodePurposes()) {
				AccountCodePurpose domain = mapper.map(
						accountCodePurposeContract, AccountCodePurpose.class);
				accountCodePurposeService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("accountcodepurpose_persisted", request);
			financialProducer.sendMessage(completedTopic,
					accountCodePurposeCompletedKey, mastersMap);
		}

		if (mastersMap.get("chartofaccount_create") != null) {
			ChartOfAccountRequest request = objectMapper.convertValue(
					mastersMap.get("chartofaccount_create"),
					ChartOfAccountRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (ChartOfAccountContract chartOfAccountContract : request
					.getChartOfAccounts()) {
				ChartOfAccount domain = mapper.map(chartOfAccountContract,
						ChartOfAccount.class);
				chartOfAccountService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("chartofaccount_persisted", request);
			financialProducer.sendMessage(completedTopic,
					chartOfAccountCompletedKey, mastersMap);
		}
		if (mastersMap.get("chartofaccount_update") != null) {

			ChartOfAccountRequest request = objectMapper.convertValue(
					mastersMap.get("chartofaccount_update"),
					ChartOfAccountRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (ChartOfAccountContract chartOfAccountContract : request
					.getChartOfAccounts()) {
				ChartOfAccount domain = mapper.map(chartOfAccountContract,
						ChartOfAccount.class);
				chartOfAccountService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("chartofaccount_persisted", request);
			financialProducer.sendMessage(completedTopic,
					chartOfAccountCompletedKey, mastersMap);
		}

		if (mastersMap.get("chartofaccountdetail_create") != null) {
			ChartOfAccountDetailRequest request = objectMapper.convertValue(
					mastersMap.get("chartofaccountdetail_create"),
					ChartOfAccountDetailRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (ChartOfAccountDetailContract chartOfAccountDetailContract : request
					.getChartOfAccountDetails()) {
				ChartOfAccountDetail domain = mapper.map(
						chartOfAccountDetailContract,
						ChartOfAccountDetail.class);
				chartOfAccountDetailService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("chartofaccountdetail_persisted", request);
			financialProducer.sendMessage(completedTopic,
					chartOfAccountDetailCompletedKey, mastersMap);
		}
		if (mastersMap.get("chartofaccountdetail_update") != null) {

			ChartOfAccountDetailRequest request = objectMapper.convertValue(
					mastersMap.get("chartofaccountdetail_update"),
					ChartOfAccountDetailRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (ChartOfAccountDetailContract chartOfAccountDetailContract : request
					.getChartOfAccountDetails()) {
				ChartOfAccountDetail domain = mapper.map(
						chartOfAccountDetailContract,
						ChartOfAccountDetail.class);
				chartOfAccountDetailService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("chartofaccountdetail_persisted", request);
			financialProducer.sendMessage(completedTopic,
					chartOfAccountDetailCompletedKey, mastersMap);
		}

		if (mastersMap.get("budgetgroup_create") != null) {
			BudgetGroupRequest request = objectMapper.convertValue(
					mastersMap.get("budgetgroup_create"),
					BudgetGroupRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (BudgetGroupContract budgetGroupContract : request
					.getBudgetGroups()) {
				BudgetGroup domain = mapper.map(budgetGroupContract,
						BudgetGroup.class);
				budgetGroupService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("budgetgroup_persisted", request);
			financialProducer.sendMessage(completedTopic,
					budgetGroupCompletedKey, mastersMap);
		}
		if (mastersMap.get("budgetgroup_update") != null) {

			BudgetGroupRequest request = objectMapper.convertValue(
					mastersMap.get("budgetgroup_update"),
					BudgetGroupRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (BudgetGroupContract budgetGroupContract : request
					.getBudgetGroups()) {
				BudgetGroup domain = mapper.map(budgetGroupContract,
						BudgetGroup.class);
				budgetGroupService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("budgetgroup_persisted", request);
			financialProducer.sendMessage(completedTopic,
					budgetGroupCompletedKey, mastersMap);
		}

		if (mastersMap.get("financialstatus_create") != null) {
			FinancialStatusRequest request = objectMapper.convertValue(
					mastersMap.get("financialstatus_create"),
					FinancialStatusRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FinancialStatusContract financialStatusContract : request
					.getFinancialStatuses()) {
				FinancialStatus domain = mapper.map(financialStatusContract,
						FinancialStatus.class);
				financialStatusService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("financialstatus_persisted", request);
			financialProducer.sendMessage(completedTopic,
					financialStatusCompletedKey, mastersMap);
		}
		if (mastersMap.get("financialstatus_update") != null) {

			FinancialStatusRequest request = objectMapper.convertValue(
					mastersMap.get("financialstatus_update"),
					FinancialStatusRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FinancialStatusContract financialStatusContract : request
					.getFinancialStatuses()) {
				FinancialStatus domain = mapper.map(financialStatusContract,
						FinancialStatus.class);
				financialStatusService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("financialstatus_persisted", request);
			financialProducer.sendMessage(completedTopic,
					financialStatusCompletedKey, mastersMap);
		}

		if (mastersMap.get("financialconfiguration_create") != null) {
			FinancialConfigurationRequest request = objectMapper.convertValue(
					mastersMap.get("financialconfiguration_create"),
					FinancialConfigurationRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (FinancialConfigurationContract financialConfigurationContract : request
					.getFinancialConfigurations()) {
				FinancialConfiguration domain = mapper.map(
						financialConfigurationContract,
						FinancialConfiguration.class);
				financialConfigurationService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("financialconfiguration_persisted", request);
			financialProducer.sendMessage(completedTopic,
					financialConfigurationCompletedKey, mastersMap);
		}
		if (mastersMap.get("financialconfiguration_update") != null) {

			FinancialConfigurationRequest request = objectMapper.convertValue(
					mastersMap.get("financialconfiguration_update"),
					FinancialConfigurationRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (FinancialConfigurationContract financialConfigurationContract : request
					.getFinancialConfigurations()) {
				FinancialConfiguration domain = mapper.map(
						financialConfigurationContract,
						FinancialConfiguration.class);
				financialConfigurationService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("financialconfiguration_persisted", request);
			financialProducer.sendMessage(completedTopic,
					financialConfigurationCompletedKey, mastersMap);
		}
		
		if (mastersMap.get("bankbranch_create") != null) {
	            BankBranchRequest request = objectMapper.convertValue(
	                    mastersMap.get("bankbranch_create"), BankBranchRequest.class);
	            ModelMapper mapper = new ModelMapper();
	            for (BankBranchContract bankBranchContract : request.getBankBranches()) {
	                BankBranch domain = mapper.map(bankBranchContract, BankBranch.class);
	                bankBranchService.save(domain);
	            }

	            mastersMap.clear();
	            mastersMap.put("bankbranch_persisted", request);
	            financialProducer.sendMessage(completedTopic, bankBranchCompletedKey,
	                    mastersMap);
	        }
	        if (mastersMap.get("bankbranch_update") != null) {

	            BankBranchRequest request = objectMapper.convertValue(
	                    mastersMap.get("bankbranch_update"), BankBranchRequest.class);

	            ModelMapper mapper = new ModelMapper();
	            for (BankBranchContract bankBranchContract : request.getBankBranches()) {
	                BankBranch domain = mapper.map(bankBranchContract, BankBranch.class);
	                bankBranchService.update(domain);
	            }

	            mastersMap.clear();
	            mastersMap.put("bankbranch_persisted", request);
	            financialProducer.sendMessage(completedTopic, bankBranchCompletedKey,
	                    mastersMap);
	        }
		if (mastersMap.get("recovery_create") != null) {
			RecoveryRequest request = objectMapper.convertValue(
					mastersMap.get("recovery_create"), RecoveryRequest.class);
			ModelMapper mapper = new ModelMapper();
			for (RecoveryContract recoveryContract : request.getRecoverys()) {
				Recovery domain = mapper.map(recoveryContract, Recovery.class);
				recoveryService.save(domain);
			}

			mastersMap.clear();
			mastersMap.put("recovery_persisted", request);
			financialProducer.sendMessage(completedTopic, bankCompletedKey,
					mastersMap);
		}
		if (mastersMap.get("recovery_update") != null) {

			RecoveryRequest request = objectMapper.convertValue(
					mastersMap.get("recovery_update"), RecoveryRequest.class);

			ModelMapper mapper = new ModelMapper();
			for (RecoveryContract recoveryContract : request.getRecoverys()) {
				Recovery domain = mapper.map(recoveryContract, Recovery.class);
				recoveryService.update(domain);
			}
			mastersMap.clear();
			mastersMap.put("recovery_persisted", request);
			financialProducer.sendMessage(completedTopic, bankCompletedKey,
					mastersMap);
		}


	}

}
