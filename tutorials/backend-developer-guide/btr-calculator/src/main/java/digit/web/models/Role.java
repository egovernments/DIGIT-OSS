package digit.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

/**
 * Role
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-11-04T14:15:45.774+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Role {
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

