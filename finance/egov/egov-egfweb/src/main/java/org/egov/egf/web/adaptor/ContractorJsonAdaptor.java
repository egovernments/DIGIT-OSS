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

import org.egov.model.masters.Contractor;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class ContractorJsonAdaptor implements JsonSerializer<Contractor> {
    @Override
    public JsonElement serialize(final Contractor contractor, final Type type, final JsonSerializationContext jsc) {
        final JsonObject jsonObject = new JsonObject();
        if (contractor != null) {
            if (contractor.getName() != null)
                jsonObject.addProperty("name", contractor.getName());
            else
                jsonObject.addProperty("name", "");
            if (contractor.getCode() != null)
                jsonObject.addProperty("code", contractor.getCode());
            else
                jsonObject.addProperty("code", "");
            if (contractor.getBank() != null && contractor.getBank().getName() != null)
                jsonObject.addProperty("bank", contractor.getBank().getName());
            else
                jsonObject.addProperty("bank", "");
            if (contractor.getBankaccount() != null)
                jsonObject.addProperty("bankAccount", contractor.getBankaccount());
            else
                jsonObject.addProperty("bankAccount", "");
            if (contractor.getContactPerson() != null)
                jsonObject.addProperty("contactPerson", contractor.getContactPerson());
            else
                jsonObject.addProperty("contactPerson", "");
            if (contractor.getCorrespondenceAddress() != null)
                jsonObject.addProperty("correspondenceAddress", contractor.getCorrespondenceAddress());
            else
                jsonObject.addProperty("correspondenceAddress", "");
            if (contractor.getEgwStatus() != null && contractor.getEgwStatus().getDescription() != null)
                jsonObject.addProperty("status", contractor.getEgwStatus().getDescription());
            else
                jsonObject.addProperty("status", "");
            if (contractor.getEmail() != null)
                jsonObject.addProperty("email", contractor.getEmail());
            else
                jsonObject.addProperty("email", "");
            if (contractor.getIfsccode() != null)
                jsonObject.addProperty("ifscCode", contractor.getIfsccode());
            else
                jsonObject.addProperty("ifscCode", "");
            if (contractor.getMobileNumber() != null)
                jsonObject.addProperty("mobileNumber", contractor.getMobileNumber());
            else
                jsonObject.addProperty("mobileNumber", "");
            if (contractor.getNarration() != null)
                jsonObject.addProperty("narration", contractor.getNarration());
            else
                jsonObject.addProperty("narration", "");
            if (contractor.getPanno() != null)
                jsonObject.addProperty("panNumber", contractor.getPanno());
            else
                jsonObject.addProperty("panNumber", "");
            if (contractor.getPaymentAddress() != null)
                jsonObject.addProperty("paymentAddress", contractor.getPaymentAddress());
            else
                jsonObject.addProperty("paymentAddress", "");
            if (contractor.getRegistrationNumber() != null)
                jsonObject.addProperty("registrationNumber", contractor.getRegistrationNumber());
            else
                jsonObject.addProperty("registrationNumber", "");
            if (contractor.getTinno() != null)
                jsonObject.addProperty("tinNumber", contractor.getTinno());
            else
                jsonObject.addProperty("tinNumber", "");
            jsonObject.addProperty("id", contractor.getId());
        }
        return jsonObject;
    }
}