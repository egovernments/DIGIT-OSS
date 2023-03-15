package org.egov.vendor.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.vendor.config.VendorConfiguration;
import org.egov.vendor.driver.web.model.Driver;
import org.egov.vendor.repository.VendorRepository;
import org.egov.vendor.util.VendorConstants;
import org.egov.vendor.util.VendorUtil;
import org.egov.vendor.validator.VendorValidator;
import org.egov.vendor.web.model.Vendor;
import org.egov.vendor.web.model.VendorRequest;
import org.egov.vendor.web.model.VendorResponse;
import org.egov.vendor.web.model.VendorSearchCriteria;
import org.egov.vendor.web.model.user.User;
import org.egov.vendor.web.model.user.UserDetailResponse;
import org.egov.vendor.web.model.vehicle.Vehicle;
import org.egov.vendor.web.model.vehicle.VehicleSearchCriteria;
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
		vendorValidator.validateCreateOrUpdateRequest(vendorRequest, mdmsData, true);
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

		VendorSearchCriteria criteria = new VendorSearchCriteria();
		criteria.setTenantId(vendorRequest.getVendor().getTenantId());
		criteria.setIds(Arrays.asList(vendorRequest.getVendor().getId()));

		VendorResponse existingVendorResult = vendorsearch(criteria, requestInfo);

		if (existingVendorResult != null && existingVendorResult.getVendor().isEmpty()) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Vendor Not found in the System" + vendorRequest.getVendor().getName());
		}
		if (existingVendorResult != null && existingVendorResult.getVendor().size() > 1) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Found multiple application(s)" + vendorRequest.getVendor().getName());
		}

		Vendor oldVendor = existingVendorResult != null ? existingVendorResult.getVendor().get(0) : new Vendor();

		if (!oldVendor.getOwnerId().equalsIgnoreCase(vendorRequest.getVendor().getOwnerId())) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"OwnerId mismatch between the update request and existing vendor record"
							+ vendorRequest.getVendor().getName());
		}

		if (oldVendor.getOwner() != null && vendorRequest.getVendor().getOwner() != null && !oldVendor.getOwner()
				.getMobileNumber().equalsIgnoreCase(vendorRequest.getVendor().getOwner().getMobileNumber())) {
			throw new CustomException(VendorConstants.UPDATE_ERROR,
					"Mobile number update is not allowed" + vendorRequest.getVendor().getOwner().getMobileNumber());
		}

		Object mdmsData = util.mDMSCall(requestInfo, tenantId);
		vendorValidator.validateCreateOrUpdateRequest(vendorRequest, mdmsData, false);
		enrichmentService.enrichUpdate(vendorRequest);
		updateVendor(vendorRequest, tenantId);

		return vendorRequest.getVendor();

	}

	private void updateVendor(VendorRequest vendorRequest, String tenantId) {
		List<Driver> vendorDriverToBeUpdated = new ArrayList<>();
		List<Driver> vendorDriverToBeInserted = new ArrayList<>();
		List<Vehicle> vendorVehicleToBeUpdated = new ArrayList<>();
		List<Vehicle> vendorVehicleToBeInserted = new ArrayList<>();

		List<Vehicle> beforeUpdateOrInsertVehicle = new ArrayList<>();
		List<Driver> beforeUpdateOrInsertDriver = new ArrayList<>();
		getVehicleDriver(vendorRequest, vendorDriverToBeUpdated, vendorDriverToBeInserted, beforeUpdateOrInsertDriver,
				tenantId);
		getVendorVehicle(vendorRequest, vendorVehicleToBeUpdated, beforeUpdateOrInsertVehicle,
				vendorVehicleToBeInserted, tenantId);
		if (!CollectionUtils.isEmpty(vendorVehicleToBeUpdated)) {
			vendorRequest.getVendor().getVehicles().clear();
			vendorRequest.getVendor().setVehicles(vendorVehicleToBeUpdated);

		}
		if (!CollectionUtils.isEmpty(vendorDriverToBeUpdated)) {
			vendorRequest.getVendor().getDrivers().clear();
			vendorRequest.getVendor().setDrivers(vendorDriverToBeUpdated);

		}
		vendorRepository.update(vendorRequest);

		boolean callInsert = false;

		if (vendorRequest.getVendor().getDrivers() != null && !vendorRequest.getVendor().getDrivers().isEmpty()) {
			vendorRequest.getVendor().getDrivers().clear();
		}

		if (vendorRequest.getVendor().getVehicles() != null && !vendorRequest.getVendor().getVehicles().isEmpty()) {
			vendorRequest.getVendor().getVehicles().clear();
		}

		if (!CollectionUtils.isEmpty(vendorVehicleToBeInserted)) {
			vendorRequest.getVendor().setVehicles(vendorVehicleToBeInserted);
			callInsert = true;
		}
		if (!CollectionUtils.isEmpty(vendorDriverToBeInserted)) {
			vendorRequest.getVendor().setDrivers(vendorDriverToBeInserted);
			callInsert = true;
		}

		if (callInsert) {
			vendorRepository.updateVendorVehicleDriver(vendorRequest);
		}

		if (!CollectionUtils.isEmpty(beforeUpdateOrInsertVehicle)) {
			vendorRequest.getVendor().setVehicles(beforeUpdateOrInsertVehicle);
		}

		if (!CollectionUtils.isEmpty(beforeUpdateOrInsertDriver)) {
			vendorRequest.getVendor().setDrivers(beforeUpdateOrInsertDriver);
		}

	}

	private void getVehicleDriver(VendorRequest vendorRequest, List<Driver> vendorDriverToBeUpdated,
			List<Driver> vendorDriverToBeInserted, List<Driver> beforeUpdateOrInsertDriver, String tenantId) {
		if (vendorRequest.getVendor().getDrivers() != null && !vendorRequest.getVendor().getDrivers().isEmpty()) {

			vendorRequest.getVendor().getDrivers().forEach(driver -> {
				List<String> driverIds = vendorRepository.getVendorWithDrivers(VendorSearchCriteria.builder()
						.driverIds(Arrays.asList(driver.getId())).tenantId(tenantId).build());
				if (!CollectionUtils.isEmpty(driverIds)) {
					vendorDriverToBeUpdated.add(driver);
				} else {
					vendorDriverToBeInserted.add(driver);
				}
				beforeUpdateOrInsertDriver.add(driver);
			});
		}

	}

	private void getVendorVehicle(VendorRequest vendorRequest, List<Vehicle> vendorVehicleToBeUpdated,
			List<Vehicle> beforeUpdateOrInsertVehicle, List<Vehicle> vendorVehicleToBeInserted, String tenantId) {
		if (vendorRequest.getVendor().getVehicles() != null && !vendorRequest.getVendor().getVehicles().isEmpty()) {
			vendorRequest.getVendor().getVehicles().forEach(vehicle -> {
				List<String> vehicleIds = vendorRepository.getVendorWithVehicles(VendorSearchCriteria.builder()
						.vehicleIds(Arrays.asList(vehicle.getId())).tenantId(tenantId).build());
				if (!CollectionUtils.isEmpty(vehicleIds)) {
					vendorVehicleToBeUpdated.add(vehicle);
				} else {
					vendorVehicleToBeInserted.add(vehicle);
				}
				beforeUpdateOrInsertVehicle.add(vehicle);
			});
		}

	}

	public VendorResponse vendorsearch(VendorSearchCriteria criteria, RequestInfo requestInfo) {

		UserDetailResponse userDetailResponse;

		vendorValidator.validateSearch(requestInfo, criteria);

		if (criteria.getMobileNumber() != null) {
			userDetailResponse = userService.getOwner(criteria, requestInfo);
			if (userDetailResponse != null && userDetailResponse.getUser() != null
					&& !userDetailResponse.getUser().isEmpty()) {
				List<String> uuids = userDetailResponse.getUser().stream().map(User::getUuid)
						.collect(Collectors.toList());
				if (CollectionUtils.isEmpty(criteria.getOwnerIds())) {
					criteria.setOwnerIds(uuids);
				} else {
					criteria.getOwnerIds().addAll(uuids);
				}
			}
		}

		if (criteria.getLimit() == null) {
			criteria.setLimit(config.getMaxSearchLimit());
		}

		if (criteria.getOffset() == null) {
			criteria.setOffset(config.getDefaultOffset());
		}

		VendorSearchCriteria vendorCriteria = getCriteria(criteria, requestInfo);
		VendorResponse vendorResponse = new VendorResponse();
		if ((CollectionUtils.isEmpty(criteria.getDriverIds()) && CollectionUtils.isEmpty(criteria.getVehicleIds()))
				|| !CollectionUtils.isEmpty(vendorCriteria.getIds())) {

			vendorResponse = repository.getVendorData(criteria);
			if (vendorResponse != null && !vendorResponse.getVendor().isEmpty()) {
				enrichmentService.enrichVendorSearch(vendorResponse.getVendor(), requestInfo, criteria.getTenantId());
			}
			if (vendorResponse != null && vendorResponse.getVendor().isEmpty()) {
				vendorIsEmpty();
			}
		}

		return vendorResponse;

	}

	private VendorSearchCriteria getCriteria(VendorSearchCriteria criteria, RequestInfo requestInfo) {
		if (!CollectionUtils.isEmpty(criteria.getVehicleRegistrationNumber())
				|| StringUtils.hasLength(criteria.getVehicleType())
				|| StringUtils.hasLength(criteria.getVehicleCapacity())) {
			List<Vehicle> vehicles = callGetVehicleRepo(requestInfo, criteria);

			if (CollectionUtils.isEmpty(vehicles)) {
				vendorIsEmpty();
			}
			if (CollectionUtils.isEmpty(criteria.getVehicleIds())) {
				criteria.setVehicleIds(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
			} else {
				criteria.getVehicleIds().addAll(vehicles.stream().map(Vehicle::getId).collect(Collectors.toList()));
			}

		}

		if (!CollectionUtils.isEmpty(criteria.getVehicleIds())) {
			List<String> vendorIds = repository.getVendorWithVehicles(criteria);
			if (CollectionUtils.isEmpty(vendorIds)) {
				vendorIsEmpty();

			} else {
				if (CollectionUtils.isEmpty(criteria.getIds())) {
					criteria.setIds(vendorIds);
				} else {
					criteria.getIds().addAll(vendorIds);
				}
			}
		}

		return getDriversCriteria(criteria);
	}

	private VendorSearchCriteria getDriversCriteria(VendorSearchCriteria criteria) {
		if (!CollectionUtils.isEmpty(criteria.getDriverIds())) {
			List<String> vendorIds = repository.getVendorWithDrivers(criteria);
			if (CollectionUtils.isEmpty(vendorIds)) {
				vendorIsEmpty();

			} else {
				if (CollectionUtils.isEmpty(criteria.getIds())) {
					criteria.setIds(vendorIds);
				} else {
					criteria.getIds().addAll(vendorIds);
				}
			}

		}
		return criteria;
	}

	private VendorResponse vendorIsEmpty() {
		List<Vendor> vendors = new ArrayList<>();
		VendorResponse vendorResponse = new VendorResponse();
		vendorResponse.setVendor(vendors);
		return vendorResponse;
	}

	private List<Vehicle> callGetVehicleRepo(RequestInfo requestInfo, VendorSearchCriteria criteria) {
		VehicleSearchCriteria vehicleSearchCriteria = VehicleSearchCriteria.builder()
				.registrationNumber(criteria.getVehicleRegistrationNumber()).vehicleType(criteria.getVehicleType())
				.vehicleCapacity(criteria.getVehicleCapacity()).tenantId(criteria.getTenantId())
				.status(criteria.getStatus()).build();

		return vehicleService.getVehicles(vehicleSearchCriteria, requestInfo);

	}

	public List<Vendor> vendorPlainSearch(@Valid VendorSearchCriteria criteria, RequestInfo requestInfo) {
		return getVendorPlainSearch(criteria, requestInfo);
	}

	private List<Vendor> getVendorPlainSearch(@Valid VendorSearchCriteria criteria, RequestInfo requestInfo) {
		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
			criteria.setLimit(config.getMaxSearchLimit());

		List<String> ids = null;

		if (criteria.getIds() != null && !criteria.getIds().isEmpty())
			ids = criteria.getIds();
		else
			ids = repository.fetchVendorIds(criteria);

		if (ids.isEmpty())
			return Collections.emptyList();

		VendorSearchCriteria vendorCriteria = VendorSearchCriteria.builder().ids(ids).build();

		List<Vendor> vendorList = repository.getVendorPlainSearch(vendorCriteria);
		if (!vendorList.isEmpty()) {
			enrichmentService.enrichVendorSearch(vendorList, requestInfo, criteria.getTenantId());
		}

		return vendorList;
	}

}
