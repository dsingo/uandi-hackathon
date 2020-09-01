import React, { Component } from "react";
import { HashRouter, Route, NavLink, Switch } from "react-router-dom";
import Profile_page from './Profile_page';
import Signup_page from './signUp_page';
import Questions from './questions';
import Matches_page from './Matches_page';
import Edit_profile from './edit_profile';
import './App.css';

class Routes extends Component {
  render() {
    return (
      <div>
        <div>
          <HashRouter class="nav-bar" basename="/">
            <div class="nav-links">
              <span class="nav-link"><NavLink style={{ textDecoration: 'none', fontWeight: "600" }} to="/profile">Profile</NavLink></span>
              <span class="nav-link"><NavLink style={{ textDecoration: 'none', fontWeight: "600" }} to="/matches">Matches</NavLink></span>
              <span class="nav-link"><NavLink style={{ textDecoration: 'none', fontWeight: "600"}} to="/">Sign out</NavLink></span>
            </div>
          
            <Switch>
              <Route exact path="/" component={Signup_page} />
              <Route exact path="/profile" component={Profile_page} />
              <Route path="/profile/edit" component={Edit_profile} />
              <Route path="/matches" component={Matches_page} />
              <Route path="/questionnaire" component={Questions} />
            </Switch>
          </HashRouter>
        
        </div>
        <div class="footer">
          Copyright © uandicc-profiles 2020.
        </div>
      </div>
    );
  }
}

export default Routes;
