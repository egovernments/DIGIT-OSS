package org.egov.chat.xternal.restendpoint;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.*;

@Slf4j
public class WSFetchLastBillTest {

    @Test
    public void testFetchBill() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper(new JsonFactory());
        String hardcodedResponseWithoutAttachment = "{\"message\":\"Dear Consumer,\\nWater bill of Consumer No.: 2113008277 for 2018-2019-Q2 (Jul to Sept) is Rs. 420.00/- . Payment Due Date: 03/07/2019 . Link to pay online http://bit.ly/SunamWater\\nThanks,\\nSunam-DEV Municipal Council\"}";
        ObjectNode wsResponse = (ObjectNode) objectMapper.readTree(hardcodedResponseWithoutAttachment);

        log.info(String.valueOf(wsResponse.at("/attachmentLink") != null));

    }


}