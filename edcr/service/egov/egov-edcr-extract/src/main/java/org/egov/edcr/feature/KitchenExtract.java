package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Room;
import org.egov.common.entity.edcr.RoomHeight;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KitchenExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(KitchenExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Kitchen room Extract......");
        if (pl != null && !pl.getBlocks().isEmpty())
            for (Block block : pl.getBlocks())
                if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                    outside: for (Floor floor : block.getBuilding().getFloors()) {
                        if (!block.getTypicalFloor().isEmpty())
                            for (TypicalFloor tp : block.getTypicalFloor())
                                if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
                                    for (Floor allFloors : block.getBuilding().getFloors())
                                        if (allFloors.getNumber().equals(tp.getModelFloorNo()))
                                            if (allFloors.getKitchen() != null) {
                                                floor.setKitchen(allFloors.getKitchen());
                                                continue outside;
                                            }

                        List<DXFLWPolyline> kitchenPolyLines = new ArrayList<>();

                        String kitchenLayer = String.format(layerNames.getLayerName("LAYER_NAME_KITCHEN"), block.getNumber(),
                                floor.getNumber());
                        List<BigDecimal> kitchenHeight = Util.getListOfDimensionValueByLayer(pl, kitchenLayer);

                        List<DXFLWPolyline> residentialKitchenPolyLines = Util.getPolyLinesByLayerAndColor(pl.getDoc(),
                                kitchenLayer, DxfFileConstants.RESIDENTIAL_KITCHEN_ROOM_COLOR, pl);
                        List<DXFLWPolyline> residentialKitchenStorePolyLines = Util.getPolyLinesByLayerAndColor(
                                pl.getDoc(), kitchenLayer, DxfFileConstants.RESIDENTIAL_KITCHEN_STORE_ROOM_COLOR, pl);
                        List<DXFLWPolyline> residentialKitchenDiningPolyLines = Util.getPolyLinesByLayerAndColor(
                                pl.getDoc(), kitchenLayer, DxfFileConstants.RESIDENTIAL_KITCHEN_DINING_ROOM_COLOR, pl);
                        List<DXFLWPolyline> commercialKitchenPolyLines = Util.getPolyLinesByLayerAndColor(pl.getDoc(),
                                kitchenLayer, DxfFileConstants.COMMERCIAL_KITCHEN_ROOM_COLOR, pl);
                        List<DXFLWPolyline> commercialKitchenStorePolyLines = Util.getPolyLinesByLayerAndColor(
                                pl.getDoc(), kitchenLayer, DxfFileConstants.COMMERCIAL_KITCHEN_STORE_ROOM_COLOR, pl);
                        List<DXFLWPolyline> commercialKitchenDiningPolyLines = Util.getPolyLinesByLayerAndColor(
                                pl.getDoc(), kitchenLayer, DxfFileConstants.COMMERCIAL_KITCHEN_DINING_ROOM_COLOR, pl);

                        if (!residentialKitchenPolyLines.isEmpty())
                            kitchenPolyLines.addAll(residentialKitchenPolyLines);
                        if (!residentialKitchenStorePolyLines.isEmpty())
                            kitchenPolyLines.addAll(residentialKitchenStorePolyLines);
                        if (!residentialKitchenDiningPolyLines.isEmpty())
                            kitchenPolyLines.addAll(residentialKitchenDiningPolyLines);
                        if (!commercialKitchenPolyLines.isEmpty())
                            kitchenPolyLines.addAll(commercialKitchenPolyLines);
                        if (!commercialKitchenStorePolyLines.isEmpty())
                            kitchenPolyLines.addAll(commercialKitchenStorePolyLines);
                        if (!commercialKitchenDiningPolyLines.isEmpty())
                            kitchenPolyLines.addAll(commercialKitchenDiningPolyLines);

                        if (!kitchenHeight.isEmpty() || !kitchenPolyLines.isEmpty()) {
                            Room kitchen = new Room();
                            List<RoomHeight> kitchenHeights = new ArrayList<>();
                            if (!kitchenHeight.isEmpty()) {
                                for (BigDecimal height : kitchenHeight) {
                                    RoomHeight roomHeight = new RoomHeight();
                                    roomHeight.setHeight(height);
                                    kitchenHeights.add(roomHeight);
                                }
                                kitchen.setHeights(kitchenHeights);
                            }

                            if (kitchenPolyLines != null && !kitchenPolyLines.isEmpty()) {
                                List<Measurement> kitchens = kitchenPolyLines.stream()
                                        .map(acRoomPolyLine -> new MeasurementDetail(acRoomPolyLine, true))
                                        .collect(Collectors.toList());
                                kitchen.setRooms(kitchens);
                            }
                            floor.setKitchen(kitchen);
                        }

                    }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Kitchen Room Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}