
package org.egov.edcr.feature;

import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.SolidLiqdWasteTrtmnt;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SolidLiquidWasteTreatmentExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(SolidLiquidWasteTreatmentExtract.class);
    public static final String SUBRULE_55_11_DESC = "Collection and disposal of solid and liquid Waste";
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Solid Liquid Waste Treatment Extract......");
        // Solid liquid waste treatment
        if (pl.getDoc().containsDXFLayer(layerNames.getLayerName("LAYER_NAME_SOLID_LIQUID_WASTE_TREATMENT"))) {
            List<DXFLWPolyline> solidLiquidWastePolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                    layerNames.getLayerName("LAYER_NAME_SOLID_LIQUID_WASTE_TREATMENT"));
            if (!solidLiquidWastePolyLines.isEmpty())
                for (DXFLWPolyline polyLine : solidLiquidWastePolyLines) {
                    Measurement measurement = new MeasurementDetail(polyLine, true);
                    SolidLiqdWasteTrtmnt solidLiqdWasteTrtmnt = new SolidLiqdWasteTrtmnt();
                    solidLiqdWasteTrtmnt.setArea(measurement.getArea());
                    solidLiqdWasteTrtmnt.setColorCode(measurement.getColorCode());
                    solidLiqdWasteTrtmnt.setHeight(measurement.getHeight());
                    solidLiqdWasteTrtmnt.setWidth(measurement.getWidth());
                    solidLiqdWasteTrtmnt.setLength(measurement.getLength());
                    solidLiqdWasteTrtmnt.setInvalidReason(measurement.getInvalidReason());
                    solidLiqdWasteTrtmnt.setPresentInDxf(true);
                    pl.getUtility().addSolidLiqdWasteTrtmnt(solidLiqdWasteTrtmnt);
                }
        }
        if (LOG.isInfoEnabled())
            LOG.info("End of Solid Liquid Waste Treatment Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }
}
