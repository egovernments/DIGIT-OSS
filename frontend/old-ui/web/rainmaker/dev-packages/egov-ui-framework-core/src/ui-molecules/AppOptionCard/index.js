import React from "react";
import {Button,Container,Item,Div,Icon} from "../../ui-atoms";
import {dashBoardOption} from "./spec";

const AppOptionCard=()=>{
  return(
    <Div>
    <Container>
      {
        dashBoardOption.map((item,key)=>{
          return (
            <Item {...item.itemProps} key={key}>
            <Button fullWidth={true} variant="extendedFab" aria-label={item.displayLabel} {...item.buttonProps}>
              <Icon iconName={item.iconName} {...item.IconProps}/>
              {item.displayLabel}
            </Button>
            </Item>
          )
        })
      }
    </Container>
    </Div>
  )
}

export default AppOptionCard;
