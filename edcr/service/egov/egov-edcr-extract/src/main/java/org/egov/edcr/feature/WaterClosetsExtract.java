package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Room;
import org.egov.common.entity.edcr.RoomHeight;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WaterClosetsExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(WaterClosetsExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        List<DXFLWPolyline> rooms;
        List<Measurement> roomMeasurements;
        List<BigDecimal> roomHeights;
        List<RoomHeight> roomHeightsList;
        RoomHeight height;
        for (Block block : planDetail.getBlocks())
            if (block.getBuilding() != null && block.getBuilding().getFloors() != null)
                for (Floor f : block.getBuilding().getFloors()) {
                    String layerName = String.format(layerNames.getLayerName("LAYER_NAME_BLK_FLR_WC"), block.getNumber(),
                            f.getNumber());
                    rooms = Util.getPolyLinesByLayer(planDetail.getDoc(), layerName);
                    roomMeasurements = rooms.stream()
                            .map(flightPolyLine -> new MeasurementDetail(flightPolyLine, true)).collect(Collectors.toList());
                    f.setWaterClosets(new Room());
                    f.getWaterClosets().setRooms(roomMeasurements);
                    roomHeights = Util.getListOfDimensionValueByLayer(planDetail,
                            String.format(layerNames.getLayerName("LAYER_NAME_BLK_FLR_WC_HT"), block.getNumber(), f.getNumber()));
                    roomHeightsList = new ArrayList<>();
                    for (BigDecimal h : roomHeights) {
                        height = new RoomHeight();
                        height.setHeight(h);
                        roomHeightsList.add(height);
                    }
                    f.getWaterClosets().setHeights(roomHeightsList);
                }

        return planDetail;
    }

}
