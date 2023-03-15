package org.bel.birthdeath.birth.validator;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.bel.birthdeath.birth.model.ImportBirthWrapper;
import org.bel.birthdeath.birth.model.SearchCriteria;
import org.bel.birthdeath.birth.repository.BirthRepository;
import org.bel.birthdeath.utils.BirthDeathConstants;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BirthValidator {
	
	@Autowired
	BirthRepository repository;
	Timestamp afterDate = new Timestamp(-5364683608000l);
	SimpleDateFormat sdf1 = new SimpleDateFormat("dd-MM-yyyy");
	SimpleDateFormat sdf2 = new SimpleDateFormat("dd/MM/yyyy");
	SimpleDateFormat sdf3 = new SimpleDateFormat("dd.MM.yyyy");
	
	public boolean validateFieldsCitizen(SearchCriteria criteria) {
		if (criteria.getTenantId() == null || criteria.getTenantId().isEmpty() || criteria.getGender() == null
				|| criteria.getDateOfBirth() == null || criteria.getDateOfBirth().isEmpty() )
			throw new CustomException("null_input", BirthDeathConstants.B_MANDATORY_MISSING);
		return true;
	}
	
	public boolean validateFieldsEmployee(SearchCriteria criteria) {
		if (criteria.getTenantId() == null || criteria.getTenantId().isEmpty()
				|| criteria.getFromDate() == null || criteria.getFromDate().isEmpty()  || criteria.getToDate() == null || criteria.getToDate().isEmpty())
			throw new CustomException("null_input", BirthDeathConstants.B_MANDATORY_MISSING);
		return true;
	}

	public boolean validateUniqueRegNo(EgBirthDtl birthDtl,ImportBirthWrapper importBirthWrapper) {
		SearchCriteria criteria = new SearchCriteria();
		criteria.setRegistrationNo(birthDtl.getRegistrationno());
		criteria.setTenantId(birthDtl.getTenantid());
		if(repository.getBirthDtls(criteria).isEmpty())
			return true;
		birthDtl.setRejectReason(BirthDeathConstants.DUPLICATE_REG);
		importBirthWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG, birthDtl);
		importBirthWrapper.setServiceError(BirthDeathConstants.DUPLICATE_REG);
		return false;
	}
	
	public boolean validateImportFields(EgBirthDtl birthDtl,ImportBirthWrapper importBirthWrapper) {
		
		if(null!=birthDtl.getDateofbirthepoch() && !birthDtl.getDateofbirthepoch().isEmpty())
		{
			Long dobdateFormatEpoch = dateFormatHandler(birthDtl.getDateofbirthepoch());
			if(null == dobdateFormatEpoch)
			{
				birthDtl.setRejectReason(BirthDeathConstants.INVALID_DOB);
				importBirthWrapper.updateMaps(BirthDeathConstants.INVALID_DOB, birthDtl);
				importBirthWrapper.setServiceError(BirthDeathConstants.INVALID_DOB);
				return false;
			}
			else
			{
				Timestamp dobdateRangeEpoch = dateTimeStampHandler(dobdateFormatEpoch);
				if(null==dobdateRangeEpoch) {
					birthDtl.setRejectReason(BirthDeathConstants.INVALID_DOB_RANGE);
					importBirthWrapper.updateMaps(BirthDeathConstants.INVALID_DOB_RANGE, birthDtl);
					importBirthWrapper.setServiceError(BirthDeathConstants.INVALID_DOB_RANGE);
					return false;
				}
				birthDtl.setDateofbirth(dobdateRangeEpoch);
			}
		}

		if(null!=birthDtl.getDateofreportepoch() && !birthDtl.getDateofreportepoch().isEmpty())
		{
			Long dordateFormatEpoch = dateFormatHandler(birthDtl.getDateofreportepoch());
			if(null == dordateFormatEpoch)
			{
				birthDtl.setRejectReason(BirthDeathConstants.INVALID_DOR);
				importBirthWrapper.updateMaps(BirthDeathConstants.INVALID_DOR, birthDtl);
				importBirthWrapper.setServiceError(BirthDeathConstants.INVALID_DOR);
				return false;
			}
			else
			{
				Timestamp dordateRangeEpoch = dateTimeStampHandler(dordateFormatEpoch);
				if(null==dordateRangeEpoch) {
					birthDtl.setRejectReason(BirthDeathConstants.INVALID_DOR_RANGE);
					importBirthWrapper.updateMaps(BirthDeathConstants.INVALID_DOR_RANGE, birthDtl);
					importBirthWrapper.setServiceError(BirthDeathConstants.INVALID_DOR_RANGE);
					return false;
				}
				birthDtl.setDateofreport(dordateRangeEpoch);
			}
		}
		if(birthDtl.getTenantid()==null || birthDtl.getTenantid().isEmpty() ) {
			setRejectionReason(BirthDeathConstants.TENANT_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.TENANT_EMPTY);
			return false;
		}
		if(birthDtl.getRegistrationno()==null || birthDtl.getRegistrationno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.REG_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.REG_EMPTY);
			return false;
		}
		if(birthDtl.getDateofbirth()==null) {
			setRejectionReason(BirthDeathConstants.DOB_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.DOB_EMPTY);
			return false;
		}
		if(birthDtl.getGender()==null) {
			setRejectionReason(BirthDeathConstants.GENDER_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.GENDER_EMPTY);
			return false;
		}
		if(birthDtl.getPlaceofbirth()==null || birthDtl.getPlaceofbirth().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PLACE_OF_BIRTH_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PLACE_OF_BIRTH_EMPTY);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getFirstname()==null || birthDtl.getBirthFatherInfo().getFirstname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.FATHER_FIRSTNAME_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.FATHER_FIRSTNAME_EMPTY);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getLastname()==null || birthDtl.getBirthFatherInfo().getLastname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.FATHER_LASTNAME_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.FATHER_LASTNAME_EMPTY);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getNationality()==null || birthDtl.getBirthFatherInfo().getNationality().isEmpty()) {
			setRejectionReason(BirthDeathConstants.FATHER_NATIONALITY_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.FATHER_NATIONALITY_EMPTY);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getFirstname()==null || birthDtl.getBirthMotherInfo().getFirstname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.MOTHER_FIRSTNAME_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.MOTHER_FIRSTNAME_EMPTY);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getLastname()==null || birthDtl.getBirthMotherInfo().getLastname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.MOTHER_LASTNAME_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.MOTHER_LASTNAME_EMPTY);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getNationality()==null || birthDtl.getBirthMotherInfo().getNationality().isEmpty()) {
			setRejectionReason(BirthDeathConstants.MOTHER_NATIONALITY_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.MOTHER_NATIONALITY_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getBuildingno()==null || birthDtl.getBirthPermaddr().getBuildingno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_BUILDING_NO_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_BUILDING_NO_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getCity()==null || birthDtl.getBirthPermaddr().getCity().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_CITY_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_CITY_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getCountry()==null || birthDtl.getBirthPermaddr().getCountry().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_COUNTRY_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_COUNTRY_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getDistrict()==null || birthDtl.getBirthPermaddr().getDistrict().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_DISTRICT_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_DISTRICT_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getHouseno()==null || birthDtl.getBirthPermaddr().getHouseno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_HOUSE_NO_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_HOUSE_NO_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getStreetname()==null || birthDtl.getBirthPermaddr().getStreetname().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_STREET_NAME_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_STREET_NAME_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getState()==null || birthDtl.getBirthPermaddr().getState().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_STATE_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_STATE_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getTehsil()==null || birthDtl.getBirthPermaddr().getTehsil().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_TEHSIL_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_TEHSIL_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getLocality()==null || birthDtl.getBirthPermaddr().getLocality().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_LOCALITY_EMPTY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_LOCALITY_EMPTY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getPinno()==null || birthDtl.getBirthPermaddr().getPinno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.PERMENANT_PINCODE_EMPTY, birthDtl, importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERMENANT_PINCODE_EMPTY);
			return false;
		}
		if(birthDtl.getGender().intValue()!=1 && birthDtl.getGender().intValue()!=2 && birthDtl.getGender().intValue()!=3 ) {
			setRejectionReason(BirthDeathConstants.GENDER_INVALID,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.GENDER_INVALID);
			return false;
		}
		if(birthDtl.getRegistrationno().length()>64) {
			setRejectionReason(BirthDeathConstants.REGNO_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.REGNO_LARGE);
			return false;
		}
		if(birthDtl.getInformantsname()!=null && birthDtl.getInformantsname().length()>200) {
			setRejectionReason(BirthDeathConstants.INFORMANTNAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.INFORMANTNAME_LARGE);
			return false;
		}
		if(birthDtl.getInformantsaddress()!=null && birthDtl.getInformantsaddress().length()>1000) {
			setRejectionReason(BirthDeathConstants.INFORMANTADDR_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.INFORMANTADDR_LARGE);
			return false;
		}
		if(birthDtl.getPlaceofbirth()!=null && birthDtl.getPlaceofbirth().length()>1000) {
			setRejectionReason(BirthDeathConstants.PLACEOFBIRTH_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PLACEOFBIRTH_LARGE);
			return false;
		}
		if(birthDtl.getFirstname()!=null && birthDtl.getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.FIRSTNAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.FIRSTNAME_LARGE);
			return false;
		}
		if(birthDtl.getMiddlename()!=null && birthDtl.getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.MIDDLENAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.MIDDLENAME_LARGE);
			return false;
		}
		if(birthDtl.getLastname()!=null && birthDtl.getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.LASTNAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.LASTNAME_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getFirstname()!=null && birthDtl.getBirthFatherInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.F_FIRSTNAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_FIRSTNAME_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getMiddlename()!=null && birthDtl.getBirthFatherInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.F_MIDDLENAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_MIDDLENAME_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getLastname()!=null && birthDtl.getBirthFatherInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.F_LASTNAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_LASTNAME_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getEmailid()!=null && birthDtl.getBirthFatherInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.F_EMAIL_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_EMAIL_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getMobileno()!=null && birthDtl.getBirthFatherInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.F_MOBILE_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_MOBILE_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getAadharno()!=null && birthDtl.getBirthFatherInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.F_AADHAR_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_AADHAR_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getEducation()!=null && birthDtl.getBirthFatherInfo().getEducation().length()>100) {
			setRejectionReason(BirthDeathConstants.F_EDUCATION_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_EDUCATION_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getReligion()!=null && birthDtl.getBirthFatherInfo().getReligion().length()>100) {
			setRejectionReason(BirthDeathConstants.F_RELIGION_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_RELIGION_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getProffession()!=null && birthDtl.getBirthFatherInfo().getProffession().length()>100) {
			setRejectionReason(BirthDeathConstants.F_PROFFESSION_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_PROFFESSION_LARGE);
			return false;
		}
		if(birthDtl.getBirthFatherInfo().getNationality()!=null && birthDtl.getBirthFatherInfo().getNationality().length()>100) {
			setRejectionReason(BirthDeathConstants.F_NATIONALITY_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.F_NATIONALITY_LARGE);
			return false;
		}
		
		if(birthDtl.getBirthMotherInfo().getFirstname()!=null && birthDtl.getBirthMotherInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.M_FIRSTNAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_FIRSTNAME_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getMiddlename()!=null && birthDtl.getBirthMotherInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.M_MIDDLENAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_MIDDLENAME_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getLastname()!=null && birthDtl.getBirthMotherInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.M_LASTNAME_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_LASTNAME_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getEmailid()!=null && birthDtl.getBirthMotherInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.M_EMAIL_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_EMAIL_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getMobileno()!=null && birthDtl.getBirthMotherInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.M_MOBILE_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_MOBILE_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getAadharno()!=null && birthDtl.getBirthMotherInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.M_AADHAR_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_AADHAR_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getEducation()!=null && birthDtl.getBirthMotherInfo().getEducation().length()>100) {
			setRejectionReason(BirthDeathConstants.M_EDUCATION_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_EDUCATION_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getReligion()!=null && birthDtl.getBirthMotherInfo().getReligion().length()>100) {
			setRejectionReason(BirthDeathConstants.M_RELIGION_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_RELIGION_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getProffession()!=null && birthDtl.getBirthMotherInfo().getProffession().length()>100) {
			setRejectionReason(BirthDeathConstants.M_PROFFESSION_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_PROFFESSION_LARGE);
			return false;
		}
		if(birthDtl.getBirthMotherInfo().getNationality()!=null && birthDtl.getBirthMotherInfo().getNationality().length()>100) {
			setRejectionReason(BirthDeathConstants.M_NATIONALITY_LARGE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.M_NATIONALITY_LARGE);
			return false;
		}
		
		if(birthDtl.getBirthPermaddr().getBuildingno()!=null && birthDtl.getBirthPermaddr().getBuildingno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_BUILDINGNO,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_BUILDINGNO);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getHouseno()!=null && birthDtl.getBirthPermaddr().getHouseno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_HOUSENO,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_HOUSENO);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getStreetname()!=null && birthDtl.getBirthPermaddr().getStreetname().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_STREETNAME,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_STREETNAME);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getLocality()!=null && birthDtl.getBirthPermaddr().getLocality().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_LOCALITY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_LOCALITY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getTehsil()!=null && birthDtl.getBirthPermaddr().getTehsil().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_TEHSIL,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_TEHSIL);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getDistrict()!=null && birthDtl.getBirthPermaddr().getDistrict().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_DISTRICT,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_DISTRICT);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getCity()!=null && birthDtl.getBirthPermaddr().getCity().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_CITY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_CITY);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getState()!=null && birthDtl.getBirthPermaddr().getState().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_STATE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_STATE);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getPinno()!=null && birthDtl.getBirthPermaddr().getPinno().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_PINNO,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_PINNO);
			return false;
		}
		if(birthDtl.getBirthPermaddr().getCountry()!=null && birthDtl.getBirthPermaddr().getCountry().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_COUNTRY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PERM_COUNTRY);
			return false;
		}
		
		if(birthDtl.getBirthPresentaddr().getBuildingno()!=null && birthDtl.getBirthPresentaddr().getBuildingno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_BUILDINGNO,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_BUILDINGNO);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getHouseno()!=null && birthDtl.getBirthPresentaddr().getHouseno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_HOUSENO,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_HOUSENO);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getStreetname()!=null && birthDtl.getBirthPresentaddr().getStreetname().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_STREETNAME,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_STREETNAME);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getLocality()!=null && birthDtl.getBirthPresentaddr().getLocality().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_LOCALITY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_LOCALITY);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getTehsil()!=null && birthDtl.getBirthPresentaddr().getTehsil().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_TEHSIL,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_TEHSIL);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getDistrict()!=null && birthDtl.getBirthPresentaddr().getDistrict().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_DISTRICT,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_DISTRICT);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getCity()!=null && birthDtl.getBirthPresentaddr().getCity().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_CITY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_CITY);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getState()!=null && birthDtl.getBirthPresentaddr().getState().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_STATE,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_STATE);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getPinno()!=null && birthDtl.getBirthPresentaddr().getPinno().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_PINNO,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_PINNO);
			return false;
		}
		if(birthDtl.getBirthPresentaddr().getCountry()!=null && birthDtl.getBirthPresentaddr().getCountry().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_COUNTRY,birthDtl,importBirthWrapper);
			importBirthWrapper.setServiceError(BirthDeathConstants.PRESENT_COUNTRY);
			return false;
		}
		return true;
	}
	
	public void removeSpaceChars(EgBirthDtl birthDtl)
	{
		birthDtl.setFirstname(replaceSpaceChars(birthDtl.getFirstname()));
		birthDtl.setMiddlename(replaceSpaceChars(birthDtl.getMiddlename()));
		birthDtl.setLastname(replaceSpaceChars(birthDtl.getLastname()));
		birthDtl.setPlaceofbirth(replaceSpaceChars(birthDtl.getPlaceofbirth()));
		birthDtl.setRemarks(replaceSpaceChars(birthDtl.getRemarks()));
		birthDtl.setHospitalname(replaceSpaceChars(birthDtl.getHospitalname()));
		birthDtl.getBirthMotherInfo().setFirstname(replaceSpaceChars(birthDtl.getBirthMotherInfo().getFirstname()));
		birthDtl.getBirthMotherInfo().setMiddlename(replaceSpaceChars(birthDtl.getBirthMotherInfo().getMiddlename()));
		birthDtl.getBirthMotherInfo().setLastname(replaceSpaceChars(birthDtl.getBirthMotherInfo().getLastname()));
		birthDtl.getBirthMotherInfo().setAadharno(replaceSpaceChars(birthDtl.getBirthMotherInfo().getAadharno()));
		birthDtl.getBirthMotherInfo().setNationality(replaceSpaceChars(birthDtl.getBirthMotherInfo().getNationality()));
		birthDtl.getBirthMotherInfo().setProffession(replaceSpaceChars(birthDtl.getBirthMotherInfo().getProffession()));
		birthDtl.getBirthMotherInfo().setReligion(replaceSpaceChars(birthDtl.getBirthMotherInfo().getReligion()));
		birthDtl.getBirthFatherInfo().setFirstname(replaceSpaceChars(birthDtl.getBirthFatherInfo().getFirstname()));
		birthDtl.getBirthFatherInfo().setMiddlename(replaceSpaceChars(birthDtl.getBirthFatherInfo().getMiddlename()));
		birthDtl.getBirthFatherInfo().setLastname(replaceSpaceChars(birthDtl.getBirthFatherInfo().getLastname()));
		birthDtl.getBirthFatherInfo().setAadharno(replaceSpaceChars(birthDtl.getBirthFatherInfo().getAadharno()));
		birthDtl.getBirthFatherInfo().setNationality(replaceSpaceChars(birthDtl.getBirthFatherInfo().getNationality()));
		birthDtl.getBirthFatherInfo().setProffession(replaceSpaceChars(birthDtl.getBirthFatherInfo().getProffession()));
		birthDtl.getBirthFatherInfo().setReligion(replaceSpaceChars(birthDtl.getBirthFatherInfo().getReligion()));
		birthDtl.getBirthPermaddr().setHouseno(replaceSpaceChars(birthDtl.getBirthPermaddr().getHouseno()));
		birthDtl.getBirthPermaddr().setBuildingno(replaceSpaceChars(birthDtl.getBirthPermaddr().getBuildingno()));
		birthDtl.getBirthPermaddr().setStreetname(replaceSpaceChars(birthDtl.getBirthPermaddr().getStreetname()));
		birthDtl.getBirthPermaddr().setLocality(replaceSpaceChars(birthDtl.getBirthPermaddr().getLocality()));
		birthDtl.getBirthPermaddr().setTehsil(replaceSpaceChars(birthDtl.getBirthPermaddr().getTehsil()));
		birthDtl.getBirthPermaddr().setDistrict(replaceSpaceChars(birthDtl.getBirthPermaddr().getDistrict()));
		birthDtl.getBirthPermaddr().setCity(replaceSpaceChars(birthDtl.getBirthPermaddr().getCity()));
		birthDtl.getBirthPermaddr().setState(replaceSpaceChars(birthDtl.getBirthPermaddr().getState()));
		birthDtl.getBirthPermaddr().setPinno(replaceSpaceChars(birthDtl.getBirthPermaddr().getPinno()));
		birthDtl.getBirthPermaddr().setCountry(replaceSpaceChars(birthDtl.getBirthPermaddr().getCountry()));
		birthDtl.getBirthPresentaddr().setHouseno(replaceSpaceChars(birthDtl.getBirthPresentaddr().getHouseno()));
		birthDtl.getBirthPresentaddr().setBuildingno(replaceSpaceChars(birthDtl.getBirthPresentaddr().getBuildingno()));
		birthDtl.getBirthPresentaddr().setStreetname(replaceSpaceChars(birthDtl.getBirthPresentaddr().getStreetname()));
		birthDtl.getBirthPresentaddr().setLocality(replaceSpaceChars(birthDtl.getBirthPresentaddr().getLocality()));
		birthDtl.getBirthPresentaddr().setTehsil(replaceSpaceChars(birthDtl.getBirthPresentaddr().getTehsil()));
		birthDtl.getBirthPresentaddr().setDistrict(replaceSpaceChars(birthDtl.getBirthPresentaddr().getDistrict()));
		birthDtl.getBirthPresentaddr().setCity(replaceSpaceChars(birthDtl.getBirthPresentaddr().getCity()));
		birthDtl.getBirthPresentaddr().setState(replaceSpaceChars(birthDtl.getBirthPresentaddr().getState()));
		birthDtl.getBirthPresentaddr().setPinno(replaceSpaceChars(birthDtl.getBirthPresentaddr().getPinno()));
		birthDtl.getBirthPresentaddr().setCountry(replaceSpaceChars(birthDtl.getBirthPresentaddr().getCountry()));
	}

	private String replaceSpaceChars(String string) {
		if(null!=string)
		{
			string = string.replaceAll("\\t|\\r|\\n", " ");
		}
		return string;
	}
	
	private void setRejectionReason(String reason,EgBirthDtl birthDtl,ImportBirthWrapper importBirthWrapper)
	{
		birthDtl.setRejectReason(reason);
		importBirthWrapper.updateMaps(reason, birthDtl);
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

