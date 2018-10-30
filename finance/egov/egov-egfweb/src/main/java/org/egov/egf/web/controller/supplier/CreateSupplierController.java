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
package org.egov.egf.web.controller.supplier;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.egov.commons.dao.EgwStatusHibernateDAO;
import org.egov.egf.commons.bank.service.CreateBankService;
import org.egov.egf.masters.services.SupplierService;
import org.egov.egf.web.adaptor.SupplierJsonAdaptor;
import org.egov.model.masters.Supplier;
import org.egov.utils.FinancialConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * @author venki
 */

@Controller
@RequestMapping(value = "/supplier")
public class CreateSupplierController {

    private static final String NEW = "supplier-new";
    private static final String RESULT = "supplier-result";
    private static final String EDIT = "supplier-edit";
    private static final String VIEW = "supplier-view";
    private static final String SEARCH = "supplier-search";

    @Autowired
    private CreateBankService createBankService;

    @Autowired
    private EgwStatusHibernateDAO egwStatusHibDAO;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private MessageSource messageSource;

    private void prepareNewForm(final Model model) {
        model.addAttribute("banks", createBankService.getByIsActiveTrueOrderByName());
        model.addAttribute("statuses",
                egwStatusHibDAO.getStatusByModule(FinancialConstants.STATUS_MODULE_NAME_SUPPLIER));
    }

    @RequestMapping(value = "/newform", method = RequestMethod.POST)
    public String showNewForm(@ModelAttribute("supplier") final Supplier supplier, final Model model) {
        prepareNewForm(model);
        model.addAttribute("supplier", new Supplier());
        return NEW;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String create(@Valid @ModelAttribute final Supplier supplier, final BindingResult errors, final Model model,
            final RedirectAttributes redirectAttrs) throws IOException {

        if (errors.hasErrors()) {
            prepareNewForm(model);
            return NEW;
        }

        supplierService.create(supplier);

        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.supplier.success", null, null));

        return "redirect:/supplier/result/" + supplier.getId() + "/create";
    }

    @RequestMapping(value = "/edit/{id}", method = RequestMethod.POST)
    public String edit(@PathVariable("id") final Long id, final Model model) {
        final Supplier supplier = supplierService.getById(id);
        prepareNewForm(model);
        model.addAttribute("supplier", supplier);
        return EDIT;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public String update(@Valid @ModelAttribute final Supplier supplier, final BindingResult errors, final Model model,
            final RedirectAttributes redirectAttrs) {
        if (errors.hasErrors()) {
            prepareNewForm(model);
            return EDIT;
        }
        supplierService.update(supplier);
        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.supplier.success", null, null));
        return "redirect:/supplier/result/" + supplier.getId() + "/view";
    }

    @RequestMapping(value = "/view/{id}", method = RequestMethod.POST)
    public String view(@PathVariable("id") final Long id, final Model model) {
        final Supplier supplier = supplierService.getById(id);
        prepareNewForm(model);
        model.addAttribute("supplier", supplier);
        model.addAttribute("mode", "view");
        return VIEW;
    }

    @RequestMapping(value = "/search/{mode}", method = RequestMethod.POST)
    public String search(@PathVariable("mode") final String mode, final Model model) {
        final Supplier supplier = new Supplier();
        prepareNewForm(model);
        model.addAttribute("supplier", supplier);
        return SEARCH;

    }

    @RequestMapping(value = "/ajaxsearch/{mode}", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String ajaxsearch(@PathVariable("mode") final String mode, final Model model,
            @ModelAttribute final Supplier supplier) {
        final List<Supplier> searchResultList = supplierService.search(supplier);
        return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
    }

    public Object toSearchResultJson(final Object object) {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        final Gson gson = gsonBuilder.registerTypeAdapter(Supplier.class, new SupplierJsonAdaptor()).create();
        return gson.toJson(object);
    }

    @RequestMapping(value = "/result/{id}/{mode}", method = RequestMethod.GET)
    public String result(@PathVariable("id") final Long id, @PathVariable("mode") final String mode, final Model model) {
        final Supplier supplier = supplierService.getById(id);
        model.addAttribute("supplier", supplier);
        model.addAttribute("mode", mode);
        return RESULT;
    }

}