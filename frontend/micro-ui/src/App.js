import PGRApp from "@egovernments/digit-ui-module-pgr";
import { Body, TopBar } from "@egovernments/digit-ui-react-components";

function App() {
  return (
    <>
      <Body>
        <TopBar />
        <PGRApp stateCode="pb" cityCode="pb.amritsar" moduleCode="PGR" />
      </Body>
    </>
  );
}

export default App;
