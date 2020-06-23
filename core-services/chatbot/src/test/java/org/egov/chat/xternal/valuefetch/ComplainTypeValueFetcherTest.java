package org.egov.chat.xternal.valuefetch;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

@Slf4j
public class ComplainTypeValueFetcherTest {

    private ObjectMapper objectMapper;

    @Before
    public void init() {
        objectMapper = new ObjectMapper(new JsonFactory());
    }

    @Test
    public void testComplaintTypeCodeForValue() {
        String code = "pgr.complaint.category.StreetLightNotWorking";
        String complaintTypeCode = code.substring(code.lastIndexOf(".") + 1);
        log.info(complaintTypeCode);
    }

}