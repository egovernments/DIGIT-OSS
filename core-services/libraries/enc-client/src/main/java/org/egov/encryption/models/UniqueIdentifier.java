package org.egov.encryption.models;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UniqueIdentifier {

    private String name = null;

    private String jsonPath = null;

}
