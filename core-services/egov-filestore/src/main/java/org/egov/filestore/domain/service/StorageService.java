package org.egov.filestore.domain.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.egov.filestore.domain.exception.EmptyFileUploadRequestException;
import org.egov.filestore.domain.model.Artifact;
import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.domain.model.Resource;
import org.egov.filestore.persistence.repository.ArtifactRepository;
import org.egov.filestore.repository.CloudFilesManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StorageService {

	@Value("${is.bucket.fixed}")
	private Boolean isBucketFixed;

	@Value("${fixed.bucketname}")
	private String fixedBucketName;

	@Value("${isS3Enabled}")
	private Boolean isS3Enabled;

	@Value("${isNfsStorageEnabled}")
	private Boolean isNfsStorageEnabled;

	@Value("${isAzureStorageEnabled}")
	private Boolean isAzureStorageEnabled;

	@Value("${source.disk}")
	private String diskStorage;

	@Value("${source.s3}")
	private String awsS3Source;

	@Value("${source.azure.blob}")
	private String azureBlobSource;

	@Autowired
	private CloudFilesManager cloudFilesManager;

	private static final String UPLOAD_MESSAGE = "Received upload request for "
			+ "jurisdiction: %s, module: %s, tag: %s with file count: %s";

	private ArtifactRepository artifactRepository;
	private IdGeneratorService idGeneratorService;

	@Autowired
	public StorageService(ArtifactRepository artifactRepository, IdGeneratorService idGeneratorService) {
		this.artifactRepository = artifactRepository;
		this.idGeneratorService = idGeneratorService;
	}

	public List<String> save(List<MultipartFile> filesToStore, String module, String tag, String tenantId,
			String inputStreamAsString) {
		validateFilesToUpload(filesToStore, module, tag, tenantId);
		log.info(UPLOAD_MESSAGE, module, tag, filesToStore.size());
		List<Artifact> artifacts = mapFilesToArtifacts(filesToStore, module, tag, tenantId, inputStreamAsString);
		return this.artifactRepository.save(artifacts);
	}

	private void validateFilesToUpload(List<MultipartFile> filesToStore, String module, String tag, String tenantId) {
		if (CollectionUtils.isEmpty(filesToStore)) {
			throw new EmptyFileUploadRequestException(module, tag, tenantId);
		}
	}

	private List<Artifact> mapFilesToArtifacts(List<MultipartFile> files, String module, String tag, String tenantId,
			String inputStreamAsString) {

		final String folderName = getFolderName(module, tenantId);
		return files.stream().map(file -> {
			//String fileName = folderName + System.currentTimeMillis() + file.getOriginalFilename();
			String fileName = file.getOriginalFilename();
			String id = this.idGeneratorService.getId();
			FileLocation fileLocation = new FileLocation(id, module, tag, tenantId, fileName, null);
			return new Artifact(inputStreamAsString, file, fileLocation);
		}).collect(Collectors.toList());
	}

	private String getFolderName(String module, String tenantId) {

		Calendar calendar = Calendar.getInstance();
		return getBucketName(tenantId, calendar) + "/" + getFolderName(module, tenantId, calendar);
	}

	public Resource retrieve(String fileStoreId, String tenantId) throws IOException {
		return artifactRepository.find(fileStoreId, tenantId);
	}

	public List<FileInfo> retrieveByTag(String tag, String tenantId) {
		return artifactRepository.findByTag(tag, tenantId);
	}

	public Map<String, String> getUrls(String tenantId, List<String> fileStoreIds) {

		Map<String, String> urlMap = getUrlMap(
				artifactRepository.getByTenantIdAndFileStoreIdList(tenantId, fileStoreIds));
		if (isNfsStorageEnabled) {
			for (String s : urlMap.keySet())
				urlMap.put(s, urlMap.get(s).concat("&tenantId=").concat(tenantId));
		}
		return urlMap;
	}

	private Map<String, String> getUrlMap(List<org.egov.filestore.persistence.entity.Artifact> artifactList) {
		String src = null;
		if (isAzureStorageEnabled)
			src = azureBlobSource;
		if (isS3Enabled)
			src = awsS3Source;
		if (isNfsStorageEnabled)
			src = diskStorage;
		final String source = src;

		Map<String, String> mapOfIdAndFile = artifactList.stream()
				.filter(a -> (null != a.getFileSource() && a.getFileSource().equals(source)))
				.collect(Collectors.toMap(org.egov.filestore.persistence.entity.Artifact::getFileStoreId,
						org.egov.filestore.persistence.entity.Artifact::getFileName));
		return cloudFilesManager.getFiles(mapOfIdAndFile);
	}

	private String getFolderName(String module, String tenantId, Calendar calendar) {
		return tenantId + "/" + module + "/" + calendar.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.ENGLISH)
				+ "/" + calendar.get(Calendar.DATE) + "/";
	}

	private String getBucketName(String tenantId, Calendar calendar) {
		// FIXME TODO add config filter logic to create bucket name for qa
		if (isBucketFixed)
			return fixedBucketName;
		else
			return tenantId.split("\\.")[0] + calendar.get(Calendar.YEAR);
	}
}
