package org.egov.rb.contract;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Chat {
	
	private String assigned_to;
	private String owner;
	private String permalink;
	private String state;
	private String state_reason;
	private int unread_count;
	private String uuid;
	
	

}
