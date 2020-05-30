package egov.dataupload.service.extensions;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.function.Function;

@Service
public class EpochConverter implements Function<String, Long>, Transformer {

    private DateTimeFormatter dtf  = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Override
    public Long apply(String o) {
        o = o.replaceAll("-", "/");
        LocalDate date  = LocalDate.parse(o.trim(), dtf);
        ZoneId zoneId = ZoneId.systemDefault();
        return date.atStartOfDay(zoneId).toInstant().toEpochMilli();
    }

    @Override
    public String name() {
        return "toEpoch";
    }
}
