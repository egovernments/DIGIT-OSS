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

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

//These are the declarations of the applicant in the plan using PLAN_INFO layer.
public class PlanInformation implements Serializable {

    private static final String NA = "NA";
    public static final String SEQ_EDCR_PLANINFO = "SEQ_EDCR_PLANINFO";
    private static final long serialVersionUID = 4L;

    @Id
    @GeneratedValue(generator = SEQ_EDCR_PLANINFO, strategy = GenerationType.SEQUENCE)
    private Long id;
    // Plot area defined in PLAN_INFO layer. Using the same to measure coverage and small plot condition.This is the declared plot area in the plan.
    private BigDecimal plotArea = BigDecimal.ZERO;
    // Temporary field used to capture Owner Name
    private String ownerName;
    //Temporary field used to auto populate occupancy detail.
    private String occupancy;
    //Temporary field used for service type.
    private String serviceType;
    //Temporary field used to show amenities used in application.
    private String amenities;
    //Save architect who submitted application mentioned in plan info.
    private String architectInformation;
    // Applicant Name 
    private String applicantName;
    // Extracted from Plan info. Whether plot present in CRZ zone. Expecting default value as NO. 
    private Boolean crzZoneArea = true;
    //Extracted from Plan info. Demolition area to be mentioned in the plan info.
    private BigDecimal demolitionArea = BigDecimal.ZERO;
    //Extracted from Plan info. Depth cutting more than 1.5 Meter flag. 
    private transient Boolean depthCutting;
    //YES/NO/NA.Extracted from Plan info. Is building of type government or aided school.
    private transient Boolean governmentOrAidedSchool;
    //YES/NO/NA.Extracted from Plan info. Is plot comes under security zone flag.
    private transient Boolean securityZone = true;
    //YES/NO/NA.Extracted from Plan info.  Access width to the plot.
	private transient BigDecimal accessWidth;
    //Extracted from Plan info.  In case of medical occupancy, capture number of beds present in the building. Sanitation details are decided based on number of beds present.
	private transient BigDecimal noOfBeds;
	//YES/NO/NA.Extracted from Plan info. NOC received from the side owner.
	private transient String nocToAbutSideDesc = NA;
	//YES/NO/NA.Extracted from Plan info. NOC received from the rear owner.
	private transient String nocToAbutRearDesc = NA;
	//YES/NO/NA.Extracted from Plan info. Any opening on sides of building.
	private transient Boolean openingOnSide = false;
	//YES/NO/NA.Extracted from Plan info. Any opening on rear side of building.
	private transient Boolean openingOnRear = false;
	//Extracted from Plan info. Number of seats present in special occupancy 
	private transient Integer noOfSeats = 0;
	//Extracted from Plan info. Number of mechanical parking declared in the plan
	private transient Integer noOfMechanicalParking = 0;
	//YES/NO/NA.Extracted from Plan info.Is plan belongs to single family building. There are few rules relaxed for single family building 
	private transient Boolean singleFamilyBuilding;
	//Extracted from Plan info. Revenue survey number declared in the plan
    private String reSurveyNo;
    //Extracted from Plan info. Revenue ward name declared in the plan
    private String revenueWard;
    //Extracted from Plan info. Desam name declared in the plan
    private String desam;
    //Extracted from Plan info. Village name declared in the plan
    private String village;
    //Extracted from Plan info. Land Use zone. The value should be standard like RESIDENTIAL,COMMERCIAL,INDUSTRIAL,PUBLICANDSEMIPUBLIC etc.
    private transient String landUseZone;
    //YES/NO/NA. Extracted from Plan info. Is lease hold land
    private transient String leaseHoldLand;
    //Extracted from Plan info. Road width declared in the plan.
    private BigDecimal roadWidth = BigDecimal.ZERO;
    //Extracted from Plan info. Road length declared in the plan.
    private BigDecimal roadLength = BigDecimal.ZERO;
    //Extracted from Plan info. Type of area. Whether old or new area.
    private String typeOfArea;
    //Extracted from Plan info. Average plot depth.
    private BigDecimal depthOfPlot = BigDecimal.ZERO;
    //Extracted from Plan info. Average plot width.
    private BigDecimal widthOfPlot = BigDecimal.ZERO;
    //YES/NO/NA. Extracted from Plan info. Is building near to monument.
    private transient String buildingNearMonument = NA;
    //YES/NO/NA.Extracted from Plan info. Is building near to government building
    private transient String buildingNearGovtBuilding = NA;
    //YES/NO/NA.Extracted from Plan info. Building near monument and permitted with NOC
    private transient String nocNearMonument = NA;
    //YES/NO/NA.Extracted from Plan info. Building near airport and permitted with airport authority
    private transient String nocNearAirport = NA;
    //YES/NO/NA.Extracted from Plan info. Building near defence aerodrome and permitted with NOC
    private transient String nocNearDefenceAerodomes = NA;
    //YES/NO/NA.Extracted from Plan info. Permitted with state Environmental impact assessment study report
    private transient String nocStateEnvImpact = NA;
    //YES/NO/NA.Extracted from Plan info. Permitted with railway NOC
    private transient String nocRailways = NA;
    //YES/NO/NA.Extracted from Plan info. Permitted with noc issued by collector on govt. land
    private transient String nocCollectorGvtLand = NA;
    //YES/NO/NA.Extracted from Plan info. Permitted with irrigation report NOC
    private transient String nocIrrigationDept = NA;
    //YES/NO/NA.Extracted from Plan info. Permitted with fire department NOC
    private transient String nocFireDept = NA;
    //YES/NO/NA.Extracted from Plan info. Building near the river flag
    private transient String buildingNearToRiver = NA;
    //YES/NO/NA.Extracted from Plan info. Barrier free access for physically handicapped person provided.
    private transient String barrierFreeAccessForPhyChlngdPpl = NA;
    //YES/NO/NA.Extracted from Plan info. Provision for green building and sustainability provided in plan.Rainwater harvesting,solar,segregation of waste etc.
    private transient String provisionsForGreenBuildingsAndSustainability = NA;
    //YES/NO/NA.Extracted from Plan info. Fire Protection And Fire Safety Requirements declared in the plan.
    private transient String fireProtectionAndFireSafetyRequirements = NA;
    //Extracted from Plan info.Plot number.
    private String plotNo;
    //Extracted from Plan info.Khata number.
    private String khataNo;
    //Extracted from Plan info.Mauza number.
    private String mauza;
    //Extracted from Plan info.District name.
    private String district;
    //YES/NO/NA.Extracted from Plan info. Rain water declared in plan.
    private transient String rwhDeclared = NA;


    public Boolean getGovernmentOrAidedSchool() {
        return governmentOrAidedSchool;
    }

    public void setGovernmentOrAidedSchool(Boolean governmentOrAidedSchool) {
        this.governmentOrAidedSchool = governmentOrAidedSchool;
    }

    public Boolean getCrzZoneArea() {
        return crzZoneArea;
    }

    public void setCrzZoneArea(Boolean crzZoneArea) {
        this.crzZoneArea = crzZoneArea;
    }

    public BigDecimal getPlotArea() {
        return plotArea;
    }

    public void setPlotArea(BigDecimal plotArea) {
        this.plotArea = plotArea;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getArchitectInformation() {
        return architectInformation;
    }

    public void setArchitectInformation(String architectInformation) {
        this.architectInformation = architectInformation;
    }

    public String getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(String occupancy) {
        this.occupancy = occupancy;
    }

    public Boolean getSecurityZone() {
        return securityZone;
    }

    public void setSecurityZone(Boolean securityZone) {
        this.securityZone = securityZone;
    }

    public BigDecimal getAccessWidth() {
        return accessWidth;
    }

    public Boolean getDepthCutting() {
        return depthCutting;
    }

    public void setDepthCutting(Boolean depthCutting) {
        this.depthCutting = depthCutting;
    }

    public void setAccessWidth(BigDecimal accessWidth) {
        this.accessWidth = accessWidth;
    }

    /*
     * public Boolean getNocToAbutSide() { return nocToAbutSide; } public void setNocToAbutSide(Boolean nocToAbutSide) {
     * this.nocToAbutSide = nocToAbutSide; }
     */
    /*
     * public Boolean getNocToAbutRear() { return nocToAbutRear; } public void setNocToAbutRear(Boolean nocToAbutRear) {
     * this.nocToAbutRear = nocToAbutRear; }
     */

    public Boolean getOpeningOnSide() {
        return openingOnSide;
    }

    public void setOpeningOnSide(Boolean openingOnSide) {
        this.openingOnSide = openingOnSide;
    }

    /*
     * public Boolean getOpeningOnSideBelow2mts() { return openingOnSideBelow2mts; }
     */

    /*
     * public void setOpeningOnSideBelow2mts(Boolean openingOnSideBelow2mts) { this.openingOnSideBelow2mts =
     * openingOnSideBelow2mts; }
     */
    /*
     * public Boolean getOpeningOnSideAbove2mts() { return openingOnSideAbove2mts; }
     */

    /*
     * public void setOpeningOnSideAbove2mts(Boolean openingOnSideAbove2mts) { this.openingOnSideAbove2mts =
     * openingOnSideAbove2mts; }
     */

    /*
     * public Boolean getOpeningOnRearBelow2mts() { return openingOnRearBelow2mts; }
     */

    /*
     * public void setOpeningOnRearBelow2mts(Boolean openingOnRearBelow2mts) { this.openingOnRearBelow2mts =
     * openingOnRearBelow2mts; }
     */
    /*
     * public Boolean getOpeningOnRearAbove2mts() { return openingOnRearAbove2mts; }
     */

    /*
     * public void setOpeningOnRearAbove2mts(Boolean openingOnRearAbove2mts) { this.openingOnRearAbove2mts =
     * openingOnRearAbove2mts; }
     */

    /*
     * public Boolean getNocToAbutAdjascentSide() { return nocToAbutAdjascentSide; } public void setNocToAbutAdjascentSide(Boolean
     * nocToAbutAdjascentSide) { this.nocToAbutAdjascentSide = nocToAbutAdjascentSide; }
     */

    public Boolean getOpeningOnRear() {
        return openingOnRear;
    }

    public void setOpeningOnRear(Boolean openingOnRear) {
        this.openingOnRear = openingOnRear;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public BigDecimal getNoOfBeds() {
        return noOfBeds;
    }

    public void setNoOfBeds(BigDecimal noOfBeds) {
        this.noOfBeds = noOfBeds;
    }

    public Integer getNoOfSeats() {
        return noOfSeats;
    }

    public void setNoOfSeats(Integer noOfSeats) {
        this.noOfSeats = noOfSeats;
    }

    public Integer getNoOfMechanicalParking() {
        return noOfMechanicalParking;
    }

    public void setNoOfMechanicalParking(Integer noOfMechanicalParking) {
        this.noOfMechanicalParking = noOfMechanicalParking;
    }

    public Boolean getSingleFamilyBuilding() {
        return singleFamilyBuilding;
    }

    public void setSingleFamilyBuilding(Boolean singleFamilyBuilding) {
        this.singleFamilyBuilding = singleFamilyBuilding;
    }

    public BigDecimal getDemolitionArea() {
        return demolitionArea;
    }

    public void setDemolitionArea(BigDecimal demolitionArea) {
        this.demolitionArea = demolitionArea;
    }

    public String getReSurveyNo() {
        return reSurveyNo;
    }

    public void setReSurveyNo(String reSurveyNo) {
        this.reSurveyNo = reSurveyNo;
    }

    public String getRevenueWard() {
        return revenueWard;
    }

    public void setRevenueWard(String revenueWard) {
        this.revenueWard = revenueWard;
    }

    public String getDesam() {
        return desam;
    }

    public void setDesam(String desam) {
        this.desam = desam;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getNocToAbutSideDesc() {
        return nocToAbutSideDesc;
    }

    public void setNocToAbutSideDesc(String nocToAbutSideDesc) {
        this.nocToAbutSideDesc = nocToAbutSideDesc;
    }

    public String getNocToAbutRearDesc() {
        return nocToAbutRearDesc;
    }

    public void setNocToAbutRearDesc(String nocToAbutRearDesc) {
        this.nocToAbutRearDesc = nocToAbutRearDesc;
    }

    public String getLandUseZone() {
        return landUseZone;
    }

    public void setLandUseZone(String landUseZone) {
        this.landUseZone = landUseZone;
    }

    public String getLeaseHoldLand() {
        return leaseHoldLand;
    }

    public void setLeaseHoldLand(String leaseHoldLand) {
        this.leaseHoldLand = leaseHoldLand;
    }

    public BigDecimal getRoadWidth() {
        return roadWidth;
    }

    public void setRoadWidth(BigDecimal roadWidth) {
        this.roadWidth = roadWidth;
    }

    public String getTypeOfArea() {
        return typeOfArea;
    }

    public void setTypeOfArea(String typeOfArea) {
        this.typeOfArea = typeOfArea;
    }

    public BigDecimal getDepthOfPlot() {
        return depthOfPlot;
    }

    public void setDepthOfPlot(BigDecimal depthOfPlot) {
        this.depthOfPlot = depthOfPlot;
    }

    public BigDecimal getWidthOfPlot() {
        return widthOfPlot;
    }

    public void setWidthOfPlot(BigDecimal widthOfPlot) {
        this.widthOfPlot = widthOfPlot;
    }

    public String getBuildingNearMonument() {
        return buildingNearMonument;
    }

    public void setBuildingNearMonument(String buildingNearMonument) {
        this.buildingNearMonument = buildingNearMonument;
    }

    public String getBuildingNearGovtBuilding() {
        return buildingNearGovtBuilding;
    }

    public void setBuildingNearGovtBuilding(String buildingNearGovtBuilding) {
        this.buildingNearGovtBuilding = buildingNearGovtBuilding;
    }

    public String getNocNearMonument() {
        return nocNearMonument;
    }

    public void setNocNearMonument(String nocNearMonument) {
        this.nocNearMonument = nocNearMonument;
    }

    public String getNocNearAirport() {
        return nocNearAirport;
    }

    public void setNocNearAirport(String nocNearAirport) {
        this.nocNearAirport = nocNearAirport;
    }

    public String getNocNearDefenceAerodomes() {
        return nocNearDefenceAerodomes;
    }

    public void setNocNearDefenceAerodomes(String nocNearDefenceAerodomes) {
        this.nocNearDefenceAerodomes = nocNearDefenceAerodomes;
    }

    public String getNocStateEnvImpact() {
        return nocStateEnvImpact;
    }

    public void setNocStateEnvImpact(String nocStateEnvImpact) {
        this.nocStateEnvImpact = nocStateEnvImpact;
    }

    public String getNocRailways() {
        return nocRailways;
    }

    public void setNocRailways(String nocRailways) {
        this.nocRailways = nocRailways;
    }

    public String getNocCollectorGvtLand() {
        return nocCollectorGvtLand;
    }

    public void setNocCollectorGvtLand(String nocCollectorGvtLand) {
        this.nocCollectorGvtLand = nocCollectorGvtLand;
    }

    public String getNocIrrigationDept() {
        return nocIrrigationDept;
    }

    public void setNocIrrigationDept(String nocIrrigationDept) {
        this.nocIrrigationDept = nocIrrigationDept;
    }

    public String getNocFireDept() {
        return nocFireDept;
    }

    public void setNocFireDept(String nocFireDept) {
        this.nocFireDept = nocFireDept;
    }

    public BigDecimal getRoadLength() {
        return roadLength;
    }

    public void setRoadLength(BigDecimal roadLength) {
        this.roadLength = roadLength;
    }

    public String getBuildingNearToRiver() {
        return buildingNearToRiver;
    }

    public void setBuildingNearToRiver(String buildingNearToRiver) {
        this.buildingNearToRiver = buildingNearToRiver;
    }

    public String getBarrierFreeAccessForPhyChlngdPpl() {
        return barrierFreeAccessForPhyChlngdPpl;
    }

    public void setBarrierFreeAccessForPhyChlngdPpl(String barrierFreeAccessForPhyChlngdPpl) {
        this.barrierFreeAccessForPhyChlngdPpl = barrierFreeAccessForPhyChlngdPpl;
    }

    public String getPlotNo() {
        return plotNo;
    }

    public void setPlotNo(String plotNo) {
        this.plotNo = plotNo;
    }

    public String getKhataNo() {
        return khataNo;
    }

    public void setKhataNo(String khataNo) {
        this.khataNo = khataNo;
    }

    public String getMauza() {
        return mauza;
    }

    public void setMauza(String mauza) {
        this.mauza = mauza;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getProvisionsForGreenBuildingsAndSustainability() {
        return provisionsForGreenBuildingsAndSustainability;
    }

    public void setProvisionsForGreenBuildingsAndSustainability(String provisionsForGreenBuildingsAndSustainability) {
        this.provisionsForGreenBuildingsAndSustainability = provisionsForGreenBuildingsAndSustainability;
    }

    public String getFireProtectionAndFireSafetyRequirements() {
        return fireProtectionAndFireSafetyRequirements;
    }

    public void setFireProtectionAndFireSafetyRequirements(String fireProtectionAndFireSafetyRequirements) {
        this.fireProtectionAndFireSafetyRequirements = fireProtectionAndFireSafetyRequirements;
    }

    public String getRwhDeclared() {
        return rwhDeclared;
    }

    public void setRwhDeclared(String rwhDeclared) {
        this.rwhDeclared = rwhDeclared;
    }

}
