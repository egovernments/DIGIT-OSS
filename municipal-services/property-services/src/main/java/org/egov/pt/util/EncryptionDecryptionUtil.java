package org.egov.pt.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.encryption.EncryptionService;
import org.egov.encryption.audit.AuditService;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.io.IOException;
import java.util.*;

@Slf4j
@Component
public class EncryptionDecryptionUtil {

    private EncryptionService encryptionService;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private AuditService auditService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value(("${state.level.tenant.id}"))
    private String stateLevelTenantId;

    @Value(("${property.decryption.abac.enabled}"))
    private boolean abacEnabled;
    public EncryptionDecryptionUtil(EncryptionService encryptionService) {
        this.encryptionService = encryptionService;
    }

    public <T> T encryptObject(Object objectToEncrypt, String key, Class<T> classType) {
        try {
            if (objectToEncrypt == null) {
                return null;
            }
            T encryptedObject = encryptionService.encryptJson(objectToEncrypt, key, config.getStateLevelTenantId(), classType);
            if (encryptedObject == null) {
                throw new CustomException("ENCRYPTION_NULL_ERROR", "Null object found on performing encryption");
            }
            return encryptedObject;
        } catch (Exception e) {
            log.error("Unknown Error occurred while encrypting", e);
            throw new CustomException("UNKNOWN_ERROR", "Unknown error occurred in encryption process");
        }
    }

    public <E, P> P decryptObject(Object objectToDecrypt, String key, Class<E> classType, RequestInfo requestInfo) {

        try {
            boolean objectToDecryptNotList = false;
            if (objectToDecrypt == null) {
                return null;
            }

           if (!(objectToDecrypt instanceof List)) {
                objectToDecryptNotList = true;
                objectToDecrypt = Collections.singletonList(objectToDecrypt);
            }

            Map<String, String> keyPurposeMap = getKeyToDecrypt(objectToDecrypt);
            String purpose = keyPurposeMap.get("PropertyEncDisabledSearch");

            if(key.equalsIgnoreCase(PTConstants.PROPERTY_MODEL))
                key = keyPurposeMap.get("key");

            P decryptedObject = (P) encryptionService.decryptJson(requestInfo, objectToDecrypt, key, purpose, classType);

            if (decryptedObject == null) {
                throw new CustomException("DECRYPTION_NULL_ERROR", "Null object found on performing decryption");
            }

            if (objectToDecryptNotList) {
                decryptedObject = (P) ((List<E>) decryptedObject).get(0);
            }
            return decryptedObject;
        } catch (IOException | HttpClientErrorException | HttpServerErrorException | ResourceAccessException e) {
            log.error("Error occurred while decrypting", e);
            throw new CustomException("DECRYPTION_SERVICE_ERROR", "Error occurred in decryption process");
        } catch (Exception e) {
            log.error("Unknown Error occurred while decrypting", e);
            throw new CustomException("UNKNOWN_ERROR", "Unknown error occurred in decryption process");
        }
    }

    /**
     * Setting a fake user Info in case of open API calls
     * 
     * @param requestInfo
     * @return
     */
	private RequestInfo copyRequestInfoForEncryption(RequestInfo requestInfo) {
		
		RequestInfo requestInfoForDecryption;
		User fakeUSerInfo = User.builder().uuid("no uuid").type("EMPLOYEE").build();
		
		if ( requestInfo != null ) {
			
			 requestInfoForDecryption = RequestInfo.builder()
		    			.correlationId(requestInfo.getCorrelationId())
		    			.authToken(requestInfo.getAuthToken())
		    			.apiId(requestInfo.getApiId())
		    			.msgId(requestInfo.getMsgId())
		    			.build();
			 
				if (requestInfo.getUserInfo() == null)
					requestInfoForDecryption.setUserInfo(fakeUSerInfo);
				else
					requestInfoForDecryption.setUserInfo(requestInfo.getUserInfo());

		} else {
			
			requestInfoForDecryption = RequestInfo.builder().
					userInfo(fakeUSerInfo)
					.build();
		}
		

		return requestInfoForDecryption;
	}

	private User getEncrichedandCopiedUserInfo(User userInfo) {

		List<Role> newRoleList = new ArrayList<>();
		Boolean isUserTypeRoleFound = false;
		List<Role> roles = userInfo.getRoles();

		if (!CollectionUtils.isEmpty(roles)) {

			for (Role role : roles) {

				if (role.getCode().equalsIgnoreCase(userInfo.getType()))
					isUserTypeRoleFound = true;

                Role newRole = Role.builder()
                		.tenantId(role.getTenantId())
                		.code(role.getCode())
                		.name(role.getName())
                		.id(role.getId())
                		.build();
                
                newRoleList.add(newRole);
            }
        }

        if (!isUserTypeRoleFound) {
        	
            Role roleFromtype = Role.builder()
            		.tenantId(userInfo.getTenantId())
            		.code(userInfo.getType())
            		.name(userInfo.getType())
            		.build();
            newRoleList.add(roleFromtype);
        }
        
        return User.builder()
        		.roles(newRoleList)
        		.id(userInfo.getId())
        		.name(userInfo.getName())
                .type(userInfo.getType())
                .uuid(userInfo.getUuid())
                .emailId(userInfo.getEmailId())
                .userName(userInfo.getUserName())
                .tenantId(userInfo.getTenantId())
                .mobileNumber(userInfo.getMobileNumber())
                .build();
    }

    public Map<String,String> getKeyToDecrypt(Object objectToDecrypt) {
        Map<String,String> keyPurposeMap = new HashMap<>();

        if (!abacEnabled){
            keyPurposeMap.put("key","PropertyDecrypDisabled");
            keyPurposeMap.put("purpose","AbacDisabled");
        }
        else{
            keyPurposeMap.put("key","Property");
            keyPurposeMap.put("purpose","PropertySearch");
        }

        return keyPurposeMap;
    }
}
