package org.egov.url.shortening.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.egov.url.shortening.model.ShortenRequest;
import org.egov.url.shortening.service.URLConverterService;
import org.egov.url.shortening.validator.URLValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@Slf4j
@RestController
public class ShortenController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ShortenController.class);
    private final URLConverterService urlConverterService;

    public ShortenController(URLConverterService urlConverterService) {
        this.urlConverterService = urlConverterService;
    }

    @RequestMapping(value = "/shortener", method=RequestMethod.POST, consumes = {"application/json"})
    public String shortenUrl(@RequestBody @Valid final ShortenRequest shortenRequest,
                             @RequestHeader Map<String,String> headers) throws Exception {
        log.info(headers.toString());
        // ULB specific tenantId
        String ulbSpecificTenantId = headers.get("tenantid");
        // Extracting state specific tenantId from ULB level tenant
        String tenantId = ulbSpecificTenantId.split("\\.")[0] + "." + ulbSpecificTenantId.split("\\.")[1];
        String longUrl = shortenRequest.getUrl();
        if (URLValidator.INSTANCE.validateURL(longUrl)) {
            String shortenedUrl = urlConverterService.shortenURL(shortenRequest, tenantId);
            return shortenedUrl;
        }
        throw new CustomException("URL_SHORTENING_INVALID_URL","Please enter a valid URL");
    }

    @RequestMapping(value = "/{id}", method=RequestMethod.GET)
    public RedirectView redirectUrl(@PathVariable String id, HttpServletRequest request) throws IOException, URISyntaxException, Exception {
        String redirectUrlString = urlConverterService.getLongURLFromID(id);
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(redirectUrlString);
        return redirectView;
    }
}



