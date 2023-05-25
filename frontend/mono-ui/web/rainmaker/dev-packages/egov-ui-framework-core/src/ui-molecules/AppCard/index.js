import React from "react";
import { Button, Icon,Div,Container,Item ,Typegraphy} from "../../ui-atoms";
import "./index.css";

const AppCard = ({item}) => {
  return (
    <Button
      fullWidth={true}
      variant="extendedFab"
      aria-label={item.displayLabel}
      {...item.buttonProps}
      className="mihy-app-card"
    >
      <Container>
        <Item xs={3} sm={4}>
          <Div className="mihy-left-icon-style" style={{
            backgroundImage:`url(${item.iconImgae})`,
            backgroundSize:"cover"
          }}>

          </Div>
        </Item>
        <Item xs={9} sm={8}>
        <Div className="mihy-app-right-section">
          <Typegraphy variant="body2" className="mihy-black-color" align="left">{item.displayLabel}</Typegraphy>
          <Typegraphy variant="caption" className="mihy-black-color" align="left">{item.displaySubLabel}</Typegraphy>
        </Div>
        </Item>
      </Container>
      {/*<Icon iconName={item.iconName} {...item.IconProps} />*/}
    </Button>
  );
};

export default AppCard;
