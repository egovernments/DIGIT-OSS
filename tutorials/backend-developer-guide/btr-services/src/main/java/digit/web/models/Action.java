package digit.web.models;

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
@EqualsAndHashCode(of = {"tenantId","currentState","action"})
public class Action {

    @Size(max=256)
    @JsonProperty("uuid")
    private String uuid;

    @Size(max=256)
    @JsonProperty("tenantId")
    private String tenantId;

    @Size(max=256)
    @JsonProperty("currentState")
    private String currentState;

    @Size(max=256)
    @JsonProperty("action")
    private String action;

    @Size(max=256)
    @JsonProperty("nextState")
    private String nextState;

    @Size(max=1024)
    @JsonProperty("roles")
    @Valid
    private List<String> roles;

    private AuditDetails auditDetails;


    public Action addRolesItem(String rolesItem) {
        if (this.roles == null) {
            this.roles = new ArrayList<>();
        }
        this.roles.add(rolesItem);
        return this;
    }

}