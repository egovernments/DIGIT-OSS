package org.bel.birthdeath.death.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.utils.BirthDeathConstants;
import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.Valid;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ImportDeathWrapper {
	
    @JsonProperty("ResponseInfo")
	@Valid
    private ResponseInfo responseInfo = null;

    @JsonProperty("statsMap")
	@Valid
	private Map<String,Integer> statsMap;
	
    @JsonProperty("errorRowMap")
	@Valid
   	private Map<String,List<String>> errorRowMap;
    
    @JsonProperty("statsMapData")
	@Valid
	private Map<String,List<EgDeathDtl>> statsMapData;

    
    @JsonProperty("serviceError")
	@Valid
   	private String serviceError;
    
    @JsonProperty("hospitals")
	@Valid
   	private List<String> hospitals;
	
    @JsonIgnore
    List<String> keyList = Arrays.asList(new String[] { 
    		BirthDeathConstants.TENANT_EMPTY,
    		BirthDeathConstants.D_MANDATORY_MISSING,
    		BirthDeathConstants.DUPLICATE_REG,
    		BirthDeathConstants.REG_EMPTY,
    		BirthDeathConstants.DOD_EMPTY,
    		BirthDeathConstants.GENDER_EMPTY,
    		BirthDeathConstants.GENDER_INVALID,
    		BirthDeathConstants.FIRSTNAME_LARGE,
    		BirthDeathConstants.MIDDLENAME_LARGE,
    		BirthDeathConstants.LASTNAME_LARGE,
    		BirthDeathConstants.F_FIRSTNAME_LARGE,
    		BirthDeathConstants.F_MIDDLENAME_LARGE,
    		BirthDeathConstants.F_LASTNAME_LARGE,
    		BirthDeathConstants.M_FIRSTNAME_LARGE,
    		BirthDeathConstants.M_MIDDLENAME_LARGE,
    		BirthDeathConstants.M_LASTNAME_LARGE,
    		BirthDeathConstants.DUPLICATE_REG_EXCEL,
    		BirthDeathConstants.INVALID_DOD,
    		BirthDeathConstants.INVALID_DOD_RANGE,
    		BirthDeathConstants.INVALID_DOR,
    		BirthDeathConstants.INVALID_DOR_RANGE,
			BirthDeathConstants.F_EMAIL_LARGE,
			BirthDeathConstants.M_EMAIL_LARGE,
			BirthDeathConstants.S_EMAIL_LARGE,
			BirthDeathConstants.F_MOBILE_LARGE,
			BirthDeathConstants.M_MOBILE_LARGE,
			BirthDeathConstants.S_MOBILE_LARGE,
			BirthDeathConstants.F_AADHAR_LARGE,
			BirthDeathConstants.M_AADHAR_LARGE,
			BirthDeathConstants.S_AADHAR_LARGE,
			BirthDeathConstants.DATA_ERROR,
			BirthDeathConstants.HOSPNAME_LARGE,
			BirthDeathConstants.INFORMANTNAME_LARGE,
			BirthDeathConstants.INFORMANTADDR_LARGE,
			BirthDeathConstants.PLACEOFDEATH_LARGE,
			BirthDeathConstants.PERM_BUILDINGNO ,
			BirthDeathConstants.PERM_HOUSENO ,
			BirthDeathConstants.PERM_STREETNAME ,
			BirthDeathConstants.PERM_LOCALITY ,
			BirthDeathConstants.PERM_TEHSIL ,
			BirthDeathConstants.PERM_DISTRICT ,
			BirthDeathConstants.PERM_CITY ,
			BirthDeathConstants.PERM_STATE ,
			BirthDeathConstants.PERM_PINNO ,
			BirthDeathConstants.PERM_COUNTRY ,
			BirthDeathConstants.PRESENT_BUILDINGNO ,
			BirthDeathConstants.PRESENT_HOUSENO ,
			BirthDeathConstants.PRESENT_STREETNAME ,
			BirthDeathConstants.PRESENT_LOCALITY ,
			BirthDeathConstants.PRESENT_TEHSIL ,
			BirthDeathConstants.PRESENT_DISTRICT ,
			BirthDeathConstants.PRESENT_CITY ,
			BirthDeathConstants.PRESENT_STATE ,
			BirthDeathConstants.PRESENT_PINNO ,
			BirthDeathConstants.PRESENT_COUNTRY,
			BirthDeathConstants.UPDATE_ERROR,
			BirthDeathConstants.REGNO_LARGE,
			BirthDeathConstants.AGE_LARGE,
    		BirthDeathConstants.EIDNO_LARGE,
    		BirthDeathConstants.AADHAR_LARGE,
    		BirthDeathConstants.NATIONALITY_LARGE,
    		BirthDeathConstants.RELIGION_LARGE,
    		BirthDeathConstants.ICDCODE_LARGE,
			BirthDeathConstants.EXCEL_DATA_ERROR	
			});
    
	public ImportDeathWrapper() {
		statsMap = new HashMap<>();
		statsMapData =  new HashMap<>();
		errorRowMap =  new HashMap<>();
		for (String key : keyList) {
			statsMap.put(key,0);
			statsMapData.put(key,new ArrayList<>());
			errorRowMap.put(key,new ArrayList<>());
		}
	}
	
	public void updateMaps(String error,EgDeathDtl record)
	{
		statsMap.put(error,statsMap.get(error)+1);
		statsMapData.get(error).add(record);
		if(error.equalsIgnoreCase(BirthDeathConstants.EXCEL_DATA_ERROR))
		{
			errorRowMap.get(error).add((record.getRejectReason()!=null?record.getRejectReason():""));
		}
		else
		{
			errorRowMap.get(error).add(String.valueOf(record.getExcelrowindex()));
		}
	}

	public void finaliseStats(int total, int success) {
		int failed = 0;
		for (String key : statsMap.keySet()) {
			failed = failed + statsMap.get(key);
		}
		for (String key : keyList) {
			if(statsMap.get(key)==0)
			{
				statsMap.remove(key);
				statsMapData.remove(key);
				errorRowMap.remove(key);
			}
		}
		statsMap.put("Total Records",total);
		statsMap.put("Sucessful Records",success);
		statsMap.put("Failed Records",failed);
	}
}
