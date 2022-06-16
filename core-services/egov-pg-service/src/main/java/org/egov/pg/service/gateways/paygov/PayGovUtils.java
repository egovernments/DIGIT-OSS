package org.egov.pg.service.gateways.paygov;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.zip.CRC32;
import java.util.zip.Checksum;

import org.egov.tracer.model.CustomException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
class PayGovUtils {



    static Map<String, List<String>> splitQuery(String params) {
        final Map<String, List<String>> query_pairs = new LinkedHashMap<String, List<String>>();
        try {
            final String[] pairs = params.split("&");
            for (String pair : pairs) {
                final int idx = pair.indexOf("=");
                final String key = idx > 0 ? URLDecoder.decode(pair.substring(0, idx), "UTF-8") : pair;
                if (!query_pairs.containsKey(key)) {
                    query_pairs.put(key, new LinkedList<>());
                }
                final String value = idx > 0 && pair.length() > idx + 1 ? URLDecoder.decode(pair.substring(idx + 1), "UTF-8") : null;
                query_pairs.get(key).add(value);
            }

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return query_pairs;
    }

    public static void validateTransaction(String txMsg, String secretKey) {
        int splitIndex =txMsg.lastIndexOf("|");
        String txChecksumvalue =  txMsg.substring(splitIndex+1) ;
        String generatedChecksum =generateCRC32Checksum(txMsg.substring(0, splitIndex) , secretKey);
        if(!generatedChecksum.equals( txChecksumvalue)){
            throw new CustomException("CHECKSUM_VALIDATION_FAILED", "Fraud transaction, Checksum did not match");
        }
    }


    public static String generateCRC32Checksum(String message, String secretKey) {
        String msg = message + "|" + secretKey;
        System.out.println("Input Key : "+ msg);
        byte bytes[] = msg.getBytes();
        Checksum checksum = new CRC32();
        // update the current checksum with the specified array of bytes
        checksum.update(bytes, 0, bytes.length);
        // get the current checksum value
        long checksumValue = checksum.getValue();
        System.out.println("CRC32 checksum for input string is: " + 	checksumValue);
        return String.valueOf(checksumValue);
    }
}
