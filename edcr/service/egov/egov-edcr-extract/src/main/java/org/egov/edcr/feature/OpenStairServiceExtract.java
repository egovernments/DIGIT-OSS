package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.Iterator;
import java.util.List;

import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.OpenStair;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFBlock;
import org.kabeja.dxf.DXFConstants;
import org.kabeja.dxf.DXFDimension;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFEntity;
import org.kabeja.dxf.DXFMText;
import org.kabeja.dxf.helpers.StyledTextParagraph;
import org.springframework.stereotype.Service;

@Service
public class OpenStairServiceExtract extends FeatureExtract {

    @Override
    public PlanDetail extract(PlanDetail pl) {
        for (Block block : pl.getBlocks())
            extractOpenStairs(pl.getDoc(), block, pl);
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    private void extractOpenStairs(DXFDocument doc, Block block, PlanDetail planDetail) {

        String openStairNamePattern = String.format("BLK_%s_OPEN_STAIR", block.getNumber());

        List<String> openStairNames = Util.getLayerNamesLike(doc, openStairNamePattern);

        if (!openStairNames.isEmpty())
            for (String openStairName : openStairNames) {
                String[] stairName = openStairName.split("_");
                if (stairName.length == 4 && stairName[3] != null && !stairName[3].isEmpty()) {
                    List<DXFDimension> lines = Util.getDimensionsByLayer(doc, openStairName);
                    if (lines != null && !lines.isEmpty())
                        for (Object dxfEntity : lines) {
                            BigDecimal value;
                            DXFDimension line = (DXFDimension) dxfEntity;
                            String dimensionBlock = line.getDimensionBlock();
                            DXFBlock dxfBlock = doc.getDXFBlock(dimensionBlock);
                            Iterator dxfEntitiesIterator = dxfBlock.getDXFEntitiesIterator();
                            while (dxfEntitiesIterator.hasNext()) {
                                DXFEntity e = (DXFEntity) dxfEntitiesIterator.next();
                                if (e.getType().equals(DXFConstants.ENTITY_TYPE_MTEXT)) {
                                    DXFMText text = (DXFMText) e;
                                    String text2 = text.getText();

                                    Iterator styledParagraphIterator = text.getTextDocument().getStyledParagraphIterator();

                                    while (styledParagraphIterator.hasNext()) {
                                        StyledTextParagraph next = (StyledTextParagraph) styledParagraphIterator.next();
                                        text2 = next.getText();
                                    }
                                    if (text2.contains(";")) {
                                        String[] textSplit = text2.split(";");
                                        int length = textSplit.length;

                                        if (length >= 1) {
                                            int index = length - 1;
                                            text2 = textSplit[index];
                                            text2 = text2.replaceAll("[^\\d.]", "");
                                        } else
                                            text2 = text2.replaceAll("[^\\d.]", "");
                                    } else
                                        text2 = text2.replaceAll("[^\\d.]", "");

                                    if (!text2.isEmpty()) {
                                        value = getNumericValue(text2, planDetail, openStairName);
                                        OpenStair openStair = new OpenStair();
                                        openStair.setMinimumDistance(value);
                                        block.getOpenStairs().add(openStair);
                                    }
                                }
                            }

                        }
                }

            }
    }

}