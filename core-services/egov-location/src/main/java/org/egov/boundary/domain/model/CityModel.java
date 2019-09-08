/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
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
 */

package org.egov.boundary.domain.model;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "url", "city_name", "city_code", "tenant_id", "non_active_modules" })
public class CityModel {

	@JsonProperty("url")
	private String url;
	@JsonProperty("city_name")
	private String cityName;
	@JsonProperty("city_code")
	private Integer cityCode;
	@JsonProperty("tenant_id")
	private String tenantId;
	@JsonProperty("non_active_modules")
	private NonActiveModules nonActiveModules;
	@JsonIgnore
	private Map<String, Object> additionalProperties = new HashMap<String, Object>();

	@JsonProperty("url")
	public String getUrl() {
		return url;
	}

	@JsonProperty("url")
	public void setUrl(String url) {
		this.url = url;
	}

	@JsonProperty("city_name")
	public String getCityName() {
		return cityName;
	}

	@JsonProperty("city_name")
	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	@JsonProperty("city_code")
	public Integer getCityCode() {
		return cityCode;
	}

	@JsonProperty("city_code")
	public void setCityCode(Integer cityCode) {
		this.cityCode = cityCode;
	}

	@JsonProperty("tenant_id")
	public String getTenantId() {
		return tenantId;
	}

	@JsonProperty("tenant_id")
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	@JsonProperty("non_active_modules")
	public NonActiveModules getNonActiveModules() {
		return nonActiveModules;
	}

	@JsonProperty("non_active_modules")
	public void setNonActiveModules(NonActiveModules nonActiveModules) {
		this.nonActiveModules = nonActiveModules;
	}

	@JsonAnyGetter
	public Map<String, Object> getAdditionalProperties() {
		return this.additionalProperties;
	}

	@JsonAnySetter
	public void setAdditionalProperty(String name, Object value) {
		this.additionalProperties.put(name, value);
	}

}
