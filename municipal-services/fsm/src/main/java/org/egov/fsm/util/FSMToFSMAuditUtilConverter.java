package org.egov.fsm.util;

import org.apache.commons.lang3.ObjectUtils;
import org.egov.fsm.web.model.FSM;
import org.springframework.stereotype.Component;

@Component
public class FSMToFSMAuditUtilConverter {
  public FSMAuditUtil convert(FSM fsm) {
	  FSMAuditUtil fsmUtil = new FSMAuditUtil(); 
	  
	  fsmUtil.setAccountId(fsm.getAccountId());
	  fsmUtil.setApplicationNo(fsm.getApplicationNo());
	  fsmUtil.setApplicationStatus(fsm.getApplicationStatus());	  
	  fsmUtil.setDescription(fsm.getDescription());	  
	  fsmUtil.setDsoId(fsm.getDsoId());		  
	  fsmUtil.setNoOfTrips(fsm.getNoOfTrips());	  
	  fsmUtil.setPossibleServiceDate(fsm.getPossibleServiceDate());
	  fsmUtil.setPropertyUsage(fsm.getPropertyUsage());	  
	  fsmUtil.setSanitationtype(fsm.getSanitationtype());	  
	  fsmUtil.setSource(fsm.getSource());
	  fsmUtil.setVehicleId(fsm.getVehicleId());
	  fsmUtil.setVehicleType(fsm.getVehicleType());
	  fsmUtil.setStatus(fsm.getStatus()==null? null : fsm.getStatus().name());
	    
	  if(ObjectUtils.isNotEmpty(fsm.getAddress())) {
		  fsmUtil.setBuildingName(fsm.getAddress().getBuildingName());
		  fsmUtil.setCity(fsm.getAddress().getCity());
		  fsmUtil.setCountry(fsm.getAddress().getCountry());
		  fsmUtil.setDistrict(fsm.getAddress().getDistrict());
		  fsmUtil.setDoorNo(fsm.getAddress().getDoorNo());
		  fsmUtil.setLandmark(fsm.getAddress().getLandmark());
		  fsmUtil.setLocality(fsm.getAddress().getLocality().getCode());  
		  fsmUtil.setPincode(fsm.getAddress().getPincode());
		  fsmUtil.setPlotNo(fsm.getAddress().getPlotNo());
		  fsmUtil.setRegion(fsm.getAddress().getRegion());
		  fsmUtil.setSlumName(fsm.getAddress().getSlumName());
		  fsmUtil.setState(fsm.getAddress().getState());
		  fsmUtil.setStreet(fsm.getAddress().getStreet());
		  
		  if (ObjectUtils.isNotEmpty(fsm.getAddress().getGeoLocation())) {
			  fsmUtil.setLatitude(fsm.getAddress().getGeoLocation().getLatitude());
			  fsmUtil.setLongitude(fsm.getAddress().getGeoLocation().getLongitude());
		  }
	  }
	  
	  if(ObjectUtils.isNotEmpty(fsm.getPitDetail())) {
		  fsmUtil.setDiameter(fsm.getPitDetail().getDiameter());
		  fsmUtil.setDistanceFromRoad(fsm.getPitDetail().getDistanceFromRoad());
		  fsmUtil.setHeight(fsm.getPitDetail().getHeight());  
		  fsmUtil.setLength(fsm.getPitDetail().getLength());
		  fsmUtil.setWidth(fsm.getPitDetail().getWidth());  
	  }	  
	  
	  
	 return fsmUtil;
  }
}