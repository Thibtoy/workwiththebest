import React from 'react';
import API from '../utils/API.js';
import {Route, Redirect} from 'react-router-dom';
import Loading from './loading.js';

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
		document.body.style.background = 'linear-gradient(#CCCCCC, white)';
		API.isAuth()
			.then(data => {
				if (data.data.token) localStorage.setItem('token', data.data.token);
				that.props.logged(true, data.data.user.role);
				that.setState({logged: true, loaded: true, user: data.data.user});
			})
			.catch(err => {that.setState({loaded: true})});
	}	
	render() {
		const {logged, loaded, user} = this.state;
		if (loaded) {
			if(logged) return (<Route path={this.props.path}  
				render={(props) => <this.props.component {...props} {...this.props} user={user} />} />)
			else return <Redirect to='redirection/notLogged' />;
		}
		else return <Loading />;
	}	
}