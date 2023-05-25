package egov.dataupload.service.extensions;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.function.Function;

@Service
public class EpochConverter implements Function<String, Object>, Transformer {

    private DateTimeFormatter dtf  = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public Object apply(String o) {
        try {
            o = o.replaceAll("-", "/");
            LocalDate date = LocalDate.parse(o.trim(), dtf);
            ZoneId zoneId = ZoneId.systemDefault();
            return date.atStartOfDay(zoneId).toInstant().toEpochMilli();
        }catch (DateTimeParseException e){
            return o;
        }
    }

    @Override
    public String name() {
        return "toEpoch";
    }
}
