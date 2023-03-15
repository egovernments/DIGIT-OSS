package com.ingestpipeline.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.AbstractFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ingestpipeline.service.ElasticService;
import com.ingestpipeline.service.IESService;

@Configuration
public class ElasticSearchConfiguration extends AbstractFactoryBean<RestHighLevelClient> {

	private static final Logger logger = LoggerFactory.getLogger(ElasticSearchConfiguration.class);
	@Value("${spring.data.elasticsearch.cluster.nodes}")
	private String clusterNodes;
	@Value("${spring.data.elasticsearch.cluster.name}")
	private String clusterName;
	private RestHighLevelClient restHighLevelClient;
	@Value("${services.esindexer.host.name}")
	private String esIndexerHostName;
	@Value("${services.esindexer.host.port}")
	private int esIndexerHostPort;

	@Override
	public void destroy() {
		try {
			if (restHighLevelClient != null) {
				restHighLevelClient.close();
			}
		} catch (final Exception e) {
			logger.error("Error closing ElasticSearch client: ", e);
		}
	}

	@Override
	public Class<RestHighLevelClient> getObjectType() {
		return RestHighLevelClient.class;
	}

	@Override
	public boolean isSingleton() {
		return false;
	}

	@Override
	public RestHighLevelClient createInstance() {
		return buildClient();
	}

	private RestHighLevelClient buildClient() {
		try {
			restHighLevelClient = new RestHighLevelClient(
					RestClient.builder(new HttpHost(esIndexerHostName, esIndexerHostPort, "http")));
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return restHighLevelClient;
	}

}
