package org.egov.common.web.contract;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class AttributeContract {

	public static final String DATATYPE = "String";
	@JsonProperty("variable")
	private Boolean variable;

	@JsonProperty("code")
	private String code;

	@JsonProperty("datatype")
	private String datatype;

	@JsonProperty("required")
	private Boolean required;

	@JsonProperty("datatypeDescription")
	private String datatypeDescription;

	@JsonProperty("values")
	private List<ValueContract> values;

	public static AttributeContract asStringAttr(String code, String value) {
		List<ValueContract> valueList = new ArrayList<>();
		valueList.add(new ValueContract(code, value));
		return new AttributeContract(Boolean.TRUE, code, DATATYPE, Boolean.FALSE, StringUtils.EMPTY, valueList);
	}

}