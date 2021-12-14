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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Building extends Measurement {

    private static final long serialVersionUID = 13L;

    private BigDecimal buildingHeight;
    
    private BigDecimal buildingHeightAsMeasured;

    private BigDecimal declaredBuildingHeight;

    private String heightIncreasedBy;

    private BigDecimal buildingTopMostHeight;

    private BigDecimal totalFloorArea;

    private BigDecimal totalExistingFloorArea;

    private Measurement exteriorWall;

    private Measurement shade;

    private BigDecimal far;

    private BigDecimal coverage;

    private BigDecimal coverageArea;
    /*
     * Maximum number of floors
     */
    private BigDecimal maxFloor;
    /*
     * Total number of floors including celler
     */
    private BigDecimal totalFloors;

    private List<Floor> floors = new ArrayList<>();

    private BigDecimal floorsAboveGround;

    private List<BigDecimal> distanceFromBuildingFootPrintToRoadEnd = new ArrayList<>();
    private List<BigDecimal> distanceFromSetBackToBuildingLine = new ArrayList<>();

    private BigDecimal totalBuitUpArea;

    private BigDecimal totalExistingBuiltUpArea;

    private OccupancyType mostRestrictiveOccupancy;
    private OccupancyType mostRestrictiveOccupancyType;
    private OccupancyTypeHelper mostRestrictiveFarHelper;
    // this is converted Occupancies to base type
    private List<Occupancy> occupancies = new ArrayList<>();

    // This would be plain sum of occupancies without converting
    private List<Occupancy> totalArea = new ArrayList<>();

    private Passage passage;

    private HeadRoom headRoom;

    private Boolean isHighRise = false;

    private BigDecimal totalConstructedArea = BigDecimal.ZERO;
    
    public List<Occupancy> getOccupancies() {
        return occupancies;
    }

    public void setOccupancies(List<Occupancy> occupancies) {
        this.occupancies = occupancies;
    }

    public OccupancyType getMostRestrictiveOccupancy() {
        return mostRestrictiveOccupancy;
    }

    public void setMostRestrictiveOccupancy(OccupancyType mostRestrictiveOccupancy) {
        this.mostRestrictiveOccupancy = mostRestrictiveOccupancy;
    }

    public OccupancyType getMostRestrictiveOccupancyType() {
        return mostRestrictiveOccupancyType;
    }

    public void setMostRestrictiveOccupancyType(OccupancyType mostRestrictiveOccupancyType) {
        this.mostRestrictiveOccupancyType = mostRestrictiveOccupancyType;
    }

    public BigDecimal getTotalExistingFloorArea() {
        return totalExistingFloorArea;
    }

    public BigDecimal getTotalExistingBuiltUpArea() {
        return totalExistingBuiltUpArea;
    }

    public void setTotalExistingFloorArea(BigDecimal totalExistingFloorArea) {
        this.totalExistingFloorArea = totalExistingFloorArea;
    }

    public void setTotalExistingBuiltUpArea(BigDecimal totalExistingBuiltUpArea) {
        this.totalExistingBuiltUpArea = totalExistingBuiltUpArea;
    }

    public BigDecimal getBuildingHeight() {
        return buildingHeight;
    }

    public void setBuildingHeight(BigDecimal buildingHeight) {
        this.buildingHeight = buildingHeight;
    }

    public BigDecimal getBuildingHeightAsMeasured() {
        return buildingHeightAsMeasured;
    }

    public void setBuildingHeightAsMeasured(BigDecimal buildingHeightAsMeasured) {
        this.buildingHeightAsMeasured = buildingHeightAsMeasured;
    }

    public List<Floor> getFloors() {
        return floors;
    }

    public void sortFloorByName() {
        if (!floors.isEmpty())
            Collections.sort(floors, (c1, c2) -> c1.getNumber().compareTo(c2.getNumber()));

    }

    public Floor getFloorNumber(int floorNo) {
        for (Floor f : floors) {
            if (f.getNumber() != null && f.getNumber().intValue() == floorNo) {
                return f;
            }
        }
        return null;
    }

    public BigDecimal getCoverageArea() {
        return coverageArea;
    }

    public void setCoverageArea(BigDecimal coverageArea) {
        this.coverageArea = coverageArea;
    }

    public void setFloors(List<Floor> floors) {
        this.floors = floors;
    }

    public BigDecimal getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(BigDecimal totalFloors) {
        this.totalFloors = totalFloors;
    }

    public BigDecimal getMaxFloor() {
        return maxFloor;
    }

    public void setMaxFloor(BigDecimal maxFloor) {
        this.maxFloor = maxFloor;
    }

    public BigDecimal getBuildingTopMostHeight() {
        return buildingTopMostHeight;
    }

    public void setBuildingTopMostHeight(BigDecimal buildingHeightTopMost) {
        buildingTopMostHeight = buildingHeightTopMost;
    }

    public BigDecimal getTotalFloorArea() {
        return totalFloorArea;
    }

    public void setTotalFloorArea(BigDecimal totalFloorArea) {
        this.totalFloorArea = totalFloorArea;
    }

    public BigDecimal getFar() {
        return far;
    }

    public void setFar(BigDecimal far) {
        this.far = far;
    }

    public BigDecimal getCoverage() {
        return coverage;
    }

    public void setCoverage(BigDecimal coverage) {
        this.coverage = coverage;
    }

    public Measurement getExteriorWall() {
        return exteriorWall;
    }

    public void setExteriorWall(Measurement exteriorWall) {
        this.exteriorWall = exteriorWall;
    }

    public BigDecimal getFloorsAboveGround() {
        return floorsAboveGround;
    }

    public void setFloorsAboveGround(BigDecimal floorsAboveGround) {
        this.floorsAboveGround = floorsAboveGround;
    }

    public Measurement getShade() {
        return shade;
    }

    public void setShade(Measurement shade) {
        this.shade = shade;
    }

    public BigDecimal getTotalBuitUpArea() {
        return totalBuitUpArea;
    }

    public void setTotalBuitUpArea(BigDecimal totalBuitUpArea) {
        this.totalBuitUpArea = totalBuitUpArea;
    }

    @Override
    public String toString() {
        String newLine = "\n";
        StringBuilder str = new StringBuilder();
        str.append("Building :").append(newLine).append("buildingHeight:").append(this.buildingHeight).append(newLine)
                .append("totalFloorArea:").append(this.totalFloorArea).append(newLine).append("far:").append(this.far)
                .append(newLine).append("Coverage:").append(this.coverage).append(newLine).append("totalFloors:")
                .append(this.totalFloors).append(newLine).append("floorsAboveGround:").append(this.floorsAboveGround)
                .append(newLine).append("maxFloor:").append(this.maxFloor).append(newLine).append("area:")
                .append(this.area).append(newLine).append("Floors Count:").append(this.floors.size()).append(newLine)
                .append("Exterior wall:").append(this.exteriorWall).append(newLine).append("Floors:")
                .append(this.floors).append(newLine);
        return str.toString();
    }

    public List<BigDecimal> getDistanceFromBuildingFootPrintToRoadEnd() {
        return distanceFromBuildingFootPrintToRoadEnd;
    }

    public void setDistanceFromBuildingFootPrintToRoadEnd(List<BigDecimal> distanceFromBuildingFootPrintToRoadEnd) {
        this.distanceFromBuildingFootPrintToRoadEnd = distanceFromBuildingFootPrintToRoadEnd;
    }

    public List<BigDecimal> getDistanceFromSetBackToBuildingLine() {
        return distanceFromSetBackToBuildingLine;
    }

    public void setDistanceFromSetBackToBuildingLine(List<BigDecimal> distanceFromSetBackToBuildingLine) {
        this.distanceFromSetBackToBuildingLine = distanceFromSetBackToBuildingLine;
    }

    public void addDistanceFromBuildingFootPrintToRoadEnd(BigDecimal distanceFromBuildingFootPrintToRoadEnd) {
        getDistanceFromBuildingFootPrintToRoadEnd().add(distanceFromBuildingFootPrintToRoadEnd);
    }

    public List<Occupancy> getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(List<Occupancy> totalArea) {
        this.totalArea = totalArea;
    }

    public Passage getPassage() {
        return passage;
    }

    public void setPassage(Passage passage) {
        this.passage = passage;
    }

    public BigDecimal getDeclaredBuildingHeight() {
        return declaredBuildingHeight;
    }

    public void setDeclaredBuildingHeight(BigDecimal declaredBuildingHeight) {
        this.declaredBuildingHeight = declaredBuildingHeight;
    }

    public String getHeightIncreasedBy() {
        return heightIncreasedBy;
    }

    public void setHeightIncreasedBy(String heightIncreasedBy) {
        this.heightIncreasedBy = heightIncreasedBy;
    }

    public OccupancyTypeHelper getMostRestrictiveFarHelper() {
        return mostRestrictiveFarHelper;
    }

    public void setMostRestrictiveFarHelper(OccupancyTypeHelper mostRestrictiveFarHelper) {
        this.mostRestrictiveFarHelper = mostRestrictiveFarHelper;
    }

    public Boolean getIsHighRise() {
        return isHighRise;
    }

    public void setIsHighRise(Boolean isHighRise) {
        this.isHighRise = isHighRise;
    }

    public HeadRoom getHeadRoom() {
        return headRoom;
    }

    public void setHeadRoom(HeadRoom headRoom) {
        this.headRoom = headRoom;
    }

    public BigDecimal getTotalConstructedArea() {
        return totalConstructedArea;
    }

    public void setTotalConstructedArea(BigDecimal totalConstructedArea) {
        this.totalConstructedArea = totalConstructedArea;
    }

}
