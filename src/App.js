import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import Header from './components/header.js';
import Register from './components/register.js';
import Dashboard from './components/dashboard.js';
import Login from './components/login.js';
import HomePage from './components/homePage.js';
import PrivateRoute from './components/privateRoute.js';
import PublicRoute from './components/publicRoute.js';
import RegisterUser from './components/registerUser.js';
import RegisterCompany from './components/registerCompany.js';
import NewOffer from './components/newOffer.js';
import OffersList from './components/offersList.js';
import Redirection from './components/redirection.js';
import Loading from './components/loading.js';

import './styles/styles.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      logged: false,
    }
  }

  handleLogged = (logged) => {;
    this.setState({logged});
  }

  render() {
    return (
      <div className="App">
      <Header logged={this.state.logged}/>
        <div id="App-content">
          <Switch>
            <PublicRoute exact path="/" component={HomePage} logged={this.handleLogged} />
            <PublicRoute exact path="/load" component={Loading} logged={this.handleLogged} />
            <PublicRoute exact path="/register" component={Register}logged={this.handleLogged} />
            <PublicRoute exact path="/login" component={Login} logged={this.handleLogged} />
            <PublicRoute exact path="/register/registerUser" component={RegisterUser} logged={this.handleLogged} />
            <PublicRoute exact path="/register/registerCompany" component={RegisterCompany} logged={this.handleLogged} />
            <PublicRoute exact path="/redirection/:did" component={Redirection} logged={this.handleLogged} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} logged={this.handleLogged} />
            <PrivateRoute exact path='/newOffer' component={NewOffer} logged={this.handleLogged} />
            <PrivateRoute exact path='/offers' component={OffersList} logged={this.handleLogged} />
            <PrivateRoute exact path='/offers/:id' component={NewOffer} logged={this.handleLogged} />
            <PublicRoute component={Redirection} logged={this.handleLogged} />
          </Switch>
        </div>
      </div>
    );}
}