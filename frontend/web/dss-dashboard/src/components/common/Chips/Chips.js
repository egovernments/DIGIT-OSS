import React from 'react';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import { convertLabelValue } from '../../../utils/commons';

const useStyles = {
	root: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		'& span': {
			width: 'auto'
		}
	}
};

class Chips extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	}
	handleClick = () => {
		this.props.handleClick(this.props.index, this.props.tabName, this.props.value[0]);
	};

	render() {
		let { label, value, classes, fromScreen } = this.props;

		return (
			<div>
				{fromScreen && fromScreen === 'TableChart' ? (
					<Chip
						className={classes.root}
						variant="outlined"
						size="small"
						// avatar={<Avatar>{label ? label : ''}</Avatar>}
						label={` ${label&&label!="" ? convertLabelValue(label) +' : ' : ''}${value[4]}`}
						style={{ width: 'max-content' }}
						clickable
						onDelete={this.handleClick}
						onClick={this.handleClick}
					/>
				) : (
						<Chip
							className={classes.root}
							variant="outlined"
							size="small"
							// avatar={<Avatar>{label ? label : ''}</Avatar>}
							label={` ${label&&label!="" ? convertLabelValue(label) +' : ' : ''}${value[4]}`}
							clickable
							onDelete={this.handleClick}
							onClick={this.handleClick}
						/>
					)}
			</div>
		);
	}
}

export default withStyles(useStyles)(Chips);
