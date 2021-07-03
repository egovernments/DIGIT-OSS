package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Footpath;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FootpathServiceExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(FootpathServiceExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Footpath Extract......");
        String layerNameRegex = layerNames.getLayerName("LAYER_NAME_FOOTPATH") + "_+\\d";
        List<String> footpathLayerNames = Util.getLayerNamesLike(pl.getDoc(), layerNameRegex);
        Footpath footpath = new Footpath();
        if (!footpathLayerNames.isEmpty()) {
            for (String layerName : footpathLayerNames) {
                List<DXFLWPolyline> footpathPolygons = Util.getPolyLinesByLayer(pl.getDoc(), layerName);
                if (footpathPolygons != null && !footpathPolygons.isEmpty()) {
                    List<Measurement> footpaths = new ArrayList<>();
                    for (DXFLWPolyline polygon : footpathPolygons) {
                        Measurement measurement = new MeasurementDetail(polygon, true);
                        measurement.setName(layerName);
                        footpaths.add(measurement);
                    }
                    footpath.setFootpaths(footpaths);
                }
                Map<Integer, List<BigDecimal>> distances = Util.extractAndMapDimensionValuesByColorCode(pl, layerName);
                footpath.setDistancesFromBuilding(distances);
                pl.getDistanceToExternalEntity().setFootpath(footpath);
            }
        }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Footpath Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
