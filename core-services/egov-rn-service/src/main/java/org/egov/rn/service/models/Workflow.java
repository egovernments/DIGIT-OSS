package org.egov.rn.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@ApiModel(description = "Workflow object used to transition the workflow from one state to another")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-07-15T11:35:33.568+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Workflow {
        @SafeHtml
        @JsonProperty("action")
        private String action = null;

        @JsonProperty("assignes")
        @Valid
        private List<String> assignes = null;

        @SafeHtml
        @JsonProperty("comments")
        private String comments = null;


        public Workflow addAssignesItem(String assignesItem) {
            if (this.assignes == null) {
            this.assignes = new ArrayList<>();
            }
        this.assignes.add(assignesItem);
        return this;
        }

}

