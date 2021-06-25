package org.egov.edcr.feature;

import static org.apache.commons.lang3.StringUtils.isBlank;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang.math.NumberUtils;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.common.entity.edcr.VehicleRamp;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleRampExtract extends FeatureExtract {
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (pl != null && !pl.getBlocks().isEmpty())
            for (Block block : pl.getBlocks())
                if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                    outside: for (Floor floor : block.getBuilding().getFloors()) {
                        if (!block.getTypicalFloor().isEmpty())
                            for (TypicalFloor tp : block.getTypicalFloor())
                                if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
                                    for (Floor allFloors : block.getBuilding().getFloors())
                                        if (allFloors.getNumber().equals(tp.getModelFloorNo()))
                                            if (!allFloors.getVehicleRamps().isEmpty()) {
                                                floor.setVehicleRamps(allFloors.getVehicleRamps());
                                                continue outside;
                                            }

                        String vehicleRampRegex = String.format(layerNames.getLayerName("LAYER_NAME_VEHICLE_RAMP"),
                                block.getNumber(), floor.getNumber()) + "_+\\d";

                        List<String> vehicleRampLayer = Util.getLayerNamesLike(pl.getDoc(), vehicleRampRegex);
                        if (!vehicleRampLayer.isEmpty())
                            for (String vehicleRmpLayer : vehicleRampLayer) {
                                List<DXFLWPolyline> polylines = Util.getPolyLinesByLayer(pl.getDoc(), vehicleRmpLayer);
                                String[] splitLayer = vehicleRmpLayer.split("_");
                                int layerLength = splitLayer.length;
                                if (splitLayer[5] != null && !splitLayer[5].isEmpty() && !polylines.isEmpty()) {
                                    VehicleRamp vehicleRamp = new VehicleRamp();
                                    String rampNo = "1";
                                    if (layerLength == 7)
                                        rampNo = splitLayer[6];
                                    else if (layerLength == 6)
                                        rampNo = splitLayer[5];
                                    if (NumberUtils.isDigits(rampNo))
                                        vehicleRamp.setNumber(Integer.valueOf(rampNo));
                                    boolean isClosed = polylines.stream()
                                            .allMatch(dxflwPolyline -> dxflwPolyline.isClosed());
                                    vehicleRamp.setRampClosed(isClosed);
                                    List<Measurement> vehicleRampPolyLine = polylines.stream()
                                            .map(dxflwPolyline -> new MeasurementDetail(dxflwPolyline, true))
                                            .collect(Collectors.toList());
                                    vehicleRamp.setRamps(vehicleRampPolyLine);
                                    vehicleRamp.setSlope(extractSlope(pl, vehicleRmpLayer));
                                    String floorHeight = Util.getMtextByLayerName(pl.getDoc(), vehicleRmpLayer,
                                            "FLR_HT_M");

                                    if (!isBlank(floorHeight)) {
                                        if (floorHeight.contains("="))
                                            floorHeight = floorHeight.split("=")[1] != null
                                                    ? floorHeight.split("=")[1].replaceAll("[^\\d.]", "")
                                                    : "";
                                        else
                                            floorHeight = floorHeight.replaceAll("[^\\d.]", "");

                                        if (!isBlank(floorHeight)) {
                                            BigDecimal height = BigDecimal.valueOf(Double.parseDouble(floorHeight));
                                            vehicleRamp.setFloorHeight(height);
                                        }
                                    }
                                    floor.addVehicleRamps(vehicleRamp);
                                }
                            }
                    }
        return pl;
    }

    private BigDecimal extractSlope(PlanDetail pl, String vehicleRmpLayer) {
        String text = Util.getMtextByLayerName(pl.getDoc(), vehicleRmpLayer, "SLOPE");
        BigDecimal slope = BigDecimal.ZERO;
        if (text != null && !text.isEmpty()) {
            String[] textArray = text.split("=", 2);
            String slopeText = textArray[1];
            String[] slopeDividendAndDivisor = slopeText.toUpperCase().split("IN", 2);
            if (slopeDividendAndDivisor != null && slopeDividendAndDivisor[0] != null
                    && slopeDividendAndDivisor[1] != null) {
                slopeDividendAndDivisor[0] = slopeDividendAndDivisor[0].replaceAll("[^\\d.]", "");
                slopeDividendAndDivisor[1] = slopeDividendAndDivisor[1].replaceAll("[^\\d.]", "");
                slope = BigDecimal.valueOf(Double.valueOf(slopeDividendAndDivisor[0])).divide(
                        BigDecimal.valueOf(Double.valueOf(slopeDividendAndDivisor[1])), 2, RoundingMode.HALF_UP);
            }
            if (slopeDividendAndDivisor.length == 1) {
                pl.addError("Slope not defined in standard",
                        "The vehicle ramp slope is not defined in the standard format. It Should be defined using MTEXT as SLOPE=1IN12.");
            }
        }
        return slope;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }
}
