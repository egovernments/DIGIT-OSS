package org.egov.enc.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class Plaintext {

    private String tenantId;

    private String plaintext;

    public Plaintext(String plaintext) {
        this.plaintext = plaintext;
    }

    @Override
    public String toString() {
        return plaintext;
    }
}