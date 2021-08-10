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

import java.util.List;

import javax.validation.Valid;

import org.egov.commons.contracts.AccountEntitySearchRequest;
import org.egov.commons.service.AccountEntityService;
import org.egov.commons.service.AccountdetailtypeService;
import org.egov.egf.web.adaptor.AccountEntityJsonAdaptor;
import org.egov.masters.model.AccountEntity;
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
@RequestMapping("/accountentity")
public class AccountEntityController {
	private static final String ACCOUNT_ENTITY = "accountEntity";
	private static final String ACCOUNT_ENTITY_SEARCH_REQUEST = "accountEntitySearchRequest";
	private static final String ACCOUNTENTITY_NEW = "accountentity-new";
	private static final String ACCOUNTENTITY_RESULT = "accountentity-result";
	private static final String ACCOUNTENTITY_EDIT = "accountentity-edit";
	private static final String ACCOUNTENTITY_VIEW = "accountentity-view";
	private static final String ACCOUNTENTITY_SEARCH = "accountentity-search";
	@Autowired
	private AccountEntityService accountEntityService;
	@Autowired
	private MessageSource messageSource;
	@Autowired
	private AccountdetailtypeService accountdetailtypeService;

	private void prepareNewForm(Model model) {
		model.addAttribute("accountdetailtypes",
				accountdetailtypeService.findByFullQualifiedName("org.egov.masters.model.AccountEntity"));
	}

	@PostMapping(value = "/new")
	public String newForm(final Model model) {
		prepareNewForm(model);
		model.addAttribute(ACCOUNT_ENTITY, new AccountEntity());
		return ACCOUNTENTITY_NEW;
	}

	@PostMapping(value = "/create")
	public String create(@Valid @ModelAttribute final AccountEntity accountEntity, final BindingResult errors,
			final Model model, final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return ACCOUNTENTITY_NEW;
		}
		accountEntityService.create(accountEntity);
		redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.accountentity.success", null, null));
		return "redirect:/accountentity/result/" + accountEntity.getId() + "/create";
	}

	@GetMapping(value = "/edit/{id}")
	public String edit(@PathVariable("id") final Integer id, Model model) {
		AccountEntity accountEntity = accountEntityService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(ACCOUNT_ENTITY, accountEntity);
		return ACCOUNTENTITY_EDIT;
	}

	@PostMapping(value = "/update")
	public String update(@Valid @ModelAttribute final AccountEntity accountEntity, final BindingResult errors,
			final Model model, final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return ACCOUNTENTITY_EDIT;
		}

		accountEntityService.update(accountEntity);
		redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.accountentity.success", null, null));
		return "redirect:/accountentity/result/" + accountEntity.getId() + "/view";
	}

	@GetMapping(value = "/view/{id}")
	public String view(@PathVariable("id") final Integer id, Model model) {
		AccountEntity accountEntity = accountEntityService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(ACCOUNT_ENTITY, accountEntity);
		model.addAttribute("mode", "view");
		return ACCOUNTENTITY_VIEW;
	}

	@GetMapping(value = "/result/{id}/{mode}")
	public String result(@PathVariable("id") final Integer id, @PathVariable("mode") @SafeHtml final String mode,
			Model model) {
		AccountEntity accountEntity = accountEntityService.findOne(id);
		model.addAttribute(ACCOUNT_ENTITY, accountEntity);
		model.addAttribute("mode", mode);
		return ACCOUNTENTITY_RESULT;
	}

	@PostMapping(value = "/search/{mode}")
	public String search(@PathVariable("mode") @SafeHtml final String mode, Model model) {
		AccountEntitySearchRequest accountEntitySearchRequest = new AccountEntitySearchRequest();
		prepareNewForm(model);
		model.addAttribute(ACCOUNT_ENTITY_SEARCH_REQUEST, accountEntitySearchRequest);
		return ACCOUNTENTITY_SEARCH;

	}

	@PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, Model model,
			@Valid @ModelAttribute final AccountEntitySearchRequest accountEntitySearchRequest) {
		List<AccountEntity> searchResultList = accountEntityService.search(accountEntitySearchRequest);
		return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder.registerTypeAdapter(AccountEntity.class, new AccountEntityJsonAdaptor()).create();
		return gson.toJson(object);
	}
}