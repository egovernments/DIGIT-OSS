package org.egov.receipt.consumer.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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

@JsonPropertyOrder({ "id", "reason", "remarks", "instrument", "reversalVoucherId", "dishonorDate" })
public class DishonorReasonContract extends AuditableContract {
    /**
     * id is the unique Identifier of the reason
     */
    private String id;
    /**
     * name is the reason of instrument surrender. Example "Damaged cheque","Cheque to be scrapped" etc
     */
    @NotBlank
    @Size(max = 100, min = 5)
    private String reason;
    /**
     * description is detailed description of the surrender of a instrument
     */
    @NotBlank
    @Size(max = 250)
    private String remarks;
    @NotBlank
    @Size(max = 250)
    private String instrument;
    private String reversalVoucherId;
    @NotNull
    private Long dishonorDate;

}