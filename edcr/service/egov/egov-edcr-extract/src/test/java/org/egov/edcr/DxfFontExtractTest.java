
package org.egov.edcr;

import org.apache.log4j.Logger;
import org.egov.edcr.feature.DxfFontExtract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnit44Runner;

@RunWith(MockitoJUnit44Runner.class)

public class DxfFontExtractTest extends BaseTest {

	private static final Logger LOG = Logger.getLogger(DxfFontExtractTest.class);
	DxfFontExtract dxfFontExtract = new DxfFontExtract();

	@Before
	public void setUp() throws Exception {
		dxfFile = "RASHIDA.dxf";
		super.setUp();
	}

	@Test
	public final void testExtract() {
		pl = dxfFontExtract.extract(pl);
	}

}
