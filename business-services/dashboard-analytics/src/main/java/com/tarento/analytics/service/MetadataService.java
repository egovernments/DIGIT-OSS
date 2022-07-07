package com.tarento.analytics.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.egov.tracer.model.CustomException;

import org.json.JSONArray;

import com.tarento.analytics.dto.RoleDto;
import com.tarento.analytics.exception.AINException;

public interface MetadataService {

	public Object getDashboardConfiguration(String dashboardId, String catagory, List<RoleDto> roleIds) throws AINException, IOException;
	public JSONArray getTargetDistrict() throws CustomException, URISyntaxException, IOException;

}
