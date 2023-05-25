package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Parapet;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDimension;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParapetExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(ParapetExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {

        for (Block block : planDetail.getBlocks()) {
            String parapetLayer = layerNames.getLayerName("LAYER_NAME_BLK_PARAPET");
            String blkNo = block.getNumber();
            List<Measurement> parapets = new ArrayList<>();
            String layerName = String.format(parapetLayer, blkNo);
            block.setParapets(Util.getListOfDimensionValueByLayer(planDetail,
                    layerName));

            List<DXFDimension> parapetDims = Util.getDimensionsByLayer(planDetail.getDoc(), layerName);
            if (!parapetDims.isEmpty()) {
                for (DXFDimension dim : parapetDims) {
                    parapets.add(buildHeight(planDetail, dim, parapetLayer));
                }
            }
            block.setParapetWithColor(parapets);

            List<DXFLWPolyline> parapetPolyLines = Util.getPolyLinesByLayer(planDetail.getDoc(), layerName);

            if (!parapetPolyLines.isEmpty() || !block.getParapetWithColor().isEmpty()) {
                Parapet parapet = new Parapet();
                if (parapetPolyLines != null && !parapetPolyLines.isEmpty()) {
                    List<Measurement> areas = parapetPolyLines.stream()
                            .map(parapetPolyline -> new MeasurementDetail(parapetPolyline, true))
                            .collect(Collectors.toList());
                    parapet.setAreas(areas);
                }

                if (block.getParapetWithColor() != null && !block.getParapetWithColor().isEmpty()) {
                    parapet.setHeights(block.getParapetWithColor());
                }

                block.setParapetV2(parapet);
            }
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
