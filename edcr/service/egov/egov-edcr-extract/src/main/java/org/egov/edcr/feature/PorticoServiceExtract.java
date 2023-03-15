package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Portico;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.MeasurementDetail;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFLWPolyline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PorticoServiceExtract extends FeatureExtract {

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    @Override
    public PlanDetail extract(PlanDetail pl) {
    	
        for (Block block : pl.getBlocks()){
        	String porticoPattern = String.format(layerNames.getLayerName("LAYER_NAME_BLK_PORTICO"),
                            block.getNumber() ) + "_+\\d";
                    List<String> porticolayers = Util.getLayerNamesLike(pl.getDoc(), porticoPattern);

                    if (!porticolayers.isEmpty() && porticolayers != null) {
                        List<Portico> porticos = new ArrayList<>();
                        for (String porticolayer : porticolayers) {
                            String[] split = porticolayer.split("_");

                            Portico portico= new Portico();

                            if (split != null && split.length == 4) 
                            	portico.setName(split[3]);
                            
                            
                            List<DXFLWPolyline> porticoLines = Util.getPolyLinesByLayer(pl.getDoc(), porticolayer);
                            
                            if(!porticoLines.isEmpty()){
                            	List<Measurement> porticoMeasurements = porticoLines.stream()
                                    .map(porticoLine -> new MeasurementDetail(porticoLine, true)).collect(Collectors.toList());
                            
                            	if(!porticoMeasurements.isEmpty())	{
                            		portico.setArea(porticoMeasurements.get(0).getArea());
                            		portico.setColorCode(porticoMeasurements.get(0).getColorCode());
                            		
                            	}
                            }

                            List<BigDecimal> widths = Util.getListOfDimensionByColourCode(pl, porticolayer,
                                    DxfFileConstants.DIMENSION_WIDTH_COLOR_CODE);
                            
                            if (!widths.isEmpty()) 
                                portico.setWidth(Collections.min(widths));

                            List<BigDecimal> lengths = Util.getListOfDimensionByColourCode(pl, porticolayer,
                                    DxfFileConstants.DIMENSION_LENGTH_COLOR_CODE);
                            if (!lengths.isEmpty()) 
                            	portico.setLength(Collections.min(lengths));

                            List<BigDecimal> heights = Util.getListOfDimensionByColourCode(pl,
                                    porticolayer, DxfFileConstants.DIMENSION_HEIGHT_COLOR_CODE);
                            if (!heights.isEmpty()) 
                            	portico.setHeight(Collections.min(heights));
                            
                            List<BigDecimal> distToExteriorWalls = Util.getListOfDimensionByColourCode(pl,
                                    porticolayer, DxfFileConstants.PORTICO_EXTERIOR_WALL_COLOR);
                           
                            if (!distToExteriorWalls.isEmpty()) 
                            	portico.setDistanceToExteriorWall(distToExteriorWalls);

                            porticos.add(portico);
                            
                        }
                        block.setPorticos(porticos);
                    }
    }
        return pl;

   }
}
