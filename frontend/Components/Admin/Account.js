import React from 'react';

import CC from './CC_Info';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      address: {
        street: "",
        city: "",
        state: "",
      },
      cc: {
        name: "",
        number: "",
        exp: "",
        cvv: "",
      },
      addressKey: false,
      email: "",
    }
    this.createAddress = this.createAddress.bind(this);
    this.editAddress = this.editAddress.bind(this);
    this.editUserInfo = this.editUserInfo.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchAccountInfo(user.uid);
      }
    });
  }

  fetchAccountInfo(user) {
    let newAddress;

    firebase.database().ref('address').orderByChild("vendor_id")
      .equalTo(user).on("value", snap => {
        let addressKey = Object.keys(snap.toJSON())[0];
        let info = snap.val()[addressKey];
        newAddress = {
          vendor_id: info.vendor_id,
          street: info.street,
          city: info.city,
          state: info.state,
        }
        this.setState({address: newAddress, addressKey});
      });
    firebase.database().ref('vendor').orderByKey().equalTo(user).on('value', snap =>{
      this.setState({email: snap.val()[user].email});
    })
    firebase.database().ref('card').orderByChild("vendor_id")
      .equalTo(user).on('value', snap => {
        if (snap.val() != null) {
          let ccKey = Object.keys(snap.toJSON())[0];
          let cc = snap.val()[ccKey];
          this.setState({cc, ccKey});
        }
    })
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value});
  }

  handleAddressChange(e, field) {
    e.preventDefault();

    let address = this.state.address;
    address[field] = e.target.value;
    this.setState({address});
  }

  handleCardChange(e, field) {
    e.preventDefault();

    let cc = this.state.cc;
    cc[field] = e.target.value;
    this.setState({cc});
  }

  handleSubmit() {
    if (this.state.addressKey) {
      this.editAddress();
    } else { this.createAddress(); }
    this.editUserInfo();
  }

  submitCC() {
    if (this.state.ccKey) {
      this.editCC();
    } else { this.addCC(); }
  }

  editCC() {
    firebase.database().ref('card/' + this.state.ccKey)
      .set(this.state.cc);
  }

  addCC() {
    let cc = this.state.cc;
    cc.vendor_id = this.state.user;
    firebase.database().ref('card/').push().set(cc);
  }

  editAddress() {
    firebase.database().ref('address/' + this.state.addressKey)
      .set(this.state.address);
  }

  createAddress() {
    let info = this.state.address;
    let address = {
      street: info.street, city: info.city, state: info.state, vendor_id: this.state.user,
    };
    firebase.database().ref('address/').push().set(address);
  }

  editUserInfo() {
    firebase.database().ref('vendor/' + this.state.user + "/email")
      .set(this.state.email);
  }

  render() {
    let address = this.state.address;
    let cc = this.state.cc;
    let submitAddress = this.handleSubmit.bind(this);
    let loading;

    if (this.state.user === "") {
      loading = <p style={{color: 'red'}}>Retrieving your accounnt info...</p>
    } else { loading = null }

    return(
      <div className="account">
        <h2>Edit Account</h2>
        {loading}
        <section>

          <div>
            <h3>Billing Adress</h3>
            <p>Street Address</p>
            <input type="text"
              onChange={e => this.handleAddressChange(e, "street")}
              value={address.street}/>
            <p>City</p>
            <input type="text"
              onChange={e => this.handleAddressChange(e, "city")}
              value={address.city}/>
            <p>State</p>
            <input type="text"
              onChange={e => this.handleAddressChange(e, "state")}
              value={address.state}/>

          </div>

          <div>
            <h3>Email</h3>
            <p>This is not necessarily the email used for login</p>
            <input type="text"
              onChange={this.handleChange("email")}
              value={this.state.email}/>

          </div>

        </section>
        <button onClick={() => submitAddress()} style={{float: 'right'}}>Submit</button>

        <div className="cc-info">
          <h3>Credit Card information</h3>
            <div>
              <p>Name on Card</p>
              <input
                onChange={(e) => this.handleCardChange(e, "name")}
                type="text"
                value={cc.name} />

              <p>Card Number</p>
              <input
                onChange={(e) => this.handleCardChange(e, "number")}
                type="password"
                value={cc.number} />

              <section>
                <p>Exp. date</p>
                <input
                  onChange={(e) => this.handleCardChange(e, "exp")}
                  type="month"
                  value={cc.exp} />

                <p>cvv</p>
                <input
                  onChange={(e) => this.handleCardChange(e, "cvv")}
                  type="password"
                  value={cc.cvv} />
              </section>
              <button onClick={() => this.submitCC()} style={{float: 'right'}}>Update Card Info</button>

            </div>
        </div>

      </div>
    )
  }
}
