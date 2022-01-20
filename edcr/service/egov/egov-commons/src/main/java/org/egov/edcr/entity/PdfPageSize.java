package org.egov.edcr.entity;

import java.io.Serializable;

import javax.persistence.Transient;

import org.apache.pdfbox.printing.Orientation;

public class PdfPageSize  implements Serializable{
	@Transient
	private Orientation orientation;
	@Transient
	private int enlarge;
	@Transient
	private String size;
	@Transient
	private Boolean removeHatch;

	public Orientation getOrientation() {
		return orientation;
	}
	public int getEnlarge() {
		return enlarge;
	}
	public void setOrientation(Orientation orientation) {
		this.orientation = orientation;
	}
	public void setEnlarge(int enlarge) {
		this.enlarge = enlarge;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public Boolean getRemoveHatch() {
		return removeHatch;
	}
	public void setRemoveHatch(Boolean removeHatch) {
		this.removeHatch = removeHatch;
	}
	
	 
}
