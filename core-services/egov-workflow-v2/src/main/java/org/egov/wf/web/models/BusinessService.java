package org.egov.wf.web.models;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.ArrayList;
import java.util.List;

import lombok.*;
import org.egov.wf.web.models.AuditDetails;
import org.egov.wf.web.models.State;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * A Object holds the
 */
@ApiModel(description = "A Object holds the")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-12-04T11:26:25.532+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = {"tenantId","businessService"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BusinessService   {

        @NotNull
        @Size(max=256)
        @JsonProperty("tenantId")
        private String tenantId = null;

        @Size(max=256)
        @JsonProperty("uuid")
        private String uuid = null;

        @NotNull
        @Size(max=256)
        @JsonProperty("businessService")
        private String businessService = null;

        @NotNull
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

