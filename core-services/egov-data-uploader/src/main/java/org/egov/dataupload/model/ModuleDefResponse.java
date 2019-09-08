package org.egov.dataupload.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ModuleDefResponse   {
 
	@JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("ModuleDefs")
    private List<ModuleDefs> moduleDefs;

}

