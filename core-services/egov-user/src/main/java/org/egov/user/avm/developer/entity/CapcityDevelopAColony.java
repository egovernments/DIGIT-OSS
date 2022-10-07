package org.egov.user.avm.developer.entity;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CapcityDevelopAColony {

	private List<CapacityDevelopAColonyHdruAct> capacityDevelopColonyHdruAct;	
	private List<CapacityDevelopColonyLawAct> capacityDevelopColonyLawAct;	
	private TechnicalExpertEngaged technicalExpertEngaged;
	private DesignationDirector designationDirector;
	private ObtainedLicense obtainedLicense;
	
}
