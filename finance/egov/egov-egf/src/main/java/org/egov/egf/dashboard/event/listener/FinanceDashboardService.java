package org.egov.egf.dashboard.event.listener;
import java.math.BigDecimal;
import java.util.ArrayList;import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.egov.commons.CGeneralLedger;
import org.egov.commons.CGeneralLedgerDetail;
import org.egov.commons.CVoucherHeader;
import org.egov.commons.Vouchermis;
import org.egov.commons.service.ChartOfAccountsService;
import org.egov.egf.dashboard.event.FinanceDashboardEvent;
import org.egov.egf.dashboard.event.FinanceEventType;
import org.egov.egf.dashboard.model.CGeneralLedgerData;
import org.egov.egf.dashboard.model.CGeneralLedgerDetailData;
import org.egov.egf.dashboard.model.EgBillPayeedetailsData;
import org.egov.egf.dashboard.model.EgBillRegisterData;
import org.egov.egf.dashboard.model.EgBillRegisterWrapper;
import org.egov.egf.dashboard.model.EgBilldetailsData;
import org.egov.egf.dashboard.model.VoucherHeaderData;
import org.egov.egf.dashboard.model.VoucherStatus;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.models.Department;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.egov.infstr.services.PersistenceService;
import org.egov.model.bills.EgBillPayeedetails;
import org.egov.model.bills.EgBilldetails;
import org.egov.model.bills.EgBillregister;
import org.egov.model.bills.EgBillregistermis;
import org.egov.model.payment.Paymentheader;
import org.egov.utils.FinancialConstants;
import org.hibernate.HibernateException;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.hibernate.exception.DataException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javassist.tools.rmi.ObjectNotFoundException;

@Transactional(readOnly = true)
@Service
public class FinanceDashboardService {
    private static final Logger LOG = LoggerFactory.getLogger(FinanceDashboardService.class);

    private static final String DEFAULT_STRING = "";

    private static final Integer DEFAULT_INT = 0;
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Autowired
    private MicroserviceUtils microServiceUtil;
    
    @Autowired
    @Qualifier("persistenceService")
    private PersistenceService persistenceService;
    
    @Autowired
    @Qualifier("chartOfAccountsService")
    private ChartOfAccountsService chartOfAccountsService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired
    private CityService cityService;
    
    @Value("${finance.esk.dashboard.event.enabled}")
    private boolean isEsDashboardIndexingEnabled;
    
    @Value("${egov.finance.indexer.egbill.topic.name}")
    private String finIndexerEgBillTopic;
    
    @Value("${egov.finance.indexer.voucher.topic.name}")
    private String finIndexerVoucherTopic;
    
    public void publishEvent(FinanceEventType eventType, Object data){
        if(isEsDashboardIndexingEnabled){
            String tenantId = microServiceUtil.getTenentId();
            String token = microServiceUtil.generateAdminToken(tenantId);
            String domainName = ApplicationThreadLocals.getDomainName();
            FinanceDashboardEvent event = new FinanceDashboardEvent(this, data,eventType, tenantId, token, domainName);
            eventPublisher.publishEvent(event);
            LOG.info("EVENT : {} PUBLISHED TO ESK DASHBOARD , ",event);
        }else{
           LOG.info("ESK Dashboard is not enable for indexing to ES"); 
        }
    }
    
    @Transactional(propagation=Propagation.REQUIRED,readOnly=true)
    public void pushtoEskIndex(FinanceDashboardEvent event){
        try {
            Object data = event.getData();
            String tenantId = event.getTenantId();
            String token = event.getToken();
            String domainName = event.getDomainName();
            this.prepareThreadLocal(tenantId, domainName);
            EgBillRegisterWrapper wrapper = new EgBillRegisterWrapper();
            List<EgBillRegisterData> egBillDataList = new ArrayList<>();
            List<VoucherHeaderData> vhDataList = new ArrayList<>();
            Set<Long> idSets = new HashSet();
            switch (event.getEventType()) {
            case billCreateOrUpdate:
                EgBillregister billReg = (EgBillregister) data;
                EgBillRegisterData egBillRegisterData1 = this.prepareEgBillRegisterData(billReg, tenantId, token);
                idSets.add(billReg.getId());
                egBillDataList.add(egBillRegisterData1);
                break;
                
            case billUpdateByIds:
                List<EgBillregister> billRegList = this.getEgBillRegisterById(data);
                for(EgBillregister br : billRegList){
                    EgBillRegisterData egBillRegisterData2 = this.prepareEgBillRegisterData(br, tenantId, token);
                    egBillDataList.add(egBillRegisterData2);
                    idSets.add(br.getId());
                }
                break;
            case voucherCreateOrUpdate:
                CVoucherHeader vh = (CVoucherHeader) data;
                VoucherHeaderData voucherHeaderData = this.prepareVoucherHeaderData(vh , tenantId, token);
                vhDataList.add(voucherHeaderData);
                idSets.add(vh.getId());
                //POST creation of voucher needs to update the voucher number for corresponding bill
                EgBillregister egBillRegister =this.getBillRegisterByBillNumber(vh.getBillNumber());
                egBillRegister = egBillRegister != null ? egBillRegister :  this.getEgBillRegisterByVoucherId(vh);
                if(egBillRegister  != null ){
                    ApplicationThreadLocals.setUserTenantId(tenantId);
                    this.publishEvent(FinanceEventType.billUpdateByIds,new HashSet<Long>(Arrays.asList(egBillRegister.getId())));
                }
                break;
            case voucherUpdateById:
                if(data instanceof Set){
                    HashSet<Long> ids = (HashSet<Long>) data;
                    List<CVoucherHeader> list = this.getVoucherHeaderById(ids);
                    if(!list.isEmpty()){
                        for(CVoucherHeader vh1 : list){
                            VoucherHeaderData vhData = this.prepareVoucherHeaderData(vh1, tenantId, token);
                            vhDataList.add(vhData);
                        }
                        idSets.addAll(ids);
                    }
                }
                break;
                
            default:
                break;
            }
            if(!egBillDataList.isEmpty()){
                this.prepareUlbDetails(egBillDataList,null);
                wrapper.setEgBillRegisterData(egBillDataList);
                RequestInfo requestInfo = new RequestInfo();
                requestInfo.setAuthToken(token);
                wrapper.setRequestInfo(requestInfo);
                microServiceUtil.pushDataToIndexer(wrapper,finIndexerEgBillTopic);
                LOG.info("SUCCESS : CREATED/UPDATED EgBillRegister with IDs : {} is getting indexed to ES successfully",StringUtils.join(idSets,","));
            }else if(!vhDataList.isEmpty()){
                this.prepareUlbDetails(null,vhDataList);
                wrapper.setVoucherHeaderData(vhDataList);
                RequestInfo requestInfo = new RequestInfo();
                requestInfo.setAuthToken(token);
                wrapper.setRequestInfo(requestInfo);
                microServiceUtil.pushDataToIndexer(wrapper,finIndexerVoucherTopic);
                LOG.info("SUCCESS : CREATED/UPDATED CVoucherHeader with IDs : {} is getting indexed to ES successfully",StringUtils.join(idSets,","));
            }else{
                LOG.info("WARNING : DATA is not getting indexed to ES of ID : {}",StringUtils.join(idSets,","));
            }
            
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR while generation event to publish data to ESK");
        }
    }

    private void prepareUlbDetails(List<EgBillRegisterData> egBillDataList, List<VoucherHeaderData> vhDataList) {
        String id = "";
        City city = cityService.getCityByURL(ApplicationThreadLocals.getDomainName());
        if(city != null){
            if(egBillDataList != null && !egBillDataList.isEmpty()){
                for(EgBillRegisterData egbd : egBillDataList){
                    id=egbd.getId();
                    egbd.setId(StringUtils.defaultIfBlank(city.getCode(),"")+"_"+egbd.getId());
                    egbd.setUlbCode(StringUtils.defaultIfBlank(city.getCode(), ""));
                    egbd.setUlbname(StringUtils.defaultIfBlank(city.getName(), ""));
                    egbd.setDistrictname(StringUtils.defaultIfBlank(city.getDistrictName(), ""));
                    egbd.setRegionname(StringUtils.defaultIfBlank(city.getRegionName(), ""));
                    egbd.setUlbgrade(StringUtils.defaultIfBlank(city.getGrade(), ""));
                }
            }
            if(vhDataList != null && !vhDataList.isEmpty()){
                for(VoucherHeaderData vhData : vhDataList){
                    id=vhData.getId();
                    vhData.setId(StringUtils.defaultIfBlank(city.getCode(),"")+"_"+vhData.getId());
                    vhData.setUlbCode(StringUtils.defaultIfBlank(city.getCode(), ""));
                    vhData.setUlbname(StringUtils.defaultIfBlank(city.getName(), ""));
                    vhData.setDistrictname(StringUtils.defaultIfBlank(city.getDistrictName(), ""));
                    vhData.setRegionname(StringUtils.defaultIfBlank(city.getRegionName(), ""));
                    vhData.setUlbgrade(StringUtils.defaultIfBlank(city.getGrade(), ""));
                }
            }
        }else{
          LOG.error("City data not found for domain name : {}", ApplicationThreadLocals.getDomainName());
        }
    }

    private List<CVoucherHeader> getVoucherHeaderById(HashSet<Long> ids) {
        List<CVoucherHeader> list = null;
        try {
            list =  this.getSession().createCriteria(CVoucherHeader.class).add(Restrictions.in("id", ids)).list();
        } catch (HibernateException e) {
            LOG.error("ERROR occurred while fetching the voucherHeader for ID : {}",ids);
        }
        return list;
    }

    private VoucherHeaderData prepareVoucherHeaderData(CVoucherHeader vh, String tenantId, String token) {
        VoucherHeaderData vhd = null;
        try {
            vhd = new VoucherHeaderData.Builder()
                    .setId(vh.getId())
                    .setName(StringUtils.defaultIfBlank(vh.getName(),DEFAULT_STRING))
                    .setType(StringUtils.defaultIfBlank(vh.getType(),DEFAULT_STRING))
                    .setDescription(StringUtils.defaultIfBlank(vh.getDescription(),DEFAULT_STRING))
                    .setEffectiveDate(vh.getEffectiveDate())
                    .setVoucherNumber(StringUtils.defaultIfBlank(vh.getVoucherNumber(), DEFAULT_STRING))
                    .setVoucherDate(vh.getVoucherDate())
                    .setFundcode(vh.getFundId() != null ? vh.getFundId().getCode() : DEFAULT_STRING)
                    .setFundname(vh.getFundId() != null ? vh.getFundId().getName() : DEFAULT_STRING)
                    .setFiscalPeriodName(StringUtils.defaultIfBlank(vh.getFiscalName(), DEFAULT_STRING))
                    .setStatus(vh.getStatus() != null ? this.getVoucherStatus(vh.getStatus()) : DEFAULT_STRING)
                    .setOriginalvcId(vh.getOriginalvcId() != null ? vh.getOriginalvcId() : DEFAULT_INT)
                    .setRefvhId(vh.getRefvhId() != null ? vh.getRefvhId() : DEFAULT_INT)
                    .setVoucherSubType(StringUtils.defaultIfBlank(vh.getVoucherSubType(), DEFAULT_STRING))
                    .setBillNumber(StringUtils.defaultIfBlank(vh.getBillNumber(), DEFAULT_STRING))
                    .setBillDate(vh.getBillDate())
                    .setTimeStamp(new Date().getTime())
                    .build();
            this.prepareVouchermisData(vh, vhd, tenantId, token);
            this.prepareGeneralLedgerData(vh,vhd);
            
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR occurred while setting the voucherHeader data to do indexing for ID : {}",vh.getId());
        }
        return vhd;
    }

    private String getVoucherStatus(final Integer status) {
        if (FinancialConstants.CREATEDVOUCHERSTATUS.equals(status))
            return VoucherStatus.Approved.name();
        if (FinancialConstants.REVERSEDVOUCHERSTATUS.equals(status))
            return VoucherStatus.Reversed.name();
        if (FinancialConstants.REVERSALVOUCHERSTATUS.equals(status))
            return VoucherStatus.Reversal.name();
        if (FinancialConstants.CANCELLEDVOUCHERSTATUS.equals(status))
            return VoucherStatus.Cancelled.name();
        if (FinancialConstants.PREAPPROVEDVOUCHERSTATUS.equals(status))
            return VoucherStatus.Preapproved.name();
        return "";
    }

    private void prepareGeneralLedgerData(CVoucherHeader vh, VoucherHeaderData vhd) {
        Set<CGeneralLedger> generalLedger = vh.getGeneralLedger() != null ? vh.getGeneralLedger() : this.getGeneralLedger(Long.parseLong(vhd.getId()));
        Set<CGeneralLedgerData> glData = new HashSet<>();
        try {
            if(!CollectionUtils.isEmpty(generalLedger)){
                for(CGeneralLedger gl : generalLedger){
                    CGeneralLedgerData build = new CGeneralLedgerData.Builder()
                            .setGlcode(StringUtils.defaultIfBlank(gl.getGlcode(), DEFAULT_STRING))
                            .setCoaname(gl.getGlcode() != null ? gl.getGlcodeId().getName() : DEFAULT_STRING)
                            .setCreditAmount(gl.getCreditAmount() != null ? gl.getCreditAmount() : DEFAULT_INT)
                            .setDebitAmount(gl.getDebitAmount() != null ? gl.getDebitAmount() : DEFAULT_INT)
                            .setDescription(StringUtils.defaultIfBlank(gl.getDescription(), DEFAULT_STRING))
                            .setId(gl.getId())
                            .setIsSubLedger(gl.getIsSubLedger())
                            .build();
                    this.prepareGeneralLedgerDetailsData(gl,build);
                    glData.add(build);
                }
            }
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR while setting the General Ledger data for voucher ID : {}",vh.getId());
        }
        vhd.setGeneralLedger(glData);
    }

    private void prepareGeneralLedgerDetailsData(CGeneralLedger gl, CGeneralLedgerData build) {
        try {
            Set<CGeneralLedgerDetail> ledgerDetails = gl.getGeneralLedgerDetails();
            Set<CGeneralLedgerDetailData> ledgerDetailsData = new HashSet<>();
            if(ledgerDetails != null && !ledgerDetails.isEmpty()){
                for(CGeneralLedgerDetail gld : ledgerDetails){
                    CGeneralLedgerDetailData gldData = new CGeneralLedgerDetailData.Builder()
                            .setAmount(gld.getAmount())
                            .setId(gld.getId())
                            .setDetailkeyname(gld.getDetailTypeId().getAttributename())
                            .setDetailtypename(gld.getDetailTypeId().getName())
                            .build();
                    ledgerDetailsData.add(gldData);
                }
            }
            build.setGeneralLedgerDetails(ledgerDetailsData);
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR occurred while setting the general ledger details data to index for ID : {}", gl.getId());
        }
    }

    @Transactional(propagation=Propagation.REQUIRED, readOnly=true)
    private Set<CGeneralLedger> getGeneralLedger(Long id) {
        try {
            List<CGeneralLedger> list = this.getSession().createCriteria(CGeneralLedger.class).add(Restrictions.eq("voucherHeaderId.id", id)).list();
            return new HashSet<>(list);
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR while fetching the generalLedger Data from Database for general ledger ID : {}",id);
        }
        return null;
    }

    private void prepareVouchermisData(CVoucherHeader vh, VoucherHeaderData vhd, String tenantId, String token) {
        Vouchermis vouchermis = vh.getVouchermis();
        if(vouchermis != null){
            vhd.setFundsourcecode(vouchermis.getFundsource() != null ? vouchermis.getFundsource().getCode() : DEFAULT_STRING);
            vhd.setFundsourcename(vouchermis.getFundsource() != null ? vouchermis.getFundsource().getName() : DEFAULT_STRING);
            String departmentcode = vouchermis.getDepartmentcode();
            vhd.setDepartmentcode(StringUtils.defaultIfBlank(departmentcode, DEFAULT_STRING));
            vhd.setDepartmentName(StringUtils.defaultIfBlank(departmentcode, DEFAULT_STRING));
            if(!departmentcode .isEmpty()){
                Department department = microServiceUtil.getDepartment(departmentcode, tenantId, token);
                if(department != null){
                    vhd.setDepartmentName(department.getName());
                }
            }
            vhd.setSchemecode(vouchermis.getSchemeid() != null ? vouchermis.getSchemeid().getCode() : DEFAULT_STRING);
            vhd.setSchemecname(vouchermis.getSchemeid() != null ? vouchermis.getSchemeid().getName() : DEFAULT_STRING);
            vhd.setSubschemecode(vouchermis.getSubschemeid() != null ? vouchermis.getSubschemeid().getCode() : DEFAULT_STRING);
            vhd.setSubschemename(vouchermis.getSubschemeid() != null ? vouchermis.getSubschemeid().getName() : DEFAULT_STRING);
            vhd.setFunctionaryname(vouchermis.getFunctionary() != null ? vouchermis.getFunctionary().getName() : DEFAULT_STRING);
            vhd.setFunctioncode(vouchermis.getFunction() != null ? vouchermis.getFunction().getCode() : DEFAULT_STRING);
            vhd.setFunctionname(vouchermis.getFunction() != null ? vouchermis.getFunction().getName() : DEFAULT_STRING);
            vhd.setReferenceDocument(StringUtils.defaultIfBlank(vouchermis.getReferenceDocument(), DEFAULT_STRING));
            vhd.setServiceName(StringUtils.defaultIfBlank(vouchermis.getServiceName(), DEFAULT_STRING));
        }
    }

    @Transactional(propagation=Propagation.REQUIRED,readOnly=true)
    private List<EgBillregister> getEgBillRegisterById(Object data) {
        List<EgBillregister> egbillList = new ArrayList<>();
        if(data instanceof HashSet){
            HashSet<Long> billListId = (HashSet<Long>) data;
                try {
                    egbillList = this.getSession().createCriteria(EgBillregister.class).add(Restrictions.in("id", billListId)).list();
                } catch (HibernateException e) {
                    LOG.error("ERROR while fetching bill for ID : {}",billListId);
                }
            }
        return egbillList;
    }
    
    @Transactional(propagation=Propagation.REQUIRED,readOnly=true)
    public EgBillRegisterData prepareEgBillRegisterData(EgBillregister billRegister, String tenantId, String token) {
        try {
            this.populateBillDetails(billRegister);
            EgBillRegisterData data = new EgBillRegisterData.Builder()
                    .setId(billRegister.getId())
                    .setBillnumber(StringUtils.defaultIfBlank(billRegister.getBillnumber(), DEFAULT_STRING))
                    .setBillamount(getDefaultBigDecimalIfBlank(billRegister.getBillamount()))
                    .setBillapprovalstatus(StringUtils.defaultIfBlank(billRegister.getBillapprovalstatus(), DEFAULT_STRING))
                    .setBilldate(billRegister.getBilldate())
                    .setBilltype(StringUtils.defaultIfBlank(billRegister.getBilltype(), DEFAULT_STRING))
                    .setNarration(StringUtils.defaultIfBlank(billRegister.getNarration(), DEFAULT_STRING))
                    .setExpendituretype(StringUtils.defaultIfBlank(billRegister.getExpendituretype(), DEFAULT_STRING))
                    .setPassedamount(getDefaultBigDecimalIfBlank(billRegister.getPassedamount()))
                    .setTimeStamp(new Date().getTime())
                    .setWorkordernumber(StringUtils.defaultIfBlank(billRegister.getWorkordernumber(), DEFAULT_STRING))
                    .setStatus(billRegister.getStatus())
                    .build();
            this.prepareEgBillRegisterMis(billRegister, data, tenantId, token);
            this.prepareEgBillDetails(billRegister, data);
            return data;
            
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR while setting the egbillregister data for ID : {} ",billRegister.getId(), e);
        }
        return null;
    }
    
    private void prepareEgBillRegisterMis(EgBillregister billRegister,EgBillRegisterData data, String tenantId,String token) {
        try {
            EgBillregistermis mis = billRegister.getEgBillregistermis();
            data.setNarration(StringUtils.defaultIfBlank(mis.getNarration(), DEFAULT_STRING));
            String departmentcode = StringUtils.defaultIfBlank(mis.getDepartmentcode(), DEFAULT_STRING);
            data.setDepartmentcode(departmentcode);
            if(!departmentcode.isEmpty()){
                Department department = microServiceUtil.getDepartment(departmentcode, tenantId, token);
                data.setDepartmentname(departmentcode.isEmpty() ? departmentcode : department != null ? department.getName() : departmentcode);
            }
            data.setPayto(StringUtils.defaultIfBlank(mis.getPayto(), DEFAULT_STRING));
            data.setFunctioncode(StringUtils.defaultIfBlank(mis.getFunction() != null ? mis.getFunction().getCode() : null, DEFAULT_STRING));
            data.setFunctionname(StringUtils.defaultIfBlank(mis.getFunction() != null ? mis.getFunction().getName() : null, DEFAULT_STRING));
            data.setFundCode(StringUtils.defaultIfBlank(mis.getFund() != null ? mis.getFund().getCode() : null, DEFAULT_STRING));
            data.setFundname(StringUtils.defaultIfBlank(mis.getFund() != null ? mis.getFund().getName() : null, DEFAULT_STRING));
            data.setSchemecode(StringUtils.defaultIfBlank(mis.getScheme() != null ? mis.getScheme().getCode() : null, DEFAULT_STRING));
            data.setSchemename(StringUtils.defaultIfBlank(mis.getScheme() != null ? mis.getScheme().getName() : null, DEFAULT_STRING));
            data.setSubschemecode(StringUtils.defaultIfBlank(mis.getSubScheme() != null ? mis.getSubScheme().getCode() : null, DEFAULT_STRING));
            data.setSubschemename(StringUtils.defaultIfBlank(mis.getSubScheme() != null ? mis.getSubScheme().getName() : null, DEFAULT_STRING));
            data.setVouchernumber(StringUtils.defaultIfBlank(mis.getVoucherHeader() != null ? mis.getVoucherHeader().getVoucherNumber() : null, DEFAULT_STRING));
            data.setPartyBillNumber(StringUtils.defaultIfBlank(mis.getPartyBillNumber() !=null ? mis.getPartyBillNumber() : null, DEFAULT_STRING));
            data.setPartyBillDate(mis.getPartyBillDate() != null ? mis.getPartyBillDate() : new Date());
            data.setBudgetaryAppnumber(StringUtils.defaultIfBlank(mis.getBudgetaryAppnumber(), DEFAULT_STRING));
            data.setEgBillSubType(StringUtils.defaultIfBlank(mis.getEgBillSubType().getName(), DEFAULT_STRING));
        } catch (DataException e) {
            LOG.error("ERROR Occured while setting the BillRegisterMis Data to wrapper for indexing for ID : {}",billRegister.getId(), e.getCause());
        }
    }
    
    private void prepareEgBillDetails(EgBillregister billRegister, EgBillRegisterData data) {
        Set<EgBilldetails> billDetails = billRegister.getEgBilldetailes();
        HashSet<EgBilldetailsData> hashSet = new HashSet<EgBilldetailsData>();
        if(!CollectionUtils.isEmpty(billDetails)){
            for(EgBilldetails bd : billDetails){
                EgBilldetailsData billdetailsData = new EgBilldetailsData.Builder()
                        .setBillid(bd.getEgBillregister().getId())
                        .setCreditamount(this.getDefaultBigDecimalIfBlank(bd.getCreditamount()))
                        .setDebitamount(this.getDefaultBigDecimalIfBlank(bd.getDebitamount()))
                        .setFunctioncode(bd.getFunction() != null ? bd.getFunction().getCode() : DEFAULT_STRING)
                        .setFunctionname(bd.getFunction() != null ? bd.getFunction().getName() : DEFAULT_STRING)
                        .setId(bd.getId())
                        .setNarration(StringUtils.defaultIfBlank(bd.getNarration(),DEFAULT_STRING))
                        .setLastupdatedtime(bd.getLastupdatedtime())
                        .setGlcode(bd.getChartOfAccounts() != null ? bd.getChartOfAccounts().getGlcode() : DEFAULT_STRING)
                        .setCoaname(bd.getChartOfAccounts() != null ? bd.getChartOfAccounts().getName() : DEFAULT_STRING)
                        .build();
                this.prepareEgBillPayeeDetails(bd.getEgBillPaydetailes(),billdetailsData);
                hashSet.add(billdetailsData);
            }
        }
        data.setEgbilldetailes(hashSet);
    }

    private void prepareEgBillPayeeDetails(Set<EgBillPayeedetails> egBillPaydetailes, EgBilldetailsData billdetailsData) {
        HashSet<EgBillPayeedetailsData> set = new HashSet<EgBillPayeedetailsData>(0);
        if(egBillPaydetailes != null && !egBillPaydetailes.isEmpty()){
            for(EgBillPayeedetails pd:egBillPaydetailes){
                EgBillPayeedetailsData egBillPd = new EgBillPayeedetailsData.Builder()
                        .setId(pd.getId())
                        .setCreditAmount(pd.getCreditAmount())
                        .setDebitAmount(pd.getDebitAmount())
                        .setDetailkeyname(pd.getDetailKeyName())
                        .setDetailtypename(pd.getDetailTypeName())
                        .setLastUpdatedTime(pd.getLastUpdatedTime())
                        .build();
                set.add(egBillPd);
            }
        }
        billdetailsData.setEgBillPaydetailes(set);
    }

    public BigDecimal getDefaultBigDecimalIfBlank(BigDecimal val){
        return Objects.isNull(val) ? new BigDecimal(0) :val;
    }
    
    @Transactional(propagation=Propagation.REQUIRED,readOnly=true)
    protected void populateBillDetails(final EgBillregister egBillregister) {
        try {
            for (final EgBilldetails details : egBillregister.getEgBilldetailes()) {
                if (details.getGlcodeid() != null && details.getChartOfAccounts() == null) {
                    if (egBillregister.getEgBillregistermis().getFunction() != null){
                        details.setFunction(egBillregister.getEgBillregistermis().getFunction());
                    }
                    details.setLastupdatedtime(new Date());
                    details.setChartOfAccounts(chartOfAccountsService.findById(details.getGlcodeid().longValue(), false));
                }
            }
            if (!egBillregister.getEgBilldetailes().isEmpty())
                populateBillPayeeDetails(egBillregister);
            
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR occurred while setting the EgBillDetailData for ID : {}",egBillregister.getId());
        }
    }

    @Transactional
    protected void populateBillPayeeDetails(final EgBillregister egBillregister) {
        try {
            for (final EgBilldetails details : egBillregister.getEgBilldetailes()){
                for (final EgBillPayeedetails payeeDetails : details.getEgBillPaydetailes()){
                    if(payeeDetails.getAccountDetailKeyId() != null && payeeDetails.getAccountDetailKeyId() != 0
                       && payeeDetails.getAccountDetailTypeId() != null && payeeDetails.getAccountDetailTypeId() != 0
                       && StringUtils.isBlank(payeeDetails.getDetailKeyName())
                       && StringUtils.isBlank(payeeDetails.getDetailTypeName())){
                        List<Object[]> accountDetails = this.getAccountDetails(payeeDetails.getAccountDetailKeyId(), payeeDetails.getAccountDetailTypeId());
                        payeeDetails.setDetailKeyName(!accountDetails.isEmpty() ? (String)accountDetails.get(0)[0] : DEFAULT_STRING);
                        payeeDetails.setDetailTypeName(!accountDetails.isEmpty() ? (String)accountDetails.get(0)[1] : DEFAULT_STRING);
                        
                    }
                }
            }
            
        } catch (ApplicationRuntimeException e) {
            LOG.error("ERROR occurred while setting the payeeDetails for ID : {}",egBillregister.getId());
        }
    }

	private List<Object[]> getAccountDetails(Integer accountDetailKeyId, Integer accountDetailTypeId) {
		final StringBuilder queryString = new StringBuilder(
				"select adk.detailname as detailkeyname,adt.name as detailtypename ")
						.append("from accountdetailkey adk inner join accountdetailtype adt on adk.detailtypeid=adt.id")
						.append(" where adk.detailtypeid=:detailtypeid and adk.detailkey=:detailkey");
		SQLQuery sqlQuery = this.getSession().createSQLQuery(queryString.toString());
		sqlQuery.setInteger("detailtypeid", accountDetailTypeId);
		sqlQuery.setInteger("detailkey", accountDetailKeyId);
		return sqlQuery.list();
	}
    
    private void prepareThreadLocal(String tenant, String domainName) {
        ApplicationThreadLocals.setTenantID(tenant.split(Pattern.quote("."))[1]);
        ApplicationThreadLocals.setDomainName(domainName);
    }
    
    private Session getSession(){
         return entityManager.unwrap(Session.class);
    }
    
    @Transactional(propagation=Propagation.REQUIRED,readOnly=true)
    private EgBillregister getEgBillRegisterByVoucherId(CVoucherHeader vh){
        try {
            return (EgBillregister) this.getSession().createCriteria(EgBillregistermis.class).add(Restrictions.eq("voucherHeader", vh)).uniqueResult();
        } catch (HibernateException e) {
            LOG.error("ERROR while fetching the EgBillRegister data for voucher ID : {}",vh.getId());
        }
        return null;
    }
    
    private EgBillregister getBillRegisterByBillNumber(String billNumber){
        try {
            return (EgBillregister) this.getSession().createCriteria(EgBillregister.class).add(Restrictions.eq("billnumber", billNumber)).uniqueResult();
        } catch (HibernateException e) {
            LOG.error("ERROR occurred while fetching the billRegister Data for billNumber :  {}",billNumber);
        }
        return null;
    }
    
    public void billPaymentUpdatedAction(Paymentheader paymentheader){
        try {
            CVoucherHeader voucherHeader = paymentheader.getVoucherheader();
            this.publishEvent(FinanceEventType.voucherUpdateById ,  new HashSet<>(Arrays.asList(voucherHeader.getId())));
        } catch (HibernateException e) {
            LOG.error("ERROR occurred while pushing data to index in billPaymentUpdatedAction method :", e);
        }
    }
}
