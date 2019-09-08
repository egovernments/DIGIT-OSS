package org.egov.filestore.persistence.repository;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.io.FilenameUtils;
import org.egov.filestore.domain.model.FileLocation;
import org.egov.filestore.persistence.entity.Artifact;
import org.egov.tracer.model.CustomException;
import org.imgscalr.Scalr;
import org.imgscalr.Scalr.Method;
import org.imgscalr.Scalr.Mode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
/**
 * 
 * @author kaviyarasan1993
 *
 */
public class AwsS3Repository {

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

	@Value("${image.small.width}")
	private Integer smallWidth;

	@Value("${image.medium.width}")
	private Integer mediumWidth;

	@Value("${image.large.width}")
	private Integer largeWidth;

	@Value("${is.bucket.fixed}")
	private Boolean isBucketFixed;

	@Value("${presigned.url.expiry.time.in.secs}")	
	private Long presignedUrlExpirytime;

	private AmazonS3 s3Client;

	private static final String TEMP_FILE_PATH_NAME = "TempFolder/localFile";

	public void writeToS3(MultipartFile file, FileLocation fileLocation) {
		if (null == s3Client)
			getS3Client();
		String completeName = fileLocation.getFileName();
		int index = completeName.indexOf('/');
		String bucketName = completeName.substring(0, index);
		String fileNameWithPath = completeName.substring(index + 1, completeName.length());

		if (!isBucketFixed && !s3Client.doesBucketExistV2(bucketName))
			s3Client.createBucket(bucketName);

		if (file.getContentType().startsWith("image/")) {
			writeImage(file, bucketName, fileNameWithPath);
		} else {
			writeFile(file, bucketName, fileNameWithPath);
		}
	}

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

	private void writeImage(MultipartFile file, String bucketName, String fileName) {

		try {
			log.info(" the file name " + file.getName());
			log.info(" the file size " + file.getSize());
			log.info(" the file content " + file.getContentType());

			BufferedImage originalImage = ImageIO.read(file.getInputStream());

			if (null == originalImage) {
				Map<String, String> map = new HashMap<>();
				map.put("Image Source Unavailable", "Image File present in upload request is Invalid/Not Readable");
				throw new CustomException(map);
			}

			BufferedImage largeImage = Scalr.resize(originalImage, Method.QUALITY, Mode.AUTOMATIC, mediumWidth, null,
					Scalr.OP_ANTIALIAS);
			BufferedImage mediumImg = Scalr.resize(originalImage, Method.QUALITY, Mode.AUTOMATIC, mediumWidth, null,
					Scalr.OP_ANTIALIAS);
			BufferedImage smallImg = Scalr.resize(originalImage, Method.QUALITY, Mode.AUTOMATIC, smallWidth, null,
					Scalr.OP_ANTIALIAS);

			int lastIndex = fileName.length();
			String replaceString = fileName.substring(fileName.lastIndexOf('.'), lastIndex);
			String extension = FilenameUtils.getExtension(file.getOriginalFilename());
			String largePath = fileName.replace(replaceString, _large + replaceString);
			String mediumPath = fileName.replace(replaceString, _medium + replaceString);
			String smallPath = fileName.replace(replaceString, _small + replaceString);

			s3Client.putObject(getPutObjectRequest(bucketName, fileName, originalImage, extension));
			s3Client.putObject(getPutObjectRequest(bucketName, largePath, largeImage, extension));
			s3Client.putObject(getPutObjectRequest(bucketName, mediumPath, mediumImg, extension));
			s3Client.putObject(getPutObjectRequest(bucketName, smallPath, smallImg, extension));

			smallImg.flush();
			mediumImg.flush();
			originalImage.flush();

		} catch (Exception ioe) {

			Map<String, String> map = new HashMap<>();
			log.error("Exception while uploading the image: ", ioe);
			map.put("ERROR_AWS_S3_UPLOAD", "An error has occured while trying to upload image to S3 bucket.");
			throw new CustomException(map);
		}
	}

	public Resource getObject(String completeName) {

		long startTime = new Date().getTime();
		if (null == s3Client)
			getS3Client();

		int index = completeName.indexOf('/');
		String bucketName = completeName.substring(0, index);
		String fileNameWithPath = completeName.substring(index + 1, completeName.length());

		GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, fileNameWithPath);

		long beforeCalling = new Date().getTime();

		File localFile = new File(TEMP_FILE_PATH_NAME);
		s3Client.getObject(getObjectRequest, localFile);

		long afterAws = new Date().getTime();

		FileSystemResource fileSystemResource = new FileSystemResource(Paths.get(TEMP_FILE_PATH_NAME).toFile());

		long generateResource = new Date().getTime();

		log.info(" the time to prep Obj : " + (beforeCalling - startTime));
		log.info(" the time to get object from aws " + (afterAws - beforeCalling));
		log.info(" the time for creating resource form file : " + (generateResource - afterAws));
		return fileSystemResource;
	}

	public Map<String, String> getUrlMap(Map<String, Artifact> fileMap) {

		Map<String, String> urlMap = new HashMap<>();
		if (null == s3Client)
			getS3Client();

		fileMap.keySet().forEach(fileStoreId -> {

			Artifact artifact = fileMap.get(fileStoreId);
			String completeName = artifact.getFileName();
			int index = completeName.indexOf('/');
			String bucketName = completeName.substring(0, index);
			String fileNameWithPath = completeName.substring(index + 1, completeName.length());
			String replaceString = fileNameWithPath.substring(fileNameWithPath.lastIndexOf('.'),
					fileNameWithPath.length());

			Date time = new Date();
			long msec = time.getTime();
			msec += presignedUrlExpirytime;
			time.setTime(msec);

			if (artifact.getContentType().startsWith("image/")) {

				List<String> urlList = new ArrayList<>();
				for (int i = 0; i < 4; i++) {
					String currentname = fileNameWithPath;
					if (1 == i)
						currentname = fileNameWithPath.replace(replaceString, _large + replaceString);
					else if (2 == i)
						currentname = fileNameWithPath.replace(replaceString, _medium + replaceString);
					else if (3 == i)
						currentname = fileNameWithPath.replace(replaceString, _small + replaceString);

					GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(
							bucketName, currentname);
					generatePresignedUrlRequest.setExpiration(time);
					urlList.add(s3Client.generatePresignedUrl(generatePresignedUrlRequest).toString());
				}
				urlMap.put(fileStoreId,
						urlList.toString().replaceFirst("\\[", "").replaceFirst("\\]", "").replaceAll(", ", ","));
			} else {
				GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName,
						fileNameWithPath);
				generatePresignedUrlRequest.setExpiration(time);
				urlMap.put(fileStoreId, s3Client.generatePresignedUrl(generatePresignedUrlRequest).toString());
			}
		});
		return urlMap;
	}

	private AmazonS3 getS3Client() {
		if (null == s3Client)
			s3Client = AmazonS3ClientBuilder.standard()
					.withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(key, secretKey)))
					.withRegion(Regions.valueOf(awsRegion)).build();
		return s3Client;
	}

	private PutObjectRequest getPutObjectRequest(String bucketName, String key, BufferedImage originalImage,
			String extension) {

		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			ImageIO.write(originalImage, extension, os);
		} catch (IOException e) {
			log.error(" error while writing image to stream : {}", e);
			throw new RuntimeException(e);
		}
		ObjectMetadata metadata = new ObjectMetadata();
		metadata.setContentLength(os.size());
		return new PutObjectRequest(bucketName, key, new ByteArrayInputStream(os.toByteArray()), metadata);
	}
}
