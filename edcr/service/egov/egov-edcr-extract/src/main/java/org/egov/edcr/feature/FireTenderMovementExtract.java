
package org.egov.edcr.feature;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.FireTenderMovement;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.SetBack;
import org.egov.common.entity.edcr.Yard;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.entity.blackbox.YardDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.egov.edcr.utility.math.Polygon;
import org.egov.edcr.utility.math.Ray;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FireTenderMovementExtract extends FeatureExtract {

    private static final Logger LOG = Logger.getLogger(FireTenderMovementExtract.class);
    final Ray rayCasting = new Ray(new Point(-1.123456789, -1.987654321, 0d));
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        for (Block b : pl.getBlocks()) {
            String fireTenderMovementLayer = String.format(layerNames.getLayerName("LAYER_NAME_FIRE_TENDER_MOVEMENT"),
                    b.getNumber());
            List<DXFLWPolyline> fireTenderMovementPolyLines = Util.getPolyLinesByLayer(pl.getDoc(),
                    fireTenderMovementLayer);
            if (!fireTenderMovementPolyLines.isEmpty()) {
                List<Measurement> measurementDetails = new ArrayList<>();

                for (DXFLWPolyline polyline : fireTenderMovementPolyLines) {
                    Measurement measurementDetail = new MeasurementDetail(polyline, true);
                    measurementDetails.add(measurementDetail);
                }

                FireTenderMovement fireTenderMovement = new FireTenderMovement();
                fireTenderMovement.setFireTenderMovements(measurementDetails);

                List<String> errors = new ArrayList<>();
                b.setFireTenderMovement(fireTenderMovement);

                List<SetBack> setBacks = b.getSetBacks();
                for (SetBack setBack : setBacks)
                    if (setBack.getLevel() == 0) {

                        if (setBack.getFrontYard() != null) {
                            Boolean checkSetBackInside = checkSetBackInside(fireTenderMovementPolyLines, errors,
                                    setBack.getFrontYard());
                            if (!checkSetBackInside)
                                errors.add("Front Setback");
                        }

                        if (setBack.getRearYard() != null) {
                            Boolean checkSetBackInside = checkSetBackInside(fireTenderMovementPolyLines, errors,
                                    setBack.getRearYard());
                            if (!checkSetBackInside)
                                errors.add("Rear Setback");
                        }

                        if (setBack.getSideYard1() != null) {
                            Boolean checkSetBackInside = checkSetBackInside(fireTenderMovementPolyLines, errors,
                                    setBack.getSideYard1());
                            if (!checkSetBackInside)
                                errors.add("Side Setback 1");
                        }

                        if (setBack.getSideYard2() != null) {
                            Boolean checkSetBackInside = checkSetBackInside(fireTenderMovementPolyLines, errors,
                                    setBack.getSideYard2());
                            if (!checkSetBackInside)
                                errors.add("Side Setback 2");
                        }

                    }

                fireTenderMovement.setErrors(errors);
            }
        }

        return pl;
    }

    private Boolean checkSetBackInside(List<DXFLWPolyline> fireTenderMovementPolyLines, List<String> errors,
            Yard yard) {
        Boolean isInside = false;
        YardDetail yardDetail = (YardDetail) yard;
        Polygon polygon = Util.getPolygon(yardDetail.getPolyLine());
        for (DXFLWPolyline polyline : fireTenderMovementPolyLines) {
            Iterator iterator = polyline.getVertexIterator();
            while (iterator.hasNext()) {
                DXFVertex dxfVertex = (DXFVertex) iterator.next();
                Point point = dxfVertex.getPoint();
                if (rayCasting.contains(point, polygon))
                    return true;
            }
        }
        return isInside;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

}
