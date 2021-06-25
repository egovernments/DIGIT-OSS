package org.egov.edcr;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.edcr.feature.FarExtractWithOutDBCall;
import org.egov.edcr.feature.HeightOfRoomExtract;
import org.egov.edcr.feature.MezzanineFloorServiceExtract;
import org.egov.edcr.feature.PlanInfoFeatureExtractLocalTest;
import org.egov.edcr.feature.VehicleRampExtract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnit44Runner;

@RunWith(MockitoJUnit44Runner.class)

public class FarTest extends BaseTest {

	private static final Logger LOG = Logger.getLogger(FarTest.class);
	PlanInfoFeatureExtractLocalTest pi = new PlanInfoFeatureExtractLocalTest();
	FarExtractWithOutDBCall feature = new FarExtractWithOutDBCall();
	HeightOfRoomExtract hr = new HeightOfRoomExtract();

	@Before
	public void setUp() throws Exception {
		dxfFile="VehicleDARamp.dxf";
		super.setUp();
	}
	
	@Test
	public final void testExtract() {
		  pl = pi.extract(pl);
          pl = feature.extract(pl); 
          //hr.extract(pl);
          for (Block b : pl.getBlocks()) { System.out.println( b.getName() + " Number of Floors = " +
          b.getBuilding().getFloors().size()); }
          //mezz.extract(pl);
	}

	 

}
