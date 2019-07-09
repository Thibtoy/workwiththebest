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
		}
		this.handleChange.bind(this);
		this.handleSubmit.bind(this);
		this.handleRadio.bind(this);
	}

	componentWillMount() {
		document.body.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"images/background.jpg)"		
	}

	handleSubmit = event => {
		event.preventDefault();
		if (this.state.email.length === 0) return;
		if (this.state.password.length === 0) return;
			API.login(this.state).then(function(data){
				localStorage.setItem('token', data.data.token);
				window.location = "/dashboard";
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
				<form method="POST" className="Form FormLogin">
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
                	<div className="FormButton" onClick={this.handleSubmit}>Connexion</div>
				</form>
			</div>
		)
	}
}