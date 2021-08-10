package org.egov.edcr.service;

import static org.egov.edcr.utility.DcrConstants.FILESTORE_MODULECODE;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Plan;
import org.egov.edcr.entity.ApplicationType;
import org.egov.edcr.entity.EdcrApplication;
import org.egov.edcr.entity.EdcrApplicationDetail;
import org.egov.edcr.entity.SearchBuildingPlanScrutinyForm;
import org.egov.edcr.repository.EdcrApplicationDetailRepository;
import org.egov.edcr.repository.EdcrApplicationRepository;
import org.egov.edcr.service.es.EdcrIndexService;
import org.egov.infra.config.persistence.datasource.routing.annotation.ReadOnly;
import org.egov.infra.filestore.entity.FileStoreMapper;
import org.egov.infra.filestore.service.FileStoreService;
import org.egov.infra.security.utils.SecurityUtils;
import org.egov.infra.utils.ApplicationNumberGenerator;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional(readOnly = true)
public class EdcrApplicationService {
    private static final String RESUBMIT_SCRTNY = "Resubmit Plan Scrutiny";
    private static final String NEW_SCRTNY = "New Plan Scrutiny";
    public static final String ULB_NAME = "ulbName";
    public static final String ABORTED = "Aborted";
    private static Logger LOG = Logger.getLogger(EdcrApplicationService.class);
    @Autowired
    protected SecurityUtils securityUtils;

    @Autowired
    private EdcrApplicationRepository edcrApplicationRepository;

    @Autowired
    private EdcrApplicationDetailRepository edcrApplicationDetailRepository;

    @Autowired
    private PlanService planService;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private FileStoreService fileStoreService;

    @Autowired
    private ApplicationNumberGenerator applicationNumberGenerator;

    @Autowired
    private EdcrIndexService edcrIndexService;

    @Autowired
    private EdcrApplicationDetailService edcrApplicationDetailService;

    public Session getCurrentSession() {
        return entityManager.unwrap(Session.class);
    }

    @Transactional
    public EdcrApplication create(final EdcrApplication edcrApplication) {

        // edcrApplication.setApplicationDate(new Date("01/01/2020"));
        edcrApplication.setApplicationDate(new Date());
        edcrApplication.setApplicationNumber(applicationNumberGenerator.generate());
        edcrApplication.setSavedDxfFile(saveDXF(edcrApplication));
        edcrApplication.setStatus(ABORTED);

        edcrApplicationRepository.save(edcrApplication);

        edcrIndexService.updateIndexes(edcrApplication, NEW_SCRTNY);

        callDcrProcess(edcrApplication, NEW_SCRTNY);
        edcrIndexService.updateIndexes(edcrApplication, NEW_SCRTNY);

        return edcrApplication;
    }

    @Transactional
    public EdcrApplication update(final EdcrApplication edcrApplication) {
        edcrApplication.setSavedDxfFile(saveDXF(edcrApplication));
        edcrApplication.setStatus(ABORTED);
        Plan unsavedPlanDetail = edcrApplication.getEdcrApplicationDetails().get(0).getPlan();
        EdcrApplication applicationRes = edcrApplicationRepository.save(edcrApplication);
        edcrApplication.getEdcrApplicationDetails().get(0).setPlan(unsavedPlanDetail);

        edcrIndexService.updateIndexes(edcrApplication, RESUBMIT_SCRTNY);

        callDcrProcess(edcrApplication, RESUBMIT_SCRTNY);

        return applicationRes;
    }

    private Plan callDcrProcess(EdcrApplication edcrApplication, String applicationType) {
        Plan planDetail = new Plan();
        planDetail = planService.process(edcrApplication, applicationType);
        updateFile(planDetail, edcrApplication);
        edcrApplicationDetailService.saveAll(edcrApplication.getEdcrApplicationDetails());

        return planDetail;
    }

    private File saveDXF(EdcrApplication edcrApplication) {
        FileStoreMapper fileStoreMapper = addToFileStore(edcrApplication.getDxfFile());
        File dxfFile = fileStoreService.fetch(fileStoreMapper.getFileStoreId(), FILESTORE_MODULECODE);
        planService.buildDocuments(edcrApplication, fileStoreMapper, null, null);
        List<EdcrApplicationDetail> edcrApplicationDetails = edcrApplication.getEdcrApplicationDetails();
        edcrApplicationDetails.get(0).setStatus(ABORTED);
        edcrApplication.setEdcrApplicationDetails(edcrApplicationDetails);
        return dxfFile;

    }

    public File savePlanDXF(final MultipartFile file) {
        FileStoreMapper fileStoreMapper = addToFileStore(file);
        return fileStoreService.fetch(fileStoreMapper.getFileStoreId(), FILESTORE_MODULECODE);
    }

    private FileStoreMapper addToFileStore(final MultipartFile file) {
        FileStoreMapper fileStoreMapper = null;
        try {
            fileStoreMapper = fileStoreService.store(file.getInputStream(), file.getOriginalFilename(),
                    file.getContentType(), FILESTORE_MODULECODE);
        } catch (final IOException e) {
            LOG.error("Error occurred, while getting input stream!!!!!", e);
        }
        return fileStoreMapper;
    }

    public List<EdcrApplication> findAll() {
        return edcrApplicationRepository.findAll(new Sort(Sort.Direction.ASC, "name"));
    }

    public EdcrApplication findOne(Long id) {
        return edcrApplicationRepository.findOne(id);
    }

    public EdcrApplication findByApplicationNo(String appNo) {
        return edcrApplicationRepository.findByApplicationNumber(appNo);
    }

    public EdcrApplication findByApplicationNoAndType(String applnNo, ApplicationType type) {
        return edcrApplicationRepository.findByApplicationNumberAndApplicationType(applnNo, type);
    }

    public EdcrApplication findByPlanPermitNumber(String permitNo) {
        return edcrApplicationRepository.findByPlanPermitNumber(permitNo);
    }

    public EdcrApplication findByTransactionNumber(String transactionNo) {
        return edcrApplicationRepository.findByTransactionNumber(transactionNo);
    }

    public EdcrApplication findByTransactionNumberAndTPUserCode(String transactionNo, String userCode) {
        return edcrApplicationRepository.findByTransactionNumberAndThirdPartyUserCode(transactionNo, userCode);
    }

    public List<EdcrApplication> search(EdcrApplication edcrApplication) {
        return edcrApplicationRepository.findAll();
    }

    public List<EdcrApplication> findByThirdPartyUserCode(String userCode) {
        return edcrApplicationRepository.findByThirdPartyUserCode(userCode);
    }

    public List<EdcrApplication> getEdcrApplications() {
        Pageable pageable = new PageRequest(0, 25, Sort.Direction.DESC, "id");
        Page<EdcrApplication> edcrApplications = edcrApplicationRepository.findAll(pageable);
        return edcrApplications.getContent();
    }

    @ReadOnly
    public Page<SearchBuildingPlanScrutinyForm> planScrutinyPagedSearch(SearchBuildingPlanScrutinyForm searchRequest) {
        final Pageable pageable = new PageRequest(searchRequest.pageNumber(), searchRequest.pageSize(),
                searchRequest.orderDir(), searchRequest.orderBy());
        List<SearchBuildingPlanScrutinyForm> searchResults = new ArrayList<>();
        Page<EdcrApplicationDetail> dcrApplications = edcrApplicationDetailRepository
                .findAll(DcrReportSearchSpec.searchReportsSpecification(searchRequest), pageable);
        for (EdcrApplicationDetail applicationDetail : dcrApplications)
            searchResults.add(buildResponseAsPerForm(applicationDetail));
        return new PageImpl<>(searchResults, pageable, dcrApplications.getTotalElements());
    }

    private SearchBuildingPlanScrutinyForm buildResponseAsPerForm(EdcrApplicationDetail applicationDetail) {
        SearchBuildingPlanScrutinyForm planScrtnyFrm = new SearchBuildingPlanScrutinyForm();
        EdcrApplication application = applicationDetail.getApplication();
        planScrtnyFrm.setApplicationNumber(application.getApplicationNumber());
        planScrtnyFrm.setApplicationDate(application.getApplicationDate());
        planScrtnyFrm.setApplicantName(application.getApplicantName());
        planScrtnyFrm.setBuildingPlanScrutinyNumber(applicationDetail.getDcrNumber());
        planScrtnyFrm.setUploadedDateAndTime(applicationDetail.getCreatedDate());
        if (applicationDetail.getDxfFileId() != null)
            planScrtnyFrm.setDxfFileStoreId(applicationDetail.getDxfFileId().getFileStoreId());
        if (applicationDetail.getDxfFileId() != null)
            planScrtnyFrm.setDxfFileName(applicationDetail.getDxfFileId().getFileName());
        if (applicationDetail.getReportOutputId() != null)
            planScrtnyFrm.setReportOutputFileStoreId(applicationDetail.getReportOutputId().getFileStoreId());
        if (applicationDetail.getReportOutputId() != null)
            planScrtnyFrm.setReportOutputFileName(applicationDetail.getReportOutputId().getFileName());
        planScrtnyFrm.setStakeHolderId(application.getCreatedBy().getId());
        planScrtnyFrm.setStatus(applicationDetail.getStatus());
        planScrtnyFrm.setBuildingLicenceeName(application.getCreatedBy().getName());
        return planScrtnyFrm;
    }

    private static String readFile(File srcFile) {
        String fileAsString = null;
        try {
            String canonicalPath = srcFile.getCanonicalPath();
            if (!canonicalPath.equals(srcFile.getPath()))
                throw new FileNotFoundException("Invalid file path, please try again.");
        } catch (IOException e) {
            LOG.error("Invalid file path, please try again.", e);
        }
        try (InputStream is = new FileInputStream(srcFile);
                BufferedReader br = new BufferedReader(new InputStreamReader(is))) {
            String line = br.readLine();
            StringBuilder sb = new StringBuilder();
            while (line != null) {
                sb.append(line).append("\n");
                line = br.readLine();
            }
            fileAsString = sb.toString();
        } catch (IOException e) {
            LOG.error("Error occurred when reading file!!!!!", e);
        }
        return fileAsString;
    }

    private void updateFile(Plan pl, EdcrApplication edcrApplication) {
        String readFile = readFile(edcrApplication.getSavedDxfFile());
        String replace = readFile.replace("ENTITIES", "ENTITIES\n0\n" + pl.getAdditionsToDxf());
        String newFile = edcrApplication.getDxfFile().getOriginalFilename().replace(".dxf", "_system_scrutinized.dxf");
        File f = new File(newFile);
        try (FileOutputStream fos = new FileOutputStream(f)) {
            if (!f.exists())
                f.createNewFile();
            fos.write(replace.getBytes());
            fos.flush();
            FileStoreMapper fileStoreMapper = fileStoreService.store(f, f.getName(),
                    edcrApplication.getDxfFile().getContentType(), FILESTORE_MODULECODE);
            edcrApplication.getEdcrApplicationDetails().get(0).setScrutinizedDxfFileId(fileStoreMapper);
        } catch (IOException e) {
            LOG.error("Error occurred when reading file!!!!!", e);
        }
    }

    @Transactional
    public EdcrApplication createRestEdcr(final EdcrApplication edcrApplication) {
        String comparisonDcrNo = edcrApplication.getEdcrApplicationDetails().get(0).getComparisonDcrNumber();
        if (edcrApplication.getApplicationDate() == null)
            edcrApplication.setApplicationDate(new Date());
        edcrApplication.setApplicationNumber(applicationNumberGenerator.generate());
        edcrApplication.setSavedDxfFile(saveDXF(edcrApplication));
        edcrApplication.setStatus(ABORTED);
        edcrApplicationRepository.save(edcrApplication);
        edcrApplication.getEdcrApplicationDetails().get(0).setComparisonDcrNumber(comparisonDcrNo);
        callDcrProcess(edcrApplication, NEW_SCRTNY);
        edcrIndexService.updateEdcrRestIndexes(edcrApplication, NEW_SCRTNY);
        return edcrApplication;
    }
}