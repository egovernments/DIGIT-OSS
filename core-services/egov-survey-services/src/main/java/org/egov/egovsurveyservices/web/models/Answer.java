package org.egov.egovsurveyservices.web.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.egov.egovsurveyservices.web.models.enums.Type;

import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Answer {

    @JsonProperty("uuid")
    private String uuid;

    @JsonProperty("questionId")
    private String questionId;

    @JsonProperty("answer")
    private List<Object> answer;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

    @JsonProperty("citizenId")
    private String citizenId;

}
