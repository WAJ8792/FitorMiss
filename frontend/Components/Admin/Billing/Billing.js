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
        this.fetchBillingInfo(user.uid);
      }
    });
  }

  fetchBillingInfo() {

  }

  render() {
    let loading;

    if (this.state.user === "") {
      loading = <p style={{color: 'red'}}>Retrieving your Billing info...</p>
    } else { loading = null }

    return(
      <div>
        <h2>Billing</h2>
        {loading}
        <h3>Your plan:</h3>

      </div>
    )
  }
}
