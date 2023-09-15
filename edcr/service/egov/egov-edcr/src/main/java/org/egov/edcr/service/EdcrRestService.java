/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) <2017>  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *      Further, all user interfaces, including but not limited to citizen facing interfaces,
 *         Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *         derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *      For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *      For any further queries on attribution, including queries on brand guidelines,
 *         please contact contact@egovernments.org
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.edcr.service;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.lang3.StringUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.egov.common.entity.dcr.helper.ErrorDetail;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.PlanInformation;
import org.egov.edcr.config.properties.EdcrApplicationSettings;
import org.egov.edcr.constants.DxfFileConstants;
import org.egov.edcr.contract.EdcrDetail;
import org.egov.edcr.contract.EdcrRequest;
import org.egov.edcr.entity.ApplicationType;
import org.egov.edcr.entity.EdcrApplication;
import org.egov.edcr.entity.EdcrApplicationDetail;
import org.egov.edcr.entity.EdcrIndexData;
import org.egov.edcr.entity.EdcrPdfDetail;
import org.egov.edcr.utility.DcrConstants;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.config.core.EnvironmentSettings;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.filestore.service.FileStoreService;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.infra.microservice.contract.ResponseInfo;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.models.Role;
import org.egov.infra.microservice.models.UserInfo;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.infra.utils.TenantUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional(readOnly = true)
public class EdcrRestService {

    private static final String IS_ENVIRONMENT_CENTRAL_INSTANCE = "is.environment.central.instance";

    private final SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

    private static final String MSG_UNQ_TRANSACTION_NUMBER = "Transaction Number should be unique";

    private static final String REQ_BODY_REQUIRED = "Required request body is missing";

    private static final String USER_ID_IS_MANDATORY = "User id is mandatory";

    private static final String BPA_01 = "BPA-01";

    private static final String BPA_07 = "BPA-07";

    private static final String BPA_05 = "BPA-05";

    private static final Logger LOG = LoggerFactory.getLogger(EdcrApplicationService.class);

    public static final String FILE_DOWNLOAD_URL = "%s/edcr/rest/dcr/downloadfile";

    @Autowired
    protected SecurityUtils securityUtils;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private EdcrApplicationSettings edcrApplicationSettings;

    @Autowired
    private EdcrApplicationService edcrApplicationService;

    @Autowired
    private FileStoreService fileStoreService;

    @Autowired
    private TenantUtils tenantUtils;

    @Autowired
    private CityService cityService;

    @Autowired
    private EdcrApplicationDetailService applicationDetailService;

    @Autowired
    private EnvironmentSettings environmentSettings;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${egov.services.egov-indexer.url}")
    private String egovIndexerUrl;

    @Value("${indexer.host}")
    private String indexerHost;

    public Session getCurrentSession() {
        return entityManager.unwrap(Session.class);
    }

    @Transactional
    public EdcrDetail createEdcr(final EdcrRequest edcrRequest, final MultipartFile file,
                                 Map<String, List<Object>> masterData) {
        EdcrApplication edcrApplication = new EdcrApplication();
        edcrApplication.setTenantId(ApplicationThreadLocals.getFullTenantID());
        edcrApplication.setMdmsMasterData(masterData);
        EdcrApplicationDetail edcrApplicationDetail = new EdcrApplicationDetail();
        if (ApplicationType.OCCUPANCY_CERTIFICATE.toString().equalsIgnoreCase(edcrRequest.getAppliactionType())) {
            edcrApplicationDetail.setComparisonDcrNumber(edcrRequest.getComparisonEdcrNumber());
        }
        List<EdcrApplicationDetail> edcrApplicationDetails = new ArrayList<>();
        edcrApplicationDetails.add(edcrApplicationDetail);
        edcrApplication.setTransactionNumber(edcrRequest.getTransactionNumber());
        if (isNotBlank(edcrRequest.getApplicantName()))
            edcrApplication.setApplicantName(edcrRequest.getApplicantName());
        else
            edcrApplication.setApplicantName(DxfFileConstants.ANONYMOUS_APPLICANT);
        edcrApplication.setArchitectInformation(DxfFileConstants.ANONYMOUS_APPLICANT);
        edcrApplication.setServiceType(edcrRequest.getApplicationSubType());
        if (edcrRequest.getAppliactionType() == null)
            edcrApplication.setApplicationType(ApplicationType.PERMIT);
        else
            edcrApplication.setApplicationType(ApplicationType.valueOf(edcrRequest.getAppliactionType()));
        if (edcrRequest.getPermitNumber() != null)
            edcrApplication.setPlanPermitNumber(edcrRequest.getPermitNumber());

        if (edcrRequest.getPermitDate() != null) {
            edcrApplication.setPermitApplicationDate(edcrRequest.getPermitDate());
        }

        edcrApplication.setEdcrApplicationDetails(edcrApplicationDetails);
        edcrApplication.setDxfFile(file);

        if (edcrRequest.getRequestInfo() != null && edcrRequest.getRequestInfo().getUserInfo() != null) {
            edcrApplication.setThirdPartyUserCode(isNotBlank(edcrRequest.getRequestInfo().getUserInfo().getUuid())
                    ? edcrRequest.getRequestInfo().getUserInfo().getUuid()
                    : edcrRequest.getRequestInfo().getUserInfo().getId());
            String tenantId = "";
            if (StringUtils.isNotBlank(edcrRequest.getTenantId())) {
                String[] tenantArr = edcrRequest.getTenantId().split("\\.");
                String tenantFromReq;
                if (tenantArr.length == 1)
                    tenantFromReq = tenantArr[0];
                else
                    tenantFromReq = tenantArr[1];
                if (tenantFromReq.equalsIgnoreCase(ApplicationThreadLocals.getTenantID()))
                    tenantId = edcrRequest.getTenantId();
            }

            if (StringUtils.isBlank(tenantId) && edcrRequest.getRequestInfo() != null
                    && edcrRequest.getRequestInfo().getUserInfo() != null
                    && StringUtils.isNotBlank(edcrRequest.getRequestInfo().getUserInfo().getTenantId())) {
                tenantId = edcrRequest.getRequestInfo().getUserInfo().getTenantId();
            } else if (StringUtils.isBlank(tenantId)) {
                tenantId = ApplicationThreadLocals.getTenantID();
            }
            edcrApplication.setThirdPartyUserTenant(tenantId);
            edcrApplication.setArchitectInformation(edcrRequest.getRequestInfo().getUserInfo().getName());
        }

        edcrApplication = edcrApplicationService.createRestEdcr(edcrApplication);

        //Code to push the data of edcr application to kafka index
        EdcrIndexData edcrIndexData = new EdcrIndexData();
        if (environmentSettings.getDataPush()) {
            //Building object to be pushed
            edcrIndexData = setEdcrIndexData(edcrApplication, edcrApplication.getEdcrApplicationDetails().get(0));
            // call kafka topic
            pushDataToIndexer(edcrIndexData, "edcr-create-application");
        }

        return setEdcrResponse(edcrApplication.getEdcrApplicationDetails().get(0), edcrRequest);
    }

    public void pushDataToIndexer(Object data, String topicName) {
        try {
            restTemplate = new RestTemplate();
            StringBuilder uri = new StringBuilder(indexerHost).append(egovIndexerUrl);
            LOG.info("URL created: " + uri.toString());
            restTemplate.postForObject(uri.toString(), data, Object.class, topicName);
            LOG.info("Data pushed in topic->edcr-create-application.\n Data pushed=> \n" + data);
        } catch (RestClientException e) {
            LOG.error("ERROR occurred while trying to push the data to indexer : ", e);
        }
    }

    public EdcrIndexData setEdcrIndexData(EdcrApplication edcrApplication, EdcrApplicationDetail edcrApplnDtl) {

        EdcrIndexData edcrIndexData = new EdcrIndexData();
        if (edcrApplication.getApplicantName() != null) {
            edcrIndexData.setApplicantName(edcrApplication.getApplicantName());
        }
        if (edcrApplication.getApplicationNumber() != null) {
            edcrIndexData.setApplicationNumber(edcrApplication.getApplicationNumber());
        }
        if (edcrApplication.getApplicationType() != null) {
            edcrIndexData.setApplicationType(edcrApplication.getApplicationType());
        }
        if (edcrApplication.getApplicationDate() != null) {
            edcrIndexData.setApplicationDate(edcrApplication.getApplicationDate());
        }
        if (edcrApplication.getStatus() != null) {
            edcrIndexData.setStatus(edcrApplication.getStatus());
        }
        if (edcrApplication.getPlanPermitNumber() != null) {
            edcrIndexData.setPlanPermitNumber(edcrApplication.getPlanPermitNumber());
        }
        if (edcrApplication.getPermitApplicationDate() != null) {
            edcrIndexData.setPermitApplicationDate(edcrApplication.getPermitApplicationDate());
        }
        if (edcrApplication.getTransactionNumber() != null) {
            edcrIndexData.setTransactionNumber(edcrApplication.getTransactionNumber());
        }
        if (edcrApplication.getThirdPartyUserTenant() != null) {
            edcrIndexData.setThirdPartyUserTenant(edcrApplication.getThirdPartyUserTenant());
        }
        if (edcrApplication.getServiceType() != null) {
            edcrIndexData.setServiceType(edcrApplication.getServiceType());
        }
        if (edcrApplication.getArchitectInformation() != null) {
            edcrIndexData.setArchitectInformation(edcrApplication.getArchitectInformation());
        }
        if (edcrApplication.getEdcrApplicationDetails().get(0).getDcrNumber() != null) {
            edcrIndexData.setDcrNumber(edcrApplication.getEdcrApplicationDetails().get(0).getDcrNumber());
        }
        if (edcrApplication.getEdcrApplicationDetails().get(0).getComparisonDcrNumber() != null) {
            edcrIndexData.setComparisonDcrNumber(
                    edcrApplication.getEdcrApplicationDetails().get(0).getComparisonDcrNumber());
        }
        if (edcrApplnDtl.getPlan() != null && edcrApplnDtl.getPlan().getPlot() != null
                && edcrApplnDtl.getPlan().getPlot().getPlotBndryArea() != null) {
            edcrIndexData.setPlotBndryArea(edcrApplnDtl.getPlan().getPlot().getPlotBndryArea());
        }

        if (edcrApplication.getEdcrApplicationDetails().get(0).getPlan() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding()
                .getBuildingHeight() != null) {
            edcrIndexData.setBuildingHeight(edcrApplication.getEdcrApplicationDetails().get(0).getPlan()
                    .getVirtualBuilding().getBuildingHeight());
        }
        if (edcrApplication.getEdcrApplicationDetails().get(0).getPlan() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding()
                .getOccupancyTypes() != null) {
            edcrIndexData.setOccupancyTypes(edcrApplication.getEdcrApplicationDetails().get(0).getPlan()
                    .getVirtualBuilding().getOccupancyTypes());
        }
        if (edcrApplication.getEdcrApplicationDetails().get(0).getPlan() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding()
                .getTotalBuitUpArea() != null) {
            edcrIndexData.setTotalBuitUpArea(edcrApplication.getEdcrApplicationDetails().get(0).getPlan()
                    .getVirtualBuilding().getTotalBuitUpArea());
        }
        if (edcrApplication.getEdcrApplicationDetails().get(0).getPlan() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding()
                .getTotalFloorArea() != null) {
            edcrIndexData.setTotalFloorArea(edcrApplication.getEdcrApplicationDetails().get(0).getPlan()
                    .getVirtualBuilding().getTotalFloorArea());
        }
        if (edcrApplication.getEdcrApplicationDetails().get(0).getPlan() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding()
                .getTotalCarpetArea() != null) {
            edcrIndexData.setTotalCarpetArea(edcrApplication.getEdcrApplicationDetails().get(0).getPlan()
                    .getVirtualBuilding().getTotalCarpetArea());
        }
        if (edcrApplication.getEdcrApplicationDetails().get(0).getPlan() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding() != null
                && edcrApplication.getEdcrApplicationDetails().get(0).getPlan().getVirtualBuilding()
                .getFloorsAboveGround() != null) {
            edcrIndexData.setFloorsAboveGround(edcrApplication.getEdcrApplicationDetails().get(0).getPlan()
                    .getVirtualBuilding().getFloorsAboveGround());
        }
        return edcrIndexData;
    }

    @Transactional
    public List<EdcrDetail> edcrDetailsResponse(List<EdcrApplicationDetail> edcrApplications, EdcrRequest edcrRequest) {
        List<EdcrDetail> edcrDetails = new ArrayList<>();
        for (EdcrApplicationDetail edcrApp : edcrApplications)
            edcrDetails.add(setEdcrResponse(edcrApp, edcrRequest));

        return edcrDetails;
    }

    public EdcrDetail setEdcrResponse(EdcrApplicationDetail edcrApplnDtl, EdcrRequest edcrRequest) {
        EdcrDetail edcrDetail = new EdcrDetail();
        List<String> planPdfs = new ArrayList<>();
        edcrDetail.setTransactionNumber(edcrApplnDtl.getApplication().getTransactionNumber());
        LOG.info("edcr number == " + edcrApplnDtl.getDcrNumber());
        edcrDetail.setEdcrNumber(edcrApplnDtl.getDcrNumber());
        edcrDetail.setStatus(edcrApplnDtl.getStatus());
        LOG.info("application number ==" + edcrApplnDtl.getApplication().getApplicationNumber());
        edcrDetail.setApplicationNumber(edcrApplnDtl.getApplication().getApplicationNumber());
        edcrDetail.setApplicationDate(edcrApplnDtl.getApplication().getApplicationDate());

        if (edcrApplnDtl.getApplication().getPlanPermitNumber() != null) {
            edcrDetail.setPermitNumber(edcrApplnDtl.getApplication().getPlanPermitNumber());
        }
        if (edcrApplnDtl.getApplication().getPermitApplicationDate() != null) {
            edcrDetail.setPermitDate(edcrApplnDtl.getApplication().getPermitApplicationDate());
        }
        ApplicationType applicationType = edcrApplnDtl.getApplication().getApplicationType();
        if (applicationType != null) {
            if (ApplicationType.PERMIT.getApplicationTypeVal()
                    .equalsIgnoreCase(edcrApplnDtl.getApplication().getApplicationType().getApplicationTypeVal())) {
                edcrDetail.setAppliactionType("BUILDING_PLAN_SCRUTINY");
            } else if (ApplicationType.OCCUPANCY_CERTIFICATE.getApplicationTypeVal()
                    .equalsIgnoreCase(edcrApplnDtl.getApplication().getApplicationType().getApplicationTypeVal())) {
                edcrDetail.setAppliactionType("BUILDING_OC_PLAN_SCRUTINY");
            } else {
                edcrDetail.setAppliactionType(applicationType.getApplicationTypeVal());
            }

        }
        if (edcrApplnDtl.getApplication().getServiceType() != null)
            edcrDetail.setApplicationSubType(edcrApplnDtl.getApplication().getServiceType());
        String tenantId;
        boolean isCentralInstanceEnabled = environmentSettings.getProperty(IS_ENVIRONMENT_CENTRAL_INSTANCE, Boolean.class);
        if (isCentralInstanceEnabled) {
            tenantId = edcrApplnDtl.getPlanDetailFileStore().getTenantId();
            if (StringUtils.isBlank(tenantId)) {
                String[] tenantArr = edcrApplnDtl.getApplication().getThirdPartyUserTenant().split("\\.");
                if (tenantArr.length == 1)
                    tenantId = tenantArr[0];
                else
                    tenantId = tenantArr[1];
            }
        } else {
            if (edcrApplnDtl.getPlanDetailFileStore() != null && edcrApplnDtl.getPlanDetailFileStore().getTenantId() != null) {
                tenantId = edcrApplnDtl.getPlanDetailFileStore().getTenantId();
            } else {
                String[] tenantArr = edcrApplnDtl.getApplication().getThirdPartyUserTenant().split("\\.");
                if (tenantArr.length == 1)
                    tenantId = tenantArr[0];
                else
                    tenantId = tenantArr[1];
            }
        }

        if (edcrApplnDtl.getDxfFileId() != null)
            edcrDetail.setDxfFile(format(getFileDownloadUrl(edcrApplnDtl.getDxfFileId().getFileStoreId(), tenantId)));

        if (edcrApplnDtl.getScrutinizedDxfFileId() != null)
            edcrDetail.setUpdatedDxfFile(
                    format(getFileDownloadUrl(edcrApplnDtl.getScrutinizedDxfFileId().getFileStoreId(), tenantId)));

        if (edcrApplnDtl.getReportOutputId() != null)
            edcrDetail.setPlanReport(
                    format(getFileDownloadUrl(edcrApplnDtl.getReportOutputId().getFileStoreId(), tenantId)));

        File file = edcrApplnDtl.getPlanDetailFileStore() != null
                ? fileStoreService.fetch(edcrApplnDtl.getPlanDetailFileStore().getFileStoreId(),
                DcrConstants.APPLICATION_MODULE_TYPE, tenantId)
                : null;

        if (LOG.isInfoEnabled())
            LOG.info("**************** End - Reading Plan detail file **************" + file);
        try {
            if (file == null) {
                Plan pl1 = new Plan();
                PlanInformation pi = new PlanInformation();
                pi.setApplicantName(edcrApplnDtl.getApplication().getApplicantName());
                pl1.setPlanInformation(pi);
                edcrDetail.setPlanDetail(pl1);
            } else {
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                Plan pl1 = mapper.readValue(file, Plan.class);
                pl1.getPlanInformation().setApplicantName(edcrApplnDtl.getApplication().getApplicantName());
                if (LOG.isInfoEnabled())
                    LOG.info("**************** Plan detail object **************" + pl1);
                edcrDetail.setPlanDetail(pl1);
            }
        } catch (IOException e) {
            LOG.error("Error occurred while mapping !!", e);
        }

        for (EdcrPdfDetail planPdf : edcrApplnDtl.getEdcrPdfDetails()) {
            if (planPdf.getConvertedPdf() != null) {
                String downloadURL = format(getFileDownloadUrl(
                        planPdf.getConvertedPdf().getFileStoreId(),
                        ApplicationThreadLocals.getTenantID()));
                planPdfs.add(planPdf.getLayer().concat(" - ").concat(downloadURL));
                for (org.egov.common.entity.edcr.EdcrPdfDetail pdf : edcrDetail.getPlanDetail().getEdcrPdfDetails()) {
                    if (planPdf.getLayer().equalsIgnoreCase(pdf.getLayer()))
                        pdf.setDownloadURL(downloadURL);
                }
            }
        }

        edcrDetail.setPlanPdfs(planPdfs);
        edcrDetail.setTenantId(edcrApplnDtl.getTenantId() == null ? edcrRequest.getTenantId() : edcrApplnDtl.getTenantId());
        if (edcrDetail.getPlanDetail() != null && edcrDetail.getPlanDetail().getTenantId() == null)
            edcrDetail.getPlanDetail().setTenantId(edcrApplnDtl.getTenantId());
        if (StringUtils.isNotBlank(edcrRequest.getComparisonEdcrNumber()))
            edcrDetail.setComparisonEdcrNumber(edcrRequest.getComparisonEdcrNumber());

        if (!edcrApplnDtl.getStatus().equalsIgnoreCase("Accepted"))
            edcrDetail.setStatus(edcrApplnDtl.getStatus());

        return edcrDetail;
    }

    public EdcrDetail setEdcrResponseForAcrossTenants(Object[] applnDtls, String stateCityCode) {
        EdcrDetail edcrDetail = new EdcrDetail();
        edcrDetail.setTransactionNumber(String.valueOf(applnDtls[1]));
        edcrDetail.setEdcrNumber(String.valueOf(applnDtls[2]));
        edcrDetail.setStatus(String.valueOf(applnDtls[3]));
        edcrDetail.setApplicationDate(new LocalDate(String.valueOf(applnDtls[9])).toDate());
        edcrDetail.setApplicationNumber(String.valueOf(applnDtls[10]));
        String applicationType = String.valueOf(applnDtls[11]);
        if (applicationType != null) {
            if (ApplicationType.PERMIT.getApplicationTypeVal()
                    .equalsIgnoreCase(ApplicationType.valueOf(applicationType).getApplicationTypeVal())) {
                edcrDetail.setAppliactionType("BUILDING_PLAN_SCRUTINY");
            } else if (ApplicationType.OCCUPANCY_CERTIFICATE.getApplicationTypeVal()
                    .equalsIgnoreCase(ApplicationType.valueOf(applicationType).getApplicationTypeVal())) {
                edcrDetail.setAppliactionType("BUILDING_OC_PLAN_SCRUTINY");
            } else {
                edcrDetail.setAppliactionType(ApplicationType.valueOf(applicationType).getApplicationTypeVal());
            }

        }
        edcrDetail.setApplicationSubType(String.valueOf(applnDtls[12]));
        edcrDetail.setPermitNumber(String.valueOf(applnDtls[13]));
        String tenantId = String.valueOf(applnDtls[0]);
        if (applnDtls[14] != null)
            edcrDetail.setPermitDate(new LocalDate(String.valueOf(applnDtls[14])).toDate());

        if (String.valueOf(applnDtls[5]) != null)
            edcrDetail
                    .setDxfFile(format(getFileDownloadUrl(String.valueOf(applnDtls[5]), tenantId)));

        if (String.valueOf(applnDtls[6]) != null)
            edcrDetail.setUpdatedDxfFile(
                    format(getFileDownloadUrl(String.valueOf(applnDtls[6]), tenantId)));

        if (String.valueOf(applnDtls[7]) != null)
            edcrDetail.setPlanReport(
                    format(getFileDownloadUrl(String.valueOf(applnDtls[7]), tenantId)));
        File file = null;
        try {
            file = String.valueOf(applnDtls[8]) != null
                    ? fileStoreService.fetch(String.valueOf(applnDtls[8]),
                    DcrConstants.APPLICATION_MODULE_TYPE, tenantId)
                    : null;
        } catch (ApplicationRuntimeException e) {
            LOG.error("Error occurred, while fetching plan details!!!", e);
        }

        if (LOG.isInfoEnabled())
            LOG.info("**************** End - Reading Plan detail file **************" + file);
        try {
            if (file == null) {
                Plan pl1 = new Plan();
                PlanInformation pi = new PlanInformation();
                pi.setApplicantName(String.valueOf(applnDtls[4]));
                pl1.setPlanInformation(pi);
                edcrDetail.setPlanDetail(pl1);
            } else {
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                Plan pl1 = mapper.readValue(file, Plan.class);
                pl1.getPlanInformation().setApplicantName(String.valueOf(applnDtls[4]));
                if (LOG.isInfoEnabled())
                    LOG.info("**************** Plan detail object **************" + pl1);
                edcrDetail.setPlanDetail(pl1);
            }
        } catch (IOException e) {
            LOG.error("Error occurred while mapping !!", e);
        }

        edcrDetail.setTenantId(stateCityCode.concat(".").concat(tenantId));

        if (!String.valueOf(applnDtls[3]).equalsIgnoreCase("Accepted"))
            edcrDetail.setStatus(String.valueOf(applnDtls[3]));

        return edcrDetail;
    }

    @SuppressWarnings("unchecked")
    public List<EdcrDetail> fetchEdcr(final EdcrRequest edcrRequest, final RequestInfoWrapper reqInfoWrapper) {
        List<EdcrApplicationDetail> edcrApplications = new ArrayList<>();
        UserInfo userInfo = reqInfoWrapper.getRequestInfo() == null ? null
                : reqInfoWrapper.getRequestInfo().getUserInfo();
        String userId = "";
        if (userInfo != null && StringUtils.isNoneBlank(userInfo.getUuid()))
            userId = userInfo.getUuid();
        else if (userInfo != null && StringUtils.isNoneBlank(userInfo.getId()))
            userId = userInfo.getId();
        // When the user is ANONYMOUS, then search application by edcrno or transaction
        // number
        if (userInfo != null && StringUtils.isNoneBlank(userId) && userInfo.getPrimaryrole() != null
                && !userInfo.getPrimaryrole().isEmpty()) {
            List<String> roles = userInfo.getPrimaryrole().stream().map(Role::getCode).collect(Collectors.toList());
            LOG.info("****Roles***" + roles);
            if (roles.contains("ANONYMOUS"))
                userId = "";
        }
        if (edcrRequest.getLimit() == null)
            edcrRequest.setLimit(-1);
        if (edcrRequest.getOffset() == null)
            edcrRequest.setOffset(0);
        boolean onlyTenantId = edcrRequest != null && isBlank(edcrRequest.getEdcrNumber())
                && isBlank(edcrRequest.getTransactionNumber()) && isBlank(edcrRequest.getAppliactionType())
                && isBlank(edcrRequest.getApplicationSubType()) && isBlank(edcrRequest.getStatus())
                && edcrRequest.getFromDate() == null && edcrRequest.getToDate() == null
                && isBlank(edcrRequest.getApplicationNumber())
                && isNotBlank(edcrRequest.getTenantId());

        boolean isStakeholder = edcrRequest != null && (isNotBlank(edcrRequest.getAppliactionType())
                || isNotBlank(edcrRequest.getApplicationSubType()) || isNotBlank(edcrRequest.getStatus())
                || edcrRequest.getFromDate() != null || edcrRequest.getToDate() != null);

        City stateCity = cityService.fetchStateCityDetails();

        int limit = Integer.parseInt(environmentSettings.getProperty("egov.edcr.default.limit"));
        int offset = Integer.parseInt(environmentSettings.getProperty("egov.edcr.default.offset"));
        int maxLimit = Integer.parseInt(environmentSettings.getProperty("egov.edcr.max.limit"));
        if (edcrRequest.getLimit() != null && edcrRequest.getLimit() <= maxLimit)
            limit = edcrRequest.getLimit();
        if (edcrRequest.getLimit() != null && (edcrRequest.getLimit() > maxLimit || edcrRequest.getLimit() == -1)) {
            limit = maxLimit;
        }
        if (edcrRequest.getLimit() != null)
            offset = edcrRequest.getOffset();

        boolean isCentralIntsanceEnabled = environmentSettings.getProperty(IS_ENVIRONMENT_CENTRAL_INSTANCE, Boolean.class);
        if (isCentralIntsanceEnabled) {

            final Criteria criteria = getCurrentSession().createCriteria(EdcrApplicationDetail.class,
                    "edcrApplicationDetail");
            criteria.createAlias("edcrApplicationDetail.application", "application");
            if (edcrRequest != null && isNotBlank(edcrRequest.getEdcrNumber())) {
                criteria.add(Restrictions.eq("edcrApplicationDetail.dcrNumber", edcrRequest.getEdcrNumber()));
            }
            if (edcrRequest != null && isNotBlank(edcrRequest.getTransactionNumber())) {
                criteria.add(Restrictions.eq("application.transactionNumber", edcrRequest.getTransactionNumber()));
            }
            if (edcrRequest != null && isNotBlank(edcrRequest.getApplicationNumber())) {
                criteria.add(Restrictions.eq("application.applicationNumber", edcrRequest.getApplicationNumber()));
            }

            String appliactionType = edcrRequest.getAppliactionType();

            if (edcrRequest != null && isNotBlank(appliactionType)) {
                ApplicationType applicationType = null;
                if ("BUILDING_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.PERMIT;
                } else if ("BUILDING_OC_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                }
                if ("Permit".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.PERMIT;
                } else if ("Occupancy certificate".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                }
                criteria.add(Restrictions.eq("application.applicationType", applicationType));
            }

            if (edcrRequest != null && isNotBlank(edcrRequest.getApplicationSubType())) {
                criteria.add(Restrictions.eq("application.serviceType", edcrRequest.getApplicationSubType()));
            }

            if (edcrRequest != null && isNotBlank(edcrRequest.getTenantId())) {
                criteria.add(Restrictions.ilike("edcrApplicationDetail.tenantId", "%" + edcrRequest.getTenantId() + "%"));
            }

            if (onlyTenantId && userInfo != null && isNotBlank(userId)) {
                criteria.add(Restrictions.eq("application.thirdPartyUserCode", userId));
            }

            if (isNotBlank(edcrRequest.getStatus()))
                criteria.add(Restrictions.eq("edcrApplicationDetail.status", edcrRequest.getStatus()));
            if (edcrRequest.getFromDate() != null)
                criteria.add(Restrictions.ge("application.applicationDate", edcrRequest.getFromDate()));
            if (edcrRequest.getToDate() != null)
                criteria.add(Restrictions.le("application.applicationDate", edcrRequest.getToDate()));
            String orderBy = "desc";
            if (isNotBlank(edcrRequest.getOrderBy()))
                orderBy = edcrRequest.getOrderBy();
            if (orderBy.equalsIgnoreCase("asc"))
                criteria.addOrder(Order.asc("edcrApplicationDetail.createdDate"));
            else
                criteria.addOrder(Order.desc("edcrApplicationDetail.createdDate"));

            criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);
            criteria.setFirstResult(offset);
            criteria.setMaxResults(limit);
            edcrApplications = criteria.list();

        } else {
            if (edcrRequest != null && edcrRequest.getTenantId().equalsIgnoreCase(stateCity.getCode())) {
                final Map<String, String> params = new ConcurrentHashMap<>();

                StringBuilder queryStr = new StringBuilder();
                searchAtStateTenantLevel(edcrRequest, userInfo, userId, onlyTenantId, params, isStakeholder);
                final Query query = getCurrentSession().createSQLQuery(queryStr.toString()).setFirstResult(offset)
                        .setMaxResults(limit);
                LOG.info(queryStr.toString());

                for (final Map.Entry<String, String> param : params.entrySet())
                    query.setParameter(param.getKey(), param.getValue());
                List<Object[]> applns = query.list();
                if (applns.isEmpty()) {
                    EdcrDetail edcrDetail = new EdcrDetail();
                    edcrDetail.setErrors("No Record Found");
                    return Arrays.asList(edcrDetail);
                } else {
                    List<EdcrDetail> edcrDetails2 = new ArrayList<>();
                    for (Object[] appln : applns)
                        edcrDetails2.add(setEdcrResponseForAcrossTenants(appln, stateCity.getCode()));
                    List<EdcrDetail> sortedList = new ArrayList<>();
                    String orderBy = "desc";
                    if (isNotBlank(edcrRequest.getOrderBy()))
                        orderBy = edcrRequest.getOrderBy();
                    if (orderBy.equalsIgnoreCase("asc"))
                        sortedList = edcrDetails2.stream().sorted(Comparator.comparing(EdcrDetail::getApplicationDate))
                                .collect(Collectors.toList());
                    else
                        sortedList = edcrDetails2.stream().sorted(Comparator.comparing(EdcrDetail::getApplicationDate).reversed())
                                .collect(Collectors.toList());

                    LOG.info("The number of records = " + edcrDetails2.size());
                    return sortedList;
                }
            } else {
                final Criteria criteria = getCriteriaofSingleTenant(edcrRequest, userInfo, userId, onlyTenantId, isStakeholder);

                LOG.info(criteria.toString());
                criteria.setFirstResult(offset);
                criteria.setMaxResults(limit);
                edcrApplications = criteria.list();
            }
        }

            LOG.info("The number of records = " + edcrApplications.size());
            if (edcrApplications.isEmpty()) {
                EdcrDetail edcrDetail = new EdcrDetail();
                edcrDetail.setErrors("No Record Found");
                return Arrays.asList(edcrDetail);
            } else {
                return edcrDetailsResponse(edcrApplications, edcrRequest);
            }
    }

        public Integer fetchCount ( final EdcrRequest edcrRequest, final RequestInfoWrapper reqInfoWrapper){
            UserInfo userInfo = reqInfoWrapper.getRequestInfo() == null ? null
                    : reqInfoWrapper.getRequestInfo().getUserInfo();
            String userId = "";
            if (userInfo != null && StringUtils.isNoneBlank(userInfo.getUuid()))
                userId = userInfo.getUuid();
            else if (userInfo != null && StringUtils.isNoneBlank(userInfo.getId()))
                userId = userInfo.getId();

            // When the user is ANONYMOUS, then search application by edcrno or transaction
            // number
            if (userInfo != null && StringUtils.isNoneBlank(userId) && userInfo.getPrimaryrole() != null
                    && !userInfo.getPrimaryrole().isEmpty()) {
                List<String> roles = userInfo.getPrimaryrole().stream().map(Role::getCode).collect(Collectors.toList());
                LOG.info("****Roles***" + roles);
                if (roles.contains("ANONYMOUS"))
                    userId = "";
            }
            boolean onlyTenantId = edcrRequest != null && isBlank(edcrRequest.getEdcrNumber())
                    && isBlank(edcrRequest.getTransactionNumber()) && isBlank(edcrRequest.getAppliactionType())
                    && isBlank(edcrRequest.getApplicationSubType()) && isBlank(edcrRequest.getStatus())
                    && edcrRequest.getFromDate() == null && edcrRequest.getToDate() == null
                    && isBlank(edcrRequest.getApplicationNumber())
                    && isNotBlank(edcrRequest.getTenantId());

            boolean isStakeholder = edcrRequest != null && (isNotBlank(edcrRequest.getAppliactionType())
                    || isNotBlank(edcrRequest.getApplicationSubType()) || isNotBlank(edcrRequest.getStatus())
                    || edcrRequest.getFromDate() != null || edcrRequest.getToDate() != null);

            boolean isCentralIntsanceEnabled = environmentSettings.getProperty(IS_ENVIRONMENT_CENTRAL_INSTANCE, Boolean.class);
            if (isCentralIntsanceEnabled) {

                final Criteria criteria = getCurrentSession().createCriteria(EdcrApplicationDetail.class,
                        "edcrApplicationDetail");
                criteria.createAlias("edcrApplicationDetail.application", "application");
                if (edcrRequest != null && isNotBlank(edcrRequest.getEdcrNumber())) {
                    criteria.add(Restrictions.eq("edcrApplicationDetail.dcrNumber", edcrRequest.getEdcrNumber()));
                }
                if (edcrRequest != null && isNotBlank(edcrRequest.getTransactionNumber())) {
                    criteria.add(Restrictions.eq("application.transactionNumber", edcrRequest.getTransactionNumber()));
                }
                if (edcrRequest != null && isNotBlank(edcrRequest.getApplicationNumber())) {
                    criteria.add(Restrictions.eq("application.applicationNumber", edcrRequest.getApplicationNumber()));
                }

                String appliactionType = edcrRequest.getAppliactionType();

                if (edcrRequest != null && isNotBlank(appliactionType)) {
                    ApplicationType applicationType = null;
                    if ("BUILDING_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                        applicationType = ApplicationType.PERMIT;
                    } else if ("BUILDING_OC_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                        applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                    }
                    if ("Permit".equalsIgnoreCase(appliactionType)) {
                        applicationType = ApplicationType.PERMIT;
                    } else if ("Occupancy certificate".equalsIgnoreCase(appliactionType)) {
                        applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                    }
                    criteria.add(Restrictions.eq("application.applicationType", applicationType));
                }

                if (edcrRequest != null && isNotBlank(edcrRequest.getApplicationSubType())) {
                    criteria.add(Restrictions.eq("application.serviceType", edcrRequest.getApplicationSubType()));
                }

                if (edcrRequest != null && isNotBlank(edcrRequest.getTenantId())) {
                    criteria.add(Restrictions.ilike("edcrApplicationDetail.tenantId", "%" + edcrRequest.getTenantId() + "%"));
                }

                if (onlyTenantId && userInfo != null && isNotBlank(userId)) {
                    criteria.add(Restrictions.eq("application.thirdPartyUserCode", userId));
                }

                if (isNotBlank(edcrRequest.getStatus()))
                    criteria.add(Restrictions.eq("edcrApplicationDetail.status", edcrRequest.getStatus()));
                if (edcrRequest.getFromDate() != null)
                    criteria.add(Restrictions.ge("application.applicationDate", edcrRequest.getFromDate()));
                if (edcrRequest.getToDate() != null)
                    criteria.add(Restrictions.le("application.applicationDate", edcrRequest.getToDate()));
                String orderBy = "desc";
                if (isNotBlank(edcrRequest.getOrderBy()))
                    orderBy = edcrRequest.getOrderBy();
                if (orderBy.equalsIgnoreCase("asc"))
                    criteria.addOrder(Order.asc("edcrApplicationDetail.createdDate"));
                else
                    criteria.addOrder(Order.desc("edcrApplicationDetail.createdDate"));

                criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);
                return criteria.list().size();
            } else {
                City stateCity = cityService.fetchStateCityDetails();
                if (edcrRequest != null && edcrRequest.getTenantId().equalsIgnoreCase(stateCity.getCode())) {
                    final Map<String, String> params = new ConcurrentHashMap<>();

                    StringBuilder queryStr = new StringBuilder();
                    searchAtStateTenantLevel(edcrRequest, userInfo, userId, onlyTenantId, params, isStakeholder);

                    String queryString = searchAtStateTenantLevel(edcrRequest, userInfo, userId, onlyTenantId, params, isStakeholder);

                    final Query query = getCurrentSession().createSQLQuery(queryString);
                    for (final Map.Entry<String, String> param : params.entrySet())
                        query.setParameter(param.getKey(), param.getValue());
                    return query.list().size();
                } else {
                    final Criteria criteria = getCriteriaofSingleTenant(edcrRequest, userInfo, userId, onlyTenantId, isStakeholder);
                    return criteria.list().size();
                }
            }
        }


        private String searchAtStateTenantLevel ( final EdcrRequest edcrRequest, UserInfo userInfo, String userId,
        boolean onlyTenantId,
        final Map<String, String> params, boolean isStakeholder){
            StringBuilder queryStr = new StringBuilder();
            Map<String, String> tenants = tenantUtils.tenantsMap();
            Iterator<Map.Entry<String, String>> tenantItr = tenants.entrySet().iterator();
            String orderByWrapperDesc = "select * from ({}) as result order by result.applicationDate desc";
            String orderByWrapperAsc = "select * from ({}) as result order by result.applicationDate asc";
            while (tenantItr.hasNext()) {
                Map.Entry<String, String> value = tenantItr.next();
                queryStr.append("(select '")
                        .append(value.getKey())
                        .append("' as tenantId,appln.transactionNumber,dtl.dcrNumber,dtl.status,appln.applicantName,dxf.fileStoreId as dxfFileId,scrudxf.fileStoreId as scrutinizedDxfFileId,rofile.fileStoreId as reportOutputId,pdfile.fileStoreId as planDetailFileStore,appln.applicationDate,appln.applicationNumber,appln.applicationType,appln.serviceType,appln.planPermitNumber,appln.permitApplicationDate from ")
                        .append(value.getKey())
                        .append(".edcr_application appln, ")
                        .append(value.getKey())
                        .append(".edcr_application_detail dtl, ")
                        .append(value.getKey())
                        .append(".eg_filestoremap dxf, ")
                        .append(value.getKey())
                        .append(".eg_filestoremap scrudxf, ")
                        .append(value.getKey())
                        .append(".eg_filestoremap rofile, ")
                        .append(value.getKey())
                        .append(".eg_filestoremap pdfile ")
                        .append("where appln.id = dtl.application and dtl.dxfFileId=dxf.id and dtl.scrutinizedDxfFileId=scrudxf.id and dtl.reportOutputId=rofile.id and dtl.planDetailFileStore=pdfile.id ");

                if (isNotBlank(edcrRequest.getEdcrNumber())) {
                    queryStr.append("and dtl.dcrNumber=:dcrNumber ");
                    params.put("dcrNumber", edcrRequest.getEdcrNumber());
                }

                if (isNotBlank(edcrRequest.getTransactionNumber())) {
                    queryStr.append("and appln.transactionNumber=:transactionNumber ");
                    params.put("transactionNumber", edcrRequest.getTransactionNumber());
                }

                if (isNotBlank(edcrRequest.getApplicationNumber())) {
                    queryStr.append("and appln.applicationNumber=:applicationNumber ");
                    params.put("applicationNumber", edcrRequest.getApplicationNumber());
                }

                if ((onlyTenantId || isStakeholder) && userInfo != null && isNotBlank(userId)) {
                    queryStr.append("and appln.thirdPartyUserCode=:thirdPartyUserCode ");
                    params.put("thirdPartyUserCode", userId);
                }

                String appliactionType = edcrRequest.getAppliactionType();
                if (isNotBlank(appliactionType)) {
                    ApplicationType applicationType = null;
                    if ("BUILDING_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                        applicationType = ApplicationType.PERMIT;
                    } else if ("BUILDING_OC_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                        applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                    } else if ("Occupancy certificate".equalsIgnoreCase(appliactionType)) {
                        applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                    } else {
                        applicationType = ApplicationType.PERMIT;
                    }
                    queryStr.append("and appln.applicationType=:applicationtype ");
                    params.put("applicationtype", applicationType.toString());
                }

                if (isNotBlank(edcrRequest.getApplicationSubType())) {
                    queryStr.append("and appln.serviceType=:servicetype ");
                    params.put("servicetype", edcrRequest.getApplicationSubType());
                }

                if (isNotBlank(edcrRequest.getStatus())) {
                    queryStr.append("and dtl.status=:status ");
                    params.put("status", edcrRequest.getStatus());
                }

                if (edcrRequest.getFromDate() != null) {
                    queryStr.append("and appln.applicationDate>=to_timestamp(:fromDate, 'yyyy-MM-dd')");
                    params.put("fromDate", sf.format(resetFromDateTimeStamp(edcrRequest.getFromDate())));
                }

                if (edcrRequest.getToDate() != null) {
                    queryStr.append("and appln.applicationDate<=to_timestamp(:toDate ,'yyyy-MM-dd')");
                    params.put("toDate", sf.format(resetToDateTimeStamp(edcrRequest.getToDate())));
                }
                String orderBy = "desc";
                if (isNotBlank(edcrRequest.getOrderBy()))
                    orderBy = edcrRequest.getOrderBy();
                if (orderBy.equalsIgnoreCase("asc"))
                    queryStr.append(" order by appln.createddate asc)");
                else
                    queryStr.append(" order by appln.createddate desc)");
                if (tenantItr.hasNext()) {
                    queryStr.append(" union ");
                }
            }
            String query;
            String orderBy = "desc";
            if (isNotBlank(edcrRequest.getOrderBy()))
                orderBy = edcrRequest.getOrderBy();
            if (orderBy.equalsIgnoreCase("asc"))
                query = orderByWrapperAsc.replace("{}", queryStr);
            else
                query = orderByWrapperDesc.replace("{}", queryStr);
            return query;
        }

        private Criteria getCriteriaofSingleTenant ( final EdcrRequest edcrRequest, UserInfo userInfo, String userId,
        boolean onlyTenantId, boolean isStakeholder){
            final Criteria criteria = getCurrentSession().createCriteria(EdcrApplicationDetail.class,
                    "edcrApplicationDetail");
            criteria.createAlias("edcrApplicationDetail.application", "application");
            if (edcrRequest != null && isNotBlank(edcrRequest.getEdcrNumber())) {
                criteria.add(Restrictions.eq("edcrApplicationDetail.dcrNumber", edcrRequest.getEdcrNumber()));
            }
            if (edcrRequest != null && isNotBlank(edcrRequest.getTransactionNumber())) {
                criteria.add(Restrictions.eq("application.transactionNumber", edcrRequest.getTransactionNumber()));
            }
            if (edcrRequest != null && isNotBlank(edcrRequest.getApplicationNumber())) {
                criteria.add(Restrictions.eq("application.applicationNumber", edcrRequest.getApplicationNumber()));
            }

            String appliactionType = edcrRequest.getAppliactionType();

            if (edcrRequest != null && isNotBlank(appliactionType)) {
                ApplicationType applicationType = null;
                if ("BUILDING_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.PERMIT;
                } else if ("BUILDING_OC_PLAN_SCRUTINY".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                }
                if ("Permit".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.PERMIT;
                } else if ("Occupancy certificate".equalsIgnoreCase(appliactionType)) {
                    applicationType = ApplicationType.OCCUPANCY_CERTIFICATE;
                }
                criteria.add(Restrictions.eq("application.applicationType", applicationType));
            }

            if (edcrRequest != null && isNotBlank(edcrRequest.getApplicationSubType())) {
                criteria.add(Restrictions.eq("application.serviceType", edcrRequest.getApplicationSubType()));
            }

            if ((onlyTenantId || isStakeholder) && userInfo != null && isNotBlank(userId)) {
                criteria.add(Restrictions.eq("application.thirdPartyUserCode", userId));
            }

            if (isNotBlank(edcrRequest.getStatus()))
                criteria.add(Restrictions.eq("edcrApplicationDetail.status", edcrRequest.getStatus()));
            if (edcrRequest.getFromDate() != null)
                criteria.add(Restrictions.ge("application.applicationDate", edcrRequest.getFromDate()));
            if (edcrRequest.getToDate() != null)
                criteria.add(Restrictions.le("application.applicationDate", edcrRequest.getToDate()));
            String orderBy = "desc";
            if (isNotBlank(edcrRequest.getOrderBy()))
                orderBy = edcrRequest.getOrderBy();
            if (orderBy.equalsIgnoreCase("asc"))
                criteria.addOrder(Order.asc("edcrApplicationDetail.createdDate"));
            else
                criteria.addOrder(Order.desc("edcrApplicationDetail.createdDate"));

            criteria.setResultTransformer(CriteriaSpecification.DISTINCT_ROOT_ENTITY);
            return criteria;
        }

        public ErrorDetail validatePlanFile ( final MultipartFile file){
            List<String> dcrAllowedExtenstions = new ArrayList<>(
                    Arrays.asList(edcrApplicationSettings.getValue("dcr.dxf.allowed.extenstions").split(",")));

            String fileSize = edcrApplicationSettings.getValue("dcr.dxf.max.size");
            final String maxAllowSizeInMB = fileSize;
            String extension;
            if (file != null && !file.isEmpty()) {
                extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1);
                if (extension != null && !extension.isEmpty()) {

                    if (!dcrAllowedExtenstions.contains(extension.toLowerCase())) {
                        return new ErrorDetail("BPA-02", "Please upload " + dcrAllowedExtenstions + " format file only");
                    } else if (file.getSize() > (Long.valueOf(maxAllowSizeInMB) * 1024 * 1024)) {
                        return new ErrorDetail("BPA-04", "File size should not exceed 30 MB");
                    } /*
                     * else if (allowedExtenstions.contains(extension.toLowerCase()) && (!mimeTypes.contains(mimeType) ||
                     * StringUtils.countMatches(file.getOriginalFilename(), ".") > 1 || file.getOriginalFilename().contains("%00")))
                     * { return new ErrorDetail("BPA-03", "Malicious file upload"); }
                     */
                }
            } else {
                return new ErrorDetail(BPA_05, "Please upload plan file, It is mandatory");
            }

            return null;
        }

        public ErrorDetail validateEdcrRequest ( final EdcrRequest edcrRequest, final MultipartFile planFile){
            if (edcrRequest.getRequestInfo() == null)
                return new ErrorDetail(BPA_07, REQ_BODY_REQUIRED);
            else if (edcrRequest.getRequestInfo().getUserInfo() == null
                    || (edcrRequest.getRequestInfo().getUserInfo() != null
                    && isBlank(edcrRequest.getRequestInfo().getUserInfo().getUuid())))
                return new ErrorDetail(BPA_07, USER_ID_IS_MANDATORY);

            if (isBlank(edcrRequest.getTransactionNumber()))
                return new ErrorDetail(BPA_07, "Please enter transaction number");
            if (isNotBlank(edcrRequest.getTransactionNumber())
                    && edcrApplicationService.findByTransactionNumber(edcrRequest.getTransactionNumber()) != null) {
                return new ErrorDetail(BPA_01, MSG_UNQ_TRANSACTION_NUMBER);
            }

            return validatePlanFile(planFile);
        }

        public ErrorDetail validateEdcrOcRequest ( final EdcrRequest edcrRequest, final MultipartFile planFile){
            if (edcrRequest.getRequestInfo() == null)
                return new ErrorDetail(BPA_07, REQ_BODY_REQUIRED);
            else if (edcrRequest.getRequestInfo().getUserInfo() == null
                    || (edcrRequest.getRequestInfo().getUserInfo() != null
                    && isBlank(edcrRequest.getRequestInfo().getUserInfo().getUuid())))
                return new ErrorDetail(BPA_07, USER_ID_IS_MANDATORY);

            if (isBlank(edcrRequest.getTransactionNumber()))
                return new ErrorDetail(BPA_07, "Transaction number is mandatory");

            if (null == edcrRequest.getPermitDate())
                return new ErrorDetail("BPA-08", "Permit Date is mandatory");
            if (isNotBlank(edcrRequest.getTransactionNumber())
                    && edcrApplicationService.findByTransactionNumber(edcrRequest.getTransactionNumber()) != null) {
                return new ErrorDetail(BPA_01, MSG_UNQ_TRANSACTION_NUMBER);

            }

            return validatePlanFile(planFile);
        }

        public List<ErrorDetail> validateScrutinizeOcRequest ( final EdcrRequest edcrRequest,
        final MultipartFile planFile){
            List<ErrorDetail> errorDetails = new ArrayList<>();

            if (edcrRequest.getRequestInfo() == null)
                errorDetails.add(new ErrorDetail(BPA_07, REQ_BODY_REQUIRED));
            else if (edcrRequest.getRequestInfo().getUserInfo() == null
                    || (edcrRequest.getRequestInfo().getUserInfo() != null
                    && isBlank(edcrRequest.getRequestInfo().getUserInfo().getUuid())))
                errorDetails.add(new ErrorDetail("BPA-08", USER_ID_IS_MANDATORY));

            if (isBlank(edcrRequest.getTransactionNumber()))
                errorDetails.add(new ErrorDetail("BPA-09", "Transaction number is mandatory"));

            if (null == edcrRequest.getPermitDate())
                errorDetails.add(new ErrorDetail("BPA-10", "Permit Date is mandatory"));
            if (isNotBlank(edcrRequest.getTransactionNumber())
                    && edcrApplicationService.findByTransactionNumber(edcrRequest.getTransactionNumber()) != null) {
                errorDetails.add(new ErrorDetail("BPA-11", MSG_UNQ_TRANSACTION_NUMBER));

            }

            String dcrNo = edcrRequest.getComparisonEdcrNumber();
            if (StringUtils.isBlank(dcrNo)) {
                errorDetails.add(new ErrorDetail("BPA-29", "Comparison eDcr number is mandatory"));
            } else {
                EdcrApplicationDetail permitDcr = applicationDetailService.findByDcrNumberAndTPUserTenant(dcrNo,
                        edcrRequest.getTenantId());

                if (permitDcr != null && permitDcr.getApplication() != null
                        && StringUtils.isBlank(permitDcr.getApplication().getServiceType())) {
                    errorDetails.add(new ErrorDetail("BPA-26", "No service type found for dcr number " + dcrNo));
                }

                if (permitDcr == null) {
                    errorDetails.add(new ErrorDetail("BPA-24", "No record found with dcr number " + dcrNo));
                }

                if (permitDcr != null && permitDcr.getApplication() != null && edcrRequest.getAppliactionType()
                        .equalsIgnoreCase(permitDcr.getApplication().getApplicationType().toString())) {
                    errorDetails.add(new ErrorDetail("BPA-27", "Application types are same"));
                }

                if (permitDcr != null && permitDcr.getApplication() != null && !edcrRequest.getApplicationSubType()
                        .equalsIgnoreCase(permitDcr.getApplication().getServiceType())) {
                    errorDetails.add(new ErrorDetail("BPA-28", "Service types are not mathing"));
                }
            }

            ErrorDetail validatePlanFile = validatePlanFile(planFile);
            if (validatePlanFile != null)
                errorDetails.add(validatePlanFile);

            return errorDetails;
        }

        public List<ErrorDetail> validateEdcrMandatoryFields ( final EdcrRequest edcrRequest){
            List<ErrorDetail> errors = new ArrayList<>();
            if (StringUtils.isBlank(edcrRequest.getAppliactionType())) {
                errors.add(new ErrorDetail("BPA-10", "Application type is missing"));
            }

            if (StringUtils.isBlank(edcrRequest.getApplicationSubType())) {
                errors.add(new ErrorDetail("BPA-11", "Service type is missing"));
            }

            return errors;
        }

        public ErrorDetail validateSearchRequest ( final String edcrNumber, final String transactionNumber){
            ErrorDetail errorDetail = null;
            if (isBlank(edcrNumber) && isBlank(transactionNumber))
                return new ErrorDetail(BPA_07, "Please enter valid edcr number or transaction number");
            return errorDetail;
        }

        /*
         * public String getMimeType(final MultipartFile file) { MimeUtil.registerMimeDetector(
         * "eu.medsea.mimeutil.detector.MagicMimeMimeDetector"); eu.medsea.mimeutil.MimeType mimeType = null; try { mimeType =
         * MimeUtil.getMostSpecificMimeType(MimeUtil.getMimeTypes(file.getInputStream()) ); } catch (MimeException | IOException e) {
         * LOG.error(e); } MimeUtil.unregisterMimeDetector( "eu.medsea.mimeutil.detector.MagicMimeMimeDetector"); return
         * String.valueOf(mimeType); }
         */

        @SuppressWarnings("unused")
        public ErrorDetail validateParam (List < String > allowedExtenstions, List < String > mimeTypes, MultipartFile
        file,
        final String maxAllowSizeInMB){
            String extension;
            String mimeType;
            if (file != null && !file.isEmpty()) {
                extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1);
                if (extension != null && !extension.isEmpty()) {
                    // mimeType = getMimeType(file);
                    if (!allowedExtenstions.contains(extension.toLowerCase())) {
                        return new ErrorDetail("BPA-02", "Please upload " + allowedExtenstions + " format file only");
                    } else if (file.getSize() > (Long.valueOf(maxAllowSizeInMB) * 1024 * 1024)) {
                        return new ErrorDetail("BPA-04", "File size should not exceed 30 MB");
                    } /*
                     * else if (allowedExtenstions.contains(extension.toLowerCase()) && (!mimeTypes.contains(mimeType) ||
                     * StringUtils.countMatches(file.getOriginalFilename(), ".") > 1 || file.getOriginalFilename().contains("%00")))
                     * { return new ErrorDetail("BPA-03", "Malicious file upload"); }
                     */
                }
            } else {
                return new ErrorDetail(BPA_05, "Please, upload plan file is mandatory");
            }

            return null;
        }

        public ResponseInfo createResponseInfoFromRequestInfo (RequestInfo requestInfo, Boolean success){
            String apiId = null;
            String ver = null;
            String ts = null;
            String resMsgId = "";
            String msgId = null;
            if (requestInfo != null) {
                apiId = requestInfo.getApiId();
                ver = requestInfo.getVer();
                if (requestInfo.getTs() != null)
                    ts = requestInfo.getTs().toString();
                msgId = requestInfo.getMsgId();
            }
            String responseStatus = success ? "successful" : "failed";

            return new ResponseInfo(apiId, ver, ts, resMsgId, msgId, responseStatus);
        }

        public String getFileDownloadUrl ( final String fileStoreId, final String tenantId){
            return String.format(FILE_DOWNLOAD_URL, ApplicationThreadLocals.getDomainURL()) + "?tenantId=" + tenantId
                    + "&fileStoreId=" + fileStoreId;
        }

        public Date resetFromDateTimeStamp ( final Date date){
            final Calendar cal1 = Calendar.getInstance();
            cal1.setTime(date);
            cal1.set(Calendar.HOUR_OF_DAY, 0);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            cal1.set(Calendar.MILLISECOND, 0);
            return cal1.getTime();
        }

        public Date resetToDateTimeStamp ( final Date date){
            final Calendar cal1 = Calendar.getInstance();
            cal1.setTime(date);
            cal1.set(Calendar.HOUR_OF_DAY, 23);
            cal1.set(Calendar.MINUTE, 59);
            cal1.set(Calendar.SECOND, 59);
            cal1.set(Calendar.MILLISECOND, 999);
            return cal1.getTime();
        }

}