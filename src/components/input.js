import React from 'react';

export default class Input extends React.Component {
	handleChange = event => {//Fonction qui met à jour le state de la page à chaque action sur un input de formulaire
		let input = {
			name: event.target.getAttribute('name'),
			value: event.target.value,
		}
		event.target.value = '';
		this.props.func(input);
	}

	render() {
		let input = (this.props.type === 'text-area')?
                		[<textarea key={1} className="FormInput" name={this.props.name} value={this.props.value} type="text" placeholder={this.props.plcdr} onChange={this.handleChange}/>] :                	
                		[<input key={1} className="FormInput" name={this.props.name} value={this.props.value} type={this.props.type} placeholder={this.props.plcdr} onChange={this.handleChange}/>];
		return(
			<div className="FormGroupLabel">
                <label htmlFor={this.props.name}>{this.props.label}</label>
                {input}
            </div>
		)
	}
}