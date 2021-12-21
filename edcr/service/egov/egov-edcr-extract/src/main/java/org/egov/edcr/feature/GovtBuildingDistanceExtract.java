package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.List;

import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GovtBuildingDistanceExtract extends FeatureExtract {

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        List<BigDecimal> distancesFromGovtBuilding = Util.getListOfDimensionValueByLayer(pl,
                layerNames.getLayerName("LAYER_NAME_DISTANCE_FROM_GOVT_BLDG"));
        pl.getDistanceToExternalEntity().setGovtBuildings(distancesFromGovtBuilding);

        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {

        return pl;
    }

}
