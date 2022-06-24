package org.egov.inbox.web.model.dss;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.Valid;

public class InsightsWidget {

	@Valid
	@JsonProperty("name")
	private String name;

	@Valid
	@JsonProperty("value")
	private Object value;

	@Valid
	@JsonProperty("indicator")
	private String indicator;

	@Valid
	@JsonProperty("colorCode")
	private String colorCode;
	
	public InsightsWidget() {}
	public InsightsWidget(String name, Object value, String indicator, String colorCode) { 
		this.name = name;
		this.value = value; 
		this.indicator = indicator; 
		this.colorCode = colorCode; 
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	public String getIndicator() {
		return indicator;
	}
	public void setIndicator(String indicator) {
		this.indicator = indicator;
	}
	public String getColorCode() {
		return colorCode;
	}
	public void setColorCode(String colorCode) {
		this.colorCode = colorCode;
	} 
	
	

}
