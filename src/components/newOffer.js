import React from 'react';
import '../styles/newOffer.scss';
import API from '../utils/API.js';


export default class NewOffer extends React.Component {
	constructor() {
		super();
		this.state = {
			role: React.createRef(),
			title: React.createRef(),
			content: React.createRef(),
			startDate: React.createRef(),
			endDate: React.createRef(),
			ownerId: React.createRef(),
			active: React.createRef(),
			locations: [],
			selectedLocations: [],
			locationsList: [],
			activity: [],
			selectedActivity: [],
			activityList: [],
			button: '',
			id: '',
			head: '',
			path: '',
		}
	}

		handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

		onSearch = event => {
			let that = this;
			let table = event.target.name;
			if (event.target.value.length > 0) {
			API.wordResearch({table: table, word: event.target.value})
			.then(data => {
				if(!data.data.length) {
					let response = <p key="1" value={data.data.id} name={table} onClick={that.onSelect}>{data.data.name} ({data.data.code})</p>;
					this.setState({[table]: response});
				}
				else {
					let response = data.data.map(function(item, i){
						return(<p key={i} value={item.id} name={table} onClick={that.onSelect}>{item.name} ({item.code})</p>);
					});
					this.setState({[table]: response});
				}
			});
			}
			else this.setState({[table]: []});
		}

		onSelect = event => {
			let name = event.target.getAttribute('name');
			let list = this.state['selected'+name.charAt(0).toUpperCase() + name.slice(1)];
			let inner = event.target.innerHTML.split(' ');
			let selectedBox = <p key={event.target.getAttribute('value')} value={event.target.getAttribute('value')} name={name} onClick={this.onDelete}>{inner[0] + ' ' + inner[1].slice(0, 3)})</p>
			list[event.target.getAttribute('value')] = selectedBox;
			this.setState({[name]: list}, () => {this.setState({[name]: []})});
		}

		onDelete = event => {
			let name = event.target.getAttribute('name');
			let list = this.state['selected'+name.charAt(0).toUpperCase() + name.slice(1)];
			delete list[event.target.getAttribute('value')];
			this.setState({['selected'+name.charAt(0).toUpperCase() + name.slice(1)]: list});
		}

		handleSubmit = event => {
			delete this.state.locations;
			delete this.state.activity;
			delete this.state.button;
			let selectedLocations = {};
			this.state.selectedLocations.forEach(function(item){
			if (item.key) selectedLocations[item.key] = {id: item.key};
			else return;
			})
			let selectedActivity = {};
			this.state.selectedActivity.forEach(function(item){
			if (item.key) selectedActivity[item.key] = {id: item.key};
			else return; 
			})
			this.setState({locationsList: selectedLocations, activityList: selectedActivity}, () => {
				delete this.state.selectedLocations;
				delete this.state.selectedActivity;
				if (this.props.match.params.id){
					API.updateOffer(this.state).then(data => {console.log(data)});
				}
				else API.addOffer(this.state)
						.then(data => {console.log(data)})
						.catch(err => {console.log(err)});
			})
		}

		componentWillMount() {
			let that = this;
			let body = {id: this.props.match.params.id, type: this.props.user.role}
			if (body.id) {
				API.getOffer(body)
					.then( (data) => {
						let states = {}
						for (let prop in data.data[0]) {
							data.data[0][prop] = (prop === "startDate" || prop === "endDate")? data.data[0][prop].slice(0, 10): data.data[0][prop];
							states[prop] = data.data[0][prop]
						}
						states['selectedLocations'] = [];
						if (data.data[1].length) { 
							data.data[1].map(function(item, i){
								return states.selectedLocations[item.locationId] = <p key={item.locationId} value={item.locationId} name='locations' onClick={that.onDelete}>{item.name + ' ' + item.code.slice(0, 3)})</p>
							});
					    }
					    else states['selectedLocations'][data.data[1].locationId] = <p key={data.data[1].locationId} value={data.data[1].locationId} name='locations' onClick={that.onDelete}>{data.data[1].name + ' ' + data.data[1].code.slice(0, 3)})</p>
						states['selectedActivity'] = [];
						if (data.data[2].length) {
								data.data[2].map(function(item, i){
								return states.selectedActivity[item.activityId] = <p key={item.activityId} value={item.activityId} name='activity' onClick={that.onDelete}>{item.name + ' '})</p>
							});
						}
						else states['selectedActivity'][data.data[2].activityId] = <p key={data.data[2].activityId} value={data.data[2].activityId} name='activity' onClick={that.onDelete}>{data.data[2].name + ' '})</p> 
						states['button'] = "Update";
						states['role'] = this.props.user.role;
						states['id'] = body.id;
						states['head'] = 'Update Offer';
						states['path'] = window.location.pathname;
						this.setState(states);						
					})
					.catch(err => {console.log(err)});
			}
			else {
				let state = {
					role: this.props.user.role,
					title: '',
					content: '',
					startDate: '',
					endDate: '',
					ownerId: this.props.user.id,
					active: '',
					button: 'Add Offer',
					head: 'New Offer',
					path: window.location.pathname,
				}
				this.setState(state)
			}
		}

		componentDidUpdate() {
			if (this.state.path !== window.location.pathname) document.location.reload();
		}

		render() {
		return(
			<div id="NewOffer">
				<form method="POST" className="Form FormNewOffer"  autoComplete="off">
					<h3 className="FormMasterFontSet">{this.state.head}</h3>
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
                	<div className="FormButton" onClick={this.handleSubmit}>{this.state.button}</div>
				</form>
			</div>
		)
	}
}