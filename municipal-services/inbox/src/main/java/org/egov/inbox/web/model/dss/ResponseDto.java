package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.validation.Valid;
import java.math.BigDecimal;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ResponseDto {

    @Valid
    @JsonProperty("totalAmountPaid")
    private BigDecimal totalAmountPaid;

    @Valid
    @JsonProperty("activeConnections")
    private BigDecimal activeConnections;
}
