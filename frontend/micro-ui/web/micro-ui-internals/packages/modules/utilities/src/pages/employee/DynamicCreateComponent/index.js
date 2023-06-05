import { Loader,FormComposerV2 as FormComposer } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const CreateProject = () => {
  const { t } = useTranslation();
  const stateTenant = Digit.ULBService.getStateId();
  const { moduleName, masterName } = useParams();

  const { isLoading, data: configs } = Digit.Hooks.useCustomMDMS(
    //change to data
    stateTenant,
    moduleName,
    [
      {
        name: masterName,
      },
    ],
    {
      select: (data) => {
        return data?.[moduleName]?.[masterName]?.[0];
      },
    }
  );

  if (isLoading) return <Loader />;
  return (
    <React.Fragment>
      <Header styles={{ fontSize: "32px" }}>{t("CREATE")}</Header>

      <FormComposer
        label={"WORKS_CREATE_PROJECT"}
        config={configs?.form?.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={() => {}}
        submitInForm={false}
        fieldStyle={{ marginRight: 0 }}
        inline={false}
        className="form-no-margin"
        defaultValues={{}}
        cardClassName="mukta-header-card"
      />
    </React.Fragment>
  );
};

export default CreateProject;
