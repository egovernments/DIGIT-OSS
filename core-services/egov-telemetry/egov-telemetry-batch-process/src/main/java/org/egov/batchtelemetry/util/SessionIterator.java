package org.egov.batchtelemetry.util;

import org.egov.batchtelemetry.config.AppProperties;
import org.egov.batchtelemetry.constants.TelemetryConstants;
import lombok.extern.slf4j.Slf4j;
import scala.Tuple2;

import java.util.*;

@Slf4j
public class SessionIterator implements Iterator<List<Map<String, Object>>> {

    private Iterator<Tuple2<String, Map<String, Object>>> deviceReocrds;
    private Long sessionTimeout;
    private Integer recordCounter;
    private AppProperties appProperties;
    private List<Map<String, Object>> sortedRecords;

    public SessionIterator(Iterator<Tuple2<String, Map<String, Object>>> deviceReocrds) {
        appProperties = new AppProperties();
        sessionTimeout = appProperties.getSessionTimeout();
        recordCounter = 0;
        this.deviceReocrds = deviceReocrds;
        sortedRecords = sortRecords(getRecords());
    }

    private static List<Map<String, Object>> sortRecords(List<Map<String, Object>> jsonArray) {

        Collections.sort(jsonArray, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> j1, Map<String, Object> j2) {
                try {
                    Long time1 = (Long) j1.get("ets");
                    Long time2 = (Long) j2.get("ets");

                    if(time1 > time2) {
                        return 1;
                    } else if(time1 < time2) {
                        return -1;
                    } else {
                        return 0;
                    }
                } catch (Exception e) {
                    log.error(e.getMessage());
                    log.error("Error in Comparator while sorting records from a device based on ets");
                }
                return 0;
            }
        });
        return jsonArray;
    }

    private List<Map<String, Object>> getRecords() {
        List<Map<String, Object>> jsonArray = new ArrayList<>();

        while (deviceReocrds.hasNext()) {
            jsonArray.add(deviceReocrds.next()._2);
        }

        return jsonArray;
    }

    @Override
    public boolean hasNext() {
        if(recordCounter < sortedRecords.size())
            return true;
        return false;
    }

    @Override
    public List<Map<String, Object>> next() {
        if(recordCounter >= sortedRecords.size())
            return null;

        String userId = (String) ( (Map<String, Object>) sortedRecords.get(recordCounter).get("actor")).get("id");
        List<Map<String, Object>> sessionContent = new ArrayList<>();
        sessionContent.add(sortedRecords.get(recordCounter));
        recordCounter++;
        while (recordCounter < sortedRecords.size()) {
            if(checkForTimeout(sortedRecords.get(recordCounter - 1), sortedRecords.get(recordCounter))) {
                break;
            }

            sessionContent.add(sortedRecords.get(recordCounter));
            recordCounter++;
        }

        return sessionContent;
    }

    //Multiple users in same session
    //Needs revisit here
    private boolean checkForUserChange(Map<String, Object> record, Map<String, Object> nextRecord) {
        String user1 = (String) ( (Map<String, Object>) record.get("actor")).get("id");
        String user2 = (String) ( (Map<String, Object>) nextRecord.get("actor")).get("id");

        if(user1.equalsIgnoreCase(TelemetryConstants.userNotFoundIdentifier) ||
                user2.equalsIgnoreCase(TelemetryConstants.userNotFoundIdentifier)) {
            return false;
        } else if(user1.equalsIgnoreCase(user2)) {
            return false;
        }

        return true;
    }

    private boolean checkForTimeout(Map<String, Object> record, Map<String, Object> nextRecord) {
        if((Long) nextRecord.get("ets") - (Long) record.get("ets") > sessionTimeout) {
            return true;
        }
        return false;
    }

}
