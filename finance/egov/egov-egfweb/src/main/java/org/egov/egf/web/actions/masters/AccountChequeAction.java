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
package org.egov.egf.web.actions.masters;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.egov.commons.Bankaccount;
import org.egov.commons.CFinancialYear;
import org.egov.commons.dao.FinancialYearDAO;
import org.egov.commons.service.BankAccountService;
import org.egov.egf.commons.EgovCommon;
import org.egov.infra.admin.master.entity.AppConfigValues;
import org.egov.infra.admin.master.service.AppConfigValueService;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.web.struts.actions.BaseFormAction;
import org.egov.infra.web.struts.annotation.ValidationErrorPage;
import org.egov.infstr.services.PersistenceService;
import org.egov.infstr.utils.EgovMasterDataCaching;
import org.egov.model.cheque.AccountCheques;
import org.egov.model.cheque.ChequeDeptMapping;
import org.egov.model.masters.ChequeDetail;
import org.egov.services.cheque.AccountChequesService;
import org.egov.utils.Constants;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

@Results({ @Result(name = "new", location = "accountCheque-new.jsp"),
        @Result(name = "view", location = "accountCheque-view.jsp"),
        @Result(name = "viewCheques", location = "accountCheque-viewCheques.jsp"),
        @Result(name = "manipulateCheques", location = "accountCheque-manipulateCheques.jsp") })
public class AccountChequeAction extends BaseFormAction {

    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(AccountChequeAction.class);
    private AccountCheques accountCheques = new AccountCheques();
    private List<ChequeDeptMapping> chequeList;
    private Bankaccount bankaccount;
    private List<ChequeDetail> chequeDetailsList;
    private Long financialYearId;

    @Autowired
    @Qualifier("persistenceService")
    private PersistenceService persistenceService;
    @Autowired
    @Qualifier("accountChequesService")
    private AccountChequesService accountChequesService;

    @Autowired
    private EgovMasterDataCaching masterDataCache;

    @Autowired
    private FinancialYearDAO financialYearDAO;
    @Autowired
    private BankAccountService bankAccountService;

    private String deletedChqDeptId;
    private String defaultSelectedDepartments = "";
    private String chequeDetailsRows;
    
    @Autowired
    protected AppConfigValueService appConfigValuesService;

    public AccountChequeAction() {

        addRelatedEntity("bankAccountId", Bankaccount.class);
    }

    @Override
    public Object getModel() {
        return accountCheques;
    }

    @Override
    public void prepare() {
        super.prepare();
        addDropdownData("departmentList", masterDataCache.get("egi-department"));
        addDropdownData("financialYearList", financialYearDAO.getAllActiveFinancialYearList());
    }

    @Action(value = "/masters/accountCheque-newform")
    public String newform() {
        addDropdownData("bankList", Collections.EMPTY_LIST);
        addDropdownData("accNumList", Collections.EMPTY_LIST);
        addDropdownData("fundList", masterDataCache.get("egi-fund"));
        return "new";

    }

    @Action(value = "/masters/accountCheque-view")
    public String view() {
        addDropdownData("bankList", Collections.EMPTY_LIST);
        addDropdownData("accNumList", Collections.EMPTY_LIST);
        addDropdownData("fundList", masterDataCache.get("egi-fund"));
        return "view";

    }

    @ValidationErrorPage(value = "manipulateCheques")
    @SuppressWarnings("unchecked")
    @Action(value = "/masters/accountCheque-manipulateCheques")
    public String manipulateCheques() {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("AccountChequeAction | manipulateCheques | Start");
        final Long bankAccId = Long.valueOf(parameters.get("bankAccId")[0]);
        final Long finId = Long.valueOf(parameters.get("finId")[0]);
        setFinancialYearId(finId);
        // Get cheque leafs presents for this particular account number
        bankaccount = bankAccountService.findById(bankAccId, false);
        chequeList = accountChequesService.getChequesByBankAccIdFinId(bankAccId, Long.valueOf(financialYearId));
        String defaultDepartmentValueForPayment = getDefaultDepartmentValueForPayment();
        defaultSelectedDepartments = defaultDepartmentValueForPayment !=null ? defaultDepartmentValueForPayment : "";
        if (chequeList.size() > 0)
            prepareChequeDetails(chequeList);
        return "manipulateCheques";
    }

    @Action(value = "/masters/accountCheque-viewCheques")
    public String viewCheques() {
        if (LOGGER.isDebugEnabled())
            LOGGER.debug("AccountChequeAction | manipulateCheques | Start");
        final Long bankAccId = Long.valueOf(parameters.get("bankAccId")[0]);
        final Long finId = Long.valueOf(parameters.get("finId")[0]);
        bankaccount = bankAccountService.findById(bankAccId, false);
        chequeList = accountChequesService.getChequesByBankAccIdFinId(bankAccId, finId);
        if (chequeList.size() > 0)
            prepareChequeDetails(chequeList);
        return "viewCheques";
    }

    private void prepareChequeDetails(final List<ChequeDeptMapping> chequeList) {
        Map<String, String> depMap = new HashMap<>();
        List<org.egov.infra.microservice.models.Department> list = masterDataCache.get("egi-department");
        for (org.egov.infra.microservice.models.Department dep : list) {
            depMap.put(dep.getCode(), dep.getName());
        }
        chequeDetailsList = new ArrayList<ChequeDetail>();
        ChequeDetail chequeDetail;
        for (final ChequeDeptMapping chequeDeptMapping : chequeList) {

            chequeDetail = new ChequeDetail();
            chequeDetail.setFromChqNo(chequeDeptMapping.getAccountCheque().getFromChequeNumber());
            chequeDetail.setToChqNo(chequeDeptMapping.getAccountCheque().getToChequeNumber());
            chequeDetail.setDeptCode(chequeDeptMapping.getAllotedTo());
            chequeDetail.setDeptName(depMap.get(chequeDeptMapping.getAllotedTo()));
            CFinancialYear fy = (CFinancialYear) financialYearDAO
                    .findById(Long.valueOf(chequeDeptMapping.getAccountCheque().getSerialNo()), false);
            chequeDetail.setSerialNoH(fy.getFinYearRange());
            chequeDetail.setReceivedDate(
                    Constants.DDMMYYYYFORMAT2.format(chequeDeptMapping.getAccountCheque().getReceivedDate()));
            chequeDetail.setSerialNo(chequeDeptMapping.getAccountCheque().getSerialNo().toString());
            if (null != chequeDeptMapping.getAccountCheque().getIsExhausted()
                    && chequeDeptMapping.getAccountCheque().getIsExhausted())
                chequeDetail.setIsExhusted("Yes");
            else
                chequeDetail.setIsExhusted("No");

            chequeDetail.setNextChqPresent(chequeDeptMapping.getAccountCheque().getNextChqNo() != null ? "Yes" : "No");
            chequeDetail.setAccountChequeId(chequeDeptMapping.getAccountCheque().getId());
            chequeDetail.setChequeDeptId(chequeDeptMapping.getId());
            chequeDetailsList.add(chequeDetail);
        }

    }

    @ValidationErrorPage(value = "manipulateCheques")
    @SuppressWarnings("unchecked")
    @Action(value = "/masters/accountCheque-save")
    public String save() {

        if (LOGGER.isDebugEnabled())
            LOGGER.debug("AccountChequeAction | save | Start");
        final Session session = persistenceService.getSession();
        final Map<String, AccountCheques> chequeMap = new HashMap<String, AccountCheques>();
        final Map<String, String> chequeIdMap = new HashMap<String, String>();
        AccountCheques accountCheques;
        ChequeDeptMapping chqDept;
        removeEmptyRows();
        bankaccount = (Bankaccount) persistenceService
                .find("from Bankaccount where id =" + Long.valueOf(parameters.get("bankAccId")[0]));
        this.prepareChequeDetailsList(chequeDetailsRows);
        if (null == chequeDetailsList) {
            accountChequesService.deleteRecords(bankaccount);
            addActionMessage("Cheque Master deleted Successfully : No cheque leafs available");
            return "manipulateCheques";
        }
        accountChequesService.createCheques(chequeDetailsList, chequeIdMap, chequeMap, bankaccount, deletedChqDeptId);
        accountChequesService.deleteRecords(deletedChqDeptId, bankaccount);
        String defaultDepartmentValueForPayment = getDefaultDepartmentValueForPayment();
        defaultSelectedDepartments = defaultDepartmentValueForPayment !=null ? defaultDepartmentValueForPayment : "";
        // Get cheque leafs presents for this particular account number
        final StringBuffer query = new StringBuffer(200);
        chequeList = accountChequesService.getChequesByBankAccIdFinId(bankaccount.getId(),
                Long.valueOf(financialYearId));
        if (chequeList.size() > 0)
            prepareChequeDetails(chequeList);
        addActionMessage("Cheque Master updated Successfully");
        return "manipulateCheques";
    }

    private void prepareChequeDetailsList(String chequeDetailsRows2) {
        // TODO Auto-generated method stub
        if (StringUtils.isNotBlank(chequeDetailsRows)) {
            chequeDetailsList = new ArrayList<>();
            String[] cheqDetailsArr = chequeDetailsRows.split(";,");
            for (String str : cheqDetailsArr) {
                String[] split = str.split("~");
                ChequeDetail cd = new ChequeDetail();
                cd.setFromChqNo(StringUtils.defaultIfBlank(split[0], null));
                cd.setToChqNo(StringUtils.defaultIfBlank(split[1], null));
                cd.setDeptCode(StringUtils.defaultIfBlank(split[2], null));
                cd.setReceivedDate(StringUtils.defaultIfBlank(split[3], null));
                cd.setSerialNo(StringUtils.defaultIfBlank(split[4], null));
                try {
                    cd.setIsExhusted(StringUtils.defaultIfBlank(split[5], "No"));
                    cd.setNextChqPresent(StringUtils.defaultIfBlank(split[6], "No"));
                    cd.setAccountChequeId(StringUtils.isNotBlank(split[7]) ? split[7].lastIndexOf(";") == -1
                            ? Long.parseLong(split[7]) : split[7].substring(0, split[7].lastIndexOf(";")).isEmpty() ? 0l
                                    : Long.parseLong(split[7].substring(0, split[7].lastIndexOf(";")))
                            : null);
                } catch (ObjectNotFoundException e) {
                    LOGGER.error("ERROR occurred while setting the cheque details123",e.getCause());
                }
                chequeDetailsList.add(cd);
            }
        }
    }

    private void removeEmptyRows() {
        final List<ChequeDetail> trash = new ArrayList<ChequeDetail>();
        if (chequeDetailsList != null)
            for (final ChequeDetail cd : chequeDetailsList)
                if (cd == null)
                    trash.add(cd);

        for (final ChequeDetail cd : trash)
            chequeDetailsList.remove(cd);
        trash.clear();
    }
    
    protected String getDefaultDepartmentValueForPayment(){
        List<AppConfigValues> configValuesByModuleAndKey = appConfigValuesService.getConfigValuesByModuleAndKey("EGF", "DEFAULT_DEPARTMENT_FOR_PAYMENT");
        return configValuesByModuleAndKey.isEmpty() ? null : configValuesByModuleAndKey.get(0).getValue(); 
    }

    public AccountCheques getAccountCheques() {
        return accountCheques;
    }

    public void setAccountCheques(final AccountCheques accountCheques) {
        this.accountCheques = accountCheques;
    }

    public void setEgovCommon(final EgovCommon egovCommon) {
    }

    public List<ChequeDeptMapping> getChequeList() {
        return chequeList;
    }

    public void setChequeList(final List<ChequeDeptMapping> chequeList) {
        this.chequeList = chequeList;
    }

    public Bankaccount getBankaccount() {
        return bankaccount;
    }

    public void setBankaccount(final Bankaccount bankaccount) {
        this.bankaccount = bankaccount;
    }

    public List<ChequeDetail> getChequeDetailsList() {
        return chequeDetailsList;
    }

    public void setChequeDetailsList(final List<ChequeDetail> chequeDetailsList) {
        this.chequeDetailsList = chequeDetailsList;
    }

    public String getDeletedChqDeptId() {
        return deletedChqDeptId;
    }

    public void setDeletedChqDeptId(final String deletedChqDeptId) {
        this.deletedChqDeptId = deletedChqDeptId;
    }

    public Long getFinancialYearId() {
        return financialYearId;
    }

    public void setFinancialYearId(final Long financialYearId) {
        this.financialYearId = financialYearId;
    }

    public String getDefaultSelectedDepartments() {
        return defaultSelectedDepartments;
    }

    public void setDefaultSelectedDepartments(String defaultSelectedDepartment) {
        this.defaultSelectedDepartments = defaultSelectedDepartment;
    }
    
    public String getChequeDetailsRows() {
        return chequeDetailsRows;
    }
    
    public void setChequeDetailsRows(String chequeDetailsRows) {
        this.chequeDetailsRows = chequeDetailsRows;
    }
}
