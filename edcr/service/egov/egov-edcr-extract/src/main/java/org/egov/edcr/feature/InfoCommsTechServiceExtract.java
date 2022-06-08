package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.ICT;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.RoomHeight;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InfoCommsTechServiceExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(InfoCommsTechServiceExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of ICT Extract......");
        String layerNameRegex = String.format(layerNames.getLayerName("LAYER_NAME_ICT_LP"), "+\\d");
        List<String> ictLayerNames = Util.getLayerNamesLike(pl.getDoc(), layerNameRegex);
        if (!ictLayerNames.isEmpty()) {
            for (String layerName : ictLayerNames) {
                ICT ict = new ICT();
                String[] ictLayerArr = layerName.split("_");
                String ictNo = ictLayerArr[3];
                Map<Integer, List<BigDecimal>> floorHeights = Util.extractAndMapDimensionValuesByColorCode(pl, layerName);
                for (Map.Entry<Integer, List<BigDecimal>> height : floorHeights.entrySet()) {
                    RoomHeight roomHeight = new RoomHeight();
                    roomHeight.setColorCode(height.getKey());
                    roomHeight.setHeight(height.getValue().isEmpty() ? BigDecimal.ZERO : height.getValue().get(0));
                    ict.getHeights().add(roomHeight);
                }

                List<DXFLWPolyline> ictPolygons = Util.getPolyLinesByLayer(pl.getDoc(), layerName);
                if (ictPolygons != null && !ictPolygons.isEmpty()) {
                    for (DXFLWPolyline polygon : ictPolygons) {
                        Measurement room = new MeasurementDetail(polygon, true);
                        ict.setNumber(ictNo);
                        ict.getRooms().add(room);
                        String ictLightAndVentLayerName = String
                                .format(layerNames.getLayerName("LAYER_NAME_ICT_LP_LIGHT_VENTILATION"), ictNo, "+\\d");
                        List<String> ictLightAndVentLayers = Util.getLayerNamesLike(pl.getDoc(), ictLightAndVentLayerName);
                        if (!ictLightAndVentLayers.isEmpty()) {
                            for (String ictRoomLVLayer : ictLightAndVentLayers) {
                                List<DXFLWPolyline> lightAndventilations = Util.getPolyLinesByLayer(pl.getDoc(),
                                        ictRoomLVLayer);
                                if (!lightAndventilations.isEmpty()) {
                                    List<Measurement> lightAndventilationMeasurements = lightAndventilations.stream()
                                            .map(polyline -> new MeasurementDetail(polyline, true))
                                            .collect(Collectors.toList());
                                    ict.getLightAndVentilation().setMeasurements(lightAndventilationMeasurements);

                                    ict.getLightAndVentilation()
                                            .setHeightOrDepth((Util.getListOfDimensionValueByLayer(pl, ictRoomLVLayer)));
                                }
                            }
                        }
                        String ictDoorLayerName = String
                                .format(layerNames.getLayerName("LAYER_NAME_ICT_LP_DOOR"), ictNo, "+\\d");
                        List<String> ictDoorLayers = Util.getLayerNamesLike(pl.getDoc(), ictDoorLayerName);
                        for (String ictRoomDoorLayer : ictDoorLayers) {
                            List<DXFLWPolyline> ictDoorPolygons = Util.getPolyLinesByLayer(pl.getDoc(), ictRoomDoorLayer);
                            if (ictDoorPolygons != null && !ictDoorPolygons.isEmpty()) {
                                for (DXFLWPolyline doorPolygon : ictDoorPolygons) {
                                    Measurement ictDoor = new MeasurementDetail(doorPolygon, true);
                                    List<BigDecimal> widths = Util.getListOfDimensionByColourCode(pl, ictRoomDoorLayer,
                                            DxfFileConstants.DIMENSION_WIDTH_COLOR_CODE);
                                    if (!widths.isEmpty())
                                        ictDoor.setWidth(widths.get(0));
                                    List<BigDecimal> lengths = Util.getListOfDimensionByColourCode(pl, ictRoomDoorLayer,
                                            DxfFileConstants.DIMENSION_LENGTH_COLOR_CODE);
                                    if (!lengths.isEmpty())
                                        ictDoor.setLength(lengths.get(0));
                                    List<BigDecimal> heights = Util.getListOfDimensionByColourCode(pl,
                                            ictRoomDoorLayer,
                                            DxfFileConstants.DIMENSION_HEIGHT_COLOR_CODE);
                                    if (!heights.isEmpty())
                                        ictDoor.setHeight(heights.get(0));
                                    ict.getDoors().add(ictDoor);
                                }
                            }

                        }

                    }
                }
                pl.getIcts().add(ict);
            }
        }
        if (LOG.isDebugEnabled())
            LOG.debug("End of ICT Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
