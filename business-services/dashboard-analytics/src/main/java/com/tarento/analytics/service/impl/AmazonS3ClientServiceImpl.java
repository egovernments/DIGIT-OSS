package com.tarento.analytics.service.impl;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.regions.Region;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.tarento.analytics.model.AmazonS3Config;
import com.tarento.analytics.service.AmazonS3ClientService;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;

@Component
public class AmazonS3ClientServiceImpl implements AmazonS3ClientService
{

    @Value("${filename.length}")
    private Integer filenameLength;

    @Value("${filename.useletters}")
    private Boolean useLetters;

    @Value("${filename.usenumbers}")
    private Boolean useNumbers;


    @Autowired
    private AmazonS3Config amazonS3Config;
    private String awsS3AudioBucket;
    private AmazonS3 amazonS3;
    private static final Logger logger = LoggerFactory.getLogger(AmazonS3ClientServiceImpl.class);

    @Autowired
    public AmazonS3ClientServiceImpl(Region awsRegion, AWSCredentialsProvider awsCredentialsProvider, String awsS3AudioBucket)
    {
        this.amazonS3 = AmazonS3ClientBuilder.standard()
                .withCredentials(awsCredentialsProvider)
                .withRegion(awsRegion.getName()).build();
        this.awsS3AudioBucket = awsS3AudioBucket;
    }

    @Async
    public String uploadFileToS3Bucket(MultipartFile multipartFile, boolean enablePublicReadAccess)
    {
        String orignalFileName = multipartFile.getOriginalFilename();
        String imageURL = "";
        FileOutputStream fos = null;
        try {

            String randomString = RandomStringUtils.random(filenameLength, useLetters, useNumbers);
            String imagetype = FilenameUtils.getExtension(orignalFileName);
            String fileName = System.currentTimeMillis() + randomString + "." +imagetype;
            //creating the file in the server (temporarily)
            File file = new File(fileName);
            fos = new FileOutputStream(file);

            fos.write(multipartFile.getBytes());

            PutObjectRequest putObjectRequest = new PutObjectRequest(this.awsS3AudioBucket, fileName, file);

            if (enablePublicReadAccess) {
                putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead);
            }
            this.amazonS3.putObject(putObjectRequest);

            imageURL = String.valueOf(amazonS3.getUrl(
                    amazonS3Config.getAWSS3AudioBucket(), //The S3 Bucket To Upload To
                    file.getName()));
            //removing the file created in the server
            file.delete();
        } catch (IOException | AmazonServiceException ex) {
            logger.error("error [" + ex.getMessage() + "] occurred while uploading [" + orignalFileName + "] ");
        }finally {
            try {
                fos.close();
            } catch (IOException e) {
                logger.error("Error occured while closing file output stream.");
            }
        }
        return imageURL;

    }

    @Async
    public void deleteFileFromS3Bucket(String fileName)
    {
        try {
            amazonS3.deleteObject(new DeleteObjectRequest(awsS3AudioBucket, fileName));
        } catch (AmazonServiceException ex) {
            logger.error("error [" + ex.getMessage() + "] occurred while removing [" + fileName + "] ");
        }
    }
}