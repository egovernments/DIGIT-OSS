package digit.web.models;

import java.util.HashMap;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.Builder;

/**
 * The object will contain all the search parameters for Service .
 */
@Schema(description = "The object will contain all the search parameters for Service .")
@Validated
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceCriteria {
    @JsonProperty("tenantId")
    @NotNull
    @Size(min = 2, max = 64)
    private String tenantId = null;

    @JsonProperty("ids")
    private List<String> ids = null;

    @JsonProperty("serviceDefIds")
    private List<String> serviceDefIds = null;

    @JsonProperty("referenceIds")
    private List<String> referenceIds = null;

    @JsonProperty("attributes")
    private ServiceAttributeCriteria attributes;

    @JsonProperty("accountId")
    private String accountId = null;

    @JsonProperty("clientId")
    private String clientId = null;

    public ServiceCriteria addIdsItem(String idsItem) {
        if (this.ids == null) {
            this.ids = new ArrayList<>();
        }
        this.ids.add(idsItem);
        return this;
    }

    public ServiceCriteria addServiceDefIdsItem(String serviceDefIdsItem) {
        if (this.serviceDefIds == null) {
            this.serviceDefIds = new ArrayList<>();
        }
        this.serviceDefIds.add(serviceDefIdsItem);
        return this;
    }

    public ServiceCriteria addReferenceIdsItem(String referenceIdsItem) {
        if (this.referenceIds == null) {
            this.referenceIds = new ArrayList<>();
        }
        this.referenceIds.add(referenceIdsItem);
        return this;
    }

}
