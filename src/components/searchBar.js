import React from 'react';
import API from '../utils/API.js';


export default class SearchBar extends React.Component {
	constructor() {
		super();
		this.state = {
			list: [],
		}
	}

	onSearch = event => {//Fonction qui gére la barre de recherches
		let that = this;
		let table = event.target.name;
		if (event.target.value.length > 0) {
			API.wordResearch({table: table, word: event.target.value})
				.then(data => {
					if(!data.data.length) data.data = [data.data];
					let response = data.data.map(function(item, i){
						if (item.code) return(<p key={i} value={item.id} name={table+'.id'} onClick={that.onSelect}>{item.name}-({item.code})</p>);
						else return(<p key={i} value={item.id} name={table+'.id'} onClick={that.onSelect}>{item.name}</p>);
					});
					this.setState({list: response});
				})
				.catch();
			}
		else this.setState({list: []});
	}

	onSelect = event => {
		let target = event.target;
		let filter = {
			name: target.getAttribute('name'),
			inner: target.innerHTML,
			value: target.getAttribute('value'),
		}
		target.parentNode.parentNode.childNodes[0].value = '';
		this.setState({list: []}, () => this.props.func(filter));
	}

	render() {
		let props = this.props;
		return(
			<div className="FormGroupLabel">
                <label htmlFor="research" type="text">{props.label}</label>
                <div className="FormSearchBox">
                	<input className="FormInput" name={props.name} type="text" placeholder={props.pldr} onChange={this.onSearch} />
                	<div id={props.id} className="FormDropDownList" name={props.list || 'list'}>{this.state.list}</div>
               	</div>
            </div>
		);
	}
}