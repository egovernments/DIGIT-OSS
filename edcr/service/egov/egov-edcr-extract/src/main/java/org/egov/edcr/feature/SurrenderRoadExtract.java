
package org.egov.edcr.feature;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurrenderRoadExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(SurrenderRoadExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        List<DXFLWPolyline> surrenderRoads = Util.getPolyLinesByLayer(planDetail.getDoc(),
                layerNames.getLayerName("LAYER_NAME_SURRENDER_ROAD_WIDTH"));
        if (!surrenderRoads.isEmpty()) {
            List<Measurement> surrenderRoadMeasurements = surrenderRoads.stream()
                    .map(polyline -> new MeasurementDetail(polyline, true)).collect(Collectors.toList());
            planDetail.setSurrenderRoads(surrenderRoadMeasurements);
        }

        return planDetail;
    }

}
