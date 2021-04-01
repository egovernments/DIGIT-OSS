package org.egov.noc.validator;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.noc.config.NOCConfiguration;
import org.egov.noc.util.NOCConstants;
import org.egov.noc.web.model.Document;
import org.egov.noc.web.model.Noc;
import org.egov.noc.web.model.NocRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.jayway.jsonpath.JsonPath;

@Component
public class NOCValidator {

	@Autowired
	private MDMSValidator mdmsValidator;

	@Autowired
	private NOCConfiguration nocConfiguration;

	/**
	 * validates the nocRequest for documents
	 * 
	 * @param nocRequest
	 * @param mdmsData
	 */
	public void validateCreate(NocRequest nocRequest, Object mdmsData) {
		mdmsValidator.validateMdmsData(nocRequest, mdmsData);
		if (!ObjectUtils.isEmpty(nocRequest.getNoc().getDocuments())) {
			validateAttachedDocumentTypes(nocRequest.getNoc(), mdmsData);
			validateDuplicateDocuments(nocRequest.getNoc());
		}
	}

	/**
	 * validates the nocReuqest for update on mdms and documents
	 * 
	 * @param nocRequest
	 * @param searchResult
	 * @param mode
	 * @param mdmsData
	 */
	public void validateUpdate(NocRequest nocRequest, Noc searchResult, String mode, Object mdmsData) {
		Noc noc = nocRequest.getNoc();
		mdmsValidator.validateMdmsData(nocRequest, mdmsData);
		validateData(searchResult, noc, mode, mdmsData);
		validateDuplicateDocuments(nocRequest.getNoc());
	}

	/**
	 * validatest the data of the noc for nextstep on the current status
	 * 
	 * @param searchResult
	 * @param noc
	 * @param mode
	 * @param mdmsData
	 */
	private void validateData(Noc searchResult, Noc noc, String mode, Object mdmsData) {
		Map<String, String> errorMap = new HashMap<>();

		if (noc.getId() == null) {
			errorMap.put("UPDATE ERROR", "Application Not found in the System" + noc);
		}

		if (!ObjectUtils.isEmpty(noc.getWorkflow()) && !StringUtils.isEmpty(noc.getWorkflow().getAction())) {

			if ((noc.getWorkflow().getAction().equalsIgnoreCase(NOCConstants.ACTION_APPROVE) && mode.equals(NOCConstants.ONLINE_MODE)) || (mode.equals(NOCConstants.OFFLINE_MODE)
					&& noc.getWorkflow().getAction().equalsIgnoreCase(NOCConstants.ACTION_AUTO_APPROVE) && nocConfiguration.getNocOfflineDocRequired())) {
				validateRequiredDocuments(noc, mdmsData);
			} else if (!noc.getWorkflow().getAction().equalsIgnoreCase(NOCConstants.ACTION_REJECT) && !noc.getWorkflow().getAction().equalsIgnoreCase(NOCConstants.ACTION_VOID)
					&& !ObjectUtils.isEmpty(noc.getDocuments())) {
				validateAttachedDocumentTypes(noc, mdmsData);
			}

			if (noc.getWorkflow().getAction().equalsIgnoreCase(NOCConstants.ACTION_REJECT) && StringUtils.isEmpty(noc.getWorkflow().getComment()))
				errorMap.put("NOC_UPDATE_ERROR_COMMENT_REQUIRED", "Comment is mandaotory, please provide the comments ");
		} else if (!ObjectUtils.isEmpty(noc.getDocuments())) {
			validateAttachedDocumentTypes(noc, mdmsData);
		}

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}

	/**
	 * fetch the businessservice code for nocType
	 * 
	 * @param noc
	 * @param mdmsData
	 * @return
	 */
	public Map<String, String> getOrValidateBussinessService(Noc noc, Object mdmsData) {
		List<Map<String, Object>> result = JsonPath.read(mdmsData, NOCConstants.NOCTYPE_JSONPATH_CODE);
		if (result.isEmpty()) {
			throw new CustomException("MDMS DATA ERROR", "Unable to fetch NocType from MDMS");
		}

		String filterExp = "$.[?(@.code == '" + noc.getNocType() + "' )]";
		List<Map<String, Object>> jsonOutput = JsonPath.read(result, filterExp);
		if (jsonOutput.isEmpty()) {
			throw new CustomException("MDMS DATA ERROR", "Unable to fetch " + noc.getNocType() + " workflow mode from MDMS");
		}

		Map<String, String> businessValues = new HashMap<>();
		businessValues.put(NOCConstants.MODE, (String) jsonOutput.get(0).get(NOCConstants.MODE));
		if (jsonOutput.get(0).get(NOCConstants.MODE).equals(NOCConstants.ONLINE_MODE))
			businessValues.put(NOCConstants.WORKFLOWCODE, (String) jsonOutput.get(0).get(NOCConstants.ONLINE_WF));
		else
			businessValues.put(NOCConstants.WORKFLOWCODE, (String) jsonOutput.get(0).get(NOCConstants.OFFLINE_WF));

		if (!ObjectUtils.isEmpty(noc.getWorkflow()) && !StringUtils.isEmpty(noc.getWorkflow().getAction()) && noc.getWorkflow().getAction().equals(NOCConstants.ACTION_INITIATE)) {
			businessValues.put(NOCConstants.INITIATED_TIME, Long.toString(System.currentTimeMillis()));
		}

		noc.setAdditionalDetails(businessValues);
		return businessValues;
	}

	/**
	 * validates the documents of the noc with the documentType mappings
	 * 
	 * @param noc
	 * @param mdmsData
	 */
	private void validateAttachedDocumentTypes(Noc noc, Object mdmsData) {
		Map<String, List<String>> masterData = mdmsValidator.getAttributeValues(mdmsData);
		List<Document> documents = noc.getDocuments();

		String filterExp = "$.[?(@.applicationType=='" + noc.getApplicationType() + "' && @.nocType=='" + noc.getNocType() + "')].docTypes";

		List<Object> docTypes = JsonPath.read(masterData.get(NOCConstants.NOC_DOC_TYPE_MAPPING), filterExp);

		if (CollectionUtils.isEmpty(docTypes)) {
			throw new CustomException("MDMS_DATA_ERROR", "Unable to fetch noc document mapping");
		}

		List<String> docTypeMappings = JsonPath.read(docTypes, "$..documentType");

		filterExp = "$.[?(@.active==true)].code";
		List<String> validDocumentTypes = JsonPath.read(masterData.get(NOCConstants.DOCUMENT_TYPE), filterExp);

		if (!CollectionUtils.isEmpty(documents)) {
			List<String> addedDocTypes = new ArrayList<String>();
			documents.forEach(document -> {
				if (StringUtils.isEmpty(document.getFileStoreId())) {
					throw new CustomException("NOC_FILE_EMPTY", "Filestore id is empty");
				}
				if (!validDocumentTypes.contains(document.getDocumentType())) {
					throw new CustomException("NOC_UNKNOWN_DOCUMENTTYPE", document.getDocumentType() + " is Unkown");
				}
				String docType = document.getDocumentType();
				int lastIndex = docType.lastIndexOf(".");
				String documentNs = "";
				if (lastIndex > 1) {
					documentNs = docType.substring(0, lastIndex);
				} else if (lastIndex == 1) {
					throw new CustomException("NOC_INVALID_DOCUMENTTYPE", document.getDocumentType() + " is Invalid");
				} else {
					documentNs = docType;
				}
				addedDocTypes.add(documentNs);
			});
			addedDocTypes.forEach(documentType -> {
				if (!docTypeMappings.contains(documentType)) {
					throw new CustomException("NOC_INVALID_DOCUMENTTYPE", "Document Type " + documentType + " is invalid for " + noc.getNocType() + " application");
				}
			});
		}
	}

	/**
	 * validates for the duplicate documents
	 * 
	 * @param noc
	 */
	private void validateDuplicateDocuments(Noc noc) {
		if (!ObjectUtils.isEmpty(noc.getDocuments())) {
			List<String> documentFileStoreIds = new LinkedList<String>();
			noc.getDocuments().forEach(document -> {
				if (documentFileStoreIds.contains(document.getFileStoreId()))
					throw new CustomException("NOC_DUPLICATE_DOCUMENT", "Same document cannot be used multiple times");
				else
					documentFileStoreIds.add(document.getFileStoreId());
			});
		}
	}

	/**
	 * validates for the required documents of NOC
	 * 
	 * @param noc
	 * @param mdmsData
	 */
	private void validateRequiredDocuments(Noc noc, Object mdmsData) {
		Map<String, List<String>> masterData = mdmsValidator.getAttributeValues(mdmsData);

		if (!noc.getWorkflow().getAction().equalsIgnoreCase(NOCConstants.ACTION_REJECT) && !noc.getWorkflow().getAction().equalsIgnoreCase(NOCConstants.ACTION_VOID)) {
			List<Document> documents = noc.getDocuments();
			String filterExp = "$.[?(@.applicationType=='" + noc.getApplicationType() + "' && @.nocType=='" + noc.getNocType() + "')].docTypes";
			List<Object> docTypeMappings = JsonPath.read(masterData.get(NOCConstants.NOC_DOC_TYPE_MAPPING), filterExp);
			if (CollectionUtils.isEmpty(docTypeMappings)) {
				throw new CustomException("MDMS_DATA_ERROR", "Unable to fetch noc document mapping");
			}
			// fetch all document types for noc type
			List<String> docTypes = JsonPath.read(docTypeMappings, "$..documentType");

			// filter mandatory document list
			filterExp = "$..[?(@.required==true)].documentType";
			List<String> requiredDocTypes = JsonPath.read(docTypeMappings, filterExp);

			filterExp = "$.[?(@.active==true)].code";
			List<String> validDocumentTypes = JsonPath.read(masterData.get(NOCConstants.DOCUMENT_TYPE), filterExp);

			if (!CollectionUtils.isEmpty(documents)) {
				documents.forEach(document -> {
					if (StringUtils.isEmpty(document.getFileStoreId())) {
						throw new CustomException("NOC_FILE_EMPTY", "Filestore id is empty");
					}
					if (!validDocumentTypes.contains(document.getDocumentType())) {
						throw new CustomException("NOC_UNKNOWN_DOCUMENTTYPE", document.getDocumentType() + " is Unkown");
					}
					if (requiredDocTypes.size() > 0 && documents.size() < requiredDocTypes.size()) {
						throw new CustomException("NOC_MANDATORY_DOCUMENTYPE_MISSING", requiredDocTypes.size() + " Documents are requied ");
					} else if (requiredDocTypes.size() > 0) {
						List<String> addedDocTypes = new ArrayList<String>();

						documents.forEach(doc -> {
							String docType = doc.getDocumentType();
							int lastIndex = docType.lastIndexOf(".");
							String documentNs = "";
							if (lastIndex > 1) {
								documentNs = docType.substring(0, lastIndex);
							} else if (lastIndex == 1) {
								throw new CustomException("NOC_INVALID_DOCUMENTTYPE", document.getDocumentType() + " is invalid");
							} else {
								documentNs = docType;
							}
							addedDocTypes.add(documentNs);
						});
						requiredDocTypes.forEach(docType -> {
							if (!addedDocTypes.contains(docType)) {
								throw new CustomException("NOC_MANDATORY_DOCUMENTYPE_MISSING", "Document Type " + docType + " is missing");
							}
						});
						addedDocTypes.forEach(documentType -> {
							if (!docTypes.contains(documentType)) {
								throw new CustomException("NOC_INVALID_DOCUMENTTYPE", "Document Type " + documentType + " is invalid for " + noc.getNocType() + " application");
							}
						});
					}
				});
			} else if (requiredDocTypes.size() > 0) {
				throw new CustomException("NOC_MANDATORY_DOCUMENTYPE_MISSING", "Atleast " + requiredDocTypes.size() + " Documents are required ");
			}
		}
	}

}
