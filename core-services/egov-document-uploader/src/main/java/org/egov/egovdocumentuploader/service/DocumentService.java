package org.egov.egovdocumentuploader.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovdocumentuploader.producer.Producer;
import org.egov.egovdocumentuploader.repository.DocumentRepository;
import org.egov.egovdocumentuploader.utils.DocumentUtil;
import org.egov.egovdocumentuploader.validators.DocumentValidator;
import org.egov.egovdocumentuploader.web.models.AuditDetails;
import org.egov.egovdocumentuploader.web.models.DocumentEntity;
import org.egov.egovdocumentuploader.web.models.DocumentRequest;
import org.egov.egovdocumentuploader.web.models.DocumentSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class DocumentService {

    @Autowired
    private DocumentValidator documentValidator;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private Producer producer;

    @Autowired
    private DocumentUtil documentUtil;

    public DocumentEntity createDocument(DocumentRequest documentRequest) {

        DocumentEntity documentEntity = documentRequest.getDocumentEntity();

        // Validates that only users of type EMPLOYEE can access document create resource.
        documentValidator.validateUserType(documentRequest.getRequestInfo());
        // Validates whether a document already exists on the server.
        documentValidator.validateDocumentUniqueness(documentEntity);
        // Validates whether the category being passed is a valid one or not
        documentValidator.validateCategoryFromMdms(documentRequest);


        List<String> listOfTenantIds = new ArrayList<>(documentEntity.getTenantIds());
        Integer countOfDocumentEntities = listOfTenantIds.size();
        List<String> listOfDocumentIds = documentUtil.getIdList(documentRequest.getRequestInfo(), listOfTenantIds.get(0), "du.documentid", "DOC-[cy:yyyy-MM-dd]-[SEQ_EG_DOC_ID]", countOfDocumentEntities);
        for(int i = 0; i < countOfDocumentEntities; i++){
            documentEntity.setTenantId(listOfTenantIds.get(i));
            documentEntity.setUuid(listOfDocumentIds.get(i));
            documentEntity.setActive(true);
            documentEntity.setAuditDetails(AuditDetails.builder()
                                            .createdBy(documentRequest.getRequestInfo().getUserInfo().getUuid())
                                            .lastModifiedBy(documentRequest.getRequestInfo().getUserInfo().getUuid())
                                            .createdTime(System.currentTimeMillis())
                                            .lastModifiedTime(System.currentTimeMillis())
                                            .build());
            documentEntity.setPostedBy(documentRequest.getRequestInfo().getUserInfo().getName());
            //log.info(documentEntity.toString());
            producer.push("save-du-document", documentRequest);
        }

        return documentEntity;
    }

    public List<DocumentEntity> searchDocuments(RequestInfo requestInfo, DocumentSearchCriteria criteria){

        List<DocumentEntity> documents = documentRepository.getDocuments(criteria);

        if(CollectionUtils.isEmpty(documents))
            return new ArrayList<>();

        return documents;
    }

    public DocumentEntity updateDocument(DocumentRequest documentRequest) {
        documentValidator.validateUserType(documentRequest.getRequestInfo());
        documentValidator.validateCategoryFromMdms(documentRequest);
        DocumentEntity existingEntity = documentValidator.validateDocumentExistence(documentRequest.getDocumentEntity());
        DocumentEntity documentEntity = documentRequest.getDocumentEntity();
        documentEntity.setAuditDetails(existingEntity.getAuditDetails());
        documentEntity.getAuditDetails().setLastModifiedBy(documentRequest.getRequestInfo().getUserInfo().getUuid());
        documentEntity.getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
        documentEntity.setPostedBy(documentRequest.getRequestInfo().getUserInfo().getName());
        //log.info(documentEntity.toString());
        producer.push("update-du-document", documentRequest);
        return documentEntity;
    }

    public void deleteDocument(DocumentRequest documentRequest) {
        documentValidator.validateUserType(documentRequest.getRequestInfo());
        documentValidator.validateDocumentExistence(documentRequest.getDocumentEntity());
        DocumentEntity documentEntity = documentRequest.getDocumentEntity();
        documentEntity.setActive(Boolean.FALSE);
        log.info(documentEntity.toString());
        producer.push("delete-du-document", documentRequest);
    }

    public Integer countDocuments(RequestInfo requestInfo, DocumentSearchCriteria criteria) {
        criteria.setIsCountCall(Boolean.TRUE);
        return documentRepository.getDocumentsCount(criteria);
    }

    public List getDocumentStatusCount(RequestInfo requestInfo, DocumentSearchCriteria criteria) {
        criteria.setIsCountCall(Boolean.TRUE);
        return documentRepository.getDocumentsStatusWiseCount(criteria);
    }
}
