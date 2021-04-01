package org.egov.dataupload.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.DataUploadApplicationRunnerImpl;
import org.egov.dataupload.model.*;
import org.egov.dataupload.producer.DataUploadProducer;
import org.egov.dataupload.repository.DataUploadRepository;
import org.egov.dataupload.repository.UploadRegistryRepository;
import org.egov.dataupload.utils.DataUploadUtils;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class DataUploadServiceImpl {
    @Autowired
    private DataUploadRepository dataUploadRepository;

    @Autowired
    private UploadRegistryRepository uploadRegistryRepository;

    @Autowired
    private DataUploadApplicationRunnerImpl runner;

    @Autowired
    private DataUploadUtils dataUploadUtils;

    @Autowired
    private DataUploadProducer dataUploadProducer;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FileIO excelIO;

    @Value("${filestore.host}")
    private String fileStoreHost;

    @Value("${filestore.get.endpoint}")
    private String getFileEndpoint;

    @Value("${response.file.name.prefix}")
    private String resFilePrefix;

    @Value("${template.download.prefix}")
    private String templateFilePrefix;

    private static final Logger logger = LoggerFactory.getLogger(DataUploadServiceImpl.class);

    public List<UploadJob> createUploadJob(UploaderRequest uploaderRequest) {
        UploadJob uploadJob = uploaderRequest.getUploadJobs().get(0);

        validateJob(uploadJob);

        StringBuilder uri = new StringBuilder();
        uri.append(fileStoreHost).append(getFileEndpoint).append("?fileStoreId=").append(uploadJob
                .getRequestFilePath()).append("&tenantId=").append(uploadJob.getTenantId());
        try {
            String filePath = dataUploadRepository.getFileContents(uri.toString(), uploaderRequest.getUploadJobs()
                    .get(0).getRequestFileName());

            uploadJob.setCode(dataUploadUtils.mockIdGen(uploadJob.getModuleName(), uploadJob.getDefName()));
            uploadJob.setRequesterName(uploaderRequest.getRequestInfo().getUserInfo().getUserName());
            uploadRegistryRepository.createJob(uploaderRequest);

            uploadJob.setLocalFilePath(filePath);
            dataUploadProducer.producer(uploaderRequest);

            return uploaderRequest.getUploadJobs();
        } catch (IOException ioe) {
            throw new CustomException("400", "Unable to create or write file");
        } catch (RestClientException re) {
            logger.error("No .xls/.xlsx file found for: fileStoreId = " + uploadJob.getRequestFilePath()
                    + " AND tenantId = " + uploadJob.getTenantId());
            throw new CustomException("400", "Unable to fetch file from filestore");
        } catch (DataAccessException de) {
            logger.error("Unable to persist job details onto DB", de);
            throw new CustomException("400", "Unable to persist job details onto DB");
        } catch (Exception e) {
            logger.error("Error occurred while attempting to create job", e);
            throw new CustomException("UNKNOWN_ERROR_OCCURRED", "UNKNOWN Error Occured");
        }


    }

    private void validateJob(UploadJob uploadJob) {
        if (Objects.isNull(uploadJob.getRequestFileName())) {
            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
                    "Please provide the requestFileName.");
        }

        Optional<Definition> definitionOptional = runner.getUploadDefinition(uploadJob.getModuleName(), uploadJob.getDefName());
        if (!definitionOptional.isPresent()) {
            logger.error("There's no Upload Definition provided for this upload feature");
            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
                    "There's no Upload Definition provided for this upload feature");
        }

        Definition uploadDefinition = definitionOptional.get();

        if (null != uploadDefinition.getIsParentChild() && uploadDefinition.getIsParentChild()) {
            if (null == uploadDefinition.getUniqueParentKeys() || uploadDefinition.getUniqueParentKeys().isEmpty()) {
                logger.error("Parent child relation is true, but there are no unique parent keys defined.");
                throw new CustomException("NO_UNIQUE_PARENT_KEYS",
                        "Parent child relation is true, but there are no unique parent keys defined.");
            }
        }

    }

    public void processExcel(UploaderRequest uploaderRequest) {
//        if (runner.getUploadDefinitionMap() == null || runner.getUploadDefinitionMap().isEmpty())
//            runner.readFiles();

        UploadJob uploadJob = uploaderRequest.getUploadJobs().get(0);
//        Optional<Definition> definitionOptional = runner.getUploadDefinition(uploadJob.getModuleName(), uploadJob.getDefName());
//        if (!definitionOptional.isPresent()) {
//            logger.error("There's no Upload Definition provided for this upload feature");
//            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
//                    "There's no Upload Definition provided for this upload feature");
//        }
        Definition uploadDefinition = null;
        try {
            UploadDefinition definition = objectMapper.readValue(new FileInputStream
                    ("C:\\Users\\Nithin\\Documents\\eGov\\egov-services\\core\\egov-data-uploader\\src\\main\\resources" +
                            "\\employee.json"), UploadDefinition.class);
            uploadDefinition = definition.getDefinitions().get(0);
        } catch (IOException e) {
            e.printStackTrace();
        }

//        Definition uploadDefinition = definitionOptional.get();
        logger.info("Definition to be used: " + uploadDefinition);

        try (InputStream file = new FileInputStream(uploadJob.getLocalFilePath())) {
            Document document = excelIO.read(file);

            uploadJob.setEndTime(0L);
            uploadJob.setFailedRows(0);
            uploadJob.setStartTime(new Date().getTime());
            uploadJob.setSuccessfulRows(0);
            uploadJob.setStatus(UploadJob.StatusEnum.INPROGRESS);
            uploadJob.setResponseFilePath(null);
            uploadJob.setTotalRows(document.getRows().size());
            uploadRegistryRepository.updateJob(uploadJob);

//            if (null != uploadDefinition.getIsParentChild() && uploadDefinition.getIsParentChild()) {
//                uploadParentChildData(document, uploadDefinition, uploaderRequest);
//            } else {
//                uploadFlatData(document, uploadDefinition, uploaderRequest);
//            }

        }  catch (IOException e) {
            logger.error("Unable to open file or invalid format provided.", e);
            uploadJob.setEndTime(new Date().getTime());
            uploadJob.setSuccessfulRows(0);
            uploadJob.setStatus(UploadJob.StatusEnum.FAILED);
            uploadJob.setReasonForFailure(e.getMessage());
            uploadRegistryRepository.updateJob(uploadJob);
            throw new CustomException(HttpStatus.BAD_REQUEST.toString(),
                    "Unable to open file or invalid format provided.");
        } finally {
//            dataUploadUtils.clearInternalDirectory();
        }
    }


}
