package org.egov.pg.models;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class PgDetail {

    private Long id;
    private String tenantId;
    private String merchantId;
    private String merchantSecretKey;
    private String merchantUserName;
    private String merchantPassword;
    private String merchantServiceId;
    private Date lastModifiedDate;
	private Date createdDate; 
	private String createdBy;
	private String  lastModifiedBy; 
}
