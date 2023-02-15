package org.bel.birthdeath.death.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.death.model.EgDeathDtl;
import org.bel.birthdeath.death.model.EgDeathFatherInfo;
import org.bel.birthdeath.death.model.EgDeathMotherInfo;
import org.bel.birthdeath.death.model.EgDeathPermaddr;
import org.bel.birthdeath.death.model.EgDeathPresentaddr;
import org.bel.birthdeath.death.model.EgDeathSpouseInfo;
import org.bel.birthdeath.utils.CommonUtils;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

@Component
public class DeathMasterDtlRowMapper implements ResultSetExtractor<List<EgDeathDtl>> {
	
	@Autowired
	CommonUtils utils;

	@Override
	public List<EgDeathDtl> extractData(ResultSet rs) throws SQLException, DataAccessException {
		Map<String, EgDeathDtl> deathDtlMap = new LinkedHashMap<>();
		try {
			while (rs.next()) {
				String deathdtlid = rs.getString("deathdtlid");
				EgDeathDtl deathDtl = deathDtlMap.get(deathdtlid);

				if (deathDtl == null) {
					EgDeathMotherInfo motherInfo = EgDeathMotherInfo.builder().id(rs.getString("bmotid")).firstname(rs.getString("bmotfn")).middlename(rs.getString("bmotmn")).lastname(rs.getString("bmotln"))
							.aadharno(rs.getString("bmotaadharno")).emailid(rs.getString("bmotemailid")).mobileno(rs.getString("bmotmobileno"))
							.build();
					motherInfo.setFullName(utils.addfullName(motherInfo.getFirstname(),motherInfo.getMiddlename(),motherInfo.getLastname()));
					
					EgDeathFatherInfo fatherInfo = EgDeathFatherInfo.builder().id(rs.getString("bfatid")).firstname(rs.getString("bfatfn")).middlename(rs.getString("bfatmn")).lastname(rs.getString("bfatln"))
							.aadharno(rs.getString("bfataadharno")).emailid(rs.getString("bfatemailid")).mobileno(rs.getString("bfatmobileno"))
							.build();
					fatherInfo.setFullName(utils.addfullName(fatherInfo.getFirstname(),fatherInfo.getMiddlename(),fatherInfo.getLastname()));
					
					EgDeathSpouseInfo spouseInfo = EgDeathSpouseInfo.builder().id(rs.getString("bspsid")).firstname(rs.getString("bspsfn")).middlename(rs.getString("bspsmn")).lastname(rs.getString("bspsln"))
							.aadharno(rs.getString("bspsaadharno")).emailid(rs.getString("bspsemailid")).mobileno(rs.getString("bspsmobileno"))
							.build();
					spouseInfo.setFullName(utils.addfullName(spouseInfo.getFirstname(),spouseInfo.getMiddlename(),spouseInfo.getLastname()));
					
					EgDeathPermaddr	permaddr = EgDeathPermaddr.builder().id(rs.getString("bpmadid")).houseno(rs.getString("pmhouseno")).buildingno(rs.getString("pmbuildingno"))
							.streetname(rs.getString("pmstreetname")).locality(rs.getString("pmlocality")).tehsil(rs.getString("pmtehsil")).district(rs.getString("pmdistrict"))
							.city(rs.getString("pmcity")).state(rs.getString("pmstate")).pinno(rs.getString("pmpinno")).country(rs.getString("pmcountry"))
							.build();
					permaddr.setFullAddress(utils.addFullAddress(permaddr.getHouseno(),permaddr.getBuildingno(),permaddr.getStreetname(),permaddr.getLocality(),permaddr.getTehsil(),
							permaddr.getDistrict(),permaddr.getCity(),permaddr.getState(),permaddr.getPinno(),permaddr.getCountry()));
					
					EgDeathPresentaddr presentaddr= EgDeathPresentaddr.builder().id(rs.getString("bpsadid")).houseno(rs.getString("pshouseno")).buildingno(rs.getString("psbuildingno"))
							.streetname(rs.getString("psstreetname")).locality(rs.getString("pslocality")).tehsil(rs.getString("pstehsil")).district(rs.getString("psdistrict"))
							.city(rs.getString("pscity")).state(rs.getString("psstate")).pinno(rs.getString("pspinno")).country(rs.getString("pscountry"))
							.build();
					presentaddr.setFullAddress(utils.addFullAddress(presentaddr.getHouseno(),presentaddr.getBuildingno(),presentaddr.getStreetname(),presentaddr.getLocality(),presentaddr.getTehsil(),
							presentaddr.getDistrict(),presentaddr.getCity(),presentaddr.getState(),presentaddr.getPinno(),presentaddr.getCountry()));
					
					deathDtl = EgDeathDtl.builder().id(deathdtlid).registrationno(rs.getString("registrationno")).hospitalname(rs.getString("hospitalname")).dateofreport(rs.getTimestamp("dateofreport")).gender(rs.getInt("gender"))
							.dateofdeath(rs.getTimestamp("dateofdeath")).counter(rs.getInt("counter")).genderStr(rs.getString("genderstr")).tenantid(rs.getString("tenantid"))
							.firstname(rs.getString("bdtlfn")).middlename(rs.getString("bdtlmn")).lastname(rs.getString("bdtlln")).deathMotherInfo(motherInfo).deathFatherInfo(fatherInfo).deathSpouseInfo(spouseInfo)
							.deathPermaddr(permaddr).deathPresentaddr(presentaddr).placeofdeath(rs.getString("placeofdeath")).remarks(rs.getString("remarks"))
							.hospitalid(rs.getString("hospitalid")).informantsname(rs.getString("informantsname")).informantsaddress(rs.getString("informantsaddress"))
							.eidno(rs.getString("eidno")).aadharno(rs.getString("bdtlaadharno"))
							.nationality(rs.getString("bdtlnationality")).religion(rs.getString("bdtlreligion")).icdcode(rs.getString("icdcode")).age(rs.getLong("age"))
							.isLegacyRecord(rs.getBoolean("islegacyrecord"))
							.build();
					deathDtl.setFullName(utils.addfullName(deathDtl.getFirstname(), deathDtl.getMiddlename(), deathDtl.getLastname()));
					deathDtlMap.put(deathdtlid, deathDtl);
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("INVALID INPUT", "Error in fetching data");
		}
		return new ArrayList<>(deathDtlMap.values());
	}
}
