import React, {Component} from 'react';
import API from '../utils/API.js';
import '../styles/Form.scss';

export default class RegisterUser extends Component {
	constructor() {
		super();
		this.state = {
			firstName: false,
			lastName: false,
			email: false,
			password: false,
			password2: false,
			errorMessage: '',
			filled: true,
			type: 'users',
		}
		this.handleSubmit.bind(this);
		this.handleChange.bind(this); 
	}

	componentWillMount() {
		document.body.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"../images/background.jpg)";
		document.body.style.backgroundSize = 'cover';
	}

	handleSubmit = event => {
		event.preventDefault();
		let that = this;
		let promise = new Promise(function(resolve, reject){
			for (let item in that.state) {
			if (that.state[item] === false) that.setState({filled: false})
		};
		resolve();
		});
		promise.then(() => {
			if (this.state.filled) {
				if (this.state.password === this.state.password2) {
					API.signUp(this.state).then(function(response){
						if (response.data.created) {
							window.location = "/redirection/registeredSuccessfully";	
						}
						else return that.setState({errorMessage: response.data.message})
					});
				}
				else return this.setState({errorMessage: 'Passwords doesn\'t match'});
			}
			else {
				this.setState({filled: true});
				return this.setState({errorMessage: 'All inputs must be filled'});
			}
		});
	}

	handleChange = event => {
		this.setState({
			[event.target.id] : event.target.value
		});
	}

	render() {
		return(
			<div id="Register">
			<form method="POST" className="Form RegisterForm">
				<h3 className="FormMasterFontSet">User Account</h3>
				<div className="FormInputContainer RegisterInputContainer">
					<div className="FormGroupLabel">
						<label htmlFor="firstName">First Name :</label>
						<input id="firstName" name="firstName" type="firstName" onChange={this.handleChange}/>
					</div>		
					<div className="FormGroupLabel">
						<label htmlFor="lastName">Last Name :</label>
						<input id="lastName" name="lastName" type="lastName" onChange={this.handleChange}/>
					</div>		
					<div className="FormGroupLabel">
						<label htmlFor="email">Email :</label>
						<input id="email" name="email" type="email" onChange={this.handleChange}/>
					</div>		
					<div className="FormGroupLabel">
						<label htmlFor="password">Password :</label>
						<input id="password" name="password" type="password" onChange={this.handleChange}/>
					</div>		
					<div className="FormGroupLabel">
						<label htmlFor="password2">Confirm password :</label>
						<input id="password2" name="password2" type="password" onChange={this.handleChange}/>
					</div>		
				</div>
				<p className="FormErrorFont">{this.state.errorMessage}</p>
				<div className="FormButton" onClick={this.handleSubmit}>Confirm</div>
			</form>
			</div>
		)
	}
}