package org.egov.pt.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.SerializationUtils;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.FileUtils;
import org.egov.pt.web.models.*;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

@Slf4j
public class UserServiceTest {


    @Mock
    private ServiceRequestRepository serviceRequestRepositoryMock;

    @InjectMocks
    private UserService userServiceMock;

    @Before
    public void setUp() throws Exception {
       MockitoAnnotations.initMocks(this);
       ReflectionTestUtils.setField(userServiceMock, "userHost", "http://localhost:8081");
       ReflectionTestUtils.setField(userServiceMock, "userContextPath", "user/users/");
       ReflectionTestUtils.setField(userServiceMock, "userCreateEndpoint", "/_createnovalidate");
       ReflectionTestUtils.setField(userServiceMock, "userSearchEndpoint", "/user/_search");
       ReflectionTestUtils.setField(userServiceMock, "userUpdateEndpoint", "/_updatenovalidate");
     }


    public void testUserCreateIfUserPresent(){
        PropertyRequest request = null;
        UserDetailResponse userDetailResponse = null;
        LinkedHashMap responseWithUser = new LinkedHashMap();
        ObjectMapper mapper = new ObjectMapper();
        try{
            request = getObject("src/test/PropertyRequest.json",PropertyRequest.class);
            File file = new File("src/test/resources/UserDetailResponse.json");
            responseWithUser = mapper.readValue(file, new TypeReference<Map<String, Object>>(){});
        }
        catch(Exception e){
            e.printStackTrace();
            fail();
        }

        when(serviceRequestRepositoryMock.fetchResult(any(StringBuilder.class),anyObject())).thenReturn(responseWithUser);
        userServiceMock.createUser(request);

        userDetailResponse = mapper.convertValue(responseWithUser,UserDetailResponse.class);
        User user = userDetailResponse.getUser().get(0);
        request.getProperties().get(0).getPropertyDetails().get(0).getOwners().forEach(owner ->{
            assertEquals(owner.getUuid(),user.getUuid());
            assertEquals(owner.getCreatedBy(),user.getCreatedBy());
            assertEquals(owner.getCreatedDate(),user.getCreatedDate());
            assertEquals(owner.getLastModifiedBy(),user.getLastModifiedBy());
            assertEquals(owner.getLastModifiedDate(),user.getLastModifiedDate());
        });
    }

    public void testUserCreateIfUserNotPresent(){
        PropertyRequest request = null;
        UserDetailResponse userDetailResponse = null;
        LinkedHashMap responseWithUser = new LinkedHashMap();
        LinkedHashMap emptyResponseMap = new LinkedHashMap();
        ObjectMapper mapper = new ObjectMapper();
        try{
            request = getObject("src/test/PropertyRequest.json",PropertyRequest.class);
            File file = new File("src/test/resources/UserDetailResponse.json");
            responseWithUser = mapper.readValue(file, new TypeReference<Map<String, Object>>(){});
            file =  new File("src/test/resources/EmptyUserDetailResponse.json");
            emptyResponseMap = mapper.readValue(file, new TypeReference<Map<String, Object>>(){});

            doAnswer(invocationOnMock -> {
                if(invocationOnMock.getArguments()[1] instanceof CreateUserRequest) {
                    return mapper.readValue(new File("src/test/resources/UserDetailResponse.json"), new TypeReference<Map<String, Object>>(){});
                }
                if(invocationOnMock.getArguments()[1] instanceof UserSearchRequest) {
                    return mapper.readValue(new File("src/test/resources/EmptyUserDetailResponse.json"), new TypeReference<Map<String, Object>>(){});
                }
                else {
//                    log.error("Object class: "+invocationOnMock.getArguments()[1].getClass());
                    throw new IllegalArgumentException("unexpected type");
                }
            }).when(serviceRequestRepositoryMock).fetchResult(any(),anyObject());
        }
        catch(Exception e){
            e.printStackTrace();
            fail();
        }
        userServiceMock.createUser(request);
        parseResponse(responseWithUser,"dd-MM-yyyy");
        userDetailResponse = mapper.convertValue(responseWithUser,UserDetailResponse.class);
        User user = userDetailResponse.getUser().get(0);
        request.getProperties().get(0).getPropertyDetails().get(0).getOwners().forEach(owner ->{
            assertEquals(owner.getUuid(),user.getUuid());
            assertEquals(owner.getCreatedBy(),user.getCreatedBy());
            assertEquals(owner.getCreatedDate(),user.getCreatedDate());
            assertEquals(owner.getLastModifiedBy(),user.getLastModifiedBy());
            assertEquals(owner.getLastModifiedDate(),user.getLastModifiedDate());
        });
    }

    public void updateUserWhenUserNotPresentTest(){
        PropertyRequest request = null;
        UserDetailResponse userDetailResponse = null;
        LinkedHashMap responseWithUser = new LinkedHashMap();
        LinkedHashMap emptyResponseMap = new LinkedHashMap();
        ObjectMapper mapper = new ObjectMapper();
        try{
            request = getObject("src/test/PropertyRequest.json",PropertyRequest.class);
            File file = new File("src/test/resources/UserDetailResponse.json");
            responseWithUser = mapper.readValue(file, new TypeReference<Map<String, Object>>(){});
            file =  new File("src/test/resources/EmptyUserDetailResponse.json");
            emptyResponseMap = mapper.readValue(file, new TypeReference<Map<String, Object>>(){});

            doAnswer(invocationOnMock -> {
                if(invocationOnMock.getArguments()[1] instanceof CreateUserRequest) {
                    return mapper.readValue(new File("src/test/resources/UserDetailResponse.json"), new TypeReference<Map<String, Object>>(){});
                }
                if(invocationOnMock.getArguments()[1] instanceof UserSearchRequest) {
                    return mapper.readValue(new File("src/test/resources/EmptyUserDetailResponse.json"), new TypeReference<Map<String, Object>>(){});
                }
                else {
                    throw new IllegalArgumentException("unexpected type");
                }
            }).when(serviceRequestRepositoryMock).fetchResult(any(),anyObject());
        }
        catch(Exception e){
            e.printStackTrace();
            fail();
        }
        userServiceMock.updateUser(request);
        parseResponse(responseWithUser,"dd-MM-yyyy");
        userDetailResponse = mapper.convertValue(responseWithUser,UserDetailResponse.class);
        User user = userDetailResponse.getUser().get(0);
        request.getProperties().get(0).getPropertyDetails().get(0).getOwners().forEach(owner ->{
            assertEquals(owner.getUuid(),user.getUuid());
            assertEquals(owner.getCreatedBy(),user.getCreatedBy());
            assertEquals(owner.getCreatedDate(),user.getCreatedDate());
            assertEquals(owner.getLastModifiedBy(),user.getLastModifiedBy());
            assertEquals(owner.getLastModifiedDate(),user.getLastModifiedDate());
        });
    }

    public void updateUserWhenUserPresentTest(){
        PropertyRequest request = null;
        UserDetailResponse userDetailResponse = null;
        LinkedHashMap responseWithUser = new LinkedHashMap();
        ObjectMapper mapper = new ObjectMapper();
        try{
            request = getObject("src/test/PropertyRequest.json",PropertyRequest.class);
            File file = new File("src/test/resources/UserDetailResponse.json");
            responseWithUser = mapper.readValue(file, new TypeReference<Map<String, Object>>(){});
        }
        catch(Exception e){
            e.printStackTrace();
            fail();
        }
        when(serviceRequestRepositoryMock.fetchResult(any(StringBuilder.class),anyObject())).thenReturn((LinkedHashMap)SerializationUtils.clone(responseWithUser));
        userServiceMock.updateUser(request);

        userDetailResponse = mapper.convertValue(responseWithUser,UserDetailResponse.class);
        User user = userDetailResponse.getUser().get(0);
        request.getProperties().get(0).getPropertyDetails().get(0).getOwners().forEach(owner ->{
            assertEquals(owner.getUuid(),user.getUuid());
            assertEquals(owner.getCreatedBy(),user.getCreatedBy());
            assertEquals(owner.getCreatedDate(),user.getCreatedDate());
            assertEquals(owner.getLastModifiedBy(),user.getLastModifiedBy());
            assertEquals(owner.getLastModifiedDate(),user.getLastModifiedDate());
        });
    }


    private <T> T getObject(final String filepath,Class<T> className) throws IOException {
       final String propertRequestJson = new FileUtils().getFileContents(filepath);
       return new ObjectMapper().readValue(propertRequestJson, className);
    }

    /**
     * Parses date formats to long for all users in responseMap
     * @param responeMap LinkedHashMap got from user api response
     * @param dobFormat dob format (required because dob is returned in different format's in search and create response in user service)
     */
    private void parseResponse(LinkedHashMap responeMap,String dobFormat){
        List<LinkedHashMap> users = (List<LinkedHashMap>)responeMap.get("user");
        String format1 = "dd-MM-yyyy HH:mm:ss";
        users.forEach( map -> {
                    map.put("createdDate",dateTolong((String)map.get("createdDate"),format1));
                    map.put("lastModifiedDate",dateTolong((String)map.get("lastModifiedDate"),format1));
                    map.put("dob",dateTolong((String)map.get("dob"),dobFormat));
                    map.put("pwdExpiryDate",dateTolong((String)map.get("pwdExpiryDate"),format1));
                }
        );
    }

    /**
     * Converts date to long
     * @param date date to be parsed
     * @param format Format of the date
     * @return Long value of date
     */
    private Long dateTolong(String date,String format){
        SimpleDateFormat f = new SimpleDateFormat(format);
        Date d = null;
        try {
            d = f.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return  d.getTime();
    }

    public static<K,V> Map<K,V> clone(Map<K,V> original) {
        return original.entrySet()
                .stream()
                .collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue));
    }




}
