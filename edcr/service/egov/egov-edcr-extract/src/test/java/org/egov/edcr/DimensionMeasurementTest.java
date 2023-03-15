/*
 * package org.egov.edcr;
 * 
 * import java.math.BigDecimal; import java.util.ArrayList; import
 * java.util.Iterator; import java.util.List;
 * 
 * import org.apache.logging.log4j.LogManager; import
 * org.apache.logging.log4j.Logger; import
 * org.egov.edcr.feature.DimensionMeasurement; import
 * org.egov.edcr.utility.DcrConstants; import org.junit.Before; import
 * org.junit.Test; import org.kabeja.dxf.DXFBlock; import
 * org.kabeja.dxf.DXFConstants; import org.kabeja.dxf.DXFDimension; import
 * org.kabeja.dxf.DXFDimensionStyle; import org.kabeja.dxf.DXFDocument; import
 * org.kabeja.dxf.DXFEntity; import org.kabeja.dxf.DXFLayer; import
 * org.kabeja.dxf.DXFLine; import org.kabeja.dxf.DXFMText; import
 * org.kabeja.dxf.helpers.StyledTextParagraph;
 * 
 * //@RunWith(MockitoJUnit44Runner.class)
 * 
 * public class DimensionMeasurementTest extends BaseTest {
 * 
 * private static final Logger LOG =
 * LogManager.getLogger(DimensionMeasurementTest.class);
 * 
 * DimensionMeasurement e = new DimensionMeasurement();
 * 
 * @Before public void setUp() throws Exception { dxfFile = "Dimensions.dxf";
 * super.setUp(); }
 * 
 * @Test public final void testExtract() {
 * 
 * // PlanDetail extract = e.extract(pl);
 * 
 * }
 * 
 * @Test
 * 
 * public final void testExtract2() { DXFDocument doc = pl.getDoc(); Iterator
 * dxfLayerIterator = doc.getDXFLayerIterator(); while
 * (dxfLayerIterator.hasNext()) {
 * 
 * DXFLayer dxfLayer = (DXFLayer) dxfLayerIterator.next();
 * 
 * List dimensions =
 * dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
 * 
 * if (dimensions != null) { Iterator iterator = dimensions.iterator();
 * 
 * while (iterator.hasNext()) { DXFDimension dimension = (DXFDimension)
 * iterator.next(); List<DXFLine> lines = new ArrayList<>(); List<BigDecimal>
 * dims = new ArrayList<>(); BigDecimal dim = BigDecimal.ZERO; String text2 =
 * "0";
 * System.out.println(" ==================================================== ");
 * System.out.println("Layer = " + dxfLayer.getName() + " Id :" +
 * dimension.getID() + "   Inset pt:   " + dimension.getInsertPoint()); String
 * dimensionBlock = dimension.getDimensionBlock(); DXFBlock dxfBlock =
 * doc.getDXFBlock(dimensionBlock);
 * 
 * DXFDimensionStyle dxfDimensionStyle =
 * doc.getDXFDimensionStyle(dimension.getDimensionStyleID());
 * System.out.println( "Property 42---" +
 * dxfDimensionStyle.getProperty(DXFDimensionStyle.PROPERTY_DIMEXO));
 * 
 * Iterator entitiesIterator = dxfBlock.getDXFEntitiesIterator(); while
 * (entitiesIterator.hasNext()) {
 * 
 * DXFEntity e = (DXFEntity) entitiesIterator.next(); if
 * (e.getType().equals(DXFConstants.ENTITY_TYPE_LINE)) { DXFLine line =
 * (DXFLine) e; lines.add(line); BigDecimal dub1 = new
 * BigDecimal(line.getLength()); dub1 =
 * dub1.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
 * DcrConstants.ROUNDMODE_MEASUREMENTS); dims.add(dub1);
 * System.out.println("line length=" + line.getLength()); } if
 * (e.getType().equals(DXFConstants.ENTITY_TYPE_MTEXT)) { DXFMText text =
 * (DXFMText) e; text2 = text.getText();
 * 
 * Iterator styledParagraphIterator =
 * text.getTextDocument().getStyledParagraphIterator();
 * 
 * while (styledParagraphIterator.hasNext()) { StyledTextParagraph next =
 * (StyledTextParagraph) styledParagraphIterator.next(); text2 = next.getText();
 * }
 * 
 * if (text2.contains(";")) { String[] textSplit = text2.split(";"); int length
 * = textSplit.length;
 * 
 * if (length >= 1) { int index = length - 1; text2 = textSplit[index]; text2 =
 * text2.replaceAll("[^\\d.]", ""); } else text2 = text2.replaceAll("[^\\d.]",
 * ""); } System.out.println("Text2= " + text2); }
 * 
 * } BigDecimal dub = new BigDecimal(text2); dim =
 * dub.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
 * DcrConstants.ROUNDMODE_MEASUREMENTS); if (dims.contains(dim)) {
 * System.out.println("\n Accepted Dimension found " + dim + " List: " + dims +
 * "\n"); } else { System.out.println("\nEdited Dimension found " + dim +
 * " List:" + dims + "\n"); } } } }
 * 
 * }
 * 
 * }
 */