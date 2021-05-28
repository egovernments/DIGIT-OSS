/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */
package org.egov.egf.web.actions.brs;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apache.struts2.interceptor.validation.SkipValidation;
import org.egov.commons.Bank;
import org.egov.commons.Bankaccount;
import org.egov.commons.Bankbranch;
import org.egov.commons.Bankreconciliation;
import org.egov.commons.dao.BankHibernateDAO;
import org.egov.infra.filestore.entity.FileStoreMapper;
import org.egov.infra.web.struts.actions.BaseFormAction;
import org.egov.infra.web.struts.annotation.ValidationErrorPage;
import org.egov.model.brs.AutoReconcileBean;
import org.egov.utils.Constants;
import org.egov.utils.ReportHelper;
import org.springframework.beans.factory.annotation.Autowired;

import net.sf.jasperreports.engine.JRException;

@ParentPackage("egov")
@Results({
		@Result(name = AutoReconciliationAction.NEW, location = "autoReconciliation-" + AutoReconciliationAction.NEW
				+ ".jsp"),
		@Result(name = "result", location = "autoReconciliation-" + "result" + ".jsp"),
		@Result(name = "report", location = "autoReconciliation-" + "report" + ".jsp"),
		@Result(name = "upload", location = "autoReconciliation-upload.jsp"),
		@Result(name = "PDF", type = "stream", location = "inputStream", params = { "inputName", "inputStream",
				"contentType", "application/pdf", "contentDisposition", "no-cache;filename=AutoReconcileReport.pdf" }),
		@Result(name = "XLS", type = "stream", location = "inputStream", params = { "inputName", "inputStream",
				"contentType", "application/xls", "contentDisposition",
				"no-cache;filename=AutoReconcileReport.xls" }) })
public class AutoReconciliationAction extends BaseFormAction {

	private static final long serialVersionUID = -4207341983597707193L;
	private List<Bankbranch> branchList = Collections.emptyList();
	private final List<Bankaccount> accountList = Collections.emptyList();
	private Integer accountId;
	private Integer bankId;
	private Integer branchId;
	private Date reconciliationDate;
	private Date fromDate;
	private Date toDate;
	private String accNo;
	private File bankStatmentInXls;
	private String bankStatmentInXlsFileName;
	private String errorXlsFileName;

	private final String jasperpath = "/reports/templates/AutoReconcileReport.jasper";
	private ReportHelper reportHelper;
	private InputStream inputStream;

	private List<FileStoreMapper> originalFiles = new ArrayList<FileStoreMapper>();
	private List<FileStoreMapper> outPutFiles = new ArrayList<FileStoreMapper>();
	@Autowired
	private AutoReconcileHelper autoReconcileHelper;

	@Autowired
	private BankHibernateDAO bankHibernateDAO;

	public BigDecimal getBankBookBalance() {
		return autoReconcileHelper.getBankBookBalance();
	}

	private List<Bank> allBankHavingAccounts;

	public BigDecimal getBrsBalance() {
		return autoReconcileHelper.getBrsBalance();
	}

	public Bankaccount getBankAccount() {
		return autoReconcileHelper.getBankAccount();
	}

	@Override
	public Object getModel() {
		return new Bankreconciliation();
	}

	@Override
	@SuppressWarnings("unchecked")
	public void prepare() {
		allBankHavingAccounts = bankHibernateDAO.getAllBankHavingBranchAndAccounts();
		dropdownData.put("bankList", allBankHavingAccounts);
		dropdownData.put("branchList", branchList);
		dropdownData.put("accountList", accountList);
		if (branchId != null) {
			branchList = persistenceService.findAllBy(
					"select  bb from Bankbranch bb,Bankaccount ba where bb.bank.id=? and ba.bankbranch=bb and bb.isactive=true",
					bankId);
			dropdownData.put("branchList", branchList);

		}
		if (accountId != null) {
			final List<Bankaccount> accountList = getPersistenceService().findAllBy(
					"from Bankaccount ba where ba.bankbranch.id=? and isactive=true order by ba.chartofaccounts.glcode",
					branchId);
			dropdownData.put("accountList", accountList);
		}

	}

	private void setup() {
		autoReconcileHelper.setAccountId(accountId);
		autoReconcileHelper.setReconciliationDate(reconciliationDate);
		autoReconcileHelper.setFromDate(fromDate);
		autoReconcileHelper.setToDate(toDate);
		autoReconcileHelper.setBankStatmentInXls(bankStatmentInXls);
		autoReconcileHelper.setBankStatmentInXlsFileName(bankStatmentInXlsFileName);
		autoReconcileHelper.setBank((Bank) allBankHavingAccounts.stream().filter(bank -> bank.getId().equals(bankId))
				.collect(Collectors.toList()).get(0));
	}

	@SkipValidation
	@Action(value = "/brs/autoReconciliation-newForm")
	public String newForm() {
		return NEW;
	}

	@SkipValidation
	@Action(value = "/brs/autoReconciliation-beforeUpload")
	public String beforeUpload() {
		originalFiles = (List<FileStoreMapper>) persistenceService.getSession()
				.createQuery("from FileStoreMapper where fileName like '%brs_original_%' order by id desc ")
				.setMaxResults(5).list();
		outPutFiles = (List<FileStoreMapper>) persistenceService.getSession()
				.createQuery("from FileStoreMapper where fileName like '%_brs_uploaded_%' order by id desc ")
				.setMaxResults(5).list();
		return "upload";
	}

	@Action(value = "/brs/autoReconciliation-upload")
	@ValidationErrorPage("upload")
	public String upload() {
		setup();
		autoReconcileHelper.upload();
		return "upload";
	}

	@Override
	public void validate() {
		if (accountId == null) {
			addActionError(getText("msg.please.select.bank.account"));
		}
		if (bankId == null) {
			addActionError(getText("msg.please.select.bank"));
		}
		if (branchId == null) {
			addActionError(getText("msg.please.select.bank.branch"));
		}
	}

	/**
	 * Step1: mark which are all we are going to process step2 :find duplicate and
	 * mark to be processed manually step3: process non duplicates
	 * 
	 * @return
	 */
	/**
	 * @return
	 */
	@ValidationErrorPage(NEW)
	@Action(value = "/brs/autoReconciliation-schedule")
	public String schedule() {
		validateDates();
		if (hasErrors()) {
			return NEW;
		}
		setup();
		autoReconcileHelper.schedule();
		return "result";
	}

	private void validateDates() {
		if (reconciliationDate == null) {
			addActionError(getText("msg.select.reconciliattion.date"));
		}
		if (fromDate == null) {
			addActionError(getText("msg.select.bank.statement.from.date"));
		}
		if (toDate == null) {
			addActionError(getText("msg.select.bank.statement.to.date"));
		}
	}

	public int getRowCount() {
		return autoReconcileHelper.getRowCount();
	}

	public int getCount() {
		return autoReconcileHelper.getCount();
	}

	@Action(value = "/brs/autoReconciliation-generateReport")
	@SuppressWarnings({ "unchecked", "deprecation" })
	public String generateReport() throws ParseException {
		setup();
		autoReconcileHelper.generateReport();
		return "report";

	}

	public BigDecimal getTotalNotReconciledAmount() {
		return autoReconcileHelper.getTotalNotReconciledAmount();
	}

	public BigDecimal getNotInBooktotalDebit() {
		return autoReconcileHelper.getNotInBooktotalDebit();
	}

	public BigDecimal getNotInBooktotalCredit() {
		return autoReconcileHelper.getNotInBooktotalCredit();
	}

	public BigDecimal getNotInBookNet() {
		return autoReconcileHelper.getNotInBookNet();
	}

	public BigDecimal getNotInStatementTotalDebit() {
		return autoReconcileHelper.getNotInStatementTotalDebit();
	}

	public BigDecimal getNotInStatementTotalCredit() {
		return autoReconcileHelper.getNotInStatementTotalCredit();
	}

	public BigDecimal getNotInStatementNet() {
		return autoReconcileHelper.getNotInStatementNet();
	}

	public Date getReconciliationDate() {
		return reconciliationDate;
	}

	public void setReconciliationDate(final Date reconciliationDate) {
		this.reconciliationDate = reconciliationDate;
	}

	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(final Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(final Date toDate) {
		this.toDate = toDate;
	}

	public int getAccountId() {
		return accountId;
	}

	public void setAccountId(final int accountId) {
		this.accountId = accountId;
	}

	public File getBankStatmentInXls() {
		return bankStatmentInXls;
	}

	public void setBankStatmentInXls(final File bankStatmentInXls) {
		this.bankStatmentInXls = bankStatmentInXls;
	}

	public void setBankStatmentInXlsContentType(final String bankStatmentInXlsContentType) {
	}

	public void setBankStatmentInXlsFileName(final String bankStatmentInXlsFileName) {
		this.bankStatmentInXlsFileName = bankStatmentInXlsFileName;
	}

	public String getAccNo() {
		return accNo;
	}

	public void setAccNo(final String accNo) {
		this.accNo = accNo;
	}

	public int getBankId() {
		return bankId;
	}

	public int getBranchId() {
		return branchId;
	}

	public void setBankId(final int bankId) {
		this.bankId = bankId;
	}

	public void setBranchId(final int branchId) {
		this.branchId = branchId;
	}

	public List<AutoReconcileBean> getStatementsNotInBankBookList() {
		return autoReconcileHelper.getStatementsNotInBankBookList();
	}

	public List<AutoReconcileBean> getEntriesNotInBankStament() {
		return autoReconcileHelper.getEntriesNotInBankStament();
	}

	public List<AutoReconcileBean> getStatementsFoundButNotProcessed() {
		return autoReconcileHelper.getStatementsFoundButNotProcessed();
	}

	public BigDecimal getNotprocessedNet() {
		return autoReconcileHelper.getNotprocessedNet();
	}

	@Action(value = "/brs/autoReconciliation-generatePDF")
	public String generatePDF() throws JRException, IOException, ParseException {
		final List<Object> dataSource = new ArrayList<Object>();
		final AutoReconcileBean AutoReconcileObj = new AutoReconcileBean();

		generateReport();
		if (getStatementsNotInBankBookList().size() == 0) {
			AutoReconcileObj.setNoDetailsFound("No Dteails Found");
			getStatementsNotInBankBookList().add(AutoReconcileObj);
		}
		for (final AutoReconcileBean row : getStatementsNotInBankBookList())
			dataSource.add(row);
		inputStream = reportHelper.exportPdf(inputStream, jasperpath, getParamMap(), dataSource);
		return "PDF";
	}

	@Action(value = "/brs/autoReconciliation-generateXLS")
	public String generateXLS() throws JRException, IOException, ParseException {
		final List<Object> dataSource = new ArrayList<Object>();
		final AutoReconcileBean AutoReconcileObj = new AutoReconcileBean();
		generateReport();

		if (getStatementsNotInBankBookList().size() == 0) {
			AutoReconcileObj.setNoDetailsFound("No Details Found");
			getStatementsNotInBankBookList().add(AutoReconcileObj);
		}
		for (final AutoReconcileBean row : getStatementsNotInBankBookList())
			dataSource.add(row);
		inputStream = reportHelper.exportXls(inputStream, jasperpath, getParamMap(), dataSource);
		return "XLS";
	}

	protected Map<String, Object> getParamMap() {
		final Map<String, Object> paramMap = new HashMap<String, Object>();
		final AutoReconcileBean AutoReconcileObj = new AutoReconcileBean();
		paramMap.put("heading", "Bank reconcilation statement from " + Constants.DDMMYYYYFORMAT2.format(fromDate)
				+ " to " + Constants.DDMMYYYYFORMAT2.format(toDate));
		paramMap.put("bankName", autoReconcileHelper.getBankAccount().getBankbranch().getBank().getName());
		paramMap.put("accountNumber", autoReconcileHelper.getBankAccount().getAccountnumber());
		paramMap.put("accountCode", autoReconcileHelper.getBankAccount().getChartofaccounts().getGlcode());
		paramMap.put("accountDescription", autoReconcileHelper.getBankAccount().getChartofaccounts().getName());
		paramMap.put("bankBookBalance", autoReconcileHelper.getBankBookBalance());
		paramMap.put("notInBookNet", autoReconcileHelper.getNotInBookNetBal());
		paramMap.put("notprocessedNet", autoReconcileHelper.getNotprocessedNet());
		paramMap.put("notInStatementNet", autoReconcileHelper.getNotInStatementNet());
		paramMap.put("totalNotReconciledAmount", autoReconcileHelper.getTotalNotReconciledAmount());
		paramMap.put("brsBalance", autoReconcileHelper.getBrsBalance());

		final List<Object> statementDataSource = new ArrayList<Object>();
		final List<Object> entriesNotInBankStamentDataSource = new ArrayList<Object>();
		paramMap.put("BankStatement",
				reportHelper.getClass().getResourceAsStream("/reports/templates/BankStatement.jasper"));
		if (getStatementsFoundButNotProcessed().size() == 0) {
			AutoReconcileObj.setNoDetailsFound("No Details Found");
			autoReconcileHelper.getStatementsFoundButNotProcessed().add(AutoReconcileObj);
		}
		for (final AutoReconcileBean row : getStatementsFoundButNotProcessed())
			statementDataSource.add(row);

		paramMap.put("statementsFoundButNotProcessedList", statementDataSource);

		paramMap.put("EntriesNotinBankStatement", reportHelper.getClass()
				.getResourceAsStream("/reports/templates/BankBookEntriesNotinBankStatement.jasper"));
		/*
		 * To print the subreport if no entires found for EntriesNotinBankStatement
		 * added nodetailFound Object
		 */
		if (getEntriesNotInBankStament().size() == 0) {
			AutoReconcileObj.setNoDetailsFound("No Details Found");
			getEntriesNotInBankStament().add(AutoReconcileObj);
		}
		for (final AutoReconcileBean row : getEntriesNotInBankStament())
			entriesNotInBankStamentDataSource.add(row);
		paramMap.put("BankBookEntriesNotinBankStatementList", entriesNotInBankStamentDataSource);

		return paramMap;
	}

	public ReportHelper getReportHelper() {
		return reportHelper;
	}

	public void setReportHelper(final ReportHelper reportHelper) {
		this.reportHelper = reportHelper;
	}

	public InputStream getInputStream() {
		return inputStream;
	}

	public void setInputStream(final InputStream inputStream) {
		this.inputStream = inputStream;
	}

	public String getNotInBookNetBal() {
		return autoReconcileHelper.getNotInBookNetBal();
	}

	public List<FileStoreMapper> getOriginalFiles() {
		return originalFiles;
	}

	public void setOriginalFiles(List<FileStoreMapper> originalFiles) {
		this.originalFiles = originalFiles;
	}

	public List<FileStoreMapper> getOutPutFiles() {
		return outPutFiles;
	}

	public void setOutPutFiles(List<FileStoreMapper> outPutFiles) {
		this.outPutFiles = outPutFiles;
	}

	public String getErrorFileStoreId() {
		return autoReconcileHelper.getErrorFileStoreId();
	}

	public String getUploadedFileStoreId() {
		return autoReconcileHelper.getUploadedFileStoreId();
	}

	public String getOriginalFileStoreId() {
		return autoReconcileHelper.getOriginalFileStoreId();
	}

	public String getMessage() {
		return autoReconcileHelper.getMessage();
	}

	public String getFailureMessage() {
		return autoReconcileHelper.getFailureMessage();
	}

	public String getErrorXlsFileName() {
		return autoReconcileHelper.getErrorXlsFileName();
	}

	public String getUploadedXlsFileName() {
		return autoReconcileHelper.getUploadedXlsFileName();
	}

}