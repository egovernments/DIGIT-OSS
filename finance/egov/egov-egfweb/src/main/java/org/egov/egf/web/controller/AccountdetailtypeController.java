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

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.validation.Valid;

import org.egov.commons.Accountdetailtype;
import org.egov.commons.contracts.AccountDetailTypeSearchRequest;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.egf.web.adaptor.AccountdetailtypeJsonAdaptor;
import org.egov.infra.security.utils.SecurityUtils;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Controller
@RequestMapping("/accountdetailtype")
public class AccountdetailtypeController {
	private static final String ACCOUNTDETAILTYPE = "accountdetailtype";
	private static final String ACCOUNTDETAILTYPE_SEARCH_REQUEST = "accountdetailtypeSearchRequest";
	private static final String ACCOUNTDETAILTYPE_NEW = "accountdetailtype-new";
	private static final String ACCOUNTDETAILTYPE_RESULT = "accountdetailtype-result";
	private static final String ACCOUNTDETAILTYPE_EDIT = "accountdetailtype-edit";
	private static final String ACCOUNTDETAILTYPE_VIEW = "accountdetailtype-view";
	private static final String ACCOUNTDETAILTYPE_SEARCH = "accountdetailtype-search";
	@Autowired
	private AccountdetailtypeService accountdetailtypeService;
	@Autowired
	private SecurityUtils securityUtils;
	@Autowired
	private MessageSource messageSource;

	private void prepareNewForm(Model model) {

	}

	@PostMapping(value = "/new")
	public String newForm(final Model model) {
		prepareNewForm(model);
		model.addAttribute(ACCOUNTDETAILTYPE, new Accountdetailtype());
		return ACCOUNTDETAILTYPE_NEW;
	}

	@PostMapping(value = "/create")
	public String create(@Valid @ModelAttribute final Accountdetailtype accountdetailtype, final BindingResult errors,
			final Model model, final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return ACCOUNTDETAILTYPE_NEW;
		}
		accountdetailtype.setTablename("accountEntityMaster");
		accountdetailtype.setAttributename(accountdetailtype.getName() + "_id");
		accountdetailtype.setNbroflevels(BigDecimal.ONE);
		accountdetailtype.setColumnname("id");
		accountdetailtype.setFullQualifiedName("org.egov.masters.model.AccountEntity");
		accountdetailtype.setCreatedDate(new Date());
		accountdetailtype.setLastModifiedDate(new Date());
		accountdetailtype.setLastModifiedBy(securityUtils.getCurrentUser().getId());
		accountdetailtypeService.create(accountdetailtype);
		redirectAttrs.addFlashAttribute("message",
				messageSource.getMessage("msg.accountdetailtype.success", null, null));
		return "redirect:/accountdetailtype/result/" + accountdetailtype.getId() + "/create";
	}

	@GetMapping(value = "/edit/{id}")
	public String edit(@PathVariable("id") final Integer id, Model model) {
		Accountdetailtype accountdetailtype = accountdetailtypeService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(ACCOUNTDETAILTYPE, accountdetailtype);
		return ACCOUNTDETAILTYPE_EDIT;
	}

	@PostMapping(value = "/update")
	public String update(@ModelAttribute final Accountdetailtype accountdetailtype, final BindingResult errors,
			final Model model, final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return ACCOUNTDETAILTYPE_EDIT;
		}
		accountdetailtype.setTablename("accountEntityMaster");
		accountdetailtype.setAttributename(accountdetailtype.getName() + "_id");
		accountdetailtype.setNbroflevels(BigDecimal.ONE);
		accountdetailtype.setColumnname("id");
		accountdetailtype.setFullQualifiedName("org.egov.masters.model.AccountEntity");
		accountdetailtype.setLastModifiedDate(new Date());
		accountdetailtype.setLastModifiedBy(securityUtils.getCurrentUser().getId());
		accountdetailtypeService.update(accountdetailtype);
		redirectAttrs.addFlashAttribute("message",
				messageSource.getMessage("msg.accountdetailtype.success", null, Locale.ENGLISH));
		return "redirect:/accountdetailtype/result/" + accountdetailtype.getId() + "/update";
	}

	@GetMapping(value = "/view/{id}")
	public String view(@PathVariable("id") final Integer id, Model model) {
		Accountdetailtype accountdetailtype = accountdetailtypeService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(ACCOUNTDETAILTYPE, accountdetailtype);
		return ACCOUNTDETAILTYPE_VIEW;
	}

	@GetMapping(value = "/result/{id}/{mode}")
	public String result(@PathVariable("id") final Integer id, @PathVariable("mode") @SafeHtml final String mode,
			Model model) {
		Accountdetailtype accountdetailtype = accountdetailtypeService.findOne(id);
		model.addAttribute(ACCOUNTDETAILTYPE, accountdetailtype);
		model.addAttribute("mode", mode);
		return ACCOUNTDETAILTYPE_RESULT;
	}

	@PostMapping(value = "/search/{mode}")
	public String search(@PathVariable("mode") @SafeHtml final String mode, Model model) {
		AccountDetailTypeSearchRequest accountDetailTypeSearchRequest = new AccountDetailTypeSearchRequest();
		prepareNewForm(model);
		model.addAttribute(ACCOUNTDETAILTYPE_SEARCH_REQUEST, accountDetailTypeSearchRequest);
		return ACCOUNTDETAILTYPE_SEARCH;

	}

	@PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, Model model,
			@Valid @ModelAttribute final AccountDetailTypeSearchRequest accountDetailTypeSearchRequest) {
		List<Accountdetailtype> searchResultList = accountdetailtypeService.search(accountDetailTypeSearchRequest,
				mode);
		return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder.registerTypeAdapter(Accountdetailtype.class, new AccountdetailtypeJsonAdaptor())
				.create();
		return gson.toJson(object);
	}
}