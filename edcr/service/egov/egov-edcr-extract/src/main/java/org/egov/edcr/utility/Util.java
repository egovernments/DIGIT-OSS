package org.egov.edcr.utility;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.egov.common.entity.bpa.SubOccupancy;
import org.egov.common.entity.bpa.Usage;
import org.egov.common.entity.dcr.helper.OccupancyHelperDetail;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.EdcrPdfDetail;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.OccupancyTypeHelper;
import org.egov.common.entity.edcr.Plot;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.math.Polygon;
import org.kabeja.dxf.DXFBlock;
import org.kabeja.dxf.DXFCircle;
import org.kabeja.dxf.DXFConstants;
import org.kabeja.dxf.DXFDimension;
import org.kabeja.dxf.DXFDimensionStyle;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFEntity;
import org.kabeja.dxf.DXFLWPolyline;
import org.kabeja.dxf.DXFLayer;
import org.kabeja.dxf.DXFLine;
import org.kabeja.dxf.DXFMText;
import org.kabeja.dxf.DXFPolyline;
import org.kabeja.dxf.DXFText;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;
import org.kabeja.dxf.helpers.StyledTextParagraph;
import org.kabeja.math.MathUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Util {
    public static final int COMPARE_WITH_2_PERCENT_ERROR_DIGITS = 2;
    private static final int DECIMALDIGITS = 10;
    private static String FLOOR_NAME_PREFIX = "FLOOR_";
    static final Logger LOG = Logger.getLogger(Util.class);
    private static final BigDecimal ONEHUNDREDFIFTY = BigDecimal.valueOf(150);
    private static final BigDecimal FIFTY = BigDecimal.valueOf(50);
    private static final BigDecimal THREEHUNDRED = BigDecimal.valueOf(300);

    @Autowired
    public LayerNames layerNames;

    public static List<Point> findPointsOnPolylines(List<Point> yardInSidePoints) {
        Point old = null;
        Point point1 = new Point();
        List<Point> myPoints = new ArrayList<>();

        for (Point in : yardInSidePoints) {

            if (old == null) {
                old = in;
                continue;
            }

            double distance = MathUtils.distance(old, in);

            // if(LOG.isDebugEnabled()) LOG.debug("Distance"+distance);

            for (double j = .01; j < distance; j = j + .01) {
                point1 = new Point();
                double t = j / distance;
                point1.setX((1 - t) * old.getX() + t * in.getX());
                point1.setY((1 - t) * old.getY() + t * in.getY());
                myPoints.add(point1);

            }

            old = in;
        }
        return myPoints;
    }

    public static List<Point> findPointsOnPolylines(List<Point> yardInSidePoints, List<DXFLine> lines, PlanDetail pl,
            String layerName) {
        Point point1 = new Point();
        List<DXFLine> pointsOnLineList = new ArrayList<>();
        List<Point> myPoints = new ArrayList<>();
        LOG.debug("finding line for the List points ..... ");
        for (Point old : yardInSidePoints) {
            PrintUtil.print(old, " ++++ from yardInSidePoints +++ ");
            for (Point in : yardInSidePoints) {
                PrintUtil.print(in, "\t\t to yardInSidePoints");
                if (old != in) {
                    DXFLine pointOnLine = isALine(old, in, lines);
                    if (pointOnLine != null && !pointsOnLineList.contains(pointOnLine)) {
                        LOG.debug("\t\tThis line is not added yet ");
                        pointsOnLineList.add(pointOnLine);
                        double distance = MathUtils.distance(old, in);
                        for (double j = .01; j < distance; j = j + .01) {
                            point1 = new Point();
                            double t = j / distance;
                            point1.setX((1 - t) * old.getX() + t * in.getX());
                            point1.setY((1 - t) * old.getY() + t * in.getY());
                            myPoints.add(point1);
                            LOG.debug("\t\tadded" + point1.getX() + "---" + point1.getY());
                        }
                    } else
                        LOG.debug("  This line is already added  ");
                }
                LOG.debug("pointsOnLineList ->>>>>>>>>>size " + pointsOnLineList.size());
            }
        }
        PrintUtil.printForDXfPoint(myPoints, layerName + "_CALCULATION", pl);

        return myPoints;
    }

    public static List<DXFDimension> getDimensionsByLayer(DXFDocument dxfDocument, String name) {
        if (dxfDocument == null)
            return Collections.emptyList();
        if (name == null)
            return Collections.emptyList();
        name = name.toUpperCase();

        if (dxfDocument.containsDXFLayer(name)) {
            DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
            List<DXFDimension> dimensions = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
            if (dimensions != null)
                return dimensions;
        }
        return Collections.emptyList();
    }

    protected static int getFloorCountExcludingCeller(DXFDocument dxfDocument, Integer colorCode) {
        int i = 0;
        Iterator dxfLayerIterator = dxfDocument.getDXFLayerIterator();
        while (dxfLayerIterator.hasNext()) {

            DXFLayer dxfLayer = (DXFLayer) dxfLayerIterator.next();

            if (colorCode != null && dxfLayer.getColor() == colorCode
                    || dxfLayer.getName().startsWith(FLOOR_NAME_PREFIX))
                try {

                    if (colorCode != null && dxfLayer.getColor() == colorCode)
                        i++;
                    else {
                        String[] floorName = dxfLayer.getName().split(FLOOR_NAME_PREFIX);
                        if (floorName.length > 0 && floorName[1] != null && Integer.parseInt(floorName[1]) >= 0)
                            i++;
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    // throw new RuntimeException("Floor number not in format");
                    // //TODO: HANDLE THIS LATER
                }

        }

        return i;
    }

    public static List<String> getLayerNamesLike(DXFDocument doc, String regExp) {
        Set<String> layerNames = new TreeSet<>();
        List<String> disNames = new ArrayList();
        Iterator dxfLayerIterator = doc.getDXFLayerIterator();
        while (dxfLayerIterator.hasNext()) {
            DXFLayer name = (DXFLayer) dxfLayerIterator.next();
            Pattern pat = Pattern.compile(regExp);
            LOG.trace(pat);
            Matcher m = pat.matcher(name.getName());
            while (m.find()) {
                String group = m.group();
                LOG.trace("Found:" + group);
                layerNames.add(group);
            }

        }
        disNames.addAll(layerNames);
        return disNames;
    }

    public static List<DXFLine> getLinesByLayer(DXFDocument dxfDocument, String name) {
        List<DXFLine> lines = new ArrayList<>();
        if (name == null)
            return lines;
        name = name.toUpperCase();

        DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
        // if layer with name not found kabeja will return default layer or
        // create new layer and gives
        if (dxfLayer.getName().equalsIgnoreCase(name)) {
            List dxfPolyLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LINE);

            if (null != dxfPolyLineEntities)
                for (Object dxfEntity : dxfPolyLineEntities) {

                    DXFLine line = (DXFLine) dxfEntity;

                    if (name.contains(line.getLayerName().toUpperCase()))
                        lines.add(line);

                }

        }
        return lines;
    }

    /**
     * Get List of dimension values by passing color code
     *
     * @param dxfDocument
     * @param name
     * @param colourCode
     * @return
     */
    public static List<BigDecimal> getListOfDimensionByColourCode(PlanDetail planDetail, String name,
            int colourCode) {
        DXFDocument dxfDocument = planDetail.getDoc();
        if (dxfDocument == null)
            return Collections.emptyList();
        if (name == null)
            return Collections.emptyList();
        name = name.toUpperCase();
        List<BigDecimal> values = new ArrayList<>();

        DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
        if (dxfLayer != null && dxfLayer.getName().equalsIgnoreCase(name)) {
            List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
            if (null != dxfLineEntities)
                for (Object dxfEntity : dxfLineEntities) {
                    DXFDimension line = (DXFDimension) dxfEntity;
                    if (line.getColor() == colourCode)
                        extractDimensionValue(planDetail, values, line, dxfLayer.getName());
                }
        }
        return values;
    }

    /**
     * Get List of dimension values which are other than colour code passed as parameter.
     *
     * @param dxfDocument
     * @param name
     * @param colourCode
     * @return
     */
    public static List<BigDecimal> getListOfDimensionOtherThanSpecifiedColourCode(DXFDocument dxfDocument, String name,
            int colourCode, PlanDetail planDetail) {

        if (dxfDocument == null)
            return null;
        if (name == null)
            return null;
        name = name.toUpperCase();
        List<BigDecimal> values = new ArrayList<>();

        DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
        if (dxfLayer != null && dxfLayer.getName().equalsIgnoreCase(name)) {
            List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
            if (null != dxfLineEntities)
                for (Object dxfEntity : dxfLineEntities) {
                    DXFDimension line = (DXFDimension) dxfEntity;
                    if (line.getColor() != colourCode)
                        extractDimensionValue(planDetail, values, line, dxfLayer.getName());
                }

        }
        return values;

    }

    public static void extractDimensionValue(PlanDetail planDetail, List<BigDecimal> dimensionValues, DXFDimension line,
            String layerName) {
        DXFDocument dxfDocument = planDetail.getDoc();
        String dimensionBlock = line.getDimensionBlock();
        if (line.getDXFDimensionStyle() != null)
            LOG.info("DIM Style Name=" + line.getDXFDimensionStyle().getName());
        DXFBlock dxfBlock = dxfDocument.getDXFBlock(dimensionBlock);
        if (!planDetail.getStrictlyValidateDimension()) {
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

                    if (planDetail.getDrawingPreference() != null &&
                            org.egov.infra.utils.StringUtils.isNotBlank(planDetail.getDrawingPreference().getUom())
                            && (DxfFileConstants.INCH_UOM.equalsIgnoreCase(planDetail.getDrawingPreference().getUom())
                                    || DxfFileConstants.FEET_UOM.equalsIgnoreCase(planDetail.getDrawingPreference().getUom()))
                            && StringUtils.isNotBlank(text2)) {
                        BigDecimal convertedValue = convertToInch(text2);
                        dimensionValues.add(convertedValue);
                    } else {
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

                        if (!text2.isEmpty())
                            dimensionValues.add(BigDecimal.valueOf(Double.parseDouble(text2)));
                    }

                }
            }
        } else {
            List<DXFLine> lines = new ArrayList<>();
            String text2 = null;
            Iterator dxfEntitiesIterator = dxfBlock.getDXFEntitiesIterator();
            List<BigDecimal> values = new ArrayList<>();
            List<BigDecimal> specialValues = new ArrayList<>();
            List<BigDecimal> byWeight = new ArrayList<>();
            while (dxfEntitiesIterator.hasNext()) {
                DXFEntity e = (DXFEntity) dxfEntitiesIterator.next();
                if (e.getType().equals(DXFConstants.ENTITY_TYPE_LINE)) {
                    DXFLine dxfLine = (DXFLine) e;
                    lines.add(dxfLine);
                    BigDecimal dub1 = new BigDecimal(dxfLine.getLength());
                    dub1 = dub1.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);
                    values.add(dub1);
                    if (dxfLine.getLineType().equalsIgnoreCase("Continuous")) {
                        specialValues.add(dub1);
                    }

                    if (dxfLine.getLineWeight() == 20) {
                        byWeight.add(dub1);
                    }
                    LOG.error("line length=" + dxfLine.getLength() + " Layer Name : " + line.getLayerName() + "Style"
                            + line.getDimensionStyleID() + " type:" + dxfLine.getType() + " Line Type "
                            + dxfLine.getLineType() + " " + dxfLine.getLineWeight());

                }

                if (e.getType().equals(DXFConstants.ENTITY_TYPE_MTEXT)) {
                    DXFMText text = (DXFMText) e;
                    text2 = text.getText();

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

                }

            }

            if (values.size() != 3) {
                planDetail.getErrors().put(layerName + "-" + DcrConstants.DIMENSION_LINES_STANDARD, "Dimension " + text2
                        + " marked in layer " + layerName + " is not as per DIGIT-DCR defined standard.");
            }

            if (values.size() > 2) {
                BigDecimal value1 = roundOffTwoDecimal(values.get(0));
                BigDecimal value2 = roundOffTwoDecimal(values.get(1));
                BigDecimal value3 = roundOffTwoDecimal(values.get(2));

                if (value1.compareTo(value2) == 0) {
                    values.remove(1);
                    values.remove(0);

                } else if (value2.compareTo(value3) == 0) {
                    values.remove(2);
                    values.remove(1);

                } else if (value1.compareTo(value3) == 0) {
                    values.remove(2);
                    values.remove(0);

                }
            }
            LOG.error("Before Delete ArrayList : " + values);
            Iterator itr = values.iterator();
            int count = 0;
            while (itr.hasNext()) {
                BigDecimal x = (BigDecimal) itr.next();
                if (count < 2 && roundOffTwoDecimal(x).compareTo(DcrConstants.DIMENSION_MARKING_LINE) == 0) {
                    count++;
                    itr.remove();
                }
            }

            LOG.error("Modified ArrayList : " + values);
            LOG.error("Dimension text : " + text2);
            BigDecimal textValue = BigDecimal.ZERO;
            if (StringUtils.isNotBlank(text2)) {
                textValue = BigDecimal.valueOf(Double.parseDouble(text2))
                        .setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);

            }
            LOG.error("dimDecimal : " + textValue);
            // LOG.error("Dimension text : " + text2);
            if (values.size() == 1) {
                if (values.get(0).compareTo(textValue) == 0) {
                    LOG.debug("Proper Dimension found");
                    dimensionValues.add(values.get(0));
                } else if (values.get(0).compareTo(textValue.subtract(BigDecimal.valueOf(0.4d))) == 0) {
                    BigDecimal actual = values.get(0).add(BigDecimal.valueOf(0.2d));
                    values.remove(0);
                    dimensionValues.add(actual);
                    LOG.debug("Proper Dimension found");
                } else {
                    planDetail.getErrors().put(layerName + "-" + DcrConstants.DIMENSION_EDITED,
                            "Dimension " + text2 + " marked in layer " + layerName + " is edited.");
                }
            } else if (specialValues.size() == 1) {
                if (specialValues.get(0).compareTo(textValue) == 0) {
                    LOG.debug("Next proper Dimension found");
                    dimensionValues.add(specialValues.get(0));
                } else if (specialValues.get(0).compareTo(textValue.subtract(BigDecimal.valueOf(0.4d))) == 0) {
                    BigDecimal actual = specialValues.get(0).add(BigDecimal.valueOf(0.2d));
                    specialValues.remove(0);
                    dimensionValues.add(actual);
                    LOG.debug("Proper Dimension found");
                } else {
                    planDetail.getErrors().put(layerName + "-" + DcrConstants.DIMENSION_EDITED,
                            "Dimension " + text2 + " marked in layer " + layerName + " is edited.");
                }

            } else if (byWeight.size() == 1) {
                if (byWeight.get(0).compareTo(textValue) == 0) {
                    LOG.debug("Next proper Dimension found");
                    dimensionValues.add(byWeight.get(0));
                } else if (byWeight.get(0).compareTo(textValue.subtract(BigDecimal.valueOf(0.4d))) == 0) {
                    BigDecimal actual = byWeight.get(0).add(BigDecimal.valueOf(0.2d));
                    byWeight.remove(0);
                    dimensionValues.add(actual);
                    LOG.debug("Proper Dimension found");
                } else {
                    planDetail.getErrors().put(layerName + "-" + DcrConstants.DIMENSION_EDITED,
                            "Dimension " + text2 + " marked in layer " + layerName + " is edited.");
                }
            } else {
                if (!planDetail.getErrors().containsKey(layerName + "-" + DcrConstants.DIMENSION_LINES_STANDARD))
                    planDetail.getErrors().put(layerName + "-" + DcrConstants.DIMENSION_LINES_STANDARD, "Dimension "
                            + text2 + " marked in layer " + layerName + " is not as per DIGIT-DCR defined standard.");
            }
        }
    }

    /**
     * Extract the all dimension values and will map as key, value pairs Key: Color Code, Value: List of dimension values
     * @param dxfDocument
     * @param name
     * @return
     */
    public static Map<Integer, List<BigDecimal>> extractAndMapDimensionValuesByColorCode(PlanDetail planDetail, String name) {
        DXFDocument dxfDocument = planDetail.getDoc();
        Map<Integer, List<BigDecimal>> dimensionValues = new ConcurrentHashMap<>();
        if (dxfDocument == null)
            return Collections.emptyMap();
        if (name == null)
            return Collections.emptyMap();
        name = name.toUpperCase();

        DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
        if (dxfLayer != null && dxfLayer.getName().equalsIgnoreCase(name)) {
            List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
            if (null != dxfLineEntities)
                for (Object dxfEntity : dxfLineEntities) {
                    DXFDimension line = (DXFDimension) dxfEntity;
                    List<BigDecimal> values = new ArrayList<>();
                    if (dimensionValues.containsKey(line.getColor())) {
                        extractDimensionValue(planDetail, values, line, dxfLayer.getName());
                        List<BigDecimal> existValues = dimensionValues.get(line.getColor());
                        existValues.addAll(values);
                        dimensionValues.put(line.getColor(), existValues);
                    } else {
                        extractDimensionValue(planDetail, values, line, dxfLayer.getName());
                        dimensionValues.put(line.getColor(), values);
                    }
                }
        }
        return dimensionValues;
    }

    private static BigDecimal convertToInch(String text2) {

        if ((text2.contains("'") || text2.contains("\""))) {
            String[] split = text2.split("'");
            BigDecimal inch = BigDecimal.ZERO;

            if (split.length > 1) {
                split[1] = split[1].trim();
                if (split[1].contains(" ") && split[1].contains("/")) {
                    String[] inchSplit = split[1].split(" ");
                    if (inchSplit.length > 1) {
                        String[] fractionSplit = inchSplit[1].split("/");
                        BigDecimal inchDecimalvalue = new BigDecimal(fractionSplit[0])
                                .divide(new BigDecimal(fractionSplit[1].replaceAll("[^\\d]", "")));
                        inch = new BigDecimal(inchSplit[0].replaceAll("[^\\d]", "")).add(inchDecimalvalue);
                    }
                } else {
                    if (split[1].contains("/")) {
                        String[] fractionSplit = split[1].split("/");
                        inch = new BigDecimal(fractionSplit[0])
                                .divide(new BigDecimal(fractionSplit[1].replaceAll("[^\\d]", "")));
                    } else
                        inch = new BigDecimal(split[1].replaceAll("[^\\d.]", ""));
                }
                BigDecimal feetToInch = new BigDecimal(split[0]).multiply(BigDecimal.valueOf(12));
                return feetToInch.add(inch);
            } else if (split[0].contains("\"")) {
                return new BigDecimal(split[0].replaceAll("[^\\d]", ""));
            }
        } else {
            if (text2.contains(" ") && text2.contains("/")) {
                String[] inchSplit = text2.split(" ");
                if (inchSplit.length > 1) {
                    String[] fractionSplit = inchSplit[1].split("/");
                    BigDecimal inchDecimalvalue = new BigDecimal(fractionSplit[0])
                            .divide(new BigDecimal(fractionSplit[1].replaceAll("[^\\d]", "")));
                    return new BigDecimal(inchSplit[0].replaceAll("[^\\d]", "")).add(inchDecimalvalue);
                }
            } else if (text2.contains("/")) {
                String[] fractionSplit = text2.split("/");
                return new BigDecimal(fractionSplit[0])
                        .divide(new BigDecimal(fractionSplit[1].replaceAll("[^\\d]", "")));
            } else
                return new BigDecimal(text2.replaceAll("[^\\d]", ""));
        }

        return new BigDecimal(text2.replaceAll("[^\\d]", "")).multiply(BigDecimal.valueOf(12));
    }

    public static List<BigDecimal> getListOfDimensionValueByLayer(PlanDetail planDetail, String name) {
        DXFDocument dxfDocument = planDetail.getDoc();
        if (dxfDocument == null)
            return null;
        if (name == null)
            return null;
        name = name.toUpperCase();
        List<BigDecimal> values = new ArrayList<>();

        DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
        if (dxfLayer != null && dxfLayer.getName().equalsIgnoreCase(name)) {
            List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
            if (null != dxfLineEntities)
                for (Object dxfEntity : dxfLineEntities) {
                    DXFDimension line = (DXFDimension) dxfEntity;
                    extractDimensionValue(planDetail, values, line, dxfLayer.getName());
                }

        }
        /*
         * if (BigDecimal.ZERO.compareTo(value) == 0) pl.addError(name, "Dimension value is invalid for layer " + name);
         */
        return values;

    }

    public static String getMtextByLayerName(DXFDocument doc, String name) {
        if (name == null)
            return null;
        String param = null;
        name = name.toUpperCase();
        String[] split = name.split(",");
        for (String layerName : split) {

            Boolean found = false;
            Iterator dxfLayerIterator = doc.getDXFLayerIterator();
            while (dxfLayerIterator.hasNext()) {
                DXFLayer next = (DXFLayer) dxfLayerIterator.next();
                DXFLayer planInfoLayer = doc.getDXFLayer(next.getName());
                // if(LOG.isDebugEnabled())
                // LOG.debug("----------"+planInfoLayer.getName()+"---------------------------------------------------");
                if (planInfoLayer != null) {
                    List texts = planInfoLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);
                    if (texts != null) {
                        Iterator iterator = texts.iterator();

                        while (iterator.hasNext()) {
                            DXFText text = (DXFText) iterator.next();
                            // if(LOG.isDebugEnabled()) LOG.debug("Mtext
                            // :"+text.getText());
                        }
                    }

                }
                if (layerName.equals(next.getName().toUpperCase())) {
                    found = true;
                    layerName = next.getName();
                }
            }
            if (!found) {
                LOG.error("No Layer Found with name" + layerName);
                return null;
            }

            DXFLayer planInfoLayer = doc.getDXFLayer(layerName);
            // if(LOG.isDebugEnabled()) LOG.debug(planInfoLayer.getName());
            if (planInfoLayer != null) {
                List texts = planInfoLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);

                // if(LOG.isDebugEnabled()) LOG.debug("Texts list is null ");
                DXFText text = null;
                if (texts != null) {
                    Iterator iterator = texts.iterator();

                    while (iterator.hasNext()) {
                        text = (DXFText) iterator.next();
                        // if(LOG.isDebugEnabled()) LOG.debug("Mtext
                        // :"+text.getText());
                        if (text != null && text.getText() != null) {
                            Iterator styledParagraphIterator = text.getTextDocument().getStyledParagraphIterator();
                            while (styledParagraphIterator.hasNext()) {
                                StyledTextParagraph styledTextParagraph = (StyledTextParagraph) styledParagraphIterator.next();
                                String formattedText = styledTextParagraph.getText();
                                if (StringUtils.isNotBlank(formattedText))
                                    param = formattedText.replace("VOLTS", "").trim();
                            }

                            /*
                             * if(new Float(param).isNaN()) { throw new RuntimeException("Texts in the layer" + layerName
                             * +"Does not follow standard "); }
                             */
                        }
                    }
                }
            }
        }
        return param;
    }

    public static String getMtextByLayerName(DXFDocument doc, String name, String textName) {
        if (name == null)
            return null;
        String param = null;
        name = name.toUpperCase();
        String[] split = name.split(",");
        for (String layerName : split) {

            Boolean found = false;
            Iterator dxfLayerIterator = doc.getDXFLayerIterator();
            while (dxfLayerIterator.hasNext()) {
                DXFLayer next = (DXFLayer) dxfLayerIterator.next();
                DXFLayer planInfoLayer = doc.getDXFLayer(next.getName());
                // if(LOG.isDebugEnabled())
                // LOG.debug("----------"+planInfoLayer.getName()+"---------------------------------------------------");
                if (planInfoLayer != null) {
                    List texts = planInfoLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);
                    if (texts != null) {
                        Iterator iterator = texts.iterator();

                        while (iterator.hasNext()) {
                            DXFText text = (DXFText) iterator.next();
                            // if(LOG.isDebugEnabled()) LOG.debug("Mtext
                            // :"+text.getText());
                        }
                    }

                }
                if (layerName.equals(next.getName().toUpperCase())) {
                    found = true;
                    layerName = next.getName();
                }
            }
            if (!found) {
                LOG.error("No Layer Found with name " + layerName);
                return null;
            }

            DXFLayer planInfoLayer = doc.getDXFLayer(layerName);
            // if(LOG.isDebugEnabled()) LOG.debug(planInfoLayer.getName());
            if (planInfoLayer != null) {
                List texts = planInfoLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);

                // if(LOG.isDebugEnabled()) LOG.debug("Texts list is null ");
                DXFText text = null;
                if (texts != null) {
                    Iterator iterator = texts.iterator();

                    while (iterator.hasNext()) {
                        text = (DXFText) iterator.next();
                        // if(LOG.isDebugEnabled()) LOG.debug("Mtext
                        // :"+text.getText());
                        if (text != null && text.getText() != null) {

                            if (textName != null && textName.equalsIgnoreCase(text.getText())) {
                                param = text.getText();
                                break;
                            } else
                                param = text.getText();

                            param = param.replace("VOLTS", "").trim();
                        }
                    }
                }
            }
        }
        return param;
    }

    public static OccupancyType getOccupancyAsPerFloorArea(OccupancyType occupancy, BigDecimal floorArea) {
        if (OccupancyType.OCCUPANCY_B1.equals(occupancy) || OccupancyType.OCCUPANCY_B2.equals(occupancy)
                || OccupancyType.OCCUPANCY_B3.equals(occupancy)) {
            if (floorArea != null && floorArea.compareTo(ONEHUNDREDFIFTY) <= 0)
                occupancy = OccupancyType.OCCUPANCY_A2;
            else
                occupancy = OccupancyType.OCCUPANCY_B1;
        } else if (OccupancyType.OCCUPANCY_C.equals(occupancy) || OccupancyType.OCCUPANCY_C1.equals(occupancy)
                || OccupancyType.OCCUPANCY_C2.equals(occupancy) || OccupancyType.OCCUPANCY_C3.equals(occupancy)) {
            if (floorArea != null && floorArea.compareTo(ONEHUNDREDFIFTY) <= 0)
                occupancy = OccupancyType.OCCUPANCY_F;
            else
                occupancy = OccupancyType.OCCUPANCY_C;
        } else if (floorArea != null && floorArea.compareTo(ONEHUNDREDFIFTY) <= 0
                && OccupancyType.OCCUPANCY_D.equals(occupancy))
            occupancy = OccupancyType.OCCUPANCY_F;
        else if (OccupancyType.OCCUPANCY_D1.equals(occupancy) || OccupancyType.OCCUPANCY_D2.equals(occupancy))
            occupancy = OccupancyType.OCCUPANCY_D;

        else if (OccupancyType.OCCUPANCY_E.equals(occupancy)) {
            if (floorArea != null && floorArea.compareTo(THREEHUNDRED) <= 0)
                occupancy = OccupancyType.OCCUPANCY_F;
            else
                occupancy = OccupancyType.OCCUPANCY_E;
        } else if (OccupancyType.OCCUPANCY_H.equals(occupancy)) {
            if (floorArea != null && floorArea.compareTo(THREEHUNDRED) <= 0)
                occupancy = OccupancyType.OCCUPANCY_F;
            else
                occupancy = OccupancyType.OCCUPANCY_H;
        } else if (OccupancyType.OCCUPANCY_A5.equals(occupancy))
            if (floorArea != null && floorArea.compareTo(FIFTY) <= 0)
                occupancy = OccupancyType.OCCUPANCY_A1;
            else
                occupancy = OccupancyType.OCCUPANCY_F;
        return occupancy;
    }

    public Map<String, String> getPlanInfoProperties(DXFDocument doc) {

        DXFLayer planInfoLayer = doc.getDXFLayer(layerNames.getLayerName("LAYER_NAME_PLAN_INFO"));
        List texts = planInfoLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);
        String param = "";
        DXFText text = null;
        Map<String, String> planInfoProperties = new HashMap<>();

        if (texts != null) {

            Iterator iterator = texts.iterator();
            String[] split;
            String s = "\\";
            while (iterator.hasNext()) {
                text = (DXFText) iterator.next();

                param = text.getText();
                param = param.replace(s, "#");
                if (param.contains("#P"))
                    split = param.split("#P");
                else {
                    split = new String[1];
                    split[0] = param;
                }

                for (String element : split) {

                    String[] data = element.split("=");
                    if (data.length == 2)

                        planInfoProperties.put(data[0], data[1]);
                    else {
                        // throw new RuntimeException("Plan info sheet data not
                        // following standard '=' for " +param);
                    }
                }
            }
        }
        return planInfoProperties;

    }

    public Map<String, String> getFormatedPlanInfoProperties(DXFDocument doc) {

        DXFLayer planInfoLayer = doc.getDXFLayer(layerNames.getLayerName("LAYER_NAME_PLAN_INFO"));
        List texts = planInfoLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);
        DXFText text = null;
        Map<String, String> planInfoProperties = new HashMap<>();

        if (texts != null && texts.size() > 0) {
            Iterator iterator = texts.iterator();
            while (iterator.hasNext()) {
                text = (DXFText) iterator.next();
                Iterator styledParagraphIterator = text.getTextDocument().getStyledParagraphIterator();
                while (styledParagraphIterator.hasNext()) {
                    StyledTextParagraph styledTextParagraph = (StyledTextParagraph) styledParagraphIterator.next();
                    String[] data = styledTextParagraph.getText().split("=");
                    System.out.println(styledTextParagraph.getText());
                    if (data.length == 2)
                        planInfoProperties.put(data[0].trim(), data[1].trim());
                }

            }
        }
        return planInfoProperties;
    }

    public static List<DXFCircle> getPolyCircleByLayer(DXFDocument dxfDocument, String name) {

        List<DXFCircle> dxfCircles = new ArrayList<>();
        if (name == null)
            return dxfCircles;
        if (dxfDocument.containsDXFLayer(name)) {
            DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);

            if (dxfLayer.getName().equalsIgnoreCase(name) && dxfLayer.hasDXFEntities(DXFConstants.ENTITY_TYPE_CIRCLE)) {
                List dxfCircleEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_CIRCLE);
                for (Object dxfEntity : dxfCircleEntities) {
                    DXFCircle dxflwPolyline = (DXFCircle) dxfEntity;
                    dxfCircles.add(dxflwPolyline);
                }

            }
        }
        return dxfCircles;

    }

    public static Polygon getPolygon(DXFLWPolyline plotBoundary) {
        List<Point> pointsOnPolygon = pointsOnPolygon(plotBoundary);
        return new Polygon(pointsOnPolygon);
    }

    public static BigDecimal getPolyLineArea(DXFPolyline dxfPolyline) {

        ArrayList x = new ArrayList();
        ArrayList y = new ArrayList();
        if (dxfPolyline == null)
            return BigDecimal.ZERO;
        Iterator vertexIterator = dxfPolyline.getVertexIterator();

        // Vertex and coordinates of Polyline
        while (vertexIterator.hasNext()) {

            DXFVertex dxfVertex = (DXFVertex) vertexIterator.next();
            Point point = dxfVertex.getPoint();

            // values needed to calculate area
            x.add(point.getX());
            y.add(point.getY());

        }

        return polygonArea(x, y, dxfPolyline.getVertexCount());
    }

    public static List<DXFLWPolyline> getPolyLinesByLayer(DXFDocument dxfDocument, String name) {

        List<DXFLWPolyline> dxflwPolylines = new ArrayList<>();
        if (name == null)
            return dxflwPolylines;
        if (dxfDocument.containsDXFLayer(name)) {
            DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
            if (dxfLayer.getName().equalsIgnoreCase(name))
                if (dxfLayer.hasDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE)) {
                    List dxfPolyLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE);
                    for (Object dxfEntity : dxfPolyLineEntities) {
                        DXFLWPolyline dxflwPolyline = (DXFLWPolyline) dxfEntity;
                        dxflwPolylines.add(dxflwPolyline);
                    }

                } else {
                    // TODO: add what if polylines not found

                }
        }
        return dxflwPolylines;

    }

    public static List<DXFLWPolyline> getPolyLinesByLayerAndColor(DXFDocument dxfDocument, String layerName,
            int colorCode, PlanDetail pl) {

        List<DXFLWPolyline> dxflwPolylines = new ArrayList<>();

        if (layerName == null)
            return dxflwPolylines;
        if (dxfDocument.containsDXFLayer(layerName)) {
            DXFLayer dxfLayer = dxfDocument.getDXFLayer(layerName);
            if (dxfLayer.getName().equalsIgnoreCase(layerName)) {

                if (dxfLayer.hasDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE)) {
                    List dxfPolyLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE);
                    for (Object dxfEntity : dxfPolyLineEntities) {
                        DXFLWPolyline dxflwPolyline = (DXFLWPolyline) dxfEntity;
                        if (colorCode == dxflwPolyline.getColor())
                            dxflwPolylines.add(dxflwPolyline);
                    }
                }

            } else {
                // TODO: add what if polylines not found
            }
        }

        return dxflwPolylines;
    }

    public static DXFDimension getSingleDimensionByLayer(DXFDocument dxfDocument, String name) {

        if (dxfDocument == null)
            return null;
        if (name == null)
            return null;
        name = name.toUpperCase();

        List<DXFDimension> dimensions = new ArrayList<>();

        Iterator dxfLayerIterator = dxfDocument.getDXFLayerIterator();

        while (dxfLayerIterator.hasNext()) {

            DXFLayer dxfLayer = (DXFLayer) dxfLayerIterator.next();
            if (dxfLayer.getName().equalsIgnoreCase(name)) {

                List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);

                if (null != dxfLineEntities)
                    for (Object dxfEntity : dxfLineEntities) {

                        DXFDimension line = (DXFDimension) dxfEntity;
                        String dimensionBlock = line.getDimensionBlock();
                        DXFBlock dxfBlock = dxfDocument.getDXFBlock(dimensionBlock);
                        if (LOG.isDebugEnabled())
                            LOG.debug("BLOCK data" + dxfBlock.getDescription());
                        DXFDimensionStyle dxfDimensionStyle = dxfDocument
                                .getDXFDimensionStyle(line.getDimensionStyleID());
                        if (LOG.isDebugEnabled())
                            LOG.debug("---" + dxfDimensionStyle.getProperty(DXFDimensionStyle.PROPERTY_DIMEXO));
                        // if(LOG.isDebugEnabled())
                        // LOG.debug(line.getInclinationHelpLine()+"HELP
                        // LINE"+line.getDimensionText()
                        // +"--"+line.getLayerName()+"--"+line.getDimensionArea());

                        if (name.contains(line.getLayerName().toUpperCase()))
                            dimensions.add(line);

                    }
            }
        }
        if (dimensions.size() == 1)
            return dimensions.get(0);
        else
            return null;

    }

    public static BigDecimal getSingleDimensionValueByLayer(DXFDocument dxfDocument, String name, PlanDetail pl) {

        if (dxfDocument == null)
            return null;
        if (name == null)
            return null;
        name = name.toUpperCase();

        if (!pl.getStrictlyValidateDimension()) {
            BigDecimal value = BigDecimal.ZERO;

            DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
            if (dxfLayer.getName().equalsIgnoreCase(name)) {
                List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);

                if (null != dxfLineEntities)
                    for (Object dxfEntity : dxfLineEntities) {

                        DXFDimension line = (DXFDimension) dxfEntity;
                        String dimensionBlock = line.getDimensionBlock();
                        DXFBlock dxfBlock = dxfDocument.getDXFBlock(dimensionBlock);
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

                                if (!text2.isEmpty())
                                    value = BigDecimal.valueOf(Double.parseDouble(text2));

                            }
                        }
                    }

            }

            return value;
        } else {
            List<BigDecimal> values = new ArrayList<>();
            DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
            if (dxfLayer.getName().equalsIgnoreCase(name)) {
                List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);

                if (null != dxfLineEntities) {
                    for (Object dxfEntity : dxfLineEntities) {
                        DXFDimension line = (DXFDimension) dxfEntity;
                        extractDimensionValue(pl, values, line, dxfLayer.getName());
                    }
                    return values.isEmpty() ? BigDecimal.ZERO : values.get(0);
                }

            }

        }
        return BigDecimal.ZERO;

    }

    public static DXFLine getSingleLineByLayer(DXFDocument dxfDocument, String name) {

        if (name == null)
            return null;
        if (dxfDocument == null)
            return null;
        if (name == null)
            return null;

        name = name.toUpperCase();

        List<DXFLine> lines = new ArrayList<>();

        new ArrayList<>();

        DXFLayer dxfLayer = dxfDocument.getDXFLayer(name);
        // if layer with name not found kabeja will return default layer or
        // create new layer and gives
        if (dxfLayer.getName().equalsIgnoreCase(name)) {

            List dxfLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LINE);

            if (null != dxfLineEntities)
                for (Object dxfEntity : dxfLineEntities) {

                    DXFLine line = (DXFLine) dxfEntity;

                    if (name.contains(line.getLayerName().toUpperCase()))
                        lines.add(line);

                }

        }
        if (lines.size() == 1)
            return lines.get(0);
        else
            return null;

    }

    public static BigDecimal getSmallestSide(DXFLWPolyline polyLine) {
        List<Point> pointsOnPolygon = pointsOnPolygon(polyLine);
        Point oldPoint = null;
        double distance = 0d;
        double smallSide = 0d;
        for (Point p : pointsOnPolygon)
            if (oldPoint == null)
                oldPoint = p;
            else {
                distance = MathUtils.distance(oldPoint, p);
                oldPoint = p;
                if (distance < smallSide)
                    smallSide = distance;
            }
        return BigDecimal.valueOf(smallSide);
    }

    protected static int getTotalFloorCount(DXFDocument dxfDocument, Integer colorCode) {

        int i = 0;
        Iterator dxfLayerIterator = dxfDocument.getDXFLayerIterator();
        while (dxfLayerIterator.hasNext()) {

            DXFLayer dxfLayer = (DXFLayer) dxfLayerIterator.next();

            if (colorCode != null && dxfLayer.getColor() == colorCode
                    || dxfLayer.getName().startsWith(FLOOR_NAME_PREFIX))
                i++;

        }

        return i;
    }

    private static DXFLine isALine(Point old, Point in, List<DXFLine> lines) {
        LOG.debug("IS A Line api...............");
        LOG.debug("Points are" + old.getX() + " ," + old.getY() + " and " + in.getX() + " , " + in.getY());
        /*
         * if(old.getX()== -30.8147745851d && old.getY()==18662.1171192d && in.getX()==-27.0547745852d ) { LOG.info("Debug This");
         * }
         */
        for (DXFLine line : lines) {

            if (pointsEquals(line.getStartPoint(), line.getEndPoint()))
                continue;
            boolean start1 = pointsEquals(old, line.getStartPoint());
            boolean start2 = pointsEquals(in, line.getStartPoint());
            boolean end1 = pointsEquals(old, line.getEndPoint());
            boolean end2 = pointsEquals(in, line.getEndPoint());
            /*
             * LOG.debug("The Line is " + line.getStartPoint().getX() + " , " + line.getStartPoint().getY() + " and " +
             * line.getEndPoint().getX() + " , " + line.getEndPoint().getY());
             */

            if ((start1 || start2) && (end1 || end2)) {
                LOG.debug("is line ........................................... ");
                return line;
            }
        }
        // LOG.debug("for Point" + old.getX() + " ," + old.getY() + " and " +
        // in.getX() + " , " + in.getY());
        LOG.debug("is not on any  line ........................................... ");
        LOG.debug("IS A Line api........END.......");
        return null;
    }

    public static boolean pointsEquals(Point point1, Point point) {
        BigDecimal px = BigDecimal.valueOf(point.getX()).setScale(DECIMALDIGITS, BigDecimal.ROUND_DOWN);
        BigDecimal py = BigDecimal.valueOf(point.getY()).setScale(DECIMALDIGITS, BigDecimal.ROUND_DOWN);
        BigDecimal p1x = BigDecimal.valueOf(point1.getX()).setScale(DECIMALDIGITS, BigDecimal.ROUND_DOWN);
        BigDecimal p1y = BigDecimal.valueOf(point1.getY()).setScale(DECIMALDIGITS, BigDecimal.ROUND_DOWN);
        if (px.compareTo(p1x) == 0 && py.compareTo(p1y) == 0)
            return true;
        else
            return false;
    }

    public static boolean pointsEqualsWith2PercentError(Point point1, Point point) {
        BigDecimal px = BigDecimal.valueOf(point.getX()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                BigDecimal.ROUND_DOWN);
        BigDecimal py = BigDecimal.valueOf(point.getY()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                BigDecimal.ROUND_DOWN);
        BigDecimal p1x = BigDecimal.valueOf(point1.getX()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                BigDecimal.ROUND_DOWN);
        BigDecimal p1y = BigDecimal.valueOf(point1.getY()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                BigDecimal.ROUND_DOWN);
        double d = 0.01;

        if (px.compareTo(p1x) == 0 && py.compareTo(p1y) == 0) {
            LOG.debug(" Matched in pointsEqualsWith2PercentError for points using round down with exact match");
            PrintUtil.print(point1, "Point on Boundary Line ");
            PrintUtil.print(point, "Point to match ");
            return true;
        } else if (Math.abs(px.doubleValue() - p1x.doubleValue()) <= d
                && Math.abs(py.doubleValue() - p1y.doubleValue()) <= d) {
            LOG.debug(" Matched in pointsEqualsWith2PercentError for points using round down");
            PrintUtil.print(point1, "Point on Boundary Line ");
            PrintUtil.print(point, "Point to match ");

            return true;
        } else {
            px = BigDecimal.valueOf(point.getX()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                    BigDecimal.ROUND_HALF_UP);
            py = BigDecimal.valueOf(point.getY()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                    BigDecimal.ROUND_HALF_UP);
            p1x = BigDecimal.valueOf(point1.getX()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                    BigDecimal.ROUND_HALF_UP);
            p1y = BigDecimal.valueOf(point1.getY()).setScale(COMPARE_WITH_2_PERCENT_ERROR_DIGITS,
                    BigDecimal.ROUND_HALF_UP);
            d = 0.01;

            if (px.compareTo(p1x) == 0 && py.compareTo(p1y) == 0) {
                LOG.debug(" Matched in pointsEqualsWith2PercentError for points using round halfup with exact match");
                PrintUtil.print(point1, "Point on Boundary Line ");
                PrintUtil.print(point, "Point to match ");
                return true;
            } else if (Math.abs(px.doubleValue() - p1x.doubleValue()) <= d
                    && Math.abs(py.doubleValue() - p1y.doubleValue()) <= d) {
                LOG.debug(" Matched in pointsEqualsWith2PercentError for points using round halfup");
                PrintUtil.print(point1, "Point on Boundary Line ");
                PrintUtil.print(point, "Point to match ");
                return true;
            }

        }
        return false;
    }

    public static List<Point> pointsOnPolygon(DXFLWPolyline plotBoundary) {
        if (plotBoundary == null)
            return null;
        plotBoundary.getVertexCount();
        List<Point> points = new ArrayList<>();
        Iterator plotBIterator1 = plotBoundary.getVertexIterator();
        while (plotBIterator1.hasNext()) {

            DXFVertex dxfVertex = (DXFVertex) plotBIterator1.next();
            Point point1 = dxfVertex.getPoint();

            points.add(point1);

        }

        points.add(points.get(0));
        return points;
    }

    // Using ShoeLace Formula to calculate area of polygon
    private static BigDecimal polygonArea(ArrayList<Double> x, ArrayList<Double> y, int numPoints) {

        double area = 0; // Accumulates area in the loop
        int j = numPoints - 1; // The last vertex is the 'previous' one to the
        // first

        for (int i = 0; i < numPoints; i++) {
            area = area + (x.get(j) + x.get(i)) * (y.get(j) - y.get(i));
            j = i; // j is previous vertex to i
        }

        BigDecimal convertedArea = new BigDecimal(area / 2);

        return convertedArea.setScale(4, RoundingMode.HALF_UP).abs();

    }

    public static void setDimension(Measurement measurement, DXFLWPolyline polyLine) {
        Iterator vertexIterator2 = polyLine.getVertexIterator();
        if (LOG.isDebugEnabled())
            while (vertexIterator2.hasNext()) {
                DXFVertex dxfVertex = (DXFVertex) vertexIterator2.next();
                Point p = dxfVertex.getPoint();
                LOG.debug(p.getX() + " " + p.getY());
            }

        // if (polyLine.getVertexCount() == 4 || polyLine.getVertexCount() == 5) {
        if (polyLine.getVertexCount() > 1) {
            Iterator vertexIterator = polyLine.getVertexIterator();
            Point next = null, first = null;
            List<Double> distances = new ArrayList<>();
            while (vertexIterator.hasNext()) {
                DXFVertex dxfVertex = (DXFVertex) vertexIterator.next();
                Point p = dxfVertex.getPoint();
                if (next == null) {
                    next = p;
                    first = p;
                    continue;
                }
                distances.add(MathUtils.distance(next, p));
                next = p;
            }
            if (!pointsEquals(next, first))
                distances.add(MathUtils.distance(next, first));

            if (!distances.isEmpty()) {
                measurement.setWidth(BigDecimal.valueOf(Collections.min(distances)));
                measurement.setHeight(BigDecimal.valueOf(Collections.max(distances)));
                measurement.setMinimumSide(BigDecimal.valueOf(Collections.min(distances)));
            } else {
                measurement.setWidth(BigDecimal.ZERO);
                measurement.setHeight(BigDecimal.ZERO);
                measurement.setMinimumSide(BigDecimal.ZERO);
            }
        } else
            measurement.setInvalidReason("It is not rectangle, found " + polyLine.getVertexCount() + " points");
    }

    public static void setOccupancyType(DXFLWPolyline pline, Occupancy occupancy) {
        if (pline.getColor() == DxfFileConstants.OCCUPANCY_A1_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_A1);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A1_APARTMENT_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_A4);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A1_PROFESSIONALOFFICE_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_A5);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A2_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_A2);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A2_BOARDING_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_A3);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_B1_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_B1);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_B2_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_B2);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_B3_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_B3);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_C1_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_C1);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_C2_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_C2);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_C3_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_C3);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_D_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_D);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_D1_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_D1);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_D2_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_D2);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_E_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_E);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_F);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F1_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_F1);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F2_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_F2);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F3_HOTEL_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_F3);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_G1_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_G1);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_G2_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_G2);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_H_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_H);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_I1_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_I1);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_I2_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_I2);
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_I2_KIOSK_COLOR_CODE)
            occupancy.setType(OccupancyType.OCCUPANCY_F4);
    }

    public static OccupancyType findOccupancyType(DXFLWPolyline pline) {
        if (pline.getColor() == DxfFileConstants.OCCUPANCY_A1_COLOR_CODE)
            return OccupancyType.OCCUPANCY_A1;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A1_APARTMENT_COLOR_CODE)
            return OccupancyType.OCCUPANCY_A4;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A1_PROFESSIONALOFFICE_COLOR_CODE)
            return OccupancyType.OCCUPANCY_A5;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A2_COLOR_CODE)
            return OccupancyType.OCCUPANCY_A2;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_A2_BOARDING_COLOR_CODE)
            return OccupancyType.OCCUPANCY_A3;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_B1_COLOR_CODE)
            return OccupancyType.OCCUPANCY_B1;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_B2_COLOR_CODE)
            return OccupancyType.OCCUPANCY_B2;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_B3_COLOR_CODE)
            return OccupancyType.OCCUPANCY_B3;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_C1_COLOR_CODE)
            return OccupancyType.OCCUPANCY_C1;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_C2_COLOR_CODE)
            return OccupancyType.OCCUPANCY_C2;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_C3_COLOR_CODE)
            return OccupancyType.OCCUPANCY_C3;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_D_COLOR_CODE)
            return OccupancyType.OCCUPANCY_D;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_D1_COLOR_CODE)
            return OccupancyType.OCCUPANCY_D1;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_D2_COLOR_CODE)
            return OccupancyType.OCCUPANCY_D2;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_E_COLOR_CODE)
            return OccupancyType.OCCUPANCY_E;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F_COLOR_CODE)
            return OccupancyType.OCCUPANCY_F;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F1_COLOR_CODE)
            return OccupancyType.OCCUPANCY_F1;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F2_COLOR_CODE)
            return OccupancyType.OCCUPANCY_F2;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_F3_HOTEL_COLOR_CODE)
            return OccupancyType.OCCUPANCY_F3;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_G1_COLOR_CODE)
            return OccupancyType.OCCUPANCY_G1;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_G2_COLOR_CODE)
            return OccupancyType.OCCUPANCY_G2;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_H_COLOR_CODE)
            return OccupancyType.OCCUPANCY_H;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_I1_COLOR_CODE)
            return OccupancyType.OCCUPANCY_I1;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_I2_COLOR_CODE)
            return OccupancyType.OCCUPANCY_I2;
        else if (pline.getColor() == DxfFileConstants.OCCUPANCY_I2_KIOSK_COLOR_CODE)
            return OccupancyType.OCCUPANCY_F4;
        else
            return null;
    }

    public static OccupancyTypeHelper findOccupancyType(DXFLWPolyline pline, PlanDetail pl) {
        OccupancyTypeHelper oth = new OccupancyTypeHelper();
        if (!pl.getUsagesMaster().isEmpty() && pl.getUsagesMaster().containsKey(pline.getColor())) {
            Usage usage = pl.getUsagesMaster().get(pline.getColor());
            OccupancyHelperDetail usageTypeDtl = new OccupancyHelperDetail();
            usageTypeDtl.setColor(pline.getColor());
            usageTypeDtl.setCode(usage.getCode());
            usageTypeDtl.setName(usage.getName());
            oth.setUsage(usageTypeDtl);
            SubOccupancy subOcc = usage.getSubOccupancy();
            OccupancyHelperDetail occSubTypeDtl = new OccupancyHelperDetail();
            occSubTypeDtl.setCode(subOcc.getCode());
            occSubTypeDtl.setName(subOcc.getName());
            oth.setSubtype(occSubTypeDtl);
            OccupancyHelperDetail occTypeDtl = new OccupancyHelperDetail();
            org.egov.common.entity.bpa.Occupancy occ = subOcc.getOccupancy();
            occTypeDtl.setCode(occ.getCode());
            occTypeDtl.setName(occ.getName());
            oth.setType(occTypeDtl);
        }
        if (!pl.getSubOccupanciesMaster().isEmpty() && pl.getSubOccupanciesMaster().containsKey(pline.getColor())) {
            SubOccupancy subOcc = pl.getSubOccupanciesMaster().get(pline.getColor());
            OccupancyHelperDetail occSubTypeDtl = new OccupancyHelperDetail();
            occSubTypeDtl.setColor(pline.getColor());
            occSubTypeDtl.setCode(subOcc.getCode());
            occSubTypeDtl.setName(subOcc.getName());
            oth.setSubtype(occSubTypeDtl);
            OccupancyHelperDetail occTypeDtl = new OccupancyHelperDetail();
            org.egov.common.entity.bpa.Occupancy occ = subOcc.getOccupancy();
            occTypeDtl.setCode(occ.getCode());
            occTypeDtl.setName(occ.getName());
            oth.setType(occTypeDtl);
        }
        if (!pl.getOccupanciesMaster().isEmpty() && pl.getOccupanciesMaster().containsKey(pline.getColor())) {
            org.egov.common.entity.bpa.Occupancy occ = pl.getOccupanciesMaster().get(pline.getColor());
            OccupancyHelperDetail occTypeDtl = new OccupancyHelperDetail();
            occTypeDtl.setColor(pline.getColor());
            occTypeDtl.setCode(occ.getCode());
            occTypeDtl.setName(occ.getName());
            oth.setType(occTypeDtl);
        }

        return oth;
    }

    public List<DXFLine> getLinesByColor(DXFDocument dxfDocument, Integer color) {

        List<DXFLine> lines = new ArrayList<>();

        Iterator dxfLayerIterator = dxfDocument.getDXFLayerIterator();

        while (dxfLayerIterator.hasNext()) {

            DXFLayer dxfLayer = (DXFLayer) dxfLayerIterator.next();

            List dxfPolyLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LINE);

            if (null != dxfPolyLineEntities)
                for (Object dxfEntity : dxfPolyLineEntities) {

                    DXFLine line = (DXFLine) dxfEntity;

                    if (color == line.getColor())
                        lines.add(line);

                }
        }

        return lines;
    }

    public List<DXFLWPolyline> getPolyLinesByColor(DXFDocument dxfDocument, Integer colorCode) {

        List<DXFLWPolyline> dxflwPolylines = new ArrayList<>();

        Iterator dxfLayerIterator = dxfDocument.getDXFLayerIterator();

        while (dxfLayerIterator.hasNext()) {

            DXFLayer dxfLayer = (DXFLayer) dxfLayerIterator.next();

            List dxfPolyLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE);

            if (null != dxfPolyLineEntities)
                for (Object dxfEntity : dxfPolyLineEntities) {

                    DXFLWPolyline dxflwPolyline = (DXFLWPolyline) dxfEntity;

                    if (colorCode == dxflwPolyline.getColor())
                        dxflwPolylines.add(dxflwPolyline);
                }
        }

        return dxflwPolylines;
    }

    public List<DXFLWPolyline> getPolyLinesByColors(DXFDocument dxfDocument, List<Integer> colorCodes) {

        List<DXFLWPolyline> dxflwPolylines = new ArrayList<>();

        Iterator dxfLayerIterator = dxfDocument.getDXFLayerIterator();

        while (dxfLayerIterator.hasNext()) {

            DXFLayer dxfLayer = (DXFLayer) dxfLayerIterator.next();

            List dxfPolyLineEntities = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE);

            if (null != dxfPolyLineEntities)
                for (Object dxfEntity : dxfPolyLineEntities) {

                    DXFLWPolyline dxflwPolyline = (DXFLWPolyline) dxfEntity;

                    for (int colorCode : colorCodes)
                        if (colorCode == dxflwPolyline.getColor())
                            dxflwPolylines.add(dxflwPolyline);
                }
        }

        return dxflwPolylines;
    }

    public static Map<String, Object> getTypicalFloorValues(Block block, Floor floor,
            Boolean isTypicalRepititiveFloor) {
        Map<String, Object> mapOfTypicalFloorValues = new HashMap<>();
        List<Integer> typicalFlrs = new ArrayList<>();
        String typicalFloors = null;
        Integer maxTypicalFloors;
        Integer minTypicalFloors;
        if (block.getTypicalFloor() != null)
            for (TypicalFloor typicalFloor : block.getTypicalFloor()) {
                if (typicalFloor.getRepetitiveFloorNos().contains(floor.getNumber()))
                    isTypicalRepititiveFloor = true;
                if (typicalFloor.getModelFloorNo() == floor.getNumber()) {
                    typicalFlrs.add(floor.getNumber());
                    typicalFlrs.addAll(typicalFloor.getRepetitiveFloorNos());
                    if (!typicalFlrs.isEmpty()) {
                        maxTypicalFloors = typicalFlrs.get(0);
                        minTypicalFloors = typicalFlrs.get(0);
                        for (Integer typical : typicalFlrs) {
                            if (typical > maxTypicalFloors)
                                maxTypicalFloors = typical;
                            if (typical < minTypicalFloors)
                                minTypicalFloors = typical;
                        }
                        typicalFloors = "Typical Floor " + minTypicalFloors + " to " + maxTypicalFloors;

                    }
                }
            }
        mapOfTypicalFloorValues.put("isTypicalRepititiveFloor", isTypicalRepititiveFloor);
        mapOfTypicalFloorValues.put("typicalFloors", typicalFloors);
        return mapOfTypicalFloorValues;
    }

    public static boolean checkExemptionConditionForBuildingParts(Block blk) {
        if (blk.getBuilding() != null && blk.getBuilding().getFloorsAboveGround() != null)
            if (blk.getResidentialBuilding() && blk.getBuilding().getFloorsAboveGround().intValue() <= 3)
                return true;
        return false;
    }

    public static boolean checkExemptionConditionForSmallPlotAtBlkLevel(Plot plot, Block blk) {
        if (plot != null && blk.getBuilding() != null && blk.getBuilding().getFloorsAboveGround() != null)
            if (blk.getResidentialOrCommercialBuilding() && plot.getSmallPlot()
                    && blk.getBuilding().getFloorsAboveGround().intValue() <= 3)
                return true;
        return false;
    }

    public static boolean isSmallPlot(PlanDetail pl) {
        if (pl != null && !pl.getBlocks().isEmpty() && pl.getPlot() != null && pl.getVirtualBuilding() != null)
            if (checkAnyBlockHasFloorsGreaterThanThree(pl.getBlocks()) == false
                    && pl.getVirtualBuilding().getResidentialOrCommercialBuilding().equals(Boolean.TRUE)
                    && pl.getPlot().getSmallPlot().equals(Boolean.TRUE))
                return true;
        return false;
    }

    public static boolean checkAnyBlockHasFloorsGreaterThanThree(List<Block> blockList) {
        boolean isBlockFloorsGreaterThanThree = false;
        if (!blockList.isEmpty())
            for (Block blk : blockList)
                if (blk.getBuilding() != null && blk.getBuilding().getFloorsAboveGround() != null
                        && blk.getBuilding().getFloorsAboveGround().compareTo(BigDecimal.valueOf(3)) > 0) {
                    isBlockFloorsGreaterThanThree = true;
                    break;
                }
        return isBlockFloorsGreaterThanThree;
    }

    public static BigDecimal roundOffTwoDecimal(BigDecimal number) {
        return number != null
                ? number.setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS)
                : BigDecimal.ZERO;
    }

    public void setLayerNames(LayerNames layerNames) {
        this.layerNames = layerNames;
    }

    public static double getSlope(Point startPoint, Point endPoint) {
        return (endPoint.getY() - startPoint.getY()) / (endPoint.getX() - startPoint.getX());
    }

    public static Point getMidPoint(DXFVertex line1, DXFVertex line2) {

        return new Point((line1.getX() + line2.getX()) / 2, (line1.getY() + line2.getY()) / 2, 0d);
    }

    public static String getTexForDimension(String text) {
        String[] split = text.split(" X ");
        if (split.length > 4) {
            return text;
        } else if (split.length == 4) {
            Set<String> set = new HashSet();
            set.add(split[0]);
            set.add(split[1]);
            set.add(split[2]);
            set.add(split[3]);
            String[] a = new String[2];
            if (set.size() == 2) {
                set.toArray(a);
                return a[0] + " X " + a[1];
            } else {
                return text;
            }
        } else
            return text;

    }

    public static Point findCentroid(DXFEntity e) {

        DXFPolyline pline = (DXFPolyline) e;
        Iterator vertexIterator = pline.getVertexIterator();
        double x = 0, y = 0;
        double centroidX = 0, centroidY = 0;
        DXFVertex p;
        DXFVertex first = null, point1 = null;
        StringBuilder text = new StringBuilder(50);
        while (vertexIterator.hasNext()) {
            if (point1 == null) {
                point1 = (DXFVertex) vertexIterator.next();
                first = point1;
            }
            p = (DXFVertex) vertexIterator.next();

            x += p.getX();
            y += p.getY();

            text.append(p.getLength());
            if (vertexIterator.hasNext())
                text.append(" X ");
        }

        centroidX = x / pline.getVertexCount();
        centroidY = y / pline.getVertexCount();
        return new Point(centroidX, centroidY, 0);

    }

    public static String getDimensionText(DXFEntity e) {
        DXFPolyline pline = (DXFPolyline) e;
        Iterator vertexIterator = pline.getVertexIterator();
        DXFVertex p;
        StringBuilder text = new StringBuilder(50);
        while (vertexIterator.hasNext()) {
            p = (DXFVertex) vertexIterator.next();
            text.append(p.getLength());
            if (vertexIterator.hasNext())
                text.append(" X ");
        }

        return text.toString();
    }

    public static String getPolylinePrintableText(DXFPolyline pline, DXFLayer dxfLayer, EdcrPdfDetail detail, PlanDetail pl) {

        OccupancyTypeHelper occupancyType = null;
        String name = null;
        
        if (pline.getColor() != 0) {
            occupancyType = findOccupancyType((DXFLWPolyline) pline, pl);
        }
        if (occupancyType != null) {
            String occupancyName = "";
                if (occupancyType.getSubtype() != null)
                    occupancyName = occupancyType.getSubtype().getName();
                else {
                    if (occupancyType.getType() != null)
                        occupancyName = occupancyType.getType().getName();
                }
            LOG.info("returning Occupancy " + occupancyName);
            return occupancyName;

        } else {
            name = dxfLayer.getName();
            name = name.replace("BLK_", "");
            name = name.replace("FLR_", "");
            name.replace("NO_", "");
            name.replaceAll("[^\\d.]", "");
            LOG.info("returning layer name " + name);
            return name;
        }
    }
}