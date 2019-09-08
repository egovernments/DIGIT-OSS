package org.egov.collection.web.contract;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class CollectionConfigResponse {
	
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("CollectionConfiguration")
	private Map<String, List<String>> collectionConfiguration = new HashMap<>();
}
