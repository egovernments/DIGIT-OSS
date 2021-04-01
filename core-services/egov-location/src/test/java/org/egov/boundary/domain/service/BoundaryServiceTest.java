package org.egov.boundary.domain.service;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.List;

import org.egov.boundary.domain.model.Boundary;
import org.egov.boundary.persistence.repository.BoundaryRepository;
import org.egov.boundary.web.contract.BoundaryType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(MockitoJUnitRunner.class)
public class BoundaryServiceTest {

	@Mock
	private BoundaryRepository boundaryRepository;

	@Mock
	private CrossHierarchyService crossHierarchyService;

	@Mock
	private BoundaryTypeService boundaryTypeService;

	private BoundaryService boundaryService;

	@Before
	public void before() {
		boundaryService = new BoundaryService(boundaryTypeService,
				crossHierarchyService, boundaryRepository);
	}

	@Test
	@Transactional
	public void test_should_fetch_boundaries_for_boundarytype_and_hierarchytype_name() {

		boundaryService.getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId("Ward", "ADMINISTRATION",
				"tenantId");

		verify(boundaryRepository).getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId("Ward", "ADMINISTRATION",
				"tenantId");
	}

	@Test
	@Transactional
	public void test_should_fetch_boundaries_for_boundarytype_and_tenantid() {

		boundaryService.getAllBoundariesByBoundaryTypeIdAndTenantId(1l, "tenantId");

		verify(boundaryRepository).getAllBoundariesByBoundaryTypeIdAndTenantId(1l, "tenantId");
	}

	private List<Boundary> getBoundaries() {

		List<Boundary> boundaries = new ArrayList<Boundary>();

		Boundary boundary1 = Boundary.builder().build();

		boundary1.setId(1l);
		boundary1.setName("Srikakulam  Municipality");
		boundary1.setBoundaryNum(1l);
		boundary1.setTenantId("default");

		BoundaryType bt1 = new BoundaryType();

		bt1.setId("1l");
		bt1.setName("City");
		bt1.setHierarchy(1l);
		bt1.setTenantId("default");
		boundary1.setBoundaryType(bt1);

		Boundary boundary2 = Boundary.builder().build();

		boundary2.setId(2l);
		boundary2.setName("Zone-1");
		boundary2.setBoundaryNum(1l);
		boundary2.setTenantId("default");

		boundary2.setParent(boundary1);

		BoundaryType bt2 = new BoundaryType();

		bt2.setId("3l");
		bt2.setName("Zone");
		bt2.setHierarchy(3l);
		bt2.setTenantId("default");
		boundary2.setBoundaryType(bt2);

		boundaries.add(boundary1);
		boundaries.add(boundary2);

		return boundaries;
	}

}