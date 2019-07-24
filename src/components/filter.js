import React from 'react';

export default class Filter extends React.Component {
	removeFilter = event => {
		let filter = {
			name: this.props.name,
			entry: this.props.entry,
		}
		this.props.onRemove(filter);
	}
	render() {
		return(
			<div className="SelectedFilterBox" onClick={this.removeFilter}>
				{this.props.inner}
			</div>
		)
	}
}