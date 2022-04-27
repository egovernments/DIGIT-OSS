package org.bel.birthdeath.utils;


import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.bel.birthdeath.common.model.AuditDetails;
import org.bel.birthdeath.death.model.EgDeathDtl;
import org.springframework.stereotype.Component;

import lombok.Getter;
@Component
@Getter
public class CommonUtils {
	

    /**
     * Method to return auditDetails for create/update flows
     *
     * @param by
     * @param isCreate
     * @return AuditDetails
     */
    public AuditDetails getAuditDetails(String by, Boolean isCreate) {
    	
        Long time = System.currentTimeMillis();
        
        if(isCreate)
            return AuditDetails.builder().createdBy(by).lastModifiedBy(by).createdTime(time).lastModifiedTime(time).build();
        else
            return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(time).build();
    }
    
    public String addfullName(String firstname, String middlename, String lastname) {
		StringBuilder fullName = new StringBuilder();
		if(null!=firstname)
			fullName.append(firstname);
		if(null!=middlename)
			fullName.append(" "+middlename);
		if(null!=lastname)
			fullName.append(" "+lastname);
		return fullName.toString();
	}

	public String addFullAddress(String houseno, String buildingno, String streetname, String locality, String tehsil,
			String district, String city, String state, String pinno, String country) {
		StringBuilder fullAddress = new StringBuilder();
		if(null!=houseno)
			fullAddress.append(houseno);
		if(null!=buildingno)
			fullAddress.append(" "+buildingno);
		if(null!=streetname)
			fullAddress.append(" "+streetname);
		if(null!=locality)
			fullAddress.append(" "+locality);
		if(null!=tehsil)
			fullAddress.append(" "+tehsil);
		if(null!=district)
			fullAddress.append(" "+district);
		if(null!=city)
			fullAddress.append(" "+city);
		if(null!=state)
			fullAddress.append(" "+state);
		if(null!=pinno)
			fullAddress.append(" "+pinno);
		if(null!=country)
			fullAddress.append(" "+country);
		return fullAddress.toString();
	}
	
	public void maskAndShowLast4Chars(EgBirthDtl birthDtl) {
		if(null!=birthDtl.getBirthFatherInfo().getAadharno())
			birthDtl.getBirthFatherInfo().setAadharno(birthDtl.getBirthFatherInfo().getAadharno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=birthDtl.getBirthMotherInfo().getAadharno())
			birthDtl.getBirthMotherInfo().setAadharno(birthDtl.getBirthMotherInfo().getAadharno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		
		if(null!=birthDtl.getBirthFatherInfo().getMobileno())
			birthDtl.getBirthFatherInfo().setMobileno(birthDtl.getBirthFatherInfo().getMobileno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=birthDtl.getBirthMotherInfo().getMobileno())
			birthDtl.getBirthMotherInfo().setMobileno(birthDtl.getBirthMotherInfo().getMobileno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		
		if(null!=birthDtl.getBirthFatherInfo().getEmailid())
			birthDtl.getBirthFatherInfo().setEmailid(birthDtl.getBirthFatherInfo().getEmailid().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=birthDtl.getBirthMotherInfo().getEmailid())
			birthDtl.getBirthMotherInfo().setEmailid(birthDtl.getBirthMotherInfo().getEmailid().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
	}
	
	public void maskAndShowLast4Chars(EgDeathDtl deathDtl) {
		if(null!=deathDtl.getAadharno())
			deathDtl.setAadharno(deathDtl.getAadharno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=deathDtl.getDeathFatherInfo().getAadharno())
			deathDtl.getDeathFatherInfo().setAadharno(deathDtl.getDeathFatherInfo().getAadharno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=deathDtl.getDeathMotherInfo().getAadharno())
			deathDtl.getDeathMotherInfo().setAadharno(deathDtl.getDeathMotherInfo().getAadharno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=deathDtl.getDeathSpouseInfo().getAadharno())
			deathDtl.getDeathSpouseInfo().setAadharno(deathDtl.getDeathSpouseInfo().getAadharno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		
		if(null!=deathDtl.getDeathFatherInfo().getMobileno())
			deathDtl.getDeathFatherInfo().setMobileno(deathDtl.getDeathFatherInfo().getMobileno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=deathDtl.getDeathMotherInfo().getMobileno())
			deathDtl.getDeathMotherInfo().setMobileno(deathDtl.getDeathMotherInfo().getMobileno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=deathDtl.getDeathSpouseInfo().getMobileno())
			deathDtl.getDeathSpouseInfo().setMobileno(deathDtl.getDeathSpouseInfo().getMobileno().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		
		if(null!=deathDtl.getDeathFatherInfo().getEmailid())
			deathDtl.getDeathFatherInfo().setEmailid(deathDtl.getDeathFatherInfo().getEmailid().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=deathDtl.getDeathMotherInfo().getEmailid())
			deathDtl.getDeathMotherInfo().setEmailid(deathDtl.getDeathMotherInfo().getEmailid().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
		if(null!=deathDtl.getDeathSpouseInfo().getEmailid())
			deathDtl.getDeathSpouseInfo().setEmailid(deathDtl.getDeathSpouseInfo().getEmailid().replaceAll(BirthDeathConstants.REPLACE_CONT, BirthDeathConstants.REPLACE_CONT_ASTERICK));
	}
}
