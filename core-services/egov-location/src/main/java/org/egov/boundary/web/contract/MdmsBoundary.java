package org.egov.boundary.web.contract;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MdmsBoundary {
	private String code;
	private String name;
	private String label;
	private String latitude;
	private String longitude;
	private String area;
	private Long boundaryNum;
	private List<MdmsBoundary> children = new ArrayList<MdmsBoundary>();
}
