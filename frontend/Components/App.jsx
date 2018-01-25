import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link, Redirect } from 'react-router-dom';

import Sidebar from './admin/Sidebar';
import SignIn from './containers/Sessions_Container';
import Header from './Headers/Headers';

const ConnectedApp = ({ children }) => (
  <Header children={children} />
)

export const App = withRouter(connect()(ConnectedApp));
