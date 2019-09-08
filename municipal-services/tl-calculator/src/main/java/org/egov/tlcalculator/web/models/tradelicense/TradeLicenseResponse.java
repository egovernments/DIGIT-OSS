package org.egov.tlcalculator.web.models.tradelicense;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.*;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * Contract class to send response. Array of tradelicense items are used in case of search results or response for create, whereas single tradelicense item is used for update
 */
@ApiModel(description = "Contract class to send response. Array of tradelicense items are used in case of search results or response for create, whereas single tradelicense item is used for update")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeLicenseResponse {
        @JsonProperty("ResponseInfo")
        private ResponseInfo responseInfo = null;

        @JsonProperty("Licenses")
        @Valid
        private List<TradeLicense> licenses = null;


        public TradeLicenseResponse addLicensesItem(TradeLicense licensesItem) {
            if (this.licenses == null) {
            this.licenses = new ArrayList<>();
            }
        this.licenses.add(licensesItem);
        return this;
        }

}

