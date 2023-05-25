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

import org.egov.commons.CFunction;
import org.egov.commons.contracts.FunctionSearchRequest;
import org.egov.commons.service.FunctionService;
import org.egov.egf.web.adaptor.FunctionJsonAdaptor;
import org.egov.infstr.utils.EgovMasterDataCaching;
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

@SuppressWarnings("deprecation")
@Controller
@RequestMapping("/function")
public class FunctionController {
	private static final String STR_FUNCTION = "function";
	private static final String STR_FUNCTION_REQUEST = "functionSearchRequest";
	private static final String FUNCTION_NEW = "function-new";
	private static final String FUNCTION_RESULT = "function-result";
	private static final String FUNCTION_EDIT = "function-edit";
	private static final String FUNCTION_VIEW = "function-view";
	private static final String FUNCTION_SEARCH = "function-search";
	@Autowired
	private FunctionService functionService;
	@Autowired
	private MessageSource messageSource;

	private void prepareNewForm(Model model) {
		model.addAttribute("functions", functionService.findAllIsNotLeafTrue());
	}

	@PostMapping(value = "/new")
	public String newForm(final Model model) {
		prepareNewForm(model);
		model.addAttribute("CFunction", new CFunction());
		return FUNCTION_NEW;
	}

	@PostMapping(value = "/create")
	public String create(@Valid @ModelAttribute final CFunction function,
			final BindingResult errors, final Model model,
			final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return FUNCTION_NEW;
		}
		if(function.getParentId()!=null && function.getParentId().getId()!=null )
			function.setParentId(functionService.findOne(function.getParentId().getId()));
		else
			function.setParentId(null);

		functionService.create(function);
		redirectAttrs.addFlashAttribute("message",
				messageSource.getMessage("msg.function.success", null, null));
		EgovMasterDataCaching.removeFromCache("egi-activeFunctions");
		EgovMasterDataCaching.removeFromCache("egi-function");
		return "redirect:/function/result/" + function.getId()+"/create";
	}

	@GetMapping(value = "/edit/{id}")
	public String edit(@PathVariable("id") final Long id, Model model) {
		CFunction function = functionService.findOne(id);
		prepareNewForm(model);
		model.addAttribute("CFunction", function);
		return FUNCTION_EDIT;
	}

	@PostMapping(value = "/update")
	public String update(@Valid @ModelAttribute final CFunction function,
			final BindingResult errors, final Model model,
			final RedirectAttributes redirectAttrs) {
		if (errors.hasErrors()) {
			prepareNewForm(model);
			return FUNCTION_EDIT;
		}
		functionService.update(function);
		redirectAttrs.addFlashAttribute("message",
				messageSource.getMessage("msg.function.success", null, null));
		EgovMasterDataCaching.removeFromCache("egi-activeFunctions");
		EgovMasterDataCaching.removeFromCache("egi-function");
		return "redirect:/function/result/" + function.getId()+"/view";
	}

	@GetMapping(value = "/view/{id}")
	public String view(@PathVariable("id") final Long id, Model model) {
		CFunction function = functionService.findOne(id);
		prepareNewForm(model);
		model.addAttribute(STR_FUNCTION, function);
		model.addAttribute("mode","view");
		return FUNCTION_VIEW;
	}

	@GetMapping(value = "/result/{id}/{mode}")
	public String result(@PathVariable("id") final Long id,@PathVariable("mode") @SafeHtml final String mode, Model model) {
		CFunction function = functionService.findOne(id);
		model.addAttribute(STR_FUNCTION, function);
		model.addAttribute("mode", mode);
		return FUNCTION_RESULT;
	}

	@PostMapping(value = "/search/{mode}")
	public String search(@PathVariable("mode") @SafeHtml final String mode, Model model) {
		FunctionSearchRequest functionSearchRequest = new FunctionSearchRequest();
		prepareNewForm(model);
		model.addAttribute(STR_FUNCTION_REQUEST, functionSearchRequest);
		return FUNCTION_SEARCH;

	}

	@PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
	public @ResponseBody String ajaxsearch(
			@PathVariable("mode") @SafeHtml final String mode, Model model,
			@Valid @ModelAttribute final FunctionSearchRequest functionSearchRequest) {
		List<CFunction> searchResultList = functionService.search(functionSearchRequest);
		return new StringBuilder("{ \"data\":")
				.append(toSearchResultJson(searchResultList)).append("}")
				.toString();
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder.registerTypeAdapter(CFunction.class,
				new FunctionJsonAdaptor()).create();
		return gson.toJson(object);
	}
}