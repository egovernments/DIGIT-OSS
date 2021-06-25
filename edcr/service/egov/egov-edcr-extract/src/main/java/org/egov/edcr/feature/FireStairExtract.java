package org.egov.edcr.feature;

import static org.apache.commons.lang3.StringUtils.isBlank;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.FireStair;
import org.egov.common.entity.edcr.Flight;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.StairLanding;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.FloorDetail;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.egov.edcr.utility.math.Polygon;
import org.egov.edcr.utility.math.Ray;
import org.kabeja.dxf.DXFConstants;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFLayer;
import org.kabeja.dxf.DXFLine;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FireStairExtract extends FeatureExtract {
	final Ray rayCasting = new Ray(new Point(-1.123456789, -1.987654321, 0d));
	@Autowired
	private LayerNames layerNames;

	@Override
	public PlanDetail extract(PlanDetail pl) {
		for (Block block : pl.getBlocks())
			if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
				for (Floor floor : block.getBuilding().getFloors())
					addFireStairs(pl, block, floor);
		return pl;
	}

	@Override
	public PlanDetail validate(PlanDetail pl) {
		return pl;
	}

	private void addFireStairs(PlanDetail pl, Block block, Floor floor) {
		new HashMap<>();
		if (!block.getTypicalFloor().isEmpty())
			for (TypicalFloor tp : block.getTypicalFloor())
				if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
					for (Floor allFloors : block.getBuilding().getFloors())
						if (allFloors.getNumber().equals(tp.getModelFloorNo()))
							if (!allFloors.getFireStairs().isEmpty()) {
								floor.setFireStairs(allFloors.getFireStairs());
								return;
							}

		// Layer name convention BLK_n_FLR_i_FIRESTAIR_k
		String fireEscapeStairNamePattern = "BLK_" + block.getNumber() + "_FLR_" + floor.getNumber() + "_FIRESTAIR"
				+ "_+\\d";

		DXFDocument doc = pl.getDoc();
		List<String> fireEscapeStairNames = Util.getLayerNamesLike(doc, fireEscapeStairNamePattern);

		if (!fireEscapeStairNames.isEmpty())
			for (String fireEscapeStairName : fireEscapeStairNames) {
			    DXFLayer dxfLayer = doc.getDXFLayer(fireEscapeStairName);
		                List polyLines = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE);
		                List mTexts = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);
		                if ((polyLines != null && !polyLines.isEmpty()) || (mTexts != null
		                        && !mTexts.isEmpty())) {
				String[] stairName = fireEscapeStairName.split("_");
				FireStair fireStair = new FireStair();
				String stairNo = stairName[5];
				fireStair.setNumber(stairNo);
				if (stairName.length == 6 && stairNo != null && !stairNo.isEmpty()) {
					String fireStairLayerName = String.format(layerNames.getLayerName("LAYER_NAME_FIRESTAIR_FLOOR"),
							block.getNumber(), floor.getNumber(), stairNo);

					String floorHeight = Util.getMtextByLayerName(doc, fireStairLayerName, "FLR_HT_M");

					if (!isBlank(floorHeight)) {
						if (floorHeight.contains("=")) {
							floorHeight = floorHeight.split("=")[1] != null
									? floorHeight.split("=")[1].replaceAll("[^\\d.]", "")
									: "";
						} else
							floorHeight = floorHeight.replaceAll("[^\\d.]", "");

						if (!isBlank(floorHeight)) {
							BigDecimal height = BigDecimal.valueOf(Double.parseDouble(floorHeight));
							fireStair.setFloorHeight(height);
						} else {
							pl.addError(fireStairLayerName + "_FLR_HT_M",
									"Floor height is not defined in layer " + fireStairLayerName);
						}
					} else {
						pl.addError(fireStairLayerName + "_FLR_HT_M",
								"Floor height is not defined in layer " + fireStairLayerName);
					}

					List<DXFLWPolyline> fireStairPolyLines = Util.getPolyLinesByLayer(doc, fireStairLayerName);

					if (!fireStairPolyLines.isEmpty()) {
						List<Measurement> fireStairMeasurements = fireStairPolyLines.stream()
								.map(flightPolyLine -> new MeasurementDetail(flightPolyLine, true))
								.collect(Collectors.toList());

						fireStair.setStairMeasurements(fireStairMeasurements);

						List<DXFLWPolyline> builtUpAreaPolyLines = ((FloorDetail) floor).getBuiltUpAreaPolyLine();

						if (builtUpAreaPolyLines != null && builtUpAreaPolyLines.size() > 0
								&& fireStairPolyLines != null && fireStairPolyLines.size() > 0)
							for (DXFLWPolyline builtUpPolyLine : builtUpAreaPolyLines) {
								Polygon builtUpPolygon = Util.getPolygon(builtUpPolyLine);

								for (DXFLWPolyline fireStairPolyLine : fireStairPolyLines) {
									Iterator vertexIterator = fireStairPolyLine.getVertexIterator();
									while (vertexIterator.hasNext()) {
										DXFVertex dxfVertex = (DXFVertex) vertexIterator.next();
										Point point = dxfVertex.getPoint();
										if (rayCasting.contains(point, builtUpPolygon)) {
											fireStair.setAbuttingBltUp(true);
											break;
										}
									}
								}
							}
					}

					String flightLayerNamePattern = String.format(
							layerNames.getLayerName("LAYER_NAME_FIRESTAIR_FLIGHT"), block.getNumber(),
							floor.getNumber(), stairNo, "+\\d");

					addFlight(pl, flightLayerNamePattern, fireStair);

					String landingNamePattern = String.format(layerNames.getLayerName("LAYER_NAME_FIRESTAIR_LANDING"),
							block.getNumber(), floor.getNumber(), stairNo, "+\\d");

					addStairLanding(pl, landingNamePattern, fireStair);

					floor.addFireStair(fireStair);
				}
			}
	}
	}

	private void addStairLanding(PlanDetail pl, String landingNamePattern, FireStair fireStair) {
	    DXFDocument doc = pl.getDoc();
		List<String> landingLayerNames = Util.getLayerNamesLike(doc, landingNamePattern);
		List<StairLanding> landings = new ArrayList<>();

		for (String landingLayer : landingLayerNames) {

			StairLanding stairLanding = new StairLanding();

			String[] landingNo = landingLayer.split("_");

			stairLanding.setNumber(landingNo[7]);

			List<DXFLWPolyline> landingPolyLines = Util.getPolyLinesByLayer(doc, landingLayer);

			boolean isClosed = landingPolyLines.stream().allMatch(dxflwPolyline -> dxflwPolyline.isClosed());

			stairLanding.setLandingClosed(isClosed);

			List<Measurement> landingPolyLinesMeasurement = landingPolyLines.stream()
					.map(flightPolyLine -> new MeasurementDetail(flightPolyLine, true)).collect(Collectors.toList());

			stairLanding.setLandings(landingPolyLinesMeasurement);

			// set length of flight
			List<BigDecimal> landingLengths = Util.getListOfDimensionByColourCode(pl, landingLayer,
					DxfFileConstants.STAIR_FLIGHT_LENGTH_COLOR);

			stairLanding.setLengths(landingLengths);

			// set width of flight
			List<BigDecimal> landingWidths = Util.getListOfDimensionByColourCode(pl, landingLayer,
					DxfFileConstants.STAIR_FLIGHT_WIDTH_COLOR);

			stairLanding.setWidths(landingWidths);

			landings.add(stairLanding);
		}
		fireStair.setLandings(landings);

	}

	private void addFlight(PlanDetail pl, String flightLayerNamePattern, FireStair fireStair) {
	    DXFDocument doc = pl.getDoc();
		List<String> flightLayerNames = Util.getLayerNamesLike(doc, flightLayerNamePattern);

		if (!flightLayerNames.isEmpty()) {
			List<Flight> flights = new ArrayList<>();
			for (String flightLayer : flightLayerNames) {

				Flight flight = new Flight();

				String[] flightNo = flightLayer.split("_");

				flight.setNumber(flightNo[7]);

				List<DXFLWPolyline> fireStairFlightPolyLines = Util.getPolyLinesByLayer(doc, flightLayer);

				boolean isClosed = fireStairFlightPolyLines.stream()
						.allMatch(dxflwPolyline -> dxflwPolyline.isClosed());

				flight.setFlightClosed(isClosed);

				List<Measurement> flightPolyLines = fireStairFlightPolyLines.stream()
						.map(flightPolyLine -> new MeasurementDetail(flightPolyLine, true))
						.collect(Collectors.toList());

				flight.setFlights(flightPolyLines);

				// set length of flight
				List<BigDecimal> fireStairFlightLengths = Util.getListOfDimensionByColourCode(pl, flightLayer,
						DxfFileConstants.STAIR_FLIGHT_LENGTH_COLOR);

				flight.setLengthOfFlights(fireStairFlightLengths);

				// set width of flight
				List<BigDecimal> fireStairFlightWidths = Util.getListOfDimensionByColourCode(pl, flightLayer,
						DxfFileConstants.STAIR_FLIGHT_WIDTH_COLOR);

				flight.setWidthOfFlights(fireStairFlightWidths);

				// set number of rises
				List<DXFLine> fireStairLines = Util.getLinesByLayer(doc, flightLayer);

				flight.setNoOfRises(BigDecimal.valueOf(fireStairLines.size()));

				flights.add(flight);

			}
			fireStair.setFlights(flights);
		}
	}

}
