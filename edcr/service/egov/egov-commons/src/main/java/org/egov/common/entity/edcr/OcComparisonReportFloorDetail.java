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

import java.math.BigDecimal;

public class OcComparisonReportFloorDetail {

    private Long number;

    private BigDecimal permitBltUpArea = BigDecimal.ZERO;

    private BigDecimal ocBltUpArea = BigDecimal.ZERO;

    private BigDecimal bltUpAreaDeviation = BigDecimal.ZERO;

    private BigDecimal permitFloorArea = BigDecimal.ZERO;

    private BigDecimal ocFloorArea = BigDecimal.ZERO;

    private BigDecimal floorAreaDeviation = BigDecimal.ZERO;

    private BigDecimal permitCarpetArea = BigDecimal.ZERO;

    private BigDecimal ocCarpetArea = BigDecimal.ZERO;

    private BigDecimal carpetAreaDeviation = BigDecimal.ZERO;;

    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    public BigDecimal getPermitBltUpArea() {
        return permitBltUpArea;
    }

    public void setPermitBltUpArea(BigDecimal permitBltUpArea) {
        this.permitBltUpArea = permitBltUpArea;
    }

    public BigDecimal getOcBltUpArea() {
        return ocBltUpArea;
    }

    public void setOcBltUpArea(BigDecimal ocBltUpArea) {
        this.ocBltUpArea = ocBltUpArea;
    }

    public BigDecimal getBltUpAreaDeviation() {
        return bltUpAreaDeviation;
    }

    public void setBltUpAreaDeviation(BigDecimal bltUpAreaDeviation) {
        this.bltUpAreaDeviation = bltUpAreaDeviation;
    }

    public BigDecimal getPermitFloorArea() {
        return permitFloorArea;
    }

    public void setPermitFloorArea(BigDecimal permitFloorArea) {
        this.permitFloorArea = permitFloorArea;
    }

    public BigDecimal getOcFloorArea() {
        return ocFloorArea;
    }

    public void setOcFloorArea(BigDecimal ocFloorArea) {
        this.ocFloorArea = ocFloorArea;
    }

    public BigDecimal getFloorAreaDeviation() {
        return floorAreaDeviation;
    }

    public void setFloorAreaDeviation(BigDecimal floorAreaDeviation) {
        this.floorAreaDeviation = floorAreaDeviation;
    }

    public BigDecimal getPermitCarpetArea() {
        return permitCarpetArea;
    }

    public void setPermitCarpetArea(BigDecimal permitCarpetArea) {
        this.permitCarpetArea = permitCarpetArea;
    }

    public BigDecimal getOcCarpetArea() {
        return ocCarpetArea;
    }

    public void setOcCarpetArea(BigDecimal ocCarpetArea) {
        this.ocCarpetArea = ocCarpetArea;
    }

    public BigDecimal getCarpetAreaDeviation() {
        return carpetAreaDeviation;
    }

    public void setCarpetAreaDeviation(BigDecimal carpetAreaDeviation) {
        this.carpetAreaDeviation = carpetAreaDeviation;
    }

}
