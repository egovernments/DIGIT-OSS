import PropTypes from 'prop-types'
import React from 'react';
import createReactClass from 'create-react-class';
import './index.css';

let is_mounted = false;

const CountdownTimer = createReactClass({

    displayName: 'CountDownTimer',
    is_mounted: false,

    propTypes: {
        timeLeft: PropTypes.number.isRequired,
        interval: PropTypes.number
    },

    getDefaultProps: function () {
        return {
            interval: 1000
        };
    },

    getInitialState: function () {
        return {
            timeRemaining: this.props.timeLeft,
        };
    },

    componentDidMount: function () {
        is_mounted = true;
        this.startTimer();
    },


    componentDidUpdate: function () {
        if ((!this.state.prevTime) && this.state.timeRemaining > 0 && is_mounted) {
            this.startTimer();
        }
    },

    componentWillUnmount: function () {
        clearTimeout(this.state.timeoutId);
    },

    startTimer: function () {
        const currentTime = Date.now();
        const differenceInTime = this.getDifferenceInTime(currentTime)
        const interval = this.props.interval;
        const timeRemainingInInterval = this.getTimeRemainingInInterval(interval, differenceInTime);
        let timeout = timeRemainingInInterval;
        if (timeRemainingInInterval < (interval / 2.0)) {
            timeout += interval;
        }
        const timeRemaining = this.getTimeRemaining(differenceInTime);
        const countdownComplete = (this.state.prevTime && timeRemaining <= 0);
        if (is_mounted) {
           this.setCurrentState(countdownComplete, timeout, currentTime, timeRemaining);
        }
        if (countdownComplete && this.props.completeCallback) {
            this.props.completeCallback();
            return;
        }
        if (this.props.tickCallback) {
            this.props.tickCallback(timeRemaining);
        }
    },

    getDifferenceInTime: function(currentTime) {
        return (this.state.prevTime ? (currentTime - this.state.prevTime) : 0);
    },

    getTimeRemainingInInterval: function(interval, differenceInTime) {
        return (interval - (differenceInTime % interval));
    },

    getTimeRemaining: function(differenceInTime) {
        return (Math.max(this.state.timeRemaining - differenceInTime, 0));
    },

    setCurrentState: function(countdownComplete, timeout, currentTime, timeRemaining){
        if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
        this.setState({
            timeoutId: countdownComplete ? null : setTimeout(this.startTimer, timeout),
            prevTime: currentTime,
            timeRemaining: timeRemaining
        });
    },

    getFormattedTime: function (milliseconds) {

        const totalSeconds = Math.round(milliseconds / 1000);
        const finalTime=totalSeconds;
        return finalTime;
    },

    render: function () {
        const timeRemaining = this.state.timeRemaining;
        return (
            <div className ="timer-wrapper">
                <div className='displayTime'>
                    {this.getFormattedTime(timeRemaining)}
                </div>
            </div>
        );
    }
});

export default CountdownTimer;