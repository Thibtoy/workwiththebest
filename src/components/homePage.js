import React from 'react';
//import {Link} from 'react-router-dom';
import '../styles/Form.scss';
import '../styles/homePage.scss';

export default class HomePage extends React.Component {

	componentDidMount() {
		document.body.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"images/background.jpg)";
	}

	redirect = event => {
		window.location = '/' + event.target.innerHTML.toLowerCase();
	}

	render() {
		return(
			<div id="HomePage">
				<div className="Form HomeForm">
					<h2 className="FormMasterFontSet">Welcome!</h2>
					<p>WorkWithTheBest is an hiring tool 
					project, if you're in search for any 
					kind of job or for the best employee, 
					you may be in the good place. 
					visit our website or create an account 
					now to fully enjoy your navigation!</p>
					<div className="FormButtonContainer">
						<div className="FormButtonRow">
							<div className='FormButton' onClick={this.redirect}>Register</div>
							<div className='FormButton' onClick={this.redirect}>Login</div>
						</div>
						<div className="FormButtonRow">
							<div className='FormButton'>Visit</div>
						</div>
					</div>
				</div>
			</div>
			)
	}
}