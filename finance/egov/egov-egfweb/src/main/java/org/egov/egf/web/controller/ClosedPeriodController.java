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

import java.text.SimpleDateFormat;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.egov.commons.service.CFinancialYearService;
import org.egov.egf.model.ClosedPeriod;
import org.egov.egf.model.ClosedPeriodSearchRequest;
import org.egov.egf.web.adaptor.ClosedPeriodJsonAdaptor;
import org.egov.enums.CloseTypeEnum;
import org.egov.infra.utils.DateUtils;
import org.egov.services.closeperiod.ClosedPeriodService;
import org.egov.utils.FinancialConstants;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
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
@RequestMapping("/closedperiod")
@Validated
public class ClosedPeriodController {
    private static final String CLOSED_PERIOD = "closedPeriod";
    private static final String CLOSED_PERIOD_SEARCH_REQUEST = "closedPeriodSearchRequest";
	private static final String CLOSEDPERIOD_RESULT = "closedperiod-result";
    private static final String CLOSEDPERIOD_REOPEN = "closedperiod-reopen";
    private static final String CLOSEDPERIOD_SEARCH = "closedperiod-search";
    private static final String CLOSEDPERIOD = CLOSED_PERIOD;
    private static final String CLOSEDPERIOD_NEW = "closedperiod-new";
    private static final String CLOSEDPERIOD_VIEW = "closedperiod-view";
    final SimpleDateFormat dtFormat = new SimpleDateFormat("dd-MM-yyyy");

    @Autowired
    private ClosedPeriodService closedPeriodService;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private CFinancialYearService cFinancialYearService;

    private void prepareNewForm(final Model model) {
        model.addAttribute("cFinancialYears", cFinancialYearService.getFinancialYearNotClosedAndActive());
        model.addAttribute("getAllMonths", DateUtils.getAllMonths());
    }
    
    private void prepareSoftClosePeriod(final Model model) {
        model.addAttribute("cFinancialYears", closedPeriodService.getAllSoftClosePeriods());
    }

    @RequestMapping(value = "/new", method = { RequestMethod.GET, RequestMethod.POST })
    public String newForm(final Model model) {
        prepareNewForm(model);
        final ClosedPeriod attributeValue = new ClosedPeriod();
        attributeValue.setFromDate(FinancialConstants.FINANCIALYEAR_STARTING_MONTH);
        model.addAttribute(CLOSED_PERIOD, attributeValue);
        return CLOSEDPERIOD_NEW;
    }

    @PostMapping(value = "/create")
    public String create(@Valid @ModelAttribute final ClosedPeriod closedPeriod, final Model model,
            final BindingResult errors, final HttpServletRequest request, final RedirectAttributes redirectAttrs) {

        closedPeriodService.prepareSartingDateAndEndingDate(closedPeriod);
        closedPeriodService.validateClosedPeriods(closedPeriod, errors);
        if (errors.hasErrors()) {
            prepareNewForm(model);
            return CLOSEDPERIOD_NEW;
        }
        closedPeriodService.create(closedPeriod);
        final String startDate = dtFormat.format(closedPeriod.getStartingDate());
        final String endDate = dtFormat.format(closedPeriod.getEndingDate());
        redirectAttrs.addFlashAttribute("message",
                messageSource.getMessage("msg.closedPeriod.success", new String[] { startDate, endDate }, null));
        return "redirect:/closedperiod/result/" + closedPeriod.getId();
    }

    @GetMapping(value = "/reopen/{id}")
    public String edit(@PathVariable("id") final Long id, final Model model) {
        final ClosedPeriod closedPeriod = closedPeriodService.findOne(id);

        prepareNewForm(model);
        if (closedPeriod.getIsClosed().booleanValue())
            closedPeriod.setRemarks("");
        model.addAttribute(CLOSEDPERIOD, closedPeriod);
        return CLOSEDPERIOD_REOPEN;
    }

    @PostMapping(value = "/update")
    public String update(@Valid @ModelAttribute final ClosedPeriod closedPeriod, final BindingResult errors, final Model model,
            final RedirectAttributes redirectAttrs) {
        if (errors.hasErrors()) {
            prepareSoftClosePeriod(model);
            return CLOSEDPERIOD_REOPEN;
        }
        closedPeriodService.update(closedPeriod);
        final String startDate = dtFormat.format(closedPeriod.getStartingDate());
        final String endDate = dtFormat.format(closedPeriod.getEndingDate());
        redirectAttrs.addFlashAttribute("message",
                messageSource.getMessage("msg.reopenedperiod.success", new String[] { startDate, endDate }, null));
        return "redirect:/closedperiod/result/" + closedPeriod.getId();

    }

    @RequestMapping(value = "/view/{id}", method = { RequestMethod.GET, RequestMethod.POST })
    public String view(@PathVariable("id") final Long id, final Model model) {
        final ClosedPeriod closedPeriod = closedPeriodService.findOne(id);
        prepareNewForm(model);
        model.addAttribute(CLOSEDPERIOD, closedPeriod);
        return CLOSEDPERIOD_VIEW;
    }

    @GetMapping(value = "/result/{id}")
    public String result(@PathVariable("id") final Long id, final Model model) {
        final ClosedPeriod closedPeriod = closedPeriodService.findOne(id);
        model.addAttribute(CLOSEDPERIOD, closedPeriod);
        return CLOSEDPERIOD_RESULT;
    }

    @RequestMapping(value = "/search/{mode}", method = { RequestMethod.GET, RequestMethod.POST })
    public String search(@PathVariable("mode") @SafeHtml final String mode, final Model model) {
        final ClosedPeriodSearchRequest closedPeriodSearchRequest = new ClosedPeriodSearchRequest();

        if (mode.equalsIgnoreCase("reopen"))
            prepareSoftClosePeriod(model);
        else
            prepareNewForm(model);
        model.addAttribute(CLOSED_PERIOD_SEARCH_REQUEST, closedPeriodSearchRequest);
        return CLOSEDPERIOD_SEARCH;

    }

    @PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, final Model model,
        @Valid @ModelAttribute final ClosedPeriodSearchRequest closedPeriodSearchRequest) {
        if (mode.equalsIgnoreCase("reopen"))
            closedPeriodSearchRequest.setCloseType(CloseTypeEnum.SOFTCLOSE);
        closedPeriodSearchRequest.setIsClosed(true);
        final List<ClosedPeriod> searchResultList = closedPeriodService.search(closedPeriodSearchRequest);
        return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
    }

    public Object toSearchResultJson(final Object object) {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        final Gson gson = gsonBuilder.registerTypeAdapter(ClosedPeriod.class, new ClosedPeriodJsonAdaptor()).create();
        return gson.toJson(object);
    }
}