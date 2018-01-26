import React from 'react';
import { Provider } from 'react-redux';
import { Switch, HashRouter, Route, Redirect, withRouter,
  IndexRoute, BrowserRouter, hashHistory } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

import { configureStore } from '../store';
import { ProtectedRoute } from '../util/root_util';

import { App } from './App';
import Test from './Test';
import SignIn from './containers/Sessions_Container';
import MyGym from './Admin/MyGym';
import EditMyGym from './containers/editGymContainer';
import Billing from './Admin/Billing';
import Account from './containers/Accounts_container';
import Sidebar from './admin/Sidebar';
import Classes from './containers/classes_container';

let store = configureStore();

const customHistory = createBrowserHistory()

function loggedIn(session) {
  console.log(session.user.uid.length > 1);
  session.user.uid.length > 1;
};

const Root = ({ store }) => {
    return(

      <Provider store={ store }>
        <HashRouter>
          <App>
            <Route exact path="/SignIn" component={SignIn} />
            <Route exact path="/" component={MyGym}/>
            <Route path="/edit" component={EditMyGym} />
            <Route path="/account" component={Account} />
            <Route path="/billing" component={Billing} />
            <Route path="/myclasses" component={Classes} />
          </App>
        </HashRouter>
      </Provider>
    )
}

export default Root;
