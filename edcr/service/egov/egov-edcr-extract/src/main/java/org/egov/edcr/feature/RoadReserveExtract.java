
package org.egov.edcr.feature;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Road;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoadReserveExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(RoadReserveExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Road Reserve Extract......");
        String layerName = layerNames.getLayerName("LAYER_NAME_ROAD_RESERVE_FRONT");
        List<Road> roadReserves = new ArrayList<>();
        List<DXFLWPolyline> roadReserveFront = Util.getPolyLinesByLayer(planDetail.getDoc(), layerName);
        if (roadReserveFront != null && !roadReserveFront.isEmpty()) {
            List<Road> roadReservFronts = new ArrayList<>();
            for (DXFLWPolyline polygon : roadReserveFront)
                roadReservFronts.add(buildRoadReserveDetails(planDetail, layerName, polygon));
            roadReserves.addAll(roadReservFronts);
        }
        String layerName1 = layerNames.getLayerName("LAYER_NAME_ROAD_RESERVE_REAR");
        List<DXFLWPolyline> roadReserveRear = Util.getPolyLinesByLayer(planDetail.getDoc(),
                layerName1);
        if (roadReserveRear != null && !roadReserveRear.isEmpty()) {
            List<Road> rearRoadReserves = new ArrayList<>();
            for (DXFLWPolyline polygon : roadReserveRear)
                rearRoadReserves.add(buildRoadReserveDetails(planDetail, layerName1, polygon));
            roadReserves.addAll(rearRoadReserves);
        }
        String layerName2 = layerNames.getLayerName("LAYER_NAME_ROAD_RESERVE_SIDE1");
        List<DXFLWPolyline> roadReserveSide1 = Util.getPolyLinesByLayer(planDetail.getDoc(),
                layerName2);
        if (roadReserveSide1 != null && !roadReserveSide1.isEmpty()) {
            List<Road> sideRoadReserve = new ArrayList<>();
            for (DXFLWPolyline polygon : roadReserveSide1)
                sideRoadReserve.add(buildRoadReserveDetails(planDetail, layerName2, polygon));
            roadReserves.addAll(sideRoadReserve);
        }
        String layerName3 = layerNames.getLayerName("LAYER_NAME_ROAD_RESERVE_SIDE2");
        List<DXFLWPolyline> roadReserveSide2 = Util.getPolyLinesByLayer(planDetail.getDoc(),
                layerName3);
        if (roadReserveSide2 != null && !roadReserveSide2.isEmpty()) {
            List<Road> side2RoadReserves = new ArrayList<>();
            for (DXFLWPolyline polygon : roadReserveSide2)
                side2RoadReserves.add(buildRoadReserveDetails(planDetail, layerName3, polygon));
            roadReserves.addAll(side2RoadReserves);
        }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Road Reserve Extract......");
        planDetail.setRoadReserves(roadReserves);
        return planDetail;
    }

    private Road buildRoadReserveDetails(PlanDetail planDetail, String layerName, DXFLWPolyline polygon) {
        Measurement measurement = new MeasurementDetail(polygon, true);
        Road road = new Road();
        road.setName(layerName);
        road.setArea(measurement.getArea());
        road.setColorCode(measurement.getColorCode());
        road.setHeight(measurement.getHeight());
        road.setWidth(measurement.getWidth());
        road.setLength(measurement.getLength());
        road.setMinimumSide(measurement.getMinimumSide());
        road.setInvalidReason(measurement.getInvalidReason());
        road.setPresentInDxf(true);
        road.setShortestDistanceToRoad(Util.getListOfDimensionValueByLayer(planDetail, layerName));
        return road;
    }

}
