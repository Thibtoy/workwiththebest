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
		}
		this.fillDashboard = this.fillDashboard.bind(this);
	}

	componentWillMount(){
		console.log(this.props);
		let type = this.props.user.role;
		document.body.style.background = 'linear-gradient(#CCCCCC, white)';
		document.body.style.height = 'auto';
		switch (type) {
			case 'users': return this.fillDashboard(['companies']);
			case 'companies': return this.fillDashboard(['users']);
			default: return this.fillDashboard(['users', 'companies']);
		}		
	}

	fillDashboard(type) {
		let that = this;
		API.dashboard({type}).then(res => {
			let offers = res.data.map(function(item){
				return item.map(function(item, i){
					item.startDate = item.startDate.slice(0, 10)+" "+item.startDate.slice(11, 19);
					item.endDate = item.endDate.slice(0, 10)+" "+item.endDate.slice(11, 19);
					if (!item.name) {
						item.name = item.firstName+' '+item.lastName;
						delete item.firstName;
						delete item.lastName;
					}
					return(<Offer key={i} data={item} />)
				})
			});
			that.setState({offers, offersLoaded: true});
		});	
	}

	render() {
	if (this.state.offersLoaded) {
		return(
			<div id="Dashboard">
				<Carrousel user={this.props.user} />
				<div id="DashboardOffersBoard">
					<img className="DashboardFilterIcon" src={process.env.PUBLIC_URL+'/images/filter.svg'} alt="FilterImage"></img>
					<div className="DashboardOffersShow">
						{this.state.offers}
					</div>
				</div>
			</div>
		)
	}
	else return <Loading />
	}
}