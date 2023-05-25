package com.tarento.analytics.service;

import java.io.IOException;
import java.util.List;

import org.json.JSONArray;

import com.tarento.analytics.dto.RoleDto;
import com.tarento.analytics.exception.AINException;

public interface MetadataService {

	public Object getDashboardConfiguration(String dashboardId, String catagory, List<RoleDto> roleIds) throws AINException, IOException;
	public JSONArray getTargetDistrict() throws Exception ; 

}
