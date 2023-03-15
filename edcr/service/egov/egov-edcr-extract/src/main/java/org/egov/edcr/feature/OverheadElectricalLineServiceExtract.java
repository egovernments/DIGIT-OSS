package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.entity.edcr.ElectricLine;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OverheadElectricalLineServiceExtract extends FeatureExtract {

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        String layerNamesRegExp = "^" + layerNames.getLayerName("LAYER_NAME_OHEL") + "_+\\d";
        DXFDocument doc = pl.getDoc();
        List<String> ohelLayerNames = Util.getLayerNamesLike(doc, layerNamesRegExp);
        List<ElectricLine> electricLines = new ArrayList<>();
        for (String layerNames1 : ohelLayerNames) {
            String[] layerParts = layerNames1.split("_", 2);
            List<DXFLWPolyline> polylines = Util.getPolyLinesByLayer(doc, layerNames1);
            if (layerParts[1] != null && !layerParts[1].isEmpty() && !polylines.isEmpty()) {
                ElectricLine line = new ElectricLine();
                line.setNumber(layerParts[1]);
                BigDecimal dimension = Util.getSingleDimensionValueByLayer(doc,
                        layerNames.getLayerName("LAYER_NAME_HORIZ_CLEAR_OHE2") + "_" + layerParts[1], pl);
                if (dimension != null && dimension.compareTo(BigDecimal.ZERO) > 0)
                    line.setHorizontalDistance(dimension);
                BigDecimal dimensionVerticle = Util.getSingleDimensionValueByLayer(doc,
                        layerNames.getLayerName("LAYER_NAME_VERT_CLEAR_OHE") + "_" + layerParts[1], pl);
                if (dimensionVerticle != null && dimensionVerticle.compareTo(BigDecimal.ZERO) > 0)
                    line.setVerticalDistance(dimensionVerticle);
                line.setPresentInDxf(true);
                // change this to use api with 3 params
                String voltage = Util.getMtextByLayerName(doc, "VOLTAGE" + "_" + layerParts[1]);
                if (voltage != null)
                    try {
                        if (voltage.contains("=")) {
                            String[] textSplit = voltage.split("=");
                            if (textSplit[1] != null && !textSplit[1].isEmpty()) {
                                voltage = textSplit[1];
                                voltage = voltage.replaceAll("[^\\d.]", "");
                                BigDecimal volt = BigDecimal.valueOf(Double.parseDouble(voltage));
                                line.setVoltage(volt);
                                line.setPresentInDxf(true);
                            }
                        }
                    } catch (NumberFormatException e) {
                        pl.addError("VOLTAGE",
                                "Voltage value contains non numeric character.Voltage must be Number specified in  KW unit, without the text KW");
                    }
                else
                    pl.addError("VOLTAGE_" + layerParts[1], "Voltage is not mentioned for the "
                            + layerNames.getLayerName("LAYER_NAME_OHEL") + "_" + layerParts[1]);
                electricLines.add(line);
            }
        }
        pl.setElectricLine(electricLines);

        return pl;

    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
