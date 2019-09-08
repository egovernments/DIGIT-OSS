package org.egov.domain.model;

import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Builder
@EqualsAndHashCode
@Getter
public class Token {
    @NotEmpty
    private final String tenantId;
    private String identity;
    private String number;
    private String uuid;
    private LocalDateTime expiryDateTime;
    @Setter
    private Long createdTime;
    private Long timeToLiveInSeconds;
    @Setter
    private boolean validated;
    private Date createdDate;

    public boolean isExpired(LocalDateTime now) {
        return now.isAfter(expiryDateTime);
    }
}


