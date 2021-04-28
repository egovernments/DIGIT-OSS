package org.egov.tl.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * Contract class to receive request. Array of tradelicense items are used in case of create, whereas single tradelicense item is used for update
 */
@ApiModel(description = "Contract class to receive request. Array of tradelicense items are used in case of create, whereas single tradelicense item is used for update")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeLicenseRequest   {
        @JsonProperty("RequestInfo")
        private RequestInfo requestInfo = null;

        @JsonProperty("Licenses")
        @Valid
        private List<TradeLicense> licenses = null;


        public TradeLicenseRequest addLicensesItem(TradeLicense licensesItem) {
            if (this.licenses == null) {
            this.licenses = new ArrayList<>();
            }
        this.licenses.add(licensesItem);
        return this;
        }

}

