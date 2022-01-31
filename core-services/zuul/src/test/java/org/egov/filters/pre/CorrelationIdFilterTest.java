package org.egov.filters.pre;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

public class CorrelationIdFilterTest {

	private CorrelationIdFilter correlationIdFilter;

	private List<String> encrytpedUlList = new ArrayList<>();
	private List<String> openEndpointsWhitelist = new ArrayList<>();
	private List<String> mixModeEndpointslist = new ArrayList<>();
	private ObjectMapper objectMapper;
	
	@Before
	public void before() {
    
		encrytpedUlList.add("anonymous-endpoint2");
        encrytpedUlList.add("anonymous-endpoint2");
		openEndpointsWhitelist.add("/user/_details");
        openEndpointsWhitelist.add("open-endpoint2");
        mixModeEndpointslist.add("anonymous-endpoint1");
        mixModeEndpointslist.add("anonymous-endpoint2");
        
		correlationIdFilter = new CorrelationIdFilter(openEndpointsWhitelist, mixModeEndpointslist, objectMapper);
	}

	@Test
	public void test_should_set_filter_order_to_beginning() {
		assertEquals(0, correlationIdFilter.filterOrder());
	}

	@Test
	public void test_should_execute_as_pre_filter() {
		assertEquals("pre", correlationIdFilter.filterType());
	}

	@Test
	public void test_should_always_execute_filter() {
		assertTrue( correlationIdFilter.shouldFilter());
	}

}