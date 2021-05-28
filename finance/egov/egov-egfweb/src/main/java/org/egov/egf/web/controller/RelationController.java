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

import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.egov.commons.Relation;
import org.egov.commons.service.RelationJpaService;
import org.egov.egf.web.adaptor.RelationJsonAdaptor;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.services.masters.BankService;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Controller
@RequestMapping("/relation")
public class RelationController {
	private static final String RELATION = "relation";
	private static final String RELATION_NEW = "relation-new";
	private static final String RELATION_RESULT = "relation-result";
	private static final String RELATION_EDIT = "relation-edit";
	private static final String RELATION_VIEW = "relation-view";
	private static final String RELATION_SEARCH = "relation-search";
	@Autowired
	private RelationJpaService relationJpaService;
	@Autowired
	private MessageSource messageSource;
	@Autowired
	private SecurityUtils securityUtils;
	@Autowired
	@Qualifier("bankService")
	private BankService bankService;

	@SuppressWarnings("deprecation")
	private void prepareNewForm(Model model) {
		model.addAttribute("banks", bankService.findAll());
	}

	@GetMapping(value = "/new")
	public String newForm(final Model model) {
		prepareNewForm(model);
		model.addAttribute(RELATION, new Relation());
		return RELATION_NEW;
	}

	@SuppressWarnings("deprecation")
	@PostMapping(value = "/create")
	public String create(@Valid @ModelAttribute final Relation relation, final BindingResult errors, final Model model,
			final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return RELATION_NEW;
		}
		// this code is to handle non jpa object save since it dont have version
		// once moved bank to jpa remove this
		if (relation.getBank() != null && relation.getBank().getId() != null)
			relation.setBank(bankService.findById(relation.getBank().getId(), false));
		else
			relation.setBank(null);
		relation.setCreatedby(securityUtils.getCurrentUser().getId());
		relation.setCreateddate(new Date());
		relation.setModifiedby(securityUtils.getCurrentUser().getId());
		relation.setLastmodifieddate(new Date());
		relationJpaService.create(relation);
		redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.relation.success", null, null));
		return "redirect:/relation/result/" + relation.getId();
	}

	@GetMapping(value = "/edit/{id}")
	public String edit(@PathVariable("id") final Integer id, Model model) {
		Relation relation = relationJpaService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(RELATION, relation);
		return RELATION_EDIT;
	}

	@PostMapping(value = "/update")
	public String update(@Valid @ModelAttribute final Relation relation, final BindingResult errors, final Model model,
			final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return RELATION_EDIT;
		}
		relation.setModifiedby(securityUtils.getCurrentUser().getId());
		relation.setLastmodifieddate(new Date());
		relationJpaService.update(relation);

		redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.relation.success", null, null));
		return "redirect:/relation/result/" + relation.getId();
	}

	@GetMapping(value = "/view/{id}")
	public String view(@PathVariable("id") final Integer id, Model model) {
		Relation relation = relationJpaService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(RELATION, relation);
		return RELATION_VIEW;
	}

	@GetMapping(value = "/result/{id}")
	public String result(@PathVariable("id") final Integer id, Model model) {
		Relation relation = relationJpaService.findOne(id);
		model.addAttribute(RELATION, relation);
		return RELATION_RESULT;
	}

	@GetMapping(value = "/search/{mode}")
	public String search(@PathVariable("mode") @SafeHtml final String mode, Model model) {
		Relation relation = new Relation();
		prepareNewForm(model);
		model.addAttribute(RELATION, relation);
		return RELATION_SEARCH;

	}

	@PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, Model model,
		@Valid @ModelAttribute final Relation relation) {
		List<Relation> searchResultList = relationJpaService.search(relation);
		return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}")
				.toString();
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder.registerTypeAdapter(Relation.class, new RelationJsonAdaptor()).create();
		return gson.toJson(object);
	}
}