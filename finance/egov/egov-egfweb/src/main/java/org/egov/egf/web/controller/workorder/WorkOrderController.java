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
import org.egov.model.masters.WorkOrderSearchRequest;
import org.egov.services.bills.EgBillRegisterService;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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

	private static final String WORK_ORDER = "workOrder";
	private static final String WORK_ORDER_SEARCH_REQUEST = "workOrderSearchRequest";
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

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		binder.setDisallowedFields("id");
	}

	private void prepareNewForm(final Model model) {
		model.addAttribute("funds", fundService.findAllActiveAndIsnotleaf());
		model.addAttribute("departments", microserviceUtils.getDepartments());
		model.addAttribute("contractors", contractorService.getAllActiveEntities(null));
	}

	@PostMapping(value = "/newform")
	public String showNewForm(@ModelAttribute(WORK_ORDER) final WorkOrder workOrder, final Model model) {
		prepareNewForm(model);
		model.addAttribute(WORK_ORDER, new WorkOrder());
		return NEW;
	}

	@PostMapping(value = "/create")
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

	@GetMapping(value = "/edit/{id}")
	public String edit(@PathVariable("id") final Long id, final Model model) {
		final WorkOrder workOrder = workOrderService.getById(id);
		List<EgBillregister> bills = egBillRegisterService.getBillsByWorkOrderNumber(workOrder.getOrderNumber());
		workOrder.setEditAllFields(bills.isEmpty());
		prepareNewForm(model);
		model.addAttribute(WORK_ORDER, workOrder);
		return EDIT;
	}

	@PostMapping(value = "/update")
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

	@GetMapping(value = "/view/{id}")
	public String view(@PathVariable("id") final Long id, final Model model) {
		final WorkOrder workOrder = workOrderService.getById(id);
		populateDepartmentName(workOrder);
		prepareNewForm(model);
		model.addAttribute(WORK_ORDER, workOrder);
		model.addAttribute("mode", "view");
		return VIEW;
	}

	@PostMapping(value = "/search/{mode}")
	public String search(@PathVariable("mode") @SafeHtml final String mode, final Model model) {
		final WorkOrderSearchRequest workOrderSearchRequest = new WorkOrderSearchRequest();
		prepareNewForm(model);
		model.addAttribute(WORK_ORDER_SEARCH_REQUEST, workOrderSearchRequest);
		return SEARCH;

	}

	@PostMapping(value = "/ajaxsearch/{mode}", produces = MediaType.TEXT_PLAIN_VALUE)
	@ResponseBody
	public String ajaxsearch(@PathVariable("mode") @SafeHtml final String mode, final Model model,
			@Valid @ModelAttribute final WorkOrderSearchRequest workOrderSearchRequest) {
		final List<WorkOrder> searchResultList = workOrderService.search(workOrderSearchRequest);
		return new StringBuilder("{ \"data\":").append(toSearchResultJson(searchResultList)).append("}").toString();
	}

	public Object toSearchResultJson(final Object object) {
		final GsonBuilder gsonBuilder = new GsonBuilder();
		final Gson gson = gsonBuilder.registerTypeAdapter(WorkOrder.class, new WorkOrderJsonAdaptor()).create();
		return gson.toJson(object);
	}

	@GetMapping(value = "/result/{id}/{mode}")
	public String result(@PathVariable("id") final Long id, @PathVariable("mode") @SafeHtml final String mode,
			final Model model) {
		final WorkOrder workOrder = workOrderService.getById(id);
		populateDepartmentName(workOrder);
		model.addAttribute(WORK_ORDER, workOrder);
		model.addAttribute("mode", mode);
		return RESULT;
	}

	private void populateDepartmentName(WorkOrder workOrder) {
		Department dept = microserviceUtils.getDepartmentByCode(workOrder.getDepartment());
		workOrder.setDepartmentName(dept.getName());
	}

}