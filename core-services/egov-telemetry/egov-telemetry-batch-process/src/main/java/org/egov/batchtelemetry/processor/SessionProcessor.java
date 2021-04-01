package org.egov.batchtelemetry.processor;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import lombok.extern.slf4j.Slf4j;
import org.egov.batchtelemetry.config.AppProperties;
import org.egov.batchtelemetry.connector.ElasticsearchConnector;
import org.egov.batchtelemetry.constants.TelemetryConstants;
import org.egov.batchtelemetry.models.Edata;
import org.egov.batchtelemetry.models.Session;
import org.egov.batchtelemetry.models.SessionDetails;
import org.egov.batchtelemetry.producer.Producer;
import org.egov.batchtelemetry.util.SessionIterator;
import org.json.JSONObject;
import scala.Tuple2;

import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
public class SessionProcessor {

    private static ObjectMapper mapper;
    private static String kafkaTopic;
    private static AppProperties appProperties;
    private static Producer producer;
    private static Configuration configuration;

    public static Integer totalSessionCounter;

    private static List<String> existingUserIds;

    private static ElasticsearchConnector elasticsearchConnector;

    private static PathProcessor pathProcessor;

    public SessionProcessor() {
        init();
    }

    public static void init() {
        appProperties = new AppProperties();
        mapper = new ObjectMapper();
        producer = new Producer();
        kafkaTopic = appProperties.getOutputKafkaTopic();

        configuration = Configuration.defaultConfiguration().addOptions(Option.DEFAULT_PATH_LEAF_TO_NULL, Option.SUPPRESS_EXCEPTIONS);

        elasticsearchConnector = new ElasticsearchConnector();
        existingUserIds = elasticsearchConnector.getExistingUserIds();

        pathProcessor = new PathProcessor(appProperties);

        totalSessionCounter = 0;
    }


    public static void processRecords(Iterator<Tuple2<String, Map<String, Object>>> deviceReocrds) {
        SessionIterator sessionIterator = new SessionIterator(deviceReocrds);
        Session session;
        while (sessionIterator.hasNext()) {
            List<Map<String, Object>> sessionContent = sessionIterator.next();
            session = buildSession(sessionContent);
            pathProcessor.findAndPushPaths(sessionContent, session.getSessionId());
            pushSession(session);
            totalSessionCounter++;
        }
    }

    private static Session buildSession(List<Map<String, Object>> sessionContent) {

        String sessionIid = UUID.randomUUID().toString();
        String firstRecord = new JSONObject(sessionContent.get(0)).toString();
        String lastRecord = new JSONObject(sessionContent.get(sessionContent.size() - 1)).toString();
        String deviceId = JsonPath.using(configuration).parse(firstRecord).read("$.context.did");

        Long startTime = JsonPath.using(configuration).parse(firstRecord).read("$.ets");
        Long endTime = JsonPath.using(configuration).parse(lastRecord).read("$.ets");
        String timestamp = getTimestamp(startTime);

        String userId = getUserId(sessionContent);

        boolean isNewUser = false;

        if(existingUserIds.indexOf(userId) == -1) {
            isNewUser = true;
            existingUserIds.add(userId);
        }

        SessionDetails sessionDetails = buildSessionDetails(sessionContent);
        Edata edata = buildEdata(sessionContent);
        Session session = Session.builder().sessionId(sessionIid).timestamp(timestamp).deviceId(deviceId).userId(userId)
                .isNewUser(isNewUser).startTime(startTime).endTime(endTime).sessionDetails(sessionDetails).edata(edata)
                .type(TelemetryConstants.sessionTypeName).build();

        return session;
    }

    private static Edata buildEdata(List<Map<String, Object>> sessionContent) {
        String webBrowser = null, platform = null, cityId = null;

        for (Map<String, Object> record : sessionContent) {
            String jsonRecord = new JSONObject(record).toString();
            if(webBrowser == null)
                webBrowser = JsonPath.using(configuration).parse(jsonRecord).read("$.edata.web-browser");
            if(platform == null)
                platform = JsonPath.using(configuration).parse(jsonRecord).read("$.edata.platform");
            if(cityId == null)
                cityId = JsonPath.using(configuration).parse(jsonRecord).read("$.edata.cityId");
            if(webBrowser != null && platform != null && cityId != null)
                break;
        }

        return Edata.builder().webBrowser(webBrowser).platform(platform).cityId(cityId).build();
    }

    private static SessionDetails buildSessionDetails(List<Map<String, Object>> sessionContent) {

        Long startTime = JsonPath.using(configuration).parse(new JSONObject(sessionContent.get(0)).toString())
                .read("$.ets");
        Long endTime = JsonPath.using(configuration).parse(new
                JSONObject(sessionContent.get(sessionContent.size() - 1)).toString()).read("$.ets");
        Long duration = endTime - startTime;

        String exitPage = JsonPath.using(configuration).parse(new
                JSONObject(sessionContent.get(sessionContent.size() - 1)).toString()).read("$.edata.url");

        Integer pageCount = 0;
        String userType = null;

        for (Map<String, Object> record : sessionContent) {
            String jsonRecord = new JSONObject(record).toString();
            if("SUMMARY".equalsIgnoreCase(JsonPath.using(configuration).parse(jsonRecord).read("$.eid"))) {
                pageCount++;
            }
            if(userType == null) {
                String url = JsonPath.using(configuration).parse(jsonRecord).read("$.edata.url");
                if(url == null)
                    continue;
                if(url.contains("citizen"))
                    userType = TelemetryConstants.citizenUserType;
                if(url.contains("employee"))
                    userType = TelemetryConstants.employeeUserType;
            }
        }

        if(userType == null)
            userType = TelemetryConstants.commonUserType;

        return SessionDetails.builder().pageCount(pageCount).duration(duration).exitPage(exitPage).userType(userType)
                .build();
    }

    private static String getTimestamp(Long startTime) {
        Date date = new Date(Long.valueOf(startTime));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return formatter.format(date);
    }

    private static String getUserId(List<Map<String, Object>> sessionContent) {
        for (Map<String, Object> record :sessionContent) {
            String userId = JsonPath.using(configuration).parse(new JSONObject(record).toString()).read("$.actor.id");
            if(userId == null)
                continue;
            if(! userId.equalsIgnoreCase(TelemetryConstants.userNotFoundIdentifier))
                return userId;
        }
        return TelemetryConstants.userNotFoundIdentifier;
    }

    private static void pushSession(Session session) {
        JsonNode jsonNode = mapper.valueToTree(session);
        producer.push(kafkaTopic, session.getSessionId(), session.getStartTime(), jsonNode);
    }

    public static void closeSessionProcessor() {
        producer.close();
    }
}
