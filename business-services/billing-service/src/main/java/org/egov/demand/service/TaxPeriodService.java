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
package org.egov.demand.service;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.repository.TaxPeriodRepository;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.demand.web.contract.TaxPeriodResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;


@Service
public class TaxPeriodService {

    public static final Logger LOGGER = LoggerFactory.getLogger(TaxPeriodService.class);

    @Autowired
    private TaxPeriodRepository taxPeriodRepository;

    @Autowired
    private ResponseFactory responseInfoFactory;

    public TaxPeriodResponse searchTaxPeriods(final TaxPeriodCriteria taxPeriodCriteria, final RequestInfo requestInfo) {
        LOGGER.info("-- TaxPeriodService searchTaxPeriods -- ");
        final List<TaxPeriod> taxPeriods = taxPeriodRepository.getTaxPeriod(requestInfo,taxPeriodCriteria);
        return getTaxPeriodResponse(taxPeriods, requestInfo);
    }
    
    private TaxPeriodResponse getTaxPeriodResponse(final List<TaxPeriod> taxPeriods, final RequestInfo requestInfo) {
        final TaxPeriodResponse taxPeriodResponse = new TaxPeriodResponse();
        taxPeriodResponse.setTaxPeriods(taxPeriods);
        taxPeriodResponse.setResponseInfo(responseInfoFactory.getResponseInfo(requestInfo, HttpStatus.OK));
        return taxPeriodResponse;
    }
}
