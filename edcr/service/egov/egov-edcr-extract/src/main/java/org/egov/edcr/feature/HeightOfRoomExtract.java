package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.Room;
import org.egov.common.entity.edcr.RoomHeight;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.OccupancyDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HeightOfRoomExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(HeightOfRoomExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {

        Map<String, Integer> roomOccupancyFeature = pl.getSubFeatureColorCodesMaster().get("HeightOfRoom");
        Set<String> roomOccupancyTypes = new HashSet<>();
        roomOccupancyTypes.addAll(roomOccupancyFeature.keySet());
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Height Of Room Extract......");
        if (pl != null && !pl.getBlocks().isEmpty())
            for (Block block : pl.getBlocks())
                if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                    outside: for (Floor floor : block.getBuilding().getFloors()) {
                        if (!block.getTypicalFloor().isEmpty())
                            for (TypicalFloor tp : block.getTypicalFloor())
                                if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
                                    for (Floor allFloors : block.getBuilding().getFloors())
                                        if (allFloors.getNumber().equals(tp.getModelFloorNo())) {
                                            if (allFloors.getAcRooms() != null)
                                                floor.setAcRooms(allFloors.getAcRooms());
                                            if (allFloors.getRegularRooms() != null)
                                                floor.setRegularRooms(allFloors.getRegularRooms());
                                            continue outside;
                                        }

                        /*
                         * Extract AC room
                         */
                        Map<Integer, List<BigDecimal>> acRoomHeightMap = new HashMap<>();

                        String acRoomLayerName = String.format(layerNames.getLayerName("LAYER_NAME_AC_ROOM"),
                                block.getNumber(), floor.getNumber(), "+\\d");

                        List<String> acRoomLayers = Util.getLayerNamesLike(pl.getDoc(), acRoomLayerName);

                        if (!acRoomLayers.isEmpty()) {

                            for (String acRoomLayer : acRoomLayers) {

                                for (String type : roomOccupancyTypes) {
                                    Integer colorCode = roomOccupancyFeature.get(type);
                                    List<BigDecimal> acRoomheights = Util.getListOfDimensionByColourCode(pl,
                                            acRoomLayer, colorCode);
                                    if (!acRoomheights.isEmpty())
                                        acRoomHeightMap.put(colorCode, acRoomheights);
                                }

                                List<DXFLWPolyline> acRoomPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                        acRoomLayer);

                                if (!acRoomHeightMap.isEmpty() || !acRoomPolyLines.isEmpty()) {
                                    boolean isClosed = acRoomPolyLines.stream()
                                            .allMatch(dxflwPolyline -> dxflwPolyline.isClosed());

                                    Room acRoom = new Room();
                                    String[] roomNo = acRoomLayer.split("_");
                                    if (roomNo != null && roomNo.length == 7) {
                                        acRoom.setNumber(roomNo[6]);
                                    }
                                    acRoom.setClosed(isClosed);

                                    List<RoomHeight> acRoomHeights = new ArrayList<>();
                                    if (!acRoomPolyLines.isEmpty()) {
                                        List<Measurement> acRooms = new ArrayList<Measurement>();
                                        acRoomPolyLines.stream().forEach(arp -> {
                                            Measurement m = new MeasurementDetail(arp, true);
                                            if (!acRoomHeightMap.isEmpty() && acRoomHeightMap.containsKey(m.getColorCode())) {
                                                for (BigDecimal value : acRoomHeightMap.get(m.getColorCode())) {
                                                    RoomHeight roomHeight = new RoomHeight();
                                                    roomHeight.setColorCode(m.getColorCode());
                                                    roomHeight.setHeight(value);
                                                    acRoomHeights.add(roomHeight);
                                                }
                                                acRoom.setHeights(acRoomHeights);
                                            }
                                            acRooms.add(m);
                                        });

                                        // Extract the Mezzanine Area if is declared at ac room level
                                        String acRoomMezzLayerRegExp = String
                                                .format(layerNames.getLayerName("LAYER_NAME_MEZZANINE_AT_ACROOM"),
                                                        block.getNumber(), floor.getNumber(), acRoom.getNumber(), "+\\d");
                                        List<String> acRoomMezzLayers = Util.getLayerNamesLike(pl.getDoc(),
                                                acRoomMezzLayerRegExp);
                                        if (!acRoomMezzLayers.isEmpty()) {
                                            for (String layerName : acRoomMezzLayers) {
                                                List<Occupancy> roomMezzanines = new ArrayList<>();
                                                String[] array = layerName.split("_");
                                                String mezzanineNo = array[8];
                                                List<DXFLWPolyline> mezzaninePolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                                        layerName);
                                                if (!mezzaninePolyLines.isEmpty())
                                                    for (DXFLWPolyline polyline : mezzaninePolyLines) {
                                                        OccupancyDetail occupancy = new OccupancyDetail();
                                                        occupancy.setColorCode(polyline.getColor());
                                                        occupancy.setMezzanineNumber(mezzanineNo);
                                                        occupancy.setIsMezzanine(true);
                                                        occupancy.setBuiltUpArea(Util.getPolyLineArea(polyline));
                                                        occupancy.setTypeHelper(Util.findOccupancyType(polyline, pl));
                                                        List<BigDecimal> heights = Util.getListOfDimensionValueByLayer(pl,
                                                                layerName);
                                                        if (!heights.isEmpty())
                                                            occupancy.setHeight(Collections.max(heights));
                                                        roomMezzanines.add(occupancy);
                                                    }
                                                acRoom.setMezzanineAreas(roomMezzanines);
                                            }
                                        }

                                        acRoom.setRooms(acRooms);
                                    }
                                    floor.addAcRoom(acRoom);
                                }

                            }

                        }

                        /*
                         * Extract regular room
                         */
                        Map<Integer, List<BigDecimal>> roomHeightMap = new HashMap<>();

                        String regularRoomLayerName = String.format(layerNames.getLayerName("LAYER_NAME_REGULAR_ROOM"),
                                block.getNumber(), floor.getNumber(), "+\\d");

                        List<String> regularRoomLayers = Util.getLayerNamesLike(pl.getDoc(), regularRoomLayerName);

                        if (!regularRoomLayers.isEmpty()) {

                            for (String regularRoomLayer : regularRoomLayers) {

                                for (String type : roomOccupancyTypes) {
                                    Integer colorCode = roomOccupancyFeature.get(type);
                                    List<BigDecimal> regularRoomheights = Util.getListOfDimensionByColourCode(pl,
                                            regularRoomLayer, colorCode);
                                    if (!regularRoomheights.isEmpty())
                                        roomHeightMap.put(colorCode, regularRoomheights);
                                }

                                List<DXFLWPolyline> roomPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                        regularRoomLayer);

                                if (!roomHeightMap.isEmpty() || !roomPolyLines.isEmpty()) {

                                    boolean isClosed = roomPolyLines.stream()
                                            .allMatch(dxflwPolyline -> dxflwPolyline.isClosed());

                                    Room room = new Room();
                                    String[] roomNo = regularRoomLayer.split("_");
                                    if (roomNo != null && roomNo.length == 7) {
                                        room.setNumber(roomNo[6]);
                                    }
                                    room.setClosed(isClosed);

                                    List<RoomHeight> roomHeights = new ArrayList<>();
                                    if (!roomPolyLines.isEmpty()) {
                                        List<Measurement> rooms = new ArrayList<Measurement>();
                                        roomPolyLines.stream().forEach(rp -> {
                                            Measurement m = new MeasurementDetail(rp, true);
                                            if (!roomHeightMap.isEmpty() && roomHeightMap.containsKey(m.getColorCode())) {
                                                for (BigDecimal value : roomHeightMap.get(m.getColorCode())) {
                                                    RoomHeight roomHeight = new RoomHeight();
                                                    roomHeight.setColorCode(m.getColorCode());
                                                    roomHeight.setHeight(value);
                                                    roomHeights.add(roomHeight);
                                                }
                                                room.setHeights(roomHeights);
                                            }
                                            rooms.add(m);
                                        });
                                        // Extract the Mezzanine Area if is declared at ac room level
                                        String regularRoomMezzLayerRegExp = String
                                                .format(layerNames.getLayerName("LAYER_NAME_MEZZANINE_AT_ROOM"),
                                                        block.getNumber(), floor.getNumber(), room.getNumber(), "+\\d");
                                        List<String> regularRoomMezzLayers = Util.getLayerNamesLike(pl.getDoc(),
                                                regularRoomMezzLayerRegExp);
                                        if (!regularRoomMezzLayers.isEmpty()) {
                                            for (String layerName : regularRoomMezzLayers) {
                                                List<Occupancy> roomMezzanines = new ArrayList<>();
                                                String[] array = layerName.split("_");
                                                String mezzanineNo = array[8];
                                                List<DXFLWPolyline> mezzaninePolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                                                        layerName);
                                                if (!mezzaninePolyLines.isEmpty())
                                                    for (DXFLWPolyline polyline : mezzaninePolyLines) {
                                                        OccupancyDetail occupancy = new OccupancyDetail();
                                                        occupancy.setColorCode(polyline.getColor());
                                                        occupancy.setMezzanineNumber(mezzanineNo);
                                                        occupancy.setIsMezzanine(true);
                                                        occupancy.setBuiltUpArea(Util.getPolyLineArea(polyline));
                                                        occupancy.setTypeHelper(Util.findOccupancyType(polyline, pl));
                                                        List<BigDecimal> heights = Util.getListOfDimensionValueByLayer(pl,
                                                                layerName);
                                                        if (!heights.isEmpty())
                                                            occupancy.setHeight(Collections.max(heights));
                                                        roomMezzanines.add(occupancy);
                                                    }
                                                room.setMezzanineAreas(roomMezzanines);
                                            }
                                        }
                                        room.setRooms(rooms);
                                    }
                                    floor.addRegularRoom(room);
                                }
                            }
                        }
                    }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Height Of Room Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}