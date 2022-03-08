package org.bel.birthdeath.death.validator;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.bel.birthdeath.birth.model.EgBirthDtl;
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
		/*if ((criteria.getRegistrationNo() == null || criteria.getRegistrationNo().isEmpty())
				&& (criteria.getHospitalname() == null || criteria.getHospitalname().isEmpty() ||
						criteria.getMotherName() == null || criteria.getMotherName().isEmpty() ))
			throw new CustomException("null_input", "Search criteria not meeting.");*/
		return true;
	}
	
	public boolean validateFieldsEmployee(SearchCriteria criteria) {
		if (criteria.getTenantId() == null || criteria.getTenantId().isEmpty() || criteria.getGender() == null
			|| criteria.getFromDate() == null	|| criteria.getFromDate().isEmpty() || criteria.getToDate() == null	|| criteria.getToDate().isEmpty())
			throw new CustomException("null_input", BirthDeathConstants.D_MANDATORY_MISSING);
		/*if ((criteria.getRegistrationNo() == null || criteria.getRegistrationNo().isEmpty())
				&& (criteria.getHospitalname() == null || criteria.getHospitalname().isEmpty() ||
						criteria.getMotherName() == null || criteria.getMotherName().isEmpty() ))
			throw new CustomException("null_input", "Search criteria not meeting.");*/
		return true;
	}
	
	public boolean validateUniqueRegNo(EgDeathDtl deathDtl,ImportDeathWrapper importDeathWrapper) {
		SearchCriteria criteria = new SearchCriteria();
		criteria.setRegistrationNo(deathDtl.getRegistrationno());
		criteria.setTenantId(deathDtl.getTenantid());
		if(repository.getDeathDtls(criteria).size()==0)
			return true;
		deathDtl.setRejectReason(BirthDeathConstants.DUPLICATE_REG);
		importDeathWrapper.updateMaps(BirthDeathConstants.DUPLICATE_REG, deathDtl);
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
				return false;
			}
			else
			{
				Timestamp dobdateRangeEpoch = dateTimeStampHandler(doddateFormatEpoch);
				if(null==dobdateRangeEpoch) {
					deathDtl.setRejectReason(BirthDeathConstants.INVALID_DOD_RANGE);
					importDeathWrapper.updateMaps(BirthDeathConstants.INVALID_DOD_RANGE, deathDtl);
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
				return false;
			}
			else
			{
				Timestamp dordateRangeEpoch = dateTimeStampHandler(dordateFormatEpoch);
				if(null==dordateRangeEpoch) {
					deathDtl.setRejectReason(BirthDeathConstants.INVALID_DOR_RANGE);
					importDeathWrapper.updateMaps(BirthDeathConstants.INVALID_DOR_RANGE, deathDtl);
					return false;
				}
				deathDtl.setDateofreport(dordateRangeEpoch);
			}
		}
		
		if(deathDtl.getTenantid()==null || deathDtl.getTenantid().isEmpty() ) {
			setRejectionReason(BirthDeathConstants.TENANT_EMPTY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getRegistrationno()==null || deathDtl.getRegistrationno().isEmpty()) {
			setRejectionReason(BirthDeathConstants.REG_EMPTY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDateofdeath()==null) {
			setRejectionReason(BirthDeathConstants.DOD_EMPTY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getGender()==null) {
			setRejectionReason(BirthDeathConstants.GENDER_EMPTY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getGender().intValue()!=1 && deathDtl.getGender().intValue()!=2 && deathDtl.getGender().intValue()!=3 ) {
			setRejectionReason(BirthDeathConstants.GENDER_INVALID,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getRegistrationno().length()>64) {
			setRejectionReason(BirthDeathConstants.REGNO_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getInformantsname()!=null && deathDtl.getInformantsname().length()>200) {
			setRejectionReason(BirthDeathConstants.INFORMANTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getInformantsaddress()!=null && deathDtl.getInformantsaddress().length()>1000) {
			setRejectionReason(BirthDeathConstants.INFORMANTADDR_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getPlaceofdeath()!=null && deathDtl.getPlaceofdeath().length()>1000) {
			setRejectionReason(BirthDeathConstants.PLACEOFDEATH_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getFirstname()!=null && deathDtl.getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getMiddlename()!=null && deathDtl.getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getLastname()!=null && deathDtl.getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.LASTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getFirstname()!=null && deathDtl.getDeathFatherInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.F_FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getMiddlename()!=null && deathDtl.getDeathFatherInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.F_MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getLastname()!=null && deathDtl.getDeathFatherInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.F_LASTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getEmailid()!=null && deathDtl.getDeathFatherInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.F_EMAIL_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getMobileno()!=null && deathDtl.getDeathFatherInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.F_MOBILE_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathFatherInfo().getAadharno()!=null && deathDtl.getDeathFatherInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.F_AADHAR_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		
		if(deathDtl.getDeathMotherInfo().getFirstname()!=null && deathDtl.getDeathMotherInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.M_FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getMiddlename()!=null && deathDtl.getDeathMotherInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.M_MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getLastname()!=null && deathDtl.getDeathMotherInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.M_LASTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getEmailid()!=null && deathDtl.getDeathMotherInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.M_EMAIL_LARGE,deathDtl,importDeathWrapper);
			return false;
		}

		if(deathDtl.getDeathMotherInfo().getMobileno()!=null && deathDtl.getDeathMotherInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.M_MOBILE_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathMotherInfo().getAadharno()!=null && deathDtl.getDeathMotherInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.M_AADHAR_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getFirstname()!=null && deathDtl.getDeathSpouseInfo().getFirstname().length()>200) {
			setRejectionReason(BirthDeathConstants.S_FIRSTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getMiddlename()!=null && deathDtl.getDeathSpouseInfo().getMiddlename().length()>200) {
			setRejectionReason(BirthDeathConstants.S_MIDDLENAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getLastname()!=null && deathDtl.getDeathSpouseInfo().getLastname().length()>200) {
			setRejectionReason(BirthDeathConstants.S_LASTNAME_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getEmailid()!=null && deathDtl.getDeathSpouseInfo().getEmailid().length()>50) {
			setRejectionReason(BirthDeathConstants.S_EMAIL_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getMobileno()!=null && deathDtl.getDeathSpouseInfo().getMobileno().length()>20) {
			setRejectionReason(BirthDeathConstants.S_MOBILE_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathSpouseInfo().getAadharno()!=null && deathDtl.getDeathSpouseInfo().getAadharno().length()>50) {
			setRejectionReason(BirthDeathConstants.S_AADHAR_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		
		if(deathDtl.getDeathPermaddr().getBuildingno()!=null && deathDtl.getDeathPermaddr().getBuildingno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_BUILDINGNO,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getHouseno()!=null && deathDtl.getDeathPermaddr().getHouseno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_HOUSENO,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getStreetname()!=null && deathDtl.getDeathPermaddr().getStreetname().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_STREETNAME,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getLocality()!=null && deathDtl.getDeathPermaddr().getLocality().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_LOCALITY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getTehsil()!=null && deathDtl.getDeathPermaddr().getTehsil().length()>1000) {
			setRejectionReason(BirthDeathConstants.PERM_TEHSIL,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getDistrict()!=null && deathDtl.getDeathPermaddr().getDistrict().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_DISTRICT,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getCity()!=null && deathDtl.getDeathPermaddr().getCity().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_CITY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getState()!=null && deathDtl.getDeathPermaddr().getState().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_STATE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getPinno()!=null && deathDtl.getDeathPermaddr().getPinno().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_PINNO,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPermaddr().getCountry()!=null && deathDtl.getDeathPermaddr().getCountry().length()>100) {
			setRejectionReason(BirthDeathConstants.PERM_COUNTRY,deathDtl,importDeathWrapper);
			return false;
		}
		
		if(deathDtl.getDeathPresentaddr().getBuildingno()!=null && deathDtl.getDeathPresentaddr().getBuildingno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_BUILDINGNO,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getHouseno()!=null && deathDtl.getDeathPresentaddr().getHouseno().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_HOUSENO,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getStreetname()!=null && deathDtl.getDeathPresentaddr().getStreetname().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_STREETNAME,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getLocality()!=null && deathDtl.getDeathPresentaddr().getLocality().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_LOCALITY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getTehsil()!=null && deathDtl.getDeathPresentaddr().getTehsil().length()>1000) {
			setRejectionReason(BirthDeathConstants.PRESENT_TEHSIL,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getDistrict()!=null && deathDtl.getDeathPresentaddr().getDistrict().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_DISTRICT,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getCity()!=null && deathDtl.getDeathPresentaddr().getCity().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_CITY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getState()!=null && deathDtl.getDeathPresentaddr().getState().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_STATE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getPinno()!=null && deathDtl.getDeathPresentaddr().getPinno().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_PINNO,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getDeathPresentaddr().getCountry()!=null && deathDtl.getDeathPresentaddr().getCountry().length()>100) {
			setRejectionReason(BirthDeathConstants.PRESENT_COUNTRY,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getAge()!=null && deathDtl.getAge().length()>100) {
			setRejectionReason(BirthDeathConstants.AGE_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getEidno()!=null && deathDtl.getEidno().length()>100) {
			setRejectionReason(BirthDeathConstants.EIDNO_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getAadharno()!=null && deathDtl.getAadharno().length()>150) {
			setRejectionReason(BirthDeathConstants.AADHAR_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getNationality()!=null && deathDtl.getNationality().length()>100) {
			setRejectionReason(BirthDeathConstants.NATIONALITY_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getReligion()!=null && deathDtl.getReligion().length()>100) {
			setRejectionReason(BirthDeathConstants.RELIGION_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		if(deathDtl.getIcdcode()!=null && deathDtl.getIcdcode().length()>300) {
			setRejectionReason(BirthDeathConstants.ICDCODE_LARGE,deathDtl,importDeathWrapper);
			return false;
		}
		/*if(containsInvalidCharsSub(deathDtl.getRegistrationno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Registration No.",deathDtl,importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getFirstname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in First Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getMiddlename())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Middle Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getLastname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Last Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getPlaceofdeath())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Place of Birth.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getRemarks())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Remarks.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathMotherInfo().getFirstname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Mother First Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathMotherInfo().getMiddlename())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Mother Midddle Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathMotherInfo().getLastname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Mother Last Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathMotherInfo().getAadharno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Mother Aadhar No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathFatherInfo().getFirstname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Father First Name", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathFatherInfo().getMiddlename())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Father Middle Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathFatherInfo().getLastname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Father Last Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathFatherInfo().getAadharno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Father Aadhar No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getHouseno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address House No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getBuildingno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address Building No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getStreetname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address Street Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getLocality())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address Locality.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getTehsil())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address Tehsil.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getDistrict())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address District.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getCity())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address City.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getState())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address State.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getPinno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address PIN No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPermaddr().getCountry())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Permanent Address Country.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getHouseno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address House No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getBuildingno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address Building No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getStreetname())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address Street Name.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getLocality())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address Locality.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getTehsil())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address Tehsil.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getDistrict())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address District.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getCity())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address City.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getState())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address State.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getPinno())) {
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address PIN No.", deathDtl,
					importDeathWrapper);
			return false;
		}
		if (containsInvalidCharsSub(deathDtl.getDeathPresentaddr().getCountry())){
			setRejectionReason(BirthDeathConstants.INVALID_DATA_SPACES + " in Present Address Country.", deathDtl,
					importDeathWrapper);
			return false;
		}*/
		return true;
	}
	
	public void removeSpaceChars(EgDeathDtl deathDtl)
	{
		deathDtl.setFirstname(replaceSpaceChars(deathDtl.getFirstname()));
		deathDtl.setMiddlename(replaceSpaceChars(deathDtl.getMiddlename()));
		deathDtl.setLastname(replaceSpaceChars(deathDtl.getLastname()));
		deathDtl.setPlaceofdeath(replaceSpaceChars(deathDtl.getPlaceofdeath()));
		deathDtl.setRemarks(replaceSpaceChars(deathDtl.getRemarks()));
		deathDtl.setAge(replaceSpaceChars(deathDtl.getAge()));
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
