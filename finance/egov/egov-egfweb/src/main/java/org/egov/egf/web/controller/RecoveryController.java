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

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.commons.CChartOfAccounts;
import org.egov.commons.dao.ChartOfAccountsDAO;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.egf.web.adaptor.RecoveryJsonAdaptor;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.model.recoveries.Recovery;
import org.egov.model.recoveries.RecoverySearchRequest;
import org.egov.model.service.RecoveryService;
import org.egov.services.masters.BankService;
import org.egov.services.masters.EgPartyTypeService;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Controller
@RequestMapping("/recovery")
public class RecoveryController {
    private static final String RECOVERY = "recovery";
    private static final String RECOVERY_SEARCH_REQUEST = "recoverySearchRequest";
	private static final String RECOVERY_NEW = "recovery-new";
    private static final String RECOVERY_RESULT = "recovery-result";
    private static final String RECOVERY_EDIT = "recovery-edit";
    private static final String RECOVERY_VIEW = "recovery-view";
    private static final String RECOVERY_SEARCH = "recovery-search";
    @Autowired
    @Qualifier("remittanceRecoveryService")
    private RecoveryService recoveryService;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    @Qualifier("chartOfAccountsService")
    private ChartOfAccountsService chartOfAccountsService;
    @Autowired
    @Qualifier("bankService")
    private BankService bankService;
    @Autowired
    @Qualifier("egPartyTypeService")
    private EgPartyTypeService egPartyTypeService;
    @Autowired
    private ChartOfAccountsDAO chartOfAccountsDAO;

    @SuppressWarnings("deprecation")
	private void prepareNewForm(final Model model) {
        model.addAttribute("chartOfAccountss", chartOfAccountsDAO.getNonControlledGlcode());
        model.addAttribute("chartOfAccounts", chartOfAccountsDAO.getForRecovery());
        model.addAttribute("egPartytypes", egPartyTypeService.findAll());
        model.addAttribute("banks", bankService.findAll());
    }

    @PostMapping(value = "/new")
    public String newForm(final Model model) {
        prepareNewForm(model);
        model.addAttribute(RECOVERY, new Recovery());
        return RECOVERY_NEW;
    }

    @SuppressWarnings("deprecation")
	@PostMapping(value = "/create")
    public String create(@Valid @ModelAttribute final Recovery recovery, final BindingResult errors, final Model model,
            final RedirectAttributes redirectAttrs) {
        if (errors.hasErrors()) {
            prepareNewForm(model);
            return RECOVERY_NEW;
        }
        if (recovery.getBank() != null && recovery.getBank().getId() != null)
            recovery.setBank(bankService.findById(recovery.getBank().getId(), false));
        else
            recovery.setBank(null);

        recovery.setChartofaccounts(chartOfAccountsService.findById(recovery.getChartofaccounts().getId(), false));
        recovery.setEgPartytype(egPartyTypeService.findById(recovery.getEgPartytype().getId(), false));
        recovery.setCreatedBy(ApplicationThreadLocals.getUserId());
        recoveryService.create(recovery);
        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.recovery.success", null, null));
        return "redirect:/recovery/result/" + recovery.getId() + "/create";
    }

    @SuppressWarnings("deprecation")
	@GetMapping(value = "/edit/{id}")
    public String edit(@PathVariable("id") final Long id, final Model model) {
        final Recovery recovery = recoveryService.findOne(id);
        if (recovery.getBank() != null && recovery.getBank().getId() != null)
            recovery.setBankLoan(true);
        final List<CChartOfAccounts> coas = new ArrayList<>();
        final CChartOfAccounts coa = chartOfAccountsService.findById(recovery.getChartofaccounts().getId(), false);
        coas.add(coa);
        prepareNewForm(model);
        recovery.setChartofaccounts(coa);
        model.addAttribute("chartOfAccountss", coas);
        model.addAttribute(RECOVERY, recovery);
        return RECOVERY_EDIT;
    }

    @SuppressWarnings("deprecation")
	@PostMapping(value = "/update")
    public String update(@Valid @ModelAttribute final Recovery recovery, final BindingResult errors, final Model model,
            final RedirectAttributes redirectAttrs) {
        if (errors.hasErrors()) {
            prepareNewForm(model);
            return RECOVERY_EDIT;
        }
        if (recovery.getBank() != null && recovery.getBank().getId() != null)
            recovery.setBank(bankService.findById(recovery.getBank().getId(), false));
        else
            recovery.setBank(null);
        recovery.setChartofaccounts(chartOfAccountsService.findById(recovery.getChartofaccounts().getId(), false));
        if (recovery.getEgPartytype() != null)
            recovery.setEgPartytype(egPartyTypeService.findById(recovery.getEgPartytype().getId(), false));
        recoveryService.update(recovery);
        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.recovery.success", null, null));
        return "redirect:/recovery/result/" + recovery.getId() + "/update";
    }

    @GetMapping(value = "/view/{id}")
    public String view(@PathVariable("id") final Long id, final Model model) {
        final Recovery recovery = recoveryService.findOne(id);
        if (recovery.getBank() != null && recovery.getBank().getId() != null)
            recovery.setBankLoan(true);
        prepareNewForm(model);
        model.addAttribute(RECOVERY, recovery);
        return RECOVERY_VIEW;
    }

    @GetMapping(value = "/result/{id}/{mode}")
    public String result(@PathVariable("id") final Long id, @PathVariable("mode") @SafeHtml final String mode,
            final Model model) {
        final Recovery recovery = recoveryService.findOne(id);
        model.addAttribute(RECOVERY, recovery);
        model.addAttribute("mode", mode);
        return RECOVERY_RESULT;
    }

    @PostMapping(value = "/search/{mode}")
    public String search(@PathVariable("mode") @SafeHtml final String mode, final Model model) {
        final RecoverySearchRequest recoverySearchRequest = new RecoverySearchRequest();
        prepareNewForm(model);
        model.addAttribute(RECOVERY_SEARCH_REQUEST, recoverySearchRequest);
        return RECOVERY_SEARCH;

    }

	@SuppressWarnings("deprecation")
	@PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, final Model model,
			@Valid @ModelAttribute final RecoverySearchRequest recoverySearchRequest) {
		CChartOfAccounts chartOfAccounts = null;
		if (recoverySearchRequest != null && recoverySearchRequest.getChartofaccountsId() != null)
			chartOfAccounts = chartOfAccountsService.findById(recoverySearchRequest.getChartofaccountsId(), false);
		final List<Recovery> searchResultList = recoveryService.search(chartOfAccounts, recoverySearchRequest.getType(),
				recoverySearchRequest.getRecoveryName());
		return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
	}

    @GetMapping(value = "/ajax/getAccountCodes")
    public @ResponseBody List<CChartOfAccounts> getAccountCodes(
            @RequestParam("subLedgerCode") @SafeHtml final String subLedgerCode) {
        List<CChartOfAccounts> accounts = null;
        if (subLedgerCode.equalsIgnoreCase("Select"))
            accounts = chartOfAccountsDAO.getNonControlledGlcode();
        else
            accounts = chartOfAccountsDAO.getBySubLedgerCode(subLedgerCode);
        return accounts;
    }

    public Object toSearchResultJson(final Object object) {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        final Gson gson = gsonBuilder.registerTypeAdapter(Recovery.class, new RecoveryJsonAdaptor()).create();
        return gson.toJson(object);
    }
}