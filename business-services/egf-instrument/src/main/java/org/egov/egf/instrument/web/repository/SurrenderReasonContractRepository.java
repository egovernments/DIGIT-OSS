package org.egov.egf.instrument.web.repository;

import org.egov.egf.instrument.web.contract.SurrenderReasonContract;
import org.egov.egf.instrument.web.requests.SurrenderReasonResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SurrenderReasonContractRepository {

    private RestTemplate restTemplate;
    private String hostUrl;
    public static final String SEARCH_URL = "/egf-instrument/surrenderreasons/_search?";

    public SurrenderReasonContractRepository(@Value("${egf.instrument.host.url}") String hostUrl,
            RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.hostUrl = hostUrl;
    }

    public SurrenderReasonContract findById(SurrenderReasonContract surrenderReasonContract) {

        String url = String.format("%s%s", hostUrl, SEARCH_URL);
        StringBuffer content = new StringBuffer();
        if (surrenderReasonContract.getId() != null)
            content.append("id=" + surrenderReasonContract.getId());

        if (surrenderReasonContract.getTenantId() != null)
            content.append("&tenantId=" + surrenderReasonContract.getTenantId());
        url = url + content.toString();
        SurrenderReasonResponse result = restTemplate.postForObject(url, null, SurrenderReasonResponse.class);

        if (result.getSurrenderReasons() != null && result.getSurrenderReasons().size() == 1)
            return result.getSurrenderReasons().get(0);
        else
            return null;

    }
}