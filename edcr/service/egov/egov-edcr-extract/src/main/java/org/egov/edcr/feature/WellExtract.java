package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.RoadOutput;
import org.egov.common.entity.edcr.WellUtility;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFCircle;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WellExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(WellExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Well Extract......");
        // Well Utility
        if (pl.getDoc().containsDXFLayer(layerNames.getLayerName("LAYER_NAME_WELL"))) {
            List<DXFCircle> wellCircle = Util.getPolyCircleByLayer(pl.getDoc(),
                    layerNames.getLayerName("LAYER_NAME_WELL"));
            List<DXFLWPolyline> wellPolygon = new ArrayList<>();
            if (wellCircle.isEmpty())
                wellPolygon = Util.getPolyLinesByLayer(pl.getDoc(), layerNames.getLayerName("LAYER_NAME_WELL"));
            if (!wellCircle.isEmpty())
                for (DXFCircle circle : wellCircle) {
                    WellUtility well = new WellUtility();
                    well.setPresentInDxf(true);
                    well.setColorCode(circle.getColor());
                    if (circle.getColor() == 1)
                        well.setType("Existing");
                    else if (circle.getColor() == 2)
                        well.setType("Proposed");
                    pl.getUtility().addWells(well);
                }
            else if (wellPolygon != null && !wellPolygon.isEmpty())
                for (DXFLWPolyline polygon : wellPolygon) {
                    Measurement measurement = new MeasurementDetail(polygon, true);
                    WellUtility well = (WellUtility) measurement;
                    well.setColorCode(polygon.getColor());
                    well.setPresentInDxf(true);
                    if (polygon.getColor() == 1)
                        well.setType(DcrConstants.EXISTING);
                    else if (polygon.getColor() == 2)
                        well.setType(DcrConstants.PROPOSED);
                    pl.getUtility().addWells(well);
                }
            List<RoadOutput> distFrmWellWithColor = extractDistanceWithColourCode(pl,
                    layerNames.getLayerName("LAYER_NAME_DIST_WELL"));
            if (!distFrmWellWithColor.isEmpty())
                pl.getUtility().setWellDistance(distFrmWellWithColor);
        }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Well Extract......");
        return pl;
    }

    private List<RoadOutput> extractDistanceWithColourCode(PlanDetail pl, String layerName) {
        List<RoadOutput> shortDistainceFromCenter = new ArrayList<>();

        Map<Integer, List<BigDecimal>> distancesWithColor = Util.extractAndMapDimensionValuesByColorCode(pl, layerName);
        if (!distancesWithColor.isEmpty())
            for (Map.Entry<Integer, List<BigDecimal>> distanceByColor : distancesWithColor.entrySet()) {
                if(!distanceByColor.getValue().isEmpty()) {
                    RoadOutput roadOutput = new RoadOutput();
                    roadOutput.distance = distanceByColor.getValue().get(0);
                    roadOutput.colourCode = String.valueOf(distanceByColor.getKey());
                    shortDistainceFromCenter.add(roadOutput);
                }
            }
        return shortDistainceFromCenter;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
