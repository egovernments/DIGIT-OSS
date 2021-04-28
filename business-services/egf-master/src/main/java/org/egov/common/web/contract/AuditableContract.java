package org.egov.common.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.egov.common.contract.request.User;

import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AuditableContract {
    protected String tenantId;
    protected User createdBy;
    protected User lastModifiedBy;
    protected Date createdDate;
    protected Date lastModifiedDate;
    protected String deleteReason;


}
