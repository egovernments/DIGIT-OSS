package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Circle;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.SpiralStair;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFCircle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SpiralStairExtract extends FeatureExtract {

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail planDetail) {

        List<Block> blocks = planDetail.getBlocks();

        for (Block block : blocks)
            if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                outside: for (Floor floor : block.getBuilding().getFloors()) {
                    if (!block.getTypicalFloor().isEmpty())
                        for (TypicalFloor tp : block.getTypicalFloor())
                            if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
                                for (Floor allFloors : block.getBuilding().getFloors())
                                    if (allFloors.getNumber().equals(tp.getModelFloorNo()))
                                        if (!allFloors.getFireStairs().isEmpty()) {
                                            floor.setFireStairs(allFloors.getFireStairs());
                                            continue outside;
                                        }

                    // Layer name convention BLK_n_FLR_i_SPIRAL_FIRE_STAIR
                    String spiralStairLayerName = "BLK_" + block.getNumber() + "_FLR_" + floor.getNumber() + "_SPIRAL_FIRE_STAIR"
                            + "_+\\d";

                    List<String> spiralStairNames = Util.getLayerNamesLike(planDetail.getDoc(), spiralStairLayerName);
                    List<SpiralStair> spiralStairs = new ArrayList<>();

                    if (!spiralStairNames.isEmpty())
                        for (String spiralStairName : spiralStairNames) {
                            String[] array = spiralStairName.split("_");
                            if (array[7] != null && !array[7].isEmpty()) {
                                SpiralStair spiralStair = new SpiralStair();
                                spiralStair.setNumber(array[7]);
                                // extract polylines in BLK_n_FLR_i_SPIRAL_FIRE_STAIR_k
                                List<DXFCircle> spiralFireEscapeStairPolyLines = Util.getPolyCircleByLayer(planDetail.getDoc(),
                                        String.format(layerNames.getLayerName("LAYER_NAME_FLOOR_SPIRAL_STAIR"), block.getNumber(),
                                                floor.getNumber(), spiralStair.getNumber()));
                                List<Circle> circles = new ArrayList();
                                for (DXFCircle dxfCircle : spiralFireEscapeStairPolyLines) {
                                    spiralStair.setNumber(array[7]);
                                    Circle circle = new Circle();
                                    circle.setRadius(BigDecimal.valueOf(dxfCircle.getRadius()));
                                    circles.add(circle);
                                }
                                spiralStair.setCircles(circles);
                                spiralStairs.add(spiralStair);
                            }
                        }

                    floor.setSpiralStairs(spiralStairs);
                }

        return planDetail;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
