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
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Block extends Measurement {

    private static final String SIDE_YARD1_DESC = "Side Yard1";
    private static final String SIDE_YARD2_DESC = "Side Yard2";
    private static final long serialVersionUID = 12L;

    private Building building = new Building();
    private String name;
    private String number;
    private String numberOfLifts;
    private List<SetBack> setBacks = new ArrayList<>();
    private List<Measurement> coverage = new ArrayList<>();
    private List<Measurement> coverageDeductions = new ArrayList<>();
    private List<TypicalFloor> typicalFloor = new ArrayList<>();
    private List<BlockDistances> disBetweenBlocks = new ArrayList<>();
    private List<Hall> hallAreas = new ArrayList<>();
    private List<Measurement> diningSpaces = new ArrayList<>();
    // private List<Balcony> balconyAreas = new ArrayList<>();
    private SanityDetails sanityDetails = new SanityDetails();
    private transient Boolean singleFamilyBuilding = false;
    private transient Boolean residentialBuilding = false;
    private transient Boolean residentialOrCommercialBuilding = false;
    private transient Boolean highRiseBuilding = false;
    private transient Boolean completelyExisting = false;
    private List<DARamp> daRamps = new ArrayList<>();
    private List<Measurement> openStairs = new ArrayList<>();
    private List<BigDecimal> plinthHeight;
    private List<BigDecimal> interiorCourtYard;
    private List<Measurement> protectedBalconies;
    private List<Measurement> plantationGreenStripes;
    private List<BigDecimal> roofTanks;
    private List<BigDecimal> stairCovers;
    private List<BigDecimal> chimneys;
    private List<BigDecimal> parapets;
    private List<TerraceUtility> terraceUtilities;
    private FireTenderMovement fireTenderMovement;
    private List<Measurement> parapetWithColor = new ArrayList<>();
    private Parapet parapetV2;
    private Chimney chimneyV2;
    private List<Portico> porticos = new ArrayList<>();

    @Override
    public String toString() {
        return "Block [building=" + building + ", name=" + name + ", number=" + number + ", setBacks=" + setBacks
                + ", presentInDxf=" + presentInDxf + "]";
    }

    public List<SetBack> getSetBacks() {
        return setBacks;
    }

    public SetBack getLevelZeroSetBack() {
        SetBack setBack = null;

        for (SetBack setback : getSetBacks()) {
            if (setback.getLevel() == 0)
                return setback;
        }
        return setBack;
    }

    public String getNumberOfLifts() {
        return numberOfLifts;
    }

    public void setNumberOfLifts(String numberOfLifts) {
        this.numberOfLifts = numberOfLifts;
    }

    public void setDisBetweenBlocks(List<BlockDistances> disBetweenBlocks) {
        this.disBetweenBlocks = disBetweenBlocks;
    }

    public SetBack getSetBackByLevel(String level) {

        SetBack setBack = null;
        Integer lvl = Integer.valueOf(level);
        for (SetBack setback : getSetBacks()) {
            if (setback.getLevel() == lvl)
                return setback;
        }
        return setBack;
    }

    public Boolean getResidentialOrCommercialBuilding() {
        return residentialOrCommercialBuilding;
    }

    public void setResidentialOrCommercialBuilding(Boolean residentialOrCommercialBuilding) {
        this.residentialOrCommercialBuilding = residentialOrCommercialBuilding;
    }

    public List<DARamp> getDARamps() {
        return daRamps;
    }

    public void addDARamps(DARamp daRamps) {
        this.daRamps.add(daRamps);
    }

    public List<BlockDistances> getDistanceBetweenBlocks() {
        return disBetweenBlocks;
    }

    public void setSetBacks(List<SetBack> setBacks) {
        this.setBacks = setBacks;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }

    public Boolean getResidentialBuilding() {
        return residentialBuilding;
    }

    public void setResidentialBuilding(Boolean residentialBuilding) {
        this.residentialBuilding = residentialBuilding;
    }

    public SetBack getLowerLevelSetBack(Integer level, String yardDesc) {

        SetBack setBack = null;
        if (level == 0)
            return null;

        while (level > 0) {
            level--;
            for (SetBack setback : getSetBacks()) {
                if (setback.getLevel() == level && yardDesc.equalsIgnoreCase(SIDE_YARD1_DESC)
                        && setback.getSideYard1() != null)
                    return setback;
                else if (setback.getLevel() == level && yardDesc.equalsIgnoreCase(SIDE_YARD2_DESC)
                        && setback.getSideYard2() != null)
                    return setback;
            }

        }
        return setBack;

    }

    public List<TypicalFloor> getTypicalFloor() {
        return typicalFloor;
    }

    public void setTypicalFloor(List<TypicalFloor> typicalFloor) {
        this.typicalFloor = typicalFloor;
    }

    public List<Hall> getHallAreas() {
        return hallAreas;
    }

    public void setHallAreas(List<Hall> hallAreas) {
        this.hallAreas = hallAreas;
    }

    public List<Measurement> getDiningSpaces() {
        return diningSpaces;
    }

    public void setDiningSpaces(List<Measurement> diningSpaces) {
        this.diningSpaces = diningSpaces;
    }

    /*
     * public List<Balcony> getBalconyAreas() { return balconyAreas; } public void setBalconyAreas(List<Balcony> balconyAreas) {
     * this.balconyAreas = balconyAreas; }
     */

    public SanityDetails getSanityDetails() {
        return sanityDetails;
    }

    public void setSanityDetails(SanityDetails sanityDetails) {
        this.sanityDetails = sanityDetails;
    }

    public Boolean getSingleFamilyBuilding() {
        return singleFamilyBuilding;
    }

    public void setSingleFamilyBuilding(Boolean singleFamilyBuilding) {
        this.singleFamilyBuilding = singleFamilyBuilding;
    }

    public Boolean getHighRiseBuilding() {
        return highRiseBuilding;
    }

    public void setHighRiseBuilding(Boolean highRiseBuilding) {
        this.highRiseBuilding = highRiseBuilding;
    }

    public List<Measurement> getCoverage() {
        return coverage;
    }

    public List<Measurement> getCoverageDeductions() {
        return coverageDeductions;
    }

    public List<BlockDistances> getDisBetweenBlocks() {
        return disBetweenBlocks;
    }

    public void setCoverage(List<Measurement> coverage) {
        this.coverage = coverage;
    }

    public void setCoverageDeductions(List<Measurement> coverageDeductions) {
        this.coverageDeductions = coverageDeductions;
    }

    public void setDaRamps(List<DARamp> daRamps) {
        this.daRamps = daRamps;
    }

    public Boolean getCompletelyExisting() {
        return completelyExisting;
    }

    public void setCompletelyExisting(Boolean completelyExisting) {
        this.completelyExisting = completelyExisting;
    }

    public List<Measurement> getOpenStairs() {
        return openStairs;
    }

    public void setOpenStairs(List<Measurement> openStairs) {
        this.openStairs = openStairs;
    }

    public List<BigDecimal> getPlinthHeight() {
        return plinthHeight;
    }

    public void setPlinthHeight(List<BigDecimal> plinthHeight) {
        this.plinthHeight = plinthHeight;
    }

    public List<BigDecimal> getInteriorCourtYard() {
        return interiorCourtYard;
    }

    public void setInteriorCourtYard(List<BigDecimal> interiorCourtYard) {
        this.interiorCourtYard = interiorCourtYard;
    }

    public List<Measurement> getProtectedBalconies() {
        return protectedBalconies;
    }

    public void setProtectedBalconies(List<Measurement> protectedBalconies) {
        this.protectedBalconies = protectedBalconies;
    }

    public List<Measurement> getPlantationGreenStripes() {
        return plantationGreenStripes;
    }

    public void setPlantationGreenStripes(List<Measurement> plantationGreenStripes) {
        this.plantationGreenStripes = plantationGreenStripes;
    }

    public List<BigDecimal> getRoofTanks() {
        return roofTanks;
    }

    public void setRoofTanks(List<BigDecimal> roofTanks) {
        this.roofTanks = roofTanks;
    }

    public List<BigDecimal> getStairCovers() {
        return stairCovers;
    }

    public void setStairCovers(List<BigDecimal> stairCovers) {
        this.stairCovers = stairCovers;
    }

    public List<BigDecimal> getChimneys() {
        return chimneys;
    }

    public void setChimneys(List<BigDecimal> chimneys) {
        this.chimneys = chimneys;
    }

    public List<BigDecimal> getParapets() {
        return parapets;
    }

    public void setParapets(List<BigDecimal> parapets) {
        this.parapets = parapets;
    }

    public FireTenderMovement getFireTenderMovement() {
        return fireTenderMovement;
    }

    public void setFireTenderMovement(FireTenderMovement fireTenderMovement) {
        this.fireTenderMovement = fireTenderMovement;
    }

    public List<TerraceUtility> getTerraceUtilities() {
        return terraceUtilities;
    }

    public void setTerraceUtilities(List<TerraceUtility> terraceUtilities) {
        this.terraceUtilities = terraceUtilities;
    }

    public List<Measurement> getParapetWithColor() {
        return parapetWithColor;
    }

    public void setParapetWithColor(List<Measurement> parapetWithColor) {
        this.parapetWithColor = parapetWithColor;
    }

	public Parapet getParapetV2() {
		return parapetV2;
	}

	public void setParapetV2(Parapet parapetV2) {
		this.parapetV2 = parapetV2;
	}

	public Chimney getChimneyV2() {
		return chimneyV2;
	}

	public void setChimneyV2(Chimney chimneyV2) {
		this.chimneyV2 = chimneyV2;
	}

	public List<Portico> getPorticos() {
		return porticos;
	}

	public void setPorticos(List<Portico> porticos) {
		this.porticos = porticos;
	}

	public void addPorticos(Portico portico) {
		this.porticos.add(portico);
	}

}
