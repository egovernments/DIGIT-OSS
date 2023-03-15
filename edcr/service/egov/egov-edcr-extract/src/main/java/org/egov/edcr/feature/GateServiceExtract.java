package org.egov.edcr.feature;

import static org.egov.edcr.constants.DxfFileConstants.HEIGHT_OR_LENGTH_COLOR_CODE;
import static org.egov.edcr.constants.DxfFileConstants.WIDTH_COLOR_CODE;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Gate;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDimension;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GateServiceExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(GateServiceExtract.class);
    private static final String GATE = "GATE";
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        String gateLayerName = String.format(layerNames.getLayerName("LAYER_NAME_GATE"));
        String mainGateLayerName = String.format(layerNames.getLayerName("LAYER_NAME_MAIN_GATE"));
        String wicketGateLayerName = String.format(layerNames.getLayerName("LAYER_NAME_WICKET_GATE"));

        Gate gate = new Gate();
        gate.setGates(new ArrayList<>());

        List<DXFLWPolyline> polyLinesByLayer = Util.getPolyLinesByLayer(planDetail.getDoc(), gateLayerName);

        List<DXFLWPolyline> mainGatePolyLinesByLayer = Util.getPolyLinesByLayer(planDetail.getDoc(), mainGateLayerName);
        List<DXFLWPolyline> wicketGatePolyLinesByLayer = Util.getPolyLinesByLayer(planDetail.getDoc(), wicketGateLayerName);
        if (mainGatePolyLinesByLayer.isEmpty() && wicketGatePolyLinesByLayer.isEmpty()) {
            Map<String, Integer> subFeaturesColor = planDetail.getSubFeatureColorCodesMaster().get(GATE);

            if (subFeaturesColor == null || subFeaturesColor.isEmpty())
                return planDetail;
            // ArrayList<Integer> values = (ArrayList<Integer>) subFeaturesColor.values();
            Set<String> keySet = new HashSet<>();
            keySet.addAll(subFeaturesColor.keySet());
            for (DXFLWPolyline pline : polyLinesByLayer) {

                for (String s : keySet) {

                    if (subFeaturesColor.get(s) == pline.getColor()) {
                        MeasurementDetail measurement = new MeasurementDetail(pline, true);
                        measurement.setName(s);
                        gate.getGates().add(measurement);
                    }
                }

            }

            List<DXFDimension> dims = Util.getDimensionsByLayer(planDetail.getDoc(), gateLayerName);
            List<BigDecimal> dimList = new ArrayList<>();
            if (dims != null) {
                for (DXFDimension dim : dims) {

                    if (subFeaturesColor.containsValue(dim.getColor())) {
                        Util.extractDimensionValue(planDetail, dimList, dim, gateLayerName);
                        if (gate.getHeights() != null) {
                            gate.setHeights(dimList);
                        } else {
                            gate.getHeights().addAll(dimList);
                        }
                    }

                }
            }
        } else {
            /*
             * Extract the width and height of the main gate and wicket gate, when defined as a dimension using color code
             */
            List<BigDecimal> mainGateWidths = Util.getListOfDimensionByColourCode(planDetail, mainGateLayerName,
                    WIDTH_COLOR_CODE);
            List<BigDecimal> mainGateHeights = Util.getListOfDimensionByColourCode(planDetail, mainGateLayerName,
                    HEIGHT_OR_LENGTH_COLOR_CODE);
            if (!mainGateWidths.isEmpty() || !mainGateHeights.isEmpty()) {
                BigDecimal mainGateWidth = mainGateWidths.isEmpty() ? BigDecimal.ZERO : Collections.min(mainGateWidths);
                BigDecimal mainGateHeight = mainGateHeights.isEmpty() ? BigDecimal.ZERO : Collections.max(mainGateHeights);
                MeasurementDetail mainGate = new MeasurementDetail();
                mainGate.setWidth(mainGateWidth);
                mainGate.setHeight(mainGateHeight);
                mainGate.setLength(mainGateHeight);
                mainGate.setName(mainGateLayerName);
                mainGate.setArea(Util.getPolyLineArea(mainGatePolyLinesByLayer.get(0)));
                gate.getGates().add(mainGate);
            }

            List<BigDecimal> wicketGateWidths = Util.getListOfDimensionByColourCode(planDetail, wicketGateLayerName,
                    WIDTH_COLOR_CODE);
            List<BigDecimal> wicketGateHeights = Util.getListOfDimensionByColourCode(planDetail, wicketGateLayerName,
                    HEIGHT_OR_LENGTH_COLOR_CODE);
            if (!wicketGateWidths.isEmpty() || !wicketGateHeights.isEmpty()) {
                BigDecimal wicketGateWidth = mainGateWidths.isEmpty() ? BigDecimal.ZERO : Collections.min(wicketGateWidths);
                BigDecimal wicketGateHeight = mainGateHeights.isEmpty() ? BigDecimal.ZERO : Collections.max(wicketGateHeights);
                MeasurementDetail wicketGate = new MeasurementDetail();
                wicketGate.setWidth(wicketGateWidth);
                wicketGate.setHeight(wicketGateHeight);
                wicketGate.setLength(wicketGateHeight);
                wicketGate.setName(wicketGateLayerName);
                wicketGate.setArea(wicketGatePolyLinesByLayer.isEmpty() ? BigDecimal.ZERO
                        : Util.getPolyLineArea(wicketGatePolyLinesByLayer.get(0)));
                gate.getGates().add(wicketGate);
            }

        }

        planDetail.setGate(gate);
        return planDetail;
    }

}
