package org.egov.pg.web.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class RedirectController {

    @Value("${egov.default.citizen.url}")
    private String defaultURL;

    @Value("${paygov.original.return.url.key}")
    private String returnUrlKey;
    
    @Value("${paygov.citizen.redirect.domain.name}")
    private String citizenRedirectDomain;
    
    @PostMapping(value = "/transaction/v1/_redirect", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Object> method(@RequestBody MultiValueMap<String, String> formData, HttpServletRequest request) {
        HttpHeaders httpHeaders = new HttpHeaders();
        StringBuilder redirectURL = new StringBuilder();
        redirectURL.append(citizenRedirectDomain).append(formData.get(returnUrlKey).get(0));
        formData.remove(returnUrlKey);
        httpHeaders.setLocation(UriComponentsBuilder.fromHttpUrl(redirectURL.toString())
                .queryParams(formData).build().encode().toUri());
        return new ResponseEntity<>(httpHeaders, HttpStatus.FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleError(Exception e) {
        log.error("EXCEPTION_WHILE_REDIRECTING", e);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setLocation(UriComponentsBuilder.fromHttpUrl(defaultURL).build().encode().toUri());
        return new ResponseEntity<>(httpHeaders, HttpStatus.FOUND);
    }

}
