import React from 'react';
import API from '../utils/API.js';
import '../styles/Form.scss';
import '../styles/login.scss';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			type: '',
			securityToken: '',
		}
		this.handleChange.bind(this);
		this.handleSubmit.bind(this);
		this.handleRadio.bind(this);
	}

	componentWillMount() {
		let that = this;
		document.body.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"images/background.jpg)";
		document.body.style.backgroundSize = "cover";	
		API.securityToken()
			.then(function(data) {that.setState({securityToken: data.data})})
			.catch(function(err) {console.log(err)});			
	}

	handleSubmit = event => {
		event.preventDefault();
		if (this.state.email.length === 0) return;
		if (this.state.password.length === 0) return;
			API.login(this.state).then(function(data){
				if (data.data.faillure) console.log(data.data.message);
				else {
					localStorage.setItem('token', data.data.token);
					window.location = "/dashboard";
				}
			}, function(error){
				console.log(error);
				return;
			});		
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleRadio = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	render() {
		return(
			<div id="Login">
				<form method="POST" className="Form FormLogin" onSubmit={this.handleSubmit}>
					<h3 className="FormMasterFontSet">Login</h3>
					<div className="FormInputContainer">
						<div className="FormRadioContainer">
							<div>
  								<input type="radio" id="user" name="type" value="users" onChange={this.handleRadio}/>
  								<label htmlFor="user">User</label>
  							</div>
  							<div>
  								<input type="radio" id="companies" name="type" value="companies" onChange={this.handleRadio}/>
  								<label htmlFor="companies">Company</label>
  							</div>
  						</div>
  						<div className="FormGroupLabelCenter">
                			<label htmlFor="email">Email</label>
                			<input id="email" name="email" type="email" value={this.state.email} onChange={this.handleChange}/>
                		</div>
                		<div className="FormGroupLabelCenter">
                			<label htmlFor="password">Password</label>
                			<input id="password" name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                		</div>
                	</div>
                	<input className="FormButton" type="submit" value="Connection"/>
				</form>
			</div>
		)
	}
}