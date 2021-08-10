package org.egov.edcr.feature;

import static org.apache.commons.lang3.StringUtils.isBlank;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang.math.NumberUtils;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Flight;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.common.entity.edcr.VehicleRamp;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFLine;
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
                       
                        String vehicleRampFlightRegex = "BLK_" + block.getNumber() + "_FLR_" + floor.getNumber() + "_VEHICLE_RAMP"
                                + "_+\\d" + "_FLIGHT" + "_+\\d";
                        
                        String vehicleRampWidthRegex = "BLK_" + block.getNumber() + "_FLR_" + floor.getNumber() + "_VEHICLE_RAMP";
                        
                        List<String> vehicleRampLayer = Util.getLayerNamesLike(pl.getDoc(), vehicleRampRegex);
                        
                        List<String> vehicleRampFlighLayer = Util.getLayerNamesLike(pl.getDoc(), vehicleRampFlightRegex);

						if (!vehicleRampFlighLayer.isEmpty()) {
							vehicleRampWithFlight(pl, floor, vehicleRampFlighLayer, vehicleRampWidthRegex);

						} else if (!vehicleRampLayer.isEmpty()) {
							vehicleRampWithoutFlight(pl, floor, vehicleRampLayer);
						}
                         
                    }
        return pl;
    }
	private void vehicleRampWithFlight(PlanDetail pl, Floor floor, List<String> vehicleRampLayer,String vehicleRampWidthRegex) {

		VehicleRamp vehicleRamp = new VehicleRamp();

		for (String vehicleRmpLayer : vehicleRampLayer) {
		    List<DXFLWPolyline> polylines = Util.getPolyLinesByLayer(pl.getDoc(), vehicleRmpLayer);

		    String[] splitLayer = vehicleRmpLayer.split("_");
		    int layerLength = splitLayer.length;
		    if (splitLayer[5] != null && !splitLayer[5].isEmpty() && !polylines.isEmpty()) {
		        Flight flight= new Flight();
		        
		        String rampNo = "1",flightNo= "1";
		        if (layerLength == 9){
		            rampNo = splitLayer[6];
		            flightNo=splitLayer[8];
		        }
		        else if (layerLength == 8){
		            rampNo = splitLayer[5];
		            flightNo=splitLayer[7];
		        }
		        
		        if (NumberUtils.isDigits(flightNo))
		        	flight.setNumber(flightNo);
		        
		        if (NumberUtils.isDigits(rampNo)){
		            vehicleRamp.setNumber(Integer.valueOf(rampNo));
		       	 
		   	     List<BigDecimal> dimensions = Util.getListOfDimensionValueByLayer(pl, vehicleRampWidthRegex+"_"+rampNo+"_WIDTH");
		   	     if (!dimensions.isEmpty() && dimensions.size()>=1){  
		   	    	 vehicleRamp.setWidth(dimensions.get(0));
		   	    	 flight.setWidthOfFlights(dimensions);
		   	     }
		   	     
		        }
		
		        boolean isClosed = polylines.stream()
		                .allMatch(dxflwPolyline -> dxflwPolyline.isClosed());
		        flight.setFlightClosed(isClosed);
		        
		        for (DXFLWPolyline rampPline : polylines) {
		        	if(rampPline.isClosed()) {
					    Measurement measurement = new MeasurementDetail(rampPline, true);
					    flight.setColorCode(measurement.getColorCode());
		        	}
		        	if(!rampPline.isClosed()) {
				    	   flight.setLength(BigDecimal.valueOf(rampPline.getLength()));
		        	}

		        }

		        List<Measurement> vehicleRampPolyLine = polylines.stream()
		                .map(dxflwPolyline -> new MeasurementDetail(dxflwPolyline, true))
		                .collect(Collectors.toList());
		        flight.setFlights(vehicleRampPolyLine);
 
		        //TODO: GET FLIGHT LENGTHS
		    	List<DXFLine> fireStairLines = Util.getLinesByLayer(pl.getDoc(), vehicleRmpLayer);
		    	
		       for(DXFLine lines: fireStairLines)
		       {
		    	  // System.out.println(" Line lengths ((((((((((((( " + lines.getLength());
		    	   //flight.setLengthOfFlights(lines.getLength());
		    	   flight.setLength(BigDecimal.valueOf(lines.getLength()));
		       }


		        String rampHeight = Util.getMtextByLayerName(pl.getDoc(), vehicleRmpLayer,
		                "RAMP_HT_M");
				if (!isBlank(rampHeight)) {
					if (rampHeight.contains("="))
						rampHeight = rampHeight.split("=")[1] != null
								? rampHeight.split("=")[1].replaceAll("[^\\d.]", "") : "";
					else
						rampHeight = rampHeight.replaceAll("[^\\d.]", "");

					if (!isBlank(rampHeight)) {
						BigDecimal height = BigDecimal.valueOf(Double.parseDouble(rampHeight));
						flight.setHeight(height);

					}
				}
				
		        vehicleRamp.addFlights(flight);
		    }

		}
        floor.addVehicleRamps(vehicleRamp);

	}

	private void vehicleRampWithoutFlight(PlanDetail pl, Floor floor, List<String> vehicleRampLayer) {
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

    private BigDecimal extractSlope(PlanDetail pl, String vehicleRmpLayer) {
		String text = Util.getMtextByLayerName(pl.getDoc(), vehicleRmpLayer);
		BigDecimal slope = BigDecimal.ZERO;
		if (text != null && !text.isEmpty() && text.contains("=")) {
		    String[] textArray = text.split("=", 2);
		    String slopeText = textArray[1];
		    if(slopeText!=null) {
				String[] slopeDividendAndDivisor = slopeText.toUpperCase().split("IN", 2);
				if (slopeDividendAndDivisor != null && slopeDividendAndDivisor.length == 2
						&& slopeDividendAndDivisor[0] != null && slopeDividendAndDivisor[1] != null) {
					slopeDividendAndDivisor[0] = slopeDividendAndDivisor[0].replaceAll("[^\\d.]", "");
					slopeDividendAndDivisor[1] = slopeDividendAndDivisor[1].replaceAll("[^\\d.]", "");
					slope = BigDecimal.valueOf(Double.valueOf(slopeDividendAndDivisor[0])).divide(
							BigDecimal.valueOf(Double.valueOf(slopeDividendAndDivisor[1])), 2, RoundingMode.HALF_UP);
				}
		    }
		}
		return slope;
	}

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }
}
