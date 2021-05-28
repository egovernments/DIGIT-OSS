package org.egov.egf.web.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.egov.commons.CChartOfAccounts;
import org.egov.commons.dao.ChartOfAccountsHibernateDAO;
import org.egov.commons.service.AccountPurposeService;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.egf.web.adaptor.ChartOfAccountReportJsonAdaptor;
import org.egov.model.report.ChartOfAccountsReport;
import org.egov.services.report.ChartOfAccountsReportService;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Controller
@RequestMapping("/masters/coareport")
@Validated
public class ChartOfAccountsReportController {

	private static final String COA_REPORT = "coareport";

	@Autowired
	private ChartOfAccountsReportService chartOfAccountsReportService;

	@Autowired
	private AccountPurposeService accountPurposeService;

	@Autowired
	@Qualifier("chartOfAccountsService")
	private ChartOfAccountsService chartOfAccountsService;

	@Autowired
	private AccountdetailtypeService accountdetailtypeService;

	@Autowired
	private ChartOfAccountsHibernateDAO chartOfAccountsHibernateDAO;

	@ModelAttribute
	public ChartOfAccountsReport searchRequest() {
		return new ChartOfAccountsReport();
	}

	private void prepareNewForm(Model model) {
		model.addAttribute("accountDetailTypeList", accountdetailtypeService.findAll());
		model.addAttribute("purposeList", accountPurposeService.findAll());
		model.addAttribute("majorCodeList", chartOfAccountsReportService.getMajorCodeList());
		model.addAttribute("minCodeList", chartOfAccountsReportService.getMinorCodeList());

	}

	@RequestMapping(method = { RequestMethod.POST, RequestMethod.GET }, value = "/search")
	public String searchForm(final Model model) {
		prepareNewForm(model);
		return COA_REPORT;
	}

	@GetMapping(value = "/coareportResult", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String getcoaReportResult(final Model model,
			@ModelAttribute final ChartOfAccountsReport chartOfAccountsReport, final HttpServletRequest request) {
		final List<ChartOfAccountsReport> coaReportList = chartOfAccountsReportService
				.getCoaReport(chartOfAccountsReport);

		return new StringBuilder("{ \"data\":").append(toSearchResultJson(coaReportList)).append("}").toString();
	}

	@GetMapping(value = "/ajax/getAccountCodeAndName")
	public @ResponseBody List<CChartOfAccounts> getAccounts(@RequestParam("accountCode") @SafeHtml String accountCode) {
		return chartOfAccountsHibernateDAO.findDetailedAccountCodesByGlcodeOrNameLike(accountCode);
	}

	@GetMapping(value = "/ajax/getMinorCode")
	public @ResponseBody List<CChartOfAccounts> getMinorAccounts(@RequestParam("parentId") Long parentId) {
		return chartOfAccountsReportService.getMinCodeListByMajorCodeId(parentId);
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder
				.registerTypeAdapter(ChartOfAccountsReport.class, new ChartOfAccountReportJsonAdaptor()).create();
		return gson.toJson(object);
	}

}
