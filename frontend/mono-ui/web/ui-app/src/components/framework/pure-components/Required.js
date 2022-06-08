/**
 * Created by narendrasisodiya on 14/12/17.
 */

import React from 'react';
import Red from './Red';

export default function Required(props) {
  if (props.value === true) {
    return <Red>*</Red>;
  } else {
    return <span />;
  }
}
