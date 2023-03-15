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

package org.egov.egf.web.adaptor;

import java.lang.reflect.Type;

import org.egov.infra.utils.DateUtils;
import org.egov.model.masters.WorkOrder;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class WorkOrderJsonAdaptor implements JsonSerializer<WorkOrder> {
    @Override
    public JsonElement serialize(final WorkOrder workOrder, final Type type, final JsonSerializationContext jsc) {
        final JsonObject jsonObject = new JsonObject();
        if (workOrder != null) {
            if (workOrder.getOrderNumber() != null)
                jsonObject.addProperty("orderNumber", workOrder.getOrderNumber());
            else
                jsonObject.addProperty("orderNumber", "");
            if (workOrder.getName() != null)
                jsonObject.addProperty("name", workOrder.getName());
            else
                jsonObject.addProperty("name", "");
            if (workOrder.getOrderDate() != null)
                jsonObject.addProperty("orderDate", DateUtils.getDefaultFormattedDate(workOrder.getOrderDate()));
            else
                jsonObject.addProperty("orderDate", "");
            if (workOrder.getContractor() != null && workOrder.getContractor().getName() != null)
                jsonObject.addProperty("contractor", workOrder.getContractor().getName());
            else
                jsonObject.addProperty("contractor", "");
            if (workOrder.getOrderValue() != null)
                jsonObject.addProperty("orderValue", workOrder.getOrderValue());
            else
                jsonObject.addProperty("orderValue", "");
            if (workOrder.getAdvancePayable() != null)
                jsonObject.addProperty("advancePayable", workOrder.getAdvancePayable());
            else
                jsonObject.addProperty("advancePayable", "");
            if (workOrder.getDescription() != null)
                jsonObject.addProperty("description", workOrder.getDescription());
            else
                jsonObject.addProperty("description", "");
            if (workOrder.getFund() != null && workOrder.getFund().getName() != null)
                jsonObject.addProperty("fund", workOrder.getFund().getName());
            else
                jsonObject.addProperty("fund", "");
            if (workOrder.getScheme() != null && workOrder.getScheme().getName() != null)
                jsonObject.addProperty("scheme", workOrder.getScheme().getName());
            else
                jsonObject.addProperty("scheme", "");
            if (workOrder.getSubScheme() != null && workOrder.getSubScheme().getName() != null)
                jsonObject.addProperty("subScheme", workOrder.getSubScheme().getName());
            else
                jsonObject.addProperty("subScheme", "");
            if (workOrder.getDepartmentName() != null)
                jsonObject.addProperty("department", workOrder.getDepartmentName());
            else
                jsonObject.addProperty("department", "");
            if (workOrder.getSanctionNumber() != null)
                jsonObject.addProperty("sanctionNumber", workOrder.getSanctionNumber());
            else
                jsonObject.addProperty("sanctionNumber", "");
            if (workOrder.getSanctionDate() != null)
                jsonObject.addProperty("sanctionDate", DateUtils.getDefaultFormattedDate(workOrder.getSanctionDate()));
            else
                jsonObject.addProperty("sanctionDate", "");
            if (workOrder.getActive() != null)
                jsonObject.addProperty("active", workOrder.getActive());
            else
                jsonObject.addProperty("active", "");
            jsonObject.addProperty("id", workOrder.getId());
        }
        return jsonObject;
    }
}