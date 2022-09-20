package org.egov.auditservice.persisterauditclient;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Disabled;

import org.junit.jupiter.api.Test;

class PersisterConfigInitTest {

    ////@Test
    void testResolveAllConfigFolders() {

        PersisterConfigInit persisterConfigInit = new PersisterConfigInit();
        assertTrue(persisterConfigInit.resolveAllConfigFolders(new ArrayList<>(), "File Types To Resolve").isEmpty());
    }


    ////@Test
    void testResolveAllConfigFolders2() {

        PersisterConfigInit persisterConfigInit = new PersisterConfigInit();

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("[,]");
        assertThrows(RuntimeException.class,
                () -> persisterConfigInit.resolveAllConfigFolders(stringList, "File Types To Resolve"));
    }


    ////@Test
    void testResolveAllConfigFolders3() {

        PersisterConfigInit persisterConfigInit = new PersisterConfigInit();

        ArrayList<String> stringList = new ArrayList<>();
        stringList.add("42");
        List<String> actualResolveAllConfigFoldersResult = persisterConfigInit.resolveAllConfigFolders(stringList, "42");
        assertEquals(1, actualResolveAllConfigFoldersResult.size());
        assertEquals("42", actualResolveAllConfigFoldersResult.get(0));
    }

    ////@Test
    void testGetFilesInFolder() {

        PersisterConfigInit persisterConfigInit = new PersisterConfigInit();
        assertThrows(RuntimeException.class,
                () -> persisterConfigInit.getFilesInFolder("Base Folder Path", new ArrayList<>()));
    }


}

