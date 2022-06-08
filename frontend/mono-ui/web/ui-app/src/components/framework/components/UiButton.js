import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: '0 4px',
};

const UiButton = props => {
  const renderBtn = () => {
    const { item, icon, ui } = props;
    switch (ui) {
      case 'google':
        return (
          <RaisedButton
            icon={icon}
            style={style}
            id={item.label.split('.').join('-')}
            type={item.uiType || 'button'}
            label={item.label}
            primary={typeof item.primary != 'undefined' ? item.primary : true}
            secondary={item.secondary || false}
            onClick={props.handler || function() {}}
            disabled={item.isDisabled ? true : false}
          />
        );
    }
  };

  return renderBtn();
};

export default UiButton;
