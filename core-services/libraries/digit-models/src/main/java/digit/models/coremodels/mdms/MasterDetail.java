package digit.models.coremodels.mdms;

import lombok.*;

import javax.validation.constraints.Size;

@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MasterDetail {
    @Size(max=256)
    private String name;

    private String filter;
}
