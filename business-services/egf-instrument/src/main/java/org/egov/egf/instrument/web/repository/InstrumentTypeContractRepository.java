package org.egov.egf.instrument.web.repository;

import org.egov.egf.instrument.web.contract.InstrumentTypeContract;
import org.egov.egf.instrument.web.requests.InstrumentTypeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class InstrumentTypeContractRepository {

    private RestTemplate restTemplate;
    private String hostUrl;
    public static final String SEARCH_URL = "/egf-instrument/instrumenttypes/_search?";

    public InstrumentTypeContractRepository(@Value("${egf.instrument.host.url}") String hostUrl,
            RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.hostUrl = hostUrl;
    }

    public InstrumentTypeContract findById(InstrumentTypeContract instrumentTypeContract) {

        String url = String.format("%s%s", hostUrl, SEARCH_URL);
        StringBuffer content = new StringBuffer();
        if (instrumentTypeContract.getId() != null)
            content.append("id=" + instrumentTypeContract.getId());

        if (instrumentTypeContract.getTenantId() != null)
            content.append("&tenantId=" + instrumentTypeContract.getTenantId());
        url = url + content.toString();
        InstrumentTypeResponse result = restTemplate.postForObject(url, null, InstrumentTypeResponse.class);

        if (result.getInstrumentTypes() != null && result.getInstrumentTypes().size() == 1)
            return result.getInstrumentTypes().get(0);
        else
            return null;

    }
}