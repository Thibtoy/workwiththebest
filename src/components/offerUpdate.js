import React from 'react';

export default class OfferUpdate extends React.Component {
	componentWillMount() {
		console.log(this.props.match.params.id);
	}

	
	render() {
		return(
			<div id="NewOffer">
				<form method="POST" className="Form FormNewOffer"  autoComplete="off">
					<h3 className="FormMasterFontSet">New Offer</h3>
					<div className="FormRowContainer">
						<div className="FormInputContainer">
							<div className="FormGroupLabel">
                				<label htmlFor="title">Title</label>
                				<input className="FormInput" name="title" type="title" value={this.state.title} onChange={this.handleChange}/>
                			</div>
                			<div className="FormGroupLabel">
                				<label htmlFor="content">Content</label>
                				<textarea className="FormTextArea" name="content" type="text" value={this.state.content} onChange={this.handleChange}/>
                			</div>
                			<div className="FormGroupLabel">
                				<label htmlFor="startDate">Start Date:</label>
                				<input className="FormInput" name="startDate" type="date" value={this.state.startDate} onChange={this.handleChange}/>
                			</div>
                			<div className="FormGroupLabel">	
                				<label htmlFor="endDate">End Date:</label>
                				<input className="FormInput" name="endDate" type="date" value={this.state.endDate} onChange={this.handleChange}/>
                			</div>
                		</div>
                		<div className="FormInputContainer">
                			<div className="FormGroupLabel">
                				<label htmlFor="research" type="text">Location</label>
                				<div className="FormSearchBox">
                					<input className="FormInput" name="locations" type="text" placeholder="Search a location" onChange={this.onSearch} />
                					<div id="locationList" className="FormDropDownList" name="locationList">{this.state.locations}</div>
               					</div>
               					<div id="Location" className="FormListSelection">{this.state.selectedLocations}</ div>
                			</div>
                			<div className="FormGroupLabel">
                				<label htmlFor="research" type="text">Activity</label>
                				<div className="FormSearchBox">
                					<input className="FormInput" name="activity" type="text" placeholder="Search an activity" onChange={this.onSearch} />
                					<div id="activityList" className="FormDropDownList" name="activityList">{this.state.activity}</div>
               					</div>
               					<div id="Activity" className="FormListSelection">{this.state.selectedActivity}</ div>
                			</div>
                		</div>
                	</div>
                	<div className="FormButton" onClick={this.handleSubmit}>Add Offer</div>
				</form>
			</div>
		)
	}
}