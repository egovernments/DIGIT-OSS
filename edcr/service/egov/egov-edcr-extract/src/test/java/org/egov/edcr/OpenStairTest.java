package org.egov.edcr;

import java.io.IOException;

import org.egov.edcr.feature.FarExtract;
import org.egov.edcr.feature.OpenStairServiceExtract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnit44Runner;

@RunWith(MockitoJUnit44Runner.class)

public class OpenStairTest extends BaseTest {

	FarExtract far = new FarExtract();
	OpenStairServiceExtract openStairExtract = new OpenStairServiceExtract();

	@Before
	public void setUp() throws IOException {
		dxfFile = "openstair.dxf";
		super.setUp();
	}

	@Test
	public final void testExtract() {

        /*
         * pl = far.extract(pl); pl = openStairExtract.extract(pl); for (Block b : pl.getBlocks()) { if(b.getOpenStairs()!= null
         * && b.getOpenStairs().size() > 0) { LOG.info("Number of open stairs in block " + b.getNumber() + " = " +
         * b.getOpenStairs().size()); List<BigDecimal> collect =
         * b.getOpenStairs().stream().map(Measurement::getMinimumDistance).collect(Collectors.toList());
         * LOG.info("Measurements in block " + b.getNumber() + " are " + collect.toString()); } }
         */
	}

}
