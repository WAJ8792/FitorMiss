import React from 'react';

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
      addressKey: false,
      email: "",
      phone: "",
    }
    this.createAddress = this.createAddress.bind(this);
    this.editAddress = this.editAddress.bind(this);
    this.editUserInfo = this.editUserInfo.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  resetPassword() {
    firebase.auth().sendPasswordResetEmail(this.state.userInfo.email).then( () => {
      console.log("Email sent");
    }).catch(function(error) {
      console.log(error);
    });
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

  handleSubmit() {
    if (this.state.addressKey) {
      this.editAddress();
    } else { this.createAddress(); }
    this.editUserInfo();
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
      <div id="page-background">
      <div className="page-container">
        <div className="vendor-edit-account">
          <p className="vendor-edit-account-header">Edit Account</p>
          {loading}

          <section>
            <div className="vendor-account-info">
              <p className="vendor-account-text">Billing Address</p>
              <p>Street Address</p>
              <input type="text"
              onChange={e => this.handleAddressChange(e, "street")}
              value={address.street} />
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
              <p className="vendor-account-text">Email</p>
              <p className="vendor-account-subtext">This is not necessarily the email used to login</p>
              <input type="text"
              onChange={this.handleChange("email")}
              value={this.state.email}/>

              <p className="vendor-account-text">Phone</p>
              <input type="text"
              onChange={this.handleChange("phone")}
              value={this.state.phone}/>
            </div>

            <button
              className="vendor-reset-password"
              onClick={this.resetPassword.bind(this)}>
              Reset Password
            </button>
          </section>
          <button
            className="vendor-submit-button"
            onClick={() => submitAddress()}>
            Submit
          </button>

          </div>
        </div>
      </div>
    );
  }
}
