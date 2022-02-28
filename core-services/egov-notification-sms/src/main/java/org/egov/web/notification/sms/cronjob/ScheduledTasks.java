//package org.egov.web.notification.sms.cronjob;
//
//import jdk.internal.org.jline.utils.InputStreamReader;
//import org.egov.web.notification.sms.models.Report;
//import org.springframework.scheduling.annotation.EnableScheduling;
//import org.springframework.scheduling.annotation.Scheduled;
//import sun.net.www.protocol.http.HttpURLConnection;
//
//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.InputStream;
//import java.net.URL;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//
//@EnableScheduling
//public class ScheduledTasks {
//
//    @Scheduled(fixedRate = 300000)
//    public void getTasks() throws IOException {
//        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
//        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime prev = now.minusMinutes(5);
//        String User = "egovsms";
//        String password = "egovsms1";
//        String format = "%s?user=%s&password=%s&fromdate=%s&todate=%s";
//        String host = "http://api.smscountry.com/smscwebservices_bulk_reports.aspx";
//        String uri = String.format(format, host, User, password, now, prev);
//
//        HttpURLConnection conn = (HttpURLConnection) new URL(uri).openConnection();
//        int responseCode = conn.getResponseCode();
//        InputStream inputStream;
//        if (200 <= responseCode && responseCode <= 299) {
//            inputStream = conn.getInputStream();
//        } else {
//            inputStream = conn.getErrorStream();
//        }
//        BufferedReader in = new BufferedReader(
//                new InputStreamReader(
//                        inputStream));
//
//        StringBuilder response = new StringBuilder();
//        String currentLine;
//
//        while ((currentLine = in.readLine()) != null)
//            response.append(currentLine);
//
//        in.close();
//
//        String[] reports = response.toString().split("#");
//        Report temp = new Report();
//
//        for(String report : reports) {
//            String[] fields = report.split("~");
//            temp.setJobno(fields[0]);
//            temp.setMobilenumber(fields[1]);
//            temp.setMessagestatus(Integer.parseInt(fields[2]));
//            temp.setDoneTime();
//
//
//        }
//
//    }
//}
