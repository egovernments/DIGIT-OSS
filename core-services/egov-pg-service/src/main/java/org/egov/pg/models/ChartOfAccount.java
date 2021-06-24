package org.egov.pg.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ChartOfAccount {
    private Long id;

    private String glcode;

    private String name;

    @JsonProperty("AccountCodePurpose")
    private AccountCodePurpose accountCodePurpose;

    private String desciption;

    private Boolean isActiveForPosting;

}

