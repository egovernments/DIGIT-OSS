package org.egov.edcr.feature;

import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.LiquidWasteTreatementPlant;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WaterTreatmentPlantExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(WaterTreatmentPlantExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Water Treatment Plant Extract......");
        // Water treatement plant
        if (pl.getDoc().containsDXFLayer(layerNames.getLayerName("LAYER_NAME_INSITU_WASTE_TREATMENT_PLANT"))) {
            List<DXFLWPolyline> waterTreatementPlanPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                    layerNames.getLayerName("LAYER_NAME_INSITU_WASTE_TREATMENT_PLANT"));
            if (waterTreatementPlanPolyLines != null && !waterTreatementPlanPolyLines.isEmpty())
                for (DXFLWPolyline pline : waterTreatementPlanPolyLines) {
                    Measurement measurement = new MeasurementDetail(pline, true);
                    LiquidWasteTreatementPlant liquidWaste = new LiquidWasteTreatementPlant();
                    liquidWaste.setArea(measurement.getArea());
                    liquidWaste.setColorCode(measurement.getColorCode());
                    liquidWaste.setHeight(measurement.getHeight());
                    liquidWaste.setWidth(measurement.getWidth());
                    liquidWaste.setLength(measurement.getLength());
                    liquidWaste.setInvalidReason(measurement.getInvalidReason());
                    liquidWaste.setPresentInDxf(true);
                    pl.getUtility().addLiquidWasteTreatementPlant(liquidWaste);
                }
        }
        if (LOG.isInfoEnabled())
            LOG.info("End of Water Treatment Plant Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
