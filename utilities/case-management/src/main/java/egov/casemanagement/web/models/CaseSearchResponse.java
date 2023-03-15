package egov.casemanagement.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * CaseSearchResponse
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2020-05-27T12:33:33.069+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CaseSearchResponse   {
        @JsonProperty("cases")
        @Valid
        private List<ModelCase> cases = null;


        public CaseSearchResponse addCasesItem(ModelCase casesItem) {
            if (this.cases == null) {
            this.cases = new ArrayList<>();
            }
        this.cases.add(casesItem);
        return this;
        }

}

