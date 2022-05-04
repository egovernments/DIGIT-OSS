package org.bel.birthdeath.death.validator;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.death.model.ImportDeathWrapper;
import org.bel.birthdeath.death.model.SearchCriteria;
import org.bel.birthdeath.death.repository.DeathRepository;
import org.bel.birthdeath.utils.BirthDeathConstants;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DeathValidator {

	@Autowired
	DeathRepository repository;
	
	Timestamp afterDate = new Timestamp(-5364683608000l);
	
	SimpleDateFormat sdf1 = new SimpleDateFormat("dd-MM-yyyy");
	SimpleDateFormat sdf2 = new SimpleDateFormat("dd/MM/yyyy");
	SimpleDateFormat sdf3 = new SimpleDateFormat("dd.MM.yyyy");
	
	public boolean validateFieldsCitizen(SearchCriteria criteria) {
		if (criteria.getTenantId() == null || criteria.getTenantId().isEmpty() || criteria.getGender() == null
			|| criteria.getDateOfDeath() == null	|| criteria.getDateOfDeath().isEmpty() )
			throw new CustomException("null_input", BirthDeathConstants.D_MANDATORY_MISSING);
		return true;
	}
	
	public boolean validateFieldsEmployee(SearchCriteria criteria) {
		if (criteria.getTenantId() == null || criteria.getTenantId().isEmpty()
			|| criteria.getFromDate() == null	|| criteria.getFromDate().isEmpty() || criteria.getToDate() == null	|| criteria.getToDate().isEmpty())
			throw new CustomException("null_input", BirthDeathConstants.D_MANDATORY_MISSING);
		return true;
	}
	
	public boolean validateUniqueRegNo(EgDeathDtl deathDtl,ImportDeathWrapper importDeathWrapper) {
		SearchCriteria criteria = new SearchCriteria();
		criteria.setRegistrationNo(deathDtl.getRegistrationno());
		criteria.setTenantId(deathDtl.getTenantid());
		if(repository.getDeathDtls(criteria).isEmpty())
			return true;
		deathDtl.setRejectReason(BirthDeathConstants.DUPLICATE_REG);
		importDeathWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG, deathDtl);
		importDeathWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG);
		return false;
	}
	
	public boolean validateImportFields(EgDeathDtl deathDtl,ImportDeathWrapper importDeathWrapper) {
		if(null!=deathDtl.getDateofdeathepoch() && !deathDtl.getDateofdeathepoch().isEmpty())
		{
			Long doddateFormatEpoch = dateFormatHandler(deathDtl.getDateofdeathepoch());
			if(null == doddateFormatEpoch)
			{
				deathDtl.setRejectReason(BirthDeathConstants.INVALID_DOD);
				importDeathWrapper.updateMaps(BirthDeathConstants.INVALID_DOD, deathDtl);
				importDeathWrapper.setServiceError(BirthDeathConstants.INVALID_DOD);
				return false;
			}
			else
			{
				Timestamp dobdateRangeEpoch = dateTimeStampHandler(doddateFormatEpoch);
				if(null==dobdateRangeEpoch) {
					deathDtl.setRejectReason(BirthDeathConstants.INVALID_DOD_RANGE);
					importDeathWrapper.updateMaps(BirthDeathConstants.INVALID_DOD_RANGE, deathDtl);
					importDeathWrapper.setServiceError(BirthDeathConstants.INVALID_DOD_RANGE);
					return false;
				}
				deathDtl.setDateofdeath(dobdateRangeEpoch);
			}
		}
		
		if(null!=deathDtl.getDateofreportepoch() && !deathDtl.getDateofreportepoch().isEmpty())
		{
			Long dordateFormatEpoch = dateFormatHandler(deathDtl.getDateofreportepoch());
			if(null == dordateFormatEpoch)
			{
				deathDtl.setRejectReason(BirthDeathConstants.INVALID_DOR);
				importDeathWrapper.updateMaps(BirthDeathConstants.INVALID_DOR, deathDtl);
				importDeathWrapper.setServiceError(BirthDeathConstants.INVALID_DOR);
				return false;
			}
			else
			{
				Timestamp dordateRangeEpoch = dateTimeStampHandler(dordateFormatEpoch);
				if(null==dordateRangeEpoch) {
					deathDtl.setRejectReason(BirthDeathConstants.INVALID_DOR_RANGE);
					importDeathWrapper.updateMaps(BirthDeathConstants.INVALID_DOR_RANGE, deathDtl);
					importDeathWrapper.setServiceError(BirthDeathConstants.INVALID_DOR_RANGE);
					return false;
				}
				deathDtl.setDateofreport(dordateRangeEpoch);
			}
		}
		
		if(deathDtl.getTenantid()==null || deathDtl.getTenantid().isEmpty() ) {
			setRejectionReason(BirthDeathConstants.TENANT_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.TENANT_EMPTY);
			return false;
		}
		if(deathDtl.getRegistrationno()==null || deathDtl.getRegistrationno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.REG_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.REG_EMPTY);
			return false;
		}
		if(deathDtl.getDateofdeath()==null) {
			setRejectionReason(BirthDeathConstants.DOD_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.DOD_EMPTY);
			return false;
		}
		if(deathDtl.getGender()==null) {
			setRejectionReason(BirthDeathConstants.GENDER_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.GENDER_EMPTY);
			return false;
		}
		if(deathDtl.getPlaceofdeath()==null || deathDtl.getPlaceofdeath().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PLACE_OF_BIRTH_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PLACE_OF_BIRTH_EMPTY);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getFirstname()==null || deathDtl.getDeathFatherInfo().getFirstname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.FATHER_FIRSTNAME_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.FATHER_FIRSTNAME_EMPTY);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getLastname()==null || deathDtl.getDeathFatherInfo().getLastname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.FATHER_LASTNAME_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.FATHER_LASTNAME_EMPTY);
			return false;
		}
		if(deathDtl.getNationality()==null || deathDtl.getNationality().isEmpty()) {
			setRejectionReason(BirthDeathConstants.NATIONALITY_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.NATIONALITY_EMPTY);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getFirstname()==null || deathDtl.getDeathMotherInfo().getFirstname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.MOTHER_FIRSTNAME_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.MOTHER_FIRSTNAME_EMPTY);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getLastname()==null || deathDtl.getDeathMotherInfo().getLastname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.MOTHER_LASTNAME_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.MOTHER_LASTNAME_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getBuildingno()==null || deathDtl.getDeathPermaddr().getBuildingno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_BUILDING_NO_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_BUILDING_NO_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getCity()==null || deathDtl.getDeathPermaddr().getCity().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_CITY_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_CITY_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getCountry()==null || deathDtl.getDeathPermaddr().getCountry().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_COUNTRY_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_COUNTRY_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getDistrict()==null || deathDtl.getDeathPermaddr().getDistrict().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_DISTRICT_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_DISTRICT_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getHouseno()==null || deathDtl.getDeathPermaddr().getHouseno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_HOUSE_NO_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_HOUSE_NO_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getStreetname()==null || deathDtl.getDeathPermaddr().getStreetname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_STREET_NAME_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_STREET_NAME_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getState()==null || deathDtl.getDeathPermaddr().getState().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_STATE_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_STATE_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getTehsil()==null || deathDtl.getDeathPermaddr().getTehsil().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_TEHSIL_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_TEHSIL_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getLocality()==null || deathDtl.getDeathPermaddr().getLocality().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_LOCALITY_EMPTY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_LOCALITY_EMPTY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getPinno()==null || deathDtl.getDeathPermaddr().getPinno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_PINCODE_EMPTY, deathDtl, importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERMENANT_PINCODE_EMPTY);
			return false;
		}
		if(deathDtl.getGender().intValue()!=1 && deathDtl.getGender().intValue()!=2 && deathDtl.getGender().intValue()!=3 ) {
			setRejectionReason(BirthDeathConstants.GENDER_INVALID,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.GENDER_INVALID);
			return false;
		}
		if(deathDtl.getRegistrationno().length()>64) {
			setRejectionReason(BirthDeathConstants.REGNO_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.REGNO_LARGE);
			return false;
		}
		if(deathDtl.getInformantsname()!=null && deathDtl.getInformantsname().length()>200) {
			setRejectionReason(BirthDeathConstants.INFORMANTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.INFORMANTNAME_LARGE);
			return false;
		}
		if(deathDtl.getInformantsaddress()!=null && deathDtl.getInformantsaddress().length()>1000) {
			setRejectionReason(BirthDeathConstants.INFORMANTADDR_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.INFORMANTADDR_LARGE);
			return false;
		}
		if(deathDtl.getPlaceofdeath()!=null && deathDtl.getPlaceofdeath().length()>1000) {
			setRejectionReason(BirthDeathConstants.PLACEOFDEATH_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PLACEOFDEATH_LARGE);
			return false;
		}
		if(deathDtl.getFirstname()!=null && deathDtl.getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.FIRSTNAME_LARGE);
			return false;
		}
		if(deathDtl.getMiddlename()!=null && deathDtl.getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.MIDDLENAME_LARGE);
			return false;
		}
		if(deathDtl.getLastname()!=null && deathDtl.getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.LASTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.LASTNAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getFirstname()!=null && deathDtl.getDeathFatherInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.F_FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.F_FIRSTNAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getMiddlename()!=null && deathDtl.getDeathFatherInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.F_MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.F_MIDDLENAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getLastname()!=null && deathDtl.getDeathFatherInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.F_LASTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.F_LASTNAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getEmailid()!=null && deathDtl.getDeathFatherInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.F_EMAIL_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.F_EMAIL_LARGE);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getMobileno()!=null && deathDtl.getDeathFatherInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.F_MOBILE_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.F_MOBILE_LARGE);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getAadharno()!=null && deathDtl.getDeathFatherInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.F_AADHAR_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.F_AADHAR_LARGE);
			return false;
		}
		
		if(deathDtl.getDeathMotherInfo().getFirstname()!=null && deathDtl.getDeathMotherInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.M_FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.M_FIRSTNAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getMiddlename()!=null && deathDtl.getDeathMotherInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.M_MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.M_MIDDLENAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getLastname()!=null && deathDtl.getDeathMotherInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.M_LASTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.M_LASTNAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getEmailid()!=null && deathDtl.getDeathMotherInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.M_EMAIL_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.M_EMAIL_LARGE);
			return false;
		}

		if(deathDtl.getDeathMotherInfo().getMobileno()!=null && deathDtl.getDeathMotherInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.M_MOBILE_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.M_MOBILE_LARGE);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getAadharno()!=null && deathDtl.getDeathMotherInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.M_AADHAR_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.M_AADHAR_LARGE);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getFirstname()!=null && deathDtl.getDeathSpouseInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.S_FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.S_FIRSTNAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getMiddlename()!=null && deathDtl.getDeathSpouseInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.S_MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.S_MIDDLENAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getLastname()!=null && deathDtl.getDeathSpouseInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.S_LASTNAME_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.S_LASTNAME_LARGE);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getEmailid()!=null && deathDtl.getDeathSpouseInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.S_EMAIL_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.S_EMAIL_LARGE);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getMobileno()!=null && deathDtl.getDeathSpouseInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.S_MOBILE_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.S_MOBILE_LARGE);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getAadharno()!=null && deathDtl.getDeathSpouseInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.S_AADHAR_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.S_AADHAR_LARGE);
			return false;
		}
		
		if(deathDtl.getDeathPermaddr().getBuildingno()!=null && deathDtl.getDeathPermaddr().getBuildingno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_BUILDINGNO,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_BUILDINGNO);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getHouseno()!=null && deathDtl.getDeathPermaddr().getHouseno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_HOUSENO,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_HOUSENO);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getStreetname()!=null && deathDtl.getDeathPermaddr().getStreetname().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_STREETNAME,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_STREETNAME);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getLocality()!=null && deathDtl.getDeathPermaddr().getLocality().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_LOCALITY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_LOCALITY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getTehsil()!=null && deathDtl.getDeathPermaddr().getTehsil().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_TEHSIL,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_TEHSIL);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getDistrict()!=null && deathDtl.getDeathPermaddr().getDistrict().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_DISTRICT,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_DISTRICT);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getCity()!=null && deathDtl.getDeathPermaddr().getCity().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_CITY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_CITY);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getState()!=null && deathDtl.getDeathPermaddr().getState().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_STATE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_STATE);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getPinno()!=null && deathDtl.getDeathPermaddr().getPinno().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_PINNO,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_PINNO);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getCountry()!=null && deathDtl.getDeathPermaddr().getCountry().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_COUNTRY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PERM_COUNTRY);
			return false;
		}
		
		if(deathDtl.getDeathPresentaddr().getBuildingno()!=null && deathDtl.getDeathPresentaddr().getBuildingno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_BUILDINGNO,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_BUILDINGNO);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getHouseno()!=null && deathDtl.getDeathPresentaddr().getHouseno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_HOUSENO,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_HOUSENO);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getStreetname()!=null && deathDtl.getDeathPresentaddr().getStreetname().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_STREETNAME,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_STREETNAME);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getLocality()!=null && deathDtl.getDeathPresentaddr().getLocality().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_LOCALITY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_LOCALITY);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getTehsil()!=null && deathDtl.getDeathPresentaddr().getTehsil().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_TEHSIL,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_TEHSIL);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getDistrict()!=null && deathDtl.getDeathPresentaddr().getDistrict().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_DISTRICT,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_DISTRICT);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getCity()!=null && deathDtl.getDeathPresentaddr().getCity().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_CITY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_CITY);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getState()!=null && deathDtl.getDeathPresentaddr().getState().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_STATE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_STATE);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getPinno()!=null && deathDtl.getDeathPresentaddr().getPinno().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_PINNO,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_PINNO);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getCountry()!=null && deathDtl.getDeathPresentaddr().getCountry().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_COUNTRY,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.PRESENT_COUNTRY);
			return false;
		}
		if(deathDtl.getAge()!=null && deathDtl.getAge()>100) {
			setRejectionReason(BirthDeathConstants.AGE_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.AGE_LARGE);
			return false;
		}
		if(deathDtl.getEidno()!=null && deathDtl.getEidno().length()>100) {
			setRejectionReason(BirthDeathConstants.EIDNO_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.EIDNO_LARGE);
			return false;
		}
		if(deathDtl.getAadharno()!=null && deathDtl.getAadharno().length()>150) {
			setRejectionReason(BirthDeathConstants.AADHAR_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.AADHAR_LARGE);
			return false;
		}
		if(deathDtl.getNationality()!=null && deathDtl.getNationality().length()>100) {
			setRejectionReason(BirthDeathConstants.NATIONALITY_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.NATIONALITY_LARGE);
			return false;
		}
		if(deathDtl.getReligion()!=null && deathDtl.getReligion().length()>100) {
			setRejectionReason(BirthDeathConstants.RELIGION_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.RELIGION_LARGE);
			return false;
		}
		if(deathDtl.getIcdcode()!=null && deathDtl.getIcdcode().length()>300) {
			setRejectionReason(BirthDeathConstants.ICDCODE_LARGE,deathDtl,importDeathWrapper);
			importDeathWrapper.setServiceError(BirthDeathConstants.ICDCODE_LARGE);
			return false;
		}
		return true;
	}
	
	public void removeSpaceChars(EgDeathDtl deathDtl)
	{
		deathDtl.setFirstname(replaceSpaceChars(deathDtl.getFirstname()));
		deathDtl.setMiddlename(replaceSpaceChars(deathDtl.getMiddlename()));
		deathDtl.setLastname(replaceSpaceChars(deathDtl.getLastname()));
		deathDtl.setPlaceofdeath(replaceSpaceChars(deathDtl.getPlaceofdeath()));
		deathDtl.setRemarks(replaceSpaceChars(deathDtl.getRemarks()));
		deathDtl.setEidno(replaceSpaceChars(deathDtl.getEidno()));
		deathDtl.setAadharno(replaceSpaceChars(deathDtl.getAadharno()));
		deathDtl.setNationality(replaceSpaceChars(deathDtl.getNationality()));
		deathDtl.setReligion(replaceSpaceChars(deathDtl.getReligion()));
		deathDtl.setIcdcode(replaceSpaceChars(deathDtl.getIcdcode()));
		deathDtl.setHospitalname(replaceSpaceChars(deathDtl.getHospitalname()));
		deathDtl.getDeathMotherInfo().setFirstname(replaceSpaceChars(deathDtl.getDeathMotherInfo().getFirstname()));
		deathDtl.getDeathMotherInfo().setMiddlename(replaceSpaceChars(deathDtl.getDeathMotherInfo().getMiddlename()));
		deathDtl.getDeathMotherInfo().setLastname(replaceSpaceChars(deathDtl.getDeathMotherInfo().getLastname()));
		deathDtl.getDeathMotherInfo().setAadharno(replaceSpaceChars(deathDtl.getDeathMotherInfo().getAadharno()));
		deathDtl.getDeathFatherInfo().setFirstname(replaceSpaceChars(deathDtl.getDeathFatherInfo().getFirstname()));
		deathDtl.getDeathFatherInfo().setMiddlename(replaceSpaceChars(deathDtl.getDeathFatherInfo().getMiddlename()));
		deathDtl.getDeathFatherInfo().setLastname(replaceSpaceChars(deathDtl.getDeathFatherInfo().getLastname()));
		deathDtl.getDeathFatherInfo().setAadharno(replaceSpaceChars(deathDtl.getDeathFatherInfo().getAadharno()));
		deathDtl.getDeathSpouseInfo().setFirstname(replaceSpaceChars(deathDtl.getDeathSpouseInfo().getFirstname()));
		deathDtl.getDeathSpouseInfo().setMiddlename(replaceSpaceChars(deathDtl.getDeathSpouseInfo().getMiddlename()));
		deathDtl.getDeathSpouseInfo().setLastname(replaceSpaceChars(deathDtl.getDeathSpouseInfo().getLastname()));
		deathDtl.getDeathSpouseInfo().setAadharno(replaceSpaceChars(deathDtl.getDeathSpouseInfo().getAadharno()));
		deathDtl.getDeathPermaddr().setHouseno(replaceSpaceChars(deathDtl.getDeathPermaddr().getHouseno()));
		deathDtl.getDeathPermaddr().setBuildingno(replaceSpaceChars(deathDtl.getDeathPermaddr().getBuildingno()));
		deathDtl.getDeathPermaddr().setStreetname(replaceSpaceChars(deathDtl.getDeathPermaddr().getStreetname()));
		deathDtl.getDeathPermaddr().setLocality(replaceSpaceChars(deathDtl.getDeathPermaddr().getLocality()));
		deathDtl.getDeathPermaddr().setTehsil(replaceSpaceChars(deathDtl.getDeathPermaddr().getTehsil()));
		deathDtl.getDeathPermaddr().setDistrict(replaceSpaceChars(deathDtl.getDeathPermaddr().getDistrict()));
		deathDtl.getDeathPermaddr().setCity(replaceSpaceChars(deathDtl.getDeathPermaddr().getCity()));
		deathDtl.getDeathPermaddr().setState(replaceSpaceChars(deathDtl.getDeathPermaddr().getState()));
		deathDtl.getDeathPermaddr().setPinno(replaceSpaceChars(deathDtl.getDeathPermaddr().getPinno()));
		deathDtl.getDeathPermaddr().setCountry(replaceSpaceChars(deathDtl.getDeathPermaddr().getCountry()));
		deathDtl.getDeathPresentaddr().setHouseno(replaceSpaceChars(deathDtl.getDeathPresentaddr().getHouseno()));
		deathDtl.getDeathPresentaddr().setBuildingno(replaceSpaceChars(deathDtl.getDeathPresentaddr().getBuildingno()));
		deathDtl.getDeathPresentaddr().setStreetname(replaceSpaceChars(deathDtl.getDeathPresentaddr().getStreetname()));
		deathDtl.getDeathPresentaddr().setLocality(replaceSpaceChars(deathDtl.getDeathPresentaddr().getLocality()));
		deathDtl.getDeathPresentaddr().setTehsil(replaceSpaceChars(deathDtl.getDeathPresentaddr().getTehsil()));
		deathDtl.getDeathPresentaddr().setDistrict(replaceSpaceChars(deathDtl.getDeathPresentaddr().getDistrict()));
		deathDtl.getDeathPresentaddr().setCity(replaceSpaceChars(deathDtl.getDeathPresentaddr().getCity()));
		deathDtl.getDeathPresentaddr().setState(replaceSpaceChars(deathDtl.getDeathPresentaddr().getState()));
		deathDtl.getDeathPresentaddr().setPinno(replaceSpaceChars(deathDtl.getDeathPresentaddr().getPinno()));
		deathDtl.getDeathPresentaddr().setCountry(replaceSpaceChars(deathDtl.getDeathPresentaddr().getCountry()));
	}

	private String replaceSpaceChars(String string) {
		if(null!=string)
		{
			string = string.replaceAll("\\t|\\r|\\n", " ");
		}
		return string;
	}

	private void setRejectionReason(String reason,EgDeathDtl egDeathDtl,ImportDeathWrapper importDeathWrapper)
	{
		egDeathDtl.setRejectReason(reason);
		importDeathWrapper.updateMaps(reason, egDeathDtl);
	}
	
	private Long dateFormatHandler(String date)
	{
		Long timeLong = null;
		if(null!=date )
		{
			try
			{
				timeLong = Long.parseLong(date);
			}
			catch (NumberFormatException e) {
				try {
					timeLong = sdf1.parse(date).getTime();
					timeLong = timeLong/1000l;
				} catch (ParseException e1) {
					try {
						timeLong = sdf2.parse(date).getTime();
						timeLong = timeLong/1000l;
					} catch (ParseException e2) {
						try {
							timeLong = sdf3.parse(date).getTime();
							timeLong = timeLong/1000l;
						} catch (ParseException e3) {
							return null;
						}
					}
				}
			}
		}
		return timeLong;
	}
	
	private Timestamp dateTimeStampHandler(Long time)
	{
		Timestamp timeLongTimestamp = null;
		if(time!=null)
		{
			timeLongTimestamp = new Timestamp(time*1000);
			Timestamp beforeDate =  new Timestamp(System.currentTimeMillis()+108000000l);
			if(!(timeLongTimestamp.before(beforeDate) && timeLongTimestamp.after(afterDate)))
			{
				return null;
			}
		}
		return timeLongTimestamp;
	}
	
}
