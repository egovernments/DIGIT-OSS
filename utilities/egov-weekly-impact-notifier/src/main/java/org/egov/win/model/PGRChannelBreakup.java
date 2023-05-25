package org.egov.win.model;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class PGRChannelBreakup {
	
	private List<Map<String, Object>> ivr; //unit - %
	
	private List<Map<String, Object>> mobileApp; //unit - %

	private List<Map<String, Object>> webApp; //unit - %

}
