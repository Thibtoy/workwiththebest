import React from 'react';
import API from '../utils/API.js';
import {Route} from 'react-router-dom';

export default class PrivateRoute extends React.Component{
	constructor() {
		super();
		this.state = {
			logged: false,
			loaded: false,
			user: '',
		}
	}

	componentWillMount() {
		let that = this;
		API.isAuth()
			.then(data => {that.setState({logged: true,
			 loaded: true, user: data.data.user});})
			.catch(err => {that.setState({loaded: true})});
	}
	
	render() {
		const {logged, loaded, user} = this.state;
		if (loaded) {
			if(logged) return (<Route path={this.props.path}  
				render={(props) => <this.props.component {...props} user={user} />} />)
			else return window.location = '/login';
		}
		else return null;
	}	
}