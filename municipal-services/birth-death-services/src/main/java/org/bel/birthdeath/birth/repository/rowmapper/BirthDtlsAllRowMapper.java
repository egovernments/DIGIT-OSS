package org.bel.birthdeath.birth.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import org.bel.birthdeath.birth.model.EgBirthDtl;
import org.bel.birthdeath.birth.model.EgBirthFatherInfo;
import org.bel.birthdeath.birth.model.EgBirthMotherInfo;
import org.bel.birthdeath.birth.model.EgBirthPermaddr;
import org.bel.birthdeath.birth.model.EgBirthPresentaddr;
import org.bel.birthdeath.utils.CommonUtils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class BirthDtlsAllRowMapper implements ResultSetExtractor<List<EgBirthDtl>> {
	
	@Autowired
	CommonUtils utils;

	@Override
	public List<EgBirthDtl> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, EgBirthDtl> birthDtlMap = new LinkedHashMap<>();
		try {
			while (rs.next()) {
				String birthdtlid = rs.getString("birthdtlid");
				EgBirthDtl birthDtl = birthDtlMap.get(birthdtlid);

				if (birthDtl == null) {
					EgBirthMotherInfo motherInfo = EgBirthMotherInfo.builder().firstname(rs.getString("bmotfn")).middlename(rs.getString("bmotmn")).lastname(rs.getString("bmotln"))
							.aadharno(rs.getString("bmotaadharno")).build();
					motherInfo.setFullName(utils.addfullName(motherInfo.getFirstname(),motherInfo.getMiddlename(),motherInfo.getLastname()));
					
					EgBirthFatherInfo fatherInfo = EgBirthFatherInfo.builder().firstname(rs.getString("bfatfn")).middlename(rs.getString("bfatmn")).lastname(rs.getString("bfatln"))
							.aadharno(rs.getString("bfataadharno")).build();
					fatherInfo.setFullName(utils.addfullName(fatherInfo.getFirstname(),fatherInfo.getMiddlename(),fatherInfo.getLastname()));
					
					EgBirthPermaddr	permaddr = EgBirthPermaddr.builder().houseno(rs.getString("pmhouseno")).buildingno(rs.getString("pmbuildingno"))
							.streetname(rs.getString("pmstreetname")).locality(rs.getString("pmlocality")).tehsil(rs.getString("pmtehsil")).district(rs.getString("pmdistrict"))
							.city(rs.getString("pmcity")).state(rs.getString("pmstate")).pinno(rs.getString("pmpinno")).country(rs.getString("pmcountry")).build();
					permaddr.setFullAddress(utils.addFullAddress(permaddr.getHouseno(),permaddr.getBuildingno(),permaddr.getStreetname(),permaddr.getLocality(),permaddr.getTehsil(),
							permaddr.getDistrict(),permaddr.getCity(),permaddr.getState(),permaddr.getPinno(),permaddr.getCountry()));
					
					EgBirthPresentaddr presentaddr= EgBirthPresentaddr.builder().houseno(rs.getString("pshouseno")).buildingno(rs.getString("psbuildingno"))
							.streetname(rs.getString("psstreetname")).locality(rs.getString("pslocality")).tehsil(rs.getString("pstehsil")).district(rs.getString("psdistrict"))
							.city(rs.getString("pscity")).state(rs.getString("psstate")).pinno(rs.getString("pspinno")).country(rs.getString("pscountry")).build();
					presentaddr.setFullAddress(utils.addFullAddress(presentaddr.getHouseno(),presentaddr.getBuildingno(),presentaddr.getStreetname(),presentaddr.getLocality(),presentaddr.getTehsil(),
							presentaddr.getDistrict(),presentaddr.getCity(),presentaddr.getState(),presentaddr.getPinno(),presentaddr.getCountry()));
					
					birthDtl = EgBirthDtl.builder().id(birthdtlid).registrationno(rs.getString("registrationno")).hospitalname(rs.getString("hospitalname")).dateofreport(rs.getTimestamp("dateofreport")).gender(rs.getInt("gender"))
							.dateofbirth(rs.getTimestamp("dateofbirth")).counter(rs.getInt("counter")).genderStr(rs.getString("genderstr")).tenantid(rs.getString("tenantid")).dateofissue(System.currentTimeMillis())
							.firstname(rs.getString("bdtlfn")).middlename(rs.getString("bdtlmn")).lastname(rs.getString("bdtlln")).birthMotherInfo(motherInfo).birthFatherInfo(fatherInfo)
							.birthPermaddr(permaddr).birthPresentaddr(presentaddr).placeofbirth(rs.getString("placeofbirth")).remarks(rs.getString("remarks"))
							.build();
					birthDtl.setFullName(utils.addfullName(birthDtl.getFirstname(), birthDtl.getMiddlename(), birthDtl.getLastname()));
					birthDtlMap.put(birthdtlid, birthDtl);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("INVALID INPUT", "Error in fetching data");
		}
		return new ArrayList<>(birthDtlMap.values());
	}
}
