import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default class ManageAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedOut: false
    }
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logout({
        uid: 'ZXIWqUSTpPSd6BTVUu3kf0Rbqhf1',
        email: 'fitormissco@gmail.com'
      }, app);
    this.setState({loggedOut: true});
  }

  render() {
    if (this.state.loggedOut) { return <Redirect to="/signin" /> }

    return (
      <div>
        <span>
          <div onClick={this.logout}>logout</div>
        </span>
        <h1>Create a new vendor</h1>
      </div>
    )
  }
}
