package org.egov.enc.services;

import lombok.extern.slf4j.Slf4j;
import org.egov.enc.config.AppProperties;
import org.egov.enc.models.MethodEnum;
import org.egov.enc.models.ModeEnum;
import org.egov.enc.utils.Constants;
import org.egov.enc.utils.ProcessJSONUtil;
import org.egov.enc.web.models.EncReqObject;
import org.egov.enc.web.models.EncryptionRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.LinkedList;


@Slf4j
@Service
public class EncryptionService {

    @Autowired
    private AppProperties appProperties;
    @Autowired
    private ProcessJSONUtil processJSONUtil;
    @Autowired
    private KeyManagementService keyManagementService;

    public Object encrypt(EncryptionRequest encryptionRequest) throws InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeySpecException, InvalidKeyException {
        LinkedList<Object> outputList = new LinkedList<>();
        for(EncReqObject encReqObject : encryptionRequest.getEncryptionRequests()) {
            if(!keyManagementService.checkIfTenantExists(encReqObject.getTenantId())) {
                throw new CustomException(encReqObject.getTenantId() + Constants.TENANT_NOT_FOUND,
                        encReqObject.getTenantId() + Constants.TENANT_NOT_FOUND );
            }
            MethodEnum encryptionMethod = MethodEnum.fromValue(appProperties.getTypeToMethodMap().get(encReqObject.getType()));
            if(encryptionMethod == null) {
                throw new CustomException(encReqObject.getType() + Constants.INVALD_DATA_TYPE,
                        encReqObject.getType() + Constants.INVALD_DATA_TYPE);
            }
            outputList.add(processJSONUtil.processJSON(encReqObject.getValue(), ModeEnum.ENCRYPT, encryptionMethod, encReqObject.getTenantId()));
        }
        return outputList;
    }

    public Object decrypt(Object decryptionRequest) throws InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeySpecException, InvalidKeyException {
        return processJSONUtil.processJSON(decryptionRequest, ModeEnum.DECRYPT, null, null);
    }
}
