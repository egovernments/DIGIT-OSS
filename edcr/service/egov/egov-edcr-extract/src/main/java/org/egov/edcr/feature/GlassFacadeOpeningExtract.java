package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.GlassFacadeOpening;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GlassFacadeOpeningExtract extends FeatureExtract {

    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    @Override
    public PlanDetail extract(PlanDetail pl) {
        for (Block block : pl.getBlocks())
            if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty()) {
                for (Floor floor : block.getBuilding().getFloors()) {

                    String glassFacadePattern = String.format(layerNames.getLayerName("LAYER_NAME_GLASS_FACADE_OPENING"),
                            block.getNumber(), floor.getNumber()) + "_+\\d";

                    DXFDocument doc = pl.getDoc();

                    List<String> glassFacadelayers = Util.getLayerNamesLike(doc, glassFacadePattern);

                    if (!glassFacadelayers.isEmpty() && glassFacadelayers != null) {
                        List<GlassFacadeOpening> glassFacadeOpenings = new ArrayList<>();

                        for (String glassFacadelayer : glassFacadelayers) {
                            String[] split = glassFacadelayer.split("_");

                            if (split != null && split.length == 7) {

                                GlassFacadeOpening glassFacadeOpening = new GlassFacadeOpening();

                                glassFacadeOpening.setNumber(Integer.valueOf(split[6]));

                                List<BigDecimal> widths = Util.getListOfDimensionByColourCode(pl, glassFacadelayer,
                                        DxfFileConstants.DIMENSION_WIDTH_COLOR_CODE);
                                glassFacadeOpening.setWidths(widths);

                                List<BigDecimal> heights = Util.getListOfDimensionByColourCode(pl, glassFacadelayer,
                                        DxfFileConstants.DIMENSION_LENGTH_COLOR_CODE);
                                glassFacadeOpening.setHeights(heights);

                                List<BigDecimal> floorToGlassOpeningHeights = Util.getListOfDimensionByColourCode(pl,
                                        glassFacadelayer,
                                        DxfFileConstants.DIMENSION_HEIGHT_COLOR_CODE);
                                glassFacadeOpening.setFloorToGlassOpeningHeights(floorToGlassOpeningHeights);

                                glassFacadeOpenings.add(glassFacadeOpening);
                            }
                        }

                        floor.setGlassFacadeOpenings(glassFacadeOpenings);
                    }
                }
            }

        return pl;
    }

}
