package org.egov.boundary.persistence.repository;

import org.egov.boundary.TestConfiguration;
import org.egov.boundary.domain.model.Boundary;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Import(TestConfiguration.class)
public class BoundaryRepositoryTest {

	private BoundaryRepository boundaryRepository;
	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private MdmsRepository mdmsRepository;
	
	
	@Before
	public void before() {
		boundaryRepository = new BoundaryRepository(namedParameterJdbcTemplate,jdbcTemplate,mdmsRepository);
	}

	@Test
	@Sql(scripts = { "/sql/clearBoundary.sql", "/sql/createBoundary.sql" })
	public void test_should_fetch_boundaries_for_boundarytype_and_hierarchytype_name() {
		final List<Boundary> boundarys = boundaryRepository
				.getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId("City", "ADMINISTRATION", "default");
		assertEquals("Srikakulam  Municipality", boundarys.get(0).getName());
	}

/*	@Test
	@Sql(scripts = { "/sql/clearBoundary.sql", "/sql/createBoundary.sql" })
	public void test_should_fetch_boundaries_for_boundarytype_and_tenantid() {
		final List<Boundary> boundarys = boundaryRepository.getAllBoundariesByBoundaryTypeIdAndTenantId(1l, "default");
		assertEquals("Srikakulam  Municipality", boundarys.get(0).getName());
	}*/

/*	@Test
	@Sql(scripts = { "/sql/clearBoundary.sql", "/sql/createBoundary.sql" })
	@Transactional
	public void test_should_fetch_boundaries_for_id_and_tenantid() {
		final List<Boundary> boundarys = boundaryRepository.getBoundariesByIdAndTenantId(1l, "default");
		assertEquals("Srikakulam  Municipality", boundarys.get(0).getName());
	}*/
   
	@Test
	@Sql(scripts = { "/sql/clearBoundary.sql", "/sql/createBoundary.sql" })
	public void testShouldFetchAllBoundariesByTenantIdAndBoundaryIds(){
		
		List<Long> list = new ArrayList<Long>();
		list.add(1l);
		List<Boundary> boundarys = boundaryRepository.findAllBoundariesByIdsAndTenant("default", list);
		
		assertTrue(boundarys.size() == 1);
		assertTrue(boundarys!=null);
		assertTrue(boundarys.get(0).getId() == 1);
		assertTrue(boundarys.get(0).getName().equals("Srikakulam  Municipality"));
		assertTrue(boundarys.get(0).getBoundaryNum().equals(1l));
		assertTrue(boundarys.get(0).getBoundaryType().getId().equals("1"));
		assertTrue(boundarys.get(0).getLocalName().equals("Srikakulam  Municipality"));
		assertTrue(boundarys.get(0).isHistory() == false);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearBoundary.sql", "/sql/createBoundary.sql" })
	public void testShouldGetAllBoundaryByTenantIdAndTypeIds(){
		
		List<Long> list = new ArrayList<Long>();
		list.add(1l);
		List<Boundary> boundarys = boundaryRepository.getAllBoundaryByTenantIdAndTypeIds("default",list);
		
		assertTrue(boundarys.size() == 1);
		assertTrue(boundarys!=null);
		assertTrue(boundarys.get(0).getId() == 1);
		assertTrue(boundarys.get(0).getName().equals("Srikakulam  Municipality"));
		assertTrue(boundarys.get(0).getBoundaryNum().equals(1l));
		assertTrue(boundarys.get(0).getBoundaryType().getId().equals("1"));
		assertTrue(boundarys.get(0).getLocalName().equals("Srikakulam  Municipality"));
		assertTrue(boundarys.get(0).isHistory() == false);
	}
	
	@Test
	@Sql(scripts = { "/sql/clearBoundary.sql", "/sql/createBoundary.sql" })
	public void testShouldGetAllBoundaryByTenantAndNumAndTypeAndTypeIds(){
		
		List<Long> list = new ArrayList<Long>();
		list.add(1l);
		//List<Boundary> boundarys = boundaryRepository.getAllBoundaryByTenantAndNumAndTypeAndTypeIds("default",list,list,list);
		
		/*assertTrue(boundarys.size() == 1);
		assertTrue(boundarys!=null);
		assertTrue(boundarys.get(0).getId() == 1);
		assertTrue(boundarys.get(0).getName().equals("Srikakulam  Municipality"));
		assertTrue(boundarys.get(0).getBoundaryNum().equals(1l));
		assertTrue(boundarys.get(0).getBoundaryType().getId().equals(1l));
		assertTrue(boundarys.get(0).getLocalName().equals("Srikakulam  Municipality"));
		assertTrue(boundarys.get(0).isHistory() == false);
		assertTrue(boundarys.get(0).getBoundaryType().getId() == "1l");
		assertTrue(boundarys.get(0).getBoundaryType().getName().equals("City"));
		assertTrue(boundarys.get(0).getBoundaryType().getHierarchy() == 1l);*/
	}
	
}
