package org.egov.auditservice.web.models.encryptionclient;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignRequest   {

    /**
     * Type of the value to be encrypted value / object. Sign object as a whole or sign values seperately inside that object.
     */
//    public enum TypeOfValueEnum {
//        VALUE("VALUE"),
//
//        OBJECT("OBJECT");
//
//        private String value;
//
//        TypeOfValueEnum(String value) {
//            this.value = value;
//        }
//
//        @Override
//        @JsonValue
//        public String toString() {
//            return String.valueOf(value);
//        }
//
//        @JsonCreator
//        public static TypeOfValueEnum fromValue(String text) {
//            for (TypeOfValueEnum b : TypeOfValueEnum.values()) {
//                if (String.valueOf(b.value).equals(text)) {
//                    return b;
//                }
//            }
//            return null;
//        }
//    }
//
//    @JsonProperty("typeOfValue")
//    private TypeOfValueEnum typeOfValue = null;

    @NotNull
    @JsonProperty("tenantId")
    private String tenantId = null;

    @NotNull
    @JsonProperty("value")
    private String value = null;

}
