package org.egov.edcr;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.edcr.feature.PlantationGreenStripExtract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnit44Runner;

@RunWith(MockitoJUnit44Runner.class)

public class GreenStripTest extends BaseTest {

    private static final Logger LOG = Logger.getLogger(GreenStripTest.class);
    PlantationGreenStripExtract feature = new PlantationGreenStripExtract();

    @Before
    public void setUp() throws IOException {
        dxfFile = "medium_mumty.dxf";
        super.setUp();
    }

    @Test
    public final void testExtract() {

        pl = feature.extract(pl);

        for (Block b : pl.getBlocks()) {

            Measurement measurement = b.getPlantationGreenStripes().get(0);
            LOG.info(measurement.getMinimumSide());
            LOG.info(measurement.getLength());
            LOG.info(measurement.getWidth());
            LOG.info(measurement.getHeight());
        }

    }

}
