package org.egov.collection.web.controller.report;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.log4j.Logger;
import org.egov.collection.entity.DishonoredChequeBean;
import org.egov.collection.integration.services.DishonorChequeService;
import org.egov.commons.dao.FinancialYearDAO;
import org.egov.infra.microservice.models.BankAccountServiceMapping;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infstr.services.PersistenceService;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;

@Controller
@RequestMapping("/report/dishonouredcheque")
@Validated
public class ChequeDishonouredReportController {
    
    private static final String DISHONOURED_CHECQUE_REPORT = "dishonouredchequesearchreport";
    private static final Logger LOGGER = Logger.getLogger(ChequeDishonouredReportController.class);
    
    @Autowired
    protected EgovMasterDataCaching masterDataCache;
    @Autowired
    public MicroserviceUtils microserviceUtils;
    @Autowired
    private transient FinancialYearDAO financialYearDAO;
    @Autowired
    @Qualifier("persistenceService")
    protected transient PersistenceService persistenceService;
   
    @Autowired
    private DishonorChequeService dishonorChequeService;
    
    @ModelAttribute
    public DishonoredChequeBean searchRequest() {
        return new DishonoredChequeBean();
    }


    @RequestMapping(method = { RequestMethod.POST, RequestMethod.GET }, value = "/searchform")
    public String searchForm(final Model model) {
        prepareModel(model);
        return DISHONOURED_CHECQUE_REPORT;
    }
    
    @GetMapping(value = "/_search", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
	public List<DishonoredChequeBean> getDishonouredChequeSearch(
			@Valid @ModelAttribute final DishonoredChequeBean dishonoredChequeBean, final BindingResult errors)
			throws ParseException {
		return dishonorChequeService.getDishonouredChequeReport(dishonoredChequeBean);
	}

    @GetMapping(value = "/service/{accountNumber}")
    public @ResponseBody ResponseEntity getServiceByAccountNumber(
            @PathVariable(name = "accountNumber", required = true) @SafeHtml String accountNumber) {
        try {
            List<BankAccountServiceMapping> bankAcntServiceMappings = microserviceUtils
                    .getBankAcntServiceMappings(accountNumber, null);
            return new ResponseEntity<>(bankAcntServiceMappings, HttpStatus.OK);
        } catch (HttpClientErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private void prepareModel(Model model) {
        model.addAttribute("dishonoredChequeBean", new DishonoredChequeBean());
        model.addAttribute("bankAccServiceMapp", getBankAccountServiceMapping());
        model.addAttribute("instrumentTypes", getInstrumentMap());
        model.addAttribute("businessServices", microserviceUtils.getBusinessService("Finance"));
    }

    private Object getBankAccountServiceMapping() {
        List<BankAccountServiceMapping> serviceMappings = microserviceUtils.getBankAcntServiceMappings();
        return serviceMappings.stream().collect(Collectors.toMap(BankAccountServiceMapping::getBankAccount,
                Function.identity(), (oldValue, newValue) -> oldValue));
    }

    private Map<String, String> getInstrumentMap() {
        Map<String, String> hashMap = new HashMap<>();
        hashMap.put("DD", "DD");
        hashMap.put("Cheque", "CHEQUE");
        return hashMap;
    }
}