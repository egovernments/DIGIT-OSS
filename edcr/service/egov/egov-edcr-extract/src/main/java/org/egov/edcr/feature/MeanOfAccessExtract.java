package org.egov.edcr.feature;

import java.util.HashMap;

import org.apache.log4j.Logger;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.utility.DcrConstants;
import org.egov.edcr.utility.Util;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
public class MeanOfAccessExtract extends FeatureExtract {
    private static final Logger LOG = Logger.getLogger(MeanOfAccessExtract.class);

    private static final String ACCESS_WIDTH = "Access Width";

    public static final String OCCUPANCY = "occupancy";

    @Override
    public PlanDetail extract(PlanDetail pl) {
        LOG.info(pl.getPlanInformation().getAccessWidth());
        return pl;
    }

    public PlanDetail validateAccessWidth(PlanDetail pl) {
        HashMap<String, String> errors = new HashMap<>();
        if (pl.getPlanInformation() != null && pl.getPlanInformation().getAccessWidth() == null) {
            errors.put(ACCESS_WIDTH,
                    edcrMessageSource.getMessage(DcrConstants.OBJECTNOTDEFINED,
                            new String[] { ACCESS_WIDTH }, LocaleContextHolder.getLocale()));
            pl.addErrors(errors);
        }
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        boolean extemption = Util.isSmallPlot(pl);
        if (!extemption)
            validateAccessWidth(pl);
        return pl;
    }
}
