package org.egov.infra.indexer.controller;

import javax.validation.Valid;

import org.egov.infra.indexer.producer.IndexerProducer;
import org.egov.infra.indexer.service.LegacyIndexService;
import org.egov.infra.indexer.service.ReindexService;
import org.egov.infra.indexer.validator.Validator;
import org.egov.infra.indexer.web.contract.LegacyIndexRequest;
import org.egov.infra.indexer.web.contract.LegacyIndexResponse;
import org.egov.infra.indexer.web.contract.ReindexRequest;
import org.egov.infra.indexer.web.contract.ReindexResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/index-operations")
public class IndexerController {

	public static final Logger logger = LoggerFactory.getLogger(IndexerController.class);
	
	@Autowired
	private IndexerProducer indexerProducer;
	
	@Autowired
	private ReindexService reindexService;
	
	@Autowired
	private LegacyIndexService legacyIndexService;

	
	@Autowired
	private Validator validator;

	
	@PostMapping("/{key}/_index")
	@ResponseBody
	public ResponseEntity<?> produceIndexJson(@PathVariable("key") String topic,
			@RequestBody Object indexJson) {
		try {
			indexerProducer.producer(topic, indexJson);
		} catch (Exception e) {
			logger.error("Error while pushing record to topic: " + e.getMessage());
			return new ResponseEntity<>(indexJson, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<>(indexJson, HttpStatus.OK);	
	}
	

    
    @PostMapping("/_reindex")
    @ResponseBody
    public ResponseEntity<?> reIndexData(@Valid @RequestBody ReindexRequest reindexRequest){
    	validator.validaterReindexRequest(reindexRequest);
    	ReindexResponse response = reindexService.createReindexJob(reindexRequest);
		return new ResponseEntity<>(response ,HttpStatus.OK);

    }
    
    @PostMapping("/_legacyindex")
    @ResponseBody
    public ResponseEntity<?> legacyIndexData(@Valid @RequestBody LegacyIndexRequest legacyIndexRequest){
    	validator.validaterLegacyindexRequest(legacyIndexRequest);
    	LegacyIndexResponse response = legacyIndexService.createLegacyindexJob(legacyIndexRequest);
		return new ResponseEntity<>(response ,HttpStatus.OK);

    }
}
