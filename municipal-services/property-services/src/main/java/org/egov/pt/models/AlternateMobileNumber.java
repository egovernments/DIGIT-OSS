package org.egov.pt.models;



import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlternateMobileNumber{
	@JsonProperty("id")
	private Long id;
	
	@JsonProperty("uuid")
	private String uuid;
	
	@NotNull
    @SafeHtml
    @Size(max=100)
    @Pattern(regexp = "^[^\\$\"'<>?\\\\~`!@#$%^()+={}\\[\\]*,:;“”‘’]*$", message = "Invalid name. Only alphabets and special characters -, ',`, .")
	@JsonProperty("name")
	private String name;
	
	@SafeHtml
	@Pattern(regexp = "(^[6-9][0-9]{9}$)", message = "Inavlid mobile number, should start with 6-9 and contain ten digits of 0-9")
    @NotNull
	@JsonProperty("mobileNumber")
	private String mobileNumber;
	
}