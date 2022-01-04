package org.egov.dataupload.consumer;

import java.util.Date;
import java.util.Map;

import org.egov.dataupload.model.UploadJob;
import org.egov.dataupload.model.UploaderRequest;
import org.egov.dataupload.property.models.AuditDetails;
import org.egov.dataupload.property.models.Property;
import org.egov.dataupload.service.DataUploadService;
import org.egov.dataupload.service.PropertyCustomUploader;
import org.egov.dataupload.utils.DataUploadUtils;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DataUploadConsumer {

	public static final Logger logger = LoggerFactory.getLogger(DataUploadConsumer.class);

	@Autowired
	private DataUploadService dataUploadService;

	@Autowired
	private DataUploadUtils uploadUtils;

	@Autowired
	private PropertyCustomUploader propUploader;

	@Value("${property.module.name}")
	private String propertyModuleName;

	@KafkaListener(topics = { "${kafka.topics.dataupload}" })

	public void listen(final Map<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
					   @Header(KafkaHeaders.RECEIVED_MESSAGE_KEY) String key) {
		ObjectMapper mapper = new ObjectMapper();
		UploaderRequest req=null;
		try {

			logger.info("Consuming record : {}", record);
			req = mapper.convertValue(record, UploaderRequest.class);

			if (propertyModuleName.equalsIgnoreCase(req.getUploadJobs().get(0).getModuleName()))
				propUploader.uploadPropertyData(req);
			else
				dataUploadService.excelDataUpload(req);

		} catch (final Exception e) {

			logger.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e);

			UploadJob job = req.getUploadJobs().get(0);

			AuditDetails auditDetails = job.getAuditDetails();
			auditDetails.setLastModifiedTime(new Date().getTime());
			job.setStartTime(System.currentTimeMillis());

			job.setEndTime(System.currentTimeMillis());
			job.setStatus(UploadJob.StatusEnum.FAILED);
			job.setReasonForFailure("Exception occurred while processing the request");

			dataUploadService.updateJobsWithPersister(auditDetails,job,false);
			uploadUtils.clearInternalDirectory();
		}
	}

}
