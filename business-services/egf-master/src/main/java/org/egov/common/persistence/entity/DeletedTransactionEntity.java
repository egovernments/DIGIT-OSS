package org.egov.common.persistence.entity;


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
public class DeletedTransactionEntity {


    protected String id;

    protected String tableName;

    protected String identifier;

    protected String deleteReason;

    protected Date updatedDate;

    protected String data;

    protected String tenantId;
}
