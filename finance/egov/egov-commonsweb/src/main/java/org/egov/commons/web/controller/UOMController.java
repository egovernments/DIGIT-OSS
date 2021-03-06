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

package org.egov.commons.web.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.common.entity.UOM;
import org.egov.commons.service.UOMCategoryService;
import org.egov.commons.service.UOMService;
import org.egov.commons.web.adaptor.UOMJsonAdaptor;
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
@RequestMapping("/uom")
public class UOMController {
    private static final String UOM_NEW = "uom-new";
    private static final String UOM_RESULT = "uom-result";
    private static final String UOM_EDIT = "uom-edit";
    private static final String UOM_VIEW = "uom-view";
    private static final String UOM_SEARCH = "uom-search";
    @Autowired
    private UOMService uomService;
    @Autowired
    private UOMCategoryService uomCategoryService;
    @Autowired
    private MessageSource messageSource;

    private void prepareNewForm(final Model model) {
        model.addAttribute("categories", uomCategoryService.findAll());
    }

    @GetMapping(value = "/new")
    public String newForm(final Model model) {
        prepareNewForm(model);

        model.addAttribute("UOM", new UOM());
        model.addAttribute("mode", "create");
        return UOM_NEW;
    }

    @PostMapping(value = "/create")
    public String create(@Valid @ModelAttribute final UOM uom, final BindingResult errors, final Model model,
            final RedirectAttributes redirectAttrs) {
        if (errors.hasErrors()) {
            prepareNewForm(model);
            return UOM_NEW;
        }
        uomService.create(uom);
        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.uom.success", null, null));
        return "redirect:/uom/result/" + uom.getId();
    }

    @GetMapping(value = "/edit/{id}")
    public String edit(@PathVariable("id") final Long id, final Model model) {
        final UOM uom = uomService.findOne(id);
        prepareNewForm(model);
        model.addAttribute("UOM", uom);
        model.addAttribute("mode", "edit");
        return UOM_EDIT;
    }

    @PostMapping(value = "/update")
    public String update(@Valid @ModelAttribute final UOM uom, final BindingResult errors, final Model model,
            final RedirectAttributes redirectAttrs) {
        if (errors.hasErrors()) {
            prepareNewForm(model);
            return UOM_EDIT;
        }
        uomService.update(uom);
        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.uom.success", null, null));
        return "redirect:/uom/result/" + uom.getId();
    }

    @GetMapping(value = "/view/{id}")
    public String view(@PathVariable("id") final Long id, final Model model) {
        final UOM uom = uomService.findOne(id);
        prepareNewForm(model);
        model.addAttribute("UOM", uom);
        return UOM_VIEW;
    }

    @GetMapping(value = "/result/{id}")
    public String result(@PathVariable("id") final Long id, final Model model) {
        final UOM uom = uomService.findOne(id);
        model.addAttribute("UOM", uom);
        return UOM_RESULT;
    }

    @GetMapping(value = "/search/{mode}")
    public String search(@PathVariable("mode") @SafeHtml final String mode, final Model model) {
        final UOM uom = new UOM();
        model.addAttribute("unitOfMeasurement", uomService.findAll());
        prepareNewForm(model);
        model.addAttribute("UOM", uom);
        return UOM_SEARCH;

    }

    @PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
    public @ResponseBody String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, final Model model,
           @Valid @ModelAttribute final UOM uom) {
        final List<UOM> searchResultList = uomService.search(uom);
        return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}")
                .toString();
    }

    public Object toSearchResultJson(final Object object) {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        final Gson gson = gsonBuilder.registerTypeAdapter(UOM.class, new UOMJsonAdaptor()).create();
        return gson.toJson(object);
    }
}