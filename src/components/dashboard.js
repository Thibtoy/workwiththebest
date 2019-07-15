import React from 'react';
import Carrousel from './carrousel.js';
import Offer from './offer.js';
import API from '../utils/API.js'

import '../styles/dashboard.scss';

export default class Dashboard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			offers : [],
		}
	}

	componentWillMount(){
		let that = this;
		let type = (this.props.user.role === "users")? "companies":"users";
		API.carrouselContent({type}).then(data => {
			let offers = data.data.map(function(item, i){
				item.startDate = item.startDate.slice(0, 10)+" "+item.startDate.slice(11, 19);
				item.endDate = item.endDate.slice(0, 10)+" "+item.endDate.slice(11, 19);
				if (!item.name) {
					item.name = item.firstName+' '+item.lastName;
					delete item.firstName;
					delete item.lastName;
				}
				return(<Offer key={i} data={item} />)
			});
			that.setState({offers});
		});
	}

	render() {
		return(
			<div id="Dashboard">
				<Carrousel user={this.props.user} />
				<div id="DashboardOffersBoard">
					<h1> coucou</h1>
					<img className="DashboardFilterIcon" src={process.env.PUBLIC_URL+'/images/filter.svg'} alt="FilterImage"></img>
					<div className="DashboardOffersShow">
						{this.state.offers}
					</div>
				</div>
			</div>
		)
	}
}