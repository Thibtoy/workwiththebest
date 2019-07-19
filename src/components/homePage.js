import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Form.scss';
import '../styles/homePage.scss';
import API from '../utils/API.js';

export default class HomePage extends React.Component {
	constructor() {
		super();
		this.state = {
			redirect: [],
		}
		this.anonymVisit = this.anonymVisit.bind(this);
	}

	componentWillMount() {
		document.body.style.backgroundImage = "url("+ process.env.PUBLIC_URL +"images/background.jpg)";
		document.body.style.backgroundSize = 'cover';
	}

	anonymVisit = event => {
		let that = this;
		API.anonym()
			.then(data => {
				localStorage.setItem('token', data.data);
				that.setState({redirect: [<Redirect key='1' to='dashboard' />]});
			})
			.catch();
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
							<Link to='/register' className='FormButton'>Register</Link>
							<Link to='/login' className='FormButton'>Login</Link>
						</div>
						<div className="FormButtonRow">
							<div className='FormButton' onClick={this.anonymVisit}>Visit</div>
						</div>
					</div>
				</div>
				{this.state.redirect}
			</div>
			)
	}
}