package org.egov.egf.instrument.web.repository;

import org.egov.egf.instrument.web.contract.InstrumentAccountCodeContract;
import org.egov.egf.instrument.web.requests.InstrumentAccountCodeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class InstrumentAccountCodeContractRepository {

    private RestTemplate restTemplate;
    private String hostUrl;
    public static final String SEARCH_URL = "/egf-instrument/instrumentaccountcodes/_search?";

    public InstrumentAccountCodeContractRepository(@Value("${egf.instrument.host.url}") String hostUrl,
            RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.hostUrl = hostUrl;
    }

    public InstrumentAccountCodeContract findById(InstrumentAccountCodeContract instrumentAccountCodeContract) {

        String url = String.format("%s%s", hostUrl, SEARCH_URL);
        StringBuffer content = new StringBuffer();
        if (instrumentAccountCodeContract.getId() != null)
            content.append("id=" + instrumentAccountCodeContract.getId());

        if (instrumentAccountCodeContract.getTenantId() != null)
            content.append("&tenantId=" + instrumentAccountCodeContract.getTenantId());
        url = url + content.toString();
        InstrumentAccountCodeResponse result = restTemplate.postForObject(url, null,
                InstrumentAccountCodeResponse.class);

        if (result.getInstrumentAccountCodes() != null && result.getInstrumentAccountCodes().size() == 1)
            return result.getInstrumentAccountCodes().get(0);
        else
            return null;

    }
}