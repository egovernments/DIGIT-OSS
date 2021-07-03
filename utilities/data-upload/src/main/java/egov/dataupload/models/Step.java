package egov.dataupload.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.mustachejava.Mustache;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Step {

    @JsonProperty("id")
    private String id = null;


    @JsonProperty("url")
    private String url = null;

    @JsonProperty("body")
    private String body = null;

    @JsonIgnore
    private Mustache mustacheTemplate = null;
}
