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
public class Body {
	
	private List<Map<String, Object>> header;
	
	private StateWide stateWide;
	
	private PGR pgr;
	
	private PT pt;
	
	private TL tl;
	
	private Firenoc firenoc;
	
	private WaterAndSewerage waterAndSewerage;
	
	private MiscCollections miscCollections;

}