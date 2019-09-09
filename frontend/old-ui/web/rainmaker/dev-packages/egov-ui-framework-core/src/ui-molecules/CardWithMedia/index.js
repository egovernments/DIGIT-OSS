import React from "react";
// import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Container,
  Item,
  Typegraphy
} from "../../ui-atoms";
const styles = theme => ({
  cover: {
    height: "100%"
  }
});

function CardWithMadia(props) {
  const { classes, cardContent, cardMedia, heading } = props;
  const { src, title } = cardMedia;
  return (
    <div>
      <Card>
        <Container>
          <Item xs={12} sm={4}>
            <CardMedia className={classes.cover} image={src} title={title} />
          </Item>
          <Item xs={12} sm={8}>
            <CardContent>
              <Typegraphy variant="display1" gutterBottom>
                {heading}
              </Typegraphy>
              <ul>
                {cardContent.map((item, key) => {
                  return (
                    <li key={key}>
                      <Typegraphy variant="headline" gutterBottom>
                        {item}
                      </Typegraphy>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Item>
        </Container>
      </Card>
    </div>
  );
}

// CardWithMadia.propTypes = {};

export default withStyles(styles, { withTheme: true })(CardWithMadia);
