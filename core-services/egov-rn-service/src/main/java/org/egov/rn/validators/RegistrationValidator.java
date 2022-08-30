package org.egov.rn.validators;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.rn.exception.ValidationException;
import org.egov.rn.repository.ServiceRequestRepository;
import org.egov.rn.web.models.HouseholdRegistration;
import org.egov.rn.web.models.Registration;
import org.egov.rn.web.models.RegistrationRequest;
import org.egov.rn.web.utils.ExceptionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class RegistrationValidator {

    @Value("${egov.mdms.host}")
    private String mdmsHost;

    @Value("${egov.mdms.search.endpoint}")
    private String mdmsUrl;

    private ServiceRequestRepository serviceRequestRepository;

    public RegistrationValidator(ServiceRequestRepository serviceRequestRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public void validate(RegistrationRequest registrationRequest) {
        try {
            if (registrationRequest == null || registrationRequest.getRegistration() == null) {
                throw new ValidationException(ExceptionUtils.getErrorMessage("null payload"));
            }
            if (registrationRequest.getRequestInfo() == null) {
                throw new ValidationException(ExceptionUtils.getErrorMessage("requestInfo cannot be null"));
            }
            if (registrationRequest.getRequestInfo().getUserInfo().getUuid() == null) {
                throw new ValidationException(ExceptionUtils.getErrorMessage("user-uuid cannot be null"));
            }
            if (registrationRequest.getTenantId() == null) {
                throw new ValidationException(ExceptionUtils.getErrorMessage("tenantId cannot be null"));
            }
            Registration registration = registrationRequest.getRegistration();
            if (registration instanceof HouseholdRegistration) {
                HouseholdRegistration householdRegistration = (HouseholdRegistration) registration;
                if (householdRegistration.getName() == null) {
                    throw new ValidationException(ExceptionUtils.getErrorMessage("name cannot be null"));
                }
                if (Boolean.FALSE.equals(householdRegistration.getIsHead())
                        && householdRegistration.getHouseholdId() == null) {
                    throw new ValidationException(ExceptionUtils.getErrorMessage("a member of a household needs to have a householdId"));
                }
            }
            Object response = serviceRequestRepository.fetchResult(new StringBuilder(mdmsHost + mdmsUrl),
                    getMdmsRequestForValidationList(registrationRequest.getRequestInfo(),
                            registrationRequest.getTenantId()));
            log.info(JsonPath.read(response, "$.MdmsRes.egov-rn-service.validations.[0]"));
        } catch (Exception ex) {
            throw new ValidationException(ex.getMessage(), ex);
        }
    }

    private MdmsCriteriaReq getMdmsRequestForValidationList(RequestInfo requestInfo, String tenantId) {
        MasterDetail masterDetail = new MasterDetail();
        masterDetail.setName("validations");
        List<MasterDetail> masterDetailList = new ArrayList<>();
        masterDetailList.add(masterDetail);

        ModuleDetail moduleDetail = new ModuleDetail();
        moduleDetail.setMasterDetails(masterDetailList);
        moduleDetail.setModuleName("egov-rn-service");
        List<ModuleDetail> moduleDetailList = new ArrayList<>();
        moduleDetailList.add(moduleDetail);

        MdmsCriteria mdmsCriteria = new MdmsCriteria();
        mdmsCriteria.setTenantId(tenantId.split("\\.")[0]);
        mdmsCriteria.setModuleDetails(moduleDetailList);

        MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
        mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
        mdmsCriteriaReq.setRequestInfo(requestInfo);

        return mdmsCriteriaReq;
    }
}
