import React from 'react';
import API from '../utils/API.js';
import {Route} from 'react-router-dom';
import Loading from './loading.js';

export default class PublicRoute extends React.Component{
	constructor() {
		super();
		this.state = {
			loaded: false,
		}
	}

	componentWillMount() {
		let that = this;
		document.body.style.background = 'linear-gradient(#CCCCCC, white)';
		API.isAuth()
			.then(data => {
				if (data.data.token) localStorage.setItem('token', data.data.token);
				that.props.logged(true);
				that.setState({loaded: true});
			})
			.catch(() => {that.setState({loaded: true})});
	}
	
	render() {
		const {loaded} = this.state;
		if (loaded) { 
			return (
				<Route path={this.props.path} 
				render={(props) => <this.props.component {...props} {...this.props} />} />
			);
		}
		else return <Loading />;
	}	
}