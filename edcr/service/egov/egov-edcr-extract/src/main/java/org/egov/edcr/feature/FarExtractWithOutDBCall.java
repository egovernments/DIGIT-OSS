package org.egov.edcr.feature;

import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.PLOT_AREA;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.log4j.Logger;
import org.egov.common.entity.bpa.SubOccupancy;
import org.egov.common.entity.bpa.Usage;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Building;
import org.egov.common.entity.edcr.Door;
import org.egov.common.entity.edcr.FireStair;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.GeneralStair;
import org.egov.common.entity.edcr.Lift;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.Stair;
import org.egov.common.entity.edcr.SubFeatureColorCode;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.commons.mdms.BpaMdmsUtil;
import org.egov.commons.mdms.config.MdmsConfiguration;
import org.egov.commons.mdms.validator.MDMSValidator;
import org.egov.commons.service.OccupancyService;
import org.egov.commons.service.SubFeatureColorCodeService;
import org.egov.commons.service.SubOccupancyService;
import org.egov.commons.service.UsageService;
import org.egov.edcr.entity.blackbox.FloorDetail;
import org.egov.edcr.entity.blackbox.LiftDetail;
import org.egov.edcr.entity.blackbox.OccupancyDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.entity.blackbox.StairDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.microservice.models.RequestInfo;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FarExtractWithOutDBCall extends FeatureExtract {

    private static final Logger LOG = Logger.getLogger(FarExtractWithOutDBCall.class);
    @Autowired
    private OccupancyService occupancyService;
    @Autowired
    private SubOccupancyService subOccupancyService;
    @Autowired
    private UsageService usageService;
    @Autowired
    private SubFeatureColorCodeService subFeatureColorCodeService;
    @Autowired
    private LayerNames layerNames;
    @Autowired
    private MdmsConfiguration mdmsConfiguration;
    @Autowired
    private BpaMdmsUtil bpaMdmsUtil;
    @Autowired
    private MDMSValidator mDMSValidator;
    @Autowired
    private CityService cityService;

    private static final String VALIDATION_WRONG_COLORCODE_FLOORAREA = "msg.error.wrong.colourcode.floorarea";
    public static final String RULE_31_1 = "31(1)";

    /**
     * @param doc
     * @param pl
     * @return 1) Floor area = (sum of areas of all polygon in Building_exterior_wall layer) - (sum of all polygons in FAR_deduct
     * layer) Color is not available here when color available change to getPolyLinesByLayerAndColor Api if required
     */

    @Override
    public PlanDetail extract(PlanDetail pl) {

		/*
		 * String farDeductByFloor =
		 * layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + "%s" + "_" +
		 * layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + "%s" + "_" +
		 * layerNames.getLayerName("LAYER_NAME_BUILT_UP_AREA_DEDUCT");
		 */
        String farDeductByFloor = "BLK_" + "%s" + "_"
                + "FLR_" + "%s" + "_"
                + "BLT_UP_AREA_DEDUCT";

        //loadRequiredMasterData(pl);
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of FAR Extract......");
        LOG.info(" Extract BUILT_UP_AREA");
        for (Block block : pl.getBlocks()) {
            /*
             * String singleFamily = "B_" + block.getNumber() + "_" + DxfFileConstants.SINGLE_FAMILY_BLDG; if
             * (pl.getPlanInformation().getSingleFamilyBuilding() != null) { Boolean value =
             * pl.getPlanInformation().getSingleFamilyBuilding(); if (value) block.setSingleFamilyBuilding(true); else
             * block.setSingleFamilyBuilding(false); }
             */

            LOG.error(" Working on Block  " + block.getNumber());
            List<String> typicals = new ArrayList<>();
            List<DXFLWPolyline> polyLinesByLayer;
			/*
			 * String layerRegEx = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") +
			 * block.getNumber() + "_" +
			 * layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + "-?\\d+_" +
			 * layerNames.getLayerName("LAYER_NAME_BUILT_UP_AREA");
			 */
            String layerRegEx = "BLK_" + block.getNumber() + "_" + "FLR_" + "-?\\d+_" + "BLT_UP_AREA";
            List<String> layerNames = Util.getLayerNamesLike(pl.getDoc(), layerRegEx);
            Door d = new Door();
            int floorNo;
            FloorDetail floor;
            for (String s : layerNames) {
                String typical = "";
                LOG.error("Working on Block  " + block.getNumber() + " For layer Name " + s);
                polyLinesByLayer = Util.getPolyLinesByLayer(pl.getDoc(), s);
                if (polyLinesByLayer.isEmpty())
                    continue;
                String typicalStr = Util.getMtextByLayerName(pl.getDoc(), s);

                if (typicalStr != null) {
                    LOG.error(
                            "Typical found in  " + block.getNumber() + " in layer" + s + "with Details " + typicalStr);
                    if (typical.isEmpty()) {
                        typical = typicalStr;
                        typicals.add(typical);
                    } else {
                        LOG.info("multiple typical floors defined in block " + block.getNumber() + " in layer" + s);
                        pl.addError("multiple typical floors defined",
                                "multiple typical floors defined. Considering First one");
                    }
                }

                floorNo = Integer.valueOf(s.split("_")[3]);
                if (block.getBuilding().getFloorNumber(floorNo) == null) {
                    floor = new FloorDetail();
                    floor.setNumber(floorNo);
                    extractFloorHeight(pl, block, floor);
                } else
                    floor = (FloorDetail) block.getBuilding().getFloorNumber(floorNo);
                // find builtup area
                for (DXFLWPolyline pline : polyLinesByLayer) {

                    BigDecimal occupancyArea = Util.getPolyLineArea(pline);
                    LOG.error(" occupancyArea *************** " + occupancyArea);
                    OccupancyDetail occupancy = new OccupancyDetail();
                    occupancy.setPolyLine(pline);
                    occupancy.setBuiltUpArea(occupancyArea == null ? BigDecimal.ZERO : occupancyArea);
                    occupancy.setExistingBuiltUpArea(BigDecimal.ZERO);
                    occupancy.setType(Util.findOccupancyType(pline));
                    occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
                    LOG.error(" occupancy type " + occupancy.getType());
                    if (occupancy.getTypeHelper() == null)
                        pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA, getLocaleMessage(
                                VALIDATION_WRONG_COLORCODE_FLOORAREA, String.valueOf(pline.getColor()), s));
                    else
                        floor.addBuiltUpArea(occupancy);
                }
                if (block.getBuilding().getFloorNumber(floorNo) == null)
                    block.getBuilding().getFloors().add(floor);
                // find deductions
                String deductLayerName = String.format(farDeductByFloor, block.getNumber(), floor.getNumber());

                LOG.error("Working on Block deduction  " + deductLayerName);

                List<DXFLWPolyline> bldDeduct = Util.getPolyLinesByLayer(pl.getDoc(), deductLayerName);
                for (DXFLWPolyline pline : bldDeduct) {
                    BigDecimal deductionArea = Util.getPolyLineArea(pline);
                    LOG.error(" deductionArea *************** " + deductionArea);

                    Occupancy occupancy = new Occupancy();
                    occupancy.setDeduction(deductionArea == null ? BigDecimal.ZERO : deductionArea);
                    occupancy.setExistingDeduction(BigDecimal.ZERO);
                    occupancy.setType(Util.findOccupancyType(pline));
                    occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
                    LOG.error(" occupancy type deduction " + occupancy.getType());

                    if (occupancy.getTypeHelper() == null)
                        pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA,
                                getLocaleMessage(VALIDATION_WRONG_COLORCODE_FLOORAREA, String.valueOf(pline.getColor()),
                                        deductLayerName));
                    else
                        floor.addDeductionArea(occupancy);
                }
            }
            if (!typicals.isEmpty()) {
                LOG.info("Adding typical:" + block.getNumber());
                List<TypicalFloor> typicalFloors = new ArrayList<>();
                for (String typical : typicals) {
                    TypicalFloor tpf = new TypicalFloor(typical);
                    typicalFloors.add(tpf);
                }
                block.setTypicalFloor(typicalFloors);
            }
        }

        // set Floor wise poly line for terrace check.
        for (Block block : pl.getBlocks())
            if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                for (Floor floor : block.getBuilding().getFloors()) {
                    // set polylines in BLK_n_FLR_i_BLT_UP_AREA (built up area)
                    List<DXFLWPolyline> floorBuiltUpPolyLines = Util.getPolyLinesByLayer(pl.getDoc(), String.format(
                    		"BLK_%s_FLR_%s_BLT_UP_AREA", block.getNumber(), floor.getNumber()));
                    ((FloorDetail) floor).setBuiltUpAreaPolyLine(floorBuiltUpPolyLines);
                }

        for (Block b : pl.getBlocks()) {
            b.getBuilding().sortFloorByName();
            if (!b.getTypicalFloor().isEmpty())
                for (TypicalFloor typical : b.getTypicalFloor()) {
                    Floor modelFloor = b.getBuilding().getFloorNumber(typical.getModelFloorNo());
                    for (Integer no : typical.getRepetitiveFloorNos())
                        try {
                            Floor newFloor = (Floor) modelFloor.clone();
                            newFloor.setNumber(no);
                            b.getBuilding().getFloors().add(newFloor);
                        } catch (Exception e) {

                        }
                }
        }

        // get Existing Builtup area
        for (Block block : pl.getBlocks()) {
			/*
			 * String layerRegExForExistingPlan =
			 * layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() +
			 * "_" + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + "-?\\d+_" +
			 * layerNames.getLayerName("LAYER_NAME_BUILT_UP_AREA") +
			 * layerNames.getLayerName("LAYER_NAME_EXISTING_PREFIX");
			 */
            String layerRegExForExistingPlan = "BLK_" + "%s" + "_" + "FLR_" + "-?\\d+_" + "BLT_UP_AREA"+"_EXISTING";
            List<String> layerNamesList = Util.getLayerNamesLike(pl.getDoc(), layerRegExForExistingPlan);
            Floor floor;
            for (String layer : layerNamesList) {
                List<DXFLWPolyline> polylines = Util.getPolyLinesByLayer(pl.getDoc(), layer);
                if (polylines.isEmpty())
                    continue;
                int floorNo = Integer.valueOf(layer.split("_")[3]);
                if (block.getBuilding().getFloorNumber(floorNo) == null) {
                    floor = new FloorDetail();
                    floor.setNumber(floorNo);
                    extractFloorHeight(pl, block, floor);
                } else
                    floor = block.getBuilding().getFloorNumber(floorNo);
                for (DXFLWPolyline pline : polylines) {
                    BigDecimal occupancyArea = Util.getPolyLineArea(pline);
                    OccupancyDetail occupancy = new OccupancyDetail();
                    occupancy.setPolyLine(pline);
                    occupancy.setBuiltUpArea(occupancyArea == null ? BigDecimal.ZERO : occupancyArea);
                    occupancy.setExistingBuiltUpArea(occupancyArea == null ? BigDecimal.ZERO : occupancyArea);
                    occupancy.setType(Util.findOccupancyType(pline));
                    occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
                    if (occupancy.getTypeHelper() == null)
                        pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA, getLocaleMessage(
                                VALIDATION_WRONG_COLORCODE_FLOORAREA, String.valueOf(pline.getColor()), layer));
                    else
                        floor.addBuiltUpArea(occupancy);

                }
                if (block.getBuilding().getFloorNumber(floorNo) == null)
                    block.getBuilding().getFloors().add(floor);
                // existing deduction
				/*
				 * String deductLayerName = String.format(
				 * layerNames.getLayerName("LAYER_NAME_EXISTING_BLT_UP_AREA_DEDUCT"),
				 * block.getNumber(), floor.getNumber());
				 */
                String deductLayerName =String.format(
                		"BLK_%s_FLR_%s_BLT_UP_AREA_DEDUCT_EXISTING", block.getNumber(),
                        floor.getNumber());
                List<DXFLWPolyline> bldDeduct = Util.getPolyLinesByLayer(pl.getDoc(), deductLayerName);
                for (DXFLWPolyline pline : bldDeduct) {
                    BigDecimal deductionArea = Util.getPolyLineArea(pline);
                    Occupancy occupancy = new Occupancy();
                    occupancy.setDeduction(deductionArea == null ? BigDecimal.ZERO : deductionArea);
                    occupancy.setExistingDeduction(deductionArea == null ? BigDecimal.ZERO : deductionArea);
                    occupancy.setType(Util.findOccupancyType(pline));
                    occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
                    if (occupancy.getTypeHelper() == null)
                        pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA,
                                getLocaleMessage(VALIDATION_WRONG_COLORCODE_FLOORAREA, String.valueOf(pline.getColor()),
                                        deductLayerName));
                    else
                        floor.addDeductionArea(occupancy);
                }
            }
        }
        for (Block block : pl.getBlocks()) {
            Building building = block.getBuilding();
            if (building != null && !building.getFloors().isEmpty()) {
                Floor floor = building.getFloors().stream().max(Comparator.comparing(Floor::getNumber)).get();
                if (floor != null)
                    floor.setTerrace(checkTerrace(floor));
            }
        }

        for (Block block : pl.getBlocks()) {
            Building building = block.getBuilding();
            if (building != null && !building.getFloors().isEmpty())
                for (Floor floor : building.getFloors()) {
                    BigDecimal existingBltUpArea = BigDecimal.ZERO;

                    addCarpetArea(pl, block, floor);

                    // existing carpet area is added only when existing builtup area is present in
                    // that floor
                    List<Occupancy> occupancies = floor.getOccupancies();
                    for (Occupancy occupancy : occupancies)
                        existingBltUpArea = existingBltUpArea
                                .add(occupancy.getExistingBuiltUpArea() != null ? occupancy.getExistingBuiltUpArea()
                                        : BigDecimal.ZERO);

                    if (existingBltUpArea.compareTo(BigDecimal.ZERO) > 0)
                        addExistingCarpetArea(pl, block, floor);

                }
        }

        // parts of building
        for (Block block : pl.getBlocks()) {
			/*
			 * String plinthHeightLayer =
			 * String.format(layerNames.getLayerName("LAYER_NAME_PLINTH_HEIGHT"),
			 * block.getNumber());
			 */
            String plinthHeightLayer =String.format(
            		"BLK_%s_PLINTH_HEIGHT", block.getNumber());
            List<BigDecimal> plinthHeights = Util.getListOfDimensionValueByLayer(pl, plinthHeightLayer);
            block.setPlinthHeight(plinthHeights);

			/*
			 * String interiorCourtYardLayer =
			 * String.format(layerNames.getLayerName("LAYER_NAME_INTERIOR_COURTYARD"),
			 * block.getNumber());
			 */
            String interiorCourtYardLayer =String.format(
            		"BLK_%s_INTERIOR_CRTYRD_COVERPARK", block.getNumber());
            List<BigDecimal> interiorCourtYard = Util.getListOfDimensionValueByLayer(pl,
                    interiorCourtYardLayer);
            block.setInteriorCourtYard(interiorCourtYard);
        }

        if (LOG.isDebugEnabled())
            LOG.debug("End of FAR Extract......");
        return pl;
    }

    private void addExistingCarpetArea(PlanDetail pl, Block block, Floor floor) {
		/*
		 * String existingCarpetAreaLayer =
		 * layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() +
		 * "_" + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") +
		 * floor.getNumber() + layerNames.getLayerName("LAYER_NAME_CRPT_UP_AREA") +
		 * layerNames.getLayerName("LAYER_NAME_EXISTING_PREFIX");
		 */
        String existingCarpetAreaLayer = "BLK_" + block.getNumber() + "_" + "FLR_" + floor.getNumber() + "_" + "CARPET_AREA"+"_EXISTING";
        List<DXFLWPolyline> polylines = Util.getPolyLinesByLayer(pl.getDoc(), existingCarpetAreaLayer);

        /*
         * if (polylines.isEmpty()) { pl.addError(existingCarpetAreaLayer, "Carpet area is not defined in layer " +
         * existingCarpetAreaLayer); } else {
         */
        for (DXFLWPolyline pline : polylines) {
            BigDecimal occupancyArea = Util.getPolyLineArea(pline);
            OccupancyDetail occupancy = new OccupancyDetail();
            occupancy.setPolyLine(pline);
            occupancy.setCarpetArea(occupancyArea == null ? BigDecimal.ZERO : occupancyArea);
            occupancy.setExistingCarpetArea(occupancyArea == null ? BigDecimal.ZERO : occupancyArea);
            occupancy.setType(Util.findOccupancyType(pline));
            occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
            if (occupancy.getTypeHelper() == null)
                pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA, getLocaleMessage(VALIDATION_WRONG_COLORCODE_FLOORAREA,
                        String.valueOf(pline.getColor()), existingCarpetAreaLayer));
            else
                floor.addCarpetArea(occupancy);

        }

        // existing deduction

		/*
		 * String existingCarpetAreaDeductByFloor =
		 * layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + "%s" + "_" +
		 * layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + "%s" + "_" +
		 * layerNames.getLayerName("LAYER_NAME_CRPT_AREA_DEDUCT") +
		 * layerNames.getLayerName("LAYER_NAME_EXISTING_PREFIX");
		 */
        String existingCarpetAreaDeductByFloor = "BLK_" + "%s" + "_" + "FLR_" + "%s" + "_" + "CRPT_AREA_DEDUCT"+"_EXISTING";

        String deductLayerName = String.format(existingCarpetAreaDeductByFloor, block.getNumber(), floor.getNumber());
        List<DXFLWPolyline> bldDeduct = Util.getPolyLinesByLayer(pl.getDoc(), deductLayerName);
        for (DXFLWPolyline pline : bldDeduct) {
            BigDecimal deductionArea = Util.getPolyLineArea(pline);
            Occupancy occupancy = new Occupancy();
            occupancy.setCarpetAreaDeduction(deductionArea == null ? BigDecimal.ZERO : deductionArea);
            occupancy.setExistingCarpetAreaDeduction(deductionArea == null ? BigDecimal.ZERO : deductionArea);
            occupancy.setType(Util.findOccupancyType(pline));
            occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
            if (occupancy.getTypeHelper() == null)
                pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA, getLocaleMessage(VALIDATION_WRONG_COLORCODE_FLOORAREA,
                        String.valueOf(pline.getColor()), deductLayerName));
            else
                floor.addCarpetDeductionArea(occupancy);
        }
        // }
    }

    private void addCarpetArea(PlanDetail pl, Block block, Floor floor) {
		/*
		 * String carpetAreaLayer =
		 * layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() +
		 * "_" + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") +
		 * floor.getNumber() + "_" + layerNames.getLayerName("LAYER_NAME_CRPT_UP_AREA");
		 */
        String carpetAreaLayer = "BLK_" + block.getNumber() + "_" + "FLR_" + floor.getNumber() + "_" + "CARPET_AREA";
        LOG.error("Working on Block  " + block.getNumber() + " For layer Name " + carpetAreaLayer);
        List<DXFLWPolyline> polyLinesByLayer = Util.getPolyLinesByLayer(pl.getDoc(), carpetAreaLayer);
        /*
         * if (polyLinesByLayer.isEmpty()) pl.addError(carpetAreaLayer, "Carpet area is not defined in layer " + carpetAreaLayer);
         * else {
         */
        // find carpet area
        for (DXFLWPolyline pline : polyLinesByLayer) {
            BigDecimal carpetArea = Util.getPolyLineArea(pline);
            LOG.error(" carpetArea *************** " + carpetArea);
            OccupancyDetail occupancy = new OccupancyDetail();
            occupancy.setPolyLine(pline);
            occupancy.setCarpetArea(carpetArea == null ? BigDecimal.ZERO : carpetArea);
            occupancy.setExistingCarpetArea(BigDecimal.ZERO);
            occupancy.setType(Util.findOccupancyType(pline));
            occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
            LOG.error(" occupancy type " + occupancy.getType());
            if (occupancy.getTypeHelper() == null)
                pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA, getLocaleMessage(VALIDATION_WRONG_COLORCODE_FLOORAREA,
                        String.valueOf(pline.getColor()), carpetAreaLayer));
            else
                floor.addCarpetArea(occupancy);
        }

        // find carpet deduction
		/*
		 * String carpetAreaDeductByFloor =
		 * layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + "%s" + "_" +
		 * layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + "%s" + "_" +
		 * layerNames.getLayerName("LAYER_NAME_CRPT_AREA_DEDUCT");
		 */
        String carpetAreaDeductByFloor = "BLK_" + "%s" + "_" + "FLR_" + "%s" + "_" + "CRPT_AREA_DEDUCT";

        String deductLayerName = String.format(carpetAreaDeductByFloor, block.getNumber(), floor.getNumber());

        LOG.error("Working on Block carpet deduction  " + deductLayerName);

        List<DXFLWPolyline> bldDeduct = Util.getPolyLinesByLayer(pl.getDoc(), deductLayerName);
        for (DXFLWPolyline pline : bldDeduct) {
            BigDecimal carpetAreaDeduction = Util.getPolyLineArea(pline);
            LOG.error("carpet Area deduction *************** " + carpetAreaDeduction);

            Occupancy occupancy = new Occupancy();
            occupancy.setCarpetAreaDeduction(carpetAreaDeduction == null ? BigDecimal.ZERO : carpetAreaDeduction);
            occupancy.setExistingCarpetAreaDeduction(BigDecimal.ZERO);
            occupancy.setType(Util.findOccupancyType(pline));
            occupancy.setTypeHelper(Util.findOccupancyType(pline, pl));
            LOG.error(" occupancy type deduction " + occupancy.getType());

            if (occupancy.getTypeHelper() == null)
                pl.addError(VALIDATION_WRONG_COLORCODE_FLOORAREA, getLocaleMessage(VALIDATION_WRONG_COLORCODE_FLOORAREA,
                        String.valueOf(pline.getColor()), deductLayerName));
            else
                floor.addCarpetDeductionArea(occupancy);
        }
        // }
    }

    private void loadRequiredMasterData(PlanDetail pl) {
        /*
         * Boolean mdmsEnabled = mdmsConfiguration.getMdmsEnabled(); if (mdmsEnabled != null && mdmsEnabled) { City stateCity =
         * cityService.fetchStateCityDetails(); String tenantID = ApplicationThreadLocals.getTenantID(); Object mdmsData =
         * bpaMdmsUtil.mDMSCall(new RequestInfo(), stateCity.getCode() + "." + tenantID); if (mdmsData == null) { tenantID =
         * stateCity.getCode(); mdmsData = bpaMdmsUtil.mDMSCall(new RequestInfo(), tenantID); }
         * LOG.info("Tenant id for mdms call = " + tenantID); Map<String, List<Object>> masterData =
         * mDMSValidator.getAttributeValues(mdmsData); List<Object> occupancyTypeObjs = masterData.get("OccupancyType");
         * Map<Integer, org.egov.common.entity.bpa.Occupancy> occupancies = new HashMap<>(); Map<String,
         * org.egov.common.entity.bpa.Occupancy> codeOccupancies = new HashMap<>(); Map<String,
         * org.egov.common.entity.bpa.SubOccupancy> codeSubOccupancies = new HashMap<>(); for (Object occupancyType :
         * occupancyTypeObjs) { LinkedHashMap<String, Object> occupancyMap = (LinkedHashMap<String, Object>) occupancyType;
         * org.egov.common.entity.bpa.Occupancy occupancy = new org.egov.common.entity.bpa.Occupancy(); occupancy.setName((String)
         * occupancyMap.get("name")); String code = (String) occupancyMap.get("code"); occupancy.setCode(code);
         * occupancy.setIsactive((Boolean) occupancyMap.get("active")); occupancy.setMaxCoverage(BigDecimal.valueOf((Double)
         * occupancyMap.get("maxCoverage"))); occupancy.setMinFar(BigDecimal.valueOf((Double) occupancyMap.get("minFar")));
         * occupancy.setMaxFar(BigDecimal.valueOf((Double) occupancyMap.get("maxFar"))); occupancy.setOrderNumber((Integer)
         * occupancyMap.get("orderNumber")); occupancy.setDescription((String) occupancyMap.get("description")); Integer colorCode
         * = (Integer) occupancyMap.get("colorCode"); occupancy.setColorCode(colorCode); occupancies.put(colorCode, occupancy);
         * codeOccupancies.put(code, occupancy); } pl.setOccupanciesMaster(occupancies); List<Object> subOccupancyTypeObjs =
         * masterData.get("SubOccupancyType"); Map<Integer, org.egov.common.entity.bpa.SubOccupancy> subOccupancies = new
         * HashMap<>(); for (Object subOccupancyType : subOccupancyTypeObjs) { LinkedHashMap<String, Object> subOccupancyMap =
         * (LinkedHashMap<String, Object>) subOccupancyType; org.egov.common.entity.bpa.SubOccupancy subOccupancy = new
         * org.egov.common.entity.bpa.SubOccupancy(); subOccupancy.setName((String) subOccupancyMap.get("name")); String code =
         * (String) subOccupancyMap.get("code"); subOccupancy.setCode(code); subOccupancy.setIsactive((Boolean)
         * subOccupancyMap.get("active")); subOccupancy.setMaxCoverage(BigDecimal.valueOf((Double)
         * subOccupancyMap.get("maxCoverage"))); subOccupancy.setMinFar(BigDecimal.valueOf((Double)
         * subOccupancyMap.get("minFar"))); subOccupancy.setMaxFar(BigDecimal.valueOf((Double) subOccupancyMap.get("maxFar")));
         * subOccupancy.setOrderNumber((Integer) subOccupancyMap.get("orderNumber")); subOccupancy.setDescription((String)
         * subOccupancyMap.get("description")); Integer colorCode = (Integer) subOccupancyMap.get("colorCode");
         * subOccupancy.setColorCode(colorCode); String occupancyTypeCode = (String) subOccupancyMap.get("occupancyType");
         * org.egov.common.entity.bpa.Occupancy occupancy = codeOccupancies.get(occupancyTypeCode);
         * subOccupancy.setOccupancy(occupancy); subOccupancies.put(colorCode, subOccupancy); codeSubOccupancies.put(code,
         * subOccupancy); } pl.setSubOccupanciesMaster(subOccupancies); Map<Integer, Usage> usages = new HashMap<>(); List<Object>
         * usageObjs = masterData.get("Usages"); for (Object usageObj : usageObjs) { LinkedHashMap<String, Object> usageMap =
         * (LinkedHashMap<String, Object>) usageObj; Usage usage = new Usage(); usage.setName((String) usageMap.get("name"));
         * usage.setCode((String) usageMap.get("code")); usage.setActive((Boolean) usageMap.get("active"));
         * usage.setDescription((String) usageMap.get("description")); usage.setOrderNumber((Integer)
         * usageMap.get("orderNumber")); Integer colorCode = (Integer) usageMap.get("colorCode"); usage.setColorCode(colorCode);
         * String subOccupancyTypeCode = (String) usageMap.get("subOccupancyType"); SubOccupancy subOccupancy =
         * codeSubOccupancies.get(subOccupancyTypeCode); usage.setSubOccupancy(subOccupancy); usages.put(colorCode, usage); }
         * pl.setUsagesMaster(usages); Map<String, Map<String, Integer>> featureAndsubFeatureCC = new ConcurrentHashMap<>();
         * List<SubFeatureColorCode> featureColorCodes = new ArrayList<>(); List<Object> subFeatureCC =
         * masterData.get("SubFeatureColorCode"); for (Object subFeatureCCObj : subFeatureCC) { LinkedHashMap<String, Object>
         * subFeatureCCMap = (LinkedHashMap<String, Object>) subFeatureCCObj; SubFeatureColorCode subFeatureColorCode = new
         * SubFeatureColorCode(); subFeatureColorCode.setFeature((String) subFeatureCCMap.get("feature"));
         * subFeatureColorCode.setSubFeature((String) subFeatureCCMap.get("subFeature"));
         * subFeatureColorCode.setColorCode((Integer) subFeatureCCMap.get("colorCode"));
         * subFeatureColorCode.setOrderNumber((Integer) subFeatureCCMap.get("orderNumber"));
         * featureColorCodes.add(subFeatureColorCode); } buildSubFeatureColorCode(featureAndsubFeatureCC, featureColorCodes);
         * pl.setSubFeatureColorCodesMaster(featureAndsubFeatureCC); } else {
         */
        Map<Integer, org.egov.common.entity.bpa.Occupancy> occupancies = new HashMap<>();
        List<org.egov.common.entity.bpa.Occupancy> occupanciesFromDB = occupancyService.findAllByActive();
        for (org.egov.common.entity.bpa.Occupancy occ : occupanciesFromDB)
            if (occ.getColorCode() != null)
                occupancies.put(occ.getColorCode(), occ);
        pl.setOccupanciesMaster(occupancies);
        Map<Integer, SubOccupancy> subOccupancies = new HashMap<>();
        List<SubOccupancy> subOccupanciesFromDB = subOccupancyService.findAllByActive();
        for (SubOccupancy subOcc : subOccupanciesFromDB)
            if (subOcc.getColorCode() != null)
                subOccupancies.put(subOcc.getColorCode(), subOcc);
        pl.setSubOccupanciesMaster(subOccupancies);
        Map<Integer, Usage> usages = new HashMap<>();
        List<Usage> usagesFromDB = usageService.findAllByActive();
        for (Usage usage : usagesFromDB)
            if (usage.getColorCode() != null)
                usages.put(usage.getColorCode(), usage);
        pl.setUsagesMaster(usages);
    //}

    // Load feature and their sub features color code
		/*
		 * Map<String, Map<String, Integer>> featureAndsubFeatureCC = new
		 * ConcurrentHashMap<>(); List<SubFeatureColorCode> featureColorCodes =
		 * subFeatureColorCodeService.findAll();for( SubFeatureColorCode
		 * efcc:featureColorCodes) { if
		 * (featureAndsubFeatureCC.containsKey(efcc.getFeature())) { Map<String,
		 * Integer> subFeature = featureAndsubFeatureCC.get(efcc.getFeature());
		 * subFeature.put(efcc.getSubFeature(), efcc.getColorCode());
		 * featureAndsubFeatureCC.put(efcc.getFeature(), subFeature); } else {
		 * Map<String, Integer> subFeature = new ConcurrentHashMap<>();
		 * subFeature.put(efcc.getSubFeature(), efcc.getColorCode());
		 * featureAndsubFeatureCC.put(efcc.getFeature(), subFeature); } }
		 * 
		 * pl.setSubFeatureColorCodesMaster(featureAndsubFeatureCC);
		 */
    }

    private void extractFloorHeight(PlanDetail pl, Block block, Floor floor) {
		/*
		 * String floorHeightLayerName =
		 * layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() +
		 * "_" + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") +
		 * floor.getNumber() + "_" +
		 * layerNames.getLayerName("LAYER_NAME_FLOOR_HEIGHT_PREFIX");
		 */
        String floorHeightLayerName = "BLK_" + block.getNumber() + "_" + "FLR_" + floor.getNumber() + "_" + "FLOOR_HEIGHT";
        List<BigDecimal> flrHeights = Util.getListOfDimensionValueByLayer(pl, floorHeightLayerName);
        floor.setFloorHeights(flrHeights);
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        if (pl.getPlot().getArea() == null || pl.getPlot().getArea().doubleValue() == 0)
            pl.addError(PLOT_AREA, getLocaleMessage(OBJECTNOTDEFINED, PLOT_AREA));

        return pl;
    }

    private Boolean checkTerrace(Floor floor) {

        BigDecimal totalStairArea = BigDecimal.ZERO;
        BigDecimal fireStairArea = BigDecimal.ZERO;
        BigDecimal generalStairArea = BigDecimal.ZERO;
        BigDecimal liftArea = BigDecimal.ZERO;
        BigDecimal builtUpArea = BigDecimal.ZERO;

        List<FireStair> fireStairs = floor.getFireStairs();
        if (fireStairs != null && !fireStairs.isEmpty())
            for (Stair fireStair : fireStairs) {
                List<DXFLWPolyline> stairPolylines = ((StairDetail) fireStair).getStairPolylines();
                if (stairPolylines != null && !stairPolylines.isEmpty())
                    for (DXFLWPolyline stairPolyLine : stairPolylines) {
                        BigDecimal stairArea = Util.getPolyLineArea(stairPolyLine);
                        fireStairArea = fireStairArea.add(stairArea).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                                DcrConstants.ROUNDMODE_MEASUREMENTS);
                    }
            }

        List<GeneralStair> generalStairs = floor.getGeneralStairs();
        if (generalStairs != null && !generalStairs.isEmpty())
            for (Stair generalStair : generalStairs) {
                List<DXFLWPolyline> stairPolylines = ((StairDetail) generalStair).getStairPolylines();
                if (stairPolylines != null && !stairPolylines.isEmpty())
                    for (DXFLWPolyline stairPolyLine : stairPolylines) {
                        BigDecimal stairArea = Util.getPolyLineArea(stairPolyLine);
                        generalStairArea = generalStairArea.add(stairArea)
                                .setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);
                    }
            }

        totalStairArea = fireStairArea.add(generalStairArea);

        List<Lift> lifts = floor.getLifts();

        if (lifts != null && !lifts.isEmpty())
            for (Lift lift : lifts) {
                List<DXFLWPolyline> polylines = ((LiftDetail) lift).getPolylines();

                if (polylines != null && !polylines.isEmpty())
                    for (DXFLWPolyline dxflwPolyline : polylines) {
                        BigDecimal polyLineArea = Util.getPolyLineArea(dxflwPolyline);
                        liftArea = liftArea.add(polyLineArea).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                                DcrConstants.ROUNDMODE_MEASUREMENTS);
                    }

            }

        totalStairArea = totalStairArea.add(liftArea);

        List<DXFLWPolyline> builtUpAreaPolyLines = ((FloorDetail) floor).getBuiltUpAreaPolyLine();
        if (builtUpAreaPolyLines != null && !builtUpAreaPolyLines.isEmpty())
            for (DXFLWPolyline builtUpAreaPolyLine : builtUpAreaPolyLines) {
                BigDecimal polyLineArea = Util.getPolyLineArea(builtUpAreaPolyLine);
                builtUpArea = builtUpArea.add(polyLineArea).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                        DcrConstants.ROUNDMODE_MEASUREMENTS);
            }

        return builtUpArea.doubleValue() > 0 && totalStairArea.doubleValue() > 0
                && builtUpArea.compareTo(totalStairArea) <= 0 ? Boolean.TRUE : Boolean.FALSE;

    }

}
