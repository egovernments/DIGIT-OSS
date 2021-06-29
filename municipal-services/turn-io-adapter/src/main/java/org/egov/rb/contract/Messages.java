package org.egov.rb.contract;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Messages {

	@JsonProperty("_vnd")
	private Vendor vendor;

	private String from;
	private String id;
	@JsonProperty("image")
	private Image image;
	private boolean preview_url;
	private String recipient_type;
	@JsonProperty("text")
	private Text text;
	private int timestamp;
	private String type;
	
}
