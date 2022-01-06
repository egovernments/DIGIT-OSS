/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.boundary.web.controller;

import java.util.ArrayList;
import java.util.List;

import org.egov.boundary.domain.service.BoundaryTypeService;
import org.egov.boundary.domain.service.HierarchyTypeService;
import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.HierarchyType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import javax.validation.constraints.Size;

@Validated
@Controller
@RequestMapping(value = "/boundarytype/create")
public class CreateBoundaryTypeController {

	private HierarchyTypeService hierarchyTypeService;
	private BoundaryTypeService boundaryTypeService;

	@Autowired
	public CreateBoundaryTypeController(BoundaryTypeService boundaryTypeService,
			HierarchyTypeService hierarchyTypeService) {
		this.boundaryTypeService = boundaryTypeService;
		this.hierarchyTypeService = hierarchyTypeService;
	}

	@ModelAttribute
	public BoundaryType boundaryTypeModel() {
		return new BoundaryType();
	}

	@RequestMapping(method = RequestMethod.GET)
	public String newForm(@RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId) {
		if (tenantId != null && !tenantId.isEmpty()) {
			HierarchyType hh = hierarchyTypeService.getHierarchyTypeByNameAndTenantId("Kmani", tenantId);
			/*
			 * new HierarchyType(); hh.setName("Hmani"); hh.setCode("H001");
			 * hierarchyTypeService.createHierarchyType(hh);
			 */
			BoundaryType boundaryType = new BoundaryType();
			boundaryType.setName("Kiran");
			boundaryType.setHierarchyType(hh);
			boundaryType.setTenantId(tenantId);

			boundaryTypeService.createBoundaryType(boundaryType);
		}
		return "boundaryType-form";
	}

	@ModelAttribute("hierarchyTypes")
	public List<HierarchyType> getHierarchyTypes() {
		final List<HierarchyType> heirarchyList = new ArrayList<HierarchyType>();
		/*
		 * List<HierarchyType> hierarchyTypeList =
		 * hierarchyTypeService.getAllHierarchyTypes(); for (final HierarchyType
		 * hierarchyType : hierarchyTypeList) { BoundaryType bType =
		 * boundaryTypeService.getBoundaryTypeByHierarchyTypeNameAndLevel(
		 * hierarchyType.getName(),1l); if(bType == null){
		 * heirarchyList.add(hierarchyType); } }
		 */
		return heirarchyList;
	}

	@RequestMapping(method = RequestMethod.POST)
	public String create(@ModelAttribute @Valid BoundaryType boundaryType, final BindingResult errors,
						 RedirectAttributes redirectAttrs) {

		if (errors.hasErrors())
			return "boundaryType-form";
		if (boundaryType != null && boundaryType.getTenantId() != null && !boundaryType.getTenantId().isEmpty()) {
			boundaryTypeService.setHierarchyLevel(boundaryType, "create");
			boundaryTypeService.createBoundaryType(boundaryType);
			redirectAttrs.addFlashAttribute("message", "msg.bndrytype.create.success");
		}
		return "redirect:/boundarytype/view/" + boundaryType.getId();
	}

}