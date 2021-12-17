package org.egov.egovdocumentuploader.validators;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovdocumentuploader.service.DocumentService;
import org.egov.egovdocumentuploader.utils.DocumentUtil;
import org.egov.egovdocumentuploader.web.models.DocumentEntity;
import org.egov.egovdocumentuploader.web.models.DocumentRequest;
import org.egov.egovdocumentuploader.web.models.DocumentSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.egov.tracer.model.CustomException;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.egov.egovdocumentuploader.utils.DocumentUploaderConstants.*;

@Slf4j
@Component
public class DocumentValidator {

    @Autowired
    private DocumentUtil documentUtil;

    @Autowired
    private DocumentService documentService;

    public void validateUserType(RequestInfo requestInfo) {
        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase(EMPLOYEE)){
            throw new CustomException("EG_DOCUMENT_UPLOAD_ERR", "Documents can only be uploaded by employees.");
        }
    }

    public void validateDocumentUniqueness(DocumentEntity documentEntity) {

        if(CollectionUtils.isEmpty(documentEntity.getTenantIds()))
            throw new CustomException("EG_TENANT_NOT_SPECIFIED_ERR", "Tenant ids are mandatory for document creation");

        if(ObjectUtils.isEmpty(documentEntity.getCategory()))
            throw new CustomException("EG_CATEGORY_NOT_SPECIFIED_ERR", "Category is mandatory for document creation");

        if(ObjectUtils.isEmpty(documentEntity.getName()))
            throw new CustomException("EG_NAME_NOT_SPECIFIED_ERR", "Name is mandatory for document creation");

        if(ObjectUtils.isEmpty(documentEntity.getFilestoreId()) && ObjectUtils.isEmpty(documentEntity.getDocumentLink()))
            throw new CustomException("EG_FILE_NOT_SPECIFIED_ERR", "Either of document link, filestore id is mandatory for document creation");

        DocumentSearchCriteria criteria = DocumentSearchCriteria.builder()
                .tenantIds(documentEntity.getTenantIds())
                .category(documentEntity.getCategory())
                .name(documentEntity.getName())
                .isCountCall(false)
                .build();
        if(!CollectionUtils.isEmpty(documentService.searchDocuments(new RequestInfo(), criteria))){
            throw new CustomException("EG_DOCUMENT_DUPLICATE_RECORD_ERR", "The provided document entity already exists");
        }
    }

    public void validateCategoryFromMdms(DocumentRequest documentRequest) {
        // This if clause is for update call when single record is to be updated and 'tenantIds' param is empty
        if(CollectionUtils.isEmpty(documentRequest.getDocumentEntity().getTenantIds())){
            documentRequest.getDocumentEntity().setTenantIds(Collections.singletonList(documentRequest.getDocumentEntity().getTenantId()));
        }
        Map<String, Set<String>> categoryMap = documentUtil.fetchCategoryMapFromMdms(documentRequest.getRequestInfo(), documentRequest.getDocumentEntity().getTenantIds());

        documentRequest.getDocumentEntity().getTenantIds().forEach(tenantid ->{
            if(categoryMap.containsKey(tenantid)){
                String category = documentRequest.getDocumentEntity().getCategory();
                if(!categoryMap.get(tenantid).contains(category))
                    throw new CustomException("EG_DOCUMENT_CATEGORY_DOES_NOT_EXIST_ERR", "Document category: " + category + " does not exist for tenantid: " + tenantid);
            }else{
                throw new CustomException("EG_DOCUMENT_CATEGORY_DOES_NOT_EXIST_ERR", "No document categories exist in mdms for tenantid: " + tenantid);
            }
        });
    }

    public DocumentEntity validateDocumentExistence(DocumentEntity documentEntity) {

        if(ObjectUtils.isEmpty(documentEntity.getUuid())){
            throw new CustomException("EG_DOCUMENT_UUID_NOT_PROVIDED_ERR", "Providing document uuid is mandatory for update and delete operations");
        }

        DocumentSearchCriteria criteria = DocumentSearchCriteria.builder()
                .uuid(documentEntity.getUuid())
                .isCountCall(false)
                .build();

        List<DocumentEntity> entities = documentService.searchDocuments(new RequestInfo(), criteria);
        if(CollectionUtils.isEmpty(entities)){
            throw new CustomException("EG_DOCUMENT_EXISTENCE_ERR", "The document entity with the provided uuid does not exist");
        }

        return entities.get(0);
    }
}
