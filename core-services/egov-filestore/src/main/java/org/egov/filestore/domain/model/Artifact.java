package org.egov.filestore.domain.model;

import lombok.*;

import java.awt.image.BufferedImage;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Builder
@Setter
public class Artifact {
	
	private String fileContentInString;
	
    private MultipartFile multipartFile;
    
    private FileLocation fileLocation;
    
    private Map<String, BufferedImage> thumbnailImages;
    
    private String createdBy;

    private String lastModifiedBy;

    private Long createdTime;

    private Long lastModifiedTime; 
}

