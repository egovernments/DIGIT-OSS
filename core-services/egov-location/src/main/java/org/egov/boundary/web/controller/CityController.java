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

package org.egov.boundary.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.boundary.domain.model.CityModel;
import org.egov.boundary.domain.model.District;
import org.egov.boundary.domain.service.CityService;
import org.egov.boundary.web.contract.City;
import org.egov.boundary.web.contract.CityRequest;
import org.egov.boundary.web.contract.CityResponse;
import org.egov.common.contract.response.ResponseInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import javax.validation.Valid;
import javax.validation.constraints.Size;

@Validated
@RestController
@RequestMapping("/city")
public class CityController {

	@Autowired
	private CityService cityService;

	@Autowired
	private ObjectMapper objectMapper;

	public static final Logger logger = LoggerFactory.getLogger(CityController.class);

	@GetMapping
	public String getCity(@RequestParam(value = "tenantId", required = true) @Size(max = 256) String tenantId,
			@RequestParam(value = "code", required = false) @Size(max = 4) String code) {
		List<District> districts;
		List<District> result = new ArrayList<>();
		String jsonInString = "";
		objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
		try {

			districts = (List<District>) objectMapper.readValue(
					new ClassPathResource("/json/citiesUrl.json").getInputStream(),
					new TypeReference<List<District>>() {
					});
			if (tenantId != null && !tenantId.isEmpty() && code != null && !code.isEmpty())
				for (District d : districts) {
					List<CityModel> cities = d.getCities().stream()
							.filter(c -> c.getCityCode().compareTo(Integer.valueOf(code)) == 0
									&& c.getTenantId().equalsIgnoreCase(tenantId))
							.collect(Collectors.toList());

					jsonInString = objectMapper.writeValueAsString(!cities.isEmpty() ? cities.get(0) : cities);
				}
			else
				jsonInString = objectMapper.writeValueAsString(districts);
		} catch (IOException e) {
			logger.error("Error while reading cities JSON: " + e.getMessage());
		}

		return jsonInString;
	}

	@PostMapping(value = "/getCitybyCityRequest")
	@ResponseBody
	public ResponseEntity<?> search(@RequestBody @Valid CityRequest cityRequest) {
		CityResponse cityResponse = new CityResponse();
		if (cityRequest.getCity() != null && cityRequest.getCity().getTenantId() != null
				&& !cityRequest.getCity().getTenantId().isEmpty()) {
			ResponseInfo responseInfo = new ResponseInfo();
			responseInfo.setStatus(HttpStatus.CREATED.toString());
			cityResponse.setCity(getCity(cityRequest));
			cityResponse.setResponseInfo(responseInfo);
			return new ResponseEntity<>(cityResponse, HttpStatus.OK);
		} else
			return new ResponseEntity<>(cityResponse, HttpStatus.BAD_REQUEST);
	}

	private City getCity(CityRequest cityRequest) {
		return cityService.getCityByCityReq(cityRequest);
	}
}