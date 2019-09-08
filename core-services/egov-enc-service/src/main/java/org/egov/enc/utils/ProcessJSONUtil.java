package org.egov.enc.utils;

import lombok.extern.slf4j.Slf4j;
import org.egov.enc.keymanagement.KeyStore;
import org.egov.enc.models.Ciphertext;
import org.egov.enc.models.MethodEnum;
import org.egov.enc.models.ModeEnum;
import org.egov.enc.models.Plaintext;
import org.egov.enc.services.SymmetricEncryptionService;
import org.egov.enc.services.AsymmetricEncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.*;

/*
    ProcessJSONUtil is used to navigate through a JSON Object.
    All the values will be encrypted, keys will remain as it is.
*/

@Slf4j
@Component
public class ProcessJSONUtil {

    @Autowired
    private SymmetricEncryptionService symmetricEncryptionService;
    @Autowired
    private AsymmetricEncryptionService asymmetricEncryptionService;
    @Autowired
    private KeyStore keyStore;

    //The input object may be JSON Object or a JSON Array
    public Object processJSON(Object inputObject, ModeEnum mode, MethodEnum method, String tenantId) throws Exception {
        Object outputObject;

        if(inputObject instanceof Map) {
            outputObject = processJSONMap((Map) inputObject, mode, method, tenantId);
        } else if(inputObject instanceof List) {
            outputObject = processJSONList((List) inputObject, mode, method, tenantId);
        } else {
            outputObject = processValue(inputObject, mode, method, tenantId);
        }
        return outputObject;
    }

    //Navigate through JSON Object
    private Map<String, Object> processJSONMap(Map jsonMap, ModeEnum mode, MethodEnum method, String tenantId) throws Exception {
        HashMap<String, Object> outputJSONMap = new HashMap<>();
        Set<String> keySet = jsonMap.keySet();
        Iterator<String> keyNames = keySet.iterator();
        while(keyNames.hasNext()) {
            String key = keyNames.next();
            if(jsonMap.get(key) instanceof List) {
                outputJSONMap.put(key, processJSONList((List) jsonMap.get(key), mode, method, tenantId));
            } else if(jsonMap.get(key) instanceof Map) {
                outputJSONMap.put(key, processJSONMap((Map) jsonMap.get(key), mode, method, tenantId));
            } else {
                outputJSONMap.put(key, processValue(jsonMap.get(key), mode, method, tenantId));
            }
        }
        return outputJSONMap;
    }

    //Navigate through JSON Array
    private List<Object> processJSONList(List jsonList, ModeEnum mode, MethodEnum method, String tenantId) throws Exception {
        ArrayList<Object> outputJSONList = new ArrayList<>();
        for(int i = 0; i < jsonList.size(); i++) {
            if(jsonList.get(i) instanceof List) {
                outputJSONList.add(i, processJSONList((List) jsonList.get(i), mode, method, tenantId));
            } else if(jsonList.get(i) instanceof Map) {
                outputJSONList.add(i, processJSONMap((Map) jsonList.get(i), mode, method, tenantId));
            } else {
                outputJSONList.add(i, processValue(jsonList.get(i), mode, method, tenantId));
            }
        }
        return outputJSONList;
    }

    //Each value in the object will be encrypted
    private String processValue(Object value, ModeEnum mode, MethodEnum method, String tenantId) throws NoSuchPaddingException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidKeySpecException {
        if(value == null) {
            return null;
        }
        if(mode.equals(ModeEnum.ENCRYPT)) {
            Ciphertext ciphertext;
            Plaintext plaintext = new Plaintext(tenantId, value.toString());
            if(method.equals(MethodEnum.SYM)) {
                ciphertext = symmetricEncryptionService.encrypt(plaintext);
            } else {
                ciphertext = asymmetricEncryptionService.encrypt(plaintext);
            }
            return ciphertext.toString();
        }
        else {
            Plaintext plaintext;
            Ciphertext ciphertext = new Ciphertext(value.toString());
            method = keyStore.getTypeOfKey(ciphertext.getKeyId());
            if(method.equals(MethodEnum.SYM)) {
                plaintext = symmetricEncryptionService.decrypt(ciphertext);
            } else {
                plaintext = asymmetricEncryptionService.decrypt(ciphertext);
            }
            return plaintext.toString();
        }
    }

}
