package org.egov.vendor.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.repository.VendorRepository;
import org.egov.vendor.util.VendorConstants;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.validator.VendorValidator;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.egov.vendor.web.model.user.User;
import org.egov.vendor.web.model.user.UserDetailResponse;
import org.egov.vendor.web.model.vehicle.Vehicle;
import org.egov.vendor.web.model.vehicle.VehicleSearchCriteria;
import org.egov.vendor.web.model.vehicle.Vehicle.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VendorService {

	@Autowired
    private VendorUtil util;

	@Autowired
	private VendorRepository vendorRepository;

	@Autowired
	private VendorValidator vendorValidator;

	@Autowired
	private VendorRepository repository;


	@Autowired
	private EnrichmentService enrichmentService;
	
	@Autowired
	private VehicleService vehicleService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private VendorConfiguration config;
	

	public Vendor create(VendorRequest vendorRequest) {
		RequestInfo requestInfo = vendorRequest.getRequestInfo();
		String tenantId = vendorRequest.getVendor().getTenantId().split("\\.")[0];
		if (vendorRequest.getVendor().getTenantId().split("\\.").length == 1) {
			throw new CustomException("Invalid TenantId", " Application cannot be create at StateLevel");
		}
		Object mdmsData = util.mDMSCall(requestInfo, tenantId);
		vendorValidator.validateCreateOrUpdateRequest(vendorRequest, mdmsData,true);
		enrichmentService.enrichCreate(vendorRequest);
		vendorRepository.save(vendorRequest);
		return vendorRequest.getVendor();

	}

	public Vendor update(VendorRequest vendorRequest) {
		RequestInfo requestInfo = vendorRequest.getRequestInfo();
		String tenantId = vendorRequest.getVendor().getTenantId().split("\\.")[0];
		
		if (vendorRequest.getVendor().getTenantId().split("\\.").length == 1) {
			throw new CustomException("Invalid TenantId", " Application cannot be updated at StateLevel");
		}
		
		if (vendorRequest.getVendor() != null && vendorRequest.getVendor().getId() == null) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Vendor Not found in the System" + vendorRequest.getVendor().getName());
		}
		
		if (vendorRequest.getVendor() != null && vendorRequest.getVendor().getAddress() != null
				&& vendorRequest.getVendor().getAddress().getId() == null) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Vendor address not found in the System" + vendorRequest.getVendor().getAddress());
		}
		
		if (vendorRequest.getVendor() != null && vendorRequest.getVendor().getOwner() == null) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Owner details not present in the present" + vendorRequest.getVendor().getName());
		}
		
		VendorSearchCriteria criteria=new VendorSearchCriteria();
		criteria.setTenantId(vendorRequest.getVendor().getTenantId());
		criteria.setIds(Arrays.asList(vendorRequest.getVendor().getId()));
		
		List<Vendor> existingVendorResult= vendorsearch(criteria,requestInfo);
		
		if (existingVendorResult.size() <= 0) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Vendor Not found in the System" + vendorRequest.getVendor().getName());
		}
		if (existingVendorResult.size() > 1) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Found multiple application(s)" + vendorRequest.getVendor().getName());
		}
		
		Vendor oldVendor =existingVendorResult.get(0);
		if(!oldVendor.getOwnerId().equalsIgnoreCase(vendorRequest.getVendor().getOwnerId())) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"OwnerId mismatch between the update request and existing vendor record"
							+ vendorRequest.getVendor().getName());
		}
		
		if (oldVendor.getOwner() != null && vendorRequest.getVendor().getOwner() != null && !oldVendor.getOwner()
				.getMobileNumber().equalsIgnoreCase(vendorRequest.getVendor().getOwner().getMobileNumber())) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Mobile number update is not allowed" + vendorRequest.getVendor().getOwner().getMobileNumber());
		};
		
		Object mdmsData = util.mDMSCall(requestInfo, tenantId);
		vendorValidator.validateCreateOrUpdateRequest(vendorRequest, mdmsData,false);
		enrichmentService.enrichUpdate(vendorRequest);
		vendorRepository.update(vendorRequest);
		return vendorRequest.getVendor();

	}

	
	public List<Vendor> vendorsearch(VendorSearchCriteria criteria, RequestInfo requestInfo) {

		List<Vendor> vendorList = new LinkedList<>();
		List<String> uuids = new ArrayList<String>();
		UserDetailResponse userDetailResponse;
		
		vendorValidator.validateSearch(requestInfo, criteria);
		
		if( criteria.getMobileNumber() !=null) {
			userDetailResponse = userService.getOwner(criteria,requestInfo); 
			if(userDetailResponse !=null && userDetailResponse.getUser() != null && userDetailResponse.getUser().size() >0) {
				uuids = userDetailResponse.getUser().stream().map(User::getUuid).collect(Collectors.toList());
				if(CollectionUtils.isEmpty(criteria.getOwnerIds())) {
					criteria.setOwnerIds(uuids);
				}else {
					criteria.getOwnerIds().addAll(uuids);
				}
			}
		}
		
		if (!CollectionUtils.isEmpty(criteria.getVehicleRegistrationNumber())
				|| StringUtils.hasLength(criteria.getVehicleType())
				|| StringUtils.hasLength(criteria.getVehicleCapacity())) {
			
			VehicleSearchCriteria vehicleSearchCriteria=new VehicleSearchCriteria();
			vehicleSearchCriteria = VehicleSearchCriteria.builder()
					.registrationNumber(criteria.getVehicleRegistrationNumber())
					.vehicleType(criteria.getVehicleType())
					.vehicleCapacity(criteria.getVehicleCapacity())
					.tenantId(criteria.getTenantId())
					.status(criteria.getStatus()).build();
			
			List<Vehicle> vehicles = vehicleService.getVehicles(vehicleSearchCriteria,requestInfo);
			
			if(CollectionUtils.isEmpty(vehicles)) {
				return new ArrayList<Vendor>();
			}
			if(CollectionUtils.isEmpty(criteria.getVehicleIds())) {
				criteria.setVehicleIds(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
			}else {
				criteria.getVehicleIds().addAll(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
			}
			
		}
		
		if(!CollectionUtils.isEmpty(criteria.getVehicleIds())) {
			List<String> vendorIds  = repository.getVendorWithVehicles(criteria);
			if(CollectionUtils.isEmpty(vendorIds)) {
				return new ArrayList<Vendor>();
			}else {
				if(CollectionUtils.isEmpty(criteria.getIds())) {
					criteria.setIds(vendorIds);
				}else {
					criteria.getIds().addAll(vendorIds);
				}					
			}
		}
		
		vendorList = repository.getVendorData(criteria);
		if (!vendorList.isEmpty()) {
			enrichmentService.enrichVendorSearch(vendorList, requestInfo, criteria.getTenantId());
		}
		

		if (vendorList.isEmpty()) {
			return Collections.emptyList();
		}

		return vendorList;

	}

	public List<Vendor> vendorPlainSearch(@Valid VendorSearchCriteria criteria, RequestInfo requestInfo) {
		 List<Vendor> vendorList = getVendorPlainSearch(criteria, requestInfo);
		return vendorList;
	}

	private List<Vendor> getVendorPlainSearch(@Valid VendorSearchCriteria criteria, RequestInfo requestInfo) {
		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
            criteria.setLimit(config.getMaxSearchLimit());

        List<String> ids = null;

        if(criteria.getIds() != null && !criteria.getIds().isEmpty())
            ids = criteria.getIds();
        else
            ids = repository.fetchVendorIds(criteria);

        if(ids.isEmpty())
            return Collections.emptyList();

        VendorSearchCriteria vendorCriteria = VendorSearchCriteria.builder().ids(ids).build();

        List<Vendor> vendorList = repository.getVendorPlainSearch(vendorCriteria);
        if (!vendorList.isEmpty()) {
			enrichmentService.enrichVendorSearch(vendorList, requestInfo, criteria.getTenantId());
		}
        
        return vendorList;
	}

}
