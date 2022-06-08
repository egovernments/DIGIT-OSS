import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const YesOrNoDialog = props => {
  const actions = [
    <FlatButton label={props.yesBtnTxt} primary={true} onClick={props.handleYes} />,
    <FlatButton label={props.noBtnTxt} primary={true} onClick={props.handleNo} />,
  ];

  return (
    <Dialog title={props.title || null} actions={actions} modal={false} open={props.show} onRequestClose={props.handleNo || null}>
      {props.msg}
    </Dialog>
  );
};

export default YesOrNoDialog;
