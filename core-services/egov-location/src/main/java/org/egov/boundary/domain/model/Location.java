package org.egov.boundary.domain.model;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Location {

    private String country;
    private String state;
    private String district;
    private String city;
    private String postalCode;

}
