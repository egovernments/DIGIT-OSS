package org.egov.enc.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.egov.enc.models.Signature;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;

/**
 * Object with the value and signature to be verified
 */
@ApiModel(description = "Object with the value and signature to be verified")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-10-11T17:31:52.360+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VerifyRequest   {

    @NotNull
    @JsonProperty("value")
    private String value = null;

    @NotNull
    @JsonProperty("signature")
    private Signature signature = null;

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

}

