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
import java.util.stream.Collectors;

public class Floor extends Measurement {

    private static final long serialVersionUID = 26L;

    private List<Occupancy> occupancies = new ArrayList<>();
    private List<Occupancy> convertedOccupancies = new ArrayList<>();
    private List<FloorUnit> units = new ArrayList<>();
    private List<DARoom> daRooms = new ArrayList<>();
    private List<Ramp> ramps = new ArrayList<>();
    private List<VehicleRamp> vehicleRamps = new ArrayList<>();
    private List<Lift> lifts = new ArrayList<>();
    private List<Lift> daLifts = new ArrayList<>();
    private Measurement exterior;
    // private List<Measurement> openSpaces = new ArrayList<>();
    // this is for differently able people
    private List<Measurement> specialWaterClosets = new ArrayList<>();
    private List<Measurement> coverageDeduct = new ArrayList<>();
    private String name;
    private Integer number;
    private List<BigDecimal> exitWidthDoor = new ArrayList<>();
    private List<BigDecimal> exitWidthStair = new ArrayList<>();
    private List<MezzanineFloor> mezzanineFloor = new ArrayList<>();
    private List<Hall> halls = new ArrayList<>();
    private List<FireStair> fireStairs = new ArrayList<>();
    private List<GeneralStair> generalStairs = new ArrayList<>();
    private List<SpiralStair> spiralStairs = new ArrayList<>();
    private ParkingDetails parking = new ParkingDetails();
    private List<BigDecimal> floorHeights;
    private List<Room> acRooms = new ArrayList<>();
    private List<Room> regularRooms = new ArrayList<>();
    private Room kitchen;
    private Room bathRoom;
    private Room waterClosets;
    private Room bathRoomWaterClosets;
    private List<BigDecimal> heightFromTheFloorToCeiling;
    private List<BigDecimal> heightOfTheCeilingOfUpperBasement;
    private List<BigDecimal> levelOfBasementUnderGround;
    private InteriorOpenSpace interiorOpenSpace = new InteriorOpenSpace();
    private MeasurementWithHeight verandah = new MeasurementWithHeight();
    private MeasurementWithHeight lightAndVentilation = new MeasurementWithHeight();
    private List<RoofArea> roofAreas = new ArrayList<>();

    private List<Balcony> balconies = new ArrayList<>();

    private List<Measurement> overHangs;

    private List<Measurement> constructedAreas = new ArrayList<>();

    private List<GlassFacadeOpening> glassFacadeOpenings = new ArrayList<>();
    // Doors for version 1.1.1
    private List<Door> doors = new ArrayList<>();

    // From 2.0.0 version
    private List<BigDecimal> heightFromFloorToBottomOfBeam;

    public List<FireStair> getFireStairs() {
        return fireStairs;
    }

    public void setFireStairs(List<FireStair> fireStairs) {
        this.fireStairs = fireStairs;
    }

    public List<GeneralStair> getGeneralStairs() {
        return generalStairs;
    }

    public void setGeneralStairs(List<GeneralStair> generalStairs) {
        this.generalStairs = generalStairs;
    }

    public List<SpiralStair> getSpiralStairs() {
        return spiralStairs;
    }

    public void setSpiralStairs(List<SpiralStair> spiralStairs) {
        this.spiralStairs = spiralStairs;
    }

    private List<Measurement> washBasins = new ArrayList<>();
    private Boolean terrace = false;

    public void setExitWidthStair(List<BigDecimal> exitWidthStair) {
        this.exitWidthStair = exitWidthStair;
    }

    public List<Occupancy> getConvertedOccupancies() {
        return convertedOccupancies;
    }

    public List<MezzanineFloor> getMezzanineFloor() {
        return mezzanineFloor;
    }

    public List<Hall> getHalls() {
        return halls;
    }

    public void setConvertedOccupancies(List<Occupancy> convertedOccupancies) {
        this.convertedOccupancies = convertedOccupancies;
    }

    public List<Lift> getLifts() {
        return lifts;
    }

    public void setLifts(List<Lift> lifts) {
        this.lifts = lifts;
    }

    public void addLifts(Lift lift) {
        this.lifts.add(lift);
    }

    public void addDaLifts(Lift daLift) {
        this.daLifts.add(daLift);
    }

    public List<Ramp> getRamps() {
        return ramps;
    }

    public void setRamps(List<Ramp> ramps) {
        this.ramps = ramps;
    }

    public List<DARoom> getDaRooms() {
        return daRooms;
    }

    public void setMezzanineFloor(List<MezzanineFloor> mezzanineFloor) {
        this.mezzanineFloor = mezzanineFloor;
    }

    public void setHalls(List<Hall> halls) {
        this.halls = halls;
    }

    public List<BigDecimal> getExitWidthStair() {
        return exitWidthStair;
    }

    public void addBuiltUpArea(Occupancy occupancy) {
        if (occupancies == null) {
            occupancies = new ArrayList<>();
            occupancies.add(occupancy);
        } else if (occupancies.contains(occupancy)) {
            occupancies.get(occupancies.indexOf(occupancy))
                    .setBuiltUpArea((occupancies.get(occupancies.indexOf(occupancy)).getBuiltUpArea() == null
                            ? BigDecimal.ZERO
                            : occupancies.get(occupancies.indexOf(occupancy)).getBuiltUpArea())
                                    .add(occupancy.getBuiltUpArea()));
            occupancies.get(occupancies.indexOf(occupancy)).setExistingBuiltUpArea(
                    (occupancies.get(occupancies.indexOf(occupancy)).getExistingBuiltUpArea() == null ? BigDecimal.ZERO
                            : occupancies.get(occupancies.indexOf(occupancy)).getExistingBuiltUpArea())
                                    .add(occupancy.getExistingBuiltUpArea()));

        } else
            occupancies.add(occupancy);

    }

    public void addCarpetArea(Occupancy occupancy) {
        if (occupancies == null) {
            occupancies = new ArrayList<>();
            occupancies.add(occupancy);
        } else if (occupancies.contains(occupancy)) {
            occupancies.get(occupancies.indexOf(occupancy))
                    .setCarpetArea((occupancies.get(occupancies.indexOf(occupancy)).getCarpetArea() == null
                            ? BigDecimal.ZERO
                            : occupancies.get(occupancies.indexOf(occupancy)).getCarpetArea())
                                    .add(occupancy.getCarpetArea()));

            occupancies.get(occupancies.indexOf(occupancy)).setExistingCarpetArea(
                    (occupancies.get(occupancies.indexOf(occupancy)).getExistingCarpetArea() == null ? BigDecimal.ZERO
                            : occupancies.get(occupancies.indexOf(occupancy)).getExistingCarpetArea())
                                    .add(occupancy.getExistingCarpetArea()));
        } else
            occupancies.add(occupancy);

    }

    public void addDeductionArea(Occupancy occupancy) {
        if (occupancies == null) {
            occupancies = new ArrayList<>();
            occupancies.add(occupancy);
        } else {
            List<Occupancy> collect = occupancies.stream().filter(o -> o.getTypeHelper() != null
                    && (occupancy.getTypeHelper() != null && o.getTypeHelper().getType() != null
                            && o.getTypeHelper().getType().getCode()
                                    .equalsIgnoreCase(occupancy.getTypeHelper().getType().getCode())))
                    .collect(Collectors.toList());
            if (!collect.isEmpty()) {
                collect.get(0)
                        .setDeduction(collect.get(0).getDeduction() == null
                                ? BigDecimal.ZERO
                                : collect.get(0).getDeduction()
                                        .add(occupancy.getDeduction()));
                collect.get(0).setExistingDeduction(
                        (collect.get(0).getExistingDeduction() == null ? BigDecimal.ZERO
                                : collect.get(0).getExistingDeduction())
                                        .add(occupancy.getExistingDeduction()));
            } else
                occupancies.add(occupancy);
        }

    }

    public void addCarpetDeductionArea(Occupancy occupancy) {
        if (occupancies == null) {
            occupancies = new ArrayList<>();
            occupancies.add(occupancy);
        } else {
            List<Occupancy> collect = occupancies.stream().filter(o -> o.getTypeHelper() != null
                    && (o.getTypeHelper().getType().getCode()
                            .equalsIgnoreCase(occupancy.getTypeHelper().getType().getCode())))
                    .collect(Collectors.toList());
            if (!collect.isEmpty()) {
                collect.get(0)
                        .setCarpetAreaDeduction(collect.get(0).getCarpetAreaDeduction() == null
                                ? BigDecimal.ZERO
                                : collect.get(0).getCarpetAreaDeduction()
                                        .add(occupancy.getCarpetAreaDeduction()));
                collect.get(0).setExistingCarpetAreaDeduction(
                        (collect.get(0).getExistingCarpetAreaDeduction() == null ? BigDecimal.ZERO
                                : collect.get(0).getExistingCarpetAreaDeduction())
                                        .add(occupancy.getExistingCarpetAreaDeduction()));
            } else
                occupancies.add(occupancy);
        }

    }

    public List<Occupancy> getOccupancies() {
        return occupancies;
    }

    public void setOccupancies(List<Occupancy> occupancies) {
        this.occupancies = occupancies;
    }

    public List<FloorUnit> getUnits() {
        return units;
    }

    public void setUnits(List<FloorUnit> units) {
        this.units = units;
    }

    public void setExitWidthDoor(List<BigDecimal> exitWidthDoor) {
        this.exitWidthDoor = exitWidthDoor;
    }

    public List<BigDecimal> getExitWidthDoor() {
        return exitWidthDoor;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Measurement getExterior() {
        return exterior;
    }

    public void setExterior(Measurement exterior) {
        this.exterior = exterior;
    }

    /*
     * public List<Measurement> getOpenSpaces() { return openSpaces; } public void setOpenSpaces(List<Measurement> openSpaces) {
     * this.openSpaces = openSpaces; }
     */

    @Override
    public String toString() {

        return "Floor :" + number + " [\n exterior=" + exterior + "" + "]";

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {

        return super.clone();

    }

    public List<Measurement> getCoverageDeduct() {
        return coverageDeduct;
    }

    public void setCoverageDeduct(List<Measurement> coverageDeduct) {
        this.coverageDeduct = coverageDeduct;
    }

    public List<Measurement> getSpecialWaterClosets() {
        return specialWaterClosets;
    }

    public void setSpecialWaterClosets(List<Measurement> specialWaterClosets) {
        this.specialWaterClosets = specialWaterClosets;
    }

    public void addDaRoom(DARoom daRoom) {
        this.daRooms.add(daRoom);
    }

    public void addRamps(Ramp ramp) {
        this.ramps.add(ramp);
    }

    public void setDaRooms(List<DARoom> daRooms) {
        this.daRooms = daRooms;
    }

    public void addFireStair(FireStair fireStair) {
        this.fireStairs.add(fireStair);
    }

    public void addFireStair(GeneralStair generalStair) {
        this.generalStairs.add(generalStair);
    }

    public void addFireStair(SpiralStair spiralStair) {
        this.spiralStairs.add(spiralStair);
    }

    public List<BigDecimal> getFloorHeights() {
        return floorHeights;
    }

    public void setFloorHeights(List<BigDecimal> floorHeights) {
        this.floorHeights = floorHeights;
    }

    public void addGeneralStair(GeneralStair generalStair) {
        this.generalStairs.add(generalStair);
    }

    public List<Measurement> getWashBasins() {
        return washBasins;
    }

    public void setWashBasins(List<Measurement> washBasins) {
        this.washBasins = washBasins;
    }

    public Boolean getTerrace() {
        return terrace;
    }

    public void setTerrace(Boolean terrace) {
        this.terrace = terrace;
    }

    public ParkingDetails getParking() {
        return parking;
    }

    public void setParking(ParkingDetails parking) {
        this.parking = parking;
    }

    /**
     * @return the acRooms
     */
    public List<Room> getAcRooms() {
        return acRooms;
    }

    public void addAcRoom(Room acRoom) {
        this.acRooms.add(acRoom);
    }

    /**
     * @param acRooms the acRooms to set
     */
    public void setAcRooms(List<Room> acRooms) {
        this.acRooms = acRooms;
    }

    /**
     * @return the regularRooms
     */
    public List<Room> getRegularRooms() {
        return regularRooms;
    }

    public void addRegularRoom(Room regularRoom) {
        this.regularRooms.add(regularRoom);
    }

    /**
     * @param regularRooms the regularRooms to set
     */
    public void setRegularRooms(List<Room> regularRooms) {
        this.regularRooms = regularRooms;
    }

    public Room getKitchen() {
        return kitchen;
    }

    public void setKitchen(Room kitchen) {
        this.kitchen = kitchen;
    }

    public Room getBathRoom() {
        return bathRoom;
    }

    public void setBathRoom(Room bathRoom) {
        this.bathRoom = bathRoom;
    }

    public Room getWaterClosets() {
        return waterClosets;
    }

    public void setWaterClosets(Room waterClosets) {
        this.waterClosets = waterClosets;
    }

    public Room getBathRoomWaterClosets() {
        return bathRoomWaterClosets;
    }

    public void setBathRoomWaterClosets(Room bathRoomWaterClosets) {
        this.bathRoomWaterClosets = bathRoomWaterClosets;
    }

    public List<Lift> getDaLifts() {
        return daLifts;
    }

    public void setDaLifts(List<Lift> daLifts) {
        this.daLifts = daLifts;
    }

    public List<BigDecimal> getHeightFromTheFloorToCeiling() {
        return heightFromTheFloorToCeiling;
    }

    public void setHeightFromTheFloorToCeiling(List<BigDecimal> heightFromTheFloorToCeiling) {
        this.heightFromTheFloorToCeiling = heightFromTheFloorToCeiling;
    }

    public List<BigDecimal> getHeightOfTheCeilingOfUpperBasement() {
        return heightOfTheCeilingOfUpperBasement;
    }

    public void setHeightOfTheCeilingOfUpperBasement(List<BigDecimal> heightOfTheCeilingOfUpperBasement) {
        this.heightOfTheCeilingOfUpperBasement = heightOfTheCeilingOfUpperBasement;
    }

    public List<BigDecimal> getLevelOfBasementUnderGround() {
        return levelOfBasementUnderGround;
    }

    public void setLevelOfBasementUnderGround(List<BigDecimal> levelOfBasementUnderGround) {
        this.levelOfBasementUnderGround = levelOfBasementUnderGround;
    }

    public List<VehicleRamp> getVehicleRamps() {
        return vehicleRamps;
    }

    public void setVehicleRamps(List<VehicleRamp> vehicleRamps) {
        this.vehicleRamps = vehicleRamps;
    }

    public void addVehicleRamps(VehicleRamp vehicleRamp) {
        this.vehicleRamps.add(vehicleRamp);
    }

    public List<Balcony> getBalconies() {
        return balconies;
    }

    public void setBalconies(List<Balcony> balconies) {
        this.balconies = balconies;
    }

    public List<Measurement> getOverHangs() {
        return overHangs;
    }

    public void setOverHangs(List<Measurement> overHangs) {
        this.overHangs = overHangs;
    }

    public InteriorOpenSpace getInteriorOpenSpace() {
        return interiorOpenSpace;
    }

    public void setInteriorOpenSpace(InteriorOpenSpace interiorOpenSpace) {
        this.interiorOpenSpace = interiorOpenSpace;
    }

    public MeasurementWithHeight getVerandah() {
        return verandah;
    }

    public void setVerandah(MeasurementWithHeight verandah) {
        this.verandah = verandah;
    }

    public MeasurementWithHeight getLightAndVentilation() {
        return lightAndVentilation;
    }

    public void setLightAndVentilation(MeasurementWithHeight lightAndVentilation) {
        this.lightAndVentilation = lightAndVentilation;
    }

    public List<RoofArea> getRoofAreas() {
        return roofAreas;
    }

    public void setRoofAreas(List<RoofArea> roofAreas) {
        this.roofAreas = roofAreas;
    }

    public List<Measurement> getConstructedAreas() {
        return constructedAreas;
    }

    public void setConstructedAreas(List<Measurement> constructedAreas) {
        this.constructedAreas = constructedAreas;
    }

    public List<GlassFacadeOpening> getGlassFacadeOpenings() {
        return glassFacadeOpenings;
    }

    public void setGlassFacadeOpenings(List<GlassFacadeOpening> glassFacadeOpenings) {
        this.glassFacadeOpenings = glassFacadeOpenings;
    }

    public List<Door> getDoors() {
        return doors;
    }

    public void setDoors(List<Door> doors) {
        this.doors = doors;
    }

    public List<BigDecimal> getHeightFromFloorToBottomOfBeam() {
        return heightFromFloorToBottomOfBeam;
    }

    public void setHeightFromFloorToBottomOfBeam(List<BigDecimal> heightFromFloorToBottomOfBeam) {
        this.heightFromFloorToBottomOfBeam = heightFromFloorToBottomOfBeam;
    }

}
