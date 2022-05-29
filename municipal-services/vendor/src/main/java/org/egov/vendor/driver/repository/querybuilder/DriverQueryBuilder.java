package org.egov.vendor.driver.repository.querybuilder;

import org.egov.vendor.config.VendorConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DriverQueryBuilder {

	@Autowired
	private VendorConfiguration config;

	private static final String Query = "select vendor.*,vendor_address.*,vendor_driver.*,vendor_vehicle.*, vendor.id as vendor_id,"
			+ "  vendor.createdby as vendor_createdby,vendor.lastmodifiedby as vendor_lastmodifiedby,"
			+ "  vendor.createdtime as vendor_createdtime," + "  vendor.lastmodifiedtime as vendor_lastmodifiedtime,"
			+ "  vendor.additionaldetails as vendor_additionaldetails,"
			+ "  vendor_address.id as vendor_address_id FROM eg_vendor vendor"
			+ "  INNER JOIN eg_vendor_address vendor_address on  vendor_address.vendor_id=vendor.id"
			+ "  LEFT OUTER JOIN eg_vendor_driver vendor_driver on  vendor_driver.vendor_id=vendor_address.id"
			+ "  LEFT OUTER JOIN eg_vendor_vehicle vendor_vehicle on "
			+ "  vendor_vehicle.vendor_id=vendor_driver.vendor_id";

	private final String paginationWrapper = "SELECT * FROM "
			+ "(SELECT *, DENSE_RANK() OVER (ORDER BY vendor_lastModifiedTime DESC) offset_ FROM " + "({})"
			+ " result) result_offset " + "WHERE offset_ > ? AND offset_ <= ?";

	private static final String DRIVER_VEHICLE_QUERY = "SELECT %s FROM %s where %s = ? AND %s = ?";
	private static final String VEHICLE_EXISTS = "SELECT vendor_id FROM eg_vendor_vehicle where vechile_id IN ";

	private static final String DRIVER_ID = "driver_id";
	private static final String VEHICLE_ID = "vechile_id";
	private static final String VENDOR_ID = "vendor_id";
	private static final String VENDOR_DRIVER_STATUS = "vendorDriverStatus";
	private static final String VENDOR_VEHICLE_STATUS ="vendorVehicleStatus";
	private static final String VENDOR_DRIVER = "eg_vendor_driver";
	private static final String VENDOR_VEHICLE = "eg_vendor_vehicle";
	
	public static final String VENDOR_COUNT="select count(*) from eg_vendor where owner_id IN ";

	public String getDriverSearchQuery() {
		return String.format(DRIVER_VEHICLE_QUERY, DRIVER_ID, VENDOR_DRIVER, VENDOR_ID,VENDOR_DRIVER_STATUS);
	}

	public String getVehicleSearchQuery() {
		return String.format(DRIVER_VEHICLE_QUERY, VEHICLE_ID, VENDOR_VEHICLE, VENDOR_ID,VENDOR_VEHICLE_STATUS );
	}
}
