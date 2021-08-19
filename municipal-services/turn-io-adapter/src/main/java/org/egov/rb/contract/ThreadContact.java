package org.egov.rb.contract;

import org.springframework.beans.factory.annotation.Autowired;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ThreadContact {
	
	@Autowired
	@JsonProperty("contact")
	@NotNull
	private Contact contact;
	

}
