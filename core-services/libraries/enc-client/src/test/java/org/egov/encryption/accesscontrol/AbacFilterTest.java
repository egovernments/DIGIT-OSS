package org.egov.encryption.accesscontrol;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import lombok.extern.slf4j.Slf4j;
import org.egov.encryption.models.RoleAttributeAccess;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;

import java.io.IOException;
import java.util.*;

@Slf4j
public class AbacFilterTest {

    @Mock
    private AbacFilter abacFilter;

    private String role1, role2;
    private List<RoleAttributeAccess> roleAttributeAccessList;

    @Before
    public void init() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper(new JsonFactory());
        ObjectReader reader = objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class,
                        RoleAttributeAccess.class));

//        URL url = getClass().getClassLoader().getResource("RoleAttributeAccessList.json");
//        String roleAttributeAccessListString = new String(Files.readAllBytes(Paths.get(url.getPath())));
//        roleAttributeAccessList = reader.readValue(roleAttributeAccessListString);
//
//        abacFilter = new AbacFilter(roleAttributeAccessList);
    }

    @Test
    public void test() {
        role1 = "GRO";
        role2 = "LME";
//        Map<Attribute, AccessType> attributeAccessTypeMap = abacFilter
//                .getAttributeAccessForRoles(Arrays.asList(role1, role2));
//        log.info(String.valueOf(attributeAccessTypeMap));
    }

}