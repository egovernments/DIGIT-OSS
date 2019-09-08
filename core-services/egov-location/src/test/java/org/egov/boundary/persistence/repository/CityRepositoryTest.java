package org.egov.boundary.persistence.repository;

import org.springframework.beans.factory.annotation.Autowired;

public class CityRepositoryTest {

	@Autowired
	private CityRepository cityRepository;

	/*@Test
	@Sql(scripts = { "/sql/clearCity.sql", "/sql/createCity.sql" })
	public void shouldFetchCityForGivenCityCode() {
		final City city = cityRepository.findByCodeAndTenantId("0001", "ap.public");
		assertEquals("0001", city.getCode());
	}*/

}
