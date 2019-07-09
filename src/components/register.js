import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import '../styles/Form.scss';
import '../styles/register.scss';

export default class Register extends Component{

	componentWillMount() {
		document.body.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"images/background.jpg)";		
	}

	render() {
		let relativePath = window.location.pathname;
		return(
			<div id="Register">
				<div className="Form RegisterPathForm">
					<h3 className="FormMasterFontSet">Let's Start!</h3>
					<p>Which kind of account do<br/> you want to create?</p>
					<div className="FormButtonRow">
						<Link className="FormButton" to={relativePath + '/registerUser'}>User Account</Link>
						<Link className="FormButton" to={relativePath + '/registerCompany'}>Company Account</Link>
					</div>
				</div>
			</div>
		)
	}
}