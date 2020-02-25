package org.egov.report.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.ReportApp;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.domain.model.MetaDataRequest;
import org.egov.domain.model.ReportDefinitions;
import org.egov.domain.model.Response;
import org.egov.report.repository.ReportRepository;
import org.egov.swagger.model.*;
import org.egov.swagger.model.ColumnDetail.TypeEnum;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private Response responseInfoFactory;

    @Autowired
    private IntegrationService integrationService;

    //map to store metadata with <reportname+modulename> as key
    public static Map<String, MetadataResponse> metaResponseCache = new HashMap<>();


    public MetadataResponse getMetaData(MetaDataRequest metaDataRequest, String moduleName) throws CustomException {
        String reportName = metaDataRequest.getReportName().concat(moduleName);
        try {
            if (metaResponseCache.containsKey(reportName)) {
                return metaResponseCache.get(reportName);
            } else {
                MetadataResponse metadataResponse = new MetadataResponse();
                ReportDefinitions rds = ReportApp.getReportDefs();
                ReportDefinition reportDefinition = new ReportDefinition();
                //   LOGGER.info("updated repot defs " + ReportApp.getReportDefs() + "\n\n\n");
                reportDefinition = rds.getReportDefinition(moduleName + " " + metaDataRequest.getReportName());
                ReportMetadata rmt = new ReportMetadata();
                if (reportDefinition != null) {
                    rmt.setReportName(reportDefinition.getReportName());
                    rmt.setSummary(reportDefinition.getSummary());
                    rmt.setViewPath(reportDefinition.getViewPath());
                    rmt.setSearchFilter(reportDefinition.isSearchFilter());
                    rmt.setSorting(reportDefinition.isSorting());
                    rmt.setSerialNo(reportDefinition.isSerialNo());
                    rmt.setSelectiveDownload(reportDefinition.isSelectiveDownload());
                } else {
                    throw new CustomException("REPORT_CONFIG_ERROR", "Error in retrieving report definition");
                }
                List<ColumnDetail> reportHeaders = new ArrayList<>();
                List<ColumnDetail> searchParams = new ArrayList<>();

                for (SourceColumn cd : reportDefinition.getSourceColumns()) {
                    ColumnDetail reportheader = new ColumnDetail();
                    reportheader.setLabel(cd.getLabel());
                    reportheader.setName(cd.getName());
                    if (cd.getType() != null) {
                        TypeEnum te = TypeEnum.valueOf(cd.getType().toString().toUpperCase());
                        reportheader.setType(te);
                        reportheader.setRowTotal(cd.getRowTotal());
                        reportheader.setColumnTotal(cd.getColumnTotal());
                        reportHeaders.add(reportheader);
                    } else {
                        throw new CustomException("INVALID_TYPE_OF_SOURCE_COLUMN", "Type parameter in report definition is invalid for source column");
                    }

                }
                for (SearchColumn cd : reportDefinition.getSearchParams()) {

                    ColumnDetail sc = new ColumnDetail();
                    if (cd.getType() != null) {
                        TypeEnum te = TypeEnum.valueOf(cd.getType().toString().toUpperCase());
                        sc.setType(te);
                        sc.setLabel(cd.getLabel());
                        sc.setName(cd.getName());
                        sc.setShowColumn(cd.getShowColumn());
                        sc.setDefaultValue(cd.getPattern());
                        sc.setIsMandatory(cd.getIsMandatory());

                        sc.setColumnTotal(cd.getColumnTotal());
                        sc.setRowTotal(cd.getRowTotal());

                        sc.setInitialValue(cd.getInitialValue());
                        sc.setMinValue(cd.getMinValue());
                        sc.setMaxValue(cd.getMaxValue());

                        searchParams.add(sc);
                    } else {
                        throw new CustomException("INVALID_TYPE_OF_SEARCH_PARAM", "Type parameter in report definition is invalid for search param");
                    }
                }
                rmt.setReportHeader(reportHeaders);
                rmt.setSearchParams(searchParams);
                rmt.setAdditionalConfig(reportDefinition.getAdditionalConfig());
                metadataResponse.setReportDetails(rmt);
                metadataResponse.setTenantId(metaDataRequest.getTenantId());
                metaResponseCache.put(reportName, metadataResponse);
                return metadataResponse;
            }
        } catch (CustomException ex) {
            log.error("Invalid report config", ex);
            throw ex;
        } catch (Exception e) {
            log.error("Error in getting metadata", e);
            throw new CustomException("ERROR_GETTING_METADATA", e.getMessage());
        }

    }


    public ResponseEntity<?> getSuccessResponse(final MetadataResponse metadataResponse, final RequestInfo requestInfo,
                                                String tenantID) {
        final MetadataResponse metadataResponses = new MetadataResponse();
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
        responseInfo.setStatus(HttpStatus.OK.toString());
        metadataResponses.setRequestInfo(responseInfo);
        metadataResponses.setTenantId(tenantID);
        metadataResponses.setReportDetails(metadataResponse.getReportDetails());
        return new ResponseEntity<>(metadataResponses, HttpStatus.OK);

    }

    public ResponseEntity<?> getReportDataSuccessResponse(final List<ReportResponse> reportResponse, final RequestInfo requestInfo
            , String tenantId) {
        final ReportDataResponse reportDataResponse = new ReportDataResponse();
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
        responseInfo.setStatus(HttpStatus.OK.toString());
        reportDataResponse.setResponseInfo(responseInfo);
        reportDataResponse.setTenantId(tenantId);
        reportDataResponse.setReportResponses(reportResponse);
        return new ResponseEntity<>(reportDataResponse, HttpStatus.OK);

    }

    public ResponseEntity<?> getFailureResponse(final RequestInfo requestInfo,
                                                String tenantID) {
        final MetadataResponse metadataResponses = new MetadataResponse();
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, false);
        responseInfo.setResMsgId("Report Definition not found");
        metadataResponses.setRequestInfo(responseInfo);
        metadataResponses.setTenantId(tenantID);

        return new ResponseEntity<>(metadataResponses, HttpStatus.NOT_FOUND);

    }

    public ResponseEntity<?> getFailureResponse(final RequestInfo requestInfo,
                                                String tenantID, Exception e) {
        final MetadataResponse metadataResponses = new MetadataResponse();
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, false);
        responseInfo.setResMsgId(e.getMessage());
        metadataResponses.setRequestInfo(responseInfo);
        metadataResponses.setTenantId(tenantID);
        return new ResponseEntity<>(metadataResponses, HttpStatus.INTERNAL_SERVER_ERROR);

    }


    public ResponseEntity<?> reloadResponse(final RequestInfo requestInfo, Exception e) {

        final MetadataResponse metadataResponses = new MetadataResponse();
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);
        if (e != null) {
            responseInfo.setResMsgId("Report reloaded partially with Errors");
        }
        responseInfo.setResMsgId("Report reloaded successfully");
        metadataResponses.setRequestInfo(responseInfo);
        return new ResponseEntity<>(metadataResponses, HttpStatus.OK);

    }

    public List<ReportResponse> getAllReportData(ReportRequest reportRequest, String moduleName, String authToken) {
        List<ReportResponse> reportResponse = new ArrayList<ReportResponse>();
        ReportDataResponse rdr = new ReportDataResponse();
        ReportResponse rResponse = new ReportResponse();
        ReportDefinitions rds = ReportApp.getReportDefs();
        List<String> subReportNames = new ArrayList<>();
        ReportDefinition reportDefinition = rds.getReportDefinition(moduleName + " " + reportRequest.getReportName());
        if (reportDefinition.isSubReport()) {
            rResponse = getReportData(reportRequest, moduleName, reportRequest.getReportName(), authToken);
            reportResponse.add(rResponse);
            subReportNames = reportDefinition.getSubReportNames();
            for (String sr : subReportNames) {
                rResponse = getReportData(reportRequest, moduleName, sr, authToken);
                reportResponse.add(rResponse);
            }
        } else {
            rResponse = getReportData(reportRequest, moduleName, reportRequest.getReportName(), authToken);
            reportResponse.add(rResponse);
        }
        rdr.setReportResponses(reportResponse);
        final ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(reportRequest.getRequestInfo(), false);
        rdr.setResponseInfo(responseInfo);
        return reportResponse;
    }


    public ReportResponse getReportData(ReportRequest reportRequest, String moduleName, String reportName, String authToken) {


        ReportDefinitions rds = ReportApp.getReportDefs();
        ReportDefinition reportDefinition = rds.getReportDefinition(moduleName + " " + reportName);
        List<Map<String, Object>> maps = reportRepository.getData(reportRequest, reportDefinition, authToken);
        List<SourceColumn> columns = reportDefinition.getSourceColumns();
        ReportResponse reportResponse = new ReportResponse();
        populateData(columns, maps, reportResponse);
        populateReportHeader(reportDefinition, reportResponse);

        return reportResponse;
    }

    private void populateData(List<SourceColumn> columns, List<Map<String, Object>> maps,
                              ReportResponse reportResponse) {

        List<List<Object>> lists = new ArrayList<>();

        for (int i = 0; i < maps.size(); i++) {
            List<Object> objects = new ArrayList<>();
            Map<String, Object> map = maps.get(i);
            for (SourceColumn sourceColm : columns) {

                objects.add(map.get(sourceColm.getName()));
            }
            lists.add(objects);
        }
        reportResponse.setReportData(lists);
    }

    private void populateReportHeader(ReportDefinition reportDefinition, ReportResponse reportResponse) {

        //Let's check whether there's a linked report, we will set the default value in header columns according to that

        String pattern = null;
        String defaultValue = null;


        List<SourceColumn> columns = reportDefinition.getSourceColumns();
        for (SourceColumn sc : columns) {
            pattern = "";
            defaultValue = "";
            if (sc.getLinkedReport() != null) {

                pattern = sc.getLinkedReport().getLinkedColumn();
                defaultValue = pattern.replace("{reportName}", sc.getLinkedReport().getReportName());
                sc.setDefaultValue(defaultValue.replace("{currentColumnName}", sc.getName()));
            }
        }
        List<ColumnDetail> columnDetails = columns.stream()

                .map(p -> new ColumnDetail(p.getShowColumn(), p.getLabel(), p.getType(), p.getDefaultValue(), p.getTotal(), p.getName(), p.getLocalisationRequired(), p.getLocalisationPrefix(), p.getIsMandatory(), p.getRowTotal(), p.getColumnTotal(), p.getInitialValue(), p.getMinValue(), p.getMaxValue()))
                .collect(Collectors.toList());


        reportResponse.setViewPath(reportDefinition.getViewPath());
        reportResponse.setSelectiveDownload(reportDefinition.isSelectiveDownload());
        reportResponse.setReportHeader(columnDetails);
    }
}
