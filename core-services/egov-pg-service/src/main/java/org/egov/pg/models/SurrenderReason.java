package org.egov.pg.models;

import lombok.*;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Size;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SurrenderReason {
    /**
     * id is the unique Identifier of the reason
     */
    private String id;
    /**
     * name is the reason of instrument surrender. Example "Damaged cheque","Cheque to be scrapped" etc
     */
    @NotBlank
    @Size(max = 50, min = 5)
    private String name;
    /**
     * description is detailed description of the surrender of a instrument
     */
    @NotBlank
    @Size(max = 250)
    private String description;

}
