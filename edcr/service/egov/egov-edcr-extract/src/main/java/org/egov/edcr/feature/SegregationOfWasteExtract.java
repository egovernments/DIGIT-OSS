package org.egov.edcr.feature;

import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SegregationOfWasteExtract extends FeatureExtract {
    private static final Logger LOGGER = LogManager.getLogger(SegregationOfWasteExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOGGER.isInfoEnabled())
            LOGGER.info("Starting of SegregationOfWaste Extract......");

        List<DXFLWPolyline> sowPolylines = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_SEGREGATION_OF_WASTE"));
        for (DXFLWPolyline pline : sowPolylines)
            pl.getUtility().getSegregationOfWaste().add(new MeasurementDetail(pline, true));

        if (LOGGER.isInfoEnabled())
            LOGGER.info("End of SegregationOfWaste Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
