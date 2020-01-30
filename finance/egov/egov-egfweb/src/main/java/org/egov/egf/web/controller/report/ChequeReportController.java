package org.egov.egf.web.controller.report;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.egf.web.adaptor.ChartOfAccountReportJsonAdaptor;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.egov.model.cheque.ChequeReportJsonAdaptor;
import org.egov.model.cheque.ChequeReportModel;
import org.egov.model.cheque.SurrenderChequeSearchCriteria;
import org.egov.model.report.ChartOfAccountsReport;
import org.egov.services.instrument.InstrumentHeaderService;
import org.egov.services.instrument.InstrumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Controller
@RequestMapping("/report/cheque")
public class ChequeReportController {
    
    @Autowired
    protected EgovMasterDataCaching masterDataCache;
    @Autowired
    @Qualifier("instrumentService")
    private InstrumentService instrumentService;
    @Autowired
    private AppConfigValueService appConfigValuesService;

    @RequestMapping(method = {RequestMethod.POST,RequestMethod.GET}, value = "/surrendered/form")
    public String getSurrenderChequeForm(final Model model){
        prepareModel(model);
        return "surrendered_cheque";
    }
    
    @GetMapping("/bankBranch/_search")
    public @ResponseBody Map searchBankBranch(@RequestParam("fundId") int fundId){
        return getBankBranch(fundId);
    }
    
    @GetMapping("/bankAccount/_search")
    public @ResponseBody Map searchBankAccount(@RequestParam(name="fundId", required=false) int fundId, @RequestParam("branchId") int branchId){
        return getBankAccount(fundId,branchId);
    }
    
    @RequestMapping(value = "/surredered/_search", method = RequestMethod.GET, produces = MediaType.TEXT_PLAIN_VALUE)
    public @ResponseBody String  search(@ModelAttribute ChequeReportModel model){
        String result = new StringBuilder("{ \"data\":").append(toSearchResultJson(getSurrenderedCheque(model))).append("}")
                .toString();
        return result;
    }
    
    private List<ChequeReportModel> getSurrenderedCheque(ChequeReportModel model) {
        List<ChequeReportModel> surrenderedCheque = instrumentService.getSurrenderedCheque(model);
        return surrenderedCheque;
    }

//    @ModelAttribute("chequeReportModel")
//    public ChequeReportModel chequeReportModel(){
//        return new ChequeReportModel();
//    }

    private void prepareModel(Model model) {
        model.addAttribute("chequeReportModel",new ChequeReportModel());
        model.addAttribute("fundList", masterDataCache.get("egi-fund"));
        model.addAttribute("bankBranchList", getBankBranch(0));
        model.addAttribute("surrendarReasonMap", loadReasonsForSurrendaring());
    }
    
    private Map<String,String> getBankBranch(int fundId){
        Map<String,String> bankBranchMap = new HashMap();
        List<Object[]> bankBranchByFundId = instrumentService.getBankBranchByFundId(fundId);
        if(!bankBranchByFundId.isEmpty()){
            for(Object[] obj:bankBranchByFundId){
                bankBranchMap.put(obj[0].toString(), obj[1].toString());
            }
        }
        return bankBranchMap;
    }
    
    private Map<String,String> getBankAccount(int fundId, int branchId){
        Map<String,String> bankAccountMap = new HashMap();
        List<Object[]> bankAccount = instrumentService.getBankAccount(fundId, branchId);
        if(!bankAccount.isEmpty()){
            for(Object[] obj:bankAccount){
                bankAccountMap.put(obj[0].toString(), obj[2].toString()+"--"+obj[3].toString());
            }
        }
        return bankAccountMap;
    }
    
    public Map loadReasonsForSurrendaring() {
//        if (LOGGER.isDebugEnabled())
//            LOGGER.debug("Starting loadReasonsForSurrendaring...");

        List<AppConfigValues> appConfigValuesList;
        LinkedHashMap<String, String> surrendarReasonMap = new LinkedHashMap<String, String>();
        appConfigValuesList = appConfigValuesService.getConfigValuesByModuleAndKey("EGF", "Reason For Cheque Surrendaring");
        for (final AppConfigValues app : appConfigValuesList) {
            final String value = app.getValue();
            if (app.getValue().indexOf('|') != -1)
                surrendarReasonMap.put(app.getValue(), value.substring(0, app.getValue().indexOf('|')));
            else
                surrendarReasonMap.put(app.getValue(), app.getValue());
        }
//        if (LOGGER.isDebugEnabled())
//            LOGGER.debug("Completed loadReasonsForSurrendaring.");
    return surrendarReasonMap;
    }
    
    public Object toSearchResultJson(final Object object) {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        final Gson gson = gsonBuilder.registerTypeAdapter(ChequeReportModel.class, new ChequeReportJsonAdaptor()).create();
        final String json = gson.toJson(object);
        return json;
}
    
}
