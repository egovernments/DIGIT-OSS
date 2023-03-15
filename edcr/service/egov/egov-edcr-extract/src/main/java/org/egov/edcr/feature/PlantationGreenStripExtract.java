package org.egov.edcr.feature;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlantationGreenStripExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(PlantationGreenStripExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        for (Block block : planDetail.getBlocks()) {
            String plantationGreenStrip = String.format(layerNames.getLayerName("LAYER_NAME_PLANTATION_GREENSTRIP"),
                    block.getNumber());
            List<DXFLWPolyline> plantationGreenStripes = Util.getPolyLinesByLayer(planDetail.getDoc(),
                    plantationGreenStrip);
            List<Measurement> plantationGreenStripeMeasurements = plantationGreenStripes.stream()
                    .map(flightPolyLine -> new MeasurementDetail(flightPolyLine, true)).collect(Collectors.toList());

            block.setPlantationGreenStripes(plantationGreenStripeMeasurements);
        }

        return planDetail;
    }

}
