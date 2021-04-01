package org.egov.enc.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.tracer.model.CustomException;

@Getter
@AllArgsConstructor
public class Signature   {

    private Integer keyId;

    private String signatureValue;

    public Signature(String signatureValue) {
        try{
            String[] cipherArray = signatureValue.split("\\|");
            this.keyId = Integer.parseInt(cipherArray[0]);
            this.signatureValue = cipherArray[1];
        } catch (Exception e) {
            throw new CustomException(signatureValue + ": Invalid Signature", signatureValue + ": Invalid Signature");
        }
    }

    @Override
    public String toString() {
        return String.valueOf(keyId) + "|" + signatureValue;
    }
}

