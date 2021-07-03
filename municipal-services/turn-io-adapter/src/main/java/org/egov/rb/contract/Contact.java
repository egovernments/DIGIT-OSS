package org.egov.rb.contract;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Contact {

	private int birthday;
	private String campaign_name;
	private String event_name;
	private String language;
	@NotNull
	private String location;
	private String name;
	private boolean opted_in;
	private String opted_in_at;
	private String partner_demo;
	private String persona_type;
	private String project_name;
	private String report_category;
	private int report_pincode;
	private String report_subcategory;
	private String school_code;
	private String surname;
	@NotNull
	private int ward_number;
	@NotNull
	private String whatsapp_id;
	private String whatsapp_profile_name;
	@NotNull
	private String city;
	private String locality;
	private String complaint_sub_category;
	
	
	
	
}
