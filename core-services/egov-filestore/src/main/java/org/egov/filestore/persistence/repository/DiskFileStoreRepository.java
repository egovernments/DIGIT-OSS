package org.egov.filestore.persistence.repository;

import org.egov.filestore.persistence.entity.Artifact;
import org.egov.filestore.domain.model.FileLocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class DiskFileStoreRepository {

    @Autowired
    private AwsS3Repository s3Repository;
    
	@Value("${isS3Enabled}")
	private Boolean isS3Enabled;
	
	@Value("${source.s3}")
	private String AwsS3Source;
	
	@Value("${source.disk}")
	private String diskFileStorage;
    
	private FileRepository fileRepository;
    
    private String fileMountPath;

    public DiskFileStoreRepository(FileRepository fileRepository,
                                   @Value("${file.storage.mount.path}") String fileMountPath) {
        this.fileRepository = fileRepository;
        this.fileMountPath = fileMountPath;
    }

	public List<Artifact> write(List<org.egov.filestore.domain.model.Artifact> artifacts) {
		
		List<org.egov.filestore.persistence.entity.Artifact> persistList = new ArrayList<>();
		artifacts.forEach(artifact -> {
			MultipartFile multipartFile = artifact.getMultipartFile();
			FileLocation fileLocation = artifact.getFileLocation();
			if (isS3Enabled) {
				s3Repository.writeToS3(multipartFile, fileLocation);
				fileLocation.setFileSource(AwsS3Source);
				
			} else {
				Path path = getPath(fileLocation);
				fileRepository.write(multipartFile, path);
				fileLocation.setFileSource(diskFileStorage);
			}
			persistList.add(mapToEntity(artifact));
		});
		return persistList;
	}

	public Resource read(FileLocation fileLocation) {
		
		Resource resource = null;
		
		if(fileLocation.getFileSource()==null || fileLocation.getFileSource().equals(diskFileStorage)) {
        Path path = getPath(fileLocation);
        resource = fileRepository.read(path);
        if(resource == null)
        	resource = fileRepository.read(getPathOldVersion(fileLocation));
		}else if(fileLocation.getFileSource().equals(AwsS3Source)){
			resource = s3Repository.getObject(fileLocation.getFileName());
		}
        
        return resource;
    }

	private Path getPath(FileLocation fileLocation) {
		return Paths.get(fileMountPath, fileLocation.getFileName());
	}
	
	private Path getPathOldVersion(FileLocation fileLocation) {
		return Paths.get(fileMountPath, fileLocation.getTenantId(),
				fileLocation.getModule(),
				fileLocation.getFileStoreId());
	}
	
	private Artifact mapToEntity(org.egov.filestore.domain.model.Artifact artifact) {

		FileLocation fileLocation = artifact.getFileLocation();
		return Artifact.builder().fileStoreId(fileLocation.getFileStoreId()).fileName(fileLocation.getFileName())
				.contentType(artifact.getMultipartFile().getContentType()).module(fileLocation.getModule())
				.tag(fileLocation.getTag()).tenantId(fileLocation.getTenantId()).fileSource(fileLocation.getFileSource()).build();
	}


}

