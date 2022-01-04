package org.egov.pg.web.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Details of the payment object.
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-06-05T12:58:12.679+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment {

    @JsonProperty("tenantId")
    @NotNull
    @Size(min = 2, max = 50)
    private String tenantId;

    @JsonProperty("txnAmount")
    @NotNull
    private String txnAmount;

    @JsonProperty("module")
    @NotNull
    private String module;

    @JsonProperty("billId")
    @NotNull
    private String orderId;

    @JsonProperty("productInfo")
    @NotNull
    private String productInfo;

    @JsonProperty("user")
    @NotNull
    private User user;

    @JsonProperty("gateway")
    @NotNull
    private String gateway;

    @JsonIgnore
    private String txnId;


}

