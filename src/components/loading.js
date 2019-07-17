import React from 'react';
import '../styles/loading.scss';

export default class Loading extends React.Component {
	componentDidMount() {
		let loading = document.getElementById('LoadingImage');
		setTimeout(() => {
			loading.classList.add('rotate');
		}, 0.00000000000000001);
		this.rotateBabe(loading);
	}

	rotateBabe(elem) {
		let ag = 360;
		setInterval(() => {
			ag += 360;
			elem.style.transform = 'rotate('+ag+'deg)'
		}, 2200)
	}



	render() {
		return(
			<div id="LoadingPage">
				<img id="LoadingImage" src={process.env.PUBLIC_URL+'/images/loading.svg'} alt="LoadingImg" ></img>
			</div>
		)
	}
}