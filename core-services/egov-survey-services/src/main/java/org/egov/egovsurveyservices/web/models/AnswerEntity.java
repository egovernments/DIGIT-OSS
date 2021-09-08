package org.egov.egovsurveyservices.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AnswerEntity {

    @JsonProperty("surveyId")
    String surveyId;

    @JsonProperty("answers")
    List<Answer> answers;
}
