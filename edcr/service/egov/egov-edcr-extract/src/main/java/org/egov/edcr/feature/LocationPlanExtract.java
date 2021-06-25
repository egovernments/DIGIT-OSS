package org.egov.edcr.feature;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationPlanExtract extends FeatureExtract {

    private static final Logger LOG = Logger.getLogger(LocationPlanExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        DXFDocument doc = pl.getDoc();

        List<DXFLWPolyline> locationPlanPolyLines = Util.getPolyLinesByLayer(doc,
                layerNames.getLayerName("LAYER_NAME_LOCATION_PLAN"));

        if (!locationPlanPolyLines.isEmpty()) {
            pl.getDrawingPreference().setLocationPlans(new ArrayList<>());
            for (DXFLWPolyline locationPlanPolyLine : locationPlanPolyLines)
                pl.getDrawingPreference().getLocationPlans().add(new MeasurementDetail(locationPlanPolyLine, true));
        }
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
