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

package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Flight;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.OccupancyTypeHelper;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.Result;
import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.common.entity.edcr.StairLanding;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class FireStair extends FeatureProcess {
    private static final Logger LOG = LogManager.getLogger(FireStair.class);
    private static final String FLOOR = "Floor";
    private static final String RULE42_5_II = "42-5-iii-f";
    private static final String EXPECTED_NO_OF_RISE = "12";
    private static final String NO_OF_RISER_DESCRIPTION = "Maximum no of risers required per flight for fire stair %s flight %s";
    private static final String WIDTH_DESCRIPTION = "Minimum width for fire stair %s flight %s";
    private static final String TREAD_DESCRIPTION = "Minimum tread for fire stair %s flight %s";
    private static final String NO_OF_RISERS = "Number of risers ";
    private static final String FLIGHT_POLYLINE_NOT_DEFINED_DESCRIPTION = "Flight polyline is not defined in layer ";
    private static final String FLIGHT_LENGTH_DEFINED_DESCRIPTION = "Flight polyline length is not defined in layer ";
    private static final String FLIGHT_WIDTH_DEFINED_DESCRIPTION = "Flight polyline width is not defined in layer ";
    private static final String WIDTH_LANDING_DESCRIPTION = "Minimum width for fire stair %s mid landing %s";
    private static final String FLIGHT_NOT_DEFINED_DESCRIPTION = "Fire stair flight is not defined in block %s floor %s";

    @Override
    public Plan validate(Plan plan) {
        return plan;
    }

    @Override
    public Plan process(Plan plan) {
        // validate(planDetail);
        HashMap<String, String> errors = new HashMap<>();
        blk: for (Block block : plan.getBlocks()) {
            int fireStairCount = 0;
            if (block.getBuilding() != null) {
                /*
                 * if (Util.checkExemptionConditionForBuildingParts(block) ||
                 * Util.checkExemptionConditionForSmallPlotAtBlkLevel(planDetail .getPlot(), block)) { continue blk; }
                 */
                ScrutinyDetail scrutinyDetail2 = new ScrutinyDetail();
                scrutinyDetail2.addColumnHeading(1, RULE_NO);
                scrutinyDetail2.addColumnHeading(2, FLOOR);
                scrutinyDetail2.addColumnHeading(3, DESCRIPTION);
                scrutinyDetail2.addColumnHeading(4, PERMISSIBLE);
                scrutinyDetail2.addColumnHeading(5, PROVIDED);
                scrutinyDetail2.addColumnHeading(6, STATUS);
                scrutinyDetail2.setKey("Block_" + block.getNumber() + "_" + "Fire Stair - Width");

                ScrutinyDetail scrutinyDetail3 = new ScrutinyDetail();
                scrutinyDetail3.addColumnHeading(1, RULE_NO);
                scrutinyDetail3.addColumnHeading(2, FLOOR);
                scrutinyDetail3.addColumnHeading(3, DESCRIPTION);
                scrutinyDetail3.addColumnHeading(4, PERMISSIBLE);
                scrutinyDetail3.addColumnHeading(5, PROVIDED);
                scrutinyDetail3.addColumnHeading(6, STATUS);
                scrutinyDetail3.setKey("Block_" + block.getNumber() + "_" + "Fire Stair - Tread width");

                ScrutinyDetail scrutinyDetailRise = new ScrutinyDetail();
                scrutinyDetailRise.addColumnHeading(1, RULE_NO);
                scrutinyDetailRise.addColumnHeading(2, FLOOR);
                scrutinyDetailRise.addColumnHeading(3, DESCRIPTION);
                scrutinyDetailRise.addColumnHeading(4, PERMISSIBLE);
                scrutinyDetailRise.addColumnHeading(5, PROVIDED);
                scrutinyDetailRise.addColumnHeading(6, STATUS);
                scrutinyDetailRise.setKey("Block_" + block.getNumber() + "_" + "Fire Stair - Number of risers");

                ScrutinyDetail scrutinyDetailLanding = new ScrutinyDetail();
                scrutinyDetailLanding.addColumnHeading(1, RULE_NO);
                scrutinyDetailLanding.addColumnHeading(2, FLOOR);
                scrutinyDetailLanding.addColumnHeading(3, DESCRIPTION);
                scrutinyDetailLanding.addColumnHeading(4, PERMISSIBLE);
                scrutinyDetailLanding.addColumnHeading(5, PROVIDED);
                scrutinyDetailLanding.addColumnHeading(6, STATUS);
                scrutinyDetailLanding.setKey("Block_" + block.getNumber() + "_" + "Fire Stair - Mid landing");

                ScrutinyDetail scrutinyDetailAbutBltUp = new ScrutinyDetail();
                scrutinyDetailAbutBltUp.addColumnHeading(1, RULE_NO);
                scrutinyDetailAbutBltUp.addColumnHeading(2, FLOOR);
                scrutinyDetailAbutBltUp.addColumnHeading(3, DESCRIPTION);
                scrutinyDetailAbutBltUp.addColumnHeading(4, PROVIDED);
                scrutinyDetailAbutBltUp.addColumnHeading(5, STATUS);
                scrutinyDetailAbutBltUp.setKey("Block_" + block.getNumber() + "_" + "Fire Stair - Abutting External Wall");

                // int spiralStairCount = 0;
                OccupancyTypeHelper mostRestrictiveOccupancyType = plan.getVirtualBuilding() != null ? plan.getVirtualBuilding().getMostRestrictiveFarHelper(): null ;
                /*
                 * String occupancyType = mostRestrictiveOccupancy != null ? mostRestrictiveOccupancy.getOccupancyType() : null;
                 */

                List<Floor> floors = block.getBuilding().getFloors();
                // BigDecimal floorSize =
                // block.getBuilding().getFloorsAboveGround();
                List<String> fireStairAbsent = new ArrayList<>();
                for (Floor floor : floors) {
                    if (!floor.getTerrace()) {
                        boolean isTypicalRepititiveFloor = false;
                        Map<String, Object> typicalFloorValues = Util.getTypicalFloorValues(block, floor,
                                isTypicalRepititiveFloor);

                        List<org.egov.common.entity.edcr.FireStair> fireStairs = floor.getFireStairs();
                        fireStairCount = fireStairCount + fireStairs.size();
                        // spiralStairCount = spiralStairCount +
                        // floor.getSpiralStairs().size();
                        if (!fireStairs.isEmpty()) {
                            for (org.egov.common.entity.edcr.FireStair fireStair : fireStairs) {
                                setReportOutputDetailsBltUp(plan, RULE42_5_II, floor.getNumber().toString(),
                                        "Fire stair should abut floor external wall",
                                        fireStair.isAbuttingBltUp() ? "Is abuting external wall" : "Not abuting external wall",
                                        fireStair.isAbuttingBltUp() ? Result.Accepted.getResultVal()
                                                : Result.Not_Accepted.getResultVal(),
                                        scrutinyDetailAbutBltUp);

                                validateFlight(plan, errors, block, scrutinyDetail2, scrutinyDetail3,
                                        scrutinyDetailRise, mostRestrictiveOccupancyType, floor, typicalFloorValues,
                                        fireStair);

                                List<StairLanding> landings = fireStair.getLandings();
                                if (!landings.isEmpty()) {
                                    validateLanding(plan,  block, scrutinyDetailLanding, floor, typicalFloorValues,
                                            fireStair, landings, errors);
                                } else {
                                    errors.put(
                                            "Fire Stair landing not defined in blk " + block.getNumber() + " floor "
                                                    + floor.getNumber() + " fire stair " + fireStair.getNumber(),
                                            "Fire Stair landing not defined in blk " + block.getNumber() + " floor "
                                                    + floor.getNumber() + " fire stair " + fireStair.getNumber());
                                    plan.addErrors(errors);
                                }
                            }
                        } else {
                            if (block.getBuilding().getIsHighRise()) {
                                fireStairAbsent.add("Block " + block.getNumber() + " floor " + floor.getNumber());
                            }
                        }

                    }
                }

                if (!fireStairAbsent.isEmpty()) {
                    for (String error : fireStairAbsent) {
                        errors.put("Fire Stair " + error, "Fire stair not defined in " + error);
                        plan.addErrors(errors);
                    }
                }

                if (block.getBuilding().getIsHighRise() && fireStairCount == 0) {
                    errors.put("FireStair not defined in blk " + block.getNumber(), "FireStair not defined in block "
                            + block.getNumber() + ", it is mandatory for building with height more than 15m.");
                    plan.addErrors(errors);
                }

                /*
                 * boolean isAbuting = abutingList.stream().anyMatch(aBoolean -> aBoolean == true); if (occupancyType != null) {
                 * if (occupancyType.equalsIgnoreCase("RESIDENTIAL") && floorSize.compareTo(BigDecimal.valueOf(3)) > 0) { if
                 * (fireStairCount > 0) { setReportOutputDetails(planDetail, RULE42, String.format(DcrConstants.RULE114,
                 * block.getNumber()), "", DcrConstants.OBJECTDEFINED_DESC, Result.Accepted.getResultVal(), scrutinyDetail4); }
                 * else { if (spiralStairCount == 0) setReportOutputDetails(planDetail, RULE42,
                 * String.format(DcrConstants.RULE114, block.getNumber()), "Minimum 1 fire stair is required",
                 * DcrConstants.OBJECTNOTDEFINED_DESC, Result.Not_Accepted.getResultVal(), scrutinyDetail4); } } else { if
                 * (floorSize.compareTo(BigDecimal.valueOf(2)) > 0) { if (fireStairCount > 0) { setReportOutputDetails(planDetail,
                 * RULE42, String.format(DcrConstants.RULE114, block.getNumber()), "", DcrConstants.OBJECTDEFINED_DESC,
                 * Result.Accepted.getResultVal(), scrutinyDetail4); } else { if (spiralStairCount == 0)
                 * setReportOutputDetails(planDetail, RULE42, String.format(DcrConstants.RULE114, block.getNumber()), "",
                 * DcrConstants.OBJECTNOTDEFINED_DESC, Result.Not_Accepted.getResultVal(), scrutinyDetail4); } } } }
                 */

                /*
                 * if (fireStairCount > 0) { if (isAbuting) { setReportOutputDetails(planDetail, RULE114,
                 * String.format(DcrConstants.RULE114, block.getNumber()), "should abut built up area",
                 * "is abutting built up area", Result.Accepted.getResultVal(), scrutinyDetail7); } else {
                 * setReportOutputDetails(planDetail, RULE114, String.format(DcrConstants.RULE114, block.getNumber()),
                 * "should abut built up area", "is not abutting built up area", Result.Not_Accepted.getResultVal(),
                 * scrutinyDetail7); } }
                 */
            }
        }

        return plan;
    }

    private void validateLanding(Plan plan, Block block, ScrutinyDetail scrutinyDetailLanding, Floor floor,
            Map<String, Object> typicalFloorValues, org.egov.common.entity.edcr.FireStair fireStair,
            List<StairLanding> landings, HashMap<String, String> errors) {
        for (StairLanding landing : landings) {
            List<BigDecimal> widths = landing.getWidths();
            if(!widths.isEmpty()) {
            BigDecimal landingWidth = widths.stream().reduce(BigDecimal::min).get();
            BigDecimal minWidth = BigDecimal.ZERO;
            boolean valid = false;

            if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")) {
                minWidth = Util.roundOffTwoDecimal(landingWidth);
                BigDecimal minimumWidth = BigDecimal.valueOf(1);

                if (minWidth.compareTo(minimumWidth) >= 0) {
                    valid = true;
                }
                String value = typicalFloorValues.get("typicalFloors") != null
                        ? (String) typicalFloorValues.get("typicalFloors")
                        : " floor " + floor.getNumber();

                if (valid) {
                    setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                            String.format(WIDTH_LANDING_DESCRIPTION, fireStair.getNumber(), landing.getNumber()),
                            minimumWidth.toString(), String.valueOf(minWidth), Result.Accepted.getResultVal(),
                            scrutinyDetailLanding);
                } else {
                    setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                            String.format(WIDTH_LANDING_DESCRIPTION, fireStair.getNumber(), landing.getNumber()),
                            minimumWidth.toString(), String.valueOf(minWidth), Result.Not_Accepted.getResultVal(),
                            scrutinyDetailLanding);
                }
            }
            }else {
                errors.put(
                        "Fire Stair landing width not defined in blk " + block.getNumber() + " floor "
                                + floor.getNumber() + " fire stair " + fireStair.getNumber(),
                        "Fire Stair landing width not defined in blk " + block.getNumber() + " floor "
                                + floor.getNumber() + " fire stair " + fireStair.getNumber());
                plan.addErrors(errors);
            }
        }
    }

    private void validateFlight(Plan plan, HashMap<String, String> errors, Block block,
            ScrutinyDetail scrutinyDetail2, ScrutinyDetail scrutinyDetail3, ScrutinyDetail scrutinyDetailRise,
            OccupancyTypeHelper mostRestrictiveOccupancyType, Floor floor, Map<String, Object> typicalFloorValues,
            org.egov.common.entity.edcr.FireStair fireStair) {

        if (!fireStair.getFlights().isEmpty()) {
            for (Flight flight : fireStair.getFlights()) {
                List<Measurement> flightPolyLines = flight.getFlights();
                List<BigDecimal> flightLengths = flight.getLengthOfFlights();
                List<BigDecimal> flightWidths = flight.getWidthOfFlights();
                BigDecimal noOfRises = flight.getNoOfRises();
                Boolean flightPolyLineClosed = flight.getFlightClosed();

                BigDecimal minTread = BigDecimal.ZERO;
                BigDecimal minFlightWidth = BigDecimal.ZERO;
                String flightLayerName = String.format(DxfFileConstants.LAYER_FIRESTAIR_FLIGHT, block.getNumber(),
                        floor.getNumber(), fireStair.getNumber(), flight.getNumber());

                if (!floor.getTerrace()) {
                    if (flightPolyLines != null && flightPolyLines.size() > 0) {
                        if (flightPolyLineClosed) {
                            if (flightWidths != null && flightWidths.size() > 0) {
                                minFlightWidth = validateWidth(plan, scrutinyDetail2, floor, block,
                                        typicalFloorValues, fireStair, flight, flightWidths, minFlightWidth,
                                        mostRestrictiveOccupancyType);

                            } else {
                                errors.put("Flight PolyLine width" + flightLayerName,
                                        FLIGHT_WIDTH_DEFINED_DESCRIPTION + flightLayerName);
                                plan.addErrors(errors);
                            }

                            /*
                             * (Total length of polygons in layer BLK_n_FLR_i_FIRESTAIR_k_FLIGHT) / (Number of rises - number of
                             * polygons in layer BLK_n_FLR_i_FIRESTAIR_k_FLIGHT - number of lines in layer
                             * BLK_n_FLR_i_FIRESTAIR_k_FLIGHT)
                             */

                            if (flightLengths != null && flightLengths.size() > 0) {
                                try {
                                    minTread = validateTread(plan, errors, block, scrutinyDetail3, floor,
                                            typicalFloorValues, fireStair, flight, flightLengths, minTread,
                                            mostRestrictiveOccupancyType);
                                } catch (ArithmeticException e) {
                                    LOG.info("Denominator is zero");
                                }
                            } else {
                                errors.put("Flight PolyLine length" + flightLayerName,
                                        FLIGHT_LENGTH_DEFINED_DESCRIPTION + flightLayerName);
                                plan.addErrors(errors);

                            }

                            if (noOfRises.compareTo(BigDecimal.ZERO) > 0) {
                                try {
                                    validateNoOfRises(plan, errors, block, scrutinyDetailRise, floor,
                                            typicalFloorValues, flight, fireStair, noOfRises);
                                } catch (ArithmeticException e) {
                                    LOG.info("Denominator is zero");
                                }
                            } else {
                                String layerName = String.format(DxfFileConstants.LAYER_FIRESTAIR_FLIGHT, block.getNumber(),
                                        floor.getNumber(), fireStair.getNumber());
                                errors.put("noofRise" + layerName,
                                        edcrMessageSource.getMessage(DcrConstants.OBJECTNOTDEFINED,
                                                new String[] { NO_OF_RISERS + layerName }, LocaleContextHolder.getLocale()));
                                plan.addErrors(errors);
                            }

                        }
                    } else {
                        errors.put("Flight PolyLine " + flightLayerName,
                                FLIGHT_POLYLINE_NOT_DEFINED_DESCRIPTION + flightLayerName);
                        plan.addErrors(errors);
                    }
                }

                /*
                 * List<Line> lines = fireStair.getLinesInFlightLayer(); if (lines != null && lines.size() > 0) { Line line =
                 * lines.stream().min(Comparator.comparing(Line::getLength)).get(); boolean valid = false; if (line != null) {
                 * BigDecimal lineLength = Util.roundOffTwoDecimal(line.getLength()); if (!(Boolean)
                 * typicalFloorValues.get("isTypicalRepititiveFloor")) { BigDecimal minLineLength =
                 * Util.roundOffTwoDecimal(BigDecimal.valueOf(0.75)); if (lineLength.compareTo(minLineLength) >= 0) { valid =
                 * true; } String value = typicalFloorValues.get("typicalFloors") != null ? (String)
                 * typicalFloorValues.get("typicalFloors") : " floor " + floor.getNumber(); if (valid)
                 * setReportOutputDetailsFloorStairWise(planDetail, RULE114, value, String.format(LINE_DESCRIPTION,
                 * fireStair.getNumber()), EXPECTED_LINE, String.valueOf(lineLength), Result.Accepted.getResultVal(),
                 * scrutinyDetail6); else setReportOutputDetailsFloorStairWise(planDetail, RULE114, value,
                 * String.format(LINE_DESCRIPTION, fireStair.getNumber()), EXPECTED_LINE, String.valueOf(lineLength),
                 * Result.Not_Accepted.getResultVal(), scrutinyDetail6); } } }
                 */

                /*
                 * if (minFlightWidth.compareTo(BigDecimal.valueOf(1.2)) >= 0 && minTread.compareTo(BigDecimal.valueOf(0.3)) >= 0
                 * && !floor.getTerrace()) { fireStair.setGeneralStair(true); }
                 */

            }
        } else {
            String error = String.format(FLIGHT_NOT_DEFINED_DESCRIPTION, block.getNumber(), floor.getNumber());
            errors.put(error, error);
            plan.addErrors(errors);
        }
    }

    private BigDecimal validateWidth(Plan plan, ScrutinyDetail scrutinyDetail2, Floor floor, Block block,
            Map<String, Object> typicalFloorValues, org.egov.common.entity.edcr.FireStair fireStair, Flight flight,
            List<BigDecimal> flightWidths, BigDecimal minFlightWidth,
            OccupancyTypeHelper mostRestrictiveOccupancyType) {
        BigDecimal flightPolyLine = flightWidths.stream().reduce(BigDecimal::min).get();

        boolean valid = false;

        if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")) {
            minFlightWidth = Util.roundOffTwoDecimal(flightPolyLine);
            BigDecimal minimumWidth = BigDecimal.valueOf(1);

            if (minFlightWidth.compareTo(minimumWidth) >= 0) {
                valid = true;
            }
            String value = typicalFloorValues.get("typicalFloors") != null
                    ? (String) typicalFloorValues.get("typicalFloors")
                    : " floor " + floor.getNumber();

            if (valid) {
                setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                        String.format(WIDTH_DESCRIPTION, fireStair.getNumber(), flight.getNumber()),
                        minimumWidth.toString(), String.valueOf(minFlightWidth), Result.Accepted.getResultVal(),
                        scrutinyDetail2);
            } else {
                setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                        String.format(WIDTH_DESCRIPTION, fireStair.getNumber(), flight.getNumber()),
                        minimumWidth.toString(), String.valueOf(minFlightWidth), Result.Not_Accepted.getResultVal(),
                        scrutinyDetail2);
            }
        }
        return minFlightWidth;
    }

    /*
     * private BigDecimal getRequiredWidth(Block block, OccupancyTypeHelper mostRestrictiveOccupancyType) { if
     * (mostRestrictiveOccupancyType.getType() != null &&
     * DxfFileConstants.A.equalsIgnoreCase(mostRestrictiveOccupancyType.getType( ).getCode()) &&
     * block.getBuilding().getBuildingHeight().compareTo(BigDecimal.valueOf(10)) <= 0 &&
     * block.getBuilding().getFloorsAboveGround().compareTo(BigDecimal.valueOf(3 )) <= 0) { return BigDecimal.ONE; } else if
     * (mostRestrictiveOccupancyType.getType() != null && DxfFileConstants.A_AF_GH.equalsIgnoreCase(mostRestrictiveOccupancyType.
     * getType().getCode())) { return BigDecimal.valueOf(0.75); } else if (mostRestrictiveOccupancyType.getType() != null &&
     * DxfFileConstants.A.equalsIgnoreCase(mostRestrictiveOccupancyType.getType( ).getCode())) { return BigDecimal.valueOf(1.25);
     * } else if (mostRestrictiveOccupancyType.getType() != null &&
     * DxfFileConstants.B.equalsIgnoreCase(mostRestrictiveOccupancyType.getType( ).getCode())) { return BigDecimal.valueOf(1.5); }
     * else if (mostRestrictiveOccupancyType.getType() != null &&
     * DxfFileConstants.D.equalsIgnoreCase(mostRestrictiveOccupancyType.getType( ).getCode())) { return BigDecimal.valueOf(2); }
     * else { return BigDecimal.valueOf(1.5); } }
     */

    private BigDecimal validateTread(Plan plan, HashMap<String, String> errors, Block block,
            ScrutinyDetail scrutinyDetail3, Floor floor, Map<String, Object> typicalFloorValues,
            org.egov.common.entity.edcr.FireStair fireStair, Flight flight, List<BigDecimal> flightLengths,
            BigDecimal minTread, OccupancyTypeHelper mostRestrictiveOccupancyType) {
        BigDecimal totalLength = flightLengths.stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        totalLength = Util.roundOffTwoDecimal(totalLength);

        BigDecimal requiredTread = BigDecimal.valueOf(0.25);

        if (flight.getNoOfRises() != null) {
            /*
             * BigDecimal denominator = fireStair.getNoOfRises().subtract(BigDecimal.valueOf( flightLengths.size()))
             * .subtract(BigDecimal.valueOf(fireStair.getLinesInFlightLayer(). size()));
             */
            BigDecimal noOfFlights = BigDecimal.valueOf(flightLengths.size());

            if (flight.getNoOfRises().compareTo(noOfFlights) > 0) {
                BigDecimal denominator = flight.getNoOfRises().subtract(noOfFlights);

                minTread = totalLength.divide(denominator, DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                        DcrConstants.ROUNDMODE_MEASUREMENTS);

                boolean valid = false;

                if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")) {

                    if (Util.roundOffTwoDecimal(minTread).compareTo(Util.roundOffTwoDecimal(requiredTread)) >= 0) {
                        valid = true;
                    }

                    String value = typicalFloorValues.get("typicalFloors") != null
                            ? (String) typicalFloorValues.get("typicalFloors")
                            : " floor " + floor.getNumber();
                    if (valid) {
                        setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                                String.format(TREAD_DESCRIPTION, fireStair.getNumber(), flight.getNumber()),
                                requiredTread.toString(), String.valueOf(minTread), Result.Accepted.getResultVal(),
                                scrutinyDetail3);
                    } else {
                        setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                                String.format(TREAD_DESCRIPTION, fireStair.getNumber(), flight.getNumber()),
                                requiredTread.toString(), String.valueOf(minTread), Result.Not_Accepted.getResultVal(),
                                scrutinyDetail3);
                    }
                }
            } else {
                if (flight.getNoOfRises().compareTo(BigDecimal.ZERO) > 0) {
                    String flightLayerName = String.format(DxfFileConstants.LAYER_FIRESTAIR_FLIGHT, block.getNumber(),
                            floor.getNumber(), fireStair.getNumber(), flight.getNumber());
                    errors.put("NoOfRisesCount" + flightLayerName,
                            "Number of risers count should be greater than the count of length of flight dimensions defined in layer "
                                    + flightLayerName);
                    plan.addErrors(errors);
                }
            }
        }
        return minTread;
    }

    /*
     * private BigDecimal getRequiredTread(OccupancyTypeHelper mostRestrictiveOccupancyType) { if
     * (mostRestrictiveOccupancyType.getSubtype() != null && DxfFileConstants.A_AF.equalsIgnoreCase(mostRestrictiveOccupancyType.
     * getSubtype().getCode())) { return BigDecimal.valueOf(0.25); } else { return BigDecimal.valueOf(0.3); } }
     */

    private void validateNoOfRises(Plan plan, HashMap<String, String> errors, Block block,
            ScrutinyDetail scrutinyDetail3, Floor floor, Map<String, Object> typicalFloorValues, Flight flight,
            org.egov.common.entity.edcr.FireStair fireStair, BigDecimal noOfRises) {
        boolean valid = false;

        if (!(Boolean) typicalFloorValues.get("isTypicalRepititiveFloor")) {
            if (Util.roundOffTwoDecimal(noOfRises).compareTo(Util.roundOffTwoDecimal(BigDecimal.valueOf(12))) <= 0) {
                valid = true;
            }

            String value = typicalFloorValues.get("typicalFloors") != null
                    ? (String) typicalFloorValues.get("typicalFloors")
                    : " floor " + floor.getNumber();
            if (valid) {
                setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                        String.format(NO_OF_RISER_DESCRIPTION, fireStair.getNumber(), flight.getNumber()),
                        EXPECTED_NO_OF_RISE, String.valueOf(noOfRises), Result.Accepted.getResultVal(),
                        scrutinyDetail3);
            } else {
                setReportOutputDetailsFloorStairWise(plan, RULE42_5_II, value,
                        String.format(NO_OF_RISER_DESCRIPTION, fireStair.getNumber(), flight.getNumber()),
                        EXPECTED_NO_OF_RISE, String.valueOf(noOfRises), Result.Not_Accepted.getResultVal(),
                        scrutinyDetail3);
            }
        }
    }

    /*
     * private void setReportOutputDetails(Plan pl, String ruleNo, String ruleDesc, String expected, String actual, String status,
     * ScrutinyDetail scrutinyDetail) { Map<String, String> details = new HashMap<>(); details.put(RULE_NO, ruleNo);
     * details.put(DESCRIPTION, ruleDesc); details.put(REQUIRED, expected); details.put(PROVIDED, actual); details.put(STATUS,
     * status); scrutinyDetail.getDetail().add(details); pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail); }
     */

    private void setReportOutputDetailsFloorStairWise(Plan pl, String ruleNo, String floor, String description,
            String expected, String actual, String status, ScrutinyDetail scrutinyDetail) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(FLOOR, floor);
        details.put(DESCRIPTION, description);
        details.put(PERMISSIBLE, expected);
        details.put(PROVIDED, actual);
        details.put(STATUS, status);
        scrutinyDetail.getDetail().add(details);
        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
    }

    private void setReportOutputDetailsBltUp(Plan pl, String ruleNo, String floor, String description, String actual,
            String status, ScrutinyDetail scrutinyDetail) {
        Map<String, String> details = new HashMap<>();
        details.put(RULE_NO, ruleNo);
        details.put(FLOOR, floor);
        details.put(DESCRIPTION, description);
        details.put(PROVIDED, actual);
        details.put(STATUS, status);
        scrutinyDetail.getDetail().add(details);
        pl.getReportOutput().getScrutinyDetails().add(scrutinyDetail);
    }

    
    /*
     * private void validateDimensions(Plan plan, String blockNo, int floorNo, String stairNo, List<Measurement> flightPolyLines)
     * { int count = 0; for (Measurement m : flightPolyLines) { if (m.getInvalidReason() != null && m.getInvalidReason().length()
     * > 0) { count++; } } if (count > 0) { plan.addError(String.format(DxfFileConstants. LAYER_FIRESTAIR_FLIGHT_FLOOR, blockNo,
     * floorNo, stairNo), count + " number of flight polyline not having only 4 points in layer " +
     * String.format(DxfFileConstants.LAYER_FIRESTAIR_FLIGHT_FLOOR, blockNo, floorNo, stairNo)); } }
     */
     

    @Override
    public Map<String, Date> getAmendments() {
        return new LinkedHashMap<>();
    }

}