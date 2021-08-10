package org.egov.egf.master.persistence.queue;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MastersQueueRepository {

    @Autowired
    private FinancialProducer financialProducer;

    @Value("${kafka.topics.egf.masters.validated.topic}")
    private String validatedTopic;

    @Value("${kafka.topics.egf.masters.completed.topic}")
    private String completedTopic;

    @Value("${kafka.topics.egf.masters.fund.validated.key}")
    private String fundValidatedKey;

    @Value("${kafka.topics.egf.masters.bank.validated.key}")
    private String bankValidatedKey;

    @Value("${kafka.topics.egf.masters.bankbranch.validated.key}")
    private String bankBranchValidatedKey;

    @Value("${kafka.topics.egf.masters.financialyear.validated.key}")
    private String financialYearValidatedKey;

    @Value("${kafka.topics.egf.masters.fiscalperiod.validated.key}")
    private String fiscalPeriodValidatedKey;

    @Value("${kafka.topics.egf.masters.function.validated.key}")
    private String functionValidatedKey;

    @Value("${kafka.topics.egf.masters.functionary.validated.key}")
    private String functionaryValidatedKey;

    @Value("${kafka.topics.egf.masters.fundsource.validated.key}")
    private String fundsourceValidatedKey;

    @Value("${kafka.topics.egf.masters.scheme.validated.key}")
    private String schemeValidatedKey;

    @Value("${kafka.topics.egf.masters.bankaccount.validated.key}")
    private String bankAccountValidatedKey;

    @Value("${kafka.topics.egf.masters.subscheme.validated.key}")
    private String subSchemeValidatedKey;

    @Value("${kafka.topics.egf.masters.supplier.validated.key}")
    private String supplierValidatedKey;

    @Value("${kafka.topics.egf.masters.accountdetailtype.validated.key}")
    private String accountDetailTypeValidatedKey;

    @Value("${kafka.topics.egf.masters.accountdetailkey.validated.key}")
    private String accountDetailKeyValidatedKey;

    @Value("${kafka.topics.egf.masters.accountentity.validated.key}")
    private String accountEntityValidatedKey;

    @Value("${kafka.topics.egf.masters.accountcodepurpose.validated.key}")
    private String accountCodePurposeValidatedKey;

    @Value("${kafka.topics.egf.masters.chartofaccount.validated.key}")
    private String chartOfAccountValidatedKey;

    @Value("${kafka.topics.egf.masters.chartofaccountdetail.validated.key}")
    private String chartOfAccountDetailValidatedKey;

    @Value("${kafka.topics.egf.masters.budgetgroup.validated.key}")
    private String budgetGroupValidatedKey;

    @Value("${kafka.topics.egf.masters.financialstatus.validated.key}")
    private String financialStatusValidatedKey;

    @Value("${kafka.topics.egf.masters.financialconfiguration.validated.key}")
    private String financialConfigurationValidatedKey;

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

    @Value("${kafka.topics.egf.masters.recovery.validated.key}")
    private String recoveryValidatedKey;

    @Value("${kafka.topics.egf.masters.recovery.completed.key}")
    private String recoveryCompletedKey;

    private String key;
    private String topicKey;

    public void add(Map<String, Object> topicMap) {

        for (Map.Entry<String, Object> entry : topicMap.entrySet()) {
            System.out.println(entry.getKey() + "/" + entry.getValue());
            key = entry.getKey().split("_")[0];

            if (key.equalsIgnoreCase("fund")) {
                topicKey = fundValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("bank")) {
                topicKey = bankValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("bankBranch")) {
                topicKey = bankBranchValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("financialYear")) {
                topicKey = financialYearValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("fiscalPeriod")) {
                topicKey = fiscalPeriodValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("function")) {
                topicKey = functionValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("functionary")) {
                topicKey = functionaryValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("fundsource")) {
                topicKey = fundsourceValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("scheme")) {
                topicKey = schemeValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("bankAccount")) {
                topicKey = bankAccountValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("subScheme")) {
                topicKey = subSchemeValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("supplier")) {
                topicKey = supplierValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountDetailType")) {
                topicKey = accountDetailTypeValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountDetailKey")) {
                topicKey = accountDetailKeyValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountEntity")) {
                topicKey = accountEntityValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountCodePurpose")) {
                topicKey = accountCodePurposeValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("chartOfAccount")) {
                topicKey = chartOfAccountValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("chartOfAccountDetail")) {
                topicKey = chartOfAccountDetailValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("budgetGroup")) {
                topicKey = budgetGroupValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("financialStatus")) {
                topicKey = financialStatusValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("financialConfiguration")) {
                topicKey = financialConfigurationValidatedKey;
                break;
            }
            if (key.equalsIgnoreCase("recovery")) {
                topicKey = recoveryValidatedKey;
                break;
            }
        }

        financialProducer.sendMessage(validatedTopic, topicKey, topicMap);
    }

    public void addToSearch(Map<String, Object> topicMap) {

        for (Map.Entry<String, Object> entry : topicMap.entrySet()) {
            System.out.println(entry.getKey() + "/" + entry.getValue());
            key = entry.getKey().split("_")[0];

            if (key.equalsIgnoreCase("fund")) {
                topicKey = fundCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("bank")) {
                topicKey = bankCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("bankBranch")) {
                topicKey = bankBranchCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("financialYear")) {
                topicKey = financialYearCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("fiscalPeriod")) {
                topicKey = fiscalPeriodCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("function")) {
                topicKey = functionCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("functionary")) {
                topicKey = functionaryCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("fundsource")) {
                topicKey = fundsourceCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("scheme")) {
                topicKey = schemeCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("bankAccount")) {
                topicKey = bankAccountCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("subScheme")) {
                topicKey = subSchemeCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("supplier")) {
                topicKey = supplierCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountDetailType")) {
                topicKey = accountDetailTypeCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountDetailKey")) {
                topicKey = accountDetailKeyCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountEntity")) {
                topicKey = accountEntityCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("accountCodePurpose")) {
                topicKey = accountCodePurposeCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("chartOfAccount")) {
                topicKey = chartOfAccountCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("chartOfAccountDetail")) {
                topicKey = chartOfAccountDetailCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("budgetGroup")) {
                topicKey = budgetGroupCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("financialStatus")) {
                topicKey = financialStatusCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("financialConfiguration")) {
                topicKey = financialConfigurationCompletedKey;
                break;
            }
            if (key.equalsIgnoreCase("recovery")) {
                topicKey = recoveryCompletedKey;
                break;
            }
        }

        financialProducer.sendMessage(completedTopic, topicKey, topicMap);
    }
}
