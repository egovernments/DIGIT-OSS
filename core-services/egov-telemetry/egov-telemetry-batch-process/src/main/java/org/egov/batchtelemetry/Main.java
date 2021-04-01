package org.egov.batchtelemetry;

import org.egov.batchtelemetry.application.BatchApplication;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.util.concurrent.TimeUnit;

public class Main {

    public static void main(String args[]) throws Exception {

        BatchApplication batchApplication = new BatchApplication();

        Long startTime = null, endTime = null;

        if(args.length == 0) {
            LocalDate date = LocalDate.now();
            endTime = date.toDateTimeAtStartOfDay().getMillis();
            startTime = endTime - TimeUnit.DAYS.toMillis(1);
        } else if(args.length == 1) {
            DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd");
            DateTime dateTime = formatter.parseDateTime(args[0]);
            endTime = dateTime.getMillis();
            startTime = endTime - TimeUnit.DAYS.toMillis(1);
        } else if(args.length == 2) {
            startTime = Long.valueOf(args[0]);
            endTime = Long.valueOf(args[1]);
        }

        batchApplication.executeBatch(startTime, endTime);

    }

}
