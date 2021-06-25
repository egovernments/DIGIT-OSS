package org.egov.edcr.feature;

import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.entity.blackbox.LiftDetail;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LiftServiceExtract extends FeatureExtract {
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        for (Block block : pl.getBlocks())
            if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty()) {
                Integer noOfLifts = 0;
                for (Floor floor : block.getBuilding().getFloors()) {
                    setLifts(pl.getDoc(), block, floor);
                    if (!floor.getLifts().isEmpty() && floor.getLifts().size() > noOfLifts)
                        noOfLifts = floor.getLifts().size();
                }
                block.setNumberOfLifts(String.valueOf(noOfLifts));
            }
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    private void setLifts(DXFDocument doc, Block block, Floor floor) {
        if (!block.getTypicalFloor().isEmpty())
            for (TypicalFloor tp : block.getTypicalFloor())
                if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
                    for (Floor allFloors : block.getBuilding().getFloors())
                        if (allFloors.getNumber().equals(tp.getModelFloorNo()))
                            if (!allFloors.getLifts().isEmpty()) {
                                floor.setLifts(allFloors.getLifts());
                                return;
                            }
        String liftRegex = String.format(layerNames.getLayerName("LAYER_NAME_LIFT"), block.getNumber(), floor.getNumber())
                + "_+\\d";
        List<String> liftLayer = Util.getLayerNamesLike(doc, liftRegex);
        if (!liftLayer.isEmpty())
            for (String lftLayer : liftLayer) {
                List<DXFLWPolyline> polylines = Util.getPolyLinesByLayer(doc, lftLayer);
                String[] splitLayer = lftLayer.split("_", 6);
                if (splitLayer.length == 6 && splitLayer[5] != null && !splitLayer[5].isEmpty()
                        && !polylines.isEmpty()) {
                    LiftDetail lift = new LiftDetail();
                    lift.setNumber(Integer.valueOf(splitLayer[5]));
                    boolean isClosed = polylines.stream().allMatch(dxflwPolyline -> dxflwPolyline.isClosed());
                    lift.setLiftClosed(isClosed);
                    List<Measurement> liftPolyLine = polylines.stream()
                            .map(dxflwPolyline -> new MeasurementDetail(dxflwPolyline, true))
                            .collect(Collectors.toList());
                    lift.setLifts(liftPolyLine);
                    lift.setPolylines(polylines);
                    floor.addLifts(lift);
                }
            }
    }

}
