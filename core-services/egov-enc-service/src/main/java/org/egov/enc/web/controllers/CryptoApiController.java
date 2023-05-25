package org.egov.enc.web.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.enc.services.KeyManagementService;
import org.egov.enc.services.EncryptionService;
import org.egov.enc.services.SignatureService;
import org.egov.enc.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Slf4j
@Controller
public class CryptoApiController{

    private final ObjectMapper objectMapper;
    private final HttpServletRequest request;

    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private SignatureService signatureService;
    @Autowired
    private KeyManagementService keyManagementService;

    @Autowired
    public CryptoApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    @RequestMapping(value="/crypto/v1/_encrypt", method = RequestMethod.POST)
    public ResponseEntity<Object> cryptoEncryptPost(@Valid @RequestBody EncryptionRequest encryptionRequest) throws Exception {
        return new ResponseEntity<>(encryptionService.encrypt(encryptionRequest), HttpStatus.OK );
    }

    @RequestMapping(value="/crypto/v1/_decrypt", method = RequestMethod.POST)
    public ResponseEntity<Object> cryptoDecryptPost(@Valid @RequestBody Object decryptionRequest) throws Exception {
        return new ResponseEntity<>(encryptionService.decrypt(decryptionRequest), HttpStatus.OK );
    }

    @RequestMapping(value="/crypto/v1/_sign", method = RequestMethod.POST)
    public ResponseEntity<SignResponse> cryptoSignPost(@Valid @RequestBody SignRequest signRequest) throws Exception {
        return new ResponseEntity<>(signatureService.hashAndSign(signRequest), HttpStatus.OK);
    }

    @RequestMapping(value = "/crypto/v1/_verify", method = RequestMethod.POST)
    public ResponseEntity<VerifyResponse> cryptoVerifyPost(@Valid @RequestBody VerifyRequest verifyRequest) throws Exception {
        return new ResponseEntity<>(signatureService.hashAndVerify(verifyRequest), HttpStatus.OK);
    }

    @RequestMapping(value = "/crypto/v1/_rotateallkeys", method=RequestMethod.POST)
    public ResponseEntity<RotateKeyResponse> cryptoRotateAllKeys(@Valid @RequestBody RotateKeyRequest rotateKeyRequest)
            throws Exception {
        return new ResponseEntity<RotateKeyResponse>(keyManagementService.rotateAllKeys(), HttpStatus.OK);
    }

    @RequestMapping(value = "/crypto/v1/_rotatekey", method=RequestMethod.POST)
    public ResponseEntity<RotateKeyResponse> cryptoRotateKeys(@Valid @RequestBody RotateKeyRequest rotateKeyRequest) throws
            Exception {
        return new ResponseEntity<RotateKeyResponse>(keyManagementService.rotateKey(rotateKeyRequest), HttpStatus.OK);
    }

}
