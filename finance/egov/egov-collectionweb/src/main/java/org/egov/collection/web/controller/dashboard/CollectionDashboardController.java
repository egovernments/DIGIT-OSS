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

package org.egov.collection.web.controller.dashboard;

import java.io.IOException;
import java.util.List;

import javax.validation.Valid;

import org.egov.collection.bean.dashboard.CollectionDashBoardRequest;
import org.egov.collection.bean.dashboard.TaxPayerDashBoardResponseDetails;
import org.egov.collection.bean.dashboard.TotalCollectionDashBoardStats;
import org.egov.collection.bean.dashboard.TotalCollectionStatistics;
import org.egov.collection.service.dashboard.CollectionDashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = { "/public/dashboard", "/dashboard" })
@Validated
public class CollectionDashboardController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CollectionDashboardController.class);

    @Autowired
    private CollectionDashboardService collectionDashboardService;
    private static final String MILLISECS = " (millisecs) ";
    private static final String ULBGRADE = " ulbGrade ";
    private static final String DISTRICTNAME = " districtName ";
    private static final String ULBCODE = " ulbCode ";
    private static final String FROMDATE = " fromDate ";
    private static final String TODATE = " toDate ";
    private static final String TYPE = "  type ";

    /**
     * Provides State-wise Collection Statistics for Property Tax, Water Charges
     * and Other Revenue
     *
     * @return response JSON
     * @throws IOException
     */
	@PostMapping(value = "/otherrevenuecollectionstats", produces = MediaType.APPLICATION_JSON_VALUE)
	public TotalCollectionDashBoardStats getConsolidatedCollDetails(
			@Valid @RequestBody final CollectionDashBoardRequest collectionDashBoardRequest, final BindingResult errors)
			throws IOException {
		final Long startTime = System.currentTimeMillis();
		final TotalCollectionDashBoardStats consolidatedCollectionDetails = collectionDashboardService
				.getTotalCollectionStats(collectionDashBoardRequest);
		final Long timeTaken = System.currentTimeMillis() - startTime;
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(String.format("Time taken to serve collectionstats is : %s", timeTaken + MILLISECS));
		return consolidatedCollectionDetails;
	}

    /**
     * Provides Collection Index details across all ULBs
     *
     * @return response JSON
     * @throws IOException
     */
	@PostMapping(value = "/otherrevenuecollectiondashboard", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<TotalCollectionStatistics> getCollectionDetails(
			@Valid @RequestBody final CollectionDashBoardRequest collectionDashBoardRequest, final BindingResult errors)
			throws IOException {
		final Long startTime = System.currentTimeMillis();
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(String.format(
					"CollectionDashBoardRequest input for otherrevenuecollectiondashboard : regionName = %s",
					collectionDashBoardRequest.getRegionName() + "," + DISTRICTNAME + " = "
							+ collectionDashBoardRequest.getDistrictName() + "," + ULBGRADE + "= "
							+ collectionDashBoardRequest.getUlbGrade() + "," + ULBCODE + "= "
							+ collectionDashBoardRequest.getUlbCode() + "," + FROMDATE + "= "
							+ collectionDashBoardRequest.getFromDate() + "," + TODATE + "= "
							+ collectionDashBoardRequest.getToDate() + "," + TYPE + "= "
							+ collectionDashBoardRequest.getType()));
		final List<TotalCollectionStatistics> collectionDetails = collectionDashboardService
				.getCollectionIndexDetails(collectionDashBoardRequest);
		final Long timeTaken = System.currentTimeMillis() - startTime;
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(String.format("Time taken to serve collectiondashboard is : %s", timeTaken + MILLISECS));
		return collectionDetails;
	}

    /**
     * Returns Top Ten Tax Performers Across all ULB's
     *
     * @param collDetailsRequestStr
     * @return
     * @throws IOException
     */
	@PostMapping(value = "/otherrevenuetoptencollection", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<TaxPayerDashBoardResponseDetails> getTopTenTaxProducers(
			@Valid @RequestBody final CollectionDashBoardRequest collectionDashBoardRequest, final BindingResult errors)
			throws IOException {
        final Long startTime = System.currentTimeMillis();
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(
					String.format("CollectionDashBoardRequest input for otherrevenuetoptencollection : regionName = %s",
							collectionDashBoardRequest.getRegionName() + "," + DISTRICTNAME + " = "
									+ collectionDashBoardRequest.getDistrictName() + "," + ULBGRADE + "= "
									+ collectionDashBoardRequest.getUlbGrade() + "," + ULBCODE + "= "
									+ collectionDashBoardRequest.getUlbCode() + "," + FROMDATE + "= "
									+ collectionDashBoardRequest.getFromDate() + "," + TODATE + "= "
									+ collectionDashBoardRequest.getToDate() + "," + TYPE + "= "
									+ collectionDashBoardRequest.getType()));
        final List<TaxPayerDashBoardResponseDetails> taxPayerDetails = collectionDashboardService
                .getTopTenTaxProducers(collectionDashBoardRequest);
        final Long timeTaken = System.currentTimeMillis() - startTime;
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(String.format("Time taken to serve toptentaxers is : %s", timeTaken + MILLISECS));
        return taxPayerDetails;
    }

    /**
     * Returns Top Ten Tax Performers Across all ULB's
     *
     * @param collDetailsRequestStr
     * @return
     * @throws IOException
     */
	@PostMapping(value = "/otherrevenuebottomtencollection", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<TaxPayerDashBoardResponseDetails> getBottomTenTaxProducers(
			@Valid @RequestBody final CollectionDashBoardRequest collectionDashBoardRequest, final BindingResult errors)
			throws IOException {
        final Long startTime = System.currentTimeMillis();
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(String.format(
					"CollectionDashBoardRequest input for otherrevenuebottomtencollection : regionName = %s",
					collectionDashBoardRequest.getRegionName() + "," + DISTRICTNAME + " = "
							+ collectionDashBoardRequest.getDistrictName() + "," + ULBGRADE + "= "
							+ collectionDashBoardRequest.getUlbGrade() + "," + ULBCODE + "= "
							+ collectionDashBoardRequest.getUlbCode() + "," + FROMDATE + "= "
							+ collectionDashBoardRequest.getFromDate() + "," + TODATE + "= "
							+ collectionDashBoardRequest.getToDate() + "," + TYPE + "= "
							+ collectionDashBoardRequest.getType()));
        final List<TaxPayerDashBoardResponseDetails> taxPayerDetails = collectionDashboardService
                .getBottomTenTaxProducers(collectionDashBoardRequest);
        final Long timeTaken = System.currentTimeMillis() - startTime;
		if (LOGGER.isDebugEnabled())
			LOGGER.debug(String.format("Time taken to serve bottomtentaxers is : %s", timeTaken + MILLISECS));
        return taxPayerDetails;
    }

}