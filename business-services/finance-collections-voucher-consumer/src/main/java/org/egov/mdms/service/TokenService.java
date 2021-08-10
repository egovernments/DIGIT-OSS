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
 *         3) This license does not grant any rights to any Long of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.mdms.service;

import java.util.HashMap;

import org.egov.common.contract.request.User;
import org.egov.reciept.consumer.config.PropertiesManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

@Service
public class TokenService {

    public static final Logger LOGGER = LoggerFactory.getLogger(TokenService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PropertiesManager propertiesManager;
    
    @Autowired
	private ObjectMapper mapper;

    public String generateAdminToken(String tenantId) {

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        header.add("Authorization", propertiesManager.getTokenAuhorizationtKey());

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("username", propertiesManager.getSiUser());
        map.add("scope", propertiesManager.getSiScope());
        map.add("password", propertiesManager.getSiPassword());
        map.add("grant_type", propertiesManager.getSiGrantType());
        map.add("tenantId", tenantId);
        map.add("userType", propertiesManager.getSiUserType());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, header);

        try {
            LOGGER.debug("call: {}", propertiesManager.getTokenGenUrl());
            Object response = restTemplate.postForObject(propertiesManager.getUserHostUrl().trim() + propertiesManager.getTokenGenUrl().trim(),
                    request, Object.class);
            if (response != null) {
				String authToken = String.valueOf(((HashMap) response).get("access_token"));
				User userInfo = mapper.convertValue(JsonPath.read(response, "$.UserRequest"),new TypeReference<User>(){});
				propertiesManager.setSiAuthToken(authToken);
				propertiesManager.setSiUserInfo(userInfo);
				return authToken;
			}
        } catch (RestClientException e) {
            LOGGER.error("Eror while getting admin authtoken : {}", e);
            return null;
        }
        return null;
    }
}
