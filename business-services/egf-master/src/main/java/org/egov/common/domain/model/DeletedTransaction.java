package org.egov.common.domain.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DeletedTransaction {


    protected String id;

    protected String tableName;

    protected String identifier;

    @Length(max = 250)
    protected String deleteReason;

    protected Date updatedDate;

    protected String data;

    @NotNull
    @Length(max = 50, min = 5)
    protected String tenantId;
}
