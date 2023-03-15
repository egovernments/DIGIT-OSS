package com.tarento.analytics.org.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dto.*;
import com.tarento.analytics.exception.AINException;

public interface ClientService {

	public AggregateDto getAggregatedData(AggregateRequestDto req, List<RoleDto> roles) throws AINException, IOException;
	public List<DashboardHeaderDto> getHeaderData(CummulativeDataRequestDto requestDto, List<RoleDto> roles) throws AINException;

	/**
	 * Default handle request to translates tenant code to a value
	 */
	default boolean preHandle(AggregateRequestDto request, ObjectNode chartNode, MdmsApiMappings mdmsApiMappings){
		boolean status = Boolean.FALSE;
		JsonNode translateNode = chartNode.get(Constants.JsonPaths.TRANSLATE_CODE);
		boolean isTranslate = translateNode == null || translateNode.asBoolean()==Boolean.FALSE ? Boolean.FALSE : translateNode.asBoolean();
		boolean valueExist = request.getFilters().containsKey(Constants.MDMSKeys.TENANT_ID);
		if(valueExist && isTranslate){
			Object filter = request.getFilters().get(Constants.MDMSKeys.TENANT_ID);
			List<String> values = new ArrayList<>();
			if(filter instanceof ArrayList){
				for(Object code : ((ArrayList)request.getFilters().get(Constants.MDMSKeys.TENANT_ID))){
					String val = mdmsApiMappings.valueOf(code.toString());
					if(val!=null) values.add(val);
				}
				request.getFilters().put(Constants.MDMSKeys.TENANT_ID, values);
				status = Boolean.TRUE;

			} else if(filter instanceof String){
				String code = request.getFilters().get(Constants.MDMSKeys.TENANT_ID).toString();
				String value = mdmsApiMappings.valueOf(code);
				request.getFilters().put(Constants.MDMSKeys.TENANT_ID, value);
				status = Boolean.TRUE;
			}

		}
		return isTranslate;
	}

}
