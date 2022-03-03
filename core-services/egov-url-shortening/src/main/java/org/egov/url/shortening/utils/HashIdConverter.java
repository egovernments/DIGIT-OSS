package org.egov.url.shortening.utils;

import org.hashids.Hashids;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class HashIdConverter {

    @Value("${hashids.salt}")
    private String salt;
    @Value("${hsahids.min.length}")
    private Integer minimumLength;

    private Hashids hashids;

    @PostConstruct
    public void init() {
        hashids = new Hashids(salt, minimumLength);
    }

    public String createHashStringForId(Long id) {
        return hashids.encode(id);
    }

    public Long getIdForString(String string) {
        long[] ids = hashids.decode(string);
        if(ids.length == 1)
            return ids[0];
        return null;

    }

}