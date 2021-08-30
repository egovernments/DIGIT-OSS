import React from "react";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";

const Wrapper = ({ imports, component, code, children }) => (
  <Card>
    <CardHeader title={component} subtitle="code" actAsExpander={true} showExpandableButton={true} />
    <CardActions>{children}</CardActions>
    <CardText expandable={true}>
      <Card>
        <CardHeader title="Code" />
        <CardText>
          <code>
            <div>{`import React from "react";`}</div>
            {imports.map((item, index) => {
              return (
                <div>
                  {item}
                  <br />
                </div>
              );
            })}
            <br />

            <div>
              {`const ${component}Demo=()=>(`}
              <br />
              {code}
              <br />
              {")"}
              <br />
              {`export default ${component}Demo;`}
            </div>
          </code>
        </CardText>
      </Card>
    </CardText>
  </Card>
);

export default Wrapper;
