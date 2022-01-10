package com.ingestpipeline.testcases;
 
import java.util.LinkedHashMap;
import java.util.List;

import com.ingestpipeline.consumer.DigressionConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;
 

public class IngestTestClient {
 
    public static final String REST_SERVICE_URI = "http://localhost:8081/ingest/api";
    public static final Logger LOGGER = LoggerFactory.getLogger(IngestTestClient.class);


    /* GET */
    @SuppressWarnings("unchecked")
    private static void listAllUsers(){
        RestTemplate restTemplate = new RestTemplate();
        List<LinkedHashMap<String, Object>> usersMap = restTemplate.getForObject(REST_SERVICE_URI+"/user/", List.class);
         
        if(usersMap!=null){
            for(LinkedHashMap<String, Object> map : usersMap){
                LOGGER.info("User : id="+map.get("id")+", Name="+map.get("name")+", Age="+map.get("age")+", Salary="+map.get("salary"));;
            }
        }else{
            LOGGER.info("No user exist----------");
        }
    }
     
    /* DELETE */
    private static void deleteUser() {
        System.out.println("Testing delete User API----------");
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.delete(REST_SERVICE_URI+"/user/3");
    }
 
 
    /* DELETE */
    private static void deleteAllUsers() {
        System.out.println("Testing all delete Users API----------");
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.delete(REST_SERVICE_URI+"/user/");
    }
 
    public static void main(String args[]){
        listAllUsers();
        listAllUsers();
        listAllUsers();
        //deleteUser();
        listAllUsers();
        //deleteAllUsers();
        listAllUsers();
    }
}