package org.egov.mdms.model;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.mdms.model.MasterDetail.MasterDetailBuilder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleDetail {
	
	@NotNull
	private String moduleName;
	
	private List<MasterDetail> masterDetails;

}
