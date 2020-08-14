package  org.egov.bpa.web.model.landInfo;

import java.util.Objects;
import io.swagger.annotations.ApiModel;
import com.fasterxml.jackson.annotation.JsonValue;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * Source of a constructionDetail data. The constructionDetail will be created in a system based on the data avaialble in their manual records or during field survey. There can be more from client to client.
 */
public enum Source {
  MUNICIPAL_RECORDS("MUNICIPAL_RECORDS"),
    FIELD_SURVEY("FIELD_SURVEY"), WEBAPP("WEBAPP");

  private String value;

  Source(String value) {
    this.value = value;
  }

  @Override
  @JsonValue
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Source fromValue(String text) {
    for (Source b : Source.values()) {
      if (String.valueOf(b.value).equals(text)) {
        return b;
      }
    }
    return null;
  }
}
