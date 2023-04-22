package digit.web.models;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import digit.models.coremodels.AuditDetails;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.Builder;

/**
 * Hold the attribute definition fields details as json object.
 */
@Schema(description = "Hold the attribute definition fields details as json object.")
@Validated
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttributeDefinition {
    @JsonProperty("id")
    @Size(min = 2, max = 64)
    private String id = null;

    @JsonProperty("referenceId")
    @Size(min = 2, max = 64)
    private String referenceId = null;

    @JsonProperty("tenantId")
    @Size(min = 2, max = 64)
    private String tenantId = null;

    @JsonProperty("code")
    @NotNull
    @Size(min = 2, max = 64)
    private String code = null;

    /**
     * defines the attribute type
     */
    public enum DataTypeEnum {
        STRING("String"),

        NUMBER("Number"),

        TEXT("Text"),

        DATETIME("Datetime"),

        SINGLEVALUELIST("SingleValueList"),

        MULTIVALUELIST("MultiValueList"),

        FILE("File");

        private String value;

        DataTypeEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static DataTypeEnum fromValue(String text) {
            for (DataTypeEnum b : DataTypeEnum.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }
    }

    @JsonProperty("dataType")
    @NotNull
    private DataTypeEnum dataType = null;

    @JsonProperty("values")
    private List<String> values = null;

    @JsonProperty("isActive")
    @NotNull
    private Boolean isActive = true;

    @JsonProperty("required")
    private Boolean required = null;

    @JsonProperty("regex")
    @Size(min = 2, max = 64)
    private String regex = null;

    @JsonProperty("order")
    private String order = null;

    @JsonProperty("auditDetails")
    @Valid
    private AuditDetails auditDetails = null;

    @JsonProperty("additionalDetails")
    private Object additionalDetails = null;


    public AttributeDefinition addValuesItem(String valuesItem) {
        if (this.values == null) {
            this.values = new ArrayList<>();
        }
        this.values.add(valuesItem);
        return this;
    }

}
