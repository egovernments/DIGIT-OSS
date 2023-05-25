import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

class CircularIndeterminate extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                {this.props.apistatus.progress && <div style={{
                    position: 'fixed',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: 0.7
                }}>
                    <CircularProgress size={80} style={{
                        position: 'relative',
                        textAlign: 'center',
                        top: '40%',
                        color:"#fe7a51"
                    }} />
                </div>
                }
            </div>

        );
    }

} 

const mapStateToProps = (state) => ({
    apistatus: state.apistatus

});

export default connect(mapStateToProps)(CircularIndeterminate);
