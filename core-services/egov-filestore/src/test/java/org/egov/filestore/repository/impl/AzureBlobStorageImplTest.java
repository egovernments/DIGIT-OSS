package org.egov.filestore.repository.impl;

import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AzureBlobStorageImplTest {

    @Test
    void testUpload() throws UnsupportedEncodingException {
        AzureBlobStorageImpl azureBlobStorageImpl = new AzureBlobStorageImpl();
        ByteArrayInputStream inputStream = new ByteArrayInputStream("AAAAAAAA".getBytes("UTF-8"));
        assertThrows(CustomException.class, () -> azureBlobStorageImpl.upload(null, "Complete Path", inputStream, 3L,
                new BufferedImage(1, 1, 1), "Extension"));
    }

    @Test
    void testUploadDefaultArguments() {
        AzureBlobStorageImpl azureBlobStorageImpl = new AzureBlobStorageImpl();
        assertThrows(CustomException.class,
                () -> azureBlobStorageImpl.upload(null, "Complete Path", null, 3L, new BufferedImage(1, 1, 1), "Extension"));
    }

    @Test
    void testUploadNullImage() {
        assertThrows(CustomException.class,
                () -> (new AzureBlobStorageImpl()).upload(null, "Complete Path", null, 3L, null, "Extension"));
    }

    @Test
    void testConstructor() {
        AzureBlobStorageImpl actualAzureBlobStorageImpl = new AzureBlobStorageImpl();
        assertNull(actualAzureBlobStorageImpl.getFiles(new ArrayList<>()));
    }
}

