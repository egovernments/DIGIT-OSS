package org.egov.edcr.feature;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Plantation;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlantationExtract extends FeatureExtract {
    private static final Logger LOGGER = Logger.getLogger(PlantationExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOGGER.isInfoEnabled())
            LOGGER.info("Starting of Plantation Extract......");

        pl.setPlantation(new Plantation());
        pl.getPlantation().setPlantations(new ArrayList<>());

        List<DXFLWPolyline> plantationPolylines = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_PLANTATION_TREECOVER"));
        for (DXFLWPolyline pline : plantationPolylines)
            pl.getPlantation().getPlantations().add(new MeasurementDetail(pline, true));

        if (LOGGER.isInfoEnabled())
            LOGGER.info("End of Plantation Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
