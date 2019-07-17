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
			case 'fail': return ([
					<p key="1">Something Went Wrong Please Try Again</p>, 
					<div key="2" className="FormButton" onClick={this.goBack}>Ok</div>
				]);
			case 'notLogged': return ([
					<p key="1">You need to be authenticate to access this page</p>, 
					<Link key="2" className="FormButton" to="/login">Ok</Link>
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
			<div id="redirection">
				<div className="Form RedirectionForm">
					{view}
				</div>
			</div>
			)
	}
}