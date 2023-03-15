package org.egov.rb.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MessageRequest {
	
	
	@JsonProperty("RequestInfo")
	@Valid
	@NotNull
	private RequestInfo requestInfo = null;
 
	@Autowired
	@JsonProperty("contacts")
	private List<Contacts> contacts;
	
	@JsonProperty("messages")
	private List<Messages> messages;
	
	@JsonProperty("thread")
	private ThreadContact threadContact;
	
}
