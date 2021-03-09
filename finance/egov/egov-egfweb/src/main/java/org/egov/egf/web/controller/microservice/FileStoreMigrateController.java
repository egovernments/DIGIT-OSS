package org.egov.egf.web.controller.microservice;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.egov.egf.expensebill.repository.DocumentUploadRepository;
import org.egov.egf.utils.FinancialUtils;
import org.egov.infra.filestore.repository.FileStoreMapperRepository;
import org.egov.infra.microservice.contract.RequestInfoWrapper;
import org.egov.model.bills.DocumentUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileStoreMigrateController {

    @Autowired
    private DocumentUploadRepository documentUploadRepository;
    @Autowired
    private FinancialUtils financialUtils;
    @Autowired
    private FileStoreMapperRepository fileStoreMapperRepository;

    @RequestMapping(value = "/rest/migrate/uplodedfile", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> migrateUploadFiles(@RequestBody final RequestInfoWrapper requestInfoWrapper) {
        List<DocumentUpload> docUploadList = new ArrayList<>();
        docUploadList = documentUploadRepository.findByIsMigrated();
        financialUtils.migrateUploadedFiles(requestInfoWrapper.getRequestInfo(), docUploadList);
        return new ResponseEntity<>(docUploadList, org.springframework.http.HttpStatus.OK);

    }

    @RequestMapping(value = "/rest/migrate/filestoreId", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> migrateFilestoreIds(@RequestParam("fileStoreId") String fileStoreId,
            @RequestBody final RequestInfoWrapper requestInfoWrapper) {
        List<DocumentUpload> docUploadList = new ArrayList<>();
        List<String> fileStoreIdsList = new ArrayList<>();
        List<String> fileStoreIds = Stream.of(fileStoreId.split(",")).collect(Collectors.toList());
        fileStoreIds.stream().forEach(ids -> {
            fileStoreIdsList.add(ids);
        });
        docUploadList = documentUploadRepository.findByFileStoreAndIsMigrated(fileStoreIdsList);
        financialUtils.migrateUploadedFiles(requestInfoWrapper.getRequestInfo(), docUploadList);
        return new ResponseEntity<>(docUploadList, org.springframework.http.HttpStatus.OK);
    }

}
