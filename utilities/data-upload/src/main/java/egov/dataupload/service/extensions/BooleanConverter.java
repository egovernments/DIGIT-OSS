package egov.dataupload.service.extensions;

import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class BooleanConverter implements Function<String, String>, Transformer  {

    @Override
    public String apply(String o) {
        if(o == null)
            return "";
        if(o.toLowerCase().contains("y"))
            return "true";
        else
            return "false";
    }

    @Override
    public String name() {
        return "toBool";
    }
}
