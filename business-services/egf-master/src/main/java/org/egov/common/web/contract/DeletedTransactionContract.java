package org.egov.common.web.contract;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DeletedTransactionContract {


    protected String id;

    protected String tableName;

    protected String identifier;

    protected String deleteReason;

    protected Date updatedDate;

    protected String data;

    protected String tenantId;
}
