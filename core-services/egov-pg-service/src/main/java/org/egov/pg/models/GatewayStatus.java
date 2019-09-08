package org.egov.pg.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;
import org.egov.pg.service.Gateway;

@Getter
@AllArgsConstructor
@ToString
public class GatewayStatus {
    private Gateway gateway;
    private boolean active;
}
