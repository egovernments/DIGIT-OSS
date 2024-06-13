package digit.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.time.LocalDate;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * Role
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-05-22T11:09:12.469+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Role   {
        @JsonProperty("id")
        private Long id = null;

        @JsonProperty("name")
        private String name = null;

        @JsonProperty("code")
        private String code = null;

        @JsonProperty("description")
        private String description = null;

        @JsonProperty("createdBy")
        private Long createdBy = null;

        @JsonProperty("createdDate")
        private LocalDate createdDate = null;

        @JsonProperty("lastModifiedBy")
        private Long lastModifiedBy = null;

        @JsonProperty("lastModifiedDate")
        private LocalDate lastModifiedDate = null;

        @JsonProperty("tenantId")
        private String tenantId = null;


}

