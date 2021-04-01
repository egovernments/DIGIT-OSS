package org.egov.wscalculation.web.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Slab {
	private int from;
	private int to;
	private double charge;
	private double meterCharge;
	
	public int getFrom() {
		return from;
	}
	public void setFrom(int from) {
		this.from = from;
	}
	public int getTo() {
		return to;
	}
	public void setTo(int to) {
		this.to = to;
	}
	public double getCharge() {
		return charge;
	}
	public void setCharge(double charge) {
		this.charge = charge;
	}
	public double getMeterCharge() {
		return meterCharge;
	}
	public void setMeterCharge(double meterCharge) {
		this.meterCharge = meterCharge;
	}

	
}