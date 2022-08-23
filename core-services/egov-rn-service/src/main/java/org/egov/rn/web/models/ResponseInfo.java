package org.egov.rn.web.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.springframework.validation.annotation.Validated;

/**
 * org.egov.rn.web.models.web.ResponseInfo should be used to carry metadata information about the response from the server. apiId, ver and msgId in org.egov.rn.web.models.web.ResponseInfo should always correspond to the same values in respective request&#39;s org.egov.rn.web.models.web.RequestInfo.
 */
@ApiModel(description = "org.egov.rn.web.models.web.ResponseInfo should be used to carry metadata information about the response from the server. apiId, ver and msgId in org.egov.rn.web.models.web.ResponseInfo should always correspond to the same values in respective request's org.egov.rn.web.models.web.RequestInfo.")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2022-08-23T14:53:48.053+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseInfo   {
        @JsonProperty("apiId")
        private String apiId = null;

        @JsonProperty("ver")
        private String ver = null;

        @JsonProperty("ts")
        private Long ts = null;

        @JsonProperty("resMsgId")
        private String resMsgId = null;

        @JsonProperty("msgId")
        private String msgId = null;

              /**
   * status of request processing - to be enhanced in futuer to include INPROGRESS
   */
  public enum StatusEnum {
    SUCCESSFUL("SUCCESSFUL"),
    
    FAILED("FAILED");

    private String value;

    StatusEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static StatusEnum fromValue(String text) {
      for (StatusEnum b : StatusEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }

        @JsonProperty("status")
        private StatusEnum status = null;


}

