package org.egov.edcr.feature;

import static org.egov.edcr.constants.DxfFileConstants.OCCUPANCY_A2_PARKING_WITHATTACHBATH_COLOR_CODE;
import static org.egov.edcr.constants.DxfFileConstants.OCCUPANCY_A2_PARKING_WITHDINE_COLOR_CODE;
import static org.egov.edcr.constants.DxfFileConstants.OCCUPANCY_A2_PARKING_WOATTACHBATH_COLOR_CODE;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.FloorUnit;
import org.egov.common.entity.edcr.Hall;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.PrintUtil;
import org.egov.edcr.utility.Util;
import org.egov.edcr.utility.math.Polygon;
import org.egov.edcr.utility.math.Ray;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParkingExtract extends FeatureExtract {
    private static final Logger LOGGER = LogManager.getLogger(ParkingExtract.class);
    private static final String DA_PARKING = "DA parking";
    final Ray rayCasting = new Ray(new Point(-1.123456789, -1.987654321, 0d));

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("Starting of Parking Extract......");
        for (Block block : pl.getBlocks()) {
            for (Floor floor : block.getBuilding().getFloors()) {
                String layerRegEx = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                        + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + floor.getNumber() + "_"
                        + layerNames.getLayerName("LAYER_NAME_UNITFA");
                List<DXFLWPolyline> occupancyUnits = Util.getPolyLinesByLayer(pl.getDoc(), layerRegEx);
                extractByLayer(pl, pl.getDoc(), block, floor, occupancyUnits);
                String coveredParkLayer = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber()
                        + "_" + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + floor.getNumber() + "_"
                        + layerNames.getLayerName("LAYER_NAME_COVERED_PARKING");
                List<String> covereredParkLayerNames = Util.getLayerNamesLike(pl.getDoc(), coveredParkLayer);
                for (String s : covereredParkLayerNames)
                    Util.getPolyLinesByLayer(pl.getDoc(), s).forEach(coveredPark -> {
                        if (floor.getNumber() < 0)
                            floor.getParking().getBasementCars().add(new MeasurementDetail(coveredPark, true));
                        else
                            floor.getParking().getCoverCars().add(new MeasurementDetail(coveredPark, true));
                    });
                String stiltParkLayer = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber()
                        + "_" + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + floor.getNumber() + "_"
                        + layerNames.getLayerName("LAYER_NAME_STILT");
                List<BigDecimal> heightFromFloorToBottomOfBeam = Util.getListOfDimensionValueByLayer(pl, stiltParkLayer);
                floor.setHeightFromFloorToBottomOfBeam(heightFromFloorToBottomOfBeam);
                List<String> stiltParkLayerNames = Util.getLayerNamesLike(pl.getDoc(), stiltParkLayer);
                for (String s : stiltParkLayerNames)
                    Util.getPolyLinesByLayer(pl.getDoc(), s).forEach(
                            stiltPark -> floor.getParking().getStilts().add(new MeasurementDetail(stiltPark, true)));
            }

            String hallLayer = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                    + layerNames.getLayerName("LAYER_NAME_UNITFA_HALL") + "_" + "\\d";
            List<String> layerNames1 = Util.getLayerNamesLike(pl.getDoc(), hallLayer);
            for (String s : layerNames1) {

                List<DXFLWPolyline> hallPolylines = Util.getPolyLinesByLayer(pl.getDoc(), s);
                for (DXFLWPolyline pline : hallPolylines) {
                    MeasurementDetail m = new MeasurementDetail(pline, true);
                    Hall hall = new Hall();
                    hall.setNumber(pline.getLayerName().substring(pline.getLayerName().length() - 1));
                    hall.setArea(m.getArea());
                    hall.setLength(m.getLength());
                    hall.setWidth(m.getWidth());
                    hall.setHeight(m.getHeight());
                    hall.setMinimumSide(m.getMinimumSide());
                    block.getHallAreas().add(hall);
                }
            }

            String dinningLayer = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                    + layerNames.getLayerName("LAYER_NAME_UNITFA_DINING") + "_" + "\\d";
            List<String> layerNames2 = Util.getLayerNamesLike(pl.getDoc(), dinningLayer);
            for (String s : layerNames2)
                Util.getPolyLinesByLayer(pl.getDoc(), s).forEach(
                        dinningPolyline -> block.getDiningSpaces().add(new MeasurementDetail(dinningPolyline, true)));
        }

        Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_LOADING_UNLOADING"))
                .forEach(loadUnloadPolyline -> pl.getParkingDetails().getLoadUnload()
                        .add(new MeasurementDetail(loadUnloadPolyline, true)));

        Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_MECH_PARKING"))
                .forEach(mechParkPolyline -> pl.getParkingDetails().getMechParking()
                        .add(new MeasurementDetail(mechParkPolyline, true)));

        Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_TWO_WHEELER_PARKING"))
                .forEach(twoWheelerPolyline -> pl.getParkingDetails().getTwoWheelers()
                        .add(new MeasurementDetail(twoWheelerPolyline, true)));

        Util.getPolyLinesByLayer(pl.getDoc(), DA_PARKING).forEach(disablePersonParkPolyline -> pl.getParkingDetails()
                .getDisabledPersons().add(new MeasurementDetail(disablePersonParkPolyline, true)));

        BigDecimal dimension = Util.getSingleDimensionValueByLayer(pl.getDoc(), DA_PARKING, pl);
        pl.getParkingDetails().setDistFromDAToMainEntrance(dimension);
        List<DXFLWPolyline> bldParking = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_PARKING_SLOT"));
        for (DXFLWPolyline pline : bldParking)
            pl.getParkingDetails().getCars().add(new MeasurementDetail(pline, true));

        for (Block b : pl.getBlocks()) {
            b.getBuilding().sortFloorByName();
            if (!b.getTypicalFloor().isEmpty())
                for (TypicalFloor typical : b.getTypicalFloor()) {
                    Floor modelFloor = b.getBuilding().getFloorNumber(typical.getModelFloorNo());
                    for (Integer no : typical.getRepetitiveFloorNos()) {
                        Floor typicalFloor = b.getBuilding().getFloorNumber(no);
                        typicalFloor.setUnits(modelFloor.getUnits());
                    }
                }
        }

        //
        Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_OPEN_PARKING")).forEach(
                openParking -> pl.getParkingDetails().getOpenCars().add(new MeasurementDetail(openParking, true)));
        Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_MECHANICAL_LIFT")).forEach(
                mechLift -> pl.getParkingDetails().getMechParking().add(new MeasurementDetail(mechLift, true)));
        Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_VISITOR_PARKING")).forEach(
                visitorPark -> pl.getParkingDetails().getVisitors().add(new MeasurementDetail(visitorPark, true)));
        Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_SPECIAL_PARKING")).forEach(
                specialPark -> pl.getParkingDetails().getSpecial().add(new MeasurementDetail(specialPark, true)));

        validate(pl);
        
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("End of Parking Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        if (pl.getStrictlyValidateDimension()) {
            validateDuplicate(pl);
        }
        return pl;
    }

    private void extractByLayer(PlanDetail pl, DXFDocument doc, Block block, Floor floor,
            List<DXFLWPolyline> dxflwPolylines) {
        int i = 0;
        if (!dxflwPolylines.isEmpty()) {
            List<FloorUnit> floorUnits = new ArrayList<>();
            for (DXFLWPolyline flrUnitPLine : dxflwPolylines) {
                FloorUnit floorUnit = new FloorUnit();
                floorUnit.setColorCode(flrUnitPLine.getColor());
                Occupancy occupancy = new Occupancy();
                // this should not be called
                Util.setOccupancyType(flrUnitPLine, occupancy);
                occupancy.setTypeHelper(Util.findOccupancyType(flrUnitPLine, pl));
                specialCaseCheckForOccupancyType(flrUnitPLine, occupancy);
                floorUnit.setOccupancy(occupancy);
                floorUnit.setArea(Util.getPolyLineArea(flrUnitPLine));
                i++;
                Polygon polygon = Util.getPolygon(flrUnitPLine);
                BigDecimal deduction = BigDecimal.ZERO;
                String deductLayerName = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber()
                        + "_" + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + floor.getNumber() + "_"
                        + layerNames.getLayerName("LAYER_NAME_UNITFA_DEDUCT");
                for (DXFLWPolyline occupancyDeduct : Util.getPolyLinesByLayer(doc, deductLayerName)) {
                    boolean contains = false;
                    Iterator buildingIterator = occupancyDeduct.getVertexIterator();
                    while (buildingIterator.hasNext()) {
                        DXFVertex dxfVertex = (DXFVertex) buildingIterator.next();
                        Point point = dxfVertex.getPoint();
                        if (rayCasting.contains(point, polygon)) {
                            contains = true;
                            MeasurementDetail measurement = new MeasurementDetail();
                            measurement.setPolyLine(occupancyDeduct);
                            measurement.setArea(Util.getPolyLineArea(occupancyDeduct));
                            floorUnit.getArea().subtract(Util.getPolyLineArea(occupancyDeduct));
                            floorUnit.getDeductions().add(measurement);
                        }
                    }
                    if (contains) {
                        LOGGER.info("current deduct " + deduction + "  :add deduct for rest unit " + i + " area added "
                                + Util.getPolyLineArea(occupancyDeduct));
                        deduction = deduction.add(Util.getPolyLineArea(occupancyDeduct));
                    }
                }

                floorUnit.setTotalUnitDeduction(deduction);
                floorUnits.add(floorUnit);
            }
            floor.setUnits(floorUnits);
        }
    }

    private void specialCaseCheckForOccupancyType(DXFLWPolyline pLine, Occupancy occupancy) {
        if (pLine.getColor() == OCCUPANCY_A2_PARKING_WITHATTACHBATH_COLOR_CODE) {
            occupancy.setWithAttachedBath(true);
            occupancy.setType(OccupancyType.OCCUPANCY_A2);
        } else if (pLine.getColor() == OCCUPANCY_A2_PARKING_WOATTACHBATH_COLOR_CODE) {
            occupancy.setWithOutAttachedBath(true);
            occupancy.setType(OccupancyType.OCCUPANCY_A2);
        } else if (pLine.getColor() == OCCUPANCY_A2_PARKING_WITHDINE_COLOR_CODE) {
            occupancy.setWithDinningSpace(true);
            occupancy.setType(OccupancyType.OCCUPANCY_A2);
        }
    }

    private void validateDuplicate(PlanDetail pl) {
        List<Measurement> all = new ArrayList<>();
        all.addAll(pl.getParkingDetails().getCars());
        all.addAll(pl.getParkingDetails().getDisabledPersons());
        all.addAll(pl.getParkingDetails().getLoadUnload());
        all.addAll(pl.getParkingDetails().getMechParking());
        all.addAll(pl.getParkingDetails().getTwoWheelers());
        all.addAll(pl.getParkingDetails().getCars());
        
        all.addAll(pl.getParkingDetails().getOpenCars());
        all.addAll(pl.getParkingDetails().getCoverCars());
        all.addAll(pl.getParkingDetails().getBasementCars());
        all.addAll(pl.getParkingDetails().getVisitors());
        all.addAll(pl.getParkingDetails().getStilts());
        all.addAll(pl.getParkingDetails().getMechanicalLifts());

        /*
         * for (Block block : pl.getBlocks()) { for (Floor floor : block.getBuilding().getFloors()) {
         * all.addAll(floor.getParking().getOpenCars()); all.addAll(floor.getParking().getCoverCars());
         * all.addAll(floor.getParking().getBasementCars()); all.addAll(floor.getParking().getVisitors());
         * all.addAll(floor.getParking().getStilts()); all.addAll(floor.getParking().getMechanicalLifts()); } }
         */
        Set<MeasurementDetail> duplicates = new HashSet<>();

        for (Measurement m : all) {
            MeasurementDetail md = (MeasurementDetail) m;
            Iterator vertexIterator = md.getPolyLine().getVertexIterator();
            LOGGER.debug("Points on the " + " outside");
            // LOG.debug("Max x: " + m.getPolyLine().getBounds().getMaximumX() + " Min x:" +
            // m.getPolyLine().getBounds().getMinimumX());
            // LOG.debug("Max y: " + m.getPolyLine().getBounds().getMaximumY() + " Min x:" +
            // m.getPolyLine().getBounds().getMinimumY());
            while (vertexIterator.hasNext()) {
                DXFVertex next = (DXFVertex) vertexIterator.next();
                LOGGER.error(next.getPoint().getX() + "," + next.getPoint().getY());
            }

            for (Measurement m1 : all) {
                MeasurementDetail md1 = (MeasurementDetail) m1;
                Iterator mVertexIterator = md1.getPolyLine().getVertexIterator();
                vertexIterator = md1.getPolyLine().getVertexIterator();
                LOGGER.error("Points on the " + " Inside");
                // LOG.debug("Max x: " + m1.getPolyLine().getBounds().getMaximumX() + " Min x:" +
                // m1.getPolyLine().getBounds().getMinimumX());
                // LOG.debug("Max y: " + m1.getPolyLine().getBounds().getMaximumY() + " Min x:" +
                // m1.getPolyLine().getBounds().getMinimumY());
                while (vertexIterator.hasNext()) {
                    DXFVertex next = (DXFVertex) vertexIterator.next();
                    LOGGER.debug("           " + next.getPoint().getX() + "," + next.getPoint().getY());
                }
                int duplicatePoint = 0;
                if (m == m1)
                    continue;

                while (mVertexIterator.hasNext()) {

                    Iterator m1VertexIterator = md1.getPolyLine().getVertexIterator();

                    DXFVertex mNext = (DXFVertex) mVertexIterator.next();
                    Point mPoint = mNext.getPoint();
                    while (m1VertexIterator.hasNext()) {
                        DXFVertex m1Next = (DXFVertex) m1VertexIterator.next();
                        Point m1Point = m1Next.getPoint();

                        if (Util.pointsEquals(mPoint, m1Point)) {
                            System.out.println("duplicate points = " + mPoint + ", "+ m1Point);
                            duplicatePoint++;
                        }

                    }

                }
                if (duplicatePoint > 2) {
                    duplicates.add(md);
                    LOGGER.error(" found duplicate for outside point ");
                }

            }
        }
        if (!duplicates.isEmpty()) {
            PrintUtil.markCircle(duplicates, pl, "DUPLICATE_PARKING", DxfFileConstants.ERROR_MARK_CIRCLE_COLOR);
            LOGGER.error(" found duplicates for outside point ");
            pl.addError("Duplicate", "Duplicate/Overlaying of items found in  Parking");
        }
    }
}
