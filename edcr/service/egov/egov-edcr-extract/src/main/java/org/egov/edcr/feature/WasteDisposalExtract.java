package org.egov.edcr.feature;

import static org.egov.edcr.utility.DcrConstants.OBJECTNOTDEFINED;
import static org.egov.edcr.utility.DcrConstants.WASTEDISPOSAL;

import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.WasteDisposal;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class WasteDisposalExtract extends FeatureExtract {
    private static final Logger LOG = LogManager.getLogger(WasteDisposalExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting of Waste Disposal Extract......");
        // Waste Disposal
        List<DXFLWPolyline> wasterDisposalPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                layerNames.getLayerName("LAYER_NAME_WASTE_DISPOSAL"));
        if (wasterDisposalPolyLines != null && !wasterDisposalPolyLines.isEmpty())
            for (DXFLWPolyline pline : wasterDisposalPolyLines) {
                Measurement measurement = new MeasurementDetail(pline, true);
                WasteDisposal disposal = new WasteDisposal();
                disposal.setArea(measurement.getArea());
                disposal.setColorCode(measurement.getColorCode());
                disposal.setHeight(measurement.getHeight());
                disposal.setWidth(measurement.getWidth());
                disposal.setLength(measurement.getLength());
                disposal.setInvalidReason(measurement.getInvalidReason());
                disposal.setPresentInDxf(true);
                if (pline.getColor() == 1) {
                    disposal.setType(DcrConstants.EXISTING);
                    pl.getUtility().addWasteDisposal(disposal);
                } else if (pline.getColor() == 2) {
                    disposal.setType(DcrConstants.PROPOSED);
                    pl.getUtility().addWasteDisposal(disposal);
                }
            }
        if (LOG.isInfoEnabled())
            LOG.info("End of Waste Disposal Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        HashMap<String, String> errors = new HashMap<>();
        // waste disposal defined or not
        if (pl.getUtility() != null && pl.getUtility().getLiquidWasteTreatementPlant().isEmpty()
                && pl.getUtility().getWasteDisposalUnits().isEmpty()) {
            errors.put(WASTEDISPOSAL,
                    edcrMessageSource.getMessage(OBJECTNOTDEFINED,
                            new String[] { WASTEDISPOSAL }, LocaleContextHolder.getLocale()));
            pl.addErrors(errors);
        }
        return pl;
    }

}
