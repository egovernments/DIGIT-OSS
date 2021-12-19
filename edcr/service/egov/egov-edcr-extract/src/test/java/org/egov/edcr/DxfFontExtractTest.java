
package org.egov.edcr;

import java.io.IOException;

import org.egov.edcr.feature.DxfFontExtract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnit44Runner;

@RunWith(MockitoJUnit44Runner.class)

public class DxfFontExtractTest extends BaseTest {

	DxfFontExtract dxfFontExtract = new DxfFontExtract();

	@Before
	public void setUp() throws IOException {
		dxfFile = "RASHIDA.dxf";
		super.setUp();
	}

	@Test
	public final void testExtract() {
		pl = dxfFontExtract.extract(pl);
	}

}
