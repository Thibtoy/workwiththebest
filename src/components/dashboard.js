import React from 'react';
import API from '../utils/API.js';
import Carrousel from './carrousel.js';
import Offer from './offer.js';
import SearchBar from './searchBar.js';
import Filter from './filter.js';
import Loading from './loading.js';
import '../styles/dashboard.scss';

export default class Dashboard extends React.Component {
	constructor(){
		super();
		this.state = {
			carrouselLoaded: false,
			offersLoaded: false,
			visibleFilters: false,
			workin: true,
			key: 0,
			filtersKey: 0,
			filters: {
				'locations.id': [],
				'activity.id': [],
				'districts.id': [],
				'activityTitle.id': [],
			},
			offers: [],
			selectedFilters: [],
		}
		this.removeFilter = this.removeFilter.bind(this);
		this.onFilter = this.onFilter.bind(this);
	}

	filtersAppear = event => {// Déclenche l'apparition/disparition du menu des filtres
		if (this.state.workin) {
			let target = event.target.parentNode.parentNode.childNodes[0];
			this.setState({workin: false}, () => this.fadeInOut(target, this));
		}		
	}

	fadeInOut(target, that) {// Animation vers la visibilité, pui enclenche le déroulement des filtres
		let filters = document.getElementById('SelectedFilters');
		(that.state.visibleFilters)? 
			that.setState({visibleFilters: false}, () => {
				filters.classList.add('SelectedFiltersDropdown')
				setTimeout(() => that.filtersDropdown(true, target, that), 500)
			}) :
			that.setState({visibleFilters: true}, () => {
				target.classList.add('FilterBarVisible');				 
				setTimeout(() => that.filtersDropdown(false, filters, that), 500)				
			});
	}

	filtersDropdown(condition, target, that) {//Déroulement des filtres
		(condition)? target.classList.remove('FilterBarVisible') : target.classList.remove('SelectedFiltersDropdown');
		setTimeout(() => that.setState({workin: true}), 500)
	}

	fillDashboard(body, that) {//Fais la requête avec les filtres passés en options, pour selectionner les offres à afficher.
		let key = that.state.key;
		API.dashboard(body).then(res => {
			if (res.data) {
				let offers = res.data.map(function(item){
					if (item) {
						return item.map(function(item, i){
							item.startDate = item.startDate.slice(0, 10);
							item.endDate = item.endDate.slice(0, 10);
							if (!item.name) item.name = item.firstName+' '+item.lastName;
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

	switchConditions(that) {//Fonction conditionnelle pour appeller la fction précedente avec differents paramètres. 
		let filters = that.state.filters;
		let where = {active: 1};
		for (let filter in filters) where[filter] = filters[filter].map(item => item.props.entry);
		switch (that.props.user.role) {
			case 'users': return that.fillDashboard({tables: ['companies'], where}, that);
			case 'companies': return that.fillDashboard({tables: ['users'], where}, that);
			default: return that.fillDashboard({tables: ['users', 'companies'], where}, that);
		}
	}

	onFilter(filter) {//Ajoutes un filtre et appelle switchCondition(lié aux components <SearchBar />)
		let state = this.state;		
		state.filters[filter.name].push(
			<Filter key={state.filtersKey} inner={filter.inner} entry={filter.value} name={filter.name} onRemove={this.removeFilter} />
		);
		state.filtersKey++;
		this.setState(state, () => this.switchConditions(this));	
	}

	removeFilter(filter) {//Retires un filtre et appelle switchCondition(lié au component <Filter />)
		let state = this.state;
		state.filters[filter.name].forEach(function(item, i){
			if (item.props.name === filter.name && item.props.entry === filter.entry) state.filters[filter.name].splice(i, 1);
		});
		this.setState(state, () => this.switchConditions(this));
	}

	componentWillMount(){//Monte la page, appelle switchCondition pour afficher des offres avec 0 fitres définits.
		document.body.style.background = 'linear-gradient(#CCCCCC, white)';
		document.body.style.height = 'auto';
		this.switchConditions(this);	
	}

	render() {
		let state = this.state;
		if (state.offersLoaded) {
			let filters = [];
			for (let field in state.filters){//Pour chaque propriété de l'objet filters du state,  
				let filter = state.filters[field].map(item => [item]);
				filters.push(filter);//On push les balises filtres dans un tableau filters, qu'on utilise dans le return.
			}
			return(
				<div id="Dashboard">
					<Carrousel user={this.props.user} />
					<div id="DashboardOffersBoard">
						<div className="DashboardTop">
							<div id="InputList">
								<div className="FilterBar">
									<div className="FormInputContainer">
                						<SearchBar label='Location' name='locations' pldr='Search a location' func={this.onFilter} />
                						<SearchBar label='Activity' name='activity' pldr='Search an activity' func={this.onFilter} />
                					</div>
                					<div className="FormInputContainer">
                						<SearchBar label='District' name='districts' pldr='Search a district' func={this.onFilter} />
                						<SearchBar label='Activity type' name='activityTitle' pldr='Search an activity type' func={this.onFilter} />
                					</div>
                				</div>
                				<div className="FilterBox">
									<img className="DashboardFilterIcon" src={process.env.PUBLIC_URL+'/images/filter.svg'} alt="FilterImage" onClick={this.filtersAppear}></img>
								</div>                	
                			</div>
                			<div id="SelectedFilters" className="SelectedFiltersDropdown">{filters}</div>
                		</div>
						<div className="DashboardOffersShow">{state.offers}</div>
					</div>
				</div>
			);
		}
		else return <Loading />
	}
}