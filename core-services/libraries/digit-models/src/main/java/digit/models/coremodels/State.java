package digit.models.coremodels;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = {"tenantId", "businessServiceId", "state"})
public class State {

    @Size(max = 256)
    @JsonProperty("uuid")
    private String uuid;

    @Size(max = 256)
    @JsonProperty("tenantId")
    private String tenantId;

    @Size(max = 256)
    @JsonProperty("businessServiceId")
    private String businessServiceId;

    @JsonProperty("sla")
    private Long sla;

    @Size(max = 256)
    @JsonProperty("state")
    private String state;

    @Size(max = 256)
    @JsonProperty("applicationStatus")
    private String applicationStatus;

    @JsonProperty("docUploadRequired")
    private Boolean docUploadRequired;

    @JsonProperty("isStartState")
    private Boolean isStartState;

    @JsonProperty("isTerminateState")
    private Boolean isTerminateState;

    @JsonProperty("isStateUpdatable")
    private Boolean isStateUpdatable;

    @JsonProperty("actions")
    @Valid
    private List<Action> actions;

    private AuditDetails auditDetails;


    public State addActionsItem(Action actionsItem) {
        if (this.actions == null) {
            this.actions = new ArrayList<>();
        }
        this.actions.add(actionsItem);
        return this;
    }

}
