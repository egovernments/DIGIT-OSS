package org.egov.egf.instrument.web.repository;

import org.egov.egf.instrument.web.contract.InstrumentContract;
import org.egov.egf.instrument.web.requests.InstrumentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class InstrumentContractRepository {

    private RestTemplate restTemplate;
    private String hostUrl;
    public static final String SEARCH_URL = "/egf-instrument/instruments/_search?";

    public InstrumentContractRepository(@Value("${egf.instrument.host.url}") String hostUrl,
            RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.hostUrl = hostUrl;
    }

    public InstrumentContract findById(InstrumentContract instrumentContract) {

        String url = String.format("%s%s", hostUrl, SEARCH_URL);
        StringBuffer content = new StringBuffer();
        if (instrumentContract.getId() != null)
            content.append("id=" + instrumentContract.getId());

        if (instrumentContract.getTenantId() != null)
            content.append("&tenantId=" + instrumentContract.getTenantId());
        url = url + content.toString();
        InstrumentResponse result = restTemplate.postForObject(url, null, InstrumentResponse.class);

        if (result.getInstruments() != null && result.getInstruments().size() == 1)
            return result.getInstruments().get(0);
        else
            return null;

    }
}