package org.bel.birthdeath.common.model;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BirthCertificateVC {

    private String name;

    private String gender;

    private String date_of_birth;

    private String place_of_birth;

    private String contact;

    private String hospital;

    private String name_of_mother;

    private String name_of_father;

    private String present_address;

}
