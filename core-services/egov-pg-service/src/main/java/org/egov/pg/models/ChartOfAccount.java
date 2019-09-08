package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Setter
@Getter
@ToString
public class ChartOfAccount {
    private Long id;

    private String glcode;

    private String name;

    @JsonProperty("AccountCodePurpose")
    private AccountCodePurpose accountCodePurpose;

    private String desciption;

    private Boolean isActiveForPosting;

}

