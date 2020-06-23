package org.egov.chat.service;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import me.xdrop.fuzzywuzzy.FuzzySearch;
import org.apache.commons.lang.StringUtils;
import org.junit.Ignore;
import org.junit.Test;

import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.List;

@Slf4j
public class FixedSetValuesTest {

    @Test
    public void testArrayNodeToList() throws IOException {

        ObjectMapper objectMapper = new ObjectMapper(new JsonFactory());

        String question = "{\"allValues\":[\"qwe\",\"asd\",\"zxc\"],\"askedValues\":[\"qwe\",\"asd\"]}";
        JsonNode questionDetails = objectMapper.readTree(question);

        List<String> validValues = objectMapper.readValue(questionDetails.get("askedValues").toString(), List.class);

        log.info(String.valueOf(validValues));

    }

    @Ignore
    @Test
    public void testIntegerValuesForDifferentLocales() throws ParseException {
        NumberFormat nf = NumberFormat.getInstance();
        System.out.println(nf.parse("३३"));
        System.out.println(Integer.parseInt("३३"));
        System.out.println( StringUtils.isNumeric("३३ ".trim()) );
    }

    @Test
    public void testFuzzySearchMatch() {
        int match = FuzzySearch.ratio  ("Back Side 33 KVA Grid Patiala Road", "3");
        log.info("Match : " + match);
        match = FuzzySearch.partialRatio  ("Back Side 33 KVA Grid Patiala Road", "3");
        log.info("Match : " + match);
    }

    @Test
    public void testFuzzyMatchHindi() {
        String s1 = "अमृतसर";
        String s2 = "अमतसर";
        int match = FuzzySearch.ratio(s1, s2);
        System.out.println(match);
    }

}