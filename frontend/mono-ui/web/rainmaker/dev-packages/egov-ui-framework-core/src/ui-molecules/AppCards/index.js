import React from "react";
import {Container,Item,Div} from "../../ui-atoms";
import AppCard from "../AppCard";

const AppCards=({appCards})=>{
  return(
    <Div>
      <Container>
        {
          appCards.map((item,key)=>{
            return (
              <Item {...item.itemProps} key={key}>
                <AppCard item={item}/>
              </Item>
            )
          })
        }
      </Container>
    </Div>
  )
}

export default AppCards;
