package org.egov.egf.instrument.web.contract;

import javax.validation.constraints.Size;

import org.egov.common.web.contract.AuditableContract;
import org.hibernate.validator.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@JsonPropertyOrder({ "id", "name", "description" })
public class SurrenderReasonContract extends AuditableContract {
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