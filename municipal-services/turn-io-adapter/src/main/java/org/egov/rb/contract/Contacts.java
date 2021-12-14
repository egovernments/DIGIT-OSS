package org.egov.rb.contract;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contacts {

	@Autowired
	@JsonProperty("profile")
	private Profile profile;
	@JsonProperty("wa_id")
	private String wa_id;
}
