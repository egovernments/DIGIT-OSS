import React from 'react';
// import PropTypes from 'prop-types';
import CardMedia from '@material-ui/core/CardMedia';


const SimpleCardMedia=(props)=> {
  const {...rest } = props;
  return (
      <CardMedia {...rest}/>
  );
}

// SimpleCardMedia.propTypes = {
//
// };

export default SimpleCardMedia;
