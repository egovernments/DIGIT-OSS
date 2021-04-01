package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PropertyCancelCriteria {
    @NotNull
    private String tenantId;

    @NotNull
    private String propertyId;

    private Set<String> assessmentNumbers;

    private String status = PropertyDetail.StatusEnum.INACTIVE.toString();

    public enum PropertyCancelAction {
        CANCEL_PROPERTY("CANCEL_PROPERTY"),
        CANCEL_ASSESSMENT("CANCEL_ASSESSMENT");

        private String value;

        PropertyCancelAction(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static PropertyCancelAction fromValue(String text) {
            for (PropertyCancelAction b : PropertyCancelAction.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }

    }

    @NotNull
    private PropertyCancelAction action;

}
