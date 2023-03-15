/*
 * package org.egov.edcr;
 * 
 * import org.apache.logging.log4j.Logger; import
 * org.apache.logging.log4j.LogManager; import
 * org.egov.common.entity.edcr.Block; import
 * org.egov.common.entity.edcr.Measurement; import
 * org.egov.edcr.feature.FarExtract; import
 * org.egov.edcr.feature.PlantationGreenStripExtract; import org.junit.Before;
 * import org.junit.Test; import org.junit.runner.RunWith; import
 * org.mockito.runners.MockitoJUnit44Runner;
 * 
 * //@RunWith(MockitoJUnit44Runner.class)
 * 
 * public class GreenStripTest extends BaseTest {
 * 
 * private static final Logger LOG = LogManager.getLogger(GreenStripTest.class);
 * PlantationGreenStripExtract feature = new PlantationGreenStripExtract();
 * 
 * @Before public void setUp() throws Exception { dxfFile = "medium_mumty.dxf";
 * super.setUp(); }
 * 
 * @Test public final void testExtract() {
 * 
 * pl = feature.extract(pl);
 * 
 * for (Block b : pl.getBlocks()) {
 * 
 * Measurement measurement = b.getPlantationGreenStripes().get(0);
 * System.out.println(measurement.getMinimumSide());
 * System.out.println(measurement.getLength());
 * System.out.println(measurement.getWidth());
 * System.out.println(measurement.getHeight()); }
 * 
 * }
 * 
 * }
 */