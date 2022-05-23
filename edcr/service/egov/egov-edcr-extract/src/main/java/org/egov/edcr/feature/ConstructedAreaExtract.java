package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConstructedAreaExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(ConstructedAreaExtract.class);

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        BigDecimal totalConstructedArea = BigDecimal.ZERO;
        for (Block block : planDetail.getBlocks()) {
            if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty()) {
                BigDecimal blockConstructedArea = BigDecimal.ZERO;
                outside: for (Floor floor : block.getBuilding().getFloors()) {
                    if (!block.getTypicalFloor().isEmpty()) {
                        for (TypicalFloor tp : block.getTypicalFloor()) {
                            if (tp.getRepetitiveFloorNos().contains(floor.getNumber())) {
                                for (Floor allFloors : block.getBuilding().getFloors()) {
                                    if (allFloors.getNumber().equals(tp.getModelFloorNo())) {
                                        if (!allFloors.getConstructedAreas().isEmpty()) {
                                            floor.setConstructedAreas(allFloors.getConstructedAreas());
                                            continue outside;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    String constructedAreaRegex = String.format(layerNames.getLayerName("LAYER_NAME_CONSTRUCTED_AREA"),
                            block.getNumber(), floor.getNumber());

                    List<String> constructedAreaLayers = Util.getLayerNamesLike(planDetail.getDoc(), constructedAreaRegex);
                    if (constructedAreaLayers != null && !constructedAreaLayers.isEmpty()) {
                        for (String constructedAreaLayer : constructedAreaLayers) {
                            List<DXFLWPolyline> polylines = Util.getPolyLinesByLayer(planDetail.getDoc(), constructedAreaLayer);
                            if (polylines != null && !polylines.isEmpty()) {
                                List<Measurement> constructedAreas = polylines.stream()
                                        .map(dxflwPolyline -> new MeasurementDetail(dxflwPolyline, true))
                                        .collect(Collectors.toList());

                                floor.setConstructedAreas(constructedAreas);

                                List<BigDecimal> areaList = constructedAreas.stream()
                                        .map(constructedArea -> constructedArea.getArea()).collect(Collectors.toList());
                                BigDecimal constructedArea = areaList.stream().reduce(BigDecimal.ZERO, BigDecimal::add);

                                blockConstructedArea = blockConstructedArea.add(constructedArea);
                            }
                        }
                    }
                }

                block.getBuilding().setTotalConstructedArea(blockConstructedArea);

                totalConstructedArea = totalConstructedArea.add(blockConstructedArea);
            }
        }

        if (planDetail.getVirtualBuilding() != null) {
            planDetail.getVirtualBuilding().setTotalConstructedArea(totalConstructedArea);
        }
        return planDetail;
    }

}
