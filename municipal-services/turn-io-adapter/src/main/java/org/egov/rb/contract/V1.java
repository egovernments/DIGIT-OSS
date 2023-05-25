package org.egov.rb.contract;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//@NoArgsConstructor
//@AllArgsConstructor
@Data
public class V1 {
	
	//@Autowired
	@JsonProperty("author")
	private Author author;
	//@Autowired
	@JsonProperty("chat")
	private Chat chat;
	private String direction;
	private String faq_uuid;
	private String in_reply_to;
	private String inserted_at;
	//@Autowired
	@JsonProperty("labels")
	private List<Labels> labels;
	
	
	
	

}
