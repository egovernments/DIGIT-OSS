package org.egov.vehicle.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vehicle.repository.VehicleRepository;
import org.egov.vehicle.util.VehicleErrorConstants;
import org.egov.vehicle.util.VehicleUtil;
import org.egov.vehicle.validator.Validator;
import org.egov.vehicle.web.model.Vehicle;
import org.egov.vehicle.web.model.VehicleRequest;
import org.egov.vehicle.web.model.VehicleResponse;
import org.egov.vehicle.web.model.VehicleSearchCriteria;
import org.egov.vehicle.web.model.user.User;
import org.egov.vehicle.web.model.user.UserDetailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class VehicleService {

    @Autowired
    private VehicleUtil util;

    @Autowired
    private EnrichmentService enrichmentService;

    @Autowired
    private VehicleRepository repository;
    
    @Autowired
    private Validator validator;
    
    @Autowired
    private UserService userService;

    public Vehicle create(VehicleRequest vehicleRequest) {
    		
    	RequestInfo requestInfo = vehicleRequest.getRequestInfo();
		String tenantId = vehicleRequest.getVehicle().getTenantId().split("\\.")[0];
		Object mdmsData = util.mDMSCall(requestInfo, tenantId);
		if (vehicleRequest.getVehicle().getTenantId().split("\\.").length == 1) {
			throw new CustomException(VehicleErrorConstants.INVALID_TENANT, " Application cannot be create at StateLevel");
		}
		validator.validateCreate(vehicleRequest,mdmsData);
        enrichmentService.enrichVehicleCreateRequest(vehicleRequest);
        repository.save(vehicleRequest);
        return vehicleRequest.getVehicle();
    }

	public VehicleResponse search(@Valid VehicleSearchCriteria criteria, RequestInfo requestInfo) {
		validator.validateSearch(requestInfo, criteria);
		UserDetailResponse usersRespnse;
		List<String> uuids = new ArrayList<String>();
		
		if(criteria.tenantIdOnly() ) {
			throw new CustomException(VehicleErrorConstants.INVALID_SEARCH, " Atlest one parameter is mandatory!");
		}
		
		if( criteria.getMobileNumber() !=null) {
			usersRespnse = userService.getOwner(criteria,requestInfo);
			if(usersRespnse !=null && usersRespnse.getUser() != null && usersRespnse.getUser().size() >0) {
				uuids = usersRespnse.getUser().stream().map(User::getUuid).collect(Collectors.toList());
				if(CollectionUtils.isEmpty(criteria.getOwnerId())) {
					criteria.setOwnerId(uuids);
				}else {
					criteria.getOwnerId().addAll(uuids);
				}
			}
		}
		
		VehicleResponse response = repository.getVehicleData(criteria);
		
		if(!response.getVehicle().isEmpty()) {
			enrichmentService.enrichSearchData(response.getVehicle(),requestInfo);
		}
		return response;
	}

}
