package org.egov.infra.indexer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.IndexerApplicationRunnerImpl;
import org.egov.infra.indexer.bulkindexer.BulkIndexer;
import org.egov.infra.indexer.models.IndexJob;
import org.egov.infra.indexer.models.IndexJob.StatusEnum;
import org.egov.infra.indexer.models.IndexJobWrapper;
import org.egov.infra.indexer.producer.IndexerProducer;
import org.egov.infra.indexer.util.IndexerUtils;
import org.egov.infra.indexer.util.ResponseInfoFactory;
import org.egov.infra.indexer.web.contract.Index;
import org.egov.infra.indexer.web.contract.Mapping;
import org.egov.infra.indexer.web.contract.Mapping.ConfigKeyEnum;
import org.egov.infra.indexer.web.contract.ReindexRequest;
import org.egov.infra.indexer.web.contract.ReindexResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class ReindexService {

	@Autowired
	private BulkIndexer bulkIndexer;

	@Autowired
	private IndexerApplicationRunnerImpl runner;

	@Autowired
	private IndexerUtils indexerUtils;

	@Autowired
	private ResponseInfoFactory factory;

	@Autowired
	private IndexerProducer indexerProducer;

	@Value("${egov.core.reindex.topic.name}")
	private String reindexTopic;

	@Value("${egov.core.legacyindex.topic.name}")
	private String legacyIndexTopic;

	@Value("${egov.indexer.persister.create.topic}")
	private String persisterCreate;

	@Value("${egov.indexer.persister.update.topic}")
	private String persisterUpdate;

	@Value("${reindex.pagination.size.default}")
	private Integer defaultPageSizeForReindex;

	@Value("${legacyindex.pagination.size.default}")
	private Integer defaultPageSizeForLegacyindex;

	@Value("${egov.service.host}")
	private String serviceHost;

	@Value("${egov.infra.indexer.host}")
	private String esHostUrl;

	@Value("${egov.core.no.of.index.threads}")
	private Integer noOfIndexThreads;

	@Value("${egov.core.index.thread.poll.ms}")
	private Long indexThreadPollInterval;

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);
	private final ScheduledExecutorService schedulerofChildThreads = Executors.newScheduledThreadPool(1);

	private static Long recordsIndexed = 0L;
	
	/**
	 * Creates a reindex job by creating its entry into the eg_indexer_job table and on success returns response with estimated time for job, total records etc
	 * 
	 * @param reindexRequest
	 * @return
	 */
	public ReindexResponse createReindexJob(ReindexRequest reindexRequest) {
		Map<String, Mapping> mappingsMap = runner.getMappingMaps();
		ReindexResponse reindexResponse = null;
		String uri = indexerUtils.getESSearchURL(reindexRequest);
		Object response = bulkIndexer.getESResponse(uri, null, null);
		Integer total = JsonPath.read(response, "$.hits.total");
		StringBuilder url = new StringBuilder();
		Index index = mappingsMap.get(reindexRequest.getReindexTopic()).getIndexes().get(0);
		url.append(esHostUrl).append(index.getName()).append("/").append(index.getType()).append("/_search");
		reindexResponse = ReindexResponse.builder().totalRecordsToBeIndexed(total)
				.estimatedTime(indexerUtils.fetchEstimatedTime(total))
				.message("Please hit the 'url' for the newly indexed data after the mentioned 'estimated time'.")
				.url(url.toString())
				.responseInfo(factory.createResponseInfoFromRequestInfo(reindexRequest.getRequestInfo(), true)).build();
		IndexJob job = IndexJob.builder().jobId(UUID.randomUUID().toString()).jobStatus(StatusEnum.INPROGRESS)
				.typeOfJob(ConfigKeyEnum.REINDEX).oldIndex(reindexRequest.getIndex() + "/" + reindexRequest.getType())
				.requesterId(reindexRequest.getRequestInfo().getUserInfo().getUuid())
				.newIndex(index.getName() + "/" + index.getType()).totalTimeTakenInMS(0L)
				.tenantId(reindexRequest.getTenantId()).recordsToBeIndexed(total).totalRecordsIndexed(0)
				.auditDetails(
						indexerUtils.getAuditDetails(reindexRequest.getRequestInfo().getUserInfo().getUuid(), true))
				.build();
		reindexRequest.setJobId(job.getJobId());
		reindexRequest.setStartTime(new Date().getTime());
		reindexRequest.setTotalRecords(total);
		IndexJobWrapper wrapper = IndexJobWrapper.builder().requestInfo(reindexRequest.getRequestInfo()).job(job)
				.build();
		indexerProducer.producer(reindexTopic, reindexRequest);
		indexerProducer.producer(persisterCreate, wrapper);
		reindexResponse.setJobId(job.getJobId());

		return reindexResponse;
	}

	/**
	 * Method to start the index thread for indexing activity
	 * 
	 * @param reindexRequest
	 * @return
	 */
	public Boolean beginReindex(ReindexRequest reindexRequest) {
		indexThread(reindexRequest);
		return true;
	}

	/**
	 * Index thread which performs the indexing job. It operates as follows: 1.
	 * Based on the Request, it makes API calls in batches to the external service
	 * 2. With every batch fetched, data is sent to child threads for processing 3.
	 * Child threads perform primary data transformation if required and then hand
	 * it over to another esIndexer method 4. The esIndexer method performs checks
	 * and transformations pas per the config and then posts the data to es in bulk
	 * 5. The process repeats until all the records are indexed.
	 * 
	 * @param reindexRequest
	 */
	private void indexThread(ReindexRequest reindexRequest) {
		final Runnable legacyIndexer = new Runnable() {
			boolean threadRun = true;

			public void run() {
				if (threadRun) {
					Boolean isProccessDone = false;
					increaseMaxResultWindow(reindexRequest, reindexRequest.getTotalRecords());
					String uri = indexerUtils.getESSearchURL(reindexRequest);
					ObjectMapper mapper = indexerUtils.getObjectMapper();
					Integer from = 0;
					Integer size = null == reindexRequest.getBatchSize() ? defaultPageSizeForReindex
							: reindexRequest.getBatchSize();
					while (!isProccessDone) {
						Object request = indexerUtils.getESSearchBody(from, size);
						Object response = bulkIndexer.getESResponse(uri, request, "POST");
						if (null != response) {
							List<Object> hits = JsonPath.read(response, "$.hits.hits");
							if (CollectionUtils.isEmpty(hits)) {
								isProccessDone = true;
								break;
							} else {
								List<Object> modifiedHits = new ArrayList<>();
								hits.stream().forEach(hit -> {
									if (!isHitAnInvalidRecord(JsonPath.read(hit, "$._source"))) {
										modifiedHits.add(JsonPath.read(hit, "$._source"));
									}
								});
								Map<String, Object> requestToReindex = new HashMap<>();
								requestToReindex.put("hits", modifiedHits);
								childThreadExecutor(reindexRequest, mapper, requestToReindex, modifiedHits.size());
							}
						} else {
							IndexJob job = IndexJob.builder().jobId(reindexRequest.getJobId())
									.auditDetails(indexerUtils.getAuditDetails(
											reindexRequest.getRequestInfo().getUserInfo().getUuid(), false))
									.totalRecordsIndexed(from)
									.totalTimeTakenInMS(new Date().getTime() - reindexRequest.getStartTime())
									.jobStatus(StatusEnum.FAILED).build();
							IndexJobWrapper wrapper = IndexJobWrapper.builder()
									.requestInfo(reindexRequest.getRequestInfo()).job(job).build();
							indexerProducer.producer(persisterUpdate, wrapper);
							threadRun = false;
							log.info("Porcess failed! for data from: " + from + "and size: " + size);
							break;
						}
						IndexJob job = IndexJob.builder().jobId(reindexRequest.getJobId())
								.auditDetails(indexerUtils.getAuditDetails(
										reindexRequest.getRequestInfo().getUserInfo().getUuid(), false))
								.totalTimeTakenInMS(new Date().getTime() - reindexRequest.getStartTime())
								.jobStatus(StatusEnum.INPROGRESS).totalRecordsIndexed(from).build();
						IndexJobWrapper wrapper = IndexJobWrapper.builder().requestInfo(reindexRequest.getRequestInfo())
								.job(job).build();
						indexerProducer.producer(persisterUpdate, wrapper);

						from += size;
					}
					if (isProccessDone) {
						IndexJob job = IndexJob.builder().jobId(reindexRequest.getJobId())
								.auditDetails(indexerUtils.getAuditDetails(
										reindexRequest.getRequestInfo().getUserInfo().getUuid(), false))
								.totalRecordsIndexed(reindexRequest.getTotalRecords())
								.totalTimeTakenInMS(new Date().getTime() - reindexRequest.getStartTime())
								.jobStatus(StatusEnum.COMPLETED).build();
						IndexJobWrapper wrapper = IndexJobWrapper.builder().requestInfo(reindexRequest.getRequestInfo())
								.job(job).build();
						indexerProducer.producer(persisterUpdate, wrapper);
					}
				}
				threadRun = false;
			}
		};
		scheduler.schedule(legacyIndexer, indexThreadPollInterval, TimeUnit.MILLISECONDS);
	}

	/**
	 * Child threads which perform the primary data transformation and pass it on to
	 * the esIndexer method
	 * 
	 * @param reindexRequest
	 * @param mapper
	 * @param requestToReindex
	 * @param resultSize
	 */
	public void childThreadExecutor(ReindexRequest reindexRequest, ObjectMapper mapper, Object requestToReindex,
			Integer resultSize) {
		final Runnable childThreadJob = new Runnable() {
			boolean threadRun = true;

			public void run() {
				if (threadRun) {
					try {
						indexerProducer.producer(reindexRequest.getReindexTopic(), requestToReindex);
						recordsIndexed += resultSize;
						log.info("Records indexed: " + recordsIndexed);
					} catch (Exception e) {
						log.error("Error while indexing records: " + e.getMessage());
						threadRun = false;
					}
					threadRun = false;
				}
			}
		};
		schedulerofChildThreads.scheduleAtFixedRate(childThreadJob, 0, indexThreadPollInterval + 50,
				TimeUnit.MILLISECONDS);

	}

	/**
	 * Utility method to check if the list of records fetched contains any invalid
	 * record
	 * 
	 * @param hit
	 * @return
	 */
	public boolean isHitAnInvalidRecord(Object hit) {
		ObjectMapper mapper = indexerUtils.getObjectMapper();
		boolean isInvalidRecord = false;
		if (null == hit) {
			isInvalidRecord = true;
			return isInvalidRecord;
		} else {
			if (hit.toString().equalsIgnoreCase("null")) {
				isInvalidRecord = true;
				return isInvalidRecord;
			}
		}
		Map<String, Object> map = mapper.convertValue(hit, Map.class);
		Set<String> keySet = map.keySet();
		if (keySet.size() == 2) {
			if (keySet.contains("from") && keySet.contains("size"))
				isInvalidRecord = true;
			else {
				isInvalidRecord = false;
			}
		} else {
			isInvalidRecord = false;
		}
		return isInvalidRecord;
	}

	/**
	 * Method to increase max_result_window property of the index so that es starts returning records more than 10000.
	 * 
	 * @param reindexRequest
	 * @param totalRecords
	 */
	public void increaseMaxResultWindow(ReindexRequest reindexRequest, Integer totalRecords) {
		String uri = indexerUtils.getESSettingsURL(reindexRequest);
		Object body = indexerUtils.getESSettingsBody(totalRecords);
		Object response = bulkIndexer.getESResponse(uri, body, "PUT");
		if (response.toString().equals("OK")) {
			log.info("Max window set to " + (totalRecords + 50000) + " for index: " + reindexRequest.getIndex());
		}
	}

}
