package digit.web.models;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.Builder;

/**
 * Pagination details
 */
@Schema(description = "Pagination details")
@Validated
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Pagination {
    @JsonProperty("limit")
    @Valid
    private Integer limit = new Integer(10);

    @JsonProperty("offset")
    @Valid
    private Integer offset = new Integer(0);

    @JsonProperty("totalCount")
    @Valid
    private Long totalCount = null;

    @JsonProperty("sortBy")
    private String sortBy = null;

    /**
     * Sorting order
     */
    public enum OrderEnum {
        ASC("asc"),

        DESC("desc");

        private String value;

        OrderEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static OrderEnum fromValue(String text) {
            for (OrderEnum b : OrderEnum.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }
    }

    @JsonProperty("order")
    private OrderEnum order = null;


}
