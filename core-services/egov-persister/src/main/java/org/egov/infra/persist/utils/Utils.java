package org.egov.infra.persist.utils;

import com.github.zafarkhaja.semver.UnexpectedCharacterException;
import com.github.zafarkhaja.semver.Version;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Slf4j
@Component
public class Utils {

    private Version defaultSemVer;

    @Value("${default.version}")
    private String defaultVersion;

    @PostConstruct
    private void init(){
        defaultSemVer = Version.valueOf(defaultVersion);
    }

    public Version getSemVer(String version) {
        try {
            if(version == null || version.equals("")) {
                log.info("Version not present in API request, falling back to default version: " + defaultVersion);
                return defaultSemVer;
            }
            else {
                log.info("Version present in API request is: " + version);
                return Version.valueOf(version);
            }
        }catch (UnexpectedCharacterException e){
            return defaultSemVer;
        }
    }
}