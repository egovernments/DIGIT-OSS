package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class DraftSearchCriteria {

    @NotNull
    private String tenantId;

    private String id;

    private String userId;

    private String assessmentNumber;

    @JsonIgnore
    private Boolean isActive;

    private int limit;

    private int offset;

}
