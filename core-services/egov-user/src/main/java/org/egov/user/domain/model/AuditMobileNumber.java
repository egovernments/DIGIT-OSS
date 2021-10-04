package org.egov.user.domain.model;

import java.util.Date;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString

// POJO for Audit primary mobile number object

public class AuditMobileNumber {
	
	private String uuid;
	private String createdby;
	private Date createdtime;
	private String lastmodifiedby;
	private Date lastmodifiedtime;
	private String mobilenumber;
	
	
	public boolean equals(AuditMobileNumber obj) {
		
		return (this.getUuid().equalsIgnoreCase(obj.getUuid()) && this.getCreatedby().equalsIgnoreCase(obj.getCreatedby()) && this.getCreatedtime().toString().equalsIgnoreCase(obj.getCreatedtime().toString())
				&& this.getLastmodifiedby().equalsIgnoreCase(obj.getLastmodifiedby()) && this.getLastmodifiedtime().toString().equalsIgnoreCase(obj.getLastmodifiedtime().toString()) && this.getMobilenumber().equalsIgnoreCase(obj.getMobilenumber()));
	}

}
