package org.egov.transaction.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.egov.infra.web.utils.WebUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service("bpaRestService")
public class BpaRestService {

	private static final String BPACHECKDEMOND = "%s/bpa/rest/stakeholder/check/demand-pending/{userId}";

	public Boolean checkAnyTaxIsPendingToCollectForStakeHolder(final Long userId, final HttpServletRequest request) {
		final RestTemplate restTemplate = new RestTemplate();

		final String url = String.format(BPACHECKDEMOND, WebUtils.extractRequestDomainURL(request, false));

		Map<String,Boolean> checkPendingMap = restTemplate.getForObject(url, Map.class, userId);
		
		return checkPendingMap.get("isDemandPending");
	}
	
}
