package org.egov.egovsurveyservices.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

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
public class SurveyEntity {

    @JsonProperty("uuid")
    private String uuid;

    @NotNull
    @JsonProperty("tenantIds")
    private List<String> tenantIds;

    @JsonProperty("title")
    private String title;

    @JsonProperty("status")
    private String status;

    @Size(max = 140)
    @JsonProperty("description")
    private String description;

    @NotNull
    @JsonProperty("questions")
    private List<Question> questions;

    @JsonProperty("startDate")
    private Long startDate;

    @JsonProperty("endDate")
    private Long endDate;

    @JsonProperty("collectCitizenInfo")
    private Boolean collectCitizenInfo;

    @JsonProperty("postedBy")
    private String postedBy;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails;

    @JsonProperty("tenantId")
    private String tenantId;

    @JsonProperty("active")
    private Boolean active;

    @JsonProperty("answersCount")
    private Long answersCount;

    public SurveyEntity addQuestionsItem(Question questionItem) {
        if (this.questions == null) {
            this.questions = new ArrayList<>();
        }

        if (null != questionItem)
            this.questions.add(questionItem);
        return this;
    }

}
