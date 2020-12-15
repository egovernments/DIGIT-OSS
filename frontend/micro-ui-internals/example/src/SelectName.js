import { FormStep } from "@egovernments/digit-ui-react-components"

const SelectName = ({ config, onSelect, onSkip, t }) => {
  return <FormStep config={config} onSelect={onSkip} t={t}></FormStep>
}

export default SelectName;