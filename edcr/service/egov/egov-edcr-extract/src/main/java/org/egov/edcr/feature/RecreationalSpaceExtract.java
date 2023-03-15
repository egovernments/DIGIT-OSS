package org.egov.edcr.feature;

import java.math.BigDecimal;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecreationalSpaceExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(RecreationalSpaceExtract.class);
    public static final String SUB_RULE_50_DESC = "Recreational space for Residential Apartment ";
    public static final String SUB_RULE_50_DESC_CELLER = " Ground floor Recreational space ";
    public static final String SUB_RULE_50 = "50";
    public static final String SUB_RULE_50_2 = "50(2)";
    public static final String RECREATION = "RECREATION";
    public static final int TOTALNUMBEROFUNITS = 12;
    public static final BigDecimal THREE = BigDecimal.valueOf(3);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Recreational Space Extract......");
        String layerRegEx;
        for (Block block : pl.getBlocks())
            for (Floor floor : block.getBuilding().getFloors()) {
                layerRegEx = layerNames.getLayerName("LAYER_NAME_BLOCK_NAME_PREFIX") + block.getNumber() + "_"
                        + layerNames.getLayerName("LAYER_NAME_FLOOR_NAME_PREFIX") + floor.getNumber() + "_"
                        + RECREATION;
                for (DXFLWPolyline pline : Util.getPolyLinesByLayer(pl.getDoc(), layerRegEx))
                    for (Occupancy existingOcc : floor.getOccupancies())
                        if (OccupancyType.OCCUPANCY_A4.equals(existingOcc.getType()))
                            // defined
                            // only for apartment occupancies.
                            existingOcc.getRecreationalSpace().add(new MeasurementDetail(pline, true));
            }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Recreational Space Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
