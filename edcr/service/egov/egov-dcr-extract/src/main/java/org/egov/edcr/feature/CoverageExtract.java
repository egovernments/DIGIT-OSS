package org.egov.edcr.feature;

import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CoverageExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(CoverageExtract.class);

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail planDetail) {
        for (Block block : planDetail.getBlocks())
            if (block.getCoverage().isEmpty())
                planDetail.addError("coverageArea" + block.getNumber(),
                        "Coverage Area for block " + block.getNumber() + " not Provided");
        return planDetail;
    }

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting Coverage Extract......");
        for (Block block : pl.getBlocks()) {
            List<DXFLWPolyline> polylinesCoverage = Util.getPolyLinesByLayer(pl.getDoc(),
                    String.format(layerNames.getLayerName("LAYER_NAME_COVERAGE"), block.getNumber()));
            List<DXFLWPolyline> polylinesCoverageDeduct = Util.getPolyLinesByLayer(pl.getDoc(),
                    String.format(layerNames.getLayerName("LAYER_NAME_COVERAGE_DEDUCT"), block.getNumber()));
            for (DXFLWPolyline polyline : polylinesCoverage) {
                Measurement measurement = new MeasurementDetail(polyline, false);
                block.getCoverage().add(measurement);
            }
            for (DXFLWPolyline polyline : polylinesCoverageDeduct) {
                Measurement measurement = new MeasurementDetail(polyline, false);
                block.getCoverageDeductions().add(measurement);
            }
        }
        if (LOG.isDebugEnabled())
            LOG.debug("Starting Coverage Extract......");
        return pl;
    }

}
