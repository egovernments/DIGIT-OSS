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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Transient;

import org.egov.common.entity.bpa.SubOccupancy;
import org.egov.common.entity.bpa.Usage;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/*All the details extracted from the plan are referred in this object*/
@JsonIgnoreProperties(ignoreUnknown = true)
public class Plan implements Serializable {

    private static final long serialVersionUID = 7276648029097296311L;

    /**
     * Plan scrutiny report status. Values true mean "Accepted" and False mean "Not Accepted". Default value false. On plan
     * scrutiny, if all the rules are success then value is true.
     */
    Map<String, String> planInfoProperties = new HashMap<>();

    private Boolean edcrPassed = false;
    // Submission date of plan scrutiny.
    private Date applicationDate;
    /**
     * decides on what date scrutiny should be done
     */
    private Date asOnDate;

    /**
     * Planinformation captures the declarations of the plan.Plan information captures the boundary, building location
     * details,surrounding building NOC's etc. User will assert the details about the plot. The same will be used to print in plan
     * report.
     */
    private PlanInformation planInformation;
    // Plot and Set back details.
    private Plot plot;

    // Single plan contain multiple block/building information. Records Existing and proposed block information.
    private List<Block> blocks = new ArrayList<>();

    // Records Accessory building details. Building has outdoor structures such as attached or detached garages, sheds, storage
    // building etc.This will not consider as another block.
    private List<AccessoryBlock> accessoryBlocks = new ArrayList<>();
    private List<BigDecimal> accessoryBlockDistances = new ArrayList<>();
    // Temporary building object used to validate rules based on overall plot/buildings details. Eg: Total buildup area of all the
    // blocks, Unique occupancies present in this plot etc.
    private VirtualBuilding virtualBuilding = new VirtualBuilding();
    // List of electric lines which are passed through plot.
    private transient List<ElectricLine> electricLine = new ArrayList<>();
    // Non notified road like municipal road etc which are present next to plot.
    private transient List<NonNotifiedRoad> nonNotifiedRoads = new ArrayList<>();
    // Notified road like highway road etc which are present next to plot.
    private transient List<NotifiedRoad> notifiedRoads = new ArrayList<>();
    // Irregular shape roads whic are present next to plot
    private transient List<CulDeSacRoad> culdeSacRoads = new ArrayList<>();
    // Lane road which are present next to plot.
    private transient List<Lane> laneRoads = new ArrayList<>();

    // Travel distance to exit from the buildings.
    private transient List<BigDecimal> travelDistancesToExit = new ArrayList<>();
    // Parking facilities provided in the plot. Includes visitor, two wheeler, four wheeler etc
    private transient ParkingDetails parkingDetails = new ParkingDetails();
    // If canopy present, then distance from the plot boundary
    private transient List<BigDecimal> canopyDistanceFromPlotBoundary;

    // List of occupancies present in the plot including all the blocks.
    private List<Occupancy> occupancies = new ArrayList<>();
    @JsonIgnore
    private transient Map<Integer, org.egov.common.entity.bpa.Occupancy> occupanciesMaster = new HashMap<>();
    @JsonIgnore
    private transient Map<Integer, SubOccupancy> subOccupanciesMaster = new HashMap<>();
    @JsonIgnore
    private transient Map<Integer, Usage> usagesMaster = new HashMap<>();
    @JsonIgnore
    private transient Map<String, Map<String, Integer>> subFeatureColorCodesMaster = new HashMap<>();

    // Utilities of building like solar,waste disposal plant, watertank, rain water harvesting etc
    private Utility utility = new Utility();

    // coverage Overall Coverage of all the block. Total area of all the floor/plot area.
    private BigDecimal coverage = BigDecimal.ZERO;

    // Calculated Permissible FSI and provided FSI details
    private FarDetails farDetails;

    // Drawing standard parameters required to process dxf file.
    private DrawingPreference drawingPreference = new DrawingPreference();

    @Transient
    private Double parkingRequired;
    // Septic tanks defined in the plan
    private transient List<SepticTank> septicTanks = new ArrayList<>();
    // Trees and plant defined in the plan
    private transient Plantation plantation;
    // Guard room details
    private transient GuardRoom guardRoom;
    // Segregated toilet facilities for visitors in Public Buildings (within the premises of the building, but outside the
    // building block)
    private transient SegregatedToilet segregatedToilet;
    // Roads which are surrendered by citizen
    private transient List<Measurement> surrenderRoads = new ArrayList<>();
    // For proposed road widening, surrendered road area.This area will be used to calculate FAR,setback and permissible buildup
    // area.
    private transient BigDecimal totalSurrenderRoadArea = BigDecimal.ZERO;
    // Distance of plot with external entities like rive, lake, monuments, government building etc are grouped.
    private DistanceToExternalEntity distanceToExternalEntity = new DistanceToExternalEntity();
    // Plot all sides compound wall and their railing heights
    private CompoundWall compoundWall;

    // Roads reserved by government for road widening purpose
    private transient List<Road> roadReserves = new ArrayList<>();

    @Transient
    @JsonIgnore
    public StringBuffer additionsToDxf = new StringBuffer();
    @Transient
    private String dxfFileName;

    private List<EdcrPdfDetail> edcrPdfDetails;

    @Transient
    private Boolean strictlyValidateDimension = false;
    
    @Transient
    private Boolean strictlyValidateBldgHeightDimension = false;

    private Gate gate;

    // Used to show drawing mistakes, General errors, mistakes in following layer/color coding standard etc
    private transient Map<String, String> errors = new LinkedHashMap<>();
    /**
     * The report output object. Based on type of building and occupancies,the rules are validated and rules which are considered
     * for the submitted plan are recorded in this object.
     */
    private ReportOutput reportOutput = new ReportOutput();
    // System will evaluate the list of noc's required based on the plan input
    private transient Map<String, String> noObjectionCertificates = new HashMap<>();
    private List<String> nocDeptCodes = new ArrayList<String>();
    private HashMap<String, String> featureAmendments = new LinkedHashMap<>();
    private transient Map<String, List<Object>> mdmsMasterData;
    private transient Boolean mainDcrPassed = false;
    private List<ICT> icts = new ArrayList<>();

    public List<BigDecimal> getCanopyDistanceFromPlotBoundary() {
        return canopyDistanceFromPlotBoundary;
    }

    public void setCanopyDistanceFromPlotBoundary(List<BigDecimal> canopyDistanceFromPlotBoundary) {
        this.canopyDistanceFromPlotBoundary = canopyDistanceFromPlotBoundary;
    }

    public List<BigDecimal> getTravelDistancesToExit() {
        return travelDistancesToExit;
    }

    public void setTravelDistancesToExit(List<BigDecimal> travelDistancesToExit) {
        this.travelDistancesToExit = travelDistancesToExit;
    }

    private List<BigDecimal> depthCuttings = new ArrayList<>();

    public List<BigDecimal> getDepthCuttings() {
        return depthCuttings;
    }

    public void setDepthCuttings(List<BigDecimal> depthCuttings) {
        this.depthCuttings = depthCuttings;
    }

    public List<AccessoryBlock> getAccessoryBlocks() {
        return accessoryBlocks;
    }

    public void setAccessoryBlocks(List<AccessoryBlock> accessoryBlocks) {
        this.accessoryBlocks = accessoryBlocks;
    }

    public List<BigDecimal> getAccessoryBlockDistances() {
        return accessoryBlockDistances;
    }

    public void setAccessoryBlockDistances(List<BigDecimal> accessoryBlockDistances) {
        this.accessoryBlockDistances = accessoryBlockDistances;
    }

    public List<Occupancy> getOccupancies() {
        return occupancies;
    }

    public void setOccupancies(List<Occupancy> occupancies) {
        this.occupancies = occupancies;
    }

    public List<Block> getBlocks() {
        return blocks;
    }

    public void setBlocks(List<Block> blocks) {
        this.blocks = blocks;
    }

    public Block getBlockByName(String blockName) {
        for (Block block : getBlocks()) {
            if (block.getName().equalsIgnoreCase(blockName))
                return block;
        }
        return null;
    }

    public Map<String, String> getNoObjectionCertificates() {
        return noObjectionCertificates;
    }

    public void setNoObjectionCertificates(Map<String, String> noObjectionCertificates) {
        this.noObjectionCertificates = noObjectionCertificates;
    }

    public List<CulDeSacRoad> getCuldeSacRoads() {
        return culdeSacRoads;
    }

    public void setCuldeSacRoads(List<CulDeSacRoad> culdeSacRoads) {
        this.culdeSacRoads = culdeSacRoads;
    }

    public List<Lane> getLaneRoads() {
        return laneRoads;
    }

    public void setLaneRoads(List<Lane> laneRoads) {
        this.laneRoads = laneRoads;
    }

    public List<ElectricLine> getElectricLine() {
        return electricLine;
    }

    public void setElectricLine(List<ElectricLine> electricLine) {
        this.electricLine = electricLine;
    }

    public Boolean getEdcrPassed() {
        return edcrPassed;
    }

    public void setEdcrPassed(Boolean edcrPassed) {
        this.edcrPassed = edcrPassed;
    }

    public Date getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(Date applicationDate) {
        this.applicationDate = applicationDate;
    }

    public List<NonNotifiedRoad> getNonNotifiedRoads() {
        return nonNotifiedRoads;
    }

    public void setNonNotifiedRoads(List<NonNotifiedRoad> nonNotifiedRoads) {
        this.nonNotifiedRoads = nonNotifiedRoads;
    }

    public List<NotifiedRoad> getNotifiedRoads() {
        return notifiedRoads;
    }

    public void setNotifiedRoads(List<NotifiedRoad> notifiedRoads) {
        this.notifiedRoads = notifiedRoads;
    }

    public void addErrors(Map<String, String> errors) {
        if (errors != null)
            getErrors().putAll(errors);
    }

    public void addNocs(Map<String, String> nocs) {
        if (noObjectionCertificates != null)
            getNoObjectionCertificates().putAll(nocs);
    }

    public void addNoc(String key, String value) {

        if (noObjectionCertificates != null)
            getNoObjectionCertificates().put(key, value);
    }

    public void addError(String key, String value) {

        if (errors != null)
            getErrors().put(key, value);
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    public PlanInformation getPlanInformation() {
        return planInformation;
    }

    public void setPlanInformation(PlanInformation planInformation) {
        this.planInformation = planInformation;
    }

    public Plot getPlot() {
        return plot;
    }

    public void setPlot(Plot plot) {
        this.plot = plot;
    }

    public VirtualBuilding getVirtualBuilding() {
        return virtualBuilding;
    }

    public void setVirtualBuilding(VirtualBuilding virtualBuilding) {
        this.virtualBuilding = virtualBuilding;
    }

    public Utility getUtility() {
        return utility;
    }

    public void setUtility(Utility utility) {
        this.utility = utility;
    }

    public BigDecimal getCoverage() {
        return coverage;
    }

    public void setCoverage(BigDecimal coverage) {
        this.coverage = coverage;
    }

    public void sortBlockByName() {
        if (!blocks.isEmpty())
            Collections.sort(blocks, Comparator.comparing(Block::getNumber));
    }

    public void sortSetBacksByLevel() {
        for (Block block : blocks)
            Collections.sort(block.getSetBacks(), Comparator.comparing(SetBack::getLevel));
    }

    public ParkingDetails getParkingDetails() {
        return parkingDetails;
    }

    public void setParkingDetails(ParkingDetails parkingDetails) {
        this.parkingDetails = parkingDetails;
    }

    public Map<Integer, org.egov.common.entity.bpa.Occupancy> getOccupanciesMaster() {
        return occupanciesMaster;
    }

    public void setOccupanciesMaster(Map<Integer, org.egov.common.entity.bpa.Occupancy> occupanciesMaster) {
        this.occupanciesMaster = occupanciesMaster;
    }

    public Map<Integer, SubOccupancy> getSubOccupanciesMaster() {
        return subOccupanciesMaster;
    }

    public void setSubOccupanciesMaster(Map<Integer, SubOccupancy> subOccupanciesMaster) {
        this.subOccupanciesMaster = subOccupanciesMaster;
    }

    public Map<Integer, Usage> getUsagesMaster() {
        return usagesMaster;
    }

    public void setUsagesMaster(Map<Integer, Usage> usagesMaster) {
        this.usagesMaster = usagesMaster;
    }

    public Map<String, Map<String, Integer>> getSubFeatureColorCodesMaster() {
        return subFeatureColorCodesMaster;
    }

    public void setSubFeatureColorCodesMaster(Map<String, Map<String, Integer>> subFeatureColorCodesMaster) {
        this.subFeatureColorCodesMaster = subFeatureColorCodesMaster;
    }

    public StringBuffer getAdditionsToDxf() {
        return additionsToDxf;
    }

    public void addToAdditionsToDxf(String s) {
        additionsToDxf.append(s);
    }

    public void setAdditionsToDxf(StringBuffer additionsToDxf) {
        this.additionsToDxf = additionsToDxf;
    }

    public String getDxfFileName() {
        return dxfFileName;
    }

    public void setDxfFileName(String dxfFileName) {
        this.dxfFileName = dxfFileName;
    }

    public List<EdcrPdfDetail> getEdcrPdfDetails() {
        return edcrPdfDetails;
    }

    public void setEdcrPdfDetails(List<EdcrPdfDetail> edcrPdfDetails) {
        this.edcrPdfDetails = edcrPdfDetails;
    }

    public ReportOutput getReportOutput() {
        return reportOutput;
    }

    public void setReportOutput(ReportOutput reportOutput) {
        this.reportOutput = reportOutput;
    }

    public List<SepticTank> getSepticTanks() {
        return septicTanks;
    }

    public void setSepticTanks(List<SepticTank> septicTanks) {
        this.septicTanks = septicTanks;
    }

    public Plantation getPlantation() {
        return plantation;
    }

    public void setPlantation(Plantation plantation) {
        this.plantation = plantation;
    }

    public GuardRoom getGuardRoom() {
        return guardRoom;
    }

    public void setGuardRoom(GuardRoom guardRoom) {
        this.guardRoom = guardRoom;
    }

    public SegregatedToilet getSegregatedToilet() {
        return segregatedToilet;
    }

    public void setSegregatedToilet(SegregatedToilet segregatedToilet) {
        this.segregatedToilet = segregatedToilet;
    }

    public FarDetails getFarDetails() {
        return farDetails;
    }

    public void setFarDetails(FarDetails farDetails) {
        this.farDetails = farDetails;
    }

    public DrawingPreference getDrawingPreference() {
        return drawingPreference;
    }

    public void setDrawingPreference(DrawingPreference drawingPreference) {
        this.drawingPreference = drawingPreference;
    }

    public List<Measurement> getSurrenderRoads() {
        return surrenderRoads;
    }

    public void setSurrenderRoads(List<Measurement> surrenderRoads) {
        this.surrenderRoads = surrenderRoads;
    }

    public BigDecimal getTotalSurrenderRoadArea() {
        return totalSurrenderRoadArea;
    }

    public void setTotalSurrenderRoadArea(BigDecimal surrenderRoadArea) {
        this.totalSurrenderRoadArea = surrenderRoadArea;
    }

    public DistanceToExternalEntity getDistanceToExternalEntity() {
        return distanceToExternalEntity;
    }

    public void setDistanceToExternalEntity(DistanceToExternalEntity distanceToExternalEntity) {
        this.distanceToExternalEntity = distanceToExternalEntity;
    }

    public void setCompoundWall(CompoundWall compoundWall) {
        this.compoundWall = compoundWall;
    }

    public CompoundWall getCompoundWall() {
        return compoundWall;
    }

    public List<Road> getRoadReserves() {
        return roadReserves;
    }

    public void setRoadReserves(List<Road> roadReserves) {
        this.roadReserves = roadReserves;
    }

    public Map<String, String> getPlanInfoProperties() {
        return planInfoProperties;
    }

    public void setPlanInfoProperties(Map<String, String> planInfoProperties) {
        this.planInfoProperties = planInfoProperties;
    }

    public Gate getGate() {
        return gate;
    }

    public void setGate(Gate gate) {
        this.gate = gate;
    }

    public Date getAsOnDate() {
        return asOnDate;
    }

    public void setAsOnDate(Date asOnDate) {
        this.asOnDate = asOnDate;
    }

    public Boolean getStrictlyValidateDimension() {
        return strictlyValidateDimension;
    }

    public void setStrictlyValidateDimension(Boolean strictlyValidateDimension) {
        this.strictlyValidateDimension = strictlyValidateDimension;
    }

    public Boolean getStrictlyValidateBldgHeightDimension() {
        return strictlyValidateBldgHeightDimension;
    }

    public void setStrictlyValidateBldgHeightDimension(Boolean strictlyValidateBldgHeightDimension) {
        this.strictlyValidateBldgHeightDimension = strictlyValidateBldgHeightDimension;
    }

    public HashMap<String, String> getFeatureAmendments() {
        return featureAmendments;
    }

    public void setFeatureAmendments(HashMap<String, String> featureAmendments) {
        this.featureAmendments = featureAmendments;
    }

    public Map<String, List<Object>> getMdmsMasterData() {
        return mdmsMasterData;
    }

    public void setMdmsMasterData(Map<String, List<Object>> mdmsMasterData) {
        this.mdmsMasterData = mdmsMasterData;
    }

    public Boolean getMainDcrPassed() {
        return mainDcrPassed;
    }

    public void setMainDcrPassed(Boolean mainDcrPassed) {
        this.mainDcrPassed = mainDcrPassed;
    }

    public List<ICT> getIcts() {
        return icts;
    }

    public void setIcts(List<ICT> icts) {
        this.icts = icts;
    }

}
