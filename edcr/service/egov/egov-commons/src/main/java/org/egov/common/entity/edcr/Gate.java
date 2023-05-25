package org.egov.common.entity.edcr;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
/**
 * 
 * @author mani
 *   Gates will be MainGate,WicketGate etc
 *   Further it may be Frontgate,Reargate 
 *
 */
public class Gate implements Serializable  {
	
	private List<Measurement> gates;
	private List<BigDecimal> heights;
	public List<Measurement> getGates() {
		return gates;
	}
	public void setGates(List<Measurement> gates) {
		this.gates = gates;
	}
	public List<BigDecimal> getHeights() {
		return heights;
	}
	public void setHeights(List<BigDecimal> heights) {
		this.heights = heights;
	}
	
	  
	

}
