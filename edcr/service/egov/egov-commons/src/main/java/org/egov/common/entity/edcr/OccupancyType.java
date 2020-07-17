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

package org.egov.common.entity.edcr;

import com.fasterxml.jackson.annotation.JsonValue;

public enum OccupancyType {

    OCCUPANCY_A1("Residential"), // singlefamily,
    OCCUPANCY_A2("Special Residential"), OCCUPANCY_A3("Hostel Educational"), OCCUPANCY_A4("Apartment/Flat"), OCCUPANCY_A5(
            "Professional Office"), OCCUPANCY_B1("Educational"), OCCUPANCY_B2("Educational HighSchool"), OCCUPANCY_B3(
                    "Higher Educational Institute"), OCCUPANCY_C("Medical/Hospital"), OCCUPANCY_C1("Medical IP"), OCCUPANCY_C2(
                            "Medical OP"), OCCUPANCY_C3("Medical Admin"), OCCUPANCY_D("Assembly"), OCCUPANCY_D1(
                                    "Assembly Worship"), OCCUPANCY_D2("Bus Terminal"), OCCUPANCY_E(
                                            "Office/Business"), OCCUPANCY_F("Mercantile / Commercial"), OCCUPANCY_F1(
                                                    "Commercial Parking Plaza"), OCCUPANCY_F2(
                                                            "Commercial Parking Appurtenant"), OCCUPANCY_F3(
                                                                    "Hotels"), OCCUPANCY_F4("Kiosk"), OCCUPANCY_G1(
                                                                            "Industrial"), OCCUPANCY_G2(
                                                                                    "Small Industrial"), OCCUPANCY_H(
                                                                                            "Storage"), OCCUPANCY_I1(
                                                                                                    "Hazardous (I1)"), OCCUPANCY_I2(
                                                                                                            "Hazardous (I2)");

    @JsonValue
    private final String occupancyTypeVal;

    OccupancyType(String aTypeVal) {
        this.occupancyTypeVal = aTypeVal;
    }

    public String getOccupancyType() {
        return occupancyTypeVal;
    }

    public String getOccupancyTypeVal() {
        return occupancyTypeVal;
    }
}
