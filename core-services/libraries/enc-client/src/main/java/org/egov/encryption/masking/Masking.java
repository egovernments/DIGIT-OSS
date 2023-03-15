package org.egov.encryption.masking;

public interface Masking {

    public String getMaskingTechnique();

    public <T> T maskData(T data);

}
