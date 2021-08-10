package org.egov.egf.es.integration.service;

import java.util.Date;

import org.apache.log4j.Logger;
import org.egov.egf.es.integration.dao.ESDashboardDAO;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.models.RequestInfo;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.hibernate.HibernateException;
import org.python.icu.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ESSchedularService {
    @Autowired
    private ESDashboardDAO eSDashboardDAO;
    @Autowired
    private MicroserviceUtils microServiceUtil;
    private static final Logger LOGGER = Logger.getLogger(ESSchedularService.class);
    @Value("${egov.finance.rollout.indexer.topic.name}")
    private String finIndexerTopic;
    
    public void pushRollOutAdoption() {
        try {
            Object[] obj = eSDashboardDAO.getRolloutAdoptionData();            
            LOGGER.info("rollOutAdoption Data : "+obj);
            if(obj != null){
                String id = obj[0].toString();
                String ulbName = obj[1] != null ? obj[1].toString() : null;
                String ulbcode = obj[2] != null ? obj[2].toString() : null;
                String districtname = obj[3] != null ? obj[3].toString() : null;
                String regionname = obj[4] != null ? obj[4].toString() : null;
                String grade = obj[5] != null ? obj[5].toString() : null;
                Integer numberOfbills = obj[6] != null ? Integer.parseInt(obj[6].toString()) : 0;
                Integer numberofvouchersforbill = obj[7] != null ? Integer.parseInt(obj[7].toString()) : 0;
                Integer numberofpayments = obj[8] != null ? Integer.parseInt(obj[8].toString()) : 0;
                BigDecimal totalbillamounts = obj[9] != null ? new BigDecimal(obj[9].toString()) : new BigDecimal(0);
                BigDecimal billamountpaid = obj[10] != null ? new BigDecimal(obj[10].toString()) : new BigDecimal(0);
                BigDecimal totalpaymentamounts = obj[11] != null ? new BigDecimal(obj[11].toString()) : new BigDecimal(0);
                Integer numberOfReceiptVoucher = obj[12] != null ? Integer.parseInt(obj[12].toString()) : 0;
                BigDecimal totalReceiptVoucherAmounts = obj[13] != null ? new BigDecimal(obj[13].toString()) : new BigDecimal(0);
                Integer numberofmiscreceipts = obj[14] != null ? Integer.parseInt(obj[14].toString()) : 0;
                BigDecimal totalamountofmiscreceipt = obj[15] != null ? new BigDecimal(obj[15].toString()) : new BigDecimal(0);
                Integer numberofcontractorsuppliers = obj[16] != null ? Integer.parseInt(obj[16].toString()) : 0;
                Integer numberofbankaccounts = obj[17] != null ? Integer.parseInt(obj[17].toString()) : 0;
                Integer numberofbillspaid = obj[18] != null ? Integer.parseInt(obj[18].toString()) : 0;
                RollOutAdoptionData rollOutAdoptionData = new RollOutAdoptionData(id,ulbName,ulbcode,districtname,regionname,grade,numberOfbills,numberofvouchersforbill,numberofpayments,
                        totalbillamounts,billamountpaid,totalpaymentamounts,numberOfReceiptVoucher,totalReceiptVoucherAmounts,numberofmiscreceipts,
                        totalamountofmiscreceipt,numberofcontractorsuppliers,numberofbankaccounts,numberofbillspaid,microServiceUtil.getEpochDate(new Date()));
                LOGGER.info("*************** RollOutAdoptionData : "+rollOutAdoptionData);
                this.pushDataToEsIndex(rollOutAdoptionData);
            }
        } catch (HibernateException e) {
            LOGGER.error(e.getMessage());
        } catch (ApplicationRuntimeException e){
            LOGGER.error(e.getMessage());
        }
     }
    
    private void pushDataToEsIndex(RollOutAdoptionData rollOutAdoptionData){
        RollOutAdoptionDataWrapper wrapper = new RollOutAdoptionDataWrapper();
        wrapper.setRollOutAdoptionData(rollOutAdoptionData);
        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setAuthToken(microServiceUtil.generateAdminToken("pb."+ApplicationThreadLocals.getTenantID()));
        wrapper.setRequestInfo(requestInfo);
        microServiceUtil.pushDataToIndexer(wrapper,finIndexerTopic);
    }

}
