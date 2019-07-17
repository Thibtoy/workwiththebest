import React from 'react';
import API from '../utils/API.js';
import {Link} from 'react-router-dom';

export default class OffersList extends React.Component {
	constructor() {
		super();
		this.state = {
			ownerId: '',
			type: '',
			offers: [],
		}
	}

	deleteOffer = event => {//AJOUTER CONSTRAINT ON CASCADE SUR LA BDD EN PRODUCTION (sur les tables de liaisons entre les offres et lea activité/villes)
		let body = {type: this.state.type, id: event.target.getAttribute('id')};
		API.deleteOffer(body)
			.then(data => console.log(data))
			.catch(err => console.log(err));
	}

	componentWillMount() {
		let that = this;
		document.body.style.background = 'linear-gradient(#CCCCCC, white)';
		document.body.style.height = '100vh';
		this.setState({ownerId: this.props.user.id, type: this.props.user.role}, () => {
			API.offersList(this.state)
				.then(data => {
					let offers = [];
					if (data.data.length) {
					 	offers = data.data.map(function(item, i){
							return (
								<div key={i}>{item.title} - startDate: {item.startDate.slice(0,11)} 
								endDate: {item.endDate.slice(0,11)} <Link to={'/offers/'+item.id}>GO</Link><p id={item.id} onClick={that.deleteOffer}>Delete</p></div>
							);
						});
						this.setState({offers});
					}
					else {
						offers.push(
							<div key='1'>{data.data.title} - startDate: {data.data.startDate.slice(0,11)} 
							endDate: {data.data.endDate.slice(0,11)} <Link to={'/offers/'+data.data.id}>GO</Link><p id={data.data.id} onClick={that.deleteOffer}>Delete</p></div>
							)
						this.setState({offers});
					}
				})
				.catch(err => console.log(err));
		});
	}

	render () {
		return(<div>{this.state.offers}</div>);
	}
}