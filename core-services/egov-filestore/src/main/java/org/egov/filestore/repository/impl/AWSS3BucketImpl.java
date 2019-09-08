package org.egov.filestore.repository.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.io.FilenameUtils;
import org.egov.filestore.domain.model.Artifact;
import org.egov.filestore.repository.AWSClientFacade;
import org.egov.filestore.repository.CloudFilesManager;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@ConditionalOnProperty(value = "isS3Enabled", havingValue = "true", matchIfMissing = true)
public class AWSS3BucketImpl implements CloudFilesManager {

	@Value("${aws.key}")
	private String key;

	@Value("${aws.secretkey}")
	private String secretKey;

	@Value("${aws.region}")
	private String awsRegion;

	@Value("${image.small}")
	private String _small;

	@Value("${image.medium}")
	private String _medium;

	@Value("${image.large}")
	private String _large;

	@Value("${is.bucket.fixed}")
	private Boolean isBucketFixed;

	@Value("${presigned.url.expiry.time.in.secs}")
	private Long presignedUrlExpirytime;

	private AmazonS3 s3Client;

	@Autowired
	private AWSClientFacade awsFacade;

	@Autowired
	private CloudFileMgrUtils util;

	@Override
	public void saveFiles(List<Artifact> artifacts) {
		if (null == s3Client)
			s3Client = awsFacade.getS3Client();

		artifacts.forEach(artifact -> {
			String completeName = artifact.getFileLocation().getFileName();
			int index = completeName.indexOf('/');
			String bucketName = completeName.substring(0, index);
			String fileNameWithPath = completeName.substring(index + 1, completeName.length());
			if (!isBucketFixed && !s3Client.doesBucketExistV2(bucketName))
				s3Client.createBucket(bucketName);
			if (artifact.getMultipartFile().getContentType().startsWith("image/")) {
				String extension = FilenameUtils.getExtension(artifact.getMultipartFile().getOriginalFilename());
				Map<String, BufferedImage> mapOfImagesAndPaths = util.createVersionsOfImage(artifact.getMultipartFile(),
						fileNameWithPath);
				writeImage(mapOfImagesAndPaths, bucketName, extension);
			} else {
				writeFile(artifact.getMultipartFile(), bucketName, fileNameWithPath);
			}
		});
	}

	/**
	 * There's a problem with this implementation: In case of images, we are trying
	 * to retrieve 4 different versions of the same file namely - small, medium,
	 * large and the original. The path stored in the db is the path of the original
	 * file only, we are making suitable changes to that file path by appending some
	 * extensions to obtain file paths of the different versions. TODO: This has to
	 * be fixed, we need to keep track of all these versions by storing their paths
	 * in the db separately instead of deriving them.
	 * 
	 * Secondly, once these paths are obtained, their Signed urls are being returned
	 * as comma separated values in a single string, this has to change to list of
	 * strings. We aren't taking this up because this will cause high impact on UI.
	 * TODO: Change comma separated string to list of strings and test it with UI
	 * once their changes are done.
	 */
	@Override
	public Map<String, String> getFiles(Map<String, String> mspOfIdAndFilePath) {

		Map<String, String> urlMap = new HashMap<>();
		if (null == s3Client)
			s3Client = awsFacade.getS3Client();

		mspOfIdAndFilePath.keySet().forEach(fileStoreId -> {
			String completeName = mspOfIdAndFilePath.get(fileStoreId);
			int index = completeName.indexOf('/');
			String bucketName = completeName.substring(0, index);
			String fileNameWithPath = completeName.substring(index + 1, completeName.length());
			String replaceString = fileNameWithPath.substring(fileNameWithPath.lastIndexOf('.'),
					fileNameWithPath.length());

			if (util.isFileAnImage(mspOfIdAndFilePath.get(fileStoreId))) {
				String[] imageFormats = { _small, _medium, _large };
				StringBuilder url = new StringBuilder();
				for (String format : Arrays.asList(imageFormats)) {
					String path = fileNameWithPath;
					path = path.replaceAll(replaceString, format + replaceString);
					url.append(generateSignedURL(bucketName, path));
					url.append(",");
				}
				url.append(generateSignedURL(bucketName, fileNameWithPath));
				urlMap.put(fileStoreId, url.toString());
			} else {
				urlMap.put(fileStoreId, generateSignedURL(bucketName, fileNameWithPath));
			}
		});
		return urlMap;
	}

	/**
	 * Generates signed url for the resource stored in AWS
	 * 
	 * @param bucketName
	 * @param fileName
	 * @return
	 */
	private String generateSignedURL(String bucketName, String fileName) {
		Date time = new Date(System.currentTimeMillis() + (presignedUrlExpirytime * 1000));
		GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, fileName);
		generatePresignedUrlRequest.setExpiration(time);
		return s3Client.generatePresignedUrl(generatePresignedUrlRequest).toString();
	}

	/**
	 * Writes files to s3 bucket
	 * 
	 * @param file
	 * @param bucketName
	 * @param fileName
	 */
	private void writeFile(MultipartFile file, String bucketName, String fileName) {
		InputStream is = null;
		long contentLength = file.getSize();
		try {
			is = file.getInputStream();
		} catch (IOException e) {
			log.error(" exception occured while reading input stream from file {}", e);
			throw new RuntimeException(e);
		}
		ObjectMetadata objMd = new ObjectMetadata();
		objMd.setContentLength(contentLength);

		s3Client.putObject(bucketName, fileName, is, objMd);
	}

	/**
	 * Uploads images to the s3 bucket
	 * 
	 * @param mapOfImagesAndPaths
	 * @param bucketName
	 * @param extension
	 */
	private void writeImage(Map<String, BufferedImage> mapOfImagesAndPaths, String bucketName, String extension) {
		Map<String, String> errorMap = new HashMap<>();
		for (String key : mapOfImagesAndPaths.keySet()) {
			try {
				s3Client.putObject(getPutObjectRequest(bucketName, key, mapOfImagesAndPaths.get(key), extension));
				mapOfImagesAndPaths.get(key).flush();
			} catch (Exception e) {
				errorMap.put("AWS_UPLOAD_FAILED", e.getMessage());
			}
		}
		if(!CollectionUtils.isEmpty(errorMap.keySet()))
			throw new CustomException(errorMap);
	}

	/**
	 * Prepares put request as per s3Client's contract.
	 * 
	 * @param bucketName
	 * @param key
	 * @param originalImage
	 * @param extension
	 * @return
	 */
	private PutObjectRequest getPutObjectRequest(String bucketName, String key, BufferedImage originalImage,
			String extension) {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			ImageIO.write(originalImage, extension, os);
		} catch (IOException e) {
			log.error(" error while writing image to stream : {}", e);
			throw new CustomException("IMAGE_PROCESSING_FAILED", "Failed to process the image to be uploaded");
		}
		ObjectMetadata metadata = new ObjectMetadata();
		metadata.setContentLength(os.size());
		return new PutObjectRequest(bucketName, key, new ByteArrayInputStream(os.toByteArray()), metadata);
	}
}
