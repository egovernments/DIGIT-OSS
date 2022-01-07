package org.egov.filestore.validator;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.tika.Tika;
import org.egov.filestore.config.FileStoreConfig;
import org.egov.filestore.domain.model.Artifact;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class StorageValidator {

	private FileStoreConfig fileStoreConfig;

	
	@Autowired
	public StorageValidator(FileStoreConfig fileStoreConfig) {
		super();
		this.fileStoreConfig = fileStoreConfig;
	}


	public void validate(Artifact artifact) {
			
		String extension = (FilenameUtils.getExtension(artifact.getMultipartFile().getOriginalFilename())).toLowerCase();
		validateFileExtention(extension);
		validateContentType(artifact.getFileContentInString(), extension);
		validateInputContentType(artifact);
	}
	
	private void validateFileExtention(String extension) {
		if(!fileStoreConfig.getAllowedFormatsMap().containsKey(extension)) {
			throw new CustomException("EG_FILESTORE_INVALID_INPUT","Inalvid input provided for file : " + extension + ", please upload any of the allowed formats : " + fileStoreConfig.getAllowedKeySet());
		}
	}
	
	private void validateContentType(String inputStreamAsString, String extension) {
		
		String inputFormat = null;
		Tika tika = new Tika();
		try {
			
			InputStream ipStreamForValidation = IOUtils.toInputStream(inputStreamAsString, fileStoreConfig.getImageCharsetType());
			inputFormat = tika.detect(ipStreamForValidation);
			ipStreamForValidation.close();
		} catch (IOException e) {
			throw new CustomException("EG_FILESTORE_PARSING_ERROR","not able to parse the input please upload a proper file of allowed type : " + e.getMessage());
		}
		
		if (!fileStoreConfig.getAllowedFormatsMap().get(extension).contains(inputFormat)) {
			throw new CustomException("EG_FILESTORE_INVALID_INPUT", "Inalvid input provided for file, the extension does not match the file format. Please upload any of the allowed formats : "
							+ fileStoreConfig.getAllowedKeySet());
		}
	}

	private void validateInputContentType(Artifact artifact){

		MultipartFile file =  artifact.getMultipartFile();
		String contentType = file.getContentType();
		String extension = (FilenameUtils.getExtension(artifact.getMultipartFile().getOriginalFilename())).toLowerCase();


		if (!fileStoreConfig.getAllowedFormatsMap().get(extension).contains(contentType)) {
			throw new CustomException("EG_FILESTORE_INVALID_INPUT", "Invalid Content Type");
		}
	}

	
	/*private void validateFilesToUpload(List<MultipartFile> filesToStore, String module, String tag, String tenantId) {
		if (CollectionUtils.isEmpty(filesToStore)) {
			throw new EmptyFileUploadRequestException(module, tag, tenantId);
		}
	}*/
	
	
}
