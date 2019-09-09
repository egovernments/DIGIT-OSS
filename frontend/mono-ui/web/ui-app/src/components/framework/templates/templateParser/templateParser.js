import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import * as Templates from '../templates/index';
import UiBackButton from '../../components/UiBackButton';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class TemplateParser extends Component {
  constructor(props) {
    super(props);
  }

  printTemplate = () => {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    var cdn = `
	      <!-- Latest compiled and minified CSS -->
	      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

	      <!-- Optional theme -->
	      <link rel="stylesheet" media="all" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">  `;
    mywindow.document.write('<html><head><title> </title>');
    mywindow.document.write(cdn);
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('printTemplate').innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);
  };

  back = e => {
    let { setRoute } = this.props;
    setRoute('/' + localStorage.getItem('returnUrl'));
  };

  render() {
    const Template = Templates[this.props.match.params.templatePath];
    let { back } = this;
    return (
      <div>
        <div id="printTemplate">
          <div className="myPage">
            {localStorage.reportData
              ? JSON.parse(localStorage.reportData).map((v, i) => {
                  return (
                    <div>
                      <div
                        style={{
                          textAlign: 'right',
                          paddingRight: '15px',
                        }}
                      >
                        <br />
                        <RaisedButton
                          type="button"
                          onClick={e => {
                            back(e);
                          }}
                          primary={true}
                          label={'Back'}
                        />
                        <br />
                        <br />
                      </div>
                      <Template data={v} />
                      <br />
                      <div style={{ 'page-break-after': 'always' }} />
                    </div>
                  );
                })
              : ''}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <RaisedButton label={'Print'} primary={true} onClick={this.printTemplate} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TemplateParser));
