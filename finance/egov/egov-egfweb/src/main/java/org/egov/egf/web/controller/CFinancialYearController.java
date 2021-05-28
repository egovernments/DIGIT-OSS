/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.egf.web.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.egov.commons.CFinancialYear;
import org.egov.commons.CFiscalPeriod;
import org.egov.commons.contracts.CFinanancialYearSearchRequest;
import org.egov.commons.service.CFinancialYearService;
import org.egov.egf.web.adaptor.CFinancialYearJsonAdaptor;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Controller
@RequestMapping("/cfinancialyear")
public class CFinancialYearController {
	private static final String CREATE = "create";
	private static final String C_FINANCIAL_YEAR = "CFinancialYear";
	private static final String C_FINANCIAL_YEAR_SEARCH_REQUEST = "CFinancialYearSearchRequest";
	private static final String MESSAGE = "message";
	private static final String CFINANCIALYEAR_NEW = "cfinancialyear-new";
	private static final String CFINANCIALYEAR_RESULT = "cfinancialyear-result";
	private static final String CFINANCIALYEAR_EDIT = "cfinancialyear-edit";
	private static final String CFINANCIALYEAR_VIEW = "cfinancialyear-view";
	private static final String CFINANCIALYEAR_SEARCH = "cfinancialyear-search";
	private static final String CFINANCIALYEAR_CLOSE = "cfinancialyear-close";

	@Autowired
	private CFinancialYearService cFinancialYearService;

	@Autowired
	private MessageSource messageSource;

	private void prepareNewForm(final Model model) {
		model.addAttribute("cFinancialYears", cFinancialYearService.findAll());
	}

	@RequestMapping(value = "/new", method = { RequestMethod.GET, RequestMethod.POST })
	public String newForm(final Model model) {
		prepareNewForm(model);
		final SimpleDateFormat dtFormat = new SimpleDateFormat("dd/MM/yyyy");
		final CFinancialYear financialYear = new CFinancialYear();
		if (financialYear.getcFiscalPeriod().isEmpty())
			financialYear.addCFiscalPeriod(new CFiscalPeriod());
		final Date nextStartingDate = cFinancialYearService.getNextFinancialYearStartingDate();
		model.addAttribute("startingDate", dtFormat.format(nextStartingDate));
		model.addAttribute(C_FINANCIAL_YEAR, financialYear);
		model.addAttribute("mode", CREATE);
		return CFINANCIALYEAR_NEW;
	}

	@PostMapping(value = "/create")
	public String create(@Valid @ModelAttribute CFinancialYear cFinancialYear, final BindingResult errors,
			final Model model, final RedirectAttributes redirectAttrs) throws ParseException {
		final Boolean flag = false;
		final Boolean isActive = true;
		cFinancialYearService.validateMandatoryFields(cFinancialYear, errors);
		if (errors.hasErrors()) {
			prepareNewForm(model);
			model.addAttribute("mode", CREATE);
			return CFINANCIALYEAR_NEW;
		}
		CFiscalPeriod fiscalPeriod;
		final List<CFiscalPeriod> fiscalList = cFinancialYear.getcFiscalPeriod();
		for (final CFiscalPeriod fiscal : fiscalList) {
			fiscalPeriod = cFinancialYearService.findByFiscalName(fiscal.getName());
			if (fiscalPeriod != null) {
				prepareNewForm(model);
				redirectAttrs.addFlashAttribute("financialYear", cFinancialYear);
				model.addAttribute(MESSAGE, "Entered Fiscal Period Name " + fiscalPeriod.getName() + " already Exists");
				model.addAttribute("mode", CREATE);
				return CFINANCIALYEAR_NEW;
			}
		}
		cFinancialYear.setIsActive(isActive);
		cFinancialYear.setIsClosed(flag);
		cFinancialYear.setTransferClosingBalance(flag);
		buildFiscalPeriodDetails(cFinancialYear, cFinancialYear.getcFiscalPeriod());
		cFinancialYearService.create(cFinancialYear);
		redirectAttrs.addFlashAttribute(MESSAGE,
				messageSource.getMessage("msg.cFinancialYear.success", null, Locale.ENGLISH));
		return "redirect:/cfinancialyear/result/" + cFinancialYear.getId();
	}

	@GetMapping(value = "/edit/{id}")
	public String edit(@PathVariable("id") final Long id, final Model model) {
		final CFinancialYear cFinancialYear = cFinancialYearService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(C_FINANCIAL_YEAR, cFinancialYear);
		model.addAttribute("mode", "edit");
		return CFINANCIALYEAR_EDIT;
	}

	@PostMapping(value = "/update")
	public String update(@Valid @ModelAttribute final CFinancialYear cFinancialYear, final BindingResult errors,
			final Model model, final RedirectAttributes redirectAttrs, HttpServletRequest request) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return CFINANCIALYEAR_EDIT;
		}
		String mode = request.getParameter("mode");
		String message = "msg.cFinancialYear.success";

		if ("close".equalsIgnoreCase(mode)) {
			message = "msg.closedFinancialYear.success";
			if (cFinancialYear.getIsClosed() && cFinancialYear.getTransferClosingBalance()) {
				cFinancialYear.setIsActiveForPosting(false);
			}
		}
		cFinancialYearService.update(cFinancialYear);
		redirectAttrs.addFlashAttribute(MESSAGE, messageSource.getMessage(message, null, Locale.ENGLISH));
		redirectAttrs.addFlashAttribute("mode", mode);
		return "redirect:/cfinancialyear/result/" + cFinancialYear.getId();
	}

	@GetMapping(value = "/view/{id}")
	public String view(@PathVariable("id") final Long id, final Model model) {
		final CFinancialYear cFinancialYear = cFinancialYearService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(C_FINANCIAL_YEAR, cFinancialYear);
		return CFINANCIALYEAR_VIEW;
	}

	@GetMapping(value = "/close/{id}")
	public String close(@PathVariable("id") final Long id, final Model model) {
		final CFinancialYear cFinancialYear = cFinancialYearService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(C_FINANCIAL_YEAR, cFinancialYear);
		model.addAttribute("mode", "close");
		return CFINANCIALYEAR_CLOSE;
	}

	@GetMapping(value = "/result/{id}")
	public String result(@PathVariable("id") final Long id, final Model model) {
		final CFinancialYear cFinancialYear = cFinancialYearService.findOne(id);
		model.addAttribute(C_FINANCIAL_YEAR, cFinancialYear);
		return CFINANCIALYEAR_RESULT;
	}

	@RequestMapping(value = "/search/{mode}", method = { RequestMethod.GET, RequestMethod.POST })
	public String search(@PathVariable("mode") @SafeHtml final String mode, final Model model) {
		final CFinanancialYearSearchRequest cFinanancialYearSearchRequest = new CFinanancialYearSearchRequest();
		model.addAttribute("financialYears", cFinancialYearService.findAll());
		prepareNewForm(model);
		model.addAttribute(C_FINANCIAL_YEAR_SEARCH_REQUEST, cFinanancialYearSearchRequest);
		return CFINANCIALYEAR_SEARCH;

	}

	@PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, final Model model,
			@Valid @ModelAttribute final CFinanancialYearSearchRequest cFinanancialYearSearchRequest) {
		final List<CFinancialYear> searchResultList = cFinancialYearService.search(cFinanancialYearSearchRequest);
		return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder.registerTypeAdapter(CFinancialYear.class, new CFinancialYearJsonAdaptor())
				.create();
		return gson.toJson(object);
	}

	private CFinancialYear buildFiscalPeriodDetails(final CFinancialYear cFinancialYear,
			final List<CFiscalPeriod> fiscalPeriodDetail) {
		final Boolean flag = false;
		final Set<CFiscalPeriod> fiscalPeriodSet = new HashSet<>();

		for (final CFiscalPeriod fpDetail : fiscalPeriodDetail) {
			fpDetail.setIsActive(flag);
			fpDetail.setIsActiveForPosting(flag);
			fpDetail.setIsClosed(flag);
			fpDetail.setcFinancialYear(cFinancialYear);
			fiscalPeriodSet.add(fpDetail);
		}

		cFinancialYear.getcFiscalPeriod().clear();

		cFinancialYear.getcFiscalPeriod().addAll(fiscalPeriodSet);

		return cFinancialYear;

	}

	@GetMapping(value = "/validatedIsClosed/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String validateClosingPeriods(@PathVariable("id") Long id) {
		final CFinancialYear cFinancialYear = cFinancialYearService.findOne(id);
		return cFinancialYear.getTransferClosingBalance().toString();
	}
}