package org.egov.edcr.feature;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Room;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentilationExtract extends FeatureExtract {

	private static final Logger LOG = Logger.getLogger(VentilationExtract.class);
	@Autowired
	private LayerNames layerNames;

	@Override
	public PlanDetail extract(PlanDetail pl) {
		for (Block b : pl.getBlocks()) {
			if (b.getBuilding() != null && b.getBuilding().getFloors() != null
					&& !b.getBuilding().getFloors().isEmpty()) {
				for (Floor f : b.getBuilding().getFloors()) {

					/*
					 * Adding general light and ventilation at floor level
					 */
					List<DXFLWPolyline> lightAndVentilations = Util.getPolyLinesByLayer(pl.getDoc(), String.format(
							layerNames.getLayerName("LAYER_NAME_LIGHT_VENTILATION"), b.getNumber(), f.getNumber()));
					if (!lightAndVentilations.isEmpty()) {
						List<Measurement> lightAndventilationMeasurements = lightAndVentilations.stream()
								.map(polyline -> new MeasurementDetail(polyline, true)).collect(Collectors.toList());
						f.getLightAndVentilation().setMeasurements(lightAndventilationMeasurements);

						f.getLightAndVentilation()
								.setHeightOrDepth((Util.getListOfDimensionValueByLayer(pl,
										String.format(layerNames.getLayerName("LAYER_NAME_LIGHT_VENTILATION"),
												b.getNumber(), f.getNumber()))));

					}
					/*
					 * Adding regular room wise light and ventilation
					 */
					for (Room room : f.getRegularRooms()) {
						String regularRoomLayerName = String.format(
								layerNames.getLayerName("LAYER_NAME_ROOM_LIGHT_VENTILATION"), b.getNumber(),
								f.getNumber(), room.getNumber(), "+\\d");

						List<String> regularRoomLayers = Util.getLayerNamesLike(pl.getDoc(), regularRoomLayerName);
						if (!regularRoomLayers.isEmpty()) {
							for (String regularRoomLayer : regularRoomLayers) {
								List<DXFLWPolyline> lightAndventilations = Util.getPolyLinesByLayer(pl.getDoc(),
										regularRoomLayer);
								if (!lightAndventilations.isEmpty()) {
									List<Measurement> lightAndventilationMeasurements = lightAndventilations.stream()
											.map(polyline -> new MeasurementDetail(polyline, true))
											.collect(Collectors.toList());
									room.getLightAndVentilation().setMeasurements(lightAndventilationMeasurements);

									room.getLightAndVentilation().setHeightOrDepth(
											(Util.getListOfDimensionValueByLayer(pl, regularRoomLayer)));
								}
							}
						}
					}
					/*
					 * Adding AC room wise light and ventilation
					 */
					for (Room room : f.getAcRooms()) {
						String acRoomLayerName = String.format(
								layerNames.getLayerName("LAYER_NAME_ACROOM_LIGHT_VENTILATION"), b.getNumber(),
								f.getNumber(), room.getNumber(), "+\\d");

						List<String> acRoomLayers = Util.getLayerNamesLike(pl.getDoc(), acRoomLayerName);
						if (!acRoomLayers.isEmpty()) {
							for (String acRoomLayer : acRoomLayers) {

								List<DXFLWPolyline> lightAndventilations = Util.getPolyLinesByLayer(pl.getDoc(),
										acRoomLayer);
								if (!lightAndventilations.isEmpty()) {
									List<Measurement> lightAndventilationMeasurements = lightAndventilations.stream()
											.map(polyline -> new MeasurementDetail(polyline, true))
											.collect(Collectors.toList());
									room.getLightAndVentilation().setMeasurements(lightAndventilationMeasurements);

									room.getLightAndVentilation()
											.setHeightOrDepth((Util.getListOfDimensionValueByLayer(pl, acRoomLayer)));

								}

							}
						}
					}
				}
			}
		}

		return pl;
	}

	@Override
	public PlanDetail validate(PlanDetail pl) {
		return pl;
	}

}
