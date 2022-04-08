package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.SupplyLine;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupplyLineUtilityExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(SupplyLineUtilityExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Supply Line Utilities Extract......");
        String layerName = layerNames.getLayerName("LAYER_NAME_SUPPLY_LINE");
        SupplyLine supplyLine = new SupplyLine();
        if (pl.getDoc().containsDXFLayer(layerName)) {
            List<DXFLWPolyline> supplyLinePolygons = Util.getPolyLinesByLayer(pl.getDoc(), layerName);
            if (supplyLinePolygons != null && !supplyLinePolygons.isEmpty()) {
                List<Measurement> supplyLines = new ArrayList<>();
                for (DXFLWPolyline polygon : supplyLinePolygons) {
                    Measurement measurement = new MeasurementDetail(polygon, true);
                    measurement.setName(layerName);
                    supplyLines.add(measurement);
                }
                supplyLine.setSupplyLines(supplyLines);
            }
            Map<Integer, List<BigDecimal>> distances = Util.extractAndMapDimensionValuesByColorCode(pl, layerName);
            supplyLine.setDistances(distances);
            pl.getUtility().setSupplyLine(supplyLine);
        }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Supply Line Utilities Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
