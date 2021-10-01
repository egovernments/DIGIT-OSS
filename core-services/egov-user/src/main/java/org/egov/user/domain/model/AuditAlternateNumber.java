package org.egov.user.domain.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class AuditAlternateNumber {
	
	private String uuid;
	private String createdby;
	private Date createdtime;
	private String lastmodifiedby;
	private Date lastmodifiedtime;
	private String mobilenumber;
	
	
	public boolean equals(AuditAlternateNumber obj) {
		
		boolean notNull = this.getUuid()!=null && obj.getUuid()!=null && this.getCreatedby()!=null && obj.getCreatedby()!=null && this.getCreatedtime()!=null && obj.getCreatedtime()!=null &&
				this.getLastmodifiedby()!=null && obj.getLastmodifiedby()!=null && this.getLastmodifiedtime()!=null && obj.getLastmodifiedtime()!=null && this.getMobilenumber()!=null && obj.getMobilenumber()!=null;
		
		return notNull && (this.getUuid().equalsIgnoreCase(obj.getUuid()) && this.getCreatedby().equalsIgnoreCase(obj.getCreatedby()) && this.getCreatedtime().toString().equalsIgnoreCase(obj.getCreatedtime().toString())
				&& this.getLastmodifiedby().equalsIgnoreCase(obj.getLastmodifiedby()) && this.getLastmodifiedtime().toString().equalsIgnoreCase(obj.getLastmodifiedtime().toString()) && this.getMobilenumber().equalsIgnoreCase(obj.getMobilenumber()));
	}

}
