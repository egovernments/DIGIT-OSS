package org.egov.edcr.feature;

import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.WasteWaterRecyclePlant;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecycleWasteWaterExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(RecycleWasteWaterExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Recycle Waste Water Extract......");
        // Recycling waste water
        if (pl.getDoc().containsDXFLayer(layerNames.getLayerName("LAYER_NAME_RECYCLING_WASTE_WATER"))) {
            List<DXFLWPolyline> recycleWasteWaterPolyline = Util.getPolyLinesByLayer(pl.getDoc(),
                    layerNames.getLayerName("LAYER_NAME_RECYCLING_WASTE_WATER"));
            if (recycleWasteWaterPolyline != null && !recycleWasteWaterPolyline.isEmpty())
                for (DXFLWPolyline pline : recycleWasteWaterPolyline) {
                    Measurement measurement = new MeasurementDetail(pline, true);
                    WasteWaterRecyclePlant waterWaterRecyclePlant = new WasteWaterRecyclePlant();
                    waterWaterRecyclePlant.setArea(measurement.getArea());
                    waterWaterRecyclePlant.setColorCode(measurement.getColorCode());
                    waterWaterRecyclePlant.setHeight(measurement.getHeight());
                    waterWaterRecyclePlant.setWidth(measurement.getWidth());
                    waterWaterRecyclePlant.setLength(measurement.getLength());
                    waterWaterRecyclePlant.setInvalidReason(measurement.getInvalidReason());
                    waterWaterRecyclePlant.setPresentInDxf(true);
                    pl.getUtility().addWasteWaterRecyclePlant(waterWaterRecyclePlant);
                }
        }
        if (LOG.isInfoEnabled())
            LOG.info("End of Recycle Waste Water Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
