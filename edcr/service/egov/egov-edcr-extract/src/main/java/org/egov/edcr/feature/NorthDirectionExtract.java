package org.egov.edcr.feature;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.NorthDirection;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NorthDirectionExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(NorthDirectionExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        DXFDocument doc = pl.getDoc();

        List<DXFLWPolyline> northDirectionPolyLines = Util.getPolyLinesByLayer(doc,
                layerNames.getLayerName("LAYER_NAME_NORTH_DIRECTION"));
        String direction = Util.getMtextByLayerName(doc, layerNames.getLayerName("LAYER_NAME_NORTH_DIRECTION"));
        if (!northDirectionPolyLines.isEmpty() || org.apache.commons.lang.StringUtils.isNotBlank(direction)) {
            pl.getDrawingPreference().setNorthDirection(new NorthDirection());
            pl.getDrawingPreference().getNorthDirection().setDirections(new ArrayList<>());

            for (DXFLWPolyline northDirectionPolyLine : northDirectionPolyLines)
                pl.getDrawingPreference().getNorthDirection().getDirections().add(new MeasurementDetail(northDirectionPolyLine, true));

            pl.getDrawingPreference().getNorthDirection().setDirection(direction);
        }

        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
