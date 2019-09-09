import React from 'react';
import {Link} from 'react-router-dom';

export default class Redirection extends React.Component {
	load = () => {
		let did = this.props.match.params.did;
		switch (did) {
			case 'update': return ([
					<p key="1">Updated successfully</p>, 
					<Link key="2" className="FormButton" to="/offers">Ok</Link>
				]);
			case 'create': return ([
					<p key="1">Created successfully</p>, 
					<Link key="2" className="FormButton" to="/offers">Ok</Link>
				]);
			case 'registeredSuccessfully': return([
					<p key="1">Registered Successfully</p>,
					<p key="2">Please check your email to activate your account</p>,
					<Link key="3" className="FormButton" to="/login">Ok</Link>

				]);
			case 'activatedSuccessfully': return([
					<p key="1">activated Successfully</p>,
					<p key="2">Congratulations, your account has been activated</p>,
					<Link key="3" className="FormButton" to="/login">Ok</Link>

				]);
			case 'fail': return ([
					<p key="1">Something Went Wrong Please Try Again</p>, 
					<div key="2" className="FormButton" onClick={this.goBack}>Ok</div>
				]);
			case 'notLogged': return ([
					<p key="1">You need to be authenticate to access this page</p>, 
					<div key="2" className="FormButton" to="/login" onClick={this.goBack}>Ok</div>
				]);
			case 'notOwner': return ([
					<p key="1">This offer don't belongs to you</p>, 
					<Link key="2" className="FormButton" to="/offers">Ok</Link>
				]);
			default: return ([
					<p key="1">This page does not seems to exist</p>, 
					<div key="2" className="FormButton" onClick={this.goBack}>Ok</div>
				]);
		}
	}

	goBack = event => {
		window.history.back();
	}

	render() {		
		let view = this.load();		
		return(
			<div id="Redirection">
				<div className="Form RedirectionForm">
					{view}
				</div>
			</div>
		)
	}
}