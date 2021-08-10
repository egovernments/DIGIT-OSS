package org.egov.tl.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.ArrayList;
import java.util.List;
import org.egov.tl.web.models.Boundary;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * Boundary
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Boundary   {

        @Size(max=64)
        @SafeHtml
        @JsonProperty("code")
        private String code = null;

        @SafeHtml
        @JsonProperty("name")
        private String name = null;

        @SafeHtml
        @JsonProperty("label")
        private String label = null;

        @SafeHtml
        @JsonProperty("latitude")
        private String latitude = null;

        @SafeHtml
        @JsonProperty("longitude")
        private String longitude = null;

        @JsonProperty("children")
        @Valid
        private List<Boundary> children = null;

        @JsonProperty("materializedPath")
        private String materializedPath = null;


        public Boundary addChildrenItem(Boundary childrenItem) {
            if (this.children == null) {
            this.children = new ArrayList<>();
            }
        this.children.add(childrenItem);
        return this;
        }

}

