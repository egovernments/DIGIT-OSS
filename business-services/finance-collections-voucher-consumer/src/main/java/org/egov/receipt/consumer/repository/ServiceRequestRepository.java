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
package org.egov.receipt.consumer.repository;

import java.lang.reflect.Field;
import java.util.Map;

import org.egov.mdms.service.TokenService;
import org.egov.receipt.consumer.model.ProcessStatus;
import org.egov.receipt.consumer.model.RequestInfo;
import org.egov.receipt.consumer.model.VoucherRequest;
import org.egov.receipt.custom.exception.VoucherCustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.util.ReflectionUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class ServiceRequestRepository {

    private static final String SEARCHER_EXCEPTION_MESSAGE = "Exception while fetching from searcher: ";

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private ObjectMapper mapper;

    /**
     * Fetches results from searcher framework based on the uri and request that define what is to be searched.
     * 
     * @param requestInfo
     * @param serviceReqSearchCriteria
     * @return Object
     * @author atique
     */
    public Object fetchResult(StringBuilder uri, Object request, String tenantId) throws VoucherCustomException {
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        Object response = null;

        try {
            populateWithAdminToken(uri, request, tenantId);
            response = restTemplate.postForObject(uri.toString(), request, Map.class);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
                log.error("Unauthorized accessed : Retrying http uri {} with SYSTEM auth token.", uri.toString());
                response = this.retryHttpCallOnUnauthorizedAccess(uri, request, tenantId);
            } else {
                log.error(SEARCHER_EXCEPTION_MESSAGE, e.getResponseBodyAsString());
                throw new VoucherCustomException(ProcessStatus.FAILED, e.getResponseBodyAsString());
            }
        } catch (Exception e) {
            log.error(SEARCHER_EXCEPTION_MESSAGE, e);
            throw new VoucherCustomException(ProcessStatus.FAILED, "Exception while fetching from searcher.");
        }
        return response;
    }

    private Object retryHttpCallOnUnauthorizedAccess(StringBuilder uri, Object request, String tenantId)
            throws VoucherCustomException {
        try {
            populateWithAdminToken(uri, request, tenantId);
            return restTemplate.postForObject(uri.toString(), request, Map.class);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
                log.error("Unauthorized accessed : Even after retrying with SYSTEM auth token.");
                throw new VoucherCustomException(ProcessStatus.FAILED,
                        "Error occurred even after retrying uri " + uri.toString() + " with SYSTEM auth token.");
            }
        } catch (IllegalArgumentException | IllegalAccessException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    private void populateWithAdminToken(StringBuilder uri, Object request, String tenantId)
            throws IllegalAccessException, VoucherCustomException {
        RequestInfo requestInfo = null;
        Class<?> clazz = request.getClass();
        Field field = ReflectionUtils.findField(clazz, "requestInfo");
        if (field != null) {
            ReflectionUtils.makeAccessible(field);
            requestInfo = (RequestInfo) field.get(request);
            if (requestInfo.getAuthToken() == null)
                requestInfo.setAuthToken(tokenService.generateAdminToken(tenantId));
            ReflectionUtils.setField(field, request, requestInfo);
        } else {
            throw new VoucherCustomException(ProcessStatus.FAILED,
                    "requestInfo properties is not found in uri " + uri.toString());
        }
    }

    public Object fetchResultGet(String uri) throws VoucherCustomException {
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        Object response = null;

        try {
            response = restTemplate.getForObject(uri, Map.class);
        } catch (Exception e) {
            log.error(SEARCHER_EXCEPTION_MESSAGE, e);
            throw new VoucherCustomException(ProcessStatus.FAILED, "IFSC code is invalid : url : " + uri);
        }
        return response;
    }
}
