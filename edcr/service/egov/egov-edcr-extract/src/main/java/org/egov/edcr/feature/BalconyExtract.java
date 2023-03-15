package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Balcony;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.stereotype.Service;

@Service
public class BalconyExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(BalconyExtract.class);

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail planDetail) {
        for (Block block : planDetail.getBlocks())
            for (Floor floor : block.getBuilding().getFloors()) {
                List<Balcony> balconies = new ArrayList<>();
                String balconylayerPattern = "BLK_" + block.getNumber() + "_FLR_" + floor.getNumber() + "_BALCONY_"
                        + "\\d{1,2}";

                List<String> balconyLayers = Util.getLayerNamesLike(planDetail.getDoc(), balconylayerPattern);

                for (String balconyLayer : balconyLayers) {
                    List<DXFLWPolyline> balconyPolyLines = Util.getPolyLinesByLayer(planDetail.getDoc(), balconyLayer);
                    List<BigDecimal> dimensions = Util.getListOfDimensionValueByLayer(planDetail, balconyLayer);
                    String[] split = balconyLayer.split("_");
                    String balconyNo = split[5];
                    if (!dimensions.isEmpty() || !balconyPolyLines.isEmpty()) {
                        Balcony balcony = new Balcony();

                        List<Measurement> balconyMeasurements = balconyPolyLines.stream()
                                .map(balconyPolyLine -> new MeasurementDetail(balconyPolyLine, true))
                                .collect(Collectors.toList());

                        balcony.setMeasurements(balconyMeasurements);
                        balcony.setWidths(dimensions);
                        balcony.setNumber(balconyNo);
                        balconies.add(balcony);
                    }
                }
                floor.setBalconies(balconies);
            }

        return planDetail;
    }

}
