package digit.web.models;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import digit.web.models.Pagination;
import digit.web.models.ServiceDefinition;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.Builder;

/**
 * ServiceDefinitionResponse
 */
@Validated
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceDefinitionResponse {
    @JsonProperty("responseInfo")
    @Valid
    private ResponseInfo responseInfo = null;

    @JsonProperty("serviceDefinition")
    @Valid
    private List<ServiceDefinition> serviceDefinition = null;

    @JsonProperty("pagination")
    @Valid
    private Pagination pagination = null;


    public ServiceDefinitionResponse addServiceDefinitionItem(ServiceDefinition serviceDefinitionItem) {
        if (this.serviceDefinition == null) {
            this.serviceDefinition = new ArrayList<>();
        }
        this.serviceDefinition.add(serviceDefinitionItem);
        return this;
    }

}
