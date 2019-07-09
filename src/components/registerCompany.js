import React, {Component} from 'react';
import API from '../utils/API.js';
import '../styles/Form.scss';

export default class RegisterCompany extends Component {
	constructor() {
		super();
		this.state = {
			name: false,
			siret: false,
			email: false,
			password: false,
			password2: false,
			errorMessage: '',
			filled: true,
			type: 'companies',
		}
		this.handleSubmit.bind(this);
		this.handleChange.bind(this); 
	}

	componentWillMount() {
		document.body.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"../images/background.jpg)";
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
							window.location = "/login";	
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
					<h3 className="FormMasterFontSet">Company Account</h3>
					<div className="FormInputContainer RegisterInputContainer">
						<div className="FormGroupLabel">
							<label htmlFor="name">Name :</label>
							<input id="name" name="name" type="name" onChange={this.handleChange}/>
						</div>	
						<div className="FormGroupLabel">
							<label htmlFor="siret">Siret :</label>
							<input id="siret" name="siret" type="siret" onChange={this.handleChange}/>
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