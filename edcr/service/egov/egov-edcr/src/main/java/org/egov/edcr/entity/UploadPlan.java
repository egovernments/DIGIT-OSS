package org.egov.edcr.entity;

import java.io.File;
import java.util.List;

public class UploadPlan {
	
	 
	private String transactionNumber;
	private File planFile; 
	private  File planReport;
	private String status;
	private String planDetail;
	private String edcrNumber;
	private List<File> planPdfs;
	

	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}


	public String getTransactionNumber() {
		return transactionNumber;
	}


	public void setTransactionNumber(String transactionNumber) {
		this.transactionNumber = transactionNumber;
	}


	public File getPlanFile() {
		return planFile;
	}


	public void setPlanFile(File planFile) {
		this.planFile = planFile;
	}


	public File getPlanReport() {
		return planReport;
	}


	public void setPlanReport(File planReport) {
		this.planReport = planReport;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getPlanDetail() {
		return planDetail;
	}


	public void setPlanDetail(String planDetail) {
		this.planDetail = planDetail;
	}


	public String getEdcrNumber() {
		return edcrNumber;
	}


	public void setEdcrNumber(String edcrNumber) {
		this.edcrNumber = edcrNumber;
	}


	public List<File> getPlanPdfs() {
		return planPdfs;
	}


	public void setPlanPdfs(List<File> planPdfs) {
		this.planPdfs = planPdfs;
	}

}
