package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Drinage;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DrinageServiceExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(DrinageServiceExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Drinage Extract......");
        Drinage drinage = new Drinage();
        String layerNameRegex = layerNames.getLayerName("LAYER_NAME_DRAIN_DISTANCE") + "_+\\d";
        List<String> drinageLayerNames = Util.getLayerNamesLike(pl.getDoc(), layerNameRegex);
        if (!drinageLayerNames.isEmpty()) {
            for (String layerName : drinageLayerNames) {
                List<DXFLWPolyline> drinagePolygons = Util.getPolyLinesByLayer(pl.getDoc(), layerName);
                if (drinagePolygons != null && !drinagePolygons.isEmpty()) {
                    List<Measurement> drinages = new ArrayList<>();
                    for (DXFLWPolyline polygon : drinagePolygons) {
                        Measurement measurement = new MeasurementDetail(polygon, true);
                        measurement.setName(layerName);
                        drinages.add(measurement);
                    }
                    drinage.setDrinages(drinages);
                }
                Map<Integer, List<BigDecimal>> distances = Util.extractAndMapDimensionValuesByColorCode(pl, layerName);
                drinage.setDistancesFromBuilding(distances);
                pl.getDistanceToExternalEntity().setDrinage(drinage);
            }
        }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Drinage Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
