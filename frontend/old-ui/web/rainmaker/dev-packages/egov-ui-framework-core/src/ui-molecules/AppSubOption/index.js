import React from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Item,
  Div,
  Typegraphy
} from "../../ui-atoms";
import "./index.css";

const AppCarosel = ({ item }) => {
  return (
    <Container>
      <Item xs={1} sm={6}/>
      <Item xs={10} sm={6}>
        <Button
          fullWidth={true}
          variant="extendedFab"
          className="mihy-app-sub-option-card"
        >
          <Container>
            <Item xs={6}>
              <Div className="mihy-app-sub-option-left-image" style={item.itemImage?{
                backgroundImage:`url(${item.itemImage})`,
                backgroundSize:"cover"
              }:{}}/>
            </Item>
            <Item xs={6}>
            <Div>
              <Typegraphy variant="body2" className="mihy-black-color" align="left">{item.displayLabel}</Typegraphy>
              <Typegraphy variant="caption" className="mihy-black-color" align="left" style={{marginTop:"16px"}}>{item.displaySubLabel}</Typegraphy>
            </Div>
            <Div className="mihy-app-sub-option-right-icon" style={item.itemImage?{
              backgroundImage:`url(${item.itemImage})`,
              backgroundSize:"cover"
            }:{}}/>
            </Item>
          </Container>
        </Button>
      </Item>
      <Item xs={1} sm={6}/>
    </Container>
  );
};

export default AppCarosel;
