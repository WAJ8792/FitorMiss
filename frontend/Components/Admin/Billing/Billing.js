import React from 'react';

export default class Billing extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      schema: {},
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

  fetchBillingInfo(user) {
    let schema, pricingKey;

    firebase.database().ref('pricing_schemas').orderByChild("vendor_id")
      .equalTo(user).on("value", snap => {
        if (snap.val() != null) {
          pricingKey = Object.keys(snap.toJSON())[0];
          schema = snap.val()[pricingKey];
          this.setState({schema, pricingKey});
        }
      })
  }

  render() {
    let loading;
    let schema = this.state.schema;

    if (this.state.user === "") {
      loading = <p style={{color: 'red'}}>Retrieving your Billing info...</p>
    } else {
      loading = null;
     }


    return(
      <div>
        <h2>Billing</h2>
        {loading}
        <h3>Your plan:</h3>
        <ul>
          <li>Tier 1 (1 hours): {schema.tier1} off</li>
          <li>Tier 2 (2 hours): {schema.tier2} off</li>
          <li>Tier 3 (3 hours): {schema.tier3} off</li>
        </ul>
      </div>
    )
  }
}
