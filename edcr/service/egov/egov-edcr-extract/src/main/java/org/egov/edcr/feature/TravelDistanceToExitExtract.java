package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TravelDistanceToExitExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(TravelDistanceToExitExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Travel Distance To Exit Extract......");
        if (pl != null) {
            String layerName = layerNames.getLayerName("LAYER_NAME_TRAVEL_DIST_TO_EXIT");
            List<BigDecimal> travelDistanceDimensions = Util.getListOfDimensionValueByLayer(pl, layerName);
            if (!travelDistanceDimensions.isEmpty())
                pl.setTravelDistancesToExit(travelDistanceDimensions);
        }
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Travel Distance To Exit Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        HashMap<String, String> errors = new HashMap<>();
        if (pl != null && pl.getTravelDistancesToExit().isEmpty()) {
            errors.put(DcrConstants.TRAVEL_DIST_EXIT,
                    edcrMessageSource.getMessage(DcrConstants.OBJECTNOTDEFINED,
                            new String[] { DcrConstants.TRAVEL_DIST_EXIT },
                            LocaleContextHolder.getLocale()));
            pl.addErrors(errors);
        }
        return pl;
    }
}
