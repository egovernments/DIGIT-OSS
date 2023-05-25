package org.egov.rb.pgrmodels;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Citizen {

	private Long id;
	private String uuid;
	
	private String name;
	
	@JsonProperty("permanentAddress")
	private String address;
	
	@NotNull
	private String mobileNumber;
	
	private String aadhaarNumber;
	private String pan;
	
	private String emailId;
	private String userName;
	private String password;
	private Boolean active;
	private UserType type;
	private Gender gender;
	private String tenantId; 
	
	@JsonProperty("roles")
    private List<Role> roles;
}
