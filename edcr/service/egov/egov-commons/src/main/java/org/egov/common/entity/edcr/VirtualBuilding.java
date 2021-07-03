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

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Set;

public class VirtualBuilding implements Serializable {
    private static final long serialVersionUID = 7L;
    private BigDecimal buildingHeight;
    private EnumSet<OccupancyType> occupancies = EnumSet.noneOf(OccupancyType.class);
    private Set<OccupancyTypeHelper> occupancyTypes = new HashSet<>();
    private BigDecimal totalBuitUpArea;
    private BigDecimal totalFloorArea;
    private BigDecimal totalCarpetArea;
    private BigDecimal totalExistingBuiltUpArea;
    private BigDecimal totalExistingFloorArea;
    private BigDecimal totalExistingCarpetArea;
    private OccupancyType mostRestrictiveFar;
    private OccupancyType mostRestrictiveCoverage;
    private OccupancyTypeHelper mostRestrictiveFarHelper;
    private OccupancyTypeHelper mostRestrictiveCoverageHelper;
    private BigDecimal floorsAboveGround;
    private BigDecimal totalCoverageArea;
    private transient Boolean residentialOrCommercialBuilding = false;
    private transient Boolean residentialBuilding = false;
    private BigDecimal totalConstructedArea;
    
    public BigDecimal getTotalCarpetArea() {
        return totalCarpetArea;
    }

    public BigDecimal getTotalExistingBuiltUpArea() {
        return totalExistingBuiltUpArea;
    }

    public BigDecimal getTotalExistingFloorArea() {
        return totalExistingFloorArea;
    }

    public BigDecimal getTotalExistingCarpetArea() {
        return totalExistingCarpetArea;
    }

    public void setTotalCarpetArea(BigDecimal totalCarpetArea) {
        this.totalCarpetArea = totalCarpetArea;
    }

    public void setTotalExistingBuiltUpArea(BigDecimal totalExistingBuiltUpArea) {
        this.totalExistingBuiltUpArea = totalExistingBuiltUpArea;
    }

    public void setTotalExistingFloorArea(BigDecimal totalExistingFloorArea) {
        this.totalExistingFloorArea = totalExistingFloorArea;
    }

    public void setTotalExistingCarpetArea(BigDecimal totalExistingCarpetArea) {
        this.totalExistingCarpetArea = totalExistingCarpetArea;
    }

    public void setTotalCoverageArea(BigDecimal totalCoverageArea) {
        this.totalCoverageArea = totalCoverageArea;
    }

    public BigDecimal getTotalCoverageArea() {
        return totalCoverageArea;
    }

    public Boolean getResidentialBuilding() {
        return residentialBuilding;
    }

    public void setResidentialBuilding(Boolean residentialBuilding) {
        this.residentialBuilding = residentialBuilding;
    }

    public BigDecimal getFloorsAboveGround() {
        return floorsAboveGround;
    }

    public void setFloorsAboveGround(BigDecimal floorsAboveGround) {
        this.floorsAboveGround = floorsAboveGround;
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

    public EnumSet<OccupancyType> getOccupancies() {
        return occupancies;
    }

    public void setOccupancies(EnumSet<OccupancyType> occupancies) {
        this.occupancies = occupancies;
    }

    public Set<OccupancyTypeHelper> getOccupancyTypes() {
        return occupancyTypes;
    }

    public void setOccupancyTypes(Set<OccupancyTypeHelper> occupancyTypes) {
        this.occupancyTypes = occupancyTypes;
    }

    public BigDecimal getBuildingHeight() {
        return buildingHeight;
    }

    public void setBuildingHeight(BigDecimal buildingHeight) {
        this.buildingHeight = buildingHeight;
    }

    public OccupancyType getMostRestrictiveFar() {
        return mostRestrictiveFar;
    }

    public void setMostRestrictiveFar(OccupancyType mostRestrictiveFar) {
        this.mostRestrictiveFar = mostRestrictiveFar;
    }

    public OccupancyType getMostRestrictiveCoverage() {
        return mostRestrictiveCoverage;
    }

    public OccupancyTypeHelper getMostRestrictiveFarHelper() {
        return mostRestrictiveFarHelper;
    }

    public void setMostRestrictiveFarHelper(OccupancyTypeHelper mostRestrictiveFarHelper) {
        this.mostRestrictiveFarHelper = mostRestrictiveFarHelper;
    }

    public OccupancyTypeHelper getMostRestrictiveCoverageHelper() {
        return mostRestrictiveCoverageHelper;
    }

    public void setMostRestrictiveCoverageHelper(OccupancyTypeHelper mostRestrictiveCoverageHelper) {
        this.mostRestrictiveCoverageHelper = mostRestrictiveCoverageHelper;
    }

    public void setMostRestrictiveCoverage(OccupancyType mostRestrictiveCoverage) {
        this.mostRestrictiveCoverage = mostRestrictiveCoverage;
    }

    public Boolean getResidentialOrCommercialBuilding() {
        return residentialOrCommercialBuilding;
    }

    public void setResidentialOrCommercialBuilding(Boolean residentialOrCommercialBuilding) {
        this.residentialOrCommercialBuilding = residentialOrCommercialBuilding;
    }

    public BigDecimal getTotalConstructedArea() {
        return totalConstructedArea;
    }

    public void setTotalConstructedArea(BigDecimal totalConstructedArea) {
        this.totalConstructedArea = totalConstructedArea;
    }
    
}
