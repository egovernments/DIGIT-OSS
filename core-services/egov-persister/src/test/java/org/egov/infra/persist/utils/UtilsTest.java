package org.egov.infra.persist.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.github.zafarkhaja.semver.Version;
import org.junit.jupiter.api.Test;

class UtilsTest {

    @Test
    void testGetSemVer() {

        Version actualSemVer = (new Utils()).getSemVer("1.0.2");
        assertEquals("", actualSemVer.getBuildMetadata());
        assertEquals("", actualSemVer.getPreReleaseVersion());
        assertEquals(2, actualSemVer.getPatchVersion());
        assertEquals(0, actualSemVer.getMinorVersion());
        assertEquals(1, actualSemVer.getMajorVersion());
    }


    @Test
    void testGetSemVer2() {

        Version actualSemVer = (new Utils()).getSemVer("1.0.2");
        assertEquals("", actualSemVer.getBuildMetadata());
        assertEquals("", actualSemVer.getPreReleaseVersion());
        assertEquals(2, actualSemVer.getPatchVersion());
        assertEquals(0, actualSemVer.getMinorVersion());
        assertEquals(1, actualSemVer.getMajorVersion());
    }

    @Test
    void testGetSemVer3() {

        assertNull((new Utils()).getSemVer(null));
    }

    @Test
    void testGetSemVerNullVer() {
        assertNull((new Utils()).getSemVer(null));
    }

    @Test
    void testGetSemVerEmptyString() {
        assertNull((new Utils()).getSemVer((String) ""));
    }

    @Test
    void testGetSemVer4() {
        assertNull((new Utils()).getSemVer("Version present in API request is: "));
    }

    @Test
    void testGetSemVer5() {

        assertNull((new Utils()).getSemVer("42"));
    }

    @Test
    void testGetSemVer6() {

        assertNull((new Utils()).getSemVer("1.0.21.0.2"));
    }

    @Test
    void testGetSemVer7() {

        assertNull((new Utils()).getSemVer((String) ""));
    }

    @Test
    void testGetSemVer8() {
        assertNull((new Utils()).getSemVer("Version present in API request is: "));
    }

    @Test
    void testGetSemVer9() {

        assertNull((new Utils()).getSemVer("42"));
    }

    @Test
    void testGetSemVer10() {

        assertNull((new Utils()).getSemVer("1.0.21.0.2"));
    }
}

