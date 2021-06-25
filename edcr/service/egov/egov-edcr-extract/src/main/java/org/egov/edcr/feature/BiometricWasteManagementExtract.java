package org.egov.edcr.feature;

import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.BiometricWasteTreatment;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BiometricWasteManagementExtract extends FeatureExtract {

    private static final Logger LOG = Logger.getLogger(BiometricWasteManagementExtract.class);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info("Starting Biometric Waste Management Extract......");
        // biometric waste treatment
        if (pl != null && pl.getDoc().containsDXFLayer(layerNames.getLayerName("LAYER_NAME_BIOMETRIC_WASTE_TREATMENT"))) {
            List<DXFLWPolyline> biometricWastePolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                    layerNames.getLayerName("LAYER_NAME_BIOMETRIC_WASTE_TREATMENT"));
            if (biometricWastePolyLines != null && !biometricWastePolyLines.isEmpty())
                for (DXFLWPolyline polyLine : biometricWastePolyLines) {
                    Measurement measurement = new MeasurementDetail(polyLine, true);
                    BiometricWasteTreatment biometricWasteTreatment = new BiometricWasteTreatment();
                    biometricWasteTreatment.setArea(measurement.getArea());
                    biometricWasteTreatment.setColorCode(measurement.getColorCode());
                    biometricWasteTreatment.setHeight(measurement.getHeight());
                    biometricWasteTreatment.setWidth(measurement.getWidth());
                    biometricWasteTreatment.setLength(measurement.getLength());
                    biometricWasteTreatment.setInvalidReason(measurement.getInvalidReason());
                    biometricWasteTreatment.setPresentInDxf(true);
                    pl.getUtility().addBiometricWasteTreatment(biometricWasteTreatment);
                }
        }
        if (LOG.isInfoEnabled())
            LOG.info("End of Biometric Waste Management Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
