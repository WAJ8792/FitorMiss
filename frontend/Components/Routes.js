import React from 'react';
import { Provider, connect } from 'react-redux';
import { Switch, HashRouter, Route, Redirect, withRouter,
  IndexRoute, BrowserRouter, hashHistory } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

import { configureStore } from '../store';
import { ProtectedRoute } from '../util/root_util';

import Header from './Headers';
import SignIn from './containers/Sessions_Container';

// Admin
import MyGym from './Admin/MyGym';
import EditMyGym from './containers/editGymContainer';
import Billing from './Admin/Billing/Billing';
import BillingHistory from './Admin/Billing/BillingHistory';
import Account from './containers/Accounts_container';
import Classes from './containers/classes_container';

// Customer
import CustomerPage from './Customers/Customer';
import ClassList from './Customers/ClassList';

let store = configureStore();

const ConnectedApp = ({ children }) => (
  <div className="app">
    { children }
  </div>
)

const App = withRouter(connect()(ConnectedApp));

const Root = ({ store }) => {
    return(

      <Provider store={ store }>
        <HashRouter>
          <App>
            <Route path="/" component={Header} />
            <Route path="/signin" component={SignIn} />

            <Route exact path="/admin" component={MyGym}/>
            <Route path="/admin/edit" component={EditMyGym} />
            <Route path="/admin/account" component={Account} />
            <Route path="/admin/billing" component={Billing} />
            <Route path="/admin/billing-history" component={BillingHistory} />
            <Route path="/admin/classes" component={Classes} />

            <Route exact path="/customer" component={CustomerPage} />
            <Route path="/customer/classes" component={ClassList} />

          </App>
        </HashRouter>
      </Provider>
    )
}


export default Root;
