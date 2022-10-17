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
public class Khasra {

	private String khewats;
	private String khatonis;
	private String killa;
	private String knl;
	private String mrl;
	private String period;
	private String govt;

}
