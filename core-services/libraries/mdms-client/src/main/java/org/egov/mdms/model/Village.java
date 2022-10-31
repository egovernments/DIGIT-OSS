package org.egov.mdms.model;
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
public class Village {

	
	private String name;
	private String code;
	private String censusCode;
	private String khewats;
	private String khatonis;
	private String khasras;
	
	
}
