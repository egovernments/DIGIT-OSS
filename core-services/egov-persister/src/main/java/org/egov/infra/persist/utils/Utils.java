package org.egov.infra.persist.utils;

import com.github.zafarkhaja.semver.UnexpectedCharacterException;
import com.github.zafarkhaja.semver.Version;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

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
            if(version == null || version.equals(""))
                return defaultSemVer;
            else
                return Version.valueOf(version);
        }catch (UnexpectedCharacterException e){
            return defaultSemVer;
        }
    }
}