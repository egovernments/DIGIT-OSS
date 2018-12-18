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
package org.egov.egf.web.controller.workorder;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.egov.commons.service.FundService;
import org.egov.egf.masters.services.ContractorService;
import org.egov.egf.masters.services.WorkOrderService;
import org.egov.egf.web.adaptor.WorkOrderJsonAdaptor;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.model.bills.EgBillregister;
import org.egov.model.masters.WorkOrder;
import org.egov.services.bills.EgBillRegisterService;
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
@RequestMapping(value = "/workorder")
public class WorkOrderController {

    private static final String NEW = "workorder-new";
    private static final String RESULT = "workorder-result";
    private static final String EDIT = "workorder-edit";
    private static final String VIEW = "workorder-view";
    private static final String SEARCH = "workorder-search";

    @Autowired
    private FundService fundService;

    @Autowired
    private WorkOrderService workOrderService;

    @Autowired
    private MicroserviceUtils microserviceUtils;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ContractorService contractorService;

    @Autowired
    private EgBillRegisterService egBillRegisterService;

    private void prepareNewForm(final Model model) {
        model.addAttribute("funds", fundService.findAllActiveAndIsnotleaf());
        model.addAttribute("departments", microserviceUtils.getDepartments());
        model.addAttribute("contractors", contractorService.getAllActiveEntities(null));
    }

    @RequestMapping(value = "/newform", method = RequestMethod.POST)
    public String showNewForm(@ModelAttribute("workOrder") final WorkOrder workOrder, final Model model) {
        prepareNewForm(model);
        model.addAttribute("workOrder", new WorkOrder());
        return NEW;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String create(@Valid @ModelAttribute final WorkOrder workOrder, final BindingResult errors,
            final Model model, final RedirectAttributes redirectAttrs) throws IOException {

        if (errors.hasErrors()) {
            prepareNewForm(model);
            return NEW;
        }

        workOrderService.create(workOrder);

        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.workOrder.success", null, null));

        return "redirect:/workorder/result/" + workOrder.getId() + "/create";
    }

    @RequestMapping(value = "/edit/{id}", method = RequestMethod.POST)
    public String edit(@PathVariable("id") final Long id, final Model model) {
        final WorkOrder workOrder = workOrderService.getById(id);
        List<EgBillregister> bills = egBillRegisterService.getBillsByWorkOrderNumber(workOrder.getOrderNumber());
        if (bills != null && !bills.isEmpty()) {
            workOrder.setEditAllFields(false);
        } else {
            workOrder.setEditAllFields(true);
        }
        prepareNewForm(model);
        model.addAttribute("workOrder", workOrder);
        return EDIT;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public String update(@Valid @ModelAttribute final WorkOrder workOrder, final BindingResult errors,
            final Model model, final RedirectAttributes redirectAttrs) {
        if (errors.hasErrors()) {
            prepareNewForm(model);
            return EDIT;
        }
        workOrderService.update(workOrder);
        redirectAttrs.addFlashAttribute("message", messageSource.getMessage("msg.workOrder.success", null, null));
        return "redirect:/workorder/result/" + workOrder.getId() + "/view";
    }

    @RequestMapping(value = "/view/{id}", method = RequestMethod.POST)
    public String view(@PathVariable("id") final Long id, final Model model) {
        final WorkOrder workOrder = workOrderService.getById(id);
        populateDepartmentName(workOrder);
        prepareNewForm(model);
        model.addAttribute("workOrder", workOrder);
        model.addAttribute("mode", "view");
        return VIEW;
    }

    @RequestMapping(value = "/search/{mode}", method = RequestMethod.POST)
    public String search(@PathVariable("mode") final String mode, final Model model) {
        final WorkOrder workOrder = new WorkOrder();
        prepareNewForm(model);
        model.addAttribute("workOrder", workOrder);
        return SEARCH;

    }

    @RequestMapping(value = "/ajaxsearch/{mode}", method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String ajaxsearch(@PathVariable("mode") final String mode, final Model model,
            @ModelAttribute final WorkOrder workOrder) {
        final List<WorkOrder> searchResultList = workOrderService.search(workOrder);
        return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
    }

    public Object toSearchResultJson(final Object object) {
        final GsonBuilder gsonBuilder = new GsonBuilder();
        final Gson gson = gsonBuilder.registerTypeAdapter(WorkOrder.class, new WorkOrderJsonAdaptor()).create();
        return gson.toJson(object);
    }

    @RequestMapping(value = "/result/{id}/{mode}", method = RequestMethod.GET)
    public String result(@PathVariable("id") final Long id, @PathVariable("mode") final String mode, final Model model) {
        final WorkOrder workOrder = workOrderService.getById(id);
        populateDepartmentName(workOrder);
        model.addAttribute("workOrder", workOrder);
        model.addAttribute("mode", mode);
        return RESULT;
    }

    private void populateDepartmentName(WorkOrder workOrder) {
        Department dept = microserviceUtils.getDepartmentByCode(workOrder.getDepartment());
        workOrder.setDepartmentName(dept.getName());
    }

}