package org.egov.rn.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.rn.web.models.User;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of = {"id"})
@ToString
public class ProcessInstance {

    @Size(max = 64)
    @JsonProperty("id")
    private String id;

    @NotNull
    @Size(max = 128)
    @JsonProperty("tenantId")
    private String tenantId;

    @NotNull
    @Size(max = 128)
    @JsonProperty("businessService")
    private String businessService;

    @NotNull
    @Size(max = 128)
    @JsonProperty("businessId")
    private String businessId;

    @NotNull
    @Size(max = 128)
    @JsonProperty("action")
    private String action;

    @NotNull
    @Size(max = 64)
    @JsonProperty("moduleName")
    private String moduleName;

    @JsonProperty("state")
    private State state;

    @JsonProperty("comment")
    private String comment;

    @JsonProperty("assignes")
    private List<User> assignes;

}
