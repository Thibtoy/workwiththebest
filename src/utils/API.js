import axios from 'axios';

const headers = {'Content-Type': 'application/json'};
const path = (window.location.host === 'localhost:3000')? 'http://localhost:8000' : 'https://evening-forest-89198.herokuapp.com';

export default {
	login: function(body){
		return axios.post(path+'/login', body, {headers: headers});
	},

	signUp: function(body){
		delete body.password2;
		delete body.filled;
		delete body.errorMessage;
		return axios.post(path+'/signUp', body, {headers: headers});
	},

	isAuth: function(){
		return new Promise(function(resolve, reject) {
				let token = localStorage.getItem('token');
				if (token) {
					axios.post(path+'/authenticated', {token}, {headers: headers})
						 .then(data => resolve(data))
						 .catch(err => reject(err));
				}
				else reject('error');
			})
			
	},

	logOut: function(){
		localStorage.removeItem('token');
	},

	carrouselContent: function(body){
		return axios.post(path+'/carrousel', body, {headers});
	},

	wordResearch: function(body) {
		return axios.post(path+'/wordResearch', body, {headers});
	},

	addOffer: function(body) {
		return axios.post(path+'/addOffer', body, {headers});
	},

	getOffer: function(body) {
		return axios.post(path+'/getOffer', body, {headers});
	},

	updateOffer: function(body) {
		return axios.put(path+'/updateOffer', body, {headers});
	},

	offersList: function(body) {
		return axios.post(path+'/offers', body, {headers});
	},

	deleteOffer: function(body) {
		return axios.delete(path+'/deleteOffer', {data: body}, {headers});
	},

	securityToken: function(){
		return axios.post(path+'/securityToken', {}, {headers});
	},

}