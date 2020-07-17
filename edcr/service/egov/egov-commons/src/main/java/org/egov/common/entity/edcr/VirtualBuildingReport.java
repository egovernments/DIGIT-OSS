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

public class VirtualBuildingReport {

    private BigDecimal proposedBuitUpArea;

    private BigDecimal proposedBuiltUpDeductionArea;

    private BigDecimal proposedFloorArea;

    private BigDecimal proposedCarpetArea;

    private BigDecimal totalExistingBuiltUpArea;

    private BigDecimal totalExistingBuiltUpDeductionArea;

    private BigDecimal totalExistingFloorArea;

    private BigDecimal totalExistingCarpetArea;

    private BigDecimal totalCoverageArea;

    private BigDecimal totalBuitUpArea;

    private BigDecimal totalBuiltUpDeductionArea;

    private BigDecimal totalFloorArea;

    private BigDecimal totalCarpetArea;
    
    private BigDecimal totalConstructedArea;
    
    public BigDecimal getProposedBuitUpArea() {
        return proposedBuitUpArea;
    }

    public void setProposedBuitUpArea(BigDecimal proposedBuitUpArea) {
        this.proposedBuitUpArea = proposedBuitUpArea;
    }

    public BigDecimal getProposedFloorArea() {
        return proposedFloorArea;
    }

    public void setProposedFloorArea(BigDecimal proposedFloorArea) {
        this.proposedFloorArea = proposedFloorArea;
    }

    public BigDecimal getProposedCarpetArea() {
        return proposedCarpetArea;
    }

    public void setProposedCarpetArea(BigDecimal proposedCarpetArea) {
        this.proposedCarpetArea = proposedCarpetArea;
    }

    public BigDecimal getTotalExistingBuiltUpArea() {
        return totalExistingBuiltUpArea;
    }

    public void setTotalExistingBuiltUpArea(BigDecimal totalExistingBuiltUpArea) {
        this.totalExistingBuiltUpArea = totalExistingBuiltUpArea;
    }

    public BigDecimal getTotalExistingFloorArea() {
        return totalExistingFloorArea;
    }

    public void setTotalExistingFloorArea(BigDecimal totalExistingFloorArea) {
        this.totalExistingFloorArea = totalExistingFloorArea;
    }

    public BigDecimal getTotalExistingCarpetArea() {
        return totalExistingCarpetArea;
    }

    public void setTotalExistingCarpetArea(BigDecimal totalExistingCarpetArea) {
        this.totalExistingCarpetArea = totalExistingCarpetArea;
    }

    public BigDecimal getTotalCoverageArea() {
        return totalCoverageArea;
    }

    public void setTotalCoverageArea(BigDecimal totalCoverageArea) {
        this.totalCoverageArea = totalCoverageArea;
    }

    public BigDecimal getTotalBuitUpArea() {
        return totalBuitUpArea;
    }

    public void setTotalBuitUpArea(BigDecimal totalBuitUpArea) {
        this.totalBuitUpArea = totalBuitUpArea;
    }

    public BigDecimal getTotalFloorArea() {
        return totalFloorArea;
    }

    public void setTotalFloorArea(BigDecimal totalFloorArea) {
        this.totalFloorArea = totalFloorArea;
    }

    public BigDecimal getTotalCarpetArea() {
        return totalCarpetArea;
    }

    public void setTotalCarpetArea(BigDecimal totalCarpetArea) {
        this.totalCarpetArea = totalCarpetArea;
    }

    public BigDecimal getProposedBuiltUpDeductionArea() {
        return proposedBuiltUpDeductionArea;
    }

    public void setProposedBuiltUpDeductionArea(BigDecimal proposedBuiltUpDeductionArea) {
        this.proposedBuiltUpDeductionArea = proposedBuiltUpDeductionArea;
    }

    public BigDecimal getTotalExistingBuiltUpDeductionArea() {
        return totalExistingBuiltUpDeductionArea;
    }

    public void setTotalExistingBuiltUpDeductionArea(BigDecimal totalExistingBuiltUpDeductionArea) {
        this.totalExistingBuiltUpDeductionArea = totalExistingBuiltUpDeductionArea;
    }

    public BigDecimal getTotalBuiltUpDeductionArea() {
        return totalBuiltUpDeductionArea;
    }

    public void setTotalBuiltUpDeductionArea(BigDecimal totalBuiltUpDeductionArea) {
        this.totalBuiltUpDeductionArea = totalBuiltUpDeductionArea;
    }

    public BigDecimal getTotalConstructedArea() {
        return totalConstructedArea;
    }

    public void setTotalConstructedArea(BigDecimal totalConstructedArea) {
        this.totalConstructedArea = totalConstructedArea;
    }

}
