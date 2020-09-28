package org.egov.enc.keymanagement.masterkey.providers;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.AWSKMSClientBuilder;
import com.amazonaws.services.kms.model.DecryptRequest;
import com.amazonaws.services.kms.model.DecryptResult;
import com.amazonaws.services.kms.model.EncryptRequest;
import com.amazonaws.services.kms.model.EncryptResult;
import org.egov.enc.keymanagement.masterkey.MasterKeyProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
@Order(1)
@ConditionalOnProperty( value = "master.password.provider", havingValue = "awskms")
public class AwsKmsMasterKey implements MasterKeyProvider {


    @Value("${aws.kms.access.key:}")
    private String awsAccessKey;
    @Value("${aws.kms.secret.key:}")
    private String awsSecretKey;
    @Value("${aws.kms.region:}")
    private String awsRegion;

    @Value("${aws.kms.master.password.key.id:}")
    private String masterPasswordKeyId;

    private AWSKMS awskms;

    @PostConstruct
    public void initializeConnection() {
        AWSStaticCredentialsProvider awsCredentials = new AWSStaticCredentialsProvider(new BasicAWSCredentials(awsAccessKey, awsSecretKey));
        this.awskms = AWSKMSClientBuilder.standard().withCredentials(awsCredentials).withRegion(awsRegion).build();
    }

    @Override
    public String encryptWithMasterPassword(String plainKey) throws Exception {
        EncryptRequest encryptRequest = new EncryptRequest();
        encryptRequest.setKeyId(masterPasswordKeyId);
        encryptRequest.setPlaintext(ByteBuffer.wrap(plainKey.getBytes(StandardCharsets.UTF_8)));

        EncryptResult encryptResult = awskms.encrypt(encryptRequest);
        return Base64.getEncoder().encodeToString(encryptResult.getCiphertextBlob().array());
    }

    @Override
    public String decryptWithMasterPassword(String encryptedKey) throws Exception {
        DecryptRequest decryptRequest = new DecryptRequest();
        decryptRequest.setKeyId(masterPasswordKeyId);
        decryptRequest.setCiphertextBlob(ByteBuffer.wrap(Base64.getDecoder().decode(encryptedKey)));

        DecryptResult decryptResult = awskms.decrypt(decryptRequest);
        return new String(decryptResult.getPlaintext().array(), StandardCharsets.UTF_8);
    }
}
