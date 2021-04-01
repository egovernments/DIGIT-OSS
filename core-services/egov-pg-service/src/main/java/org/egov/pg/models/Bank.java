package org.egov.pg.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Setter
@Getter
@ToString
@EqualsAndHashCode
public class Bank {

    private Long id;

    private String code;

    private String name;

    private String description;

    private Boolean active;

    private String type;

}

