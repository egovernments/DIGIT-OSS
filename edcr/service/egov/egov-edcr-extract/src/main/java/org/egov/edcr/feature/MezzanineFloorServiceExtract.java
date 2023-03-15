package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Hall;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.entity.blackbox.OccupancyDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MezzanineFloorServiceExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(MezzanineFloorServiceExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Mezzanine Floor Extract......");
        // extract mezzanine floor details
        if (!pl.getBlocks().isEmpty())
            for (Block block : pl.getBlocks())
                if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                    outside: for (Floor floor : block.getBuilding().getFloors()) {
                        if (!block.getTypicalFloor().isEmpty())
                            for (TypicalFloor tp : block.getTypicalFloor())
                                if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
                                    for (Floor allFloors : block.getBuilding().getFloors())
                                        if (allFloors.getNumber().equals(tp.getModelFloorNo()))
                                            if (!allFloors.getMezzanineFloor().isEmpty()
                                                    || !allFloors.getHalls().isEmpty()) {
                                                floor.setMezzanineFloor(allFloors.getMezzanineFloor());
                                                floor.setHalls(allFloors.getHalls());
                                                continue outside;
                                            }
                        // extract mezzanine data
                        String mezzanineLayerNameRegExp = String.format(
                                layerNames.getLayerName("LAYER_NAME_MEZZANINE_FLOOR_BLT_UP_AREA"), block.getNumber(),
                                floor.getNumber(), "+\\d");

                        List<String> mezzanineLayerNames = Util.getLayerNamesLike(pl.getDoc(),
                                mezzanineLayerNameRegExp);
                        List<OccupancyDetail> mezzanineFloorList = new ArrayList<>();
                        if (!mezzanineLayerNames.isEmpty())
                            for (String mezzanine : mezzanineLayerNames) {
                                String[] array = mezzanine.split("_");
                                if (array[8] != null && !array[8].isEmpty()) {
                                    OccupancyDetail occupancy = new OccupancyDetail();
                                    occupancy.setMezzanineNumber(array[8]);
                                    occupancy.setIsMezzanine(true);
                                    List<DXFLWPolyline> mezzaninePolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                            String.format(
                                                    layerNames.getLayerName("LAYER_NAME_MEZZANINE_FLOOR_BLT_UP_AREA"),
                                                    block.getNumber(), floor.getNumber(),
                                                    occupancy.getMezzanineNumber()));
                                    List<BigDecimal> heights = Util.getListOfDimensionValueByLayer(pl,
                                            String.format(
                                                    layerNames.getLayerName("LAYER_NAME_MEZZANINE_FLOOR_BLT_UP_AREA"),
                                                    block.getNumber(), floor.getNumber(),
                                                    occupancy.getMezzanineNumber()));
                                    if (!heights.isEmpty())
                                        occupancy.setHeight(Collections.max(heights));
                                    BigDecimal builtUpArea = BigDecimal.ZERO;
                                    if (!mezzaninePolyLines.isEmpty())
                                        for (DXFLWPolyline polyline : mezzaninePolyLines) {
                                            BigDecimal polyLineBuiltUpArea = Util.getPolyLineArea(polyline);
                                            LOG.debug("Mezzanine Floor Area = " + polyLineBuiltUpArea);
                                            builtUpArea = builtUpArea.add(polyLineBuiltUpArea == null ? BigDecimal.ZERO
                                                    : polyLineBuiltUpArea);
                                        }
                                    occupancy.setBuiltUpArea(builtUpArea);
                                    List<DXFLWPolyline> mezzanineDeductPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                            String.format(
                                                    layerNames.getLayerName("LAYER_NAME_MEZZANINE_FLOOR_DEDUCTION"),
                                                    block.getNumber(), floor.getNumber(),
                                                    occupancy.getMezzanineNumber()));
                                    BigDecimal builtUpAreaDeduct = BigDecimal.ZERO;
                                    if (!mezzanineDeductPolyLines.isEmpty())
                                        for (DXFLWPolyline polyLine : mezzanineDeductPolyLines) {
                                            BigDecimal polyLineDeduct = Util.getPolyLineArea(polyLine);
                                            LOG.debug("Mezzanine Floor Deduct Area = " + polyLineDeduct);
                                            builtUpAreaDeduct = builtUpAreaDeduct
                                                    .add(polyLineDeduct == null ? BigDecimal.ZERO : polyLineDeduct);
                                        }
                                    occupancy.setDeduction(builtUpAreaDeduct);
                                    mezzanineFloorList.add(occupancy);
                                }
                            }
                        floor.getOccupancies().addAll(mezzanineFloorList);

                        // extract Hall data
                        String hallLayerNameRegExp = "BLK_" + block.getNumber() + "_FLR_" + floor.getNumber() + "_HALL"
                                + "_+\\d" + "_BLT_UP_AREA";
                        List<String> hallLayerNames = Util.getLayerNamesLike(pl.getDoc(), hallLayerNameRegExp);
                        List<Hall> hallsList = new ArrayList<>();

                        if (!hallLayerNames.isEmpty())
                            for (String hl : hallLayerNames) {
                                String[] array = hl.split("_");
                                if (array[5] != null && !array[5].isEmpty()) {
                                    Hall hall = new Hall();
                                    hall.setNumber(array[5]);
                                    List<DXFLWPolyline> hallPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                            String.format(
                                                    layerNames.getLayerName("LAYER_NAME_MEZZANINE_HALL_BLT_UP_AREA"),
                                                    block.getNumber(), floor.getNumber(), hall.getNumber()));
                                    BigDecimal builtUpArea = BigDecimal.ZERO;
                                    if (!hallPolyLines.isEmpty())
                                        for (DXFLWPolyline polyline : hallPolyLines) {
                                            BigDecimal polyLineBuiltUpArea = Util.getPolyLineArea(polyline);
                                            builtUpArea = builtUpArea.add(polyLineBuiltUpArea == null ? BigDecimal.ZERO
                                                    : polyLineBuiltUpArea);
                                        }
                                    hall.setBuiltUpArea(builtUpArea);
                                    List<DXFLWPolyline> hallDeductPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                            String.format(
                                                    layerNames.getLayerName("LAYER_NAME_MEZZANINE_HALL_DEDUCTION"),
                                                    block.getNumber(), floor.getNumber(), hall.getNumber()));
                                    BigDecimal builtUpAreaDeduct = BigDecimal.ZERO;
                                    if (!hallDeductPolyLines.isEmpty())
                                        for (DXFLWPolyline polyLine : hallDeductPolyLines) {
                                            BigDecimal polyLineDeduct = Util.getPolyLineArea(polyLine);
                                            builtUpAreaDeduct = builtUpAreaDeduct
                                                    .add(polyLineDeduct == null ? BigDecimal.ZERO : polyLineDeduct);
                                        }
                                    hall.setDeductions(builtUpAreaDeduct);
                                    hallsList.add(hall);
                                }
                            }
                        floor.setHalls(hallsList);
                    }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Mezzanine Floor Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}