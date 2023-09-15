package org.egov.edcr.feature;

import static org.apache.commons.lang3.StringUtils.isBlank;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.apache.pdfbox.printing.Orientation;
import org.egov.common.entity.dcr.helper.DxfToPdfLayerConfig;
import org.egov.common.entity.dcr.helper.PlanPdfLayerConfig;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.EdcrPdfDetail;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.SetBack;
import org.egov.commons.mdms.EDCRMdmsUtil;
import org.egov.commons.mdms.config.MdmsConfiguration;
import org.egov.commons.mdms.model.MdmsEdcrResponse;
import org.egov.commons.mdms.validator.MDMSValidator;
import org.egov.edcr.entity.PdfPageSize;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.DcrSvgGenerator;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.microservice.models.RequestInfo;
import org.json.simple.JSONObject;
import org.kabeja.batik.tools.SAXPDFSerializer;
import org.kabeja.dxf.DXFBlock;
import org.kabeja.dxf.DXFConstants;
import org.kabeja.dxf.DXFDimension;
import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.DXFEntity;
import org.kabeja.dxf.DXFHatch;
import org.kabeja.dxf.DXFInsert;
import org.kabeja.dxf.DXFLayer;
import org.kabeja.dxf.DXFLine;
import org.kabeja.dxf.DXFMText;
import org.kabeja.dxf.DXFPolyline;
import org.kabeja.dxf.DXFSolid;
import org.kabeja.dxf.DXFStyle;
import org.kabeja.dxf.DXFText;
import org.kabeja.dxf.DXFVariable;
import org.kabeja.dxf.DXFVertex;
import org.kabeja.dxf.helpers.Point;
import org.kabeja.dxf.helpers.StyledTextParagraph;
import org.kabeja.math.MathUtils;
import org.kabeja.xml.SAXSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Rectangle;

@Service
public class DxfToPdfConverterExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(DxfToPdfConverterExtract.class);

    private static final String MULTIPLE_LAYER = "Multiple layers is defined with %s";
    private static final String LAYER_NOT_DEFINED = "%s is not defined.";
    private static final String NEGATIVE_WIDTH = "Negative width defined in block ";

    private static final String UNDERLINE_CAPITAL = "\\L";
    private static final String UNDERLINE_SMALL = "\\l";
    // DXFTEXT.VALIGN_TOP = 3 meaning the text is aligned vertical to the top
    private static final int TEXT_VALLIGNMENT_TOP = 3;
    private static final String POWER = "Â";

    @Autowired
    private AppConfigValueService appConfigValueService;
    @Autowired
    private EDCRMdmsUtil edcrMdmsUtil;
    @Autowired
    private MdmsConfiguration mdmsConfiguration;
    @Autowired
    private MDMSValidator mdmsValidator;
    @Autowired
    private CityService cityService;
    @Value("${is.environment.central.instance}")
    private String isEnvironmentCentralInstance;

    @Override
    public PlanDetail extract(PlanDetail planDetail) {

        Boolean mdmsEnabled = mdmsConfiguration.getMdmsEnabled();
        boolean mdmsDxfToPdfEnabled = false;
        if (mdmsEnabled != null && mdmsEnabled) {
            City stateCity = cityService.fetchStateCityDetails();
            String[] tenantArr = ApplicationThreadLocals.getFullTenantID().split("\\.");
            String tenantID;
            if(Boolean.TRUE.equals(Boolean.valueOf(isEnvironmentCentralInstance))) {
                tenantID = tenantArr[0].concat(".").concat(tenantArr[1]);
            } else
                tenantID = tenantArr[0];
            Object mdmsData = edcrMdmsUtil.mDMSCall(new RequestInfo(),
                    new StringBuilder().append(stateCity.getCode()).append(".").append(tenantID).toString());

            if (mdmsData == null) {
                tenantID = stateCity.getCode();
                mdmsData = edcrMdmsUtil.mDMSCall(new RequestInfo(), tenantID);
            }
            if (mdmsData != null) {
                Map<String, List<Object>> edcrMdmsConfig = mdmsValidator.getAttributeValues(mdmsData,
                        DcrConstants.MDMS_EDCR_MODULE);
                MdmsEdcrResponse mdmsEdcrResponse = null;
                try {
                    List<Object> dxfToPdfMdmsEnabled = edcrMdmsConfig.get("DxfToPdfConfig");

                    String jsonStr = new JSONObject((LinkedHashMap<?, ?>) dxfToPdfMdmsEnabled.get(0)).toString();
                    ObjectMapper mapper = new ObjectMapper();
                    mdmsEdcrResponse = mapper.readValue(jsonStr, MdmsEdcrResponse.class);
                } catch (IOException e) {
                    LOG.error("Error occured while reading mdms data", e);
                }
                if (mdmsEdcrResponse != null && mdmsEdcrResponse.getEnabled().equals("true")) {
                    mdmsDxfToPdfEnabled = true;
                    List<Object> dxfToPdfConfig = edcrMdmsConfig.get("DxfToPdfLayerConfig");
                    for (Object obj : dxfToPdfConfig) {
                        try {
                            String jsonString = new JSONObject((LinkedHashMap<?, ?>) obj).toString();
                            ObjectMapper mapper1 = new ObjectMapper();
                            DxfToPdfLayerConfig config = mapper1.readValue(jsonString, DxfToPdfLayerConfig.class);
                            List<EdcrPdfDetail> layerNameList = getPdfLayerNames(planDetail, config);
                            for (EdcrPdfDetail d : layerNameList) {
                                if (LOG.isDebugEnabled())
                                    LOG.debug("\t\t\tSheetName : " + d.getLayer() + " , list of layers :\n" + d.getLayers());
                            }
                            // get a particular layer from the document and enable the layer
                            if (layerNameList != null && !layerNameList.isEmpty()) {

                                if (planDetail.getEdcrPdfDetails() == null)
                                    planDetail.setEdcrPdfDetails(layerNameList);
                                else
                                    planDetail.getEdcrPdfDetails().addAll(layerNameList);
                            }
                        } catch (IOException e) {
                            LOG.error("Error occured while reading mdms data", e);
                        }
                    }
                } else {
                    return planDetail;
                }
            }
        } else {
            List<AppConfigValues> dxfToPdfAppConfigEnabled = appConfigValueService
                    .getConfigValuesByModuleAndKey(DcrConstants.APPLICATION_MODULE_TYPE, DcrConstants.DXF_PDF_CONVERSION_ENABLED);

            if (!dxfToPdfAppConfigEnabled.isEmpty() && dxfToPdfAppConfigEnabled.get(0).getValue().equalsIgnoreCase("NO"))
                return planDetail;
        }

        if (!mdmsDxfToPdfEnabled) {
            List<AppConfigValues> appConfigValues = appConfigValueService
                    .getConfigValuesByModuleAndKey(DcrConstants.APPLICATION_MODULE_TYPE, DcrConstants.EDCR_DXF_PDF);
            for (AppConfigValues appConfigValue : appConfigValues) {
                if (LOG.isDebugEnabled())
                    LOG.debug("App Config value :" + appConfigValue.getValue());
                List<EdcrPdfDetail> layerNameList = getPdfLayerNames(planDetail, appConfigValue.getValue());
                for (EdcrPdfDetail d : layerNameList) {
                    if (LOG.isDebugEnabled())
                        LOG.debug("\t\t\tSheetName : " + d.getLayer() + " , list of layers :\n" + d.getLayers());
                }
                // get a particular layer from the document and enable the layer
                if (layerNameList != null && !layerNameList.isEmpty()) {

                    if (planDetail.getEdcrPdfDetails() == null)
                        planDetail.setEdcrPdfDetails(layerNameList);
                    else
                        planDetail.getEdcrPdfDetails().addAll(layerNameList);
                }
            }
        }

        validate(planDetail);

        String fileName = planDetail.getDxfFileName();
        if (LOG.isDebugEnabled())
            LOG.debug("*************** Converting " + fileName + " to pdf ***************" + "\n");
        // DXFDocument dxfDocument = planDetail.getDxfDocument();

        List<EdcrPdfDetail> edcrPdfDetails = planDetail.getEdcrPdfDetails();
        Boolean printSingleSheet = false;
        EdcrPdfDetail printSingleSheetDetails = null;

        Iterator dxfBlockIterator = planDetail.getDxfDocument().getDXFBlockIterator();
        while (dxfBlockIterator.hasNext()) {
            DXFBlock block = (DXFBlock) dxfBlockIterator.next();
            Iterator dxfEntitiesIterator = block.getDXFEntitiesIterator();
            while (dxfEntitiesIterator.hasNext()) {
                DXFEntity e = (DXFEntity) dxfEntitiesIterator.next();
                e.setLineWeight(-1);

            }
        }
        Iterator dxfStyleIterator = planDetail.getDxfDocument().getDXFStyleIterator();

        while (dxfStyleIterator.hasNext()) {
            DXFStyle style = (DXFStyle) dxfStyleIterator.next();

            LOG.debug(",,DXF style,,,,,    " + style.getName() + "    " + style.getFontFile() + ""
                    + style.getWidthFactor());
            style.setWidthFactor(-1);
            style.setFontFile("romans");
            style.setBigFontFile("romans");
            style.setName("romans");
        }

        Iterator layerIterator = planDetail.getDxfDocument().getDXFLayerIterator();
        while (layerIterator.hasNext()) {
            DXFLayer layer = (DXFLayer) layerIterator.next();
            layer.setFlags(1);
        }

        for (EdcrPdfDetail edcrPdfDetail : edcrPdfDetails) {

            if (edcrPdfDetail.getLayers() == null || edcrPdfDetail.getLayers().isEmpty())
                continue;

            if (edcrPdfDetail.getLayers().contains("All")) {
                printSingleSheet = true;
                printSingleSheetDetails = edcrPdfDetail;
                continue;
            }

            enablePrintableLayers(edcrPdfDetail, planDetail.getDxfDocument());
            sanitize(fileName, planDetail.getDxfDocument(), edcrPdfDetail, planDetail);

            File file = convertDxfToPdf(planDetail.getDxfDocument(), fileName, edcrPdfDetail.getLayer(), edcrPdfDetail);
            disablePrintableLayers(edcrPdfDetail, planDetail.getDxfDocument());

            if (file != null) {
                edcrPdfDetail.setConvertedPdf(file);
            }

        }

        // enable all layers back
        layerIterator = planDetail.getDxfDocument().getDXFLayerIterator();
        while (layerIterator.hasNext()) {
            DXFLayer layer = (DXFLayer) layerIterator.next();
            layer.setFlags(0);
            if (printSingleSheet && !layer.getName().equalsIgnoreCase("0")) {
                printSingleSheetDetails.getMeasurementLayers().add(layer.getName());

            }
        }

        if (printSingleSheet) {

            sanitize(fileName, planDetail.getDxfDocument(), printSingleSheetDetails, planDetail);

            File file = convertDxfToPdf(planDetail.getDxfDocument(), fileName, printSingleSheetDetails.getLayer(),
                    printSingleSheetDetails);

            if (file != null) {
                printSingleSheetDetails.setConvertedPdf(file);
            }

        }

        return planDetail;

    }

    @Override
    public PlanDetail validate(PlanDetail planDetail) {

        List<EdcrPdfDetail> layerNameList = planDetail.getEdcrPdfDetails();
        // get a particular layer from the document and enable the layer
        if (layerNameList != null)
            for (EdcrPdfDetail pdfDetail : layerNameList) {
                if (LOG.isInfoEnabled())
                    LOG.info("Print layer Name" + pdfDetail.getLayer());
                if (LOG.isInfoEnabled())
                    LOG.info("print layers" + pdfDetail.getLayers());
                if (pdfDetail.getLayers() != null)
                    for (String layerName : pdfDetail.getLayers()) {

                        DXFLayer dxfLayer = planDetail.getDxfDocument().getDXFLayer(layerName);
                        if (LOG.isInfoEnabled())
                            LOG.info(layerName + " reason= " + pdfDetail.getFailureReasons() + "  , LayerName"
                                    + pdfDetail.getLayer());
                        checkNegetiveWidth(dxfLayer, pdfDetail);
                    }
            }

        return planDetail;
    }

    private void sanitize2(String fileName, DXFDocument dxfDocument, EdcrPdfDetail edcrPdfDetail, PlanDetail pl) {
        // StringBuffer standardViolations = new StringBuffer();

        boolean addMeasurement = false;
        if (edcrPdfDetail.getLayers() != null)
            Outer: for (String layer : edcrPdfDetail.getLayers()) {

                if (edcrPdfDetail.getMeasurementLayers().contains(layer))
                    addMeasurement = true;

                DXFLayer dxfLayer = dxfDocument.getDXFLayer(layer);
                LOG.debug(edcrPdfDetail.getLayer());

                sanitizeTexts(edcrPdfDetail, dxfDocument, dxfLayer);
                sanitizeMtext(edcrPdfDetail, dxfDocument, dxfLayer);
                sanitizeDimension(edcrPdfDetail, dxfDocument, dxfLayer);

                Iterator dxfEntityTypeIterator = dxfLayer.getDXFEntityTypeIterator();
                inner: while (dxfEntityTypeIterator.hasNext()) {

                    String type;
                    try {
                        type = (String) dxfEntityTypeIterator.next();
                        if (LOG.isDebugEnabled())
                            LOG.debug("Type is " + type);
                    } catch (Exception e1) {

                        e1.printStackTrace();
                        break inner;
                    }

                    List<DXFEntity> entity = dxfLayer.getDXFEntities(type);
                    if (entity != null && !entity.isEmpty()) {
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getLineWeight());
                            e.setLineWeight(-1);
                            switch (type) {
                            case DXFConstants.ENTITY_TYPE_LWPOLYLINE: {
                                if (addMeasurement) {
                                    addPolygonMeasurement(dxfLayer, e, edcrPdfDetail, pl);
                                    // e.setThickness(8);

                                    e.setLineWeight(2);
                                }
                                break;
                            }
                            case DXFConstants.ENTITY_TYPE_POLYLINE: {
                                if (addMeasurement) {
                                    addPolygonMeasurement(dxfLayer, e, edcrPdfDetail, pl);
                                    // e.setThickness(8);
                                    e.setLineWeight(2);
                                }
                                break;
                            }
                            case DXFConstants.ENTITY_TYPE_MTEXT: {
                                DXFMText t = (DXFMText) e;
                                if (LOG.isDebugEnabled())
                                    LOG.debug("Thickness-------Mtext-----------of  " + t.getText() + "  is "
                                            + t.getThickness());
                                t.setText(t.getText().replaceAll("\n", " "));
                                String textStyle = t.getTextStyle();
                                t.setTextStyle("timesnewroman");
                                LOG.debug("Style--------" + textStyle);
                                break;

                            }

                            case DXFConstants.ENTITY_TYPE_TEXT: {
                                DXFText t = (DXFText) e;
                                if (LOG.isDebugEnabled())
                                    LOG.debug("Thickness-------Mtext-----------of  " + t.getText() + "  is "
                                            + t.getThickness());
                                t.setText(t.getText().replaceAll("\n", " "));
                                String textStyle = t.getTextStyle();
                                t.setTextStyle("timesnewroman");
                                LOG.debug("Style--------" + textStyle);
                                break;

                            }

                            case DXFConstants.ENTITY_TYPE_HATCH: {
                                // e.setLineWeight(0);
                                // e.setVisibile(visibile);
                                break;
                            }
                            }

                        }
                    }

                }

                DXFVariable psltScale = dxfDocument.getDXFHeader().getVariable("$PSLTSCALE");

                if (psltScale != null) {
                    String psltScaleValue = psltScale.getValue("70");

                    if (!isBlank(psltScaleValue)) {
                        dxfDocument.getDXFHeader().getVariable("$PSLTSCALE").setValue("70", String.valueOf(.1));
                    }

                }
            }

    }

    private void sanitize(String fileName, DXFDocument dxfDocument, EdcrPdfDetail edcrPdfDetail, PlanDetail pl) {
        // StringBuffer standardViolations = new StringBuffer();

        boolean addMeasurement = false;
        if (edcrPdfDetail.getLayers() != null)
            Outer: for (String layer : edcrPdfDetail.getLayers()) {

                if (edcrPdfDetail.getMeasurementLayers().contains(layer)
                        || edcrPdfDetail.getDimensionLayers().contains(layer))
                    addMeasurement = true;

                DXFLayer dxfLayer = dxfDocument.getDXFLayer(layer);
                LOG.debug(edcrPdfDetail.getLayer());

                sanitizeTexts(edcrPdfDetail, dxfDocument, dxfLayer);
                sanitizeMtext(edcrPdfDetail, dxfDocument, dxfLayer);
                sanitizeDimension(edcrPdfDetail, dxfDocument, dxfLayer);

                List<DXFEntity> entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LWPOLYLINE);
                if (entity != null && !entity.isEmpty()) {
                    for (DXFEntity e : entity) {
                        if (LOG.isDebugEnabled())
                            LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                        e.setLineWeight(-1);
                        if (addMeasurement) {
                            addPolygonMeasurement(dxfLayer, e, edcrPdfDetail, pl);
                            if (edcrPdfDetail.getColorOverrides().containsKey(dxfLayer.getName()))
                                e.setLineWeight(edcrPdfDetail.getColorOverrides().get(dxfLayer.getName()));
                        }

                    }
                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_POLYLINE);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            if (addMeasurement) {
                                addPolygonMeasurement(dxfLayer, e, edcrPdfDetail, pl);
                                if (edcrPdfDetail.getColorOverrides().containsKey(dxfLayer.getName()))
                                    e.setLineWeight(edcrPdfDetail.getColorOverrides().get(dxfLayer.getName()));
                            }

                        }

                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {

                            DXFMText t = (DXFMText) e;
                            if (LOG.isDebugEnabled())
                                LOG.debug("Thickness-------Mtext-----------of  " + t.getText() + "  is "
                                        + t.getThickness());
                            t.setText(t.getText().replaceAll("\n", " "));
                            String textStyle = t.getTextStyle();
                            t.setTextStyle("timesnewroman");
                            LOG.debug("Style--------" + textStyle);

                        }
                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_TEXT);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {

                            DXFText t = (DXFText) e;
                            if (LOG.isDebugEnabled())
                                LOG.debug("Thickness-------Mtext-----------of  " + t.getText() + "  is "
                                        + t.getThickness());
                            t.setText(t.getText().replaceAll("\n", " "));
                            String textStyle = t.getTextStyle();
                            t.setTextStyle("timesnewroman");
                            LOG.debug("Style--------" + textStyle);

                        }
                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_HATCH);
                    int i = 0;
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            DXFHatch hatch = (DXFHatch) e;
                            if (LOG.isDebugEnabled())
                                LOG.debug("Hatch Style" + hatch.getHatchStyle() + " " + ++i);
                            if (LOG.isDebugEnabled())
                                LOG.debug("Hatch getDefinationLinesCount " + hatch.getDefinationLinesCount()
                                        + "in layer " + hatch.getLayerName() + " getLineType  " + hatch.getLineType()
                                        + " getLinetypeScaleFactor " + hatch.getLinetypeScaleFactor());

                        }
                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            e.setLineWeight(-1);
                            // e.setVisibile(visibile);

                        }

                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_INSERT);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            e.setLineWeight(-1);
                            // e.setVisibile(visibile);

                        }

                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LINE);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            e.setLineWeight(-1);
                            // e.setVisibile(visibile);

                        }

                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_ARC);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            e.setLineWeight(-1);
                            // e.setVisibile(visibile);

                        }
                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_CIRCLE);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            e.setLineWeight(-1);
                            // e.setVisibile(visibile);

                        }

                    entity = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_LEADER);
                    if (entity != null && !entity.isEmpty())
                        for (DXFEntity e : entity) {
                            if (LOG.isDebugEnabled())
                                LOG.debug(e.getType() + " Line Weight" + e.getLineWeight());
                            e.setLineWeight(-1);
                            // e.setVisibile(visibile);

                        }

                }

            }

        DXFVariable psltScale = dxfDocument.getDXFHeader().getVariable("$PSLTSCALE");

        if (psltScale != null) {
            String psltScaleValue = psltScale.getValue("70");

            if (!isBlank(psltScaleValue)) {
                dxfDocument.getDXFHeader().getVariable("$PSLTSCALE").setValue("70", String.valueOf(.1));
            }

        }
    }

    private void enablePrintableLayers(EdcrPdfDetail edcrPdfDetail, DXFDocument dxfDocument) {

        if (edcrPdfDetail.getLayers() != null)
            for (String layer : edcrPdfDetail.getLayers()) {
                // Enable layer for Print
                DXFLayer dxfLayer = dxfDocument.getDXFLayer(layer);
                if (LOG.isDebugEnabled())
                    LOG.debug(layer + " Enabled");
                dxfLayer.setFlags(0);
            }

    }

    private void disablePrintableLayers(EdcrPdfDetail edcrPdfDetail, DXFDocument dxfDocument) {
        if (edcrPdfDetail.getLayers() != null)
            for (String layer : edcrPdfDetail.getLayers()) {
                // Enable layer for Print
                DXFLayer dxfLayer = dxfDocument.getDXFLayer(layer);
                if (LOG.isDebugEnabled())
                    LOG.debug(layer + " Disabled");
                dxfLayer.setFlags(1);
            }

    }

    private void addPolygonMeasurement(DXFLayer dxfLayer, DXFEntity e, EdcrPdfDetail detail, PlanDetail pl) {
        DXFPolyline pline = (DXFPolyline) e;
        Iterator vertexIterator = pline.getVertexIterator();
        DXFVertex point1 = null;
        DXFVertex first = null;
        DXFVertex point2 = null;
        String content = "";
        double x = 0, y = 0;
        double centroidX = 0, centroidY = 0;
        StringBuilder plineDimensionText = new StringBuilder(50);

        while (vertexIterator.hasNext()) {
            if (point1 == null) {
                point1 = (DXFVertex) vertexIterator.next();
                first = point1;
                x += point1.getX();
                y += point1.getY();
            }
            point2 = (DXFVertex) vertexIterator.next();
            x += point2.getX();
            y += point2.getY();
            Point p = Util.getMidPoint(point1, point2);
            point1.getPoint();
            LOG.debug("point1 x " + point1.getX() + "   y " + point1.getY());
            LOG.debug("point2 x " + point2.getX() + "   y " + point2.getY());

            BigDecimal length = BigDecimal.valueOf(MathUtils.distance(point1.getPoint(), point2.getPoint()))
                    .setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);

            if (length.intValue() == 0)
                continue;

            if (detail.getMeasurementLayers().contains(dxfLayer.getName())) {
                DXFMText text1 = new DXFMText();
                /*
                 * if (detail.getPrintNameLayers().contains(dxfLayer.getName())) content = "" + dxfLayer.getName() + " " + length;
                 * else
                 */
                content = "" + length;
                LOG.debug("length...." + length);
                text1.setHeight(0.25d);
                text1.setText("" + content);
                text1.setAlign(1);

                text1.setX(p.getX());
                if (detail.getColorOverrides().get(dxfLayer.getName().toString()) != null)
                    text1.setColor(detail.getColorOverrides().get(dxfLayer.getName()));
                text1.setThickness(2);
                text1.setY(p.getY());

                dxfLayer.addDXFEntity(text1);
            } else if (detail.getDimensionLayers().contains(dxfLayer.getName())) {

                plineDimensionText.append(length);

                if (vertexIterator.hasNext())
                    plineDimensionText.append(" X ");

            }

            point1 = point2;

        }
        String content1;
        if (pline.isClosed()) {
            BigDecimal length = BigDecimal.valueOf(MathUtils.distance(first.getPoint(), point2.getPoint()))
                    .setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);
            Point p = Util.getMidPoint(first, point2);
            // plineDimensionText.append(length);

            // x+=point2.getX();
            // y+=point2.getY();

            if (detail.getMeasurementLayers().contains(dxfLayer.getName())) {
                DXFMText text1 = new DXFMText();
                /*
                 * if (detail.getPrintNameLayers().contains(dxfLayer.getName())) content1 = "" + dxfLayer.getName() + " " +
                 * length; else
                 */
                content1 = "" + length;
                LOG.debug("length...." + length);
                text1.setHeight(0.25d);
                text1.setText("" + content1);
                text1.setAlign(1);

                text1.setX(p.getX());
                if (detail.getColorOverrides().get(dxfLayer.getName().toString()) != null)
                    text1.setColor(detail.getColorOverrides().get(dxfLayer.getName()));

                text1.setThickness(2);
                text1.setY(p.getY());

                dxfLayer.addDXFEntity(text1);
            } else if (detail.getDimensionLayers().contains(dxfLayer.getName())) {
                plineDimensionText.append(" X ");

                plineDimensionText.append(length);

            }
        }
        centroidX = x / pline.getVertexCount();
        centroidY = y / pline.getVertexCount();
        DXFMText plineDimension = new DXFMText();
        plineDimension.setHeight(0.25d);
        if (detail.getMeasurementLayers().contains(dxfLayer.getName())) {
            BigDecimal area = Util.getPolyLineArea(pline).setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS,
                    DcrConstants.ROUNDMODE_MEASUREMENTS);
            plineDimension.setText(Util.getPolylinePrintableText(pline, dxfLayer, detail, pl) + " " + area + "m2");
        } else if (detail.getDimensionLayers().contains(dxfLayer.getName())) {

            plineDimension.setText(Util.getPolylinePrintableText(pline, dxfLayer, detail, pl) + "\n"
                    + Util.getTexForDimension(plineDimensionText.toString()));
        }

        if (detail.getColorOverrides().get(dxfLayer.getName().toString()) != null) {
            e.setColor(detail.getColorOverrides().get(dxfLayer.getName()));
        }

        if (detail.getColorOverrides().get(dxfLayer.getName().toString()) != null) {
            plineDimension.setColor(detail.getColorOverrides().get(dxfLayer.getName()));
        }
        plineDimension.setAlign(1);
        plineDimension.setHeight(0.25d);
        plineDimension.setX(centroidX);
        plineDimension.setY(centroidY);
        plineDimension.setThickness(2);
        dxfLayer.addDXFEntity(plineDimension);
        if (LOG.isDebugEnabled())
            LOG.debug("Added text " + plineDimension.getText() + "at x=" + centroidX + " y=" + centroidY);

        if (LOG.isDebugEnabled())
            LOG.debug("Printing layer Name");
        if (detail.getPrintNameLayers().contains(dxfLayer.getName())) {
            DXFMText plineLayer = new DXFMText();
            plineLayer.setHeight(0.25d);
            plineLayer.setText(dxfLayer.getName());
            plineLayer.setAlign(1);
            plineLayer.setHeight(0.25d);
            plineLayer.setX(centroidX);
            plineLayer.setY(centroidY - 0.5d);
            plineLayer.setThickness(2);
            if (detail.getColorOverrides().get(dxfLayer.getName().toString()) != null) {
                plineLayer.setColor(detail.getColorOverrides().get(dxfLayer.getName()));
            }
            dxfLayer.addDXFEntity(plineLayer);
        }
    }

    private void printNext(DXFLayer dxfLayer, EdcrPdfDetail detail, DXFPolyline pline, DXFVertex first,
            DXFVertex point2) {
        String content;
        if (pline.isClosed()) {
            BigDecimal length = BigDecimal.valueOf(MathUtils.distance(first.getPoint(), point2.getPoint()))
                    .setScale(DcrConstants.DECIMALDIGITS_MEASUREMENTS, DcrConstants.ROUNDMODE_MEASUREMENTS);
            Point p = Util.getMidPoint(first, point2);
            // plineDimensionText.append(length);

            // x+=point2.getX();
            // y+=point2.getY();

            if (detail.getMeasurementLayers().contains(dxfLayer.getName())) {
                DXFMText text1 = new DXFMText();

                if (detail.getPrintNameLayers().contains(dxfLayer.getName()))
                    content = "" + dxfLayer.getName() + " " + length;
                else
                    content = "" + length;
                LOG.debug("length...." + length);
                text1.setHeight(0.25d);
                text1.setText("" + content);
                text1.setAlign(1);

                text1.setX(p.getX());
                if (detail.getColorOverrides().get(dxfLayer.getName().toString()) != null)
                    text1.setColor(detail.getColorOverrides().get(dxfLayer.getName()));

                text1.setThickness(2);
                text1.setY(p.getY());

                dxfLayer.addDXFEntity(text1);
            }
        }
    }

    private File convertDxfToPdf(DXFDocument dxfDocument, String fileName, String layerName,
            EdcrPdfDetail edcrPdfDetail) {

        File fileOut = new File(layerName + ".pdf");

        if (fileOut != null) {
            try {

                if (LOG.isDebugEnabled())
                    LOG.debug("---------converting " + fileName + " - " + layerName + " to pdf----------");
                FileOutputStream fout = new FileOutputStream(fileOut);

                DcrSvgGenerator generator = new DcrSvgGenerator();
                SAXSerializer out = new SAXPDFSerializer();
                out.setOutput(fout);
                HashMap map = new HashMap();

                Rectangle rectangle = PageSize.getRectangle(edcrPdfDetail.getPageSize().getSize());
                // factor of 3.78 for setting page size
                // A0 landscape = 841mm X 1189mm (w * h)

                if (edcrPdfDetail.getPageSize().getOrientation().ordinal() == Orientation.PORTRAIT.ordinal()) {

                    map.put("width", String.valueOf(rectangle.getWidth() * edcrPdfDetail.getPageSize().getEnlarge()));
                    map.put("height", String.valueOf(rectangle.getHeight() * edcrPdfDetail.getPageSize().getEnlarge()));
                } else {
                    map.put("width", String.valueOf(rectangle.getHeight() * edcrPdfDetail.getPageSize().getEnlarge()));
                    map.put("height", String.valueOf(rectangle.getWidth() * edcrPdfDetail.getPageSize().getEnlarge()));
                }
                map.put("margin", String.valueOf(0.5));
                if (edcrPdfDetail.getPageSize().getRemoveHatch()) {
                    map.put("stroke.width", new Double(0));
                }

                generator.generate(dxfDocument, out, map);
                if (LOG.isDebugEnabled())
                    LOG.debug("---------conversion success " + fileName + " - " + layerName + "----------");
                fout.flush();
                fout.close();
                return fileOut.length() > 0 ? fileOut : null;
            } catch (Exception ep) {
                LOG.error("Pdf convertion failed for " + fileName + " - " + layerName + " due to " + ep.getMessage());
                edcrPdfDetail.setFailureReasons(ep.getMessage());
            }
        }

        return null;
    }

    private List<String> checkNegetiveWidth(DXFLayer dxfLayer, EdcrPdfDetail pdfDetail) {

        StringBuilder errorBuffer = new StringBuilder();

        List<String> blks = new ArrayList<>();
        ArrayList<String> errors = new ArrayList<>();
        boolean negetiveWidhPresent = false;
        List insertEntites = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_INSERT);

        if (insertEntites != null && insertEntites.size() > 0) {
            for (Object o : insertEntites) {
                DXFInsert insert = (DXFInsert) o;

                if (insert.getScaleX() < 0 || insert.getScaleY() < 0) {
                    if (LOG.isDebugEnabled())
                        LOG.debug("Negetive width in " + insert.getBlockID());
                    if (LOG.isDebugEnabled())
                        LOG.debug("nsert.getScaleX()" + insert.getScaleX());
                    if (LOG.isDebugEnabled())
                        LOG.debug("nsert.getScaleY()" + insert.getScaleY());
                    insert.setScaleX(1);
                    insert.setScaleY(1);
                    blks.add(insert.getBlockID());
                    negetiveWidhPresent = true;
                    insert.setLineWeight(-1);

                }
            }
        }

        if (negetiveWidhPresent) {
            errorBuffer.append("Negetive with Present in Block(s)");
            for (String blk : blks) {
                errorBuffer = errorBuffer.append(blk).append(", ");
            }

        }

        String insertError = errorBuffer.toString();
        if (insertError != null && !StringUtils.isBlank(insertError)) {
            errors.add("" + insertError.substring(0, insertError.length() - 1) + ".");
        }

        if (!errors.isEmpty()) {
            for (String error : errors) {
                if (pdfDetail.getFailureReasons() == null)
                    pdfDetail.setFailureReasons(error);
                else {
                    error = error + pdfDetail.getFailureReasons();
                    pdfDetail.setFailureReasons(error);
                }

            }
        }

        return errors;

    }

    private boolean isDuplicatePresent(List<String> layerList) {
        Set<String> duplicateLayerList = layerList.stream().filter(i -> Collections.frequency(layerList, i) > 1)
                .collect(Collectors.toSet());
        return duplicateLayerList.isEmpty() ? false : true;
    }

    private void sanitizeTexts(EdcrPdfDetail pdfDetail, DXFDocument doc, DXFLayer dxfLayer) {

        List texts = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_TEXT);
        StringBuilder message = new StringBuilder();
        if (texts != null && texts.size() > 0) {
            long issueCount = 0;
            StringBuilder errorMText = new StringBuilder();
            Iterator iterator = texts.iterator();
            while (iterator.hasNext()) {
                DXFText text = (DXFText) iterator.next();
                boolean underLinePresent = text.getText().contains(UNDERLINE_CAPITAL)
                        || text.getText().contains(UNDERLINE_SMALL);
                if (underLinePresent) {
                    text.setText(text.getText().replace(UNDERLINE_CAPITAL, ""));
                    Iterator styledParagraphIterator = text.getTextDocument().getStyledParagraphIterator();
                    while (styledParagraphIterator.hasNext()) {
                        StyledTextParagraph styledTextParagraph = (StyledTextParagraph) styledParagraphIterator.next();
                        styledTextParagraph.setUnderline(true);
                        styledTextParagraph.setValign(TEXT_VALLIGNMENT_TOP);
                    }
                }

                boolean powerPresent = text.getText().contains(POWER);

                if (powerPresent) {
                    text.setText(text.getText().replace(POWER, ""));
                }

                if (text.getText().contains("{") || text.getText().contains("}")) {
                    issueCount++;
                    if (errorMText.toString().split(",").length < 5) {
                        if (StringUtils.isNotBlank(text.getText()))
                            errorMText.append(text.getText()).append(",");
                    }
                }

            }

            if (issueCount > 0) {
                message.append("Text defined as ").append(errorMText.toString(), 0, errorMText.toString().length() - 1)
                        .append(issueCount > 5 ? " and " + (issueCount - 5) + " others " : "")
                        .append(" are not as per standards.|");
                pdfDetail.setStandardViolations(message.toString());
            }

        }
    }

    private void sanitizeMtext(EdcrPdfDetail pdfDetail, DXFDocument doc, DXFLayer dxfLayer) {

        List mtexts = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_MTEXT);
        StringBuilder message = new StringBuilder();
        if (mtexts != null && mtexts.size() > 0) {
            String text = "";

            long issueCount = 0;
            for (Object o : mtexts) {
                DXFMText mText = (DXFMText) o;
                boolean underLinePresent = mText.getText().contains("\\L") || mText.getText().contains("\\l");

                LOG.debug(mText.getText() + " Under line Present" + underLinePresent);
                mText.setText(mText.getText().replace(UNDERLINE_CAPITAL, ""));
                mText.setText(mText.getText().replace(UNDERLINE_SMALL, ""));
                Iterator styledParagraphIterator = mText.getTextDocument().getStyledParagraphIterator();

                while (styledParagraphIterator.hasNext()) {
                    StyledTextParagraph styledTextParagraph = (StyledTextParagraph) styledParagraphIterator.next();

                    if (underLinePresent) {
                        styledTextParagraph.setUnderline(true);
                        if (LOG.isDebugEnabled())
                            LOG.debug("Styled Paragraph.get text " + styledTextParagraph.getText());
                        styledTextParagraph.setValign(TEXT_VALLIGNMENT_TOP);
                    }

                    if (styledTextParagraph.getInsertPoint().getX() == 0) {
                        styledTextParagraph.getInsertPoint().setX(mText.getInsertPoint().getX());
                    }

                    if (styledTextParagraph.getInsertPoint().getY() == 0) {
                        styledTextParagraph.getInsertPoint().setY(mText.getInsertPoint().getY());
                    }
                }

                boolean powerPresent = mText.getText().contains(POWER);

                if (powerPresent) {
                    mText.setText(mText.getText().replace(POWER, ""));
                }

                if (mText.getText().contains("{") || mText.getText().contains("}")) {
                    issueCount++;
                    if (issueCount == 1)
                        text = mText.getText();
                }
            }

            if (issueCount > 0) {
                message.append("Mtext defined as ").append(text)
                        .append(issueCount > 5 ? " and " + (issueCount - 5) + " others " : "")
                        .append(" are not as per standards.|");
                pdfDetail.setStandardViolations(message.toString());
            }
        }

    }

    private void sanitizeDimension(EdcrPdfDetail pdfDetail, DXFDocument doc, DXFLayer dxfLayer) {

        List dimensions = dxfLayer.getDXFEntities(DXFConstants.ENTITY_TYPE_DIMENSION);
        StringBuilder message = new StringBuilder();
        if (dimensions != null && dimensions.size() > 0) {
            long issueCount = 0;
            Iterator iterator = dimensions.iterator();
            StringBuffer mText = new StringBuffer();

            while (iterator.hasNext()) {
                DXFDimension dimension = (DXFDimension) iterator.next();
                /*
                 * if (sampleDim == null) { sampleDim = dimension; }
                 */
                dimension.setVisibile(false);
                String dimensionBlock = dimension.getDimensionBlock();
                DXFBlock dxfBlock = doc.getDXFBlock(dimensionBlock);
                if (dxfBlock != null) {
                    Iterator entitiesIterator = dxfBlock.getDXFEntitiesIterator();
                    boolean issuePresent = false;

                    while (entitiesIterator.hasNext()) {
                        DXFEntity e = (DXFEntity) entitiesIterator.next();

                        if (e.getType().equalsIgnoreCase(DXFConstants.ENTITY_TYPE_LINE)) {
                            DXFLine dxfLine = (DXFLine) e;
                            if (dxfLine.getLineWeight() > 1) {
                                dxfLine.setLineWeight(-1);
                                issuePresent = true;
                            }
                        }

                        if (e.getType().equalsIgnoreCase(DXFConstants.ENTITY_TYPE_SOLID)) {
                            DXFSolid dxfSolid = (DXFSolid) e;
                            if (dxfSolid.getLineWeight() > 1) {
                                dxfSolid.setLineWeight(-1);
                                if (issuePresent = false)
                                    issuePresent = true;
                            }
                        }

                        if (e.getType().equals(DXFConstants.ENTITY_TYPE_MTEXT)) {
                            DXFMText dxfmText = (DXFMText) e;
                            dxfmText.setHeight(0.2d);
                            if (issuePresent) {
                                issueCount++;
                                if (mText.toString().split(",").length < 5) {
                                    mText.append(dxfmText.getText()).append(",");
                                }
                            }
                        }
                    }
                }
            }

            if (mText != null && mText.length() > 0) {
                message.append("Line weight defined for " + (issueCount > 5 ? " dimensions " : " dimension "))
                        .append(mText.toString(), 0, mText.toString().length() - 1)
                        .append(issueCount > 5 ? " and " + (issueCount - 5) + " others " : "")
                        .append(" are not as per standards.");
                pdfDetail.setStandardViolations(message.toString());

            }

        }
    }

    private List<EdcrPdfDetail> getPdfLayerNames(PlanDetail planDetail, String appConfigValue) {

        boolean evaluate = false;
        List<EdcrPdfDetail> pdfLayers = new ArrayList<>();
        EdcrPdfDetail pdfdetail = new EdcrPdfDetail();
        List<String> layers = new ArrayList<>();
        String sheetName = "";
        String layerNamesRegEx = "";
        String sheetNameFinal = "";
        String pageSize = "";
        int enlarger = 1;
        String orientation = "Portrait";
        PdfPageSize page = new PdfPageSize();
        // Name_of_the_sheet,PageSize,multiplication_factor_of_Page_Size,#Layer_regex:Measurement(M)/Dimension(D)LayerNametoInclude(L)ColorCode(C1),Repeat

        // BLK_*_FLR_*_FLOOR_PLAN,A0,1#BLK_*_FLR_*_FLOOR_PLAN,BLK_*_FLR_*_BLT_UP_AREA:ML,BLK_*_FLR_*_BLT_UP_AREA_DEDUCT:DL
        // SITE_PLAN,A0,1#SITE_PLAN
        // PARKING_PLAN_NO_*,A1,1#PARKING_PLAN_NO_*,PARKING_SLOT:M
        // BLK_*_FLR_*_UNIT_FA,A0,1#BLK_*_FLR_*_BLT_UP_AREA:ML,BLK_*_FLR_*_BLT_UP_AREA_DEDUCT:DL,BLK_*_FLR_*_UNITFA:M
        // COMPLETE_PLAN,A0,4#*

        // if (appConfigValue.contains("_*")) {
        String[] regEx = appConfigValue.split("#");
        if (regEx.length != 2) {
            LOG.error("RegEx for PDF print in " + appConfigValue + "  is not as per Standard");
            return pdfLayers;
        } else {
            try {
                sheetName = regEx[0];
                layerNamesRegEx = regEx[1];
                String[] split = sheetName.split(",");
                if (split.length < 4) {
                    LOG.error(
                            "Page size,name etc not defined properly format is 'name,pagesize,nooftimes,LANDSCAPE/PORTRAIT,removehatch");
                    return pdfLayers;
                }
                sheetName = split[0];

                // set page size
                page.setSize(split[1]);
                // set
                if (!split[2].equals("1"))
                    enlarger = Integer.valueOf(split[2]);
                page.setEnlarge(enlarger);

                if (!split[3].equalsIgnoreCase(orientation))
                    page.setOrientation(Orientation.LANDSCAPE);
                else
                    page.setOrientation(Orientation.PORTRAIT);
                if (split.length >= 5)
                    page.setRemoveHatch(Boolean.valueOf(split[4]));
                else
                    page.setRemoveHatch(false);

            } catch (NumberFormatException e) {
                LOG.error("RegEx for PDF print in " + appConfigValue + "  is not as per Standard");
            }

        }
        layers = new ArrayList<>();
        if (layerNamesRegEx.equals("*")) {

            pdfdetail = new EdcrPdfDetail();
            pdfdetail.setPageSize(page);

            sheetNameFinal = sheetName;
            pdfdetail.setLayer(sheetNameFinal);
            // List<String> layer= new ArrayList<>();
            layers.add("All");
            pdfdetail.setLayers(layers);
            // pdfLayers.add(pdfdetail);
            // pdfdetail.getPrintNameLayers().add("All");
        } else if (appConfigValue.contains("BLK_*")) {
            String[] split = layerNamesRegEx.split(","); // split by comma
            for (Block b : planDetail.getBlocks()) {
                for (Floor f : b.getBuilding().getFloors()) {
                    sheetNameFinal = sheetName.replace("BLK_*", "BLK_" + b.getNumber());
                    sheetNameFinal = sheetNameFinal.replace("FLR_*", "FLR_" + f.getNumber());
                    sheetNameFinal = sheetNameFinal.replace("LVL_*", "LVL_" + f.getNumber());
                    sheetNameFinal = sheetNameFinal.replace("_*", "_" + b.getNumber());
                    // sheetNameFinal =
                    // sheetNameFinal.substring(0,sheetNameFinal.indexOf(":"));
                    pdfdetail = new EdcrPdfDetail();
                    pdfdetail.setPageSize(page);
                    pdfdetail.setLayer(sheetNameFinal);
                    evaluate = true;
                    for (String s : split) {
                        s = s.replace("BLK_*", "BLK_" + b.getNumber());
                        s = s.replace("FLR_*", "FLR_" + f.getNumber());
                        s = s.replace("LVL_*", "LVL_" + f.getNumber());
                        s = s.replace("_*", "_" + b.getNumber());
                        getLayerColorConfigs(planDetail, pdfdetail, s);
                        s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());

                        List<String> layer = Util.getLayerNamesLike(planDetail.getDxfDocument(), s);

                        if (layer != null && !layer.isEmpty()) {
                            if (pdfdetail.getLayers() == null || pdfdetail.getLayers().isEmpty()) {
                                pdfdetail.setLayers(layer);
                            } else {
                                pdfdetail.getLayers().addAll(layer);
                            }

                        }
                    }
                    pdfLayers.add(pdfdetail);

                }
            }
        } else if (appConfigValue.contains("NO_*")) {

            // fix this case after getting usecase
            pdfdetail = new EdcrPdfDetail();
            pdfdetail.setPageSize(page);
            pdfdetail.setLayer(sheetNameFinal);
            int i = 1;
            String[] split = layerNamesRegEx.split(",");
            for (String s : split) {

                getLayerColorConfigs(planDetail, pdfdetail, s);
                s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());
                s = s.replace("NO_*", "NO_" + i);

                List<String> layer = Util.getLayerNamesLike(planDetail.getDxfDocument(), s);
                if (layer != null && !layer.isEmpty()) {
                    if (pdfdetail.getLayers() == null || pdfdetail.getLayers().isEmpty()) {
                        pdfdetail.setLayers(layer);
                    } else {
                        pdfdetail.getLayers().addAll(layer);
                    }

                }
            }

        } else {
            if (layerNamesRegEx.contains("_*")) {
                for (Block b : planDetail.getBlocks()) {
                    pdfdetail = new EdcrPdfDetail();
                    pdfdetail.setPageSize(page);
                    pdfdetail.setLayer(sheetNameFinal);
                    String[] split = layerNamesRegEx.split(",");
                    for (String s : split) {
                        s = s.replace("_*", "_" + b.getNumber());
                        getLayerColorConfigs(planDetail, pdfdetail, s);
                        s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());
                        layers.addAll(Util.getLayerNamesLike(planDetail.getDxfDocument(), s));
                    }
                }
            } else {
                pdfdetail = new EdcrPdfDetail();
                pdfdetail.setPageSize(page);
                pdfdetail.setLayer(sheetNameFinal);
                String[] split = layerNamesRegEx.split(",");
                for (String s : split) {

                    getLayerColorConfigs(planDetail, pdfdetail, s);
                    s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());
                    layers.addAll(Util.getLayerNamesLike(planDetail.getDxfDocument(), s));
                }
            }

        }

        if (!layers.isEmpty()) {
            pdfdetail.setLayer(layers.get(0));
            pdfdetail.setLayers(layers);
            pdfLayers.add(pdfdetail);
        }

        return pdfLayers;

    }

    private List<EdcrPdfDetail> getPdfLayerNames(PlanDetail planDetail, DxfToPdfLayerConfig config) {
        List<EdcrPdfDetail> pdfLayers = new ArrayList<>();
        boolean evaluate = false;
        EdcrPdfDetail pdfdetail = new EdcrPdfDetail();
        List<String> layers = new ArrayList<>();
        String sheetName = config.getSheetName();
        String layerNamesRegEx = "";
        String sheetNameFinal = "";
        PdfPageSize page = new PdfPageSize();
        // Name_of_the_sheet,PageSize,multiplication_factor_of_Page_Size,#Layer_regex:Measurement(M)/Dimension(D)LayerNametoInclude(L)ColorCode(C1),Repeat

        // BLK_*_FLR_*_FLOOR_PLAN,A0,1#BLK_*_FLR_*_FLOOR_PLAN,BLK_*_FLR_*_BLT_UP_AREA:ML,BLK_*_FLR_*_BLT_UP_AREA_DEDUCT:DL
        // SITE_PLAN,A0,1#SITE_PLAN
        // PARKING_PLAN_NO_*,A1,1#PARKING_PLAN_NO_*,PARKING_SLOT:M
        // BLK_*_FLR_*_UNIT_FA,A0,1#BLK_*_FLR_*_BLT_UP_AREA:ML,BLK_*_FLR_*_BLT_UP_AREA_DEDUCT:DL,BLK_*_FLR_*_UNITFA:M
        // COMPLETE_PLAN,A0,4#*

        // set page size
        page.setSize(config.getSheetSize());
        page.setEnlarge(config.getSheetSizeEnlargeFactor());

        page.setOrientation(config.getOrientation());
        page.setRemoveHatch(config.isRemoveHatch());
        pdfdetail.setPageSize(page);

        layers = new ArrayList<>();
        String layerRegEx = constructIntoSingleLineConfig(config);
        if (layerRegEx.contains("COMPLETE_PLAN")) {
            pdfdetail = new EdcrPdfDetail();
            pdfdetail.setPageSize(page);

            sheetNameFinal = sheetName;
            pdfdetail.setLayer(sheetNameFinal);
            layers.add("All");
            pdfdetail.setLayers(layers);
        } else if (layerRegEx.contains("BLK_*")) {
            String[] split = layerRegEx.split(","); // split by comma
            layerNamesRegEx = split[0];
            for (Block b : planDetail.getBlocks()) {

                for (Floor f : b.getBuilding().getFloors()) {
                    sheetNameFinal = sheetName.replace("BLK_*", "BLK_" + b.getNumber());
                    sheetNameFinal = sheetNameFinal.replace("FLR_*", "FLR_" + f.getNumber());
                    sheetNameFinal = sheetNameFinal.replace("LVL_*", "LVL_" + f.getNumber());
                    sheetNameFinal = sheetNameFinal.replace("_*", "_" + b.getNumber());
                    // sheetNameFinal =
                    // sheetNameFinal.substring(0,sheetNameFinal.indexOf(":"));
                    pdfdetail = new EdcrPdfDetail();
                    pdfdetail.setPageSize(page);
                    pdfdetail.setLayer(sheetNameFinal);
                    evaluate = true;
                    for (String s : split) {
                        s = s.replace("BLK_*", "BLK_" + b.getNumber());
                        s = s.replace("FLR_*", "FLR_" + f.getNumber());
                        s = s.replace("LVL_*", "LVL_" + f.getNumber());
                        s = s.replace("_*", "_" + b.getNumber());
                        getLayerColorConfigs(planDetail, pdfdetail, s);
                        s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());

                        List<String> layer = Util.getLayerNamesLike(planDetail.getDxfDocument(), s);

                        if (layer != null && !layer.isEmpty()) {
                            if (pdfdetail.getLayers() == null || pdfdetail.getLayers().isEmpty()) {
                                pdfdetail.setLayers(layer);
                            } else {
                                pdfdetail.getLayers().addAll(layer);
                            }
                        }
                    }
                    pdfLayers.add(pdfdetail);

                }
            }

        } else if (layerRegEx.contains("NO_*")) {

            pdfdetail = new EdcrPdfDetail();
            pdfdetail.setPageSize(page);
            int i = 1;
            String[] split = layerRegEx.split(",");
            for (String s : split) {

                getLayerColorConfigs(planDetail, pdfdetail, s);
                s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());
                s = s.replace("NO_*", "NO_" + i);
                pdfdetail.setLayer(s);
                List<String> layer = Util.getLayerNamesLike(planDetail.getDxfDocument(), s);
                if (layer != null && !layer.isEmpty()) {
                    if (pdfdetail.getLayers() == null || pdfdetail.getLayers().isEmpty()) {
                        pdfdetail.setLayers(layer);
                    } else {
                        pdfdetail.getLayers().addAll(layer);
                    }

                }
            }
            pdfLayers.add(pdfdetail);

        } else {
            if (layerRegEx.contains("_*")) {
                for (Block b : planDetail.getBlocks()) {
                    pdfdetail = new EdcrPdfDetail();
                    pdfdetail.setPageSize(page);
                    pdfdetail.setLayer(sheetNameFinal);
                    String[] split = layerRegEx.split(",");
                    for (String s : split) {
                        s = s.replace("_*", "_" + b.getNumber());
                        getLayerColorConfigs(planDetail, pdfdetail, s);
                        s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());
                        layers.addAll(Util.getLayerNamesLike(planDetail.getDxfDocument(), s));
                    }
                }
            } else {
                pdfdetail = new EdcrPdfDetail();
                pdfdetail.setPageSize(page);
                pdfdetail.setLayer(sheetNameFinal);
                String[] split = layerRegEx.split(",");
                for (String s : split) {
                    getLayerColorConfigs(planDetail, pdfdetail, s);
                    s = s.substring(0, s.indexOf(":") != -1 ? s.indexOf(":") : s.length());
                    layers.addAll(Util.getLayerNamesLike(planDetail.getDxfDocument(), s));
                }
            }
        }
        if (!layers.isEmpty()) {
            pdfdetail.setLayer(layers.get(0));
            pdfdetail.setLayers(layers);
            pdfLayers.add(pdfdetail);
        }
        // }

        return pdfLayers;

    }

    private String constructIntoSingleLineConfig(DxfToPdfLayerConfig config) {
        StringBuilder layerRegEx = new StringBuilder();
        Iterator<PlanPdfLayerConfig> itr = config.getPlanPdfLayerConfigs().iterator();
        while (itr.hasNext()) {
            PlanPdfLayerConfig pc = itr.next();
            layerRegEx = layerRegEx.append(pc.getLayerName());
            if (pc.getLayerType() != null)
                layerRegEx = layerRegEx.append(":").append(pc.getLayerType());
            if (pc.getOverrideColor() != 0)
                layerRegEx = layerRegEx.append(pc.getOverrideColor());
            if (pc.getOverrideThickness() != 0)
                layerRegEx = layerRegEx.append(pc.getOverrideThickness());
            if (itr.hasNext())
                layerRegEx = layerRegEx.append(",");
        }
        return layerRegEx.toString();
    }

    private void getLayerColorConfigs(PlanDetail planDetail, EdcrPdfDetail pdfdetail, String s) {
        if (s.indexOf(":") != -1) {

            String[] layerAndConf = s.split(":");

            List<String> layerNamesLike = Util.getLayerNamesLike(planDetail.getDxfDocument(), layerAndConf[0]);

            if (layerAndConf[1].contains("ML") || s.contains("DL")) {
                pdfdetail.getPrintNameLayers().addAll(layerNamesLike);
            }
            if (layerAndConf[1].contains("M")) {
                // s=s.substring(0,s.indexOf(":"));
                if (pdfdetail.getMeasurementLayers() == null) {
                    pdfdetail.setMeasurementLayers(new ArrayList<>());
                }
                pdfdetail.getMeasurementLayers().addAll(layerNamesLike);

            }
            if (layerAndConf[1].contains("D")) {
                // s=s.substring(0,s.indexOf(":D"));
                if (pdfdetail.getDimensionLayers() == null) {
                    pdfdetail.setDimensionLayers(new ArrayList<>());
                }
                pdfdetail.getDimensionLayers().addAll(layerNamesLike);

            }

            if (layerAndConf[1].contains("C")) {
                String color = "";
                if (layerAndConf[1].contains("T"))
                    color = layerAndConf[1].substring(layerAndConf[1].indexOf("C") + 1,
                            layerAndConf[1].indexOf("T") - 1);
                else
                    color = layerAndConf[1].substring(layerAndConf[1].indexOf("C") + 1, layerAndConf[1].length());
                if (color != null) {
                    Integer no = Integer.parseInt(color);
                    for (String ln : layerNamesLike) {
                        pdfdetail.getColorOverrides().put(ln, no);
                    }
                }
            }
            if (layerAndConf[1].contains("T")) {
                String color = layerAndConf[1].substring(layerAndConf[1].indexOf("T") + 1, layerAndConf[1].length());
                if (color != null) {
                    Integer no = Integer.parseInt(color);
                    for (String ln : layerNamesLike) {
                        pdfdetail.getThicknessOverrides().put(ln, no);
                    }
                }
            }
        }
    }

    private void getLayerColorConfigs(PlanDetail planDetail, EdcrPdfDetail pdfdetail, PlanPdfLayerConfig planLayer) {

        List<String> layerNamesLike = Util.getLayerNamesLike(planDetail.getDxfDocument(), planLayer.getLayerName());

        if (planLayer.getLayerType() != null && planLayer.isPrintLayerName() && (planLayer.getLayerType().equalsIgnoreCase("M")
                || planLayer.getLayerType().equalsIgnoreCase("D"))) {
            pdfdetail.getPrintNameLayers().addAll(layerNamesLike);
        }
        if (planLayer.getLayerType() != null && planLayer.getLayerType().equalsIgnoreCase("M")) {
            if (pdfdetail.getMeasurementLayers() == null) {
                pdfdetail.setMeasurementLayers(new ArrayList<>());
            }
            pdfdetail.getMeasurementLayers().addAll(layerNamesLike);

        }
        if (planLayer.getLayerType() != null && planLayer.getLayerType().equalsIgnoreCase("D")) {
            if (pdfdetail.getDimensionLayers() == null) {
                pdfdetail.setDimensionLayers(new ArrayList<>());
            }
            pdfdetail.getDimensionLayers().addAll(layerNamesLike);

        }

        if (planLayer.getOverrideColor() != 0) {
            for (String ln : layerNamesLike) {
                pdfdetail.getColorOverrides().put(ln, planLayer.getOverrideColor());
            }
        }
        if (planLayer.getOverrideThickness() != 0) {
            for (String ln : layerNamesLike) {
                pdfdetail.getThicknessOverrides().put(ln, planLayer.getOverrideThickness());
            }
        }
    }
}
