package org.egov.edcr.feature;

import java.util.List;

import org.apache.log4j.Logger;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SolarWaterHeatingExtract extends FeatureExtract {
    private static final Logger LOGGER = Logger.getLogger(SolarWaterHeatingExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOGGER.isInfoEnabled())
            LOGGER.info("Starting of SolarWaterHeating Extract......");

        List<DXFLWPolyline> swhPolylines = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_SOLAR_WATER_HEATING"));
        for (DXFLWPolyline pline : swhPolylines)
            pl.getUtility().getSolarWaterHeatingSystems().add(new MeasurementDetail(pline, true));

        if (LOGGER.isInfoEnabled())
            LOGGER.info("End of SolarWaterHeating Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
