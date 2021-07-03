package org.egov.edcr.feature;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.GuardRoom;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GuardRoomExtract extends FeatureExtract {
    private static final Logger LOGGER = Logger.getLogger(GuardRoomExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOGGER.isInfoEnabled())
            LOGGER.info("Starting of GuardRoom Extract......");

        pl.setGuardRoom(new GuardRoom());
        pl.getGuardRoom().setGuardRooms(new ArrayList<>());

        List<DXFLWPolyline> guardRoomPolylines = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_GUARD_ROOM"));
        for (DXFLWPolyline pline : guardRoomPolylines)
            pl.getGuardRoom().getGuardRooms().add(new MeasurementDetail(pline, true));

        pl.getGuardRoom()
                .setCabinHeights(
                        Util.getListOfDimensionValueByLayer(pl, layerNames.getLayerName("LAYER_NAME_GUARD_ROOM")));

        if (LOGGER.isInfoEnabled())
            LOGGER.info("End of GuardRoom Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
