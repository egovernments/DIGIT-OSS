package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Chimney;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDimension;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChimneyExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(ChimneyExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        BigDecimal minHeight, increasedHeight;
        for (Block block : planDetail.getBlocks()) {
            String layerName = String.format(layerNames.getLayerName("LAYER_NAME_CHIMNEY"), block.getNumber());
            block.setChimneys(Util.getListOfDimensionValueByLayer(planDetail,
                    layerName));

            if (block.getChimneys() != null && !block.getChimneys().isEmpty()) {
                minHeight = block.getChimneys().stream().reduce(BigDecimal::min).get();

                if (minHeight.compareTo(new BigDecimal(1)) > 0) {
                    increasedHeight = block.getBuilding().getBuildingHeight()
                            .subtract(block.getBuilding().getDeclaredBuildingHeight());
                    if (minHeight.compareTo(increasedHeight) > 0) {
                        block.getBuilding()
                                .setBuildingHeight(block.getBuilding().getDeclaredBuildingHeight().add(minHeight));
                        block.getBuilding().setHeightIncreasedBy("Chimney");
                    }
                }
                
                List<DXFLWPolyline> chimneyPolyLines = Util.getPolyLinesByLayer(planDetail.getDoc(),
                        layerName);

                List<DXFDimension> chimneyDimensions = Util.getDimensionsByLayer(planDetail.getDoc(), layerName);
                    
                if (!chimneyPolyLines.isEmpty() || !chimneyDimensions.isEmpty()) {
                    Chimney chimney = new Chimney();
                    
                    if (!chimneyPolyLines.isEmpty()) {
                    List<Measurement> chimneyAreas = chimneyPolyLines.stream()
                            .map(chimneyPolyline -> new MeasurementDetail(chimneyPolyline, true))
                            .collect(Collectors.toList());
                    
                    chimney.setAreas(chimneyAreas);
                    }
                    
                    if (!chimneyDimensions.isEmpty()) {
                        List<Measurement> chimneyDimMeasurement = new ArrayList<>();
                        for (DXFDimension dim : chimneyDimensions) {
                            chimneyDimMeasurement.add(buildHeight(planDetail, dim, layerName));
                        }
                        chimney.setHeights(chimneyDimMeasurement);
                    }
                    
                    block.setChimneyV2(chimney);
                }

            }

            if (block.getBuilding().getBuildingHeight().compareTo(new BigDecimal(15)) > 0)
                block.getBuilding().setIsHighRise(true);
        }

        return planDetail;
    }

    private Measurement buildHeight(PlanDetail pl, DXFDimension dim, String layerName) {
        List<BigDecimal> values = new ArrayList<>();
        Util.extractDimensionValue(pl, values, dim, layerName);
        Measurement measurement = new Measurement();
        measurement.setColorCode(dim.getColor());
        measurement.setHeight(values.isEmpty() ? BigDecimal.ZERO : values.get(0));
        return measurement;
    }
}
