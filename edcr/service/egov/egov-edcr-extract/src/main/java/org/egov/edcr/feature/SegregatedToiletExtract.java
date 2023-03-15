package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.SegregatedToilet;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SegregatedToiletExtract extends FeatureExtract {
    private static final Logger LOGGER = LogManager.getLogger(SegregatedToiletExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        SegregatedToilet segregatedToilet = new SegregatedToilet();
        ArrayList<MeasurementDetail> segregatedToiletMeasurement = new ArrayList<>();

        List<DXFLWPolyline> segregatedToilets = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_SEGREGATED_TOILET"));
        for (DXFLWPolyline pline : segregatedToilets)
            segregatedToiletMeasurement.add(new MeasurementDetail(pline, true));

        List<BigDecimal> distanceToMainEntrance = Util.getListOfDimensionValueByLayer(pl,
                layerNames.getLayerName("LAYER_NAME_SEGREGATED_TOILET"));

        segregatedToilet.setDistancesToMainEntrance(distanceToMainEntrance);
        pl.setSegregatedToilet(segregatedToilet);

        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
