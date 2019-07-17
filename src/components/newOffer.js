import React from 'react';
import '../styles/newOffer.scss';
import API from '../utils/API.js';
import Loading from './loading.js';


export default class NewOffer extends React.Component {
	constructor() {//Déclaration des states de notre formulaire
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
			updated: {},
			remove: {},
			loaded: false,
		}
		this.Mount = this.Mount.bind(this);
	}

		handleChange = event => {//Fonction qui met à jour le state de la page à chaque action sur un input de formulaire
		this.setState({
			[event.target.name]: event.target.value,
			updated: {[event.target.name]: true}
		});
	}

		onSearch = event => {//Fonction qui gére la barre de recherches
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

		onSelect = event => {//A la selection d'une réponse de notre barre de recherche
			let name = event.target.getAttribute('name');
			let list = this.state['selected'+name.charAt(0).toUpperCase() + name.slice(1)];
			let inner = event.target.innerHTML.split(' ');
			let selectedBox = <p key={event.target.getAttribute('value')} value={event.target.getAttribute('value')} name={name} onClick={this.onDeselect}>{inner[0] + ' ' + inner[1].slice(0, 3)})</p>
			list[event.target.getAttribute('value')] = selectedBox;
			this.setState({['selected'+name.charAt(0).toUpperCase() + name.slice(1)]: list}, () => {this.setState({[name]: []}, () => console.log(this.state))});
		}

		onDeselect = event => {//A la déselection d'un item préalablement sélectionné dans notre barre de recherches.
			let name = event.target.getAttribute('name');
			let list = this.state['selected'+name.charAt(0).toUpperCase() + name.slice(1)];
			delete list[event.target.getAttribute('value')];
			this.setState({['selected'+name.charAt(0).toUpperCase() + name.slice(1)]: list});
		}

		onKeepOrRemove = event => {//Pour supprimer/garder un lien avec un lieu ou métier lors de l'update de données
			let remove = this.state.remove;
			if (event.target.getAttribute('remove') === 'false') {
				event.target.setAttribute('remove', 'true');
				event.target.classList.add('ToRemove');
				remove[event.target.getAttribute('id')] = event.target.getAttribute('name'); 
			}
			else {
				event.target.setAttribute('remove', 'false');
				event.target.classList.remove('ToRemove');
				delete remove[event.target.getAttribute('id')]
			}
			this.setState({remove});
		}

		handleSubmit = event => {//Pour soumettre le formulaire
			delete this.state.locations;
			delete this.state.activity;
			delete this.state.button;
			let selectedLocations = {};
			this.state.selectedLocations.forEach(function(item){
				if (item.key && !item.props.remove) selectedLocations[item.key] = {id: item.key};
			})
			let selectedActivity = {};
			this.state.selectedActivity.forEach(function(item){
				if (item.key && !item.props.remove) selectedActivity[item.key] = {id: item.key};
			})
			this.setState({locationsList: selectedLocations, activityList: selectedActivity}, () => {
				delete this.state.selectedLocations;
				delete this.state.selectedActivity;
				if (this.props.match.params.id){
					API.updateOffer(this.state)
						.then(() => window.location.pathname = '/redirection/update')
						.catch(() => window.location.reload());
				}
				else API.addOffer(this.state)
						.then(() => window.location.pathname = '/redirection/create')
						.catch(() => window.location.pathname = '/redirection/fail');
			});
		}

		Mount() {//Construis la page avant de nous la montrer
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
								return states.selectedLocations[item.locationId] = <p key={item.locationId} remove="false" id={item.linkId}	value={item.locationId} name='Location' onClick={that.onKeepOrRemove}>{item.name + ' ' + item.code.slice(0, 3)})</p>
							});
					    }
					    else if (data.data[1]) states['selectedLocations'][data.data[1].locationId] = <p key={data.data[1].locationId} remove="false" id={data.data[1].linkId}	value={data.data[1].locationId} name='Location' onClick={that.onKeepOrRemove}>{data.data[1].name + ' ' + data.data[1].code.slice(0, 3)})</p>
						states['selectedActivity'] = [];
						if (data.data[2].length) {
								data.data[2].map(function(item, i){
								return states.selectedActivity[item.activityId] = <p key={item.activityId} remove="false" id={item.linkId}	value={item.activityId} name='Activity' onClick={that.onKeepOrRemove}>{item.name + ' '})</p>
							});
						}
						else if (data.data[2]) states['selectedActivity'][data.data[2].activityId] = <p key={data.data[2].activityId} remove="false" id={data.data[2].linkId}	value={data.data[2].activityId} name='Activity' onClick={that.onKeepOrRemove}>{data.data[2].name + ' '})</p> 
						states['button'] = "Update";
						states['role'] = this.props.user.role;
						states['id'] = body.id;
						states['head'] = 'Update Offer';
						states['path'] = window.location.pathname;
						states['loaded'] = true;
						this.setState(states);						
					})
					.catch(err => window.location.pathname = '/redirection/other');
			}
			else {
				let state = {
					role: this.props.user.role,
					title: 'Title',
					content: 'Content',
					startDate: '',
					endDate: '',
					ownerId: this.props.user.id,
					active: '',
					button: 'Add Offer',
					head: 'New Offer',
					path: window.location.pathname,
					selectedLocations: [],
					selectedActivity: [],
					loaded: true,
				}
				this.setState(state)
			}
		}

		componentWillMount() {
			this.Mount();
		}

		componentDidUpdate() {//Pour éviter un bug d'affichage en passant d'un update d'offre à une nouvelle offre
			if (this.state.path !== window.location.pathname) this.Mount();
		}

		render() {
			let state = this.state;
		if (this.state.loaded) {
		return(
			<div id="NewOffer">
				<form method="POST" className="Form FormNewOffer"  autoComplete="off">
					<h3 className="FormMasterFontSet">{state.head}</h3>
					<div className="FormRowContainer">
						<div className="FormInputContainer">
							<div className="FormGroupLabel">
                				<label htmlFor="title">Title</label>
                				<input className="FormInput" name="title" type="title" value={state.title} onChange={this.handleChange}/>
                			</div>
                			<div className="FormGroupLabel">
                				<label htmlFor="content">Content</label>
                				<textarea className="FormTextArea" name="content" type="text" value={state.content} onChange={this.handleChange}/>
                			</div>
                			<div className="FormGroupLabel">
                				<label htmlFor="startDate">Start Date:</label>
                				<input className="FormInput" name="startDate" type="date" value={state.startDate} onChange={this.handleChange}/>
                			</div>
                			<div className="FormGroupLabel">	
                				<label htmlFor="endDate">End Date:</label>
                				<input className="FormInput" name="endDate" type="date" value={state.endDate} onChange={this.handleChange}/>
                			</div>
                		</div>
                		<div className="FormInputContainer">
                			<div className="FormGroupLabel">
                				<label htmlFor="research" type="text">Location</label>
                				<div className="FormSearchBox">
                					<input className="FormInput" name="locations" type="text" placeholder="Search a location" onChange={this.onSearch} />
                					<div id="locationList" className="FormDropDownList" name="locationList">{state.locations}</div>
               					</div>
               					<div id="Location" className="FormListSelection">{state.selectedLocations}</ div>
                			</div>
                			<div className="FormGroupLabel">
                				<label htmlFor="research" type="text">Activity</label>
                				<div className="FormSearchBox">
                					<input className="FormInput" name="activity" type="text" placeholder="Search an activity" onChange={this.onSearch} />
                					<div id="activityList" className="FormDropDownList" name="activityList">{state.activity}</div>
               					</div>
               					<div id="Activity" className="FormListSelection">{state.selectedActivity}</ div>
                			</div>
                		</div>
                	</div>
                	<div className="FormButton" onClick={this.handleSubmit}>{state.button}</div>
				</form>
			</div>
		)
	}
	else return(<Loading />)
	}
}