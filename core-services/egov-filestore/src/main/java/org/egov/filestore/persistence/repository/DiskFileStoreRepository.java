package org.egov.filestore.persistence.repository;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.persistence.entity.Artifact;
import org.egov.filestore.repository.CloudFilesManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import static org.apache.commons.io.FileUtils.getUserDirectoryPath;

@Service
@ConditionalOnProperty(value = "isNfsStorageEnabled", havingValue = "true")
public class DiskFileStoreRepository  implements CloudFilesManager {

	@Value("${disk.storage.host.url}")
	private String hostUrl;

	@Value("${disk.storage.host.endpoint}")
	private String hostEndpoint;

	@Value("${source.disk}")
	private String diskFileStorage;

	private FileRepository fileRepository;
	
	 
	private String fileMountPath;

	public DiskFileStoreRepository(FileRepository fileRepository,
			@Value("${file.storage.mount.path}") String fileMountPath) {
		this.fileRepository = fileRepository;
		if(null==fileMountPath || fileMountPath.isEmpty())
			fileMountPath=getUserDirectoryPath();
		this.fileMountPath = fileMountPath;
	}

	@Override
	public void saveFiles(List<org.egov.filestore.domain.model.Artifact> artifacts) {

		List<org.egov.filestore.persistence.entity.Artifact> persistList = new ArrayList<>();
		artifacts.forEach(artifact -> {
			MultipartFile multipartFile = artifact.getMultipartFile();
			FileLocation fileLocation = artifact.getFileLocation();

			Path path = getPath(fileLocation);
			fileRepository.write(multipartFile, path);
			fileLocation.setFileSource(diskFileStorage);
			persistList.add(mapToEntity(artifact));
		});
	}
	
	@Override
	public Map<String, String> getFiles(Map<String, String> mapOfIdAndFilePath) {
		
		
		Map<String, String> mapOfIdAndSASUrls = new HashMap<>();
		for(String s:mapOfIdAndFilePath.keySet())
		{
			 
			StringBuilder url=new StringBuilder(hostUrl);
			url.append(hostEndpoint);
			url.append(s);
			mapOfIdAndSASUrls.put(s, url.toString());
		}
		
		return mapOfIdAndSASUrls;
	}

	public Resource read(FileLocation fileLocation) {

		Resource resource = null;

		if (fileLocation.getFileSource() == null || fileLocation.getFileSource().equals(diskFileStorage)) {
			Path path = getPath(fileLocation);
			resource = fileRepository.read(path);
			if (resource == null)
				resource = fileRepository.read(getPathOldVersion(fileLocation));
		}
		return resource;
	}

	private Path getPath(FileLocation fileLocation) {
		return Paths.get(fileMountPath, fileLocation.getFileName());
	}

	private Path getPathOldVersion(FileLocation fileLocation) {
		return Paths.get(fileMountPath, fileLocation.getTenantId(), fileLocation.getModule(),
				fileLocation.getFileStoreId());
	}

	private Artifact mapToEntity(org.egov.filestore.domain.model.Artifact artifact) {

		FileLocation fileLocation = artifact.getFileLocation();
		return Artifact.builder().fileStoreId(fileLocation.getFileStoreId()).fileName(fileLocation.getFileName())
				.contentType(artifact.getMultipartFile().getContentType()).module(fileLocation.getModule())
				.tag(fileLocation.getTag()).tenantId(fileLocation.getTenantId())
				.fileSource(fileLocation.getFileSource()).build();
	}

}




