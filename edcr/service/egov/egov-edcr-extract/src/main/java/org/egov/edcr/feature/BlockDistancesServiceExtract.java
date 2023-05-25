package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.BlockDistances;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BlockDistancesServiceExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(BlockDistancesServiceExtract.class);
    public static final String SUBRULE_54_3 = "54-(3)";
    public static final String SUBRULE_55_2 = "55-(2)";
    public static final String SUBRULE_57_4 = "57-(4)";
    public static final String SUBRULE_58_3_A = "58-(3-a)";
    public static final String SUBRULE_59_3 = "59-(3)";
    public static final String SUBRULE_117_3 = "117-(3)";
    public static final BigDecimal DIS_7_5 = BigDecimal.valueOf(7.5);
    public static final String BLK_NUMBER = "blkNumber";
    public static final String SUBRULE = "subrule";
    public static final String MIN_DISTANCE = "minimumDistance";
    public static final String OCCUPANCY = "occupancy";
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isInfoEnabled())
            LOG.info(".......Starting Block Distances Extract......");
        for (Block b : pl.getBlocks()) {
            List<BlockDistances> disBetweenBlocksList = new ArrayList<>();
            for (Block block : pl.getBlocks())
                if (!b.getNumber().equals(block.getNumber())) {
                    String layerName = String.format(layerNames.getLayerName("LAYER_NAME_DIST_BETWEEN_BLOCKS"), b.getNumber(),
                            block.getNumber());
                    List<BigDecimal> disBtwnBlcks = Util.getListOfDimensionValueByLayer(pl, layerName);
                    if (!disBtwnBlcks.isEmpty()) {
                        BlockDistances disBtwnBlocks = new BlockDistances();
                        disBtwnBlocks.setBlockNumber(block.getNumber());
                        disBtwnBlocks.setDistances(disBtwnBlcks);
                        disBetweenBlocksList.add(disBtwnBlocks);
                    }
                }
            b.setDisBetweenBlocks(disBetweenBlocksList);
        }
        if (LOG.isInfoEnabled())
            LOG.info(".......End of Block Distances Extract......");
        return pl;
    }

}
