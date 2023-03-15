package org.egov.edcr.feature;

import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Solar;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SolarExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(SolarExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Solar Extract......");
        // Solar Water Heating Utility
        if (pl.getDoc().containsDXFLayer(layerNames.getLayerName("LAYER_NAME_SOLAR"))) {
            List<DXFLWPolyline> solarPolyline = Util.getPolyLinesByLayer(pl.getDoc(),
                    layerNames.getLayerName("LAYER_NAME_SOLAR"));
            if (solarPolyline != null && !solarPolyline.isEmpty())
                for (DXFLWPolyline pline : solarPolyline) {
                    Measurement measurement = new MeasurementDetail(pline, true);
                    Solar solar = new Solar();
                    solar.setArea(measurement.getArea());
                    solar.setColorCode(measurement.getColorCode());
                    solar.setHeight(measurement.getHeight());
                    solar.setWidth(measurement.getWidth());
                    solar.setLength(measurement.getLength());
                    solar.setInvalidReason(measurement.getInvalidReason());
                    solar.setPresentInDxf(true);
                    pl.getUtility().addSolar(solar);
                }
        }
        if (LOG.isInfoEnabled())
            LOG.info("End of Solar Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
