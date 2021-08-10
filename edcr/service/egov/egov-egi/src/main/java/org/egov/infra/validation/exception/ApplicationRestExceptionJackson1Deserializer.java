/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) <2019>  eGovernments Foundation
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
 *      Further, all user interfaces, including but not limited to citizen facing interfaces,
 *         Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *         derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *      For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *      For any further queries on attribution, including queries on brand guidelines,
 *         please contact contact@egovernments.org
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

package org.egov.infra.validation.exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonToken;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.JsonDeserializer;

public class ApplicationRestExceptionJackson1Deserializer extends JsonDeserializer<ApplicationRestException> {

    private static final Logger LOG = Logger.getLogger(ApplicationRestExceptionJackson1Deserializer.class);

    private static final String ERROR_DESCRIPTION = "error_description";

    @Override
    public ApplicationRestException deserialize(JsonParser jp, DeserializationContext ctxt) {

        try {
            JsonToken t = jp.getCurrentToken();
            if (t == JsonToken.START_OBJECT) {
                t = jp.nextToken();
            }
            Map<String, Object> errorParams = new HashMap<>();
            for (; t == JsonToken.FIELD_NAME; t = jp.nextToken()) {
                // Must point to field name
                String fieldName = jp.getCurrentName();
                // And then the value...
                t = jp.nextToken();
                // Note: must handle null explicitly here; value deserializers won't
                Object value;
                if (t == JsonToken.VALUE_NULL) {
                    value = null;
                }
                // Some servers might send back complex content
                else if (t == JsonToken.START_ARRAY) {
                    value = jp.readValueAs(List.class);
                } else if (t == JsonToken.START_OBJECT) {
                    value = jp.readValueAs(Map.class);
                } else {
                    value = jp.getText();
                }
                errorParams.put(fieldName, value);
            }

            Object errorCode = errorParams.get("error");
            String errorMessage = errorParams.containsKey(ERROR_DESCRIPTION) ? errorParams.get(ERROR_DESCRIPTION)
                    .toString() : null;
            if (errorMessage == null) {
                errorMessage = errorCode == null ? "Rest Error" : errorCode.toString();
            }

            ApplicationRestException ex = new ApplicationRestException(errorMessage);

            Set<Map.Entry<String, Object>> entries = errorParams.entrySet();
            for (Map.Entry<String, Object> entry : entries) {
                String key = entry.getKey();
                if (!"error".equals(key) && !ERROR_DESCRIPTION.equals(key)) {
                    Object value = entry.getValue();
                    ex.addAdditionalInformation(key, value == null ? null : value.toString());
                }
            }

            return ex;
        } catch (IOException e) {
            LOG.error("Error occurred when dezerialize data", e);
        }
        return null;

    }
}
