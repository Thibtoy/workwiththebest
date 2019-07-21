import React from 'react';
import '../styles/offer.scss';

export default class Offer extends React.Component {
	render() {
		const item = this.props.data;
		let location = (item.locationsname)? [<p key='1' className="ParagrapheFontSet">{item.locationsname}</p>] : [<p key='1' className="ParagrapheFontSet">-</p>];
		let activity = (item.activityname)? [<p key='1' className="ParagrapheFontSet">{item.activityname}</p>] : [<p key='1' className="ParagrapheFontSet">-</p>];
		return(
			<div className="OfferBox">
				<h5 className="MasterFontSet">{item.title}</h5>
				<div className="OfferBoxInfos">
					<img className="OfferBoxInfosAvatar" src={process.env.PUBLIC_URL+'/images/building.svg'} alt="Avatar"></img>
					<div className="OfferBoxInfosContent">
						{location}
						{activity}
						<div>
							<p className="LegendFontSet">Start: {item.startDate}</p>
							<p className="LegendFontSet">End: {item.endDate}</p>
						</div>
					</div>
					<div className="OfferBoxInfosOptions"></div>
				</div>
				<div className="OfferBoxMain">
					<div className="OfferBoxMainContent">
						<p className="ParagrapheFontSet">{item.content}</p>
					</div>
				</div>
			</div>
		);
	}
}