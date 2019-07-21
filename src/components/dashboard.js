import React from 'react';
import Carrousel from './carrousel.js';
import Offer from './offer.js';
import API from '../utils/API.js';
import Loading from './loading.js';

import '../styles/dashboard.scss';

export default class Dashboard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			offers : [],
			carrouselLoaded: false,
			offersLoaded: false,
			where: {
				active: 1,
				'locations.id': [],
				'activity.id': [],
				'districts.id': [],
				'activityTitle.id': [],
			},
			filters: {
				'locations.id': [],
				'activity.id': [],
				'districts.id': [],
				'activityTitle.id': [],
			},
			locations: [],			
			activity: [],
			districts: [],
			activityTitle: [],
			key: 0,
			filtersKey: 0,
		}
		this.fillDashboard = this.fillDashboard.bind(this);
		this.switchConditions = this.switchConditions.bind(this);
	}

	componentWillMount(){
		document.body.style.background = 'linear-gradient(#CCCCCC, white)';
		document.body.style.height = 'auto';
		this.switchConditions();	
	}

	onSearch = event => {//Fonction qui gére la barre de recherches
		let that = this;
			let table = event.target.name;
			if (event.target.value.length > 0) {
			API.wordResearch({table: table, word: event.target.value})
			.then(data => {
				if(!data.data.length) data.data = [data.data];
				let response = data.data.map(function(item, i){
					if (item.code) return(<p key={i} value={item.id} name={table+'.id'} onClick={that.onSelect}>{item.name}-({item.code})</p>);
					else return(<p key={i} value={item.id} name={table+'.id'} onClick={that.onSelect}>{item.name}</p>);
				});
				this.setState({[table]: response});
			})
			.catch();
			}
			else this.setState({[table]: []});
		}

	onSelect = event => {
		let state = this.state;
		let target = event.target 
		state.filters[target.getAttribute('name')].push(
			<div key={state.filtersKey} entry={target.getAttribute('value')} name={target.getAttribute('name')} onClick={this.removeFilter}>
				{target.innerHTML}
			</div>
			);
		state.filters[target.getAttribute('name')].forEach(function(item){
			if (state.where[item.props.name].indexOf(item.props.entry) === -1) state.where[item.props.name].push(item.props.entry); 
		});
		state.filtersKey++
		this.setState(state, () => {
			this.switchConditions();
		});		
	}

	removeFilter = event => {
		let state = this.state;
		let target = event.target;
		let index = state.where[target.getAttribute('name')].indexOf(target.getAttribute('entry'));
		state.where[target.getAttribute('name')].splice(index, 1);
		state.filters[target.getAttribute('name')].forEach(function(item, i){
			if (item.props.name === target.getAttribute('name') && item.props.entry === target.getAttribute('entry')){
				state.filters[target.getAttribute('name')].splice(i, 1);
			}
		});
		this.setState(state, () => {
			this.switchConditions()
		});
	}

	switchConditions() {
		let type = this.props.user.role;
		switch (type) {
				case 'users': return this.fillDashboard({tables: ['companies'], where: this.state.where});
				case 'companies': return this.fillDashboard({tables: ['users'], where: this.state.where});
				default: return this.fillDashboard({tables: ['users', 'companies'], where: this.state.where});
			}
	}

	fillDashboard(body) {
		let that = this;
		let key = this.state.key;
		API.dashboard(body).then(res => {
			if (res.data) {
				let offers = res.data.map(function(item){
					if (item) {
						if (!item.length) item = [item];
						return item.map(function(item, i){
							item.startDate = item.startDate.slice(0, 10)+" "+item.startDate.slice(11, 19);
							item.endDate = item.endDate.slice(0, 10)+" "+item.endDate.slice(11, 19);
							if (!item.name) {
								item.name = item.firstName+' '+item.lastName;
								delete item.firstName;
								delete item.lastName;
							}
						return(<Offer key={i} data={item} />)
						});
					}
					else {
						key++
						return(<div key={key} style={{display: 'none'}}></div>);
					}
				});
			that.setState({offers, offersLoaded: true, key});
			}
		})
		.catch();	
	}

	render() {
	if (this.state.offersLoaded) {
		let state = this.state;
		let filters = [];
		for (let field in state.filters){
			let filter = state.filters[field].map(function(item){
				return [item];
			});
			filters.push(filter);
		}
		let test = [
			<div key={1} className="FormGroupLabel">
                <label htmlFor="research" type="text">Location</label>
                <div className="FormSearchBox">
                	<input className="FormInput" name="locations" type="text" placeholder="Search a location" onChange={this.onSearch} />
                	<div id="locationList" className="FormDropDownList" name="locationList">{state.locations}</div>
               	</div>
            </div>
		]
		return(
			<div id="Dashboard">
				<Carrousel user={this.props.user} />
				<div id="DashboardOffersBoard">
					<div id="InputList">
						<div className="FormInputContainer">
                			{test}
                			<div className="FormGroupLabel">
                				<label htmlFor="research" type="text">Activity</label>
                				<div className="FormSearchBox">
                					<input className="FormInput" name="activity" type="text" placeholder="Search an activity" onChange={this.onSearch} />
                					<div id="activityList" className="FormDropDownList" name="activityList">{state.activity}</div>
               					</div>
                			</div>
                		</div>
                		<div className="FormInputContainer">
                			<div className="FormGroupLabel">
                				<label htmlFor="research" type="text">District</label>
                				<div className="FormSearchBox">
                					<input className="FormInput" name="districts" type="text" placeholder="Search a district" onChange={this.onSearch} />
                					<div id="districtList" className="FormDropDownList" name="districtList">{state.districts}</div>
               					</div>
                			</div>
                			<div className="FormGroupLabel">
                				<label htmlFor="research" type="text">Activity type</label>
                				<div className="FormSearchBox">
                					<input className="FormInput" name="activityTitle" type="text" placeholder="Search a activity type" onChange={this.onSearch} />
                					<div id="activityTitleList" className="FormDropDownList" name="activityTitleList">{state.activityTitle}</div>
               					</div>
                			</div>
                		</div>
						<img className="DashboardFilterIcon" src={process.env.PUBLIC_URL+'/images/filter.svg'} alt="FilterImage"></img>
                	</div>
                	<div id="SelectedFilters">{filters}</div>
					<div className="DashboardOffersShow">
						{state.offers}
					</div>
				</div>
			</div>
		)
	}
	else return <Loading />
	}
}