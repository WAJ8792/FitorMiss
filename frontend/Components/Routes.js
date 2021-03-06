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
import ReservationList from './Customers/ClassesList/ClassesList';
import CustomerAccounts from './Customers/Accounts/Accounts';
import CustomerBilling from './Customers/Accounts/Billing';

//FoM Admin
import CreateVendor from './containers/manager_container';
import EditVendor from './containers/edit_container';

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

            <Route path="/customer/classes" component={CustomerPage} />
            <Route exact path="/customer" component={ReservationList} />
            <Route path="/customer/account" component={CustomerAccounts} />
            <StripeProvider apiKey="pk_live_yyxl71DnK3RqAqLv0Ou6KbaS">
              <Route path="/customer/billing" component={CustomerBilling} />
            </StripeProvider>

            <Route path="/createvendor" component={CreateVendor} />

          </App>
        </HashRouter>
      </Provider>
    )
}


export default Root;
