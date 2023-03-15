
package org.egov.edcr.feature;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OverHangsExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(OverHangsExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        for (Block block : planDetail.getBlocks()) {
            String protectedBalcony = String.format(layerNames.getLayerName("LAYER_NAME_PROJECTED_BALCONY"), block.getNumber());
            List<DXFLWPolyline> protectedBalconies = Util.getPolyLinesByLayer(planDetail.getDoc(), protectedBalcony);
            List<Measurement> protectedBalconyMeasurements = protectedBalconies.stream()
                    .map(flightPolyLine -> new MeasurementDetail(flightPolyLine, true)).collect(Collectors.toList());

            block.setProtectedBalconies(protectedBalconyMeasurements);

            if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                for (Floor floor : block.getBuilding().getFloors()) {
                    String overhang = String.format(layerNames.getLayerName("LAYER_NAME_SHADE_OVERHANG"), block.getNumber(),
                            floor.getNumber());
                    List<DXFLWPolyline> overHangs = Util.getPolyLinesByLayer(planDetail.getDoc(), overhang);
                    List<Measurement> overHangMeasurements = overHangs.stream()
                            .map(flightPolyLine -> new MeasurementDetail(flightPolyLine, true))
                            .collect(Collectors.toList());
                    floor.setOverHangs(overHangMeasurements);
                }
        }

        return planDetail;
    }

}
