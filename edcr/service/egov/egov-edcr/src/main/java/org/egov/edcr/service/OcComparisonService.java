package org.egov.edcr.service;

import static java.lang.String.format;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.edcr.contract.ComparisonDetail;
import org.egov.edcr.contract.ComparisonRequest;
import org.egov.edcr.entity.Amendment;
import org.egov.edcr.entity.AmendmentDetails;
import org.egov.edcr.entity.EdcrApplication;
import org.egov.edcr.entity.EdcrApplicationDetail;
import org.egov.edcr.entity.OcComparisonDetail;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.custom.CustomImplProvider;
import org.egov.infra.filestore.entity.FileStoreMapper;
import org.egov.infra.filestore.service.FileStoreService;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OcComparisonService {
    private static final Logger LOG = Logger.getLogger(OcComparisonService.class);
    
    public static final String FILE_DOWNLOAD_URL = "%s/edcr/rest/dcr/downloadfile";

    @Autowired
    private CustomImplProvider specificRuleService;
    @Autowired
    private EdcrApplicationDetailService applicationDetailService;
    @Autowired
    private OcComparisonDetailService ocComparisonDetailService;
    @Autowired
    private FileStoreService fileStoreService;

    public List<ErrorDetail> validateEdcrMandatoryFields(final ComparisonRequest comparisonRequest) {
        List<ErrorDetail> errors = new ArrayList<>();
        if (StringUtils.isBlank(comparisonRequest.getEdcrNumber())) {
            errors.add(new ErrorDetail("BPA-21", "eDcr number is missing"));
        }

        if (StringUtils.isBlank(comparisonRequest.getOcdcrNumber())) {
            errors.add(new ErrorDetail("BPA-22", "OcDcr number is missing"));
        }

        if (StringUtils.isBlank(comparisonRequest.getTenantId())) {
            errors.add(new ErrorDetail("BPA-29", "tenantId is missing"));
        }

        return errors;
    }

    public ComparisonDetail process(ComparisonRequest comparisonRequest) {
        String ocdcrNo = comparisonRequest.getOcdcrNumber();
        String dcrNo = comparisonRequest.getEdcrNumber();
        String tenantId = comparisonRequest.getTenantId();
        ComparisonDetail comparisonDetail = new ComparisonDetail();

        OcComparisonDetail ocComparisonDetail = ocComparisonDetailService.findByOcDcrNoAndDcrNumberAndTenant(ocdcrNo, dcrNo,
                tenantId);

        if (ocComparisonDetail != null) {
            comparisonDetail.setEdcrNumber(ocComparisonDetail.getDcrNumber());
            comparisonDetail.setOcdcrNumber(ocComparisonDetail.getOcdcrNumber());
            comparisonDetail
                    .setComparisonReport(format(getFileDownloadUrl(ocComparisonDetail.getOcComparisonReport().getFileStoreId(),
                            ApplicationThreadLocals.getTenantID())));
            comparisonDetail.setTenantId(ocComparisonDetail.getTenantId());
            comparisonDetail.setStatus(ocComparisonDetail.getStatus());
        } else {
            EdcrApplicationDetail ocDcr = applicationDetailService.findByDcrNumberAndTPUserTenant(ocdcrNo, tenantId);
            EdcrApplicationDetail permitDcr = applicationDetailService.findByDcrNumberAndTPUserTenant(dcrNo, tenantId);

            List<ErrorDetail> errors = validate(ocdcrNo, dcrNo, ocDcr, permitDcr);

            if (!errors.isEmpty()) {
                comparisonDetail.setErrors(errors);
                return comparisonDetail;
            }

            EdcrApplication dcrApplication = ocDcr.getApplication();

            AmendmentService repo = (AmendmentService) specificRuleService.find("amendmentService");
            Amendment amd = repo.getAmendments();

            Date applicationDate = dcrApplication.getApplicationDate();

            OcComparisonDetail ocComparisonDetailE = new OcComparisonDetail();
            ocComparisonDetailE.setOcdcrNumber(ocdcrNo);
            ocComparisonDetailE.setDcrNumber(dcrNo);
            ocComparisonDetailE.setTenantId(tenantId);

            InputStream ocreportStream = generateOcComparisonReport(applicationDate, amd, ocDcr, permitDcr, ocComparisonDetailE);

            saveComparisonReport(ocComparisonDetailE, ocreportStream);
            // build object for response
            comparisonDetail.setEdcrNumber(ocComparisonDetailE.getDcrNumber());
            comparisonDetail.setOcdcrNumber(ocComparisonDetailE.getOcdcrNumber());
            comparisonDetail
                    .setComparisonReport(format(getFileDownloadUrl(ocComparisonDetailE.getOcComparisonReport().getFileStoreId(),
                            ApplicationThreadLocals.getTenantID())));
            comparisonDetail.setStatus(ocComparisonDetailE.getStatus());
            comparisonDetail.setTenantId(ocComparisonDetailE.getTenantId());
        }

        return comparisonDetail;
    }

    public OcComparisonDetail processCombined(OcComparisonDetail comparisonDetail, EdcrApplicationDetail ocDcr) {

        EdcrApplication dcrApplication = ocDcr.getApplication();

        AmendmentService repo = (AmendmentService) specificRuleService.find("amendmentService");
        Amendment amd = repo.getAmendments();

        Date applicationDate = dcrApplication.getApplicationDate();

        InputStream ocreportStream = generatePreOcComparisonReport(applicationDate, amd, ocDcr, comparisonDetail.getPermitDcr(),
                comparisonDetail);

        comparisonDetail.setOutput(ocreportStream);

        return comparisonDetail;
    }
    
    public OcComparisonDetail processCombinedStatus(ComparisonRequest comparisonRequest, EdcrApplicationDetail ocDcr) {
        String ocdcrNo = comparisonRequest.getOcdcrNumber();
        String dcrNo = comparisonRequest.getEdcrNumber();
        String tenantId = comparisonRequest.getTenantId();

        EdcrApplicationDetail permitDcr = applicationDetailService.findByDcrNumberAndTPUserTenant(dcrNo, tenantId);

        EdcrApplication dcrApplication = ocDcr.getApplication();

        AmendmentService repo = (AmendmentService) specificRuleService.find("amendmentService");
        Amendment amd = repo.getAmendments();

        Date applicationDate = dcrApplication.getApplicationDate();

        OcComparisonDetail ocComparisonDetailE = new OcComparisonDetail();
        ocComparisonDetailE.setOcdcrNumber(ocdcrNo);
        ocComparisonDetailE.setDcrNumber(dcrNo);
        ocComparisonDetailE.setTenantId(tenantId);
        ocComparisonDetailE.setPermitDcr(permitDcr);

        getComparisonReportStatus(applicationDate, amd, ocDcr, permitDcr, ocComparisonDetailE);

        return ocComparisonDetailE;
    }
    
    private List<ErrorDetail> validate(String ocdrNo, String dcrNo, EdcrApplicationDetail ocDcr,
            EdcrApplicationDetail permitDcr) {
        List<ErrorDetail> errors = new ArrayList<>();
        if (ocDcr == null) {
            errors.add(new ErrorDetail("BPA-23", "No record found with ocdcr number " + ocdrNo));
        }

        if (permitDcr == null) {
            errors.add(new ErrorDetail("BPA-24", "No record found with dcr number " + dcrNo));
        }

        if (ocDcr != null && ocDcr.getApplication() != null && StringUtils.isBlank(ocDcr.getApplication().getServiceType())) {
            errors.add(new ErrorDetail("BPA-25", "No service type found for ocdcr number " + ocdrNo));
        }

        if (permitDcr != null && permitDcr.getApplication() != null
                && StringUtils.isBlank(permitDcr.getApplication().getServiceType())) {
            errors.add(new ErrorDetail("BPA-26", "No service type found for dcr number " + dcrNo));
        }

        if (ocDcr != null && ocDcr.getApplication() != null
                && permitDcr != null && permitDcr.getApplication() != null
                && ocDcr.getApplication().getApplicationType().getApplicationType()
                        .equalsIgnoreCase(permitDcr.getApplication().getApplicationType().getApplicationTypeVal())) {
            errors.add(new ErrorDetail("BPA-27", "Application types are same"));
        }

        if (ocDcr != null && ocDcr.getApplication() != null
                && permitDcr != null && permitDcr.getApplication() != null
                && !ocDcr.getApplication().getServiceType().equalsIgnoreCase(permitDcr.getApplication().getServiceType())) {
            errors.add(new ErrorDetail("BPA-28", "Service types are not mathing"));
        }
        return errors;
    }

    private InputStream generateOcComparisonReport(Date applicationDate, Amendment amd, EdcrApplicationDetail ocDcr,
            EdcrApplicationDetail permitDcr, OcComparisonDetail detail) {

        String beanName = "OcComparisonReportService";
        OcComparisonReportService service = null;
        int index = -1;
        AmendmentDetails[] amdArray = null;
        InputStream reportStream = null;
        int length = amd.getDetails().size();
        if (!amd.getDetails().isEmpty()) {
            index = amd.getIndex(applicationDate);
            amdArray = new AmendmentDetails[amd.getDetails().size()];
            amd.getDetails().toArray(amdArray);
        }

        try {
            beanName = beanName.substring(0, 1).toLowerCase() + beanName.substring(1);

            if (amd.getDetails().isEmpty() || index == -1)
                service = (OcComparisonReportService) specificRuleService.find(beanName);
            else if (index >= 0) {
                for (int i = index; i < length; i++) {

                    service = (OcComparisonReportService) specificRuleService
                            .find(beanName + "_" + amdArray[i].getDateOfBylawString());
                    if (service != null)
                        break;
                }
            }
            if (service == null) {
                service = (OcComparisonReportService) specificRuleService.find(beanName);
            }

            reportStream = service.generateOcComparisonReport(ocDcr, permitDcr, detail);

        } catch (BeansException e) {
            LOG.error("No Bean Defined for the Rule " + beanName);
        }

        return reportStream;
    }

    private InputStream generatePreOcComparisonReport(Date applicationDate, Amendment amd, EdcrApplicationDetail ocDcr,
            EdcrApplicationDetail permitDcr, OcComparisonDetail detail) {

        String beanName = "OcComparisonReportService";
        OcComparisonReportService service = null;
        int index = -1;
        AmendmentDetails[] amdArray = null;
        InputStream reportStream = null;
        int length = amd.getDetails().size();
        if (!amd.getDetails().isEmpty()) {
            index = amd.getIndex(applicationDate);
            amdArray = new AmendmentDetails[amd.getDetails().size()];
            amd.getDetails().toArray(amdArray);
        }

        try {
            beanName = beanName.substring(0, 1).toLowerCase() + beanName.substring(1);

            if (amd.getDetails().isEmpty() || index == -1)
                service = (OcComparisonReportService) specificRuleService.find(beanName);
            else if (index >= 0) {
                for (int i = index; i < length; i++) {

                    service = (OcComparisonReportService) specificRuleService
                            .find(beanName + "_" + amdArray[i].getDateOfBylawString());
                    if (service != null)
                        break;
                }
            }
            if (service == null) {
                service = (OcComparisonReportService) specificRuleService.find(beanName);
            }

            reportStream = service.generatePreOcComparisonReport(ocDcr, permitDcr, detail);

        } catch (BeansException e) {
            LOG.error("No Bean Defined for the Rule " + beanName);
        }

        return reportStream;
    }

    private OcComparisonDetail getComparisonReportStatus(Date applicationDate, Amendment amd, EdcrApplicationDetail ocDcr,
            EdcrApplicationDetail permitDcr, OcComparisonDetail detail) {

        String beanName = "OcComparisonReportService";
        OcComparisonReportService service = null;
        int index = -1;
        AmendmentDetails[] amdArray = null;
        Boolean comparisonReportStatus = null;
        int length = amd.getDetails().size();
        if (!amd.getDetails().isEmpty()) {
            index = amd.getIndex(applicationDate);
            amdArray = new AmendmentDetails[amd.getDetails().size()];
            amd.getDetails().toArray(amdArray);
        }

        try {
            beanName = beanName.substring(0, 1).toLowerCase() + beanName.substring(1);

            if (amd.getDetails().isEmpty() || index == -1)
                service = (OcComparisonReportService) specificRuleService.find(beanName);
            else if (index >= 0) {
                for (int i = index; i < length; i++) {

                    service = (OcComparisonReportService) specificRuleService
                            .find(beanName + "_" + amdArray[i].getDateOfBylawString());
                    if (service != null)
                        break;
                }
            }
            if (service == null) {
                service = (OcComparisonReportService) specificRuleService.find(beanName);
            }

            service.getComparisonReportStatus(ocDcr, permitDcr, detail);

        } catch (BeansException e) {
            LOG.error("No Bean Defined for the Rule " + beanName);
        }

        return detail;
    }
    
    @Transactional
    public void saveComparisonReport(OcComparisonDetail detail, InputStream reportOutputStream) {
        final String fileName = detail.getOcdcrNumber() + "-" + detail.getDcrNumber() +
                "-comparison" + ".pdf";
        final FileStoreMapper fileStoreMapper = fileStoreService.store(reportOutputStream, fileName, "application/pdf",
                DcrConstants.FILESTORE_MODULECODE);
        detail.setOcComparisonReport(fileStoreMapper);
        ocComparisonDetailService.saveAndFlush(detail);
    }

    public String getFileDownloadUrl(final String fileStoreId, final String tenantId) {
        return String.format(FILE_DOWNLOAD_URL, ApplicationThreadLocals.getDomainURL()) + "?tenantId="
                + tenantId + "&fileStoreId=" + fileStoreId;
    }

}