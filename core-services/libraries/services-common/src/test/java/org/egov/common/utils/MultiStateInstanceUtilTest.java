package org.egov.common.utils;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class MultiStateInstanceUtilTest {

	@Test
	public void testIfStateLevelTenantIdIsReturnedForCentralDeployment(){
	
		MultiStateInstanceUtil centralUtil = new MultiStateInstanceUtil(2, true, 1);
		String InputTenantId = "in.statea.tenantx";
		String outputTenant = "in.statea";
		String actualOutputTenantId = centralUtil.getStateLevelTenant(InputTenantId);
		
		assertEquals(actualOutputTenantId, outputTenant);
	}
	
	@Test
	public void testIfSameTenantIdIsReturnedIfStateLengthIslargerThanActualTenantLength(){
	
		MultiStateInstanceUtil centralUtil = new MultiStateInstanceUtil(3, true, 1);
		String InputTenantId = "in.statea.tenantx";
		String outputTenant = "in.statea.tenantx";
		String actualOutputTenantId = centralUtil.getStateLevelTenant(InputTenantId);
		
		assertEquals(actualOutputTenantId, outputTenant);
	}
	
	@Test
	public void testIfStateLevelTenantIdIsReturnedForIsolatedDeployment(){
	
		MultiStateInstanceUtil centralUtil = new MultiStateInstanceUtil(2, false, 1);
		String InputTenantId = "in.statea.tenantx";
		String outputTenant = "in";
		
		String actualOutputTenantId = centralUtil.getStateLevelTenant(InputTenantId);
		
		assertEquals(actualOutputTenantId, outputTenant);
	}

}
