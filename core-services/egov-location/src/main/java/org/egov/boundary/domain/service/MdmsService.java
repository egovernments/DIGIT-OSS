package org.egov.boundary.domain.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONArray;
import org.egov.boundary.persistence.repository.MdmsRepository;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.Geography;
import org.egov.boundary.web.contract.tenant.model.Tenant;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Optional;

import static org.egov.boundary.util.BoundaryConstants.*;

/**
 * Deals with fetching data, formatting data received from MDMS
 * and handling errors w.r.t MDMS
 */
@Service
public class MdmsService {

    private static final Logger LOG = LoggerFactory.getLogger(MdmsService.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper().disable(DeserializationFeature
            .FAIL_ON_UNKNOWN_PROPERTIES);

    private final MdmsRepository mdmsRepository;

    @Autowired
    MdmsService(MdmsRepository mdmsRepository) {
        this.mdmsRepository = mdmsRepository;
    }

    /**
     * Fetches data from MDMS repository, applies relevant formatting of response.
     * Returns requested data or
     * empty when no data is available for requested module, master and filter combo
     *
     * @param tenantId    State or District, formatted tenant id
     * @param requestInfo Request Info object detailing the request
     * @return Geographical data requested or empty when no data is available
     * @throws ServiceCallException in case of MDMS Service call error
     * @throws CustomException      in case MDMS Service is unavailable
     */
    public Optional<List<Geography>> fetchGeography(String tenantId, String filter, RequestInfo requestInfo) {
        Optional<JSONArray> geographiesCheck;
        List<Geography> geographies;

        try {
            geographiesCheck = mdmsRepository.getMdmsDataByCriteria(tenantId, filter, requestInfo,
                    BoundaryConstants.GEO_MODULE_NAME, BoundaryConstants.GEO_MASTER_NAME);
        } catch (HttpClientErrorException e) {
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            throw new CustomException(GEOGRAPHY_SEARCH_MDMS_SERVICE_UNAVAILABLE_MSG, SEARCH_MDMS_SERVICE_UNAVAILABLE_DESC);
        }

        // Format data if present

        if (geographiesCheck.isPresent()) {
            geographies = OBJECT_MAPPER.convertValue(geographiesCheck.get(), new TypeReference<List<Geography>>
                    () {
            });
            geographies.forEach(geography -> geography.setTenantId(tenantId));
            return Optional.of(geographies);
        } else
            return Optional.empty();

    }

    /**
     * Fetches data from MDMS repository, applies relevant formatting of response.
     * Returns requested data or
     * empty when no data is available for requested module, master and filter combo
     *
     * @param tenantId    State
     * @param requestInfo Request Info object detailing the request
     * @return Appropriate tenant requested or empty when no data is available
     * @throws ServiceCallException in case of MDMS Service call error
     * @throws CustomException      in case MDMS Service is unavailable
     */
    public Optional<Tenant> fetchTenant(String tenantId, String filter, RequestInfo requestInfo) {
        Optional<JSONArray> tenantCheck;

        try {
            tenantCheck = mdmsRepository.getMdmsDataByCriteria(tenantId, filter, requestInfo,
                    BoundaryConstants.TENANT_MODULE_NAME, BoundaryConstants.TENANT_MASTER_NAME);
        } catch (HttpClientErrorException e) {
            throw new ServiceCallException(e.getResponseBodyAsString());
        } catch (RestClientException e) {
            throw new CustomException(TENANT_SEARCH_MDMS_SERVICE_UNAVAILABLE_MSG, SEARCH_MDMS_SERVICE_UNAVAILABLE_DESC);
        }

        if (tenantCheck.isPresent()) {
            List<Tenant> tenants = OBJECT_MAPPER.convertValue(tenantCheck.get(), new
                    TypeReference<List<Tenant>>() {
                    });
            if (!tenants.isEmpty())
                return Optional.of(tenants.get(0));
        }
            return Optional.empty();

    }

}
