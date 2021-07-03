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

import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

@SuppressWarnings("serial")
@org.codehaus.jackson.map.annotate.JsonSerialize(using = ApplicationRestExceptionJackson1Serializer.class)
@org.codehaus.jackson.map.annotate.JsonDeserialize(using = ApplicationRestExceptionJackson1Deserializer.class)
@com.fasterxml.jackson.databind.annotation.JsonSerialize(using = ApplicationRestExceptionJackson2Serializer.class)
@com.fasterxml.jackson.databind.annotation.JsonDeserialize(using = ApplicationRestExceptionJackson2Deserializer.class)
public class ApplicationRestException extends RuntimeException {

    public static final String ERROR = "error";
    public static final String DESCRIPTION = "error_description";
    public static final String URI = "error_uri";
    public static final String INVALID_REQUEST = "invalid_request";
    public static final String INVALID_CLIENT = "invalid_tenant";

    private String errorCode;
    private Map<String, String> additionalInformation = null;

    public ApplicationRestException(String msg, Throwable t) {
        super(msg, t);
    }

    public ApplicationRestException(String msg) {
        super(msg);
    }

    public ApplicationRestException(String errorCode, String errorMessage) {
        super(errorMessage);
        this.errorCode = errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    /**
     * Get any additional information associated with this error.
     * 
     * @return Additional information, or null if none.
     */
    public Map<String, String> getAdditionalInformation() {
        return this.additionalInformation;
    }

    /**
     * Add some additional information with this OAuth error.
     * 
     * @param key The key.
     * @param value The value.
     */
    public void addAdditionalInformation(String key, String value) {
        if (this.additionalInformation == null) {
            this.additionalInformation = new TreeMap<>();
        }

        this.additionalInformation.put(key, value);

    }

    /**
     * Creates the appropriate subclass of OAuth2Exception given the errorCode.
     * @param errorCode
     * @param errorMessage
     * @return
     */
    public static ApplicationRestException create(String errorCode, String errorMessage) {
        if (errorMessage == null) {
            errorMessage = errorCode == null ? "Tenant Error" : errorCode;
        }
        return new ApplicationRestException(errorMessage);
    }

    /**
     * Creates an {@link ApplicationRestException} from a Map&lt;String,String&gt;.
     * 
     * @param errorParams
     * @return
     */
    public static ApplicationRestException valueOf(Map<String, String> errorParams) {
        String errorCode = errorParams.get(ERROR);
        String errorMessage = errorParams.containsKey(DESCRIPTION) ? errorParams.get(DESCRIPTION)
                : null;
        ApplicationRestException ex = create(errorCode, errorMessage);
        Set<Map.Entry<String, String>> entries = errorParams.entrySet();
        for (Map.Entry<String, String> entry : entries) {
            String key = entry.getKey();
            if (!ERROR.equals(key) && !DESCRIPTION.equals(key)) {
                ex.addAdditionalInformation(key, entry.getValue());
            }
        }

        return ex;
    }

    @Override
    public String toString() {
        return getSummary();
    }

    /**
     * @return a comma-delimited list of details (key=value pairs)
     */
    public String getSummary() {

        StringBuilder builder = new StringBuilder();

        String delim = "";

        String error = this.getErrorCode();
        if (error != null) {
            builder.append(delim).append("error=\"").append(error).append("\"");
            delim = ", ";
        }

        String errorMessage = this.getMessage();
        if (errorMessage != null) {
            builder.append(delim).append("error_description=\"").append(errorMessage).append("\"");
            delim = ", ";
        }

        Map<String, String> additionalParams = this.getAdditionalInformation();
        if (additionalParams != null) {
            for (Map.Entry<String, String> param : additionalParams.entrySet()) {
                builder.append(delim).append(param.getKey()).append("=\"").append(param.getValue()).append("\"");
                delim = ", ";
            }
        }

        return builder.toString();

    }

}
