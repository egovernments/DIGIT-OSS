package org.egov.land.config;

import java.util.Map;
import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Component
public class LandConfiguration {

	// User Config
	@Value("${egov.user.host}")
	private String userHost;

	@Value("${egov.user.context.path}")
	private String userContextPath;

	@Value("${egov.user.create.path}")
	private String userCreateEndpoint;

	@Value("${egov.user.search.path}")
	private String userSearchEndpoint;

	@Value("${egov.user.update.path}")
	private String userUpdateEndpoint;

	// Location Config
	@Value("${egov.location.host}")
	private String locationHost;

	@Value("${egov.location.context.path}")
	private String locationContextPath;

	@Value("${egov.location.endpoint}")
	private String locationEndpoint;

	@Value("${egov.location.hierarchyTypeCode}")
	private String hierarchyTypeCode;

	@Value("${egov.bpa.default.limit}")
	private Integer defaultLimit;

	@Value("${egov.bpa.default.offset}")
	private Integer defaultOffset;

	@Value("${egov.bpa.max.limit}")
	private Integer maxSearchLimit;

	// MDMS
	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndPoint;

	//landInfo
//	
//	@Value("${egov.landinfo.host}")
//	private String landInfoHost;
//	
//	@Value("${egov.landinfo.create.endpoint}")
//	private String landInfoCreate;
//	
//	@Value("${egov.landinfo.update.endpoint}")
//	private String landInfoUpdate;
//	
//	@Value("${egov.landinfo.search.endpoint}")
//	private String landInfoSearch;
	
	@Value("${persister.save.landinfo.topic}")
	private String saveLandInfoTopic;
	
	@Value("${persister.update.landinfo.topic}")
	private String updateLandInfoTopic;
	
//	@Value("#{${appSrvTypeBussSrvCode}}")
//	private Map<String,Map<String,String>> appSrvTypeBussSrvCode;
	
}
