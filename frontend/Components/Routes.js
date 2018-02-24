import React from 'react';
import { Provider, connect } from 'react-redux';
import { Switch, HashRouter, Route, Redirect, withRouter,
  IndexRoute, BrowserRouter, hashHistory } from 'react-router-dom';

import {StripeProvider} from 'react-stripe-elements';

import { configureStore } from '../store';
import { ProtectedRoute } from '../util/root_util';

import Header from './Headers';
import SignIn from './containers/Sessions_Container';

// Admin
import MyGym from './Admin/MyGym/MyGym';
import EditMyGym from './containers/editGymContainer';
import Account from './containers/Accounts_container';
import Classes from './containers/classes_container';

// Customer
import CustomerPage from './Customers/HomePage/Customer';
import ClassList from './Customers/ClassesList/ClassesList';
import CustomerAccounts from './Customers/Accounts/Accounts';

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
            <Route path="/admin/classes" component={Classes} />

            <Route exact path="/customer" component={ClassList} />
            <Route path="/customer/classes" component={CustomerPage} />
            <StripeProvider apiKey="pk_test_MAnzzDoroKej8r9QoAEGEjjl">
              <Route path="/customer/account" component={CustomerAccounts} />
            </StripeProvider>

          </App>
        </HashRouter>
      </Provider>
    )
}


export default Root;
