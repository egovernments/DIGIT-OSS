package org.egov.domain.model;

import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;

@AllArgsConstructor
@Builder
@EqualsAndHashCode
@Getter
public class Token {
    @NotEmpty
    @Size(max = 256)
    private final String tenantId;
    @Size(max = 100)
    private String identity;
    @Setter
    @Size(max = 128)
    private String number;
    @Size(max = 36)
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


