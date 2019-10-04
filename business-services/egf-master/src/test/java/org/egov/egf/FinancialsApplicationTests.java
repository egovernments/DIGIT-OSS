package org.egov.egf;

import org.egov.egf.master.TestConfiguration;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

@Import(TestConfiguration.class)
@RunWith(SpringRunner.class)
@SpringBootTest
@Ignore
public class FinancialsApplicationTests {

	@Test
	public void contextLoads() {
	}

}
