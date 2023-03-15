package org.egov.pt.web.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class
DemandBasedAssessment {

    @JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
    private String assessmentNumber;

    @JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
    private String tenantId;

    @JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
    private String financialYear;
}
