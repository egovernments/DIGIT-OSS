package org.egov.filestore.domain.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.filestore.config.FileStoreConfig;
import org.egov.filestore.domain.model.Artifact;
import org.egov.filestore.domain.model.FileInfo;
import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.domain.model.Resource;
import org.egov.filestore.persistence.repository.ArtifactRepository;
import org.egov.filestore.repository.CloudFilesManager;
import org.egov.filestore.repository.impl.CloudFileMgrUtils;
import org.egov.filestore.repository.impl.minio.MinioConfig;
import org.egov.filestore.validator.StorageValidator;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StorageService {

	@Autowired
	private CloudFileMgrUtils util;
	
	private FileStoreConfig configs;

	@Autowired
	private CloudFilesManager cloudFilesManager;

	private static final String UPLOAD_MESSAGE = "Received upload request for "
			+ "jurisdiction: %s, module: %s, tag: %s with file count: %s";

	private ArtifactRepository artifactRepository;
	private IdGeneratorService idGeneratorService;

	private FileStoreConfig fileStoreConfig;

	private StorageValidator storageValidator;
	
	private MinioConfig minioConfig;

	@Value("${filename.length}")
	private Integer filenameLength;

	@Value("${filename.useletters}")
	private Boolean useLetters;

	@Value("${filename.usenumbers}")
	private Boolean useNumbers;


	
	

	@Autowired
	public StorageService(ArtifactRepository artifactRepository, IdGeneratorService idGeneratorService,
			FileStoreConfig fileStoreConfig, StorageValidator storageValidator, FileStoreConfig configs, MinioConfig minioConfig) {
		this.artifactRepository = artifactRepository;
		this.idGeneratorService = idGeneratorService;
		this.fileStoreConfig = fileStoreConfig;
		this.storageValidator = storageValidator;
		this.minioConfig = minioConfig;
		this.configs = configs;
	}

	public List<String> save(List<MultipartFile> filesToStore, String module, String tag, String tenantId, RequestInfo requestInfo) {

		log.info(UPLOAD_MESSAGE, module, tag, filesToStore.size());
		List<Artifact> artifacts = mapFilesToArtifact(filesToStore, module, tag, tenantId);
		return this.artifactRepository.save(artifacts, requestInfo);
	}

	private List<Artifact> mapFilesToArtifact(List<MultipartFile> files, String module, String tag, String tenantId) {

		final String folderName = getFolderName(module, tenantId);
		String inputStreamAsString = null;
		List<Artifact> artifacts = new ArrayList<>();
		Artifact artifact = null;
		for (MultipartFile file : files) {
			String randomString = RandomStringUtils.random(filenameLength, useLetters, useNumbers);
			String orignalFileName = file.getOriginalFilename();
			String imagetype = FilenameUtils.getExtension(orignalFileName);
			String fileName = folderName + System.currentTimeMillis() + randomString + "." +imagetype;
			String id = this.idGeneratorService.getId();
			FileLocation fileLocation = new FileLocation(id, module, tag, tenantId, fileName, null);
			try {
				inputStreamAsString = IOUtils.toString(file.getInputStream(), fileStoreConfig.getImageCharsetType());
				artifact = Artifact.builder().fileContentInString(inputStreamAsString).multipartFile(file)
						.fileLocation(fileLocation).build();
				artifacts.add(artifact);

			} catch (IOException e) {
				// TODO Auto-generated catch block
				log.error("IO Exception while mapping files to artifact: " + e.getMessage());
			}
			storageValidator.validate(artifact);
			
			if (fileStoreConfig.getImageFormats().contains(FilenameUtils.getExtension(artifact.getMultipartFile().getOriginalFilename())))
				setThumbnailImages(artifact);
		}

		return artifacts;
	}

	private void setThumbnailImages(Artifact artifact) {
		
		String completeName = artifact.getFileLocation().getFileName();
		int index = completeName.indexOf('/');
		String fileNameWithPath = completeName.substring(index + 1, completeName.length());

		try {

			String imagetype = FilenameUtils.getExtension(artifact.getMultipartFile().getOriginalFilename());
			String inputStreamAsString = artifact.getFileContentInString();
			if (fileStoreConfig.getImageFormats().contains(imagetype)) {

				InputStream ipStreamForImg = IOUtils.toInputStream(inputStreamAsString, configs.getImageCharsetType());
				Map<String, BufferedImage> mapOfImagesAndPaths = util.createVersionsOfImage(ipStreamForImg,
						fileNameWithPath);
				artifact.setThumbnailImages(mapOfImagesAndPaths);
			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error("EG_FILESTORE_INPUT_ERROR", e);
			throw new CustomException("EG_FILESTORE_INPUT_ERROR", "Failed to read input stream from multipart file");
		}

	}

	private String getFolderName(String module, String tenantId) {

		Calendar calendar = Calendar.getInstance();
		return minioConfig.getBucketName() + "/" + getFolderName(module, tenantId, calendar);
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
		return urlMap;
	}

	private Map<String, String> getUrlMap(List<org.egov.filestore.persistence.entity.Artifact> artifactList) {
		return cloudFilesManager.getFiles(artifactList);
	}

	private String getFolderName(String module, String tenantId, Calendar calendar) {
		return tenantId + "/" + module + "/" + calendar.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.ENGLISH)
				+ "/" + calendar.get(Calendar.DATE) + "/";
	}

	
}
