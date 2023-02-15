package digit.web.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = {"tenantId","businessService"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BusinessService   {

    @Size(max=256)
    @JsonProperty("tenantId")
    private String tenantId = null;

    @Size(max=256)
    @JsonProperty("uuid")
    private String uuid = null;

    @Size(max=256)
    @JsonProperty("businessService")
    private String businessService = null;

    @Size(max=256)
    @JsonProperty("business")
    private String business = null;

    @Size(max=1024)
    @JsonProperty("getUri")
    private String getUri = null;

    @Size(max=1024)
    @JsonProperty("postUri")
    private String postUri = null;

    @JsonProperty("businessServiceSla")
    private Long businessServiceSla = null;

    @NotNull
    @Valid
    @JsonProperty("states")
    private List<State> states = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails = null;



    public BusinessService addStatesItem(State statesItem) {
        if (this.states == null) {
            this.states = new ArrayList<>();
        }
        this.states.add(statesItem);
        return this;
    }


    /**
     * Returns the currentState with the given uuid if not present returns null
     * @param uuid the uuid of the currentState to be returned
     * @return
     */
    public State getStateFromUuid(String uuid) {
        State state = null;
        if(this.states!=null){
            for(State s : this.states){
                if(s.getUuid().equalsIgnoreCase(uuid)){
                    state = s;
                    break;
                }
            }
        }
        return state;
    }



}