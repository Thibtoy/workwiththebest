import React from 'react';
import '../styles/newOffer.scss';
import API from '../utils/API.js';
import Loading from './loading.js';
import {Redirect} from 'react-router-dom';
import SearchBar from './searchBar.js';
import Input from './input.js';

export default class NewOffer extends React.Component {
	constructor() {//Déclaration des states de notre formulaire
		super();
		this.state = {
			role: '',
			title: '',
			content: '',
			startDate: '',
			endDate: '',
			ownerId: '',
			active: '',
			selectedLocations: [],
			locationsList: [],
			selectedActivity: [],
			activityList: [],
			button: '',
			id: '',
			head: '',
			path: '',
			updated: {},
			remove: {},
			loaded: false,
			redirect: [],
			access: true,
		}
		this.Mount = this.Mount.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.input = this.input.bind(this);
	}

	input(input) {
		let updated = this.state.updated;
		updated[input.name] = true;
		this.setState({[input.name]: input.value, updated}, () => console.log(this.state));
	}

	onSelect(selected) {//A la selection d'une réponse de notre barre de recherche
		let state = this.state;
		let field = 'selected'+selected.name.charAt(0).toUpperCase() + selected.name.split('.id')[0].slice(1);
		let list = state[field];
		let selectedBox = <p key={selected.value} value={selected.value} name={field} onClick={this.onDeselect}>{selected.inner}</p>
		list[selected.value] = selectedBox;
		this.setState({[field]: list});
	}

	onDeselect = event => {//A la déselection d'un item préalablement sélectionné dans notre barre de recherches.
		let name = event.target.getAttribute('name');
		let list = this.state[name];
		delete list[event.target.getAttribute('value')];
		this.setState({[name]: list});
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
		this.setState({loaded: false}, () => {
			let selectedLocations = {};
			this.state.selectedLocations.forEach(function(item){
				if (item.key && !item.props.remove) selectedLocations[item.key] = {id: item.key};
			});
			let selectedActivity = {};
			this.state.selectedActivity.forEach(function(item){
				if (item.key && !item.props.remove) selectedActivity[item.key] = {id: item.key};
			});
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
		});
	}

	Mount() {//Construis la page avant de nous la montrer
		let that = this;
		let body = {id: this.props.match.params.id, type: this.props.user.role}
		if (body.id && this.state.access) {
			API.getOffer(body)
				.then( (data) => {
					if (data.data[0][0].ownerId === this.props.user.id){
						let states = {
							button: 'Update',
							head: 'Update Offer',
							id: body.id,
							loaded: true,
							path: window.location.pathname,
							role: body.type,
							selectedLocations: [],
							selectedActivity: [],
						}
						for (let prop in data.data[0][0]) {
							data.data[0][0][prop] = (prop === "startDate" || prop === "endDate")? data.data[0][0][prop].slice(0, 10): data.data[0][0][prop];
							states[prop] = data.data[0][0][prop];
						}
						if (data.data[1]) { 
							data.data[1].map(function(item, i){
								return states.selectedLocations[item.locationId] = <p key={item.locationId} remove="false" id={item.linkId}	value={item.locationId} name='Location' onClick={that.onKeepOrRemove}>{item.name+' ('+item.code.slice(0, 2)})</p>;
							});
					    }
						if (data.data[2]) {
								data.data[2].map(function(item, i){
								return states.selectedActivity[item.activityId] = <p key={item.activityId} remove="false" id={item.linkId}	value={item.activityId} name='Activity' onClick={that.onKeepOrRemove}>{item.name}</p>;
							});
						}
						this.setState(states);
					}
					else this.setState({redirect: [<Redirect key='1' to='../redirection/notOwner' />], access: false});						
				})
				.catch(err => this.setState({redirect: [<Redirect key='1' to='../redirection/other' />], access: false}));
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
				selectedLocations: [],
				selectedActivity: [],
				loaded: true,
			}
			this.setState(state)
		}
	}

	componentWillMount() {
		if (this.props.user.logged) {
			this.Mount();
			document.body.style.background = 'linear-gradient(#CCCCCC, white)';
			document.body.style.height = '100vh';
		}
		else this.setState({redirect: [<Redirect key='1' to='../redirection/notLogged' />]})
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
								<Input name="title" label="Title:" type="text" plcdr="Enter a title" value={state.title} func={this.input} />
								<Input name="content" label="Content:" type="text-area" plcdr="Enter a content" value={state.content} func={this.input} />
								<Input name="startDate" label="Start Date:" type="date"  value={state.startDate} func={this.input} />
								<Input name="endDate" label="End Date:" type="date"  value={state.endDate} func={this.input} />
                			</div>
                			<div className="FormInputContainer">
                				<SearchBar label='Location' name='locations' pldr='Search a location' func={this.onSelect} /> 
               					<div id="Location" className="FormListSelection">{state.selectedLocations}</ div>
               					<SearchBar label='Activity' name='activity' pldr='Search an activity' func={this.onSelect} />
                				<div id="Activity" className="FormListSelection">{state.selectedActivity}</ div>
                			</div>
                		</div>
                		<div className="FormButton" onClick={this.handleSubmit}>{state.button}</div>
					</form>
					{this.state.redirect}
				</div>
			);
		}
		else return(
			<div>
				<Loading />
				{this.state.redirect}
			</div>
		);		
	}
}