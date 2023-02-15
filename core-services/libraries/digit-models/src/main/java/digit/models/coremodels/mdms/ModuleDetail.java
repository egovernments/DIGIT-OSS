package digit.models.coremodels.mdms;

import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleDetail {

    @NotNull
    @Size(max=256)
    private String moduleName;

    private List<MasterDetail> masterDetails;

}