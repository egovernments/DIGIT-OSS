package org.egov.domain.model;

import lombok.*;

@AllArgsConstructor
@Getter
@EqualsAndHashCode
@NoArgsConstructor
@ToString
public class User {
    private Long id;
    private String email;
    private String mobileNumber;
}

