package org.egov.edcr.feature;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InteriorOpenSpaceServiceExtract extends FeatureExtract {

	private static final Logger LOG = Logger.getLogger(InteriorOpenSpaceServiceExtract.class);
	@Autowired
	private LayerNames layerNames;

	@Override
	public PlanDetail extract(PlanDetail pl) {
		for (Block b : pl.getBlocks()) {
			if (b.getBuilding() != null && b.getBuilding().getFloors() != null
					&& !b.getBuilding().getFloors().isEmpty()) {
				for (Floor f : b.getBuilding().getFloors()) {

					List<DXFLWPolyline> ventilationShaft = Util.getPolyLinesByLayer(pl.getDoc(), String.format(
							layerNames.getLayerName("LAYER_NAME_VENTILATION_SHAFT"), b.getNumber(), f.getNumber()));
					if (!ventilationShaft.isEmpty()) {
						List<Measurement> ventilationShaftMeasurements = ventilationShaft.stream()
								.map(polyline -> new MeasurementDetail(polyline, true)).collect(Collectors.toList());
						f.getInteriorOpenSpace().getVentilationShaft().setMeasurements(ventilationShaftMeasurements);

						f.getInteriorOpenSpace().getVentilationShaft()
								.setHeightOrDepth((Util.getListOfDimensionValueByLayer(pl,
										String.format(layerNames.getLayerName("LAYER_NAME_VENTILATION_SHAFT"),
												b.getNumber(), f.getNumber()))));

					}

					List<DXFLWPolyline> courtYardInternal = Util.getPolyLinesByLayer(pl.getDoc(), String.format(
							layerNames.getLayerName("LAYER_NAME_COURTYARD_INNER"), b.getNumber(), f.getNumber()));
					if (!courtYardInternal.isEmpty()) {
						List<Measurement> courtYardInternalMeasurements = courtYardInternal.stream()
								.map(polyline -> new MeasurementDetail(polyline, true)).collect(Collectors.toList());
						f.getInteriorOpenSpace().getInnerCourtYard().setMeasurements(courtYardInternalMeasurements);

						f.getInteriorOpenSpace().getInnerCourtYard()
								.setHeightOrDepth((Util.getListOfDimensionValueByLayer(pl,
										String.format(layerNames.getLayerName("LAYER_NAME_COURTYARD_INNER"),
												b.getNumber(), f.getNumber()))));

					}

					List<DXFLWPolyline> courtYardExternal = Util.getPolyLinesByLayer(pl.getDoc(), String.format(
							layerNames.getLayerName("LAYER_NAME_COURTYARD_OUTER"), b.getNumber(), f.getNumber()));
					if (!courtYardExternal.isEmpty()) {
						List<Measurement> courtYardExternalMeasurements = courtYardExternal.stream()
								.map(polyline -> new MeasurementDetail(polyline, true)).collect(Collectors.toList());
						f.getInteriorOpenSpace().getOuterCourtYard().setMeasurements(courtYardExternalMeasurements);

						f.getInteriorOpenSpace().getOuterCourtYard()
								.setHeightOrDepth((Util.getListOfDimensionValueByLayer(pl,
										String.format(layerNames.getLayerName("LAYER_NAME_COURTYARD_OUTER"),
												b.getNumber(), f.getNumber()))));

					}

					List<DXFLWPolyline> courtYardSunken = Util.getPolyLinesByLayer(pl.getDoc(), String.format(
							layerNames.getLayerName("LAYER_NAME_COURTYARD_SUNKEN"), b.getNumber(), f.getNumber()));
					if (!courtYardSunken.isEmpty()) {
						List<Measurement> courtYardSunkenMeasurements = courtYardSunken.stream()
								.map(polyline -> new MeasurementDetail(polyline, true)).collect(Collectors.toList());
						f.getInteriorOpenSpace().getSunkenCourtYard().setMeasurements(courtYardSunkenMeasurements);

						f.getInteriorOpenSpace().getSunkenCourtYard()
								.setHeightOrDepth((Util.getListOfDimensionValueByLayer(pl,
										String.format(layerNames.getLayerName("LAYER_NAME_COURTYARD_SUNKEN"),
												b.getNumber(), f.getNumber()))));

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
