package org.egov.services.accountcode.template;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.log4j.Logger;
import org.egov.commons.Accountdetailtype;
import org.egov.commons.CChartOfAccountDetail;
import org.egov.commons.CChartOfAccounts;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.contract.AccountCodeTemplate;
import org.egov.infra.microservice.models.ChartOfAccounts;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.quartz.AdaptableJobFactory;
import org.springframework.stereotype.Service;

import freemarker.template.TemplateNotFoundException;
import javassist.tools.rmi.ObjectNotFoundException;

@Service
public class AccountCodeTemplateService {
    
    private static final Logger LOGGER = Logger.getLogger(AccountCodeTemplateService.class);


    @Autowired
    private MicroserviceUtils microserviceUtils;

    @Autowired
    @Qualifier("chartOfAccountsService")
    private ChartOfAccountsService chartOfAccountsService;

    public List<AccountCodeTemplate> getAccountTemplate(String module, String billSubType, String accountDetailType, int detailTypeId) {
        List<AccountCodeTemplate> accountCodeTemplate = new ArrayList<>();
        try {
            accountCodeTemplate = microserviceUtils.getAccountCodeTemplate(module, billSubType,
                    accountDetailType);
            if(accountDetailType == null){
                accountCodeTemplate = accountCodeTemplate.stream().filter(act -> act.getSubledgerType() == null || act.getSubledgerType().isEmpty()).collect(Collectors.toList());
            }
            if(module.equalsIgnoreCase("ExpenseBill")&&billSubType!=null) {
                prepareAccountCodeDetails(accountCodeTemplate, detailTypeId);
            } else if(module.equalsIgnoreCase("ContractorBill")) {
                prepareAccountCodeDetailsWithContractor(accountCodeTemplate);
            }else if(module.equalsIgnoreCase("SupplierBill")) {
                prepareAccountCodeDetailsWithSupplier(accountCodeTemplate);

                
            }
                
        } catch (ApplicationRuntimeException e) {
            LOGGER.error(e);
            throw new ApplicationRuntimeException("Error occurred while fetching AccountCode Template : "+e.getMessage());
        }
        return accountCodeTemplate;
    }

    private void prepareAccountCodeDetails(List<AccountCodeTemplate> accountCodeTemplate, int detailTypeId) {
            Set<String> debitGlcodeSet = accountCodeTemplate.stream().map(AccountCodeTemplate::getDebitCodeDetails)
                    .flatMap(Collection::stream).map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
            Set<String> creditGlcodeSet = accountCodeTemplate.stream().map(AccountCodeTemplate::getCreditCodeDetails)
                    .flatMap(Collection::stream).map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
            Set<String> netPayableGlcode = accountCodeTemplate.stream().map(AccountCodeTemplate::getNetPayable)
                    .map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
            HashSet<String> allGlCodeSet = new HashSet<>(debitGlcodeSet);
            allGlCodeSet.addAll(creditGlcodeSet);
//            allGlCodeSet.addAll(netPayableGlcode);
            if (allGlCodeSet != null && !allGlCodeSet.isEmpty()) {
                List<CChartOfAccounts> coaList = chartOfAccountsService.getSubledgerAccountCodesForAccountDetailTypeAndNonSubledgers(detailTypeId, allGlCodeSet);
                List<CChartOfAccounts> netPayableCodesByAccountDetailType = chartOfAccountsService.getNetPayableCodesByAccountDetailType(detailTypeId);
                Map<String, CChartOfAccounts> glcodeMap = coaList.stream()
                        .collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
                Map<String, CChartOfAccounts> netPayableAccCodeMap = netPayableCodesByAccountDetailType.stream().collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
                for (AccountCodeTemplate temp : accountCodeTemplate) {
                    if (temp.getNetPayable() != null && temp.getNetPayable().getGlcode() != null) {
                        CChartOfAccounts cChartOfAccounts = netPayableAccCodeMap.get(temp.getNetPayable().getGlcode());
                        if(cChartOfAccounts != null){
                            temp.getNetPayable().setId(cChartOfAccounts.getId());
                            temp.getNetPayable().setIsSubLedger(!cChartOfAccounts.getChartOfAccountDetails().isEmpty());
                            temp.getNetPayable().setName(cChartOfAccounts.getName());                            
                        }else{
                            temp.setNetPayable(null);
                        }
                    }
                    if (temp.getDebitCodeDetails() != null && !temp.getDebitCodeDetails().isEmpty()) {
                        populateCoaDetails(glcodeMap, temp.getDebitCodeDetails());
                    }
                    if (temp.getCreditCodeDetails() != null && !temp.getCreditCodeDetails().isEmpty()) {
                        populateCoaDetails(glcodeMap, temp.getCreditCodeDetails());
                    }
                }
            }
    }
    
    
    private void prepareAccountCodeDetailsWithContractor(List<AccountCodeTemplate> accountCodeTemplate) {
        Set<String> debitGlcodeSet = accountCodeTemplate.stream().map(AccountCodeTemplate::getDebitCodeDetails)
                .flatMap(Collection::stream).map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
        Set<String> creditGlcodeSet = accountCodeTemplate.stream().map(AccountCodeTemplate::getCreditCodeDetails)
                .flatMap(Collection::stream).map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
        Set<String> netPayableGlcode = accountCodeTemplate.stream().map(AccountCodeTemplate::getNetPayable)
                .map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
        HashSet<String> allGlCodeSet = new HashSet<>(debitGlcodeSet);
        allGlCodeSet.addAll(creditGlcodeSet);
        if (allGlCodeSet != null && !allGlCodeSet.isEmpty()) {
            
            List<CChartOfAccounts> coaList = chartOfAccountsService.getSubledgerAccountCodesForAccountDetailTypeAndNonSubledgersWithContractors(allGlCodeSet);
            List<CChartOfAccounts> netPayableCodesByAccountDetailType = chartOfAccountsService.getContractorNetPayableAccountCodes();
            Map<String, CChartOfAccounts> glcodeMap = coaList.stream()
                    .collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
            Map<String, CChartOfAccounts> netPayableAccCodeMap = netPayableCodesByAccountDetailType.stream().collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
            for (AccountCodeTemplate temp : accountCodeTemplate) {
                if (temp.getNetPayable() != null && temp.getNetPayable().getGlcode() != null) {
                    CChartOfAccounts cChartOfAccounts = netPayableAccCodeMap.get(temp.getNetPayable().getGlcode());
                    if(cChartOfAccounts != null){
                        temp.getNetPayable().setId(cChartOfAccounts.getId());
                        temp.getNetPayable().setIsSubLedger(!cChartOfAccounts.getChartOfAccountDetails().isEmpty());
                        temp.getNetPayable().setName(cChartOfAccounts.getName());                            
                    }else{
                        temp.setNetPayable(null);
                    }
                }
                if (temp.getDebitCodeDetails() != null && !temp.getDebitCodeDetails().isEmpty()) {
                    populateCoaDetails(glcodeMap, temp.getDebitCodeDetails());
                }
                if (temp.getCreditCodeDetails() != null && !temp.getCreditCodeDetails().isEmpty()) {
                    populateCoaDetails(glcodeMap, temp.getCreditCodeDetails());
                }
            }
        }
}
    
    private void prepareAccountCodeDetailsWithSupplier(List<AccountCodeTemplate> accountCodeTemplate) {
        Set<String> debitGlcodeSet = accountCodeTemplate.stream().map(AccountCodeTemplate::getDebitCodeDetails)
                .flatMap(Collection::stream).map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
        Set<String> creditGlcodeSet = accountCodeTemplate.stream().map(AccountCodeTemplate::getCreditCodeDetails)
                .flatMap(Collection::stream).map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
        Set<String> netPayableGlcode = accountCodeTemplate.stream().map(AccountCodeTemplate::getNetPayable)
                .map(ChartOfAccounts::getGlcode).collect(Collectors.toSet());
        HashSet<String> allGlCodeSet = new HashSet<>(debitGlcodeSet);
        allGlCodeSet.addAll(creditGlcodeSet);
        if (allGlCodeSet != null && !allGlCodeSet.isEmpty()) {
            
            List<CChartOfAccounts> coaList = chartOfAccountsService.getSubledgerAccountCodesForAccountDetailTypeAndNonSubledgersWithSupplier(allGlCodeSet);
            List<CChartOfAccounts> netPayableCodesByAccountDetailType = chartOfAccountsService.getSupplierNetPayableAccountCodes();
            Map<String, CChartOfAccounts> glcodeMap = coaList.stream()
                    .collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
            Map<String, CChartOfAccounts> netPayableAccCodeMap = netPayableCodesByAccountDetailType.stream().collect(Collectors.toMap(CChartOfAccounts::getGlcode, Function.identity()));
            for (AccountCodeTemplate temp : accountCodeTemplate) {
                if (temp.getNetPayable() != null && temp.getNetPayable().getGlcode() != null) {
                    CChartOfAccounts cChartOfAccounts = netPayableAccCodeMap.get(temp.getNetPayable().getGlcode());
                    if(cChartOfAccounts != null){
                        temp.getNetPayable().setId(cChartOfAccounts.getId());
                        temp.getNetPayable().setIsSubLedger(!cChartOfAccounts.getChartOfAccountDetails().isEmpty());
                        temp.getNetPayable().setName(cChartOfAccounts.getName());                            
                    }else{
                        temp.setNetPayable(null);
                    }
                }
                if (temp.getDebitCodeDetails() != null && !temp.getDebitCodeDetails().isEmpty()) {
                    populateCoaDetails(glcodeMap, temp.getDebitCodeDetails());
                }
                if (temp.getCreditCodeDetails() != null && !temp.getCreditCodeDetails().isEmpty()) {
                    populateCoaDetails(glcodeMap, temp.getCreditCodeDetails());
                }
            }
        }
}

    private void populateCoaDetails(Map<String, CChartOfAccounts> glcodeMap, List<ChartOfAccounts> accCodeDetails) {
        List<ChartOfAccounts> tempCoa = new ArrayList();
        for(ChartOfAccounts coa : accCodeDetails){
            CChartOfAccounts cChartOfAccounts = glcodeMap.get(coa.getGlcode());
            if(cChartOfAccounts != null){
                coa.setId(cChartOfAccounts.getId());
                coa.setName(cChartOfAccounts.getName());
                coa.setIsSubLedger(!cChartOfAccounts.getChartOfAccountDetails().isEmpty());
                tempCoa.add(coa);
            }
        }
        accCodeDetails.clear();
        accCodeDetails.addAll(tempCoa);
    }

    private void validateChartOfAccount(ChartOfAccounts coa, Map<String, CChartOfAccounts> glcodeMap) {
        if(coa != null && coa.getGlcode() != null && glcodeMap.get(coa.getGlcode()) == null){
            throw new ApplicationRuntimeException(String.format("coa %s is not exist in finance system. please check the AccountCodeTemplate mdms file", new String[]{coa.getGlcode()}));
        }
    }
}
