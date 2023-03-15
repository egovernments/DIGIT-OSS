package org.egov.userevent.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.egov.common.contract.request.RequestInfo;
import org.egov.userevent.config.PropertiesManager;
import org.egov.userevent.repository.RestCallRepository;
import org.egov.userevent.utils.UserEventsConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LocalizationService {

	@Autowired
	private RestCallRepository repository;

	@Autowired
	private PropertiesManager props;

	/**
	 * Populates the localized msg cache
	 * 
	 * @param requestInfo
	 * @param tenantId
	 * @param locale
	 * @param module
	 */
	public Map<String, String> getLocalisedMessages(RequestInfo requestInfo, String tenantId, String locale, String module) {
		Map<String, String> mapOfCodesAndMessages = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		Map<String, Object> request = new HashMap<>();
		request.put("RequestInfo", requestInfo);
		uri.append(props.getLocalisationHost()).append(props.getLocalisationSearchEndpoint())
				.append("?tenantId=" + tenantId).append("&module=" + module).append("&locale=" + locale);
		List<String> codes = null;
		List<String> messages = null;
		Optional<Object> response = repository.fetchResult(uri, request);
		try {
			if (response.isPresent()) {
				codes = JsonPath.read(response.get(), UserEventsConstants.LOCALIZATION_CODES_JSONPATH);
				messages = JsonPath.read(response.get(), UserEventsConstants.LOCALIZATION_MSGS_JSONPATH);
			}
		} catch (Exception e) {
			log.error("Exception while fetching from localization: " + e);
		}
		if (!CollectionUtils.isEmpty(codes) && !CollectionUtils.isEmpty(messages)) {
			for (int i = 0; i < codes.size(); i++) {
				mapOfCodesAndMessages.put(codes.get(i), messages.get(i));
			}
		} else {
			mapOfCodesAndMessages.put(UserEventsConstants.LOCALIZATION_COUNTEREVENT_ONDELETE_CODE,
					UserEventsConstants.LOCALIZATION_COUNTEREVENT_ONDELETE_DEF_MSG);
			mapOfCodesAndMessages.put(UserEventsConstants.LOCALIZATION_COUNTEREVENT_ONUPDATE_CODE,
					UserEventsConstants.LOCALIZATION_COUNTEREVENT_ONUPDATE_DEF_MSG);
		}
		
		return mapOfCodesAndMessages;
	}

}
