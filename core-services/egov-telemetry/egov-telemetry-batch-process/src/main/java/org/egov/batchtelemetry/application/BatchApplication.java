package org.egov.batchtelemetry.application;

import lombok.extern.slf4j.Slf4j;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.VoidFunction;
import org.egov.batchtelemetry.connector.ElasticsearchConnector;
import org.egov.batchtelemetry.processor.SessionProcessor;
import scala.Tuple2;

import java.util.Map;

@Slf4j
public class BatchApplication {

    public static void executeBatch(Long startTime, Long endTime) throws Exception {
        ElasticsearchConnector elasticsearchConnector = new ElasticsearchConnector();

        JavaPairRDD<String, Map<String, Object>> esRDD = elasticsearchConnector.getTelemetryRecords(startTime, endTime);

        log.info("Total Records read from ES: " + esRDD.count());

        SessionProcessor.init();

        JavaPairRDD<Object, Iterable<Tuple2<String, Map<String, Object>>>> deviceGroup = esRDD.groupBy(new Function<Tuple2<String,Map<String,Object>>, Object>() {
            @Override
            public Object call(Tuple2<String, Map<String, Object>> v1) throws Exception {
                return ( (Map<String, Object>) v1._2.get("context")).get("did");
            }
        });

        log.info("Unique Devices: " + deviceGroup.count());

        deviceGroup.foreach(new VoidFunction<Tuple2<Object, Iterable<Tuple2<String, Map<String, Object>>>>>() {
            @Override
            public void call(Tuple2<Object, Iterable<Tuple2<String, Map<String, Object>>>> objectIterableTuple2)
                    throws Exception {
                SessionProcessor.processRecords(objectIterableTuple2._2.iterator());
            }
        });

        log.info("Total Sessions: " + SessionProcessor.totalSessionCounter);

        SessionProcessor.closeSessionProcessor();

    }

}
