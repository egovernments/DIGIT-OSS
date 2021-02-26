package org.egov.edcr.web.controller.report;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.egov.edcr.entity.SearchBuildingPlanScrutinyForm;
import org.egov.edcr.service.EdcrApplicationService;
import org.egov.edcr.web.adaptor.SearchBuildingPlanScrutinyAdaptor;
import org.egov.infra.web.support.ui.DataTable;
import org.egov.infra.web.utils.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("/reports")
public class EdcrReportsController {
    private static final String SCR_SRCH_RPRT = "search-building-plan-scrutiny-report";
    private static final String BPA_REST_URL = "%s/bpa/rest/stakeholder/type";

    @Autowired
    private EdcrApplicationService edcrApplicationService;

    @GetMapping("/buildingplan-scrutinyreport")
    public String searchBuildingPlanScrutinyForm(final Model model, final HttpServletRequest request) {
        List<String> statusList = new ArrayList<>();
        statusList.add("Accepted");
        statusList.add("Not Accepted");
        statusList.add("Aborted");
        model.addAttribute("searchBuildingPlanScrutinyForm", new SearchBuildingPlanScrutinyForm());
        model.addAttribute("buildingLicenseeTypeList", getStakeHolderTypes(request));
        model.addAttribute("statusList", statusList);
        return SCR_SRCH_RPRT;
    }

    @PostMapping(value = "/buildingplan-scrutinyreport", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String searchBuildingPlanScrutiny(final SearchBuildingPlanScrutinyForm srchPlnScrtny) {
        return new DataTable<>(edcrApplicationService.planScrutinyPagedSearch(srchPlnScrtny),
                srchPlnScrtny.draw())
                        .toJson(SearchBuildingPlanScrutinyAdaptor.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> getStakeHolderTypes(HttpServletRequest request) {
        final RestTemplate restTemplate = new RestTemplate();
        final String url = String.format(BPA_REST_URL, WebUtils.extractRequestDomainURL(request, false));
        return restTemplate.getForObject(url, List.class);
    }
}
