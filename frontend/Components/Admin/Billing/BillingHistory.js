import React from 'react';

export default class Billing extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      stuff: [],
    }
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchBillingHistory(user.uid);
      }
    });
  }

  fetchBillingHistory() {

  }

  render() {
    let loading;

    if (this.state.user === "") {
      loading = <p style={{color: 'red'}}>Retrieving your billing history...</p>
    } else { loading = null }

    return(
      <div className="page-container">
        <h2>Billing</h2>
        {loading}
        <p>Billing history will be listed here</p>
      </div>
    )
  }
}
